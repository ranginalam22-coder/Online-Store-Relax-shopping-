require("dotenv").config();

const bcrypt = require("bcryptjs");
const crypto = require("node:crypto");
const express = require("express");
const mysql = require("mysql2/promise");
const path = require("node:path");

const app = express();
const port = Number(process.env.PORT || 3000);
const host = "127.0.0.1";
const adminUsername = process.env.ADMIN_USERNAME;
const adminPassword = process.env.ADMIN_PASSWORD;
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST || "127.0.0.1",
  port: Number(process.env.MYSQL_PORT || 3306),
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE || "urbanstyle_shop",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

const catalog = new Map([
  ["city-layers-tee", { name: "City Layers Tee", category: "Clothing", price: 42 }],
  ["off-duty-overshirt", { name: "Off-Duty Overshirt", category: "Clothing", price: 88 }],
  ["after-hours-cap", { name: "After Hours Cap", category: "Accessories", price: 32 }],
  ["weekend-cargo", { name: "Weekend Cargo", category: "Clothing", price: 96 }],
  ["everywhere-tote", { name: "Everywhere Tote", category: "Accessories", price: 28 }],
  ["downtown-knit", { name: "Downtown Knit", category: "Clothing", price: 74 }],
  ["daytrip-denim-jacket", { name: "Daytrip Denim Jacket", category: "Clothing", price: 108 }],
  ["boxy-poplin-shirt", { name: "Boxy Poplin Shirt", category: "Clothing", price: 68 }],
  ["everyday-wide-leg-jeans", { name: "Everyday Wide-Leg Jeans", category: "Clothing", price: 92 }],
  ["slow-morning-sweatshirt", { name: "Slow Morning Sweatshirt", category: "Clothing", price: 78 }],
  ["city-lights-slip-dress", { name: "City Lights Slip Dress", category: "Clothing", price: 84 }],
  ["off-the-clock-shorts", { name: "Off-the-Clock Shorts", category: "Clothing", price: 54 }],
]);

const paymentMethods = new Map([
  ["Cash on delivery", { method: "cash_on_delivery", provider: null }],
  ["Credit/debit card (demo)", { method: "credit_card", provider: null }],
  ["PayPal (demo)", { method: "paypal", provider: null }],
  ["Bank transfer (manual demo)", { method: "online_gateway", provider: "Manual bank transfer (not configured)" }],
  ["Mobile money (manual demo)", { method: "online_gateway", provider: "Mobile money (not configured)" }],
]);

app.use(express.json({ limit: "20kb" }));

function sendError(response, status, message) {
  response.status(status).json({ error: message });
}

function constantTimeEqual(left, right) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  return leftBuffer.length === rightBuffer.length && crypto.timingSafeEqual(leftBuffer, rightBuffer);
}

function requireAdmin(request, response, next) {
  const authorization = request.get("authorization") || "";
  const match = authorization.match(/^Basic\s+([A-Za-z0-9+/]+={0,2})$/i);
  if (!match) {
    response.set("WWW-Authenticate", 'Basic realm="Urbanstyle orders", charset="UTF-8"');
    return sendError(response, 401, "Administrator sign-in is required.");
  }

  let credentials;
  try {
    credentials = Buffer.from(match[1], "base64").toString("utf8");
  } catch {
    response.set("WWW-Authenticate", 'Basic realm="Urbanstyle orders", charset="UTF-8"');
    return sendError(response, 401, "Administrator sign-in is required.");
  }

  const separator = credentials.indexOf(":");
  const username = separator < 0 ? "" : credentials.slice(0, separator);
  const password = separator < 0 ? "" : credentials.slice(separator + 1);
  if (!constantTimeEqual(username, adminUsername) || !constantTimeEqual(password, adminPassword)) {
    response.set("WWW-Authenticate", 'Basic realm="Urbanstyle orders", charset="UTF-8"');
    return sendError(response, 401, "Administrator sign-in is required.");
  }
  next();
}

function validateCheckout(body) {
  if (!body || typeof body !== "object" || Array.isArray(body)) return "Invalid checkout data.";
  const customer = body.customer;
  if (!customer || typeof customer !== "object") return "Enter your delivery details.";
  if (typeof customer.name !== "string" || customer.name.trim().length < 2 || customer.name.length > 160) {
    return "Enter a valid full name.";
  }
  if (typeof customer.email !== "string" || customer.email.length > 254 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email.trim())) {
    return "Enter a valid email address.";
  }
  if (typeof customer.phone !== "string" || customer.phone.trim().length < 5 || customer.phone.length > 32) {
    return "Enter a valid phone number.";
  }
  if (typeof customer.address !== "string" || customer.address.trim().length < 4 || customer.address.length > 200) {
    return "Enter a valid delivery address.";
  }
  if (typeof customer.city !== "string" || customer.city.trim().length < 2 || customer.city.length > 100) {
    return "Enter a valid city.";
  }
  if (typeof customer.country !== "string" || !/^[A-Za-z]{2}$/.test(customer.country.trim())) {
    return "Enter a two-letter country code, such as US.";
  }
  if (typeof customer.postalCode !== "string" ||
      customer.postalCode.trim().length < 2 || customer.postalCode.length > 24) {
    return "Enter a valid postal code.";
  }
  if (!paymentMethods.has(body.payment)) return "Choose a supported payment method.";
  if (!Array.isArray(body.items) || body.items.length < 1 || body.items.length > 30) {
    return "Your bag is empty or contains too many items.";
  }
  if (body.items.some((item) =>
    !item || typeof item.id !== "string" || !catalog.has(item.id) ||
    !Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 25 ||
    (item.size !== undefined && (typeof item.size !== "string" || item.size.length > 20)) ||
    (item.color !== undefined && (typeof item.color !== "string" || !/^#[0-9a-f]{6}$/i.test(item.color)))
  )) {
    return "Your bag contains an invalid product or quantity. Refresh the page and try again.";
  }
  if (body.coupon !== null && body.coupon !== undefined &&
      !["STYLE10", "WELCOME15"].includes(body.coupon)) {
    return "That discount code is not valid.";
  }
  return null;
}

async function seedCatalog() {
  for (const [sku, product] of catalog) {
    await pool.execute(
      `INSERT INTO products (sku, name, category, price, currency, stock_quantity, is_active)
       VALUES (?, ?, ?, ?, 'USD', 24, TRUE)
       ON DUPLICATE KEY UPDATE
         name = VALUES(name), category = VALUES(category), price = VALUES(price), is_active = TRUE`,
      [sku, product.name, product.category, product.price],
    );
  }
}

app.post("/api/orders", async (request, response) => {
  const validationError = validateCheckout(request.body);
  if (validationError) return sendError(response, 400, validationError);

  const customer = request.body.customer;
  const email = customer.email.trim().toLowerCase();
  const name = customer.name.trim();
  const phone = customer.phone.trim();
  const countryCode = customer.country.trim().toUpperCase();
  const city = customer.city.trim();
  const address = customer.address.trim();
  const postalCode = customer.postalCode.trim();
  const quantities = new Map();
  for (const item of request.body.items) {
    quantities.set(item.id, (quantities.get(item.id) || 0) + item.quantity);
  }
  if ([...quantities.values()].some((quantity) => quantity > 25)) {
    return sendError(response, 400, "A product quantity cannot exceed 25.");
  }

  const items = [...quantities].map(([sku, quantity]) => ({
    sku,
    quantity,
    product: catalog.get(sku),
    variants: request.body.items
      .filter((item) => item.id === sku)
      .map((item) => [item.size, item.color ? `Color ${item.color}` : null].filter(Boolean).join(" / "))
      .filter(Boolean),
  }));
  const subtotalCents = items.reduce(
    (sum, item) => sum + Math.round(item.product.price * 100) * item.quantity, 0,
  );
  const discountCents = request.body.coupon === "STYLE10"
    ? Math.round(subtotalCents * 0.10)
    : request.body.coupon === "WELCOME15" ? Math.round(subtotalCents * 0.15) : 0;
  const shippingCents = subtotalCents === 0 || subtotalCents >= 10000 ? 0 : 800;
  const totalCents = subtotalCents - discountCents + shippingCents;
  let connection;
  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();

    const [existingCustomers] = await connection.execute(
      "SELECT customer_id FROM customers WHERE email = ? LIMIT 1 FOR UPDATE",
      [email],
    );
    let customerId;
    if (existingCustomers.length) {
      customerId = existingCustomers[0].customer_id;
    } else {
      const generatedPasswordHash = await bcrypt.hash(crypto.randomBytes(32).toString("hex"), 12);
      const [customerResult] = await connection.execute(
        `INSERT INTO customers (full_name, email, phone_number, password_hash, account_status)
         VALUES (?, ?, ?, ?, 'pending_verification')`,
        [name, email, phone, generatedPasswordHash],
      );
      customerId = customerResult.insertId;
    }

    await connection.execute(
      `INSERT INTO customer_addresses
       (customer_id, full_name, phone_number, country_code, city, address_line1, postal_code, is_default)
       VALUES (?, ?, ?, ?, ?, ?, ?, FALSE)`,
      [customerId, name, phone, countryCode, city, address, postalCode],
    );
    const [orderResult] = await connection.execute(
      `INSERT INTO orders
       (customer_id, order_status, currency, subtotal_amount, shipping_fee, tax_amount,
        discount_amount, total_amount, shipping_name, shipping_phone, shipping_country_code,
        shipping_city, shipping_address_line1, shipping_postal_code)
       VALUES (?, 'pending', 'USD', ?, ?, 0, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        customerId,
        (subtotalCents / 100).toFixed(2),
        (shippingCents / 100).toFixed(2),
        (discountCents / 100).toFixed(2),
        (totalCents / 100).toFixed(2),
        name, phone, countryCode, city, address, postalCode,
      ],
    );
    for (const item of items) {
      const [productRows] = await connection.execute(
        "SELECT product_id FROM products WHERE sku = ? AND is_active = TRUE LIMIT 1",
        [item.sku],
      );
      if (!productRows.length) throw new Error(`Catalog product ${item.sku} is missing from MySQL.`);
      const title = `${item.product.name}${item.variants.length ? ` (${item.variants.join(", ")})` : ""}`.slice(0, 180);
      const unitPrice = item.product.price.toFixed(2);
      await connection.execute(
        `INSERT INTO order_items
         (order_id, product_id, product_sku, product_name, quantity, unit_price, line_total)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          orderResult.insertId,
          productRows[0].product_id,
          item.sku,
          title,
          item.quantity,
          unitPrice,
          (item.product.price * item.quantity).toFixed(2),
        ],
      );
    }
    const selectedPayment = paymentMethods.get(request.body.payment);
    await connection.execute(
      `INSERT INTO payments
       (order_id, customer_id, payment_method, payment_status, provider_name, currency, amount)
       VALUES (?, ?, ?, 'pending', ?, 'USD', ?)`,
      [
        orderResult.insertId,
        customerId,
        selectedPayment.method,
        selectedPayment.provider,
        (totalCents / 100).toFixed(2),
      ],
    );
    await connection.commit();
    response.status(201).json({
      orderNumber: `US-${String(orderResult.insertId).padStart(7, "0")}`,
      total: totalCents / 100,
      status: "pending",
      paymentStatus: "pending",
    });
  } catch (error) {
    if (connection) {
      try {
        await connection.rollback();
      } catch (rollbackError) {
        console.error("Could not roll back checkout transaction:", rollbackError);
      }
    }
    console.error("Could not save checkout order:", error);
    sendError(response, 500, "We could not save your order. Please try again or contact the shop.");
  } finally {
    if (connection) connection.release();
  }
});

app.get("/orders.html", requireAdmin, (request, response) => {
  response.sendFile(path.join(__dirname, "orders.html"));
});

app.get("/api/admin/orders", requireAdmin, async (request, response) => {
  try {
    const [summaryRows] = await pool.execute(
      `SELECT
         (SELECT COUNT(*) FROM customers) AS total_customers,
         (SELECT COUNT(*) FROM orders) AS total_orders,
         (SELECT COUNT(*) FROM payments) AS total_payments,
         (SELECT COUNT(*) FROM transactions) AS total_transactions,
         (SELECT COUNT(*) FROM payments WHERE payment_status = 'pending') AS pending_payments,
         (SELECT COUNT(*) FROM payments WHERE payment_status = 'completed') AS completed_payments,
         (SELECT COUNT(*) FROM payments WHERE payment_status = 'failed') AS failed_payments,
         (SELECT COUNT(*) FROM payments WHERE payment_status = 'refunded') AS refunded_payments,
         (SELECT COALESCE(SUM(amount), 0) FROM payments
           WHERE payment_status IN ('completed', 'partially_refunded', 'refunded')) AS gross_revenue,
         (SELECT COALESCE(SUM(amount), 0) FROM refunds
           WHERE refund_status = 'completed') AS refunds_total`,
    );
    const [orderRows] = await pool.execute(
      `SELECT o.order_id, o.placed_at, o.order_status, o.currency, o.subtotal_amount,
              o.shipping_fee, o.tax_amount, o.discount_amount, o.total_amount,
              o.shipping_name, o.shipping_phone, o.shipping_country_code, o.shipping_city,
              o.shipping_address_line1, o.shipping_postal_code,
              c.email, p.payment_method, p.payment_status, p.provider_name
       FROM orders AS o
       JOIN customers AS c ON c.customer_id = o.customer_id
       LEFT JOIN payments AS p ON p.order_id = o.order_id
       ORDER BY o.placed_at DESC
       LIMIT 200`,
    );
    const orderIds = orderRows.map((order) => order.order_id);
    const itemsByOrder = new Map();
    if (orderIds.length) {
      const [itemRows] = await pool.query(
        `SELECT order_id, product_name, quantity, unit_price, line_total
         FROM order_items WHERE order_id IN (?) ORDER BY order_item_id`,
        [orderIds],
      );
      for (const item of itemRows) {
        const orderItems = itemsByOrder.get(item.order_id) || [];
        orderItems.push(item);
        itemsByOrder.set(item.order_id, orderItems);
      }
    }
    response.json({
      summary: {
        ...summaryRows[0],
        net_revenue: Number(summaryRows[0].gross_revenue) - Number(summaryRows[0].refunds_total),
      },
      orders: orderRows.map((order) => ({
        ...order,
        order_number: `US-${String(order.order_id).padStart(7, "0")}`,
        items: itemsByOrder.get(order.order_id) || [],
      })),
    });
  } catch (error) {
    console.error("Could not load administrator orders:", error);
    sendError(response, 500, "Could not load order information from MySQL.");
  }
});

app.use(express.static(__dirname, { dotfiles: "deny" }));

async function start() {
  if (!process.env.MYSQL_USER || !process.env.MYSQL_PASSWORD) {
    throw new Error("Set MYSQL_USER and MYSQL_PASSWORD in your .env file.");
  }
  if (!adminUsername || !adminPassword || adminPassword.length < 16) {
    throw new Error("Set ADMIN_USERNAME and an ADMIN_PASSWORD of at least 16 characters in .env.");
  }
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error("PORT must be a valid TCP port.");
  }
  await pool.query("SELECT 1");
  await seedCatalog();
  app.listen(port, host, () => {
    console.log(`Urbanstyle shop running at http://${host}:${port}`);
    console.log(`Administrator orders page: http://${host}:${port}/orders.html`);
  });
}

start().catch((error) => {
  console.error("Could not start Urbanstyle shop:", error.message);
  process.exitCode = 1;
});
