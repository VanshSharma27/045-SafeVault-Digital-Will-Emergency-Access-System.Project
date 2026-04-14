/**
 * ShopWave — E-Commerce JavaScript
 * Author : [Your Name]
 * Date   : April 2026
 *
 * Features:
 *  - Product listing rendered from a JS data array
 *  - Search / filter products by name or description
 *  - Add to cart / remove from cart
 *  - Qty increment & decrement with per-item total
 *  - Dynamic cart badge and price calculations (subtotal, GST, total)
 *  - Checkout form with basic validation
 *  - Order confirmation with summary
 *  - Cart state stored in sessionStorage (bonus)
 */

"use strict";

/* ══════════════════════════════════════════════════════
   1. PRODUCT DATA
══════════════════════════════════════════════════════ */
const PRODUCTS = [
  {
    id: 1,
    name: "Wireless Noise-Cancelling Headphones",
    category: "Audio",
    desc: "40-hour battery, aptX HD, foldable design. Perfect for WFH or travel.",
    price: 4999,
    original: 7499,
    emoji: "🎧",
  },
  {
    id: 2,
    name: "Mechanical Gaming Keyboard",
    category: "Peripherals",
    desc: "TKL layout, RGB backlight, Cherry MX Red switches. Tactile & fast.",
    price: 3499,
    original: 4999,
    emoji: "⌨️",
  },
  {
    id: 3,
    name: "Ultra-Wide 4K Monitor",
    category: "Display",
    desc: '34" IPS panel, 144 Hz, USB-C 65W PD. Boost your productivity.',
    price: 34999,
    original: 42999,
    emoji: "🖥️",
  },
  {
    id: 4,
    name: "Portable SSD 1 TB",
    category: "Storage",
    desc: "1050 MB/s read speed, USB 3.2 Gen 2, shock-resistant aluminium shell.",
    price: 6499,
    original: null,
    emoji: "💾",
  },
  {
    id: 5,
    name: "Smart LED Desk Lamp",
    category: "Lighting",
    desc: "Tunable white + RGB, touch dimmer, USB-A charging port, memory mode.",
    price: 1299,
    original: 1999,
    emoji: "💡",
  },
  {
    id: 6,
    name: "Ergonomic Mesh Chair",
    category: "Furniture",
    desc: "Lumbar support, adjustable armrests, breathable mesh back. 8-hr comfort.",
    price: 12999,
    original: 18999,
    emoji: "🪑",
  },
  {
    id: 7,
    name: "TWS Earbuds Pro",
    category: "Audio",
    desc: "ANC + transparency mode, 32-hr total battery, IPX5, wireless charging.",
    price: 2799,
    original: 3999,
    emoji: "🎵",
  },
  {
    id: 8,
    name: "Bamboo Wireless Charger",
    category: "Accessories",
    desc: "15 W Qi2 fast charge, eco-friendly bamboo surface, dual-coil design.",
    price: 899,
    original: 1299,
    emoji: "🔋",
  },
];

const TAX_RATE = 0.18;  // 18% GST

/* ══════════════════════════════════════════════════════
   2. CART STATE
══════════════════════════════════════════════════════ */
// cart = { productId: quantity, ... }
let cart = loadCartFromSession();

function loadCartFromSession() {
  try {
    const saved = sessionStorage.getItem("shopwave_cart");
    return saved ? JSON.parse(saved) : {};
  } catch {
    return {};
  }
}

function saveCartToSession() {
  try {
    sessionStorage.setItem("shopwave_cart", JSON.stringify(cart));
  } catch {
    // sessionStorage unavailable — degrade gracefully
  }
}

/* ══════════════════════════════════════════════════════
   3. RENDER PRODUCTS
══════════════════════════════════════════════════════ */
function renderProducts(list) {
  const grid = document.getElementById("product-grid");
  const noRes = document.getElementById("no-results");

  if (list.length === 0) {
    grid.innerHTML = "";
    noRes.style.display = "block";
    return;
  }
  noRes.style.display = "none";

  grid.innerHTML = list.map(p => {
    const inCart = cart[p.id] > 0;
    const origHtml = p.original
      ? `<span class="original">₹${p.original.toLocaleString("en-IN")}</span>`
      : "";
    return `
      <div class="product-card" id="pc-${p.id}">
        <div class="product-img" role="img" aria-label="${p.name}">${p.emoji}</div>
        <div class="product-body">
          <div class="product-category">${p.category}</div>
          <div class="product-name">${p.name}</div>
          <div class="product-desc">${p.desc}</div>
          <div class="product-price">
            ${origHtml}₹${p.price.toLocaleString("en-IN")}
          </div>
          <button
            class="btn btn-add ${inCart ? 'added' : ''}"
            id="btn-add-${p.id}"
            onclick="addToCart(${p.id})"
          >${inCart ? "✔ Added" : "Add to Cart"}</button>
        </div>
      </div>`;
  }).join("");
}

/* ══════════════════════════════════════════════════════
   4. SEARCH / FILTER
══════════════════════════════════════════════════════ */
function filterProducts() {
  const q = document.getElementById("search-input").value.trim().toLowerCase();
  const filtered = q
    ? PRODUCTS.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.desc.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      )
    : PRODUCTS;
  renderProducts(filtered);
}

/* ══════════════════════════════════════════════════════
   5. CART OPERATIONS
══════════════════════════════════════════════════════ */
function addToCart(id) {
  if (cart[id]) {
    cart[id]++;
  } else {
    cart[id] = 1;
  }
  saveCartToSession();
  updateAddButton(id, true);
  renderCart();
  animateBadge();
}

function updateQty(id, delta) {
  if (!cart[id]) return;
  cart[id] += delta;
  if (cart[id] <= 0) {
    delete cart[id];
    updateAddButton(id, false);
  }
  saveCartToSession();
  renderCart();
  animateBadge();
}

function removeFromCart(id) {
  delete cart[id];
  saveCartToSession();
  updateAddButton(id, false);
  renderCart();
  animateBadge();
}

function clearCart() {
  if (!Object.keys(cart).length) return;
  if (!confirm("Remove all items from the cart?")) return;
  cart = {};
  saveCartToSession();
  // reset all add buttons
  PRODUCTS.forEach(p => updateAddButton(p.id, false));
  renderCart();
  animateBadge();
}

function updateAddButton(id, inCart) {
  const btn = document.getElementById(`btn-add-${id}`);
  if (!btn) return;
  btn.textContent = inCart ? "✔ Added" : "Add to Cart";
  btn.classList.toggle("added", inCart);
}

/* ══════════════════════════════════════════════════════
   6. RENDER CART
══════════════════════════════════════════════════════ */
function renderCart() {
  const cartEmpty = document.getElementById("cart-empty");
  const cartItems = document.getElementById("cart-items");
  const tbody     = document.getElementById("cart-tbody");
  const count     = document.getElementById("cart-count");

  const ids    = Object.keys(cart).map(Number);
  const total  = ids.reduce((s, id) => s + cart[id], 0);

  // Badge
  count.textContent = total;

  if (ids.length === 0) {
    cartEmpty.style.display = "block";
    cartItems.style.display = "none";
    return;
  }

  cartEmpty.style.display = "none";
  cartItems.style.display = "block";

  // Build rows
  tbody.innerHTML = ids.map(id => {
    const p     = PRODUCTS.find(x => x.id === id);
    const qty   = cart[id];
    const line  = p.price * qty;
    return `
      <tr>
        <td><strong>${p.emoji} ${p.name}</strong></td>
        <td>₹${p.price.toLocaleString("en-IN")}</td>
        <td>
          <div class="qty-control">
            <button class="btn-qty" onclick="updateQty(${id}, -1)">−</button>
            <span class="qty-display">${qty}</span>
            <button class="btn-qty" onclick="updateQty(${id}, 1)">+</button>
          </div>
        </td>
        <td><strong>₹${line.toLocaleString("en-IN")}</strong></td>
        <td>
          <button class="btn-remove" onclick="removeFromCart(${id})" title="Remove">🗑</button>
        </td>
      </tr>`;
  }).join("");

  // Totals
  updatePriceSummary(
    "summary-subtotal",
    "summary-tax",
    "summary-total"
  );
}

/* ══════════════════════════════════════════════════════
   7. PRICE CALCULATION
══════════════════════════════════════════════════════ */
function calcTotals() {
  const subtotal = Object.keys(cart).reduce((s, id) => {
    const p = PRODUCTS.find(x => x.id === Number(id));
    return s + (p ? p.price * cart[id] : 0);
  }, 0);
  const tax   = Math.round(subtotal * TAX_RATE);
  const total = subtotal + tax;
  return { subtotal, tax, total };
}

function formatINR(n) {
  return "₹" + n.toLocaleString("en-IN");
}

