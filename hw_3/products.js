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

function renderProductList(fullCycle = true) {
  try {
    const products = getProducts();
    const productArray = Object.values(products);
    const totalProducts = productArray.length;

    const totalPages = Math.max(1, Math.ceil(totalProducts / productsPerPage));
    state.currentProductPage = Math.min(state.currentProductPage, totalPages);

    const start = (state.currentProductPage - 1) * productsPerPage;
    const end = start + productsPerPage;
    const paginatedProducts = productArray.slice(start, end);

    // создаем объект reviewCounts содержащий количество отзывов для каждого продукта на странице
    const reviewCounts = paginatedProducts.reduce((acc, product) => {
      acc[product.id] = getReviewsByProduct(product.id).length;
      return acc;
    }, {});

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