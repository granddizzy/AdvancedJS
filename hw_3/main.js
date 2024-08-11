"use strict"

import {
  handleAddReview,
  handleCloseAddReviewForm,
  handleCloseReviews,
  handleDeleteReview,
  handleOpenReviewAddForm,
  handleOpenReviewAddFormByProduct,
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
import {getProducts, getReviewsByProduct, initializeStorage} from "./storage.js";
import {state} from "./commonVariables.js";
import {maxCharCount, minCharCount, productsPerPage, reviewPerPage} from "./constants.js";

let touchstartY = 0;
let touchendY = 0;
const swipeUpThreshold = 100;

async function initializeApp() {
  await initializeStorage();
  setupEventListeners();
  await renderProductList(false);
}

function setupEventListeners() {
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

  reviewsContainerEl.addEventListener('touchstart', (e) => {
    touchstartY = e.changedTouches[0].screenY;
  });

  reviewsContainerEl.addEventListener('touchend', (e) => {
    touchendY = e.changedTouches[0].screenY;
    handleSwipe();
  });

  productPaginationPrevButtonEl.addEventListener('click', async (e) => {
    if (state.currentProductPage > 1) {
      state.currentProductPage--;
      await renderProductList();
    }
  });

  productPaginationNextButtonEl.addEventListener('click', async (e) => {
    const totalProducts = Object.keys(await getProducts()).length;
    const totalPages = Math.ceil(totalProducts / productsPerPage);
    if (state.currentProductPage < totalPages) {
      state.currentProductPage++;
      await renderProductList();
    }
  });

  reviewPaginationPrevButtonEl.addEventListener('click', async (e) => {
    if (state.currentReviewPage > 1) {
      state.currentReviewPage--;
      const productId = reviewsEl.getAttribute('data-productId');
      await renderReviewsList(productId);
    }
  });

  reviewPaginationNextButtonEl.addEventListener('click', async (e) => {
    const productId = reviewsEl.getAttribute('data-productId');
    const totalReviews = Object.keys(await getReviewsByProduct(productId)).length;
    const totalPages = Math.ceil(totalReviews / reviewPerPage);
    if (state.currentReviewPage < totalPages) {
      state.currentReviewPage++;
      await renderReviewsList(productId);
    }
  });
}

function handleSwipe() {
  if (touchstartY - touchendY > swipeUpThreshold) {
    closeModalWindow();
  }
}

async function handleClearAll(e) {
  localStorage.clear();
  await renderProductList();
}

function updateCharCount(count) {
  if (count < minCharCount || count > maxCharCount) {
    reviewAddFormErrorsEl.textContent = count;
  } else {
    reviewAddFormErrorsEl.textContent = '';
  }
}

initializeApp();