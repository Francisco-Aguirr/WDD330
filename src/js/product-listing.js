import ProductData from "./ProductData.mjs";
import ProductList from "./ProductList.mjs";
import { loadHeaderFooter, getParam } from "./utils.mjs";

// Cargar header/footer
loadHeaderFooter();

// Obtener categoría desde URL
const category = getParam("category") || "tents";

// Obtener elemento HTML para renderizar productos
const element = document.querySelector(".product-list");

// Actualizar título de la sección
const titleElement = document.querySelector("h2");
if (titleElement) {
  titleElement.textContent = `Top ${category.replace(/-/g, " ")}`;
}

// Crear instancias y mostrar productos
const dataSource = new ProductData(); // sin pasar categoría ahora
const productList = new ProductList(category, dataSource, element);
productList.init(); // esta se encarga de llamar a getData(category)
