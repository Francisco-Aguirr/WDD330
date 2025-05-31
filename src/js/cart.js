import { getLocalStorage, loadHeaderFooter } from "./utils.mjs";
loadHeaderFooter();

function renderCartContents() {
  const cartItems = getLocalStorage("so-cart") || [];
  const productList = document.querySelector(".product-list");
  
  if (cartItems.length === 0) {
    productList.innerHTML = "<p>Your cart is empty.</p>";
    // Ocultar total si no hay items
    const totalElement = document.querySelector(".cart-total");
    if (totalElement) totalElement.style.display = "none";
    return;
  }

  // Generar HTML de los items
  const htmlItems = cartItems.map((item) => cartItemTemplate(item));
  productList.innerHTML = htmlItems.join("");

  // Añadir event listeners a los botones
  addCartEventListeners();

  // Calcular y mostrar el total
  displayTotal(cartItems);
}

function cartItemTemplate(item) {
  const quantity = item.quantity || 1;
  const itemTotal = (item.FinalPrice * quantity).toFixed(2);

  return `<li class="cart-card divider">
    <a href="#" class="cart-card__image">
      <img src="${item.Images?.PrimaryMedium || "default-image.jpg"}" alt="${item.Name}" />
    </a>
    <a href="#">
      <h2 class="card__name">${item.Name}</h2>
    </a>
    <p class="cart-card__color">${item.Colors?.[0]?.ColorName || "No color info"}</p>
    <div class="cart-card__quantity">
      <button class="quantity-btn decrease" data-id="${item.Id}">-</button>
      <span class="quantity-value">${quantity}</span>
      <button class="quantity-btn increase" data-id="${item.Id}">+</button>
    </div>
    <p class="cart-card__price">$${itemTotal}</p>
    <button class="delete-btn" data-id="${item.Id}">🗑️ Remove</button>
  </li>`;
}

function addCartEventListeners() {
  // Eliminar producto
  document.querySelectorAll(".delete-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const id = e.target.dataset.id;
      removeFromCart(id);
    });
  });

  // Cambiar cantidad
  document.querySelectorAll(".quantity-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const id = e.target.dataset.id;
      const isIncrease = e.target.classList.contains("increase");
      updateQuantity(id, isIncrease);
    });
  });
}

function removeFromCart(id) {
  let cartItems = getLocalStorage("so-cart") || [];
  cartItems = cartItems.filter(item => item.Id !== id);
  localStorage.setItem("so-cart", JSON.stringify(cartItems));
  renderCartContents(); // Refrescar la vista
}

function updateQuantity(id, isIncrease) {
  let cartItems = getLocalStorage("so-cart") || [];
  const itemIndex = cartItems.findIndex(item => item.Id === id);
  if (itemIndex !== -1) {
    const item = cartItems[itemIndex];
    item.quantity = (item.quantity || 1) + (isIncrease ? 1 : -1);
    
    // Eliminar si la cantidad llega a 0
    if (item.quantity < 1) {
      cartItems.splice(itemIndex, 1);
    }
    
    localStorage.setItem("so-cart", JSON.stringify(cartItems));
    renderCartContents();
  }
  const quantityElement = document.querySelector(`[data-id="${id}"] + .quantity-value`);
  quantityElement.classList.add('changed');
  setTimeout(() => quantityElement.classList.remove('changed'), 200);
}

function displayTotal(cartItems) {
  // Calcular total (precio * cantidad)
  const total = cartItems.reduce(
    (sum, item) => sum + (item.FinalPrice * (item.quantity || 1)), 
    0
  ).toFixed(2);

  // Crear o actualizar elemento del total
  let totalElement = document.querySelector(".cart-total");
  if (!totalElement) {
    totalElement = document.createElement("div");
    totalElement.className = "cart-total";
    document.querySelector("main").appendChild(totalElement);
  }
  
  totalElement.innerHTML = `
    <div class="total-content">
      <h3>Subtotal (${cartItems.reduce((acc, item) => acc + (item.quantity || 1), 0)} items): $${total}</h3>
      <button class="checkout-btn">Proceed to Checkout</button>
    </div>
  `;
  
  // Opcional: Añadir evento al botón de checkout
  const checkoutBtn = totalElement.querySelector(".checkout-btn");
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
      window.location.href = "/checkout/index.html";
    });
  }
}

// Inicializar
renderCartContents();