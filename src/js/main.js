import ExternalServices from "./ExternalServices.mjs";
import ProductList from "./ProductList.mjs";
import { loadHeaderFooter } from "./utils.mjs";

// Cargar header/footer
loadHeaderFooter();

const dataSource = new ExternalServices("tents");
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
  productList.renderList(products); //  usamos renderList directamente
}

// modal register
function showRegisterModal() {
  const modalShown = localStorage.getItem("registerModalShown");

  if (!modalShown) {
    const modal = document.getElementById("register-modal");
    const closeButton = modal.querySelector(".close-modal");

    modal.classList.remove("hidden");

    // Cierra al hacer click en el botón
    closeButton.addEventListener("click", () => {
      modal.classList.add("hidden");
      localStorage.setItem("registerModalShown", "true");
    });

    // Cierra si se hace click fuera del contenido del modal
    modal.addEventListener("click", (event) => {
      if (event.target === modal) {
        modal.classList.add("hidden");
        localStorage.setItem("registerModalShown", "true");
      }
    });
  }
}

showRegisterModal();

init();
