import { getLocalStorage } from "../js/utils.mjs";
import ExternalServices from './ExternalServices.mjs';

export default class CheckoutProcess {
    constructor() {
        this.cartItems = JSON.parse(localStorage.getItem('so-cart')) || [];
        this.services = new ExternalServices();
        this.init();
    }

    init() {
        // Configuración única del evento
        const submitBtn = document.getElementById('submitOrder');
        submitBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.submitOrder();
        });
        
        this.calculateOrderSummary();
    }

    packageItems(items) {
        return items.map(item => ({
            id: item.Id,
            name: item.Name,
            price: item.FinalPrice,
            quantity: item.quantity || 1
        }));
    }

    calculateOrderSummary() {
        const subtotal = this.cartItems.reduce((sum, item) => sum + (item.FinalPrice * (item.quantity || 1)), 0);
        const tax = subtotal * 0.06;
        const shipping = 10 + (this.cartItems.length > 1 ? (this.cartItems.length - 1) * 2 : 0);
        const total = subtotal + tax + shipping;

        // Actualizar UI
        document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
        document.getElementById('tax').textContent = `$${tax.toFixed(2)}`;
        document.getElementById('shipping').textContent = `$${shipping.toFixed(2)}`;
        document.getElementById('total').textContent = `$${total.toFixed(2)}`;

        return { subtotal, tax, shipping, total };
    }

    async submitOrder() {
        console.log("Botón clickeado - Iniciando checkout"); // Debug
        
        if (!this.validateForm()) {
            this.showError('Please fill all required fields');
            return;
        }

        try {
            const order = this.buildOrder();
            console.log("Order data:", order); // Debug
            
            const response = await this.services.checkout(order);
            console.log("Server response:", response); // Debug
            
            if (response.error) throw new Error(response.error);
            
            this.completeCheckout(response);
        } catch (err) {
            console.error("Checkout error:", err);
            this.showError(err.message || "Checkout failed");
        }
    }

    buildOrder() {
        const form = document.getElementById('checkoutForm');
        const summary = this.calculateOrderSummary();

        return {
            orderDate: new Date().toISOString(),
            fname: form.querySelector('#firstName').value,
            lname: form.querySelector('#lastName').value,
            street: form.querySelector('#street').value,
            city: form.querySelector('#city').value,
            state: form.querySelector('#state').value,
            zip: form.querySelector('#zip').value,
            cardNumber: form.querySelector('#cardNumber').value,
            expiration: form.querySelector('#expDate').value,
            code: form.querySelector('#cvv').value,
            items: this.packageItems(this.cartItems),
            orderTotal: summary.total.toFixed(2),
            shipping: summary.shipping.toFixed(2),
            tax: summary.tax.toFixed(2)
        };
    }

    validateForm() {
        const requiredIds = ['firstName', 'lastName', 'street', 'city', 'state', 'zip', 'cardNumber', 'expDate', 'cvv'];
        let isValid = true;

        requiredIds.forEach(id => {
            const field = document.getElementById(id);
            if (!field.value.trim()) {
                field.classList.add('error');
                isValid = false;
            } else {
                field.classList.remove('error');
            }
        });

        return isValid;
    }

    showError(message) {
        const errorElement = document.getElementById('checkoutError');
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }

    completeCheckout(response) {
        localStorage.removeItem('so-cart');
        window.location.href = `/confirmation.html?orderId=${response.orderId || 'TEST'}`;
    }
}

new CheckoutProcess();