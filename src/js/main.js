// js/main.js
import { addToCart, getCart } from "./storage.mjs";

const API_URL = "https://fakestoreapi.com/products?limit=12";
const productList = document.querySelector("#productList");
const cartCount = document.querySelector("#cartCount");
const searchInput = document.querySelector("#searchInput");

let products = [];

async function loadProducts() {
    try {
        const res = await fetch(API_URL);
        products = await res.json();
        renderProducts(products);
    } catch (err) {
        productList.innerHTML = "<p>❌ Failed to load products. Check connection.</p>";
    }
}

function renderProducts(list) {
    productList.innerHTML = list.map(p => `
    <div class="product-card">
      <img src="${p.image}" alt="${p.title}" class="product-img" />
      <h3>${p.title}</h3>
      <p class="price">$${p.price.toFixed(2)}</p>
      <button class="add-btn" data-id="${p.id}" data-title="${p.title}" data-price="${p.price}" data-image="${p.image}">
        Add to Cart
      </button>
    </div>
  `).join("");

    document.querySelectorAll(".add-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const item = {
                id: btn.dataset.id,
                title: btn.dataset.title,
                price: parseFloat(btn.dataset.price),
                image: btn.dataset.image
            };
            addToCart(item);
            updateCartCount();
            alert("✅ Added to cart!");
        });
    });
}

function updateCartCount() {
    const cart = getCart();
    cartCount.textContent = cart.length;
}

searchInput.addEventListener("input", (e) => {
    const q = e.target.value.toLowerCase();
    const filtered = products.filter(p => p.title.toLowerCase().includes(q));
    renderProducts(filtered);
});

updateCartCount();
loadProducts();