function updatePriceSummary(subId, taxId, totalId) {
  const { subtotal, tax, total } = calcTotals();
  document.getElementById(subId).textContent   = formatINR(subtotal);
  document.getElementById(taxId).textContent   = formatINR(tax);
  document.getElementById(totalId).textContent = formatINR(total);
}

/* ══════════════════════════════════════════════════════
   8. CHECKOUT
══════════════════════════════════════════════════════ */
function showCheckout() {
  if (!Object.keys(cart).length) {
    alert("Your cart is empty!");
    return;
  }
  // Populate order summary
  const list = document.getElementById("co-items-list");
  list.innerHTML = Object.keys(cart).map(id => {
    const p = PRODUCTS.find(x => x.id === Number(id));
    return `<div class="co-item">
      <span>${p.emoji} ${p.name} × ${cart[id]}</span>
      <span>₹${(p.price * cart[id]).toLocaleString("en-IN")}</span>
    </div>`;
  }).join("");

  updatePriceSummary("co-subtotal", "co-tax", "co-total");

  document.getElementById("cart-section").style.display       = "none";
  document.getElementById("checkout-section").style.display   = "block";
  document.getElementById("checkout-section").scrollIntoView({ behavior: "smooth" });
}

function cancelCheckout() {
  document.getElementById("checkout-section").style.display   = "none";
  document.getElementById("cart-section").style.display       = "block";
  document.getElementById("cart-section").scrollIntoView({ behavior: "smooth" });
}

/* ══════════════════════════════════════════════════════
   9. PLACE ORDER (VALIDATION + CONFIRMATION)
══════════════════════════════════════════════════════ */
function placeOrder() {
  const name    = document.getElementById("co-name").value.trim();
  const email   = document.getElementById("co-email").value.trim();
  const phone   = document.getElementById("co-phone").value.trim();
  const address = document.getElementById("co-address").value.trim();
  const payment = document.querySelector("input[name='payment']:checked").value;

  // Basic validation
  const errors = [];
  if (!name)                          errors.push("Full Name is required.");
  if (!email || !email.includes("@")) errors.push("A valid email is required.");
  if (!phone || !/^\d{7,}$/.test(phone)) errors.push("A valid phone number is required.");
  if (!address)                       errors.push("Delivery address is required.");

  if (errors.length) {
    alert("Please fix the following:\n\n• " + errors.join("\n• "));
    return;
  }

  const { total } = calcTotals();
  const payLabel  = { card: "Credit/Debit Card", upi: "UPI", cod: "Cash on Delivery" }[payment];
  const orderId   = "SWV-" + Date.now().toString(36).toUpperCase();

  document.getElementById("confirm-msg").textContent =
    `Hi ${name}! Your order #${orderId} worth ${formatINR(total)} has been placed via ${payLabel}.`;

  // Hide checkout, show confirmation
  document.getElementById("checkout-section").style.display     = "none";
  document.getElementById("confirmation-section").style.display = "block";
  document.getElementById("confirmation-section").scrollIntoView({ behavior: "smooth" });
}

/* ══════════════════════════════════════════════════════
   10. RESET AFTER ORDER
══════════════════════════════════════════════════════ */
function resetAfterOrder() {
  // Clear cart
  cart = {};
  saveCartToSession();
  PRODUCTS.forEach(p => updateAddButton(p.id, false));
  renderCart();

  // Clear form
  ["co-name","co-email","co-phone","co-address"].forEach(id => {
    document.getElementById(id).value = "";
  });

  // Hide confirmation, show sections
  document.getElementById("confirmation-section").style.display = "none";
  document.getElementById("cart-section").style.display         = "block";

  // Scroll to top
  window.scrollTo({ top: 0, behavior: "smooth" });
}

/* ══════════════════════════════════════════════════════
   11. UTILS
══════════════════════════════════════════════════════ */
function scrollToCart() {
  document.getElementById("cart-section").scrollIntoView({ behavior: "smooth" });
}

function animateBadge() {
  const badge = document.getElementById("cart-count");
  badge.style.transform = "scale(1.5)";
  setTimeout(() => { badge.style.transform = "scale(1)"; }, 200);
}

/* ══════════════════════════════════════════════════════
   12. INIT
══════════════════════════════════════════════════════ */
document.addEventListener("DOMContentLoaded", () => {
  renderProducts(PRODUCTS);
  renderCart();
});
