// Load cart from localStorage, default to empty array
let cart = JSON.parse(localStorage.getItem('cart')) || [];
console.log('Initial cart on checkout load:', cart); // Debug log

// Update cart count in header
function updateCartCount() {
    const cartCount = cart.reduce((sum, item) => sum + (Number(item.quantity) || 1), 0);
    const cartCountElement = document.getElementById('cartCount');
    if (cartCountElement) cartCountElement.textContent = cartCount || 0;
    console.log('Cart count on load:', cartCount); // Debug log
}

// Display cart items in order summary
async function displayCartItems() {
    const orderItemsList = document.getElementById('orderItems');
    if (!orderItemsList) {
        console.error('Order items list (#orderItems) not found in DOM');
        return;
    }
    orderItemsList.innerHTML = ''; // Clear existing items

    if (cart.length === 0) {
        orderItemsList.innerHTML = '<li>No items in cart.</li>';
        console.warn('Cart is empty on checkout'); // Debug log
        return;
    }

    try {
        const response = await fetch('https://fakestoreapi.com/products');
        if (!response.ok) throw new Error('Failed to fetch products');
        const products = await response.json();
        console.log('Fetched products:', products); // Debug log

        let itemsDisplayed = 0;
        cart.forEach(item => {
            const product = products.find(p => p.id === item.id);
            if (product) {
                const quantity = Number(item.quantity) || 1;
                const price = Number(product.price) || 0;
                if (quantity > 0 && price > 0) {
                    const li = document.createElement('li');
                    li.innerHTML = `<label>${escapeHtml(product.title)} (x${quantity})</label><p>$${(price * quantity).toFixed(2)}</p>`;
                    orderItemsList.appendChild(li);
                    itemsDisplayed++;
                } else {
                    console.warn(`Invalid item: ${product.title}, price: ${price}, quantity: ${quantity}`);
                }
            } else {
                console.warn(`Product not found for id: ${item.id}`);
            }
        });
        console.log(`Displayed ${itemsDisplayed} items from cart:`, cart); // Debug log
        if (itemsDisplayed === 0) {
            orderItemsList.innerHTML = '<li>No valid items to display.</li>';
        }
    } catch (error) {
        console.error('Error fetching products:', error);
        orderItemsList.innerHTML = '<li>Error loading items.</li>';
    }
}

// Update order summary
function updateSummary() {
    const numItems = cart.reduce((sum, item) => sum + (Number(item.quantity) || 1), 0);
    const subtotal = cart.reduce((sum, item) => {
        // Use price from localStorage cart if available, fallback to 0
        const price = Number(item.price) || 0;
        const quantity = Number(item.quantity) || 1;
        return sum + (isNaN(price) || isNaN(quantity) ? 0 : price * quantity);
    }, 0);
    const shipping = numItems > 0 ? 5.00 : 0.00; // $5 shipping if cart not empty
    const taxRate = 0.08; // 8% tax
    const tax = subtotal * taxRate;
    const total = subtotal + shipping + tax;

    const numItemsElement = document.getElementById('num-items');
    const cartTotalElement = document.getElementById('cartTotal');
    const shippingElement = document.getElementById('shipping');
    const taxElement = document.getElementById('tax');
    const orderTotalElement = document.getElementById('orderTotal');

    if (numItemsElement) numItemsElement.textContent = numItems || 0;
    if (cartTotalElement) cartTotalElement.textContent = `$${subtotal.toFixed(2)}`;
    if (shippingElement) shippingElement.textContent = `$${shipping.toFixed(2)}`;
    if (taxElement) taxElement.textContent = `$${tax.toFixed(2)}`;
    if (orderTotalElement) orderTotalElement.textContent = `$${total.toFixed(2)}`;

    // Disable submit button if cart is empty or invalid
    const checkoutSubmit = document.getElementById('checkoutSubmit');
    if (checkoutSubmit) checkoutSubmit.disabled = numItems === 0;

    console.log('Calculated Summary - Subtotal: $' + subtotal.toFixed(2) + ', Shipping: $' + shipping.toFixed(2) + ', Tax: $' + tax.toFixed(2) + ', Total: $' + total.toFixed(2)); // Debug log
}

// Handle form submission
async function handleCheckout(event) {
    event.preventDefault();

    const form = document.getElementById('checkoutForm');
    if (form && !form.checkValidity()) {
        form.reportValidity();
        return;
    }

    if (cart.length === 0) {
        alert('Your cart is empty. Please add items before checking out.');
        return;
    }

    // Collect shipping info
    const shipping = {
        firstName: document.getElementById('fname')?.value || '',
        lastName: document.getElementById('lname')?.value || '',
        street: document.getElementById('street')?.value || '',
        city: document.getElementById('city')?.value || '',
        state: document.getElementById('state')?.value || '',
        zip: document.getElementById('zip')?.value || '',
    };

    console.log('Cart sent to server:', cart); // Debug log
    try {
        const response = await fetch('/create-checkout-session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ cart, shipping }),
        });

        if (!response.ok) {
            throw new Error('Failed to create checkout session');
        }

        const { url } = await response.json();
        window.location = url; // Redirect to Stripe Checkout
    } catch (error) {
        console.error('Error in checkout:', error);
        alert('Checkout failed. Please try again.');
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    updateCartCount();
    await displayCartItems(); // Await API fetch
    updateSummary();
    const form = document.getElementById('checkoutForm');
    if (form) form.addEventListener('submit', handleCheckout);
});

// Utility function for escaping HTML
function escapeHtml(text) {
    if (!text) return "";
    return text.replace(/[&<>"']/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[m]);
}