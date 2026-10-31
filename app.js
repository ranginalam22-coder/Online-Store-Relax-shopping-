const products = [
  {
    id: "city-layers-tee",
    name: "City Layers Tee",
    detail: "Heavyweight organic cotton",
    category: "Clothing",
    price: 42,
    badge: "Bestseller",
    colors: ["#d9d2c4", "#262722", "#b3b0a7"],
    image: "https://images.unsplash.com/photo-1523398002811-999ca8dec234?auto=format&fit=crop&w=800&q=80",
    alt: "Relaxed neutral streetwear T-shirt",
  },
  {
    id: "off-duty-overshirt",
    name: "Off-Duty Overshirt",
    detail: "Soft cotton twill · relaxed fit",
    category: "Clothing",
    price: 88,
    badge: "New in",
    colors: ["#c2b9a7", "#3b493c"],
    image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=800&q=80",
    alt: "Everyday overshirt styled for the city",
  },
  {
    id: "after-hours-cap",
    name: "After Hours Cap",
    detail: "Washed cotton · adjustable",
    category: "Accessories",
    price: 32,
    badge: "",
    colors: ["#30332d", "#b7a48b", "#af583f"],
    image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=800&q=80",
    alt: "Classic cap in a warm neutral color",
  },
  {
    id: "weekend-cargo",
    name: "Weekend Cargo",
    detail: "Easy utility · just-right volume",
    category: "Clothing",
    price: 96,
    badge: "Just dropped",
    colors: ["#8b8b72", "#c5b99f"],
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80",
    alt: "Relaxed city outfit with utility-inspired styling",
  },
  {
    id: "everywhere-tote",
    name: "Everywhere Tote",
    detail: "Room for all of it · 100% cotton",
    category: "Accessories",
    price: 28,
    badge: "",
    colors: ["#dfd7c6", "#41453a"],
    image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80",
    alt: "Everyday canvas tote bag",
  },
  {
    id: "downtown-knit",
    name: "Downtown Knit",
    detail: "The soft one · responsibly made",
    category: "Clothing",
    price: 74,
    badge: "New in",
    colors: ["#d0c7b5", "#9d705e", "#353831"],
    image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=800&q=80",
    alt: "Soft knitwear in a neutral shade",
  },
  {
    id: "daytrip-denim-jacket",
    name: "Daytrip Denim Jacket",
    detail: "Vintage-wash denim · easy layer",
    category: "Clothing",
    price: 108,
    badge: "New in",
    colors: ["#647385", "#343a3d"],
    image: "https://images.unsplash.com/photo-1543076447-215ad9ba6923?auto=format&fit=crop&w=800&q=80",
    alt: "Classic blue denim jacket",
  },
  {
    id: "boxy-poplin-shirt",
    name: "Boxy Poplin Shirt",
    detail: "Crisp cotton · borrowed-from-the-boys fit",
    category: "Clothing",
    price: 68,
    badge: "",
    colors: ["#e6e2d9", "#a9b5b1", "#39434a"],
    image: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=800&q=80",
    alt: "Relaxed white button-up shirt",
  },
  {
    id: "everyday-wide-leg-jeans",
    name: "Everyday Wide-Leg Jeans",
    detail: "Soft structured denim · high rise",
    category: "Clothing",
    price: 92,
    badge: "",
    colors: ["#586a7d", "#282d31"],
    image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80",
    alt: "Wide-leg blue jeans",
  },
  {
    id: "slow-morning-sweatshirt",
    name: "Slow Morning Sweatshirt",
    detail: "Brushed-back fleece · extra cozy",
    category: "Clothing",
    price: 78,
    badge: "New in",
    colors: ["#d0c8ba", "#788276", "#353831"],
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=800&q=80",
    alt: "Comfortable neutral crewneck sweatshirt",
  },
  {
    id: "city-lights-slip-dress",
    name: "City Lights Slip Dress",
    detail: "Fluid drape · day-to-night favorite",
    category: "Clothing",
    price: 84,
    badge: "New in",
    colors: ["#35332f", "#9d735f"],
    image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=800&q=80",
    alt: "Minimal black slip dress",
  },
  {
    id: "off-the-clock-shorts",
    name: "Off-the-Clock Shorts",
    detail: "Easy cotton twill · pull-on waist",
    category: "Clothing",
    price: 54,
    badge: "",
    colors: ["#d0c4ae", "#69735f", "#373932"],
    image: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&w=800&q=80",
    alt: "Relaxed casual shorts",
  },
];

const productGrid = document.querySelector(".product-grid");
const emptyState = document.querySelector(".empty-state");
const filterButtons = [...document.querySelectorAll(".filter-button")];
const searchPanel = document.querySelector(".search-panel");
const searchInput = document.querySelector("#product-search");
const cartDrawer = document.querySelector(".cart-drawer");
const backdrop = document.querySelector(".drawer-backdrop");
const toast = document.querySelector(".toast");
const money = (amount) => `$${amount.toFixed(2)}`;
let activeFilter = "All";
let searchTerm = "";
let toastTimeout;

function getCart() {
  try {
    const stored = JSON.parse(localStorage.getItem("urbanstyle-cart") || "[]");
    if (!Array.isArray(stored)) throw new Error("Saved bag has an invalid format.");
    return stored.filter((item) =>
      products.some((product) => product.id === item.id) &&
      Number.isInteger(item.quantity) &&
      item.quantity > 0
    );
  } catch (error) {
    if (error instanceof SyntaxError) {
      localStorage.removeItem("urbanstyle-cart");
      return [];
    }
    throw error;
  }
}

let cart = getCart();

function renderProducts() {
  const sortBy = document.querySelector("#sort-products").value;
  let visibleProducts = products.filter((product) => {
    const categoryMatches = activeFilter === "All" || activeFilter === "New"
      ? activeFilter !== "New" || product.badge === "New in"
      : product.category === activeFilter;
    const queryMatches = `${product.name} ${product.detail} ${product.category}`
      .toLowerCase()
      .includes(searchTerm);
    return categoryMatches && queryMatches;
  });

  if (sortBy === "price-low") visibleProducts = [...visibleProducts].sort((a, b) => a.price - b.price);
  if (sortBy === "price-high") visibleProducts = [...visibleProducts].sort((a, b) => b.price - a.price);
  if (sortBy === "name") visibleProducts = [...visibleProducts].sort((a, b) => a.name.localeCompare(b.name));

  productGrid.innerHTML = visibleProducts.map((product) => `
    <article class="product-card">
      <div class="product-image-wrap">
        <img class="product-image" src="${product.image}" alt="${product.alt}" loading="lazy" />
        ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ""}
        <button class="quick-add" type="button" data-add="${product.id}" aria-label="Add ${product.name} to bag">+</button>
      </div>
      <div class="product-info">
        <div class="product-meta"><h3 class="product-name">${product.name}</h3><span class="product-price">${money(product.price)}</span></div>
        <p class="product-detail">${product.detail}</p>
        <div class="product-swatches" aria-label="Available colors">${product.colors.map((color) => `<span class="swatch" style="background-color:${color}" aria-hidden="true"></span>`).join("")}</div>
      </div>
    </article>
  `).join("");
  emptyState.hidden = visibleProducts.length > 0;
  productGrid.hidden = visibleProducts.length === 0;
}

function saveCart() {
  localStorage.setItem("urbanstyle-cart", JSON.stringify(cart));
  renderCart();
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("visible");
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => toast.classList.remove("visible"), 2300);
}

function renderCart() {
  const itemCount = cart.reduce((total, item) => total + item.quantity, 0);
  const subtotal = cart.reduce((total, item) => {
    const product = products.find((entry) => entry.id === item.id);
    return total + product.price * item.quantity;
  }, 0);
  document.querySelector(".bag-count").textContent = itemCount;
  document.querySelector(".drawer-count").textContent = `(${itemCount})`;
  document.querySelector(".cart-items").innerHTML = cart.map((item) => {
    const product = products.find((entry) => entry.id === item.id);
    return `<article class="cart-item">
      <img src="${product.image}" alt="${product.alt}" />
      <div><h3 class="cart-item-name">${product.name}</h3><p class="cart-item-detail">${money(product.price)}</p>
        <div class="quantity-control" aria-label="Quantity for ${product.name}">
          <button type="button" data-quantity="${product.id}" data-change="-1" aria-label="Remove one ${product.name}">−</button>
          <span>${item.quantity}</span>
          <button type="button" data-quantity="${product.id}" data-change="1" aria-label="Add one ${product.name}">+</button>
        </div>
      </div>
      <div class="cart-item-end"><span>${money(product.price * item.quantity)}</span><button class="remove-item" type="button" data-remove="${product.id}">Remove</button></div>
    </article>`;
  }).join("");
  document.querySelector(".cart-empty").hidden = itemCount > 0;
  document.querySelector(".cart-footer").hidden = itemCount === 0;
  document.querySelector(".cart-subtotal").textContent = money(subtotal);
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

function addToCart(id) {
  const existing = cart.find((item) => item.id === id);
  if (existing) existing.quantity += 1;
  else cart.push({ id, quantity: 1 });
  saveCart();
  const product = products.find((entry) => entry.id === id);
  showToast(`${product.name} added to your bag`);
}

productGrid.addEventListener("click", (event) => {
  const button = event.target.closest("[data-add]");
  if (button) addToCart(button.dataset.add);
});

document.querySelector(".cart-items").addEventListener("click", (event) => {
  const quantityButton = event.target.closest("[data-quantity]");
  const removeButton = event.target.closest("[data-remove]");
  if (quantityButton) {
    const item = cart.find((entry) => entry.id === quantityButton.dataset.quantity);
    item.quantity += Number(quantityButton.dataset.change);
    if (item.quantity <= 0) cart = cart.filter((entry) => entry.id !== item.id);
    saveCart();
  } else if (removeButton) {
    cart = cart.filter((item) => item.id !== removeButton.dataset.remove);
    saveCart();
  }
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
document.querySelector(".newsletter-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const email = document.querySelector("#email-address");
  document.querySelector(".newsletter-message").textContent = `You're on the list, ${email.value}.`;
  event.currentTarget.reset();
});
document.querySelector(".checkout-button").addEventListener("click", () => {
  showToast("Checkout is coming soon — your bag is saved.");
});

renderProducts();
renderCart();
