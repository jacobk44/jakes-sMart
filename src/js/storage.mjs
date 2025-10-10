// js/storage.mjs

// Get cart from localStorage
export function getCart() {
    return JSON.parse(localStorage.getItem("cart")) || [];
}

// Save cart to localStorage
export function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
}

// Add item to cart
export function addToCart(item) {
    const cart = getCart();
    cart.push(item);
    saveCart(cart);
}

// Clear cart
export function clearCart() {
    localStorage.removeItem("cart");
}

// Get total price
export function getTotal(cart) {
    return cart.reduce((sum, item) => sum + Number(item.price), 0).toFixed(2);
}
