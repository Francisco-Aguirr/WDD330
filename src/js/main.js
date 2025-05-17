import ProductData from "./ProductData.mjs";
import ProductList from "./ProductList.mjs";

const dataSource = new ProductData("tents");
const element = document.querySelector(".product-list");

const urlParams = new URLSearchParams(window.location.search);
const searchQuery = urlParams.get("search");

async function init() {
  let products = await dataSource.getData();

  if (searchQuery) {
    products = products.filter((product) =>
      product.Name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }

  const productList = new ProductList("Tents", dataSource, element);
  productList.renderList(products); // 👈 usamos renderList directamente
}

init();
