import { getLocalStorage } from "../js/utils.mjs";

export default class CheckoutProcess {
    constructor() {
        this.cartItems = getLocalStorage("so-cart") || [];
        this.subtotal = 0;
        this.tax = 0;
        this.shipping = 0;
        this.total = 0;
        
        this.init();
    }

    init() {
        this.calculateSubtotal();
        document.getElementById("zip").addEventListener("blur", () => this.calculateTotals());
        document.getElementById("submitOrder").addEventListener("click", (e) => this.submitOrder(e));
    }

    calculateSubtotal() {
        this.subtotal = this.cartItems.reduce((sum, item) => {
            return sum + (item.FinalPrice * (item.quantity || 1));
        }, 0);
        
        document.getElementById("subtotal").textContent = `$${this.subtotal.toFixed(2)}`;
    }

    calculateTotals() {
        // Tax (6%)
        this.tax = this.subtotal * 0.06;
        
        // Shipping ($10 + $2 per additional item)
        const itemCount = this.cartItems.reduce((count, item) => count + (item.quantity || 1), 0);
        this.shipping = 10 + (itemCount > 1 ? (itemCount - 1) * 2 : 0);
        
        this.total = this.subtotal + this.tax + this.shipping;
        
        // Update UI
        document.getElementById("tax").textContent = `$${this.tax.toFixed(2)}`;
        document.getElementById("shipping").textContent = `$${this.shipping.toFixed(2)}`;
        document.getElementById("total").textContent = `$${this.total.toFixed(2)}`;
    }

    submitOrder(e) {
        e.preventDefault();
        
        if (!this.validateForm()) {
            alert("Please fill out all required fields");
            return;
        }
        
        // En una aplicación real, aquí enviarías los datos al servidor
        alert("Order submitted successfully!");
        localStorage.removeItem("so-cart");
        window.location.href = "/index.html";
    }

    validateForm() {
        const requiredFields = [
            "firstName", "lastName", "street", 
            "city", "state", "zip", 
            "cardNumber", "expDate", "cvv"
        ];
        
        return requiredFields.every(id => {
            const value = document.getElementById(id).value.trim();
            return value !== "";
        });
    }
}

// Inicialización
new CheckoutProcess();