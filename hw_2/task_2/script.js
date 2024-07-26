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

const reviewsContainer = document.querySelector('.reviews__reviewsContainer');
const reviewInput = document.querySelector('.reviews__input');

loadInitialData(initialData);

document.querySelector(".reviews__button").addEventListener('click', (e) => {
  handleSubmitReview();
})

function handleSubmitReview() {
  const reviewText = reviewInput.value;

  try {
    validateReview(reviewText);
    addReview(reviewText, getNewReviewId());
    reviewInput.value = '';
  } catch (error) {
    alert(error.message);
  }
}

function validateReview(text) {
  if (text.length < 50 || text.length > 500) {
    throw new Error('Review must be between 50 and 500 characters.');
  }
}

function addReview(text, id) {
  const reviewDiv = document.createElement('div');
  reviewDiv.setAttribute("data-id", id);
  reviewDiv.className = 'reviews__item';
  reviewDiv.textContent = text;
  reviewsContainer.appendChild(reviewDiv);
}

function getNewReviewId() {
  if (reviewsContainer.children.length > 0) {
    return +reviewsContainer.lastChild.getAttribute('data-id') + 1;
  }
  return 1;
}

function loadInitialData(data) {
  data.forEach(product => {
    product.reviews.forEach(review => {
      addReview(review.text, review.id);
    });
  });
}