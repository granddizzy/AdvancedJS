import {reviewAddFormErrorsEl, reviewsEl} from './domElements.js';
import {handleCloseReviews} from "./reviews.js";

function openModalWindow() {
  try {
    window.addEventListener('click', handleCloseReviews);

    reviewsEl.classList.remove('hidden');
    setTimeout(() => {
      reviewsEl.classList.add("show");
    }, 10);
  } catch (e) {
    console.error('Failed to open modal window:', e);
  }
}

function closeModalWindow() {
  try {
    reviewsEl.classList.remove("show");
    setTimeout(() => {
      reviewsEl.classList.add('hidden');
    }, 300);
  } catch (e) {
    console.error('Failed to close modal window:', e);
  }
}

function showError(text) {
  reviewAddFormErrorsEl.textContent = text;
}

export {openModalWindow, closeModalWindow, showError}