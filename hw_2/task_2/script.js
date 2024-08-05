"use strict";

const initialData = [
  {
    product: "Apple iPhone 13",
    reviews: [
      {
        id: "1",
        text: "Отличный телефон! Батарея держится долго.",
      },
      {
        id: "2",
        text: "Камера супер, фото выглядят просто потрясающе.",
      },
    ],
  },
  {
    product: "Samsung Galaxy Z Fold 3",
    reviews: [
      {
        id: "3",
        text: "Интересный дизайн, но дорогой.",
      },
    ],
  },
  {
    product: "Sony PlayStation 5",
    reviews: [
      {
        id: "4",
        text: "Люблю играть на PS5, графика на высоте.",
      },
    ],
  },
];

const reviewsContainer = document.querySelector('.reviews__reviews-container');
const reviewInput = document.querySelector('.reviews__input');
const reviewErrors = document.querySelector('.reviews__errors');
const minCharCount = 50;
const maxCharCount = 500;
const reviewsPerPage = 4;
let currentPage = 1;
let allReviews = [];

const reviewNextPageButtonEl = document.getElementById('reviews-nextPage-button');
const reviewPrevPageButtonEl = document.getElementById('reviews-prevPage-button');
const reviewPageInfoEl = document.getElementById('reviews-pageInfo');

loadInitialData(initialData);
renderReviews();

document.querySelector(".reviews__button").addEventListener('click', (e) => {
  handleSubmitReview();
})

reviewInput.addEventListener('input', (e) => {
  updateCharCount(e.target.value.length);
});

reviewNextPageButtonEl.addEventListener('click', () => changePage(currentPage + 1));
reviewPrevPageButtonEl.addEventListener('click', () => changePage(currentPage - 1));

function handleSubmitReview() {
  const reviewText = reviewInput.value;

  try {
    validateReview(reviewText);
    addReview(reviewText, getNewReviewId());
    reviewInput.value = '';
  } catch (error) {
    showError(error.message);
  }
}

function showError(text) {
  reviewErrors.textContent = text;
}

function updateCharCount(count) {
  if (count < minCharCount || count > maxCharCount) {
    reviewErrors.textContent = count;
  } else {
    reviewErrors.textContent = '';
  }
}

function validateReview(text) {
  if (text.length < minCharCount || text.length > maxCharCount) {
    throw new Error('Отзыв должен быть от 50 до 500 символов.');
  }
}

function addReview(text, id) {
  allReviews.push({ id, text });
  renderReviews();
}

function getNewReviewId() {
  if (allReviews.length > 0) {
    return allReviews[allReviews.length - 1].id + 1;
  }
  return 1;
}

function loadInitialData(data) {
  data.forEach(product => {
    product.reviews.forEach(review => {
      allReviews.push({ id: +review.id, text: review.text });
    });
  });
}

function renderReviews() {
  reviewsContainer.innerHTML = '';
  const start = (currentPage - 1) * reviewsPerPage;
  const end = start + reviewsPerPage;
  const reviewsToDisplay = allReviews.slice(start, end);

  reviewsToDisplay.forEach(review => {
    const reviewDiv = document.createElement('div');
    reviewDiv.setAttribute("data-id", review.id);
    reviewDiv.className = 'reviews__item';
    reviewDiv.textContent = review.text;
    reviewsContainer.appendChild(reviewDiv);
  });

  updatePagination();
}

function changePage(page) {
  if (page < 1 || page > Math.ceil(allReviews.length / reviewsPerPage)) {
    return;
  }
  currentPage = page;
  renderReviews();
}

function updatePagination() {
  const totalPages = Math.ceil(allReviews.length / reviewsPerPage);
  reviewPageInfoEl.textContent = `Страница ${currentPage} из ${totalPages}`;
  reviewPrevPageButtonEl.disabled = currentPage === 1;
  reviewNextPageButtonEl.disabled = currentPage === totalPages;
}