const products = [
  { id: "city-layers-tee", name: "City Layers Tee", detail: "Heavyweight organic cotton", category: "Clothing", price: 42, badge: "Bestseller", colors: ["#d9d2c4", "#262722", "#b3b0a7"], image: "https://images.unsplash.com/photo-1523398002811-999ca8dec234?auto=format&fit=crop&w=800&q=80", alt: "Relaxed neutral streetwear T-shirt", popularity: 98, added: 12 },
  { id: "off-duty-overshirt", name: "Off-Duty Overshirt", detail: "Soft cotton twill · relaxed fit", category: "Clothing", price: 88, badge: "New in", colors: ["#c2b9a7", "#3b493c"], image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=800&q=80", alt: "Everyday overshirt styled for the city", popularity: 86, added: 11 },
  { id: "after-hours-cap", name: "After Hours Cap", detail: "Washed cotton · adjustable", category: "Accessories", price: 32, badge: "", colors: ["#30332d", "#b7a48b", "#af583f"], image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=800&q=80", alt: "Classic cap in a warm neutral color", popularity: 72, added: 8 },
  { id: "weekend-cargo", name: "Weekend Cargo", detail: "Easy utility · just-right volume", category: "Clothing", price: 96, badge: "Just dropped", colors: ["#8b8b72", "#c5b99f"], image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80", alt: "Relaxed city outfit with utility-inspired styling", popularity: 89, added: 10 },
  { id: "everywhere-tote", name: "Everywhere Tote", detail: "Room for all of it · 100% cotton", category: "Accessories", price: 28, badge: "", colors: ["#dfd7c6", "#41453a"], image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80", alt: "Everyday canvas tote bag", popularity: 93, added: 7 },
  { id: "downtown-knit", name: "Downtown Knit", detail: "The soft one · responsibly made", category: "Clothing", price: 74, badge: "New in", colors: ["#d0c7b5", "#9d705e", "#353831"], image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=800&q=80", alt: "Soft knitwear in a neutral shade", popularity: 81, added: 9 },
  { id: "daytrip-denim-jacket", name: "Daytrip Denim Jacket", detail: "Vintage-wash denim · easy layer", category: "Clothing", price: 108, badge: "New in", colors: ["#647385", "#343a3d"], image: "https://images.unsplash.com/photo-1543076447-215ad9ba6923?auto=format&fit=crop&w=800&q=80", alt: "Classic blue denim jacket", popularity: 78, added: 6 },
  { id: "boxy-poplin-shirt", name: "Boxy Poplin Shirt", detail: "Crisp cotton · borrowed-from-the-boys fit", category: "Clothing", price: 68, badge: "", colors: ["#e6e2d9", "#a9b5b1", "#39434a"], image: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=800&q=80", alt: "Relaxed white button-up shirt", popularity: 75, added: 5 },
  { id: "everyday-wide-leg-jeans", name: "Everyday Wide-Leg Jeans", detail: "Soft structured denim · high rise", category: "Clothing", price: 92, badge: "", colors: ["#586a7d", "#282d31"], image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80", alt: "Wide-leg blue jeans", popularity: 88, added: 4 },
  { id: "slow-morning-sweatshirt", name: "Slow Morning Sweatshirt", detail: "Brushed-back fleece · extra cozy", category: "Clothing", price: 78, badge: "New in", colors: ["#d0c8ba", "#788276", "#353831"], image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=800&q=80", alt: "Comfortable neutral crewneck sweatshirt", popularity: 91, added: 3 },
  { id: "city-lights-slip-dress", name: "City Lights Slip Dress", detail: "Fluid drape · day-to-night favorite", category: "Clothing", price: 84, badge: "New in", colors: ["#35332f", "#9d735f"], image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=800&q=80", alt: "Minimal black slip dress", popularity: 69, added: 2 },
  { id: "off-the-clock-shorts", name: "Off-the-Clock Shorts", detail: "Easy cotton twill · pull-on waist", category: "Clothing", price: 54, badge: "", colors: ["#d0c4ae", "#69735f", "#373932"], image: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&w=800&q=80", alt: "Relaxed casual shorts", popularity: 65, added: 1 },
];

const STORAGE = {
  cart: "urbanstyle-cart",
  wishlist: "urbanstyle-wishlist",
  reviews: "urbanstyle-reviews",
  orders: "urbanstyle-orders",
  profile: "urbanstyle-profile",
  coupon: "urbanstyle-coupon",
  inventory: "urbanstyle-inventory",
  newsletter: "urbanstyle-newsletter",
};
const productGrid = document.querySelector(".product-grid");
const emptyState = document.querySelector(".empty-state");
const filterButtons = [...document.querySelectorAll(".filter-button")];
const searchPanel = document.querySelector(".search-panel");
const searchInput = document.querySelector("#product-search");
const cartDrawer = document.querySelector(".cart-drawer");
const backdrop = document.querySelector(".drawer-backdrop");
const toast = document.querySelector(".toast");
const modalRoot = document.createElement("div");
modalRoot.id = "modal-root";
document.body.append(modalRoot);
const money = (amount) => `$${amount.toFixed(2)}`;
let activeFilter = "All";
let searchTerm = "";
let toastTimeout;

function readStorage(key, fallback, validate = Array.isArray) {
  try {
    const stored = JSON.parse(localStorage.getItem(key) || "null");
    return validate(stored) ? stored : fallback;
  } catch (error) {
    if (error instanceof SyntaxError) {
      localStorage.removeItem(key);
      return fallback;
    }
    throw error;
  }
}

let cart = readStorage(STORAGE.cart, []);
let wishlist = readStorage(STORAGE.wishlist, []);
let reviews = readStorage(STORAGE.reviews, {}, (value) => value !== null && typeof value === "object" && !Array.isArray(value));
reviews = Object.fromEntries(Object.entries(reviews).map(([id, entries]) => [
  id,
  Array.isArray(entries) ? entries.filter((review) =>
    review && typeof review.name === "string" && typeof review.text === "string" &&
    Number.isInteger(review.rating) && review.rating >= 1 && review.rating <= 5
  ) : [],
]));
let orders = readStorage(STORAGE.orders, []).filter((order) =>
  order && typeof order.id === "string" && typeof order.name === "string" &&
  typeof order.email === "string" && typeof order.date === "string" &&
  typeof order.status === "string" && Number.isFinite(order.total)
);
let profile = readStorage(STORAGE.profile, null, (value) => value === null || (typeof value === "object" && typeof value.email === "string"));
let coupon = readStorage(STORAGE.coupon, null, (value) => value === null || value === "STYLE10" || value === "WELCOME15");
let inventory = readStorage(STORAGE.inventory, {}, (value) => value !== null && typeof value === "object" && !Array.isArray(value));
let priceOverrides = readStorage("urbanstyle-price-overrides", {}, (value) => value !== null && typeof value === "object" && !Array.isArray(value));
let categoryOverrides = readStorage("urbanstyle-category-overrides", {}, (value) => value !== null && typeof value === "object" && !Array.isArray(value));
const deletedProductIds = readStorage("urbanstyle-deleted-products", []).filter((id) => typeof id === "string");
products.forEach((product) => {
  if (Number.isFinite(priceOverrides[product.id]) && priceOverrides[product.id] > 0) {
    product.price = priceOverrides[product.id];
  }
  if (["Clothing", "Accessories"].includes(categoryOverrides[product.id])) {
    product.category = categoryOverrides[product.id];
  }
});
for (let index = products.length - 1; index >= 0; index -= 1) {
  if (deletedProductIds.includes(products[index].id)) products.splice(index, 1);
}
const customProducts = readStorage("urbanstyle-custom-products", []).filter((product) =>
  product && typeof product.id === "string" && typeof product.name === "string" &&
  typeof product.detail === "string" && ["Clothing", "Accessories"].includes(product.category) &&
  Number.isFinite(product.price) && product.price > 0 && Array.isArray(product.colors) &&
  product.colors.every((color) => typeof color === "string") &&
  typeof product.image === "string" && product.image.startsWith("https://images.unsplash.com/")
);
products.push(...customProducts.filter((product) => product && typeof product.id === "string" && !products.some((entry) => entry.id === product.id)));
document.querySelector("#product-suggestions").innerHTML = products
  .map((product) => `<option value="${escapeHTML(product.name)}"></option>`)
  .join("");

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[character]);
}

function getStock(product) {
  return Number.isInteger(inventory[product.id]) ? inventory[product.id] : 24;
}

function getProductRating(product) {
  const productReviews = reviews[product.id] || [];
  return productReviews.length
    ? productReviews.reduce((total, review) => total + review.rating, 0) / productReviews.length
    : 0;
}

function renderProducts() {
  const sortBy = document.querySelector("#sort-products").value;
  const priceFilter = document.querySelector("#price-filter").value;
  const sizeFilter = document.querySelector("#size-filter").value;
  const ratingFilter = document.querySelector("#rating-filter").value;
  const inStockOnly = document.querySelector("#stock-filter").checked;
  let visibleProducts = products.filter((product) => {
    const categoryMatches = activeFilter === "All" || activeFilter === "New"
      ? activeFilter !== "New" || product.badge === "New in" || product.badge === "Just dropped"
      : product.category === activeFilter;
    const queryMatches = `${product.name} ${product.detail} ${product.category}`.toLowerCase().includes(searchTerm);
    const priceMatches = priceFilter === "all" ||
      (priceFilter === "under-50" && product.price < 50) ||
      (priceFilter === "50-100" && product.price >= 50 && product.price <= 100) ||
      (priceFilter === "over-100" && product.price > 100);
    const sizeMatches = sizeFilter === "all" || (getStock(product) > 0 && (
      (sizeFilter === "one-size" && product.category === "Accessories") ||
      (product.category === "Clothing" && ["XS", "S", "M", "L", "XL"].includes(sizeFilter))
    ));
    const rating = getProductRating(product);
    const ratingMatches = ratingFilter === "all" || rating >= Number(ratingFilter);
    const stockMatches = !inStockOnly || getStock(product) > 0;
    return categoryMatches && queryMatches && priceMatches && sizeMatches && ratingMatches && stockMatches;
  });
  if (sortBy === "price-low") visibleProducts.sort((a, b) => a.price - b.price);
  if (sortBy === "price-high") visibleProducts.sort((a, b) => b.price - a.price);
  if (sortBy === "name") visibleProducts.sort((a, b) => a.name.localeCompare(b.name));
  if (sortBy === "popular") visibleProducts.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
  if (sortBy === "newest") visibleProducts.sort((a, b) => (b.added || 0) - (a.added || 0));
  if (sortBy === "rating") visibleProducts.sort((a, b) => getProductRating(b) - getProductRating(a));

  productGrid.innerHTML = visibleProducts.map((product) => {
    const rating = getProductRating(product);
    return `
      <article class="product-card" data-product="${escapeHTML(product.id)}">
        <div class="product-image-wrap">
          <button class="product-image-trigger" type="button" data-detail="${escapeHTML(product.id)}" aria-label="View ${escapeHTML(product.name)} details">
            <img class="product-image" src="${escapeHTML(product.image)}" alt="${escapeHTML(product.alt)}" loading="lazy" />
          </button>
          ${product.badge ? `<span class="product-badge">${escapeHTML(product.badge)}</span>` : ""}
          <button class="wishlist-toggle${wishlist.includes(product.id) ? " is-saved" : ""}" type="button" data-wishlist="${escapeHTML(product.id)}" aria-label="${wishlist.includes(product.id) ? "Remove from" : "Add to"} wishlist" aria-pressed="${wishlist.includes(product.id)}">♡</button>
          <button class="quick-add" type="button" data-add="${escapeHTML(product.id)}" aria-label="${product.category === "Clothing" ? "Choose size and color options for" : "Add"} ${escapeHTML(product.name)}${product.category === "Clothing" ? "" : " to bag"}">+</button>
        </div>
        <div class="product-info">
          <div class="product-meta"><h3 class="product-name"><button type="button" data-detail="${escapeHTML(product.id)}">${escapeHTML(product.name)}</button></h3><span class="product-price">${money(product.price)}</span></div>
          <p class="product-detail">${escapeHTML(product.detail)}</p>
          <div class="product-card-rating" aria-label="${rating ? `${rating.toFixed(1)} out of 5 stars` : "No customer ratings yet"}">${rating ? `★★★★★ <span>${rating.toFixed(1)} · ${reviews[product.id].length}</span>` : `<span class="no-rating">No reviews yet</span>`}</div>
          <div class="product-swatches" aria-label="Available colors">${product.colors.map((color) => `<span class="swatch" style="background-color:${escapeHTML(color)}" aria-hidden="true"></span>`).join("")}</div>
        </div>
      </article>`;
  }).join("");
  emptyState.hidden = visibleProducts.length > 0;
  productGrid.hidden = visibleProducts.length === 0;
  document.querySelector(".filter-button[data-filter='All'] span").textContent = products.length;
  document.querySelector(".shop-bottom span:last-child").textContent = `Showing ${visibleProducts.length} of ${products.length}`;
  document.querySelector(".clear-filters").hidden = activeFilter === "All" && !searchTerm &&
    priceFilter === "all" && sizeFilter === "all" && ratingFilter === "all" && !inStockOnly &&
    sortBy === "featured";
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("visible");
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => toast.classList.remove("visible"), 2600);
}

function saveCart() {
  localStorage.setItem(STORAGE.cart, JSON.stringify(cart));
  renderCart();
}

function getCartTotals() {
  const subtotal = cart.reduce((total, item) => {
    const product = products.find((entry) => entry.id === item.id);
    return total + (product ? product.price * item.quantity : 0);
  }, 0);
  const discount = coupon === "STYLE10" ? subtotal * 0.1 : coupon === "WELCOME15" ? subtotal * 0.15 : 0;
  const discountedSubtotal = subtotal - discount;
  const shipping = subtotal === 0 || subtotal >= 100 ? 0 : 8;
  return { subtotal, discount, shipping, total: discountedSubtotal + shipping };
}

function renderCart() {
  cart = cart.filter((item) => {
    return item && products.some((product) => product.id === item.id) &&
      Number.isInteger(item.quantity) && item.quantity > 0 &&
      (item.size === undefined || typeof item.size === "string") &&
      (item.color === undefined || typeof item.color === "string");
  });
  const itemCount = cart.reduce((total, item) => total + item.quantity, 0);
  document.querySelector(".bag-count").textContent = itemCount;
  document.querySelector(".drawer-count").textContent = `(${itemCount})`;
  document.querySelector(".cart-items").innerHTML = cart.map((item) => {
    const product = products.find((entry) => entry.id === item.id);
    return `<article class="cart-item">
      <img src="${escapeHTML(product.image)}" alt="${escapeHTML(product.alt)}" />
      <div><h3 class="cart-item-name">${escapeHTML(product.name)}</h3><p class="cart-item-detail">${money(product.price)}${item.size ? ` · Size ${escapeHTML(item.size)}` : ""}${item.color ? ` · Color ${product.colors.indexOf(item.color) + 1}` : ""}</p>
        <div class="quantity-control" aria-label="Quantity for ${escapeHTML(product.name)}">
        <button type="button" data-quantity="${escapeHTML(product.id)}" data-size="${escapeHTML(item.size || "")}" data-color="${escapeHTML(item.color || "")}" data-change="-1" aria-label="Remove one ${escapeHTML(product.name)}">−</button>
          <span>${item.quantity}</span>
        <button type="button" data-quantity="${escapeHTML(product.id)}" data-size="${escapeHTML(item.size || "")}" data-color="${escapeHTML(item.color || "")}" data-change="1" aria-label="Add one ${escapeHTML(product.name)}">+</button>
        </div>
      </div>
      <div class="cart-item-end"><span>${money(product.price * item.quantity)}</span><button class="remove-item" type="button" data-remove="${escapeHTML(product.id)}" data-size="${escapeHTML(item.size || "")}" data-color="${escapeHTML(item.color || "")}">Remove</button></div>
    </article>`;
  }).join("");
  document.querySelector(".cart-empty").hidden = itemCount > 0;
  document.querySelector(".cart-footer").hidden = itemCount === 0;
  const totals = getCartTotals();
  document.querySelector(".cart-subtotal").textContent = money(totals.subtotal);
  document.querySelector(".cart-discount").hidden = totals.discount === 0;
  document.querySelector(".cart-discount strong").textContent = `−${money(totals.discount)}`;
  document.querySelector(".cart-shipping").textContent = totals.shipping === 0 ? "Free" : money(totals.shipping);
  document.querySelector(".cart-total strong").textContent = money(totals.total);
  document.querySelector(".coupon-applied").textContent = coupon ? `${coupon} applied` : "";
  document.querySelector(".wishlist-count").textContent = wishlist.length;
}

function setCartOpen(open) {
  cartDrawer.classList.toggle("open", open);
  cartDrawer.setAttribute("aria-hidden", String(!open));
  document.body.classList.toggle("drawer-open", open);
  backdrop.hidden = !open;
  if (open) requestAnimationFrame(() => backdrop.classList.add("visible"));
  else backdrop.classList.remove("visible");
  if (open) document.querySelector(".close-drawer").focus();
}

function addToCart(id, size = "", color = "") {
  const product = products.find((entry) => entry.id === id);
  if (!product) return;
  const existing = cart.find((item) => item.id === id && (item.size || "") === size && (item.color || "") === color);
  const quantity = (existing?.quantity || 0) + 1;
  const totalQuantity = cart.filter((item) => item.id === id).reduce((total, item) => total + item.quantity, 0);
  if (totalQuantity >= getStock(product)) {
    showToast("Sorry, that’s all we have in stock.");
    return;
  }
  if (existing) existing.quantity = quantity;
  else cart.push({ id, size, color, quantity: 1 });
  saveCart();
  showToast(`${product.name} added to your bag`);
}

function openModal(content) {
  modalRoot.querySelector("dialog")?.close();
  modalRoot.innerHTML = `<dialog class="store-modal">${content}</dialog>`;
  const dialog = modalRoot.querySelector("dialog");
  dialog.showModal();
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });
  dialog.addEventListener("close", () => {
    if (dialog.parentElement === modalRoot) modalRoot.innerHTML = "";
  });
}

function modalHeader(title) {
  return `<div class="modal-header"><h2>${title}</h2><button class="modal-close" type="button" aria-label="Close dialog">×</button></div>`;
}

function openProductDetails(id) {
  const product = products.find((entry) => entry.id === id);
  if (!product) return;
  const sizeOptions = product.category === "Clothing"
    ? ["XS", "S", "M", "L", "XL"].map((size) => `<option value="${size}">${size}</option>`).join("")
    : "";
  const productReviews = reviews[id] || [];
  const average = productReviews.length
    ? (productReviews.reduce((sum, review) => sum + review.rating, 0) / productReviews.length).toFixed(1)
    : null;
  openModal(`${modalHeader("A closer look")}
    <div class="product-detail-layout">
      <img class="detail-image" src="${escapeHTML(product.image)}" alt="${escapeHTML(product.alt)}" />
      <div class="detail-copy">
        <p class="eyebrow">${escapeHTML(product.category)}${product.badge ? ` · ${escapeHTML(product.badge)}` : ""}</p>
        <h3>${escapeHTML(product.name)}</h3><p class="detail-price">${money(product.price)}</p>
        <p>${escapeHTML(product.detail)}. Made for repeat wears, easy layering, and wherever the day takes you.</p>
        <p class="product-card-rating">${average ? `★★★★★ <span>${average} · ${productReviews.length} customer reviews</span>` : `<span class="no-rating">No customer reviews yet</span>`}</p>
        <label class="form-label" for="detail-size">Size</label>
        <select id="detail-size" class="form-control"><option value="">${product.category === "Clothing" ? "Choose a size" : "One size"}</option>${sizeOptions}</select>
        <label class="form-label" for="detail-color">Choose a color</label>
        <select id="detail-color" class="form-control">${product.colors.map((color, index) => `<option value="${escapeHTML(color)}">Color ${index + 1}</option>`).join("")}</select>
        <button class="button button-dark detail-add" type="button" data-add-detail="${escapeHTML(id)}">Add to bag — ${money(product.price)} <span>↗</span></button>
        <h4>Customer reviews</h4>
        <div class="detail-reviews">${productReviews.length
          ? productReviews.slice(-4).reverse().map((review) => `<blockquote><span class="stars">${"★".repeat(review.rating)}${"☆".repeat(5 - review.rating)}</span><p>${escapeHTML(review.text)}</p><cite>${escapeHTML(review.name)} · Customer review</cite></blockquote>`).join("")
          : "<p>Be the first to share what you think.</p>"}</div>
        <form class="review-form" data-review="${escapeHTML(id)}">
          <h4>Leave a review</h4>
          <label class="form-label">Your rating<select class="form-control" name="rating" required><option value="5">★★★★★ — Loved it</option><option value="4">★★★★ — Really good</option><option value="3">★★★ — It's good</option><option value="2">★★ — Could be better</option><option value="1">★ — Not for me</option></select></label>
          <label class="form-label">Your name<input class="form-control" name="name" maxlength="60" required /></label>
          <label class="form-label">Your review<textarea class="form-control" name="text" maxlength="600" required></textarea></label>
          <p class="form-note">Reviews are stored in this browser and are not independently verified.</p>
          <button class="button button-dark" type="submit">Submit review <span>↗</span></button>
        </form>
      </div>
    </div>`);
}

function openCheckout() {
  if (!cart.length) return;
  setCartOpen(false);
  const totals = getCartTotals();
  openModal(`${modalHeader("Checkout")}
    <div class="checkout-layout">
      <form class="checkout-form">
        <p class="form-note">Fill in every delivery field to place your order. The shop must be open from its local server at http://127.0.0.1:3000; opening this HTML file directly cannot save orders. Card and PayPal options are demo only and do not collect payment.</p>
        <h3>Delivery details</h3>
        <label class="form-label">Full name<input class="form-control" name="name" autocomplete="name" required value="${escapeHTML(profile?.name || "")}" /></label>
        <label class="form-label">Email<input class="form-control" name="email" type="email" autocomplete="email" required value="${escapeHTML(profile?.email || "")}" /></label>
        <label class="form-label">Phone<input class="form-control" name="phone" type="tel" autocomplete="tel" required /></label>
        <label class="form-label">Delivery address<input class="form-control" name="address" autocomplete="street-address" required /></label>
        <label class="form-label">City<input class="form-control" name="city" autocomplete="address-level2" required maxlength="100" /></label>
        <label class="form-label">Country code (2 letters, e.g. US)<input class="form-control" name="country" autocomplete="off" required minlength="2" maxlength="2" pattern="[A-Za-z]{2}" title="Enter a two-letter country code, such as US." placeholder="US" /></label>
        <label class="form-label">Postal code<input class="form-control" name="postalCode" autocomplete="postal-code" required maxlength="24" /></label>
        <fieldset class="payment-methods">
          <legend>Payment method</legend>
          <label class="payment-method-option">
            <input type="radio" name="payment" value="Cash on delivery" data-payment-note="No payment is due now. Submit your order to save your information; payment remains pending." required checked />
            <span><strong>Cash on delivery</strong><small>Pay your courier when your order arrives.</small></span>
          </label>
          <label class="payment-method-option">
            <input type="radio" name="payment" value="Credit/debit card (demo)" data-payment-note="No card payment is taken. Submit your order without paying; its payment status will remain pending." />
            <span><strong>Card (pay later)</strong><small>No card details are requested and no payment is taken.</small></span>
          </label>
          <label class="payment-method-option">
            <input type="radio" name="payment" value="PayPal (demo)" data-payment-note="PayPal is not connected. Submit your order without paying; its payment status will remain pending." />
            <span><strong>PayPal (pay later)</strong><small>No payment is collected at checkout.</small></span>
          </label>
          <label class="payment-method-option">
            <input type="radio" name="payment" value="Bank transfer (manual demo)" data-payment-note="Bank transfer is not configured. Submit your order without paying; its payment status will remain pending." />
            <span><strong>Bank transfer (pay later)</strong><small>No transfer is required to submit your order.</small></span>
          </label>
          <label class="payment-method-option">
            <input type="radio" name="payment" value="Mobile money (manual demo)" data-payment-note="Mobile money is not connected. Submit your order without paying; its payment status will remain pending." />
            <span><strong>Mobile money (pay later)</strong><small>No payment is collected at checkout.</small></span>
          </label>
          <p class="form-note payment-method-note" aria-live="polite">No payment is due now. Submit your order to save your information; payment remains pending.</p>
        </fieldset>
        <button class="button button-dark" type="submit">Submit order · ${money(totals.total)} <span>↗</span></button>
      </form>
      <aside class="order-summary"><h3>Order summary</h3>${cart.map((item) => {
        const product = products.find((entry) => entry.id === item.id);
        return `<div><span>${escapeHTML(product.name)} × ${item.quantity}${item.size ? ` · ${escapeHTML(item.size)}` : ""}${item.color ? ` · Color ${product.colors.indexOf(item.color) + 1}` : ""}</span><strong>${money(product.price * item.quantity)}</strong></div>`;
      }).join("")}
        <div><span>Subtotal</span><strong>${money(totals.subtotal)}</strong></div>
        ${totals.discount ? `<div><span>Discount</span><strong>−${money(totals.discount)}</strong></div>` : ""}
        <div><span>Shipping</span><strong>${totals.shipping ? money(totals.shipping) : "Free"}</strong></div>
        <div class="summary-total"><span>Total</span><strong>${money(totals.total)}</strong></div>
      </aside>
    </div>`);
}

function openAccount() {
  openModal(`${modalHeader("Your account")}
    <div class="account-panel">
      <p class="form-note">${profile
        ? "This local preview keeps a profile and order history in this browser only. It is not a secure account system."
        : "Create a profile for this preview. Passwords are checked here but never stored, and this does not create a secure account."}</p>
      ${profile ? `<p>Signed in locally as <strong>${escapeHTML(profile.name || profile.email)}</strong> · ${escapeHTML(profile.email)}</p>` : ""}
      <form class="account-form">
        ${profile ? "" : `<h3>Create your profile</h3>`}
        <label class="form-label">Your name<input class="form-control" name="name" autocomplete="name" required value="${escapeHTML(profile?.name || "")}" /></label>
        <label class="form-label">Email<input class="form-control" name="email" type="email" autocomplete="email" required value="${escapeHTML(profile?.email || "")}" /></label>
        ${profile ? "" : `<label class="form-label">Password<input class="form-control" name="password" type="password" autocomplete="new-password" minlength="8" required /></label>
        <label class="form-label">Confirm password<input class="form-control" name="confirmPassword" type="password" autocomplete="new-password" minlength="8" required /></label>`}
        <button class="button button-dark" type="submit">${profile ? "Update local profile" : "Sign up"} <span>↗</span></button>
      </form>
      <h3>Your order history</h3>
      <div class="account-orders">${orders.filter((order) => !profile || order.email === profile.email).length
        ? orders.filter((order) => !profile || order.email === profile.email).map((order) => `<article><strong>Order ${escapeHTML(order.id)}</strong><span>${escapeHTML(order.date)} · ${money(order.total)}</span><span>${escapeHTML(order.status)}</span></article>`).join("")
        : "<p>No orders yet. Completed demo orders will appear here.</p>"}</div>
    </div>`);
}

function openWishlist() {
  const savedProducts = products.filter((product) => wishlist.includes(product.id));
  openModal(`${modalHeader("Your wishlist")}
    ${savedProducts.length ? `<div class="wishlist-items">${savedProducts.map((product) => `<article class="wishlist-item">
      <img src="${escapeHTML(product.image)}" alt="${escapeHTML(product.alt)}" />
      <div><h3>${escapeHTML(product.name)}</h3><p>${money(product.price)}</p><button class="text-button" type="button" data-modal-wishlist="${escapeHTML(product.id)}">Remove from wishlist</button></div>
      <button class="button button-dark" type="button" data-add="${escapeHTML(product.id)}">Add to bag</button>
    </article>`).join("")}</div>` : `<div class="confirmation-panel"><p>Your saved pieces will be waiting here.</p><button class="button button-dark modal-close" type="button">Explore the collection <span>↗</span></button></div>`}`);
}

function openAdmin() {
  const revenue = orders.reduce((sum, order) => sum + order.total, 0);
  openModal(`${modalHeader("Store admin preview")}
    <p class="form-note">Local demo dashboard only. Changes stay in this browser and are not protected by server authentication.</p>
    <div class="admin-stats"><div><span>Catalog</span><strong>${products.length} products</strong></div><div><span>Demo orders</span><strong>${orders.length}</strong></div><div><span>Recorded sales</span><strong>${money(revenue)}</strong></div></div>
    <form class="admin-product-form">
      <h3>Add a catalog item</h3>
      <label class="form-label">Product name<input class="form-control" name="name" maxlength="80" required /></label>
      <label class="form-label">Category<select class="form-control" name="category"><option>Clothing</option><option>Accessories</option></select></label>
      <label class="form-label">Price<input class="form-control" name="price" type="number" min="0.01" step="0.01" required /></label>
      <button class="button button-dark" type="submit">Add product <span>↗</span></button>
    </form>
    <h3>Products & inventory</h3>
    <div class="admin-products">${products.map((product) => `<form class="admin-product-row" data-admin-product="${escapeHTML(product.id)}">
      <strong>${escapeHTML(product.name)}</strong><label>Category <select name="category"><option${product.category === "Clothing" ? " selected" : ""}>Clothing</option><option${product.category === "Accessories" ? " selected" : ""}>Accessories</option></select></label><label>Price <input name="price" type="number" min="0.01" step="0.01" value="${product.price}" required /></label><label>Stock <input name="stock" type="number" min="0" step="1" value="${getStock(product)}" required /></label><button type="submit">Save</button><button type="button" data-delete-product="${escapeHTML(product.id)}">Delete</button>
    </form>`).join("")}</div>
    <h3>Recent orders</h3><div class="admin-products">${orders.length ? orders.slice().reverse().map((order) => `<div class="admin-order-row"><span>Order ${escapeHTML(order.id)} · ${escapeHTML(order.name)} · ${money(order.total)}</span><select data-order-status="${escapeHTML(order.id)}">${["Demo order received", "Processing", "Shipped", "Delivered", "Cancelled"].map((status) => `<option${order.status === status ? " selected" : ""}>${status}</option>`).join("")}</select><button type="button" data-save-order="${escapeHTML(order.id)}">Update</button></div>`).join("") : "<p>No orders recorded yet.</p>"}</div>`);
}

productGrid.addEventListener("click", (event) => {
  const target = event.target;
  const addButton = target.closest("[data-add]");
  const wishlistButton = target.closest("[data-wishlist]");
  const detailButton = target.closest("[data-detail]");
  if (addButton) {
    const product = products.find((entry) => entry.id === addButton.dataset.add);
    if (product?.category === "Clothing") openProductDetails(product.id);
    else addToCart(addButton.dataset.add);
  } else if (wishlistButton) {
    const id = wishlistButton.dataset.wishlist;
    wishlist = wishlist.includes(id) ? wishlist.filter((item) => item !== id) : [...wishlist, id];
    localStorage.setItem(STORAGE.wishlist, JSON.stringify(wishlist));
    renderProducts();
    renderCart();
    showToast(wishlist.includes(id) ? "Saved to your wishlist" : "Removed from your wishlist");
  } else if (detailButton) {
    openProductDetails(detailButton.dataset.detail);
  }
});

document.querySelector(".cart-items").addEventListener("click", (event) => {
  const quantityButton = event.target.closest("[data-quantity]");
  const removeButton = event.target.closest("[data-remove]");
  if (quantityButton) {
    const item = cart.find((entry) => entry.id === quantityButton.dataset.quantity && (entry.size || "") === quantityButton.dataset.size && (entry.color || "") === quantityButton.dataset.color);
    if (!item) return;
    const product = products.find((entry) => entry.id === item.id);
    const quantity = item.quantity + Number(quantityButton.dataset.change);
    const totalQuantity = cart.filter((entry) => entry.id === item.id).reduce((total, entry) => total + entry.quantity, 0) + Number(quantityButton.dataset.change);
    if (Number(quantityButton.dataset.change) > 0 && totalQuantity > getStock(product)) {
      showToast("Sorry, that’s all we have in stock.");
      return;
    }
    item.quantity = quantity;
    if (item.quantity <= 0) cart = cart.filter((entry) => entry !== item);
    saveCart();
  } else if (removeButton) {
    cart = cart.filter((item) => !(item.id === removeButton.dataset.remove && (item.size || "") === removeButton.dataset.size && (item.color || "") === removeButton.dataset.color));
    saveCart();
  }
});

document.querySelector(".coupon-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const value = new FormData(event.currentTarget).get("coupon").toString().trim().toUpperCase();
  if (!["STYLE10", "WELCOME15"].includes(value)) {
    showToast("That code didn’t work. Try STYLE10 or WELCOME15.");
    return;
  }
  coupon = value;
  localStorage.setItem(STORAGE.coupon, JSON.stringify(coupon));
  renderCart();
  showToast(`${value} discount applied`);
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeFilter = button.dataset.filter;
    filterButtons.forEach((filter) => filter.classList.toggle("active", filter === button));
    renderProducts();
  });
});
document.querySelectorAll("[data-nav-category]").forEach((link) => {
  link.addEventListener("click", () => {
    activeFilter = link.dataset.navCategory;
    filterButtons.forEach((button) => button.classList.toggle("active", button.dataset.filter === activeFilter));
    renderProducts();
  });
});
document.querySelector("#sort-products").addEventListener("change", renderProducts);
document.querySelector("#price-filter").addEventListener("change", renderProducts);
document.querySelector("#size-filter").addEventListener("change", renderProducts);
document.querySelector("#rating-filter").addEventListener("change", renderProducts);
document.querySelector("#stock-filter").addEventListener("change", renderProducts);
document.querySelector(".clear-filters").addEventListener("click", () => {
  activeFilter = "All";
  searchTerm = "";
  searchInput.value = "";
  document.querySelector("#sort-products").value = "featured";
  document.querySelector("#price-filter").value = "all";
  document.querySelector("#size-filter").value = "all";
  document.querySelector("#rating-filter").value = "all";
  document.querySelector("#stock-filter").checked = false;
  filterButtons.forEach((button) => button.classList.toggle("active", button.dataset.filter === "All"));
  renderProducts();
});
searchInput.addEventListener("input", () => {
  searchTerm = searchInput.value.trim().toLowerCase();
  renderProducts();
});
document.querySelector(".clear-search").addEventListener("click", () => {
  searchInput.value = "";
  searchTerm = "";
  renderProducts();
  searchInput.focus();
});
document.querySelector(".search-toggle").addEventListener("click", () => {
  searchPanel.hidden = !searchPanel.hidden;
  if (!searchPanel.hidden) searchInput.focus();
});
document.querySelector(".bag-button").addEventListener("click", () => setCartOpen(true));
document.querySelector(".close-drawer").addEventListener("click", () => setCartOpen(false));
document.querySelector(".continue-shopping").addEventListener("click", () => setCartOpen(false));
backdrop.addEventListener("click", () => setCartOpen(false));
document.querySelector(".checkout-button").addEventListener("click", openCheckout);
document.querySelector(".account-link").addEventListener("click", openAccount);
const backToTopButton = document.querySelector(".back-to-top");
window.addEventListener("scroll", () => {
  backToTopButton.classList.toggle("visible", window.scrollY > 500);
}, { passive: true });
backToTopButton.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});
document.querySelector(".wishlist-link").addEventListener("click", (event) => {
  event.preventDefault();
  openWishlist();
});
document.querySelector(".admin-link").addEventListener("click", openAdmin);
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") setCartOpen(false);
});
document.querySelector(".menu-toggle").addEventListener("click", (event) => {
  const nav = document.querySelector(".main-nav");
  const open = nav.classList.toggle("open");
  event.currentTarget.setAttribute("aria-expanded", String(open));
  event.currentTarget.setAttribute("aria-label", open ? "Close navigation menu" : "Open navigation menu");
});
document.querySelectorAll(".main-nav a").forEach((link) => {
  link.addEventListener("click", () => {
    const menuToggle = document.querySelector(".menu-toggle");
    document.querySelector(".main-nav").classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation menu");
  });
});

modalRoot.addEventListener("invalid", (event) => {
  const form = event.target.form;
  if (!form?.matches(".checkout-form")) return;
  const formNote = form.querySelector(".form-note");
  const fieldLabel = event.target.closest("label")?.querySelector(".form-label")?.textContent ||
    event.target.closest("label")?.textContent.trim() ||
    "a required field";
  formNote.textContent = `Please check ${fieldLabel}. Complete all required delivery details before placing your order.`;
}, true);

modalRoot.addEventListener("change", (event) => {
  const paymentOption = event.target.closest('input[name="payment"]');
  if (paymentOption) {
    modalRoot.querySelector(".payment-method-note").textContent = paymentOption.dataset.paymentNote;
  }
});

modalRoot.addEventListener("click", (event) => {
  if (event.target.closest(".modal-close")) modalRoot.querySelector("dialog")?.close();
  const modalWishlistButton = event.target.closest("[data-modal-wishlist]");
  if (modalWishlistButton) {
    wishlist = wishlist.filter((id) => id !== modalWishlistButton.dataset.modalWishlist);
    localStorage.setItem(STORAGE.wishlist, JSON.stringify(wishlist));
    renderProducts();
    renderCart();
    openWishlist();
  }
  const modalAddButton = event.target.closest("[data-add]");
  if (modalAddButton) addToCart(modalAddButton.dataset.add);
  const addButton = event.target.closest("[data-add-detail]");
  if (addButton) {
    const size = modalRoot.querySelector("#detail-size").value;
    const color = modalRoot.querySelector("#detail-color").value;
    const product = products.find((entry) => entry.id === addButton.dataset.addDetail);
    if (product?.category === "Clothing" && !size) {
      showToast("Choose a size to continue.");
      return;
    }
    addToCart(addButton.dataset.addDetail, size, color);
    setCartOpen(true);
    modalRoot.querySelector("dialog")?.close();
  }
  const deleteButton = event.target.closest("[data-delete-product]");
  if (deleteButton) {
    const id = deleteButton.dataset.deleteProduct;
    const index = customProducts.findIndex((product) => product.id === id);
    if (index >= 0) {
      customProducts.splice(index, 1);
      localStorage.setItem("urbanstyle-custom-products", JSON.stringify(customProducts));
    }
    if (!deletedProductIds.includes(id)) deletedProductIds.push(id);
    const productIndex = products.findIndex((product) => product.id === id);
    if (productIndex >= 0) products.splice(productIndex, 1);
    cart = cart.filter((item) => item.id !== id);
    wishlist = wishlist.filter((item) => item !== id);
    localStorage.setItem("urbanstyle-deleted-products", JSON.stringify(deletedProductIds));
    localStorage.setItem(STORAGE.wishlist, JSON.stringify(wishlist));
    saveCart();
    renderProducts();
    openAdmin();
  }
  const saveOrderButton = event.target.closest("[data-save-order]");
  if (saveOrderButton) {
    const row = saveOrderButton.closest(".admin-order-row");
    const order = orders.find((entry) => entry.id === saveOrderButton.dataset.saveOrder);
    if (order && row) {
      order.status = row.querySelector("[data-order-status]").value;
      localStorage.setItem(STORAGE.orders, JSON.stringify(orders));
      openAdmin();
      showToast("Order status updated");
    }
  }
});

modalRoot.addEventListener("submit", async (event) => {
  const form = event.target;
  event.preventDefault();
  if (form.matches(".review-form")) {
    const data = new FormData(form);
    const id = form.dataset.review;
    const review = { name: data.get("name").toString().trim(), text: data.get("text").toString().trim(), rating: Number(data.get("rating")) };
    if (!review.name || !review.text || review.rating < 1 || review.rating > 5) return;
    reviews[id] = [...(reviews[id] || []), review];
    localStorage.setItem(STORAGE.reviews, JSON.stringify(reviews));
    renderProducts();
    openProductDetails(id);
    showToast("Thanks for sharing your review");
  } else if (form.matches(".checkout-form")) {
    const data = new FormData(form);
    const unavailableId = [...new Set(cart.map((item) => item.id))].find((id) =>
      cart.filter((item) => item.id === id).reduce((total, item) => total + item.quantity, 0) > getStock(products.find((product) => product.id === id))
    );
    if (unavailableId) {
      form.querySelector(".form-note").textContent = "One or more items exceed current stock. Close checkout and adjust your bag.";
      return;
    }
    const submitButton = form.querySelector('button[type="submit"]');
    const formNote = form.querySelector(".form-note");
    submitButton.disabled = true;
    formNote.textContent = "Saving your order securely to the shop database…";
    let savedOrder;
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          customer: {
            name: data.get("name").toString().trim(),
            email: data.get("email").toString().trim(),
            phone: data.get("phone").toString().trim(),
            address: data.get("address").toString().trim(),
            city: data.get("city").toString().trim(),
            country: data.get("country").toString().trim(),
            postalCode: data.get("postalCode").toString().trim(),
          },
          payment: data.get("payment").toString(),
          coupon,
          items: cart.map((item) => ({
            id: item.id,
            quantity: item.quantity,
            size: item.size,
            color: item.color,
          })),
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Could not save the order.");
      savedOrder = result;
    } catch (error) {
      submitButton.disabled = false;
      formNote.textContent = error instanceof TypeError
        ? "Cannot reach the shop server. Start it with npm start, then open http://127.0.0.1:3000 (do not open index.html directly)."
        : error.message || "Could not save the order. Check that the shop server and MySQL are running.";
      return;
    }
    const order = {
      id: savedOrder.orderNumber,
      name: data.get("name").toString().trim(),
      email: data.get("email").toString().trim().toLowerCase(),
      payment: data.get("payment").toString(),
      date: new Date().toLocaleDateString(),
      status: "Order received",
      total: savedOrder.total,
      items: cart.map((item) => ({ ...item })),
    };
    orders.push(order);
    localStorage.setItem(STORAGE.orders, JSON.stringify(orders));
    profile = { name: order.name, email: order.email };
    localStorage.setItem(STORAGE.profile, JSON.stringify(profile));
    cart = [];
    coupon = null;
    localStorage.removeItem(STORAGE.coupon);
    saveCart();
    openModal(`${modalHeader("Order received")}<div class="confirmation-panel"><span class="confirmation-mark">✓</span><h3>Thanks, ${escapeHTML(order.name)}.</h3><p>Your order <strong>${escapeHTML(order.id)}</strong> has been saved to the shop database with <strong>${escapeHTML(order.payment)}</strong>. Payment is pending; no payment was collected and no delivery is arranged by this local preview.</p><p><a class="text-link" href="/orders.html">View orders on the separate orders page ↗</a></p><button class="button button-dark modal-close" type="button">Continue shopping <span>↗</span></button></div>`);
  } else if (form.matches(".account-form")) {
    const data = new FormData(form);
    if (!profile && data.get("password") !== data.get("confirmPassword")) {
      const confirmPassword = form.elements.namedItem("confirmPassword");
      confirmPassword.setCustomValidity("Passwords do not match.");
      confirmPassword.reportValidity();
      for (const input of [form.elements.namedItem("password"), confirmPassword]) {
        input.addEventListener("input", () => confirmPassword.setCustomValidity(""), { once: true });
      }
      return;
    }
    profile = { name: data.get("name").toString().trim(), email: data.get("email").toString().trim().toLowerCase() };
    localStorage.setItem(STORAGE.profile, JSON.stringify(profile));
    openAccount();
    showToast("Local profile saved. Passwords are not stored.");
  } else if (form.matches(".admin-product-form")) {
    const data = new FormData(form);
    const name = data.get("name").toString().trim();
    const price = Number(data.get("price"));
    if (!name || !Number.isFinite(price) || price <= 0) return;
    const id = `custom-${Date.now()}`;
    const product = { id, name, detail: "New addition to the collection", category: data.get("category").toString(), price, badge: "New in", colors: ["#d9d2c4"], image: "https://images.unsplash.com/photo-1523398002811-999ca8dec234?auto=format&fit=crop&w=800&q=80", alt: name, popularity: 0, added: Date.now() };
    customProducts.push(product);
    products.push(product);
    inventory[id] = 24;
    localStorage.setItem("urbanstyle-custom-products", JSON.stringify(customProducts));
    localStorage.setItem(STORAGE.inventory, JSON.stringify(inventory));
    renderProducts();
    openAdmin();
    showToast("Product added to this browser’s catalog");
  } else if (form.matches(".admin-product-row")) {
    const data = new FormData(form);
    const product = products.find((entry) => entry.id === form.dataset.adminProduct);
    const price = Number(data.get("price"));
    const stock = Number(data.get("stock"));
    if (!product || !Number.isFinite(price) || price <= 0 || !Number.isInteger(stock) || stock < 0) return;
    product.price = price;
    product.category = data.get("category").toString();
    priceOverrides[product.id] = price;
    categoryOverrides[product.id] = product.category;
    inventory[product.id] = stock;
    localStorage.setItem("urbanstyle-price-overrides", JSON.stringify(priceOverrides));
    localStorage.setItem("urbanstyle-category-overrides", JSON.stringify(categoryOverrides));
    localStorage.setItem(STORAGE.inventory, JSON.stringify(inventory));
    localStorage.setItem("urbanstyle-custom-products", JSON.stringify(customProducts));
    renderProducts();
    openAdmin();
    showToast("Catalog changes saved in this browser");
  }
});

document.querySelector(".newsletter-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const email = document.querySelector("#email-address");
  const subscribers = readStorage(STORAGE.newsletter, []);
  if (!subscribers.includes(email.value.trim().toLowerCase())) subscribers.push(email.value.trim().toLowerCase());
  localStorage.setItem(STORAGE.newsletter, JSON.stringify(subscribers));
  document.querySelector(".newsletter-message").textContent = "You’re on the list. Thanks for being here.";
  event.currentTarget.reset();
});

document.querySelector(".contact-form").addEventListener("submit", (event) => {
  event.preventDefault();
  event.currentTarget.reset();
  document.querySelector(".contact-message").textContent = "Thanks for reaching out. This preview does not send messages.";
});

renderProducts();
renderCart();
