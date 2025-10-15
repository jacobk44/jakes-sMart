// js/main.js
import { addToCart, getCart } from "./storage.mjs";

const API_URL = "https://fakestoreapi.com/products?limit=12";

// DOM elements
const productList = document.querySelector("#productList");
const cartCount = document.querySelector("#cartCount");
const searchInput = document.querySelector("#searchInput");

// Detail modal elements
const detailModal = document.querySelector("#detailModal");
const detailTitle = document.querySelector("#detailTitle");
const detailBody = document.querySelector("#detailBody");
const closeDetailBtn = document.querySelector("#closeDetailBtn");
const detailAddBtn = document.querySelector("#detailAddBtn");

let products = [];
let currentProduct = null;

// Load products from API
async function loadProducts() {
    try {
        const res = await fetch(API_URL);
        products = await res.json();
        renderProducts(products);
    } catch (err) {
        productList.innerHTML = "<p>❌ Failed to load products. Check connection.</p>";
    }
}

// Render product cards
function renderProducts(list) {
    productList.innerHTML = list
        .map(
            (p) => `
      <div class="product-card">
        <img src="${p.image}" alt="${p.title}" class="product-img" data-id="${p.id}" />
        <h3>${p.title}</h3>
        <p class="price">$${p.price.toFixed(2)}</p>
        <button class="add-btn" data-id="${p.id}">Add to Cart</button>
      </div>
    `
        )
        .join("");

    // Add to cart buttons
    document.querySelectorAll(".add-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
            const product = products.find((p) => p.id == btn.dataset.id);
            addToCart(product);
            updateCartCount();
            alert("✅ Added to cart!");
        });
    });

    // Product image click (open modal)
    document.querySelectorAll(".product-img").forEach((img) => {
        img.addEventListener("click", () => {
            const product = products.find((p) => p.id == img.dataset.id);
            showDetailModal(product);
        });
    });
}

// Show product detail modal
function showDetailModal(product) {
    currentProduct = product;
    detailTitle.textContent = product.title;
    detailBody.innerHTML = `
    <img src="${product.image}" alt="${product.title}" class="detail-img">
    <p><strong>Price:</strong> $${product.price.toFixed(2)}</p>
    <p><strong>Category:</strong> ${product.category}</p>
    <p>${product.description}</p>
  `;
    detailModal.classList.remove("hidden");
    detailModal.setAttribute("aria-hidden", "false");
}

// Close modal
function closeModal() {
    detailModal.classList.add("hidden");
    detailModal.setAttribute("aria-hidden", "true");
}

// Add current product to cart from modal
detailAddBtn.addEventListener("click", () => {
    if (currentProduct) {
        addToCart(currentProduct);
        updateCartCount();
        alert("✅ Added to cart!");
        closeModal();
    }
});

// Close button
closeDetailBtn.addEventListener("click", closeModal);

// Click outside modal to close
detailModal.addEventListener("click", (e) => {
    if (e.target === detailModal) closeModal();
});

// Update cart count
function updateCartCount() {
    const cart = getCart();
    cartCount.textContent = cart.length;
}

// Search filter
searchInput.addEventListener("input", (e) => {
    const q = e.target.value.toLowerCase();
    const filtered = products.filter((p) =>
        p.title.toLowerCase().includes(q)
    );
    renderProducts(filtered);
});

// Initialize
updateCartCount();
loadProducts();
