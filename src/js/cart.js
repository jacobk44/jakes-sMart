/* Cart functionality for cart.html
   Features:
   - Display cart items from localStorage
   - Update cart total
   - Remove items and clear cart
   - Notifications for cart actions
*/

const cartCount = document.getElementById("cartCount");
const cartItemsEl = document.getElementById("cartItems");
const cartTotalEl = document.getElementById("cartTotal");
const closeCartBtn = document.getElementById("closeCartBtn");
const clearCartBtn = document.getElementById("clearCartBtn");

// State
let cart = JSON.parse(localStorage.getItem("cart") || "[]");

// Initialize
updateCartUI();
attachCartListeners();
requestNotificationPermission();

// ----- Cart functions -----
function removeFromCart(index) {
  cart.splice(index, 1);
  persistCart();
  updateCartUI();
  showNotification("🗑️ Item removed", "Item removed from cart.");
}

function clearCart() {
  cart = [];
  persistCart();
  updateCartUI();
  showNotification("🗑️ Cart cleared", "All items removed.");
}

function persistCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function updateCartUI() {
  // Update cart count (if element exists, e.g., on a header)
  if (cartCount) cartCount.textContent = cart.length;

  // Update cart items and total (if elements exist)
  if (cartItemsEl && cartTotalEl) {
    cartItemsEl.innerHTML = "";
    let total = 0;
    if (cart.length === 0) {
      cartItemsEl.innerHTML = "<li>Your cart is empty.</li>";
    } else {
      cart.forEach((item, idx) => {
        total += Number(item.price);
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
    cartTotalEl.textContent = total.toFixed(2);

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
      }
    });
  }
}

// ----- Notifications -----
function requestNotificationPermission() {
  if (!("Notification" in window)) return;
  if (Notification.permission === "default") {
    Notification.requestPermission().catch(() => {});
  }
}

function showNotification(title, body = "") {
  if (!("Notification" in window)) return;
  if (Notification.permission === "granted") {
    new Notification(title, { body, icon: "" });
  }
}

// ----- Utility -----
function escapeHtml(text) {
  if (!text) return "";
  return text.replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[m]);
}