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
    const subtotal = cart.reduce((sum, item) => {
        const price = Number(item.price) || 0;
        const quantity = Number(item.quantity) || 1; // Default to 1 if no quantity
        return sum + (isNaN(price) || isNaN(quantity) ? 0 : price * quantity);
    }, 0);
    const shipping = cart.length > 0 ? 5.00 : 0.00; // $5 shipping
    const tax = subtotal * 0.08; // 8% tax
    return (subtotal + shipping + tax).toFixed(2);
}