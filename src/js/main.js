// js/main.js
const productList = document.querySelector("#productList");
const searchInput = document.querySelector("#searchInput");
const cartCount = document.querySelector("#cartCount");

async function fetchProducts() {
    try {
        const response = await fetch("https://fakestoreapi.com/products");
        if (!response.ok) throw new Error("Failed to load products");
        const products = await response.json();
        displayProducts(products);

        // Enable live search
        searchInput.addEventListener("input", (e) => {
            const searchText = e.target.value.toLowerCase();
            const filtered = products.filter(p =>
                p.title.toLowerCase().includes(searchText)
            );
            displayProducts(filtered);
        });

    } catch (err) {
        productList.innerHTML = `<p class="error">⚠️ ${err.message}</p>`;
    }
}

function displayProducts(products) {
    productList.innerHTML = products.map(product => `
    <div class="product-card">
      <img src="${product.image}" alt="${product.title}" class="product-img" />
      <h3>${product.title}</h3>
      <p class="price">$${product.price.toFixed(2)}</p>
      <button class="add-btn" data-id="${product.id}">Add to Cart</button>
    </div>
  `).join("");

    // Add event listeners to buttons
    document.querySelectorAll(".add-btn").forEach(btn => {
        btn.addEventListener("click", () => addToCart(btn.dataset.id));
    });
}

function addToCart(id) {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.push(id);
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    alert("✅ Added to cart!");
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    cartCount.textContent = cart.length;
}

updateCartCount();
fetchProducts();
