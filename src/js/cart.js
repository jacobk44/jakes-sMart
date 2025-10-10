/* Cart functionality for cart.html
   Features:
   - Display cart items from localStorage using storage.mjs
   - Update cart total
   - Remove items and clear cart
*/

import { getCart, saveCart, clearCart, getTotal } from './storage.mjs';

// DOM Elements
const cartCount = document.getElementById("cartCount");
const cartItemsEl = document.getElementById("cartItems");
const cartTotalEl = document.getElementById("cartTotal");
const closeCartBtn = document.getElementById("closeCartBtn");
const clearCartBtn = document.getElementById("clearCartBtn");

// State
let cart = getCart();

// Initialize
updateCartUI();
attachCartListeners();

// ----- Cart functions -----
function removeFromCart(index) {
    cart.splice(index, 1);
    saveCart(cart);
    updateCartUI();
}

function updateCartUI() {
    // Update cart count (if element exists, e.g., on a header)
    if (cartCount) cartCount.textContent = cart.length;

    // Update cart items and total (if elements exist)
    if (cartItemsEl && cartTotalEl) {
        cartItemsEl.innerHTML = "";
        if (cart.length === 0) {
            cartItemsEl.innerHTML = "<li>Your cart is empty.</li>";
        } else {
            cart.forEach((item, idx) => {
                const li = document.createElement("li");
                li.innerHTML = `
          <div class="meta">
            <img src="${item.image}" alt="${escapeHtml(item.title)}" style="width:50px;height:50px;object-fit:contain;">
            <div>
              <div style="font-weight:600">${escapeHtml(item.title)}</div>
              <div style="font-size:0.9rem;color:var(--muted)">$${Number(item.price).toFixed(2)}</div>
            </div>
          </div>
          <div>
            <button class="btn-sm remove" data-index="${idx}">Remove</button>
          </div>
        `;
                cartItemsEl.appendChild(li);
            });
        }
        cartTotalEl.textContent = getTotal(cart);

        // Attach remove listeners
        cartItemsEl.querySelectorAll(".remove").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const i = Number(e.currentTarget.dataset.index);
                removeFromCart(i);
            });
        });
    }
}

// ----- Cart listeners -----
function attachCartListeners() {
    if (closeCartBtn) {
        closeCartBtn.addEventListener("click", () => {
            window.location.href = "../index.html"; // Adjust to your main page path
        });
    }
    if (clearCartBtn) {
        clearCartBtn.addEventListener("click", () => {
            if (!cart.length) return;
            if (confirm("Clear cart?")) {
                clearCart();
                cart = getCart(); // Update local cart state
                updateCartUI();
            }
        });
    }
}

// ----- Utility -----
function escapeHtml(text) {
    if (!text) return "";
    return text.replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[m]);
}