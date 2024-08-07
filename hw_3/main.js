"use strict"

import {
  handleAddReview,
  handleCloseAddReviewForm,
  handleCloseReviews,
  handleDeleteReview,
  handleOpenReviewAddForm, handleOpenReviewAddFormByProduct,
  handleOpenReviews,
  renderReviewsList
} from './reviews.js';
import {renderProductList} from './products.js';
import {
  clearAllButtonEl,
  productListEl,
  productPaginationNextButtonEl,
  productPaginationPrevButtonEl,
  reviewAddFormCancelButtonEl,
  reviewAddFormErrorsEl,
  reviewAddFormOpenButtonEl,
  reviewAddFormSubmitButtonEl,
  reviewAddFormTextEl,
  reviewPaginationNextButtonEl,
  reviewPaginationPrevButtonEl,
  reviewsAddFormOpenByProductButtonEl,
  reviewsCloseButtonEl,
  reviewsContainerEl,
  reviewsEl,
  reviewsListEl
} from "./domElements.js";
import {closeModalWindow} from "./utils.js";
import {getProducts, getReviewsByProduct} from "./storage.js";
import {state} from "./commonVariables.js";
import {productsPerPage, minCharCount, maxCharCount, reviewPerPage} from "./constants.js";


productListEl.addEventListener('click', handleOpenReviews);
reviewsCloseButtonEl.addEventListener('click', handleCloseReviews);
reviewsAddFormOpenByProductButtonEl.addEventListener('click', handleOpenReviewAddFormByProduct);

reviewAddFormOpenButtonEl.addEventListener('click', handleOpenReviewAddForm);
reviewAddFormSubmitButtonEl.addEventListener('click', handleAddReview);
reviewAddFormCancelButtonEl.addEventListener('click', handleCloseAddReviewForm);


reviewAddFormTextEl.addEventListener('input', (e) => {
  updateCharCount(e.target.value.length);
});

reviewsListEl.addEventListener('click', handleDeleteReview);
clearAllButtonEl.addEventListener('click', handleClearAll);

productPaginationPrevButtonEl.addEventListener('click', (e) => {
  if (state.currentProductPage > 1) {
    state.currentProductPage--;
    renderProductList();
  }
});

productPaginationNextButtonEl.addEventListener('click', (e) => {
  const totalProducts = Object.keys(getProducts()).length;
  const totalPages = Math.ceil(totalProducts / productsPerPage);
  if (state.currentProductPage < totalPages) {
    state.currentProductPage++;
    renderProductList();
  }
});

reviewPaginationPrevButtonEl.addEventListener('click', (e) => {
  if (state.currentReviewPage > 1) {
    state.currentReviewPage--;
    const productId = reviewsEl.getAttribute('data-productId');
    renderReviewsList(productId);
  }
});

reviewPaginationNextButtonEl.addEventListener('click', (e) => {
  const productId = reviewsEl.getAttribute('data-productId');
  const totalReviews = Object.keys(getReviewsByProduct(productId)).length;
  const totalPages = Math.ceil(totalReviews / reviewPerPage);
  if (state.currentReviewPage < totalPages) {
    state.currentReviewPage++;
    renderReviewsList(productId);
  }
});

let touchstartY = 0;
let touchendY = 0;
const swipeUpThreshold = 100;
reviewsContainerEl.addEventListener('touchstart', function (event) {
  touchstartY = event.changedTouches[0].screenY;
}, false);

reviewsContainerEl.addEventListener('touchend', function (event) {
  touchendY = event.changedTouches[0].screenY;
  handleSwipe();
}, false);

renderProductList(false);

function handleSwipe() {
  if (touchstartY - touchendY > swipeUpThreshold) {
    closeModalWindow();
  }
}

function handleClearAll(e) {
  localStorage.clear();
  renderProductList();
}

function updateCharCount(count) {
  if (count < minCharCount || count > maxCharCount) {
    reviewAddFormErrorsEl.textContent = count;
  } else {
    reviewAddFormErrorsEl.textContent = '';
  }
}
