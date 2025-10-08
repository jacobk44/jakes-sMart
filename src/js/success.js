// Show modal on page load (already set to active via CSS class)
const modal = document.getElementById("successModal");
const closeModal = document.getElementById("closeModal");

// Close modal and redirect when "Continue Shopping" is clicked
closeModal.addEventListener("click", () => {
    modal.classList.remove("active");
    window.location.href = "../index.html";
});

// Optional: Clear cart after successful payment
localStorage.removeItem("cart");