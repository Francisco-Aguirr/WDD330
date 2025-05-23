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
      <button class="add-to-cart" data-id="${product.Id}">Add to Cart</button>
    </li>
  `;
}

export default class ProductList {
  constructor(category, dataSource, listElement) {
    this.category = category;
    this.dataSource = dataSource;
    this.listElement = listElement;
  }

  async init() {
    const list = await this.dataSource.getData(this.category);
    this.renderList(list);
  }

  renderList(list) {
    renderListWithTemplate(productCardTemplate, this.listElement, list);
    this.addCartListeners();
  }

  addCartListeners() {
    const buttons = document.querySelectorAll(".add-to-cart");
    buttons.forEach((button) => {
      button.addEventListener("click", async (e) => {
        const id = e.target.dataset.id;
        const product = await this.dataSource.findProductById(id);

        const cart = JSON.parse(localStorage.getItem("so-cart")) || [];
        cart.push(product);
        localStorage.setItem("so-cart", JSON.stringify(cart));

        alert(`${product.Name} added to cart`);
      });
    });
  }
}
