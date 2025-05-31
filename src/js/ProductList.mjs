import { renderListWithTemplate } from "./utils.mjs";

function productCardTemplate(product) {
  return `
    <li class="product-card">
      <a href="/src/product_pages/index.html?id=${product.Id}">
        <img src="${product.Images.PrimaryMedium}" alt="${product.Name}">
        <h2>${product.Brand.Name}</h2>
        <h3>${product.Name}</h3>
        <p class="product-card__price">$${product.FinalPrice}</p>
      </a>
      <button class="quick-view" data-id="${product.Id}">Quick View</button>
      <button class="add-to-cart" data-id="${product.Id}">Add to Cart</button>
    </li>
  `;
}

export default class ProductList {
  constructor(category, dataSource, listElement) {
    this.category = category;
    this.dataSource = dataSource;
    this.listElement = listElement;
    this.products = []; // Almacenar productos para reutilización
  }

  async init() {
    this.products = await this.dataSource.getData(this.category);
    this.renderList(this.products);
  }

  renderList(list) {
    renderListWithTemplate(productCardTemplate, this.listElement, list);
    this.addCartListeners();
    this.addQuickViewListeners();
  }

  addQuickViewListeners() {
    const buttons = document.querySelectorAll(".quick-view");
    buttons.forEach((button) => {
      button.addEventListener("click", async (e) => {
        e.preventDefault();
        const id = e.target.dataset.id;
        const product = this.products.find(p => p.Id === id) || 
                       await this.dataSource.findProductById(id);
        this.showQuickView(product);
      });
    });

    document.querySelector(".close-modal").addEventListener("click", () => {
      document.getElementById("quickViewModal").style.display = "none";
    });
  }

  showQuickView(product) {
    const modal = document.getElementById("quickViewModal");
    const content = document.getElementById("quickViewContent");
    
    content.innerHTML = `
      <div class="quick-view-container">
        <img src="${product.Images.PrimaryLarge}" alt="${product.Name}">
        <div class="quick-view-details">
          <h2>${product.Brand.Name} ${product.Name}</h2>
          <p class="price">$${product.FinalPrice}</p>
          <p>${product.Description || 'No description available'}</p>
          <button class="add-to-cart-modal" data-id="${product.Id}">Add to Cart</button>
        </div>
      </div>
    `;

    modal.style.display = "block";
    
    // Añadir listener para el botón dentro del modal
    document.querySelector(".add-to-cart-modal").addEventListener("click", (e) => {
      this.addToCart(product);
      modal.style.display = "none";
    });

    window.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.style.display = "none";
      }
    });
  }

  addCartListeners() {
    const buttons = document.querySelectorAll(".add-to-cart");
    buttons.forEach((button) => {
      button.addEventListener("click", async (e) => {
        e.preventDefault();
        const id = e.target.dataset.id;
        const product = this.products.find(p => p.Id === id) || 
                       await this.dataSource.findProductById(id);
        this.addToCart(product);
      });
    });
  }

  addToCart(product) {
    const cart = JSON.parse(localStorage.getItem("so-cart")) || [];
    
    // Verificar si el producto ya está en el carrito
    const existingItem = cart.find(item => item.Id === product.Id);
    if (existingItem) {
      existingItem.quantity = (existingItem.quantity || 1) + 1;
    } else {
      product.quantity = 1;
      cart.push(product);
    }
    
    localStorage.setItem("so-cart", JSON.stringify(cart));
    alert(`${product.Name} added to cart (Total: ${existingItem ? existingItem.quantity : 1})`);
  }
}
