import {getProducts, getReviewsByProduct} from './storage.js';
import {
  productListEl,
  productPaginationNextButtonEl,
  productPaginationPageInfoEl,
  productPaginationPrevButtonEl
} from "./domElements.js";
import {state} from "./commonVariables.js";
import {productsPerPage} from "./constants.js";

function createProductNode(product, reviewCount) {
  const productTemplateEl = document.getElementById('product-template');
  const productNode = productTemplateEl.content.cloneNode(true);
  productNode.querySelector('.product').setAttribute('data-id', product.id);
  productNode.querySelector('.product__name').textContent = product.name;
  productNode.querySelector('.product__review-count').textContent = reviewCount;
  return productNode;
}

async function renderProductList(fullCycle = true) {
  try {
    const products = await getProducts();
    const productArray = Object.values(products);
    const totalProducts = productArray.length;

    const totalPages = Math.max(1, Math.ceil(totalProducts / productsPerPage));
    state.currentProductPage = Math.min(state.currentProductPage, totalPages);

    const start = (state.currentProductPage - 1) * productsPerPage;
    const end = start + productsPerPage;
    const paginatedProducts = productArray.slice(start, end);

    // Создаем объект reviewCounts с количеством отзывов по продуктам
    // поскольку getReviewsByProduct асинхронная то и саму функцию в reduce делаю асихронной.
    // Начальным значением передаем Promise.resolve({}) т.е. промис с пустым результатом
    // Это нужно для того, чтобы первая итерация могла работать с объектом acc, как с промисом
    // И в конце await paginatedProducts.reduce т.к. вернется промис с результатом
    const reviewCounts = await paginatedProducts.reduce(async (accPromise, product) => {
      const acc = await accPromise;
      const reviews = await getReviewsByProduct(product.id);
      acc[product.id] = reviews.length;
      return acc;
    }, Promise.resolve({}));

    productPaginationPageInfoEl.textContent = `Страница ${state.currentProductPage} из ${totalPages}`;
    productPaginationPrevButtonEl.disabled = state.currentProductPage === 1;
    productPaginationNextButtonEl.disabled = state.currentProductPage === totalPages;

    if (fullCycle) {
      productListEl.classList.add('invisible');
      setTimeout(() => {
        showProductList(paginatedProducts, reviewCounts);
      }, 500);
    } else {
      showProductList(paginatedProducts, reviewCounts);
    }
  } catch (e) {
    console.error('Failed to render product list:', e);
  }
}

function showProductList(paginatedProducts, reviewCounts) {
  try {
    productListEl.innerHTML = '';
    paginatedProducts.forEach(product => {
      const productItemEl = createProductNode(product, reviewCounts[product.id]);
      productListEl.appendChild(productItemEl);
    });

    productListEl.classList.remove('invisible');
  } catch (e) {
    throw new Error(`Failed to show product list: ${e.message}`);
  }
}

export {renderProductList}