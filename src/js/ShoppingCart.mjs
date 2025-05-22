import { renderListWithTemplate, getLocalStorage } from "./utils.mjs";

function cartItemTemplate(item) {
  return `
    <li class="cart-card divider">
      <a href="#" class="cart-card__image">
        <img src="${item.Image}" alt="${item.Name}">
      </a>
      <a href="#">
        <h2 class="card__name">${item.Name}</h2>
      </a>
      <p class="cart-card__color">${item.Colors ? item.Colors[0].ColorName : 'N/A'}</p>
      <p class="cart-card__quantity">Quantity: ${item.Quantity || 1}</p>
      <p class="cart-card__price">$${item.FinalPrice}</p>
      <button class="cart-card__remove" data-id="${item.Id}">Remove</button>
    </li>
  `;
}

export default class ShoppingCart {
  constructor(listElement) {
    this.listElement = listElement;
    this.cartItems = getLocalStorage("so-cart") || [];
  }

  init() {
    if (this.cartItems.length === 0) {
      this.renderEmptyCart();
    } else {
      this.renderCart();
    }
  }

  renderCart() {
    renderListWithTemplate(
      cartItemTemplate,
      this.listElement,
      this.cartItems,
      this.prepareCart.bind(this)
    );
  }

  prepareCart(cartItemElement, item) {
    // Añadir eventos a los botones "Remove"
    const removeButton = cartItemElement.querySelector(".cart-card__remove");
    removeButton.addEventListener("click", () => this.removeItem(item.Id));
    return cartItemElement;
  }

  removeItem(productId) {
    this.cartItems = this.cartItems.filter(item => item.Id !== productId);
    localStorage.setItem("so-cart", JSON.stringify(this.cartItems));
    this.init(); // Re-renderizar
  }

  renderEmptyCart() {
    this.listElement.innerHTML = `
      <li>
        <p>Your cart is empty. <a href="../index.html">Keep shopping</a>!</p>
      </li>
    `;
  }
}