const money = (amount, currency = "USD") => new Intl.NumberFormat(undefined, {
  style: "currency",
  currency,
}).format(Number(amount) || 0);

const escapeHTML = (value) => String(value ?? "").replace(/[&<>"']/g, (character) => ({
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
})[character]);

function renderDashboard(data) {
  const summary = data.summary;
  const stats = [
    ["Net revenue", money(summary.net_revenue)],
    ["Gross received", money(summary.gross_revenue)],
    ["Refunds issued", money(summary.refunds_total)],
    ["Total orders", summary.total_orders],
    ["Total customers", summary.total_customers],
    ["Total payments", summary.total_payments],
    ["Transactions", summary.total_transactions],
    ["Pending payments", summary.pending_payments],
    ["Completed payments", summary.completed_payments],
    ["Failed payments", summary.failed_payments],
    ["Refunded payments", summary.refunded_payments],
  ];
  document.querySelector("#orders-stats").innerHTML = stats.map(([label, value]) =>
    `<article class="orders-stat"><span>${escapeHTML(label)}</span><strong>${escapeHTML(value)}</strong></article>`
  ).join("");

  const list = document.querySelector("#orders-list");
  if (!data.orders.length) {
    list.innerHTML = '<p class="orders-empty">No orders have been placed yet. Completed checkouts will appear here.</p>';
    return;
  }
  list.innerHTML = data.orders.map((order) => {
    const address = [
      order.shipping_address_line1,
      order.shipping_city,
      order.shipping_postal_code,
      order.shipping_country_code,
    ].filter(Boolean).join(", ");
    const itemMarkup = order.items.map((item) =>
      `<li>${escapeHTML(item.product_name)} × ${escapeHTML(item.quantity)} — ${money(item.line_total, order.currency)}</li>`
    ).join("");
    const date = new Date(order.placed_at).toLocaleString();
    return `<article class="order-card">
      <div class="order-card-header">
        <div><strong>${escapeHTML(order.order_number)}</strong><time>${escapeHTML(date)}</time></div>
        <div class="order-badges">
          <span class="order-badge ${escapeHTML(order.order_status)}">Order: ${escapeHTML(order.order_status)}</span>
          <span class="order-badge ${escapeHTML(order.payment_status || "pending")}">Payment: ${escapeHTML(order.payment_status || "pending")}</span>
        </div>
      </div>
      <div class="order-details">
        <section><h3>Customer &amp; delivery</h3>
          <p>${escapeHTML(order.shipping_name)}</p><p>${escapeHTML(order.email)}</p>
          <p>${escapeHTML(order.shipping_phone)}</p><p>${escapeHTML(address)}</p>
        </section>
        <section><h3>Items</h3><ul>${itemMarkup}</ul></section>
        <section><h3>Payment</h3>
          <p>Method: ${escapeHTML(order.provider_name || (order.payment_method || "unknown").replaceAll("_", " "))}</p>
          <p>Subtotal: ${money(order.subtotal_amount, order.currency)}</p>
          <p>Shipping: ${money(order.shipping_fee, order.currency)}</p>
          <p>Tax: ${money(order.tax_amount, order.currency)}</p>
          <p>Discount: ${money(order.discount_amount, order.currency)}</p>
          <p class="order-total">Total: ${money(order.total_amount, order.currency)}</p>
        </section>
      </div>
    </article>`;
  }).join("");
}

async function loadOrders() {
  const message = document.querySelector("#orders-message");
  const refresh = document.querySelector("#refresh-orders");
  refresh.disabled = true;
  message.classList.remove("error");
  message.textContent = "Loading orders from MySQL…";
  try {
    const response = await fetch("/api/admin/orders", { headers: { Accept: "application/json" } });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Could not load order information.");
    renderDashboard(data);
    message.textContent = `Showing ${data.orders.length} recent order${data.orders.length === 1 ? "" : "s"} from your MySQL database.`;
  } catch (error) {
    message.classList.add("error");
    message.textContent = error.message || "Could not load order information.";
  } finally {
    refresh.disabled = false;
  }
}

document.querySelector("#refresh-orders").addEventListener("click", loadOrders);
loadOrders();
