import {
  deleteReview,
  getLastProductId,
  getLastReviewId,
  getProduct,
  getProductByName,
  getReviewsByProduct,
  saveProduct,
  saveReview
} from './storage.js';
import {closeModalWindow, openModalWindow, showError} from './utils.js';
import {renderProductList} from "./products.js";
import {
  reviewAddFormEl,
  reviewAddFormErrorsEl,
  reviewAddFormProductEl,
  reviewAddFormTextEl,
  reviewPaginationNextButtonEl,
  reviewPaginationPageInfoEl,
  reviewPaginationPrevButtonEl,
  reviewsCloseButtonEl,
  reviewsContentEl,
  reviewsEl,
  reviewsListEl,
  reviewsTitleEl
} from './domElements.js'
import {state} from "./commonVariables.js";
import {maxCharCount, minCharCount, reviewPerPage} from "./constants.js";

function handleOpenReviews(e) {
  const productEl = e.target.closest('.product');
  if (productEl) {
    const productId = productEl.getAttribute('data-id');
    reviewsEl.setAttribute('data-productId', productId);

    reviewsListEl.innerHTML = '';
    reviewsContentEl.classList.remove('hidden');
    reviewAddFormEl.classList.add('hidden');
    reviewsTitleEl.textContent = `Отзывы на ${productEl.querySelector('.product__name').textContent}`;
    openModalWindow();
    renderReviewsList(productId, false);
  }
}

function handleCloseReviews(e) {
  if (e.target === reviewsEl || e.target === reviewsCloseButtonEl) {
    closeModalWindow();
    // удаляем обработчик закрытия при клике вне окна
    window.removeEventListener('click', handleCloseReviews);
  }
}

function handleAddReview(e) {
  e.preventDefault();

  const productName = reviewAddFormProductEl.value;
  const reviewText = reviewAddFormTextEl.value;
  try {
    validateReview(productName, reviewText);
  } catch (error) {
    showError(error.message);
    return;
  }

  let product = getProductByName(reviewAddFormProductEl.value);
  if (!product) {
    product = saveProduct(getLastProductId() + 1, reviewAddFormProductEl.value)
  }
  if (product) {
    saveReview(product.id, {
      id: getLastReviewId(product.id) + 1,
      date: new Date(),
      text: reviewAddFormTextEl.value
    });
  }
  closeModalWindow();
  renderProductList(false);
}

function validateReview(productName, reviewText) {
  if (productName.length < 1 || reviewText.length > 100) {
    throw new Error('Название продукта должно быть от 1 до 100 символов.');
  }
  if (reviewText.length < minCharCount || reviewText.length > maxCharCount) {
    throw new Error(`Отзыв должен быть от ${minCharCount} до ${maxCharCount} символов.`);
  }
}

function renderReviewsList(productId, fullCycle = true) {
  let totalReviews = 0;
  try {
    const reviews = getReviewsByProduct(productId);
    const reviewsArray = Object.values(reviews);
    totalReviews = reviewsArray.length;

    const totalPages = Math.max(1, Math.ceil(totalReviews / reviewPerPage));
    state.currentReviewPage = Math.min(state.currentReviewPage, totalPages);

    const start = (state.currentReviewPage - 1) * reviewPerPage;
    const end = start + reviewPerPage;
    const paginatedReviews = reviewsArray.slice(start, end);

    reviewPaginationPageInfoEl.textContent = `Страница ${state.currentReviewPage} из ${totalPages}`;
    reviewPaginationPrevButtonEl.disabled = state.currentReviewPage === 1;
    reviewPaginationNextButtonEl.disabled = state.currentReviewPage === totalPages;

    if (fullCycle) {
      reviewsListEl.classList.add('invisible');
      setTimeout(() => {
        showReviewList(paginatedReviews);
      }, 500);
    } else {
      showReviewList(paginatedReviews);
    }
  } catch (e) {
    console.error('Failed to render review list:', e);
  }

  if (totalReviews === 0) closeModalWindow();
}

function createReviewNode(data) {
  const reviewTemplateEl = document.getElementById('review-template');
  const reviewNode = reviewTemplateEl.content.cloneNode(true);
  reviewNode.querySelector('.review').setAttribute('data-id', data.id);
  const date = new Date(data.date);
  reviewNode.querySelector('.review__date').textContent = `${date.toLocaleDateString('ru-RU')} ${date.toLocaleTimeString('ru-RU')}`;
  reviewNode.querySelector('.review__text').textContent = data.text;
  return reviewNode;
}

function showReviewList(paginatedReviews) {
  try {
    reviewsListEl.innerHTML = '';
    paginatedReviews.forEach(el => {
      const reviewItemNode = createReviewNode(el);
      reviewsListEl.appendChild(reviewItemNode);
    });
    reviewsListEl.classList.remove('invisible');
  } catch (e) {
    throw new Error(`Failed to show review list: ${e.message}`);
  }
}

function handleDeleteReview(e) {
  try {
    if (e.target.classList.contains('review__delete-button')) {
      const reviewsEl = e.target.closest('.reviews');
      const reviewEl = e.target.closest('.review');
      if (reviewsEl && reviewEl) {
        const productId = reviewsEl.getAttribute('data-productId');
        const reviewId = reviewEl.getAttribute('data-id');
        deleteReview(productId, reviewId);
        renderReviewsList(productId, false);
        renderProductList(false);
      }
    }
  } catch (e) {
    console.error('Failed to delete review:', e);
  }
}

function handleOpenReviewAddForm(e) {
  openReviewAddForm();
}

function handleOpenReviewAddFormByProduct(e) {
  const reviewsEl = e.target.closest('.reviews');
  if (reviewsEl) {
    const product = getProduct(reviewsEl.getAttribute('data-productId'));
    openReviewAddForm(product.name);
  }
}

function openReviewAddForm(productName = '') {
  reviewsContentEl.classList.add('hidden');
  reviewAddFormEl.classList.remove('hidden');
  reviewsTitleEl.textContent = 'Добавление отзыва';
  reviewAddFormTextEl.value = '';
  reviewAddFormProductEl.value = productName;
  reviewAddFormErrorsEl.value = '';
  openModalWindow();
}

function handleCloseAddReviewForm(e) {
  e.preventDefault();
  closeModalWindow();
}

export {
  renderReviewsList,
  handleOpenReviews,
  handleCloseReviews,
  handleAddReview,
  handleDeleteReview,
  handleOpenReviewAddForm,
  handleOpenReviewAddFormByProduct,
  handleCloseAddReviewForm
}