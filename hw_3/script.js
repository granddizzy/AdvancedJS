"use strict"

const reviewsEl = document.getElementById('reviews');
// const reviewProductEl = reviewsEl.querySelector('.reviews__product');
const reviewAddFormOpenButtonEl = document.getElementById('open-addReviewForm-button');
const productListEl = document.getElementById('product-list');
const reviewsListEl = document.getElementById('reviews-list');
const reviewsTitleEl = document.getElementById('reviews-title');
const reviewsCloseButtonEl = reviewsEl.querySelector('.reviews__close-button');

const reviewAddFormEl = reviewsEl.querySelector('.add-review-form');
const reviewAddFormProductEl = reviewAddFormEl.querySelector('.add-review-form__product');
const reviewAddFormTextEl = reviewAddFormEl.querySelector('.add-review-form__text');

const reviewAddFormSubmitButtonEl = document.getElementById('add-review-button');
const reviewAddFormCancelButtonEl = document.getElementById('cancel-review-button');

const clearAllButtonEl = document.getElementById('clear-all-button');

productListEl.addEventListener('click', handleOpenReviews);
reviewsCloseButtonEl.addEventListener('click', handleCloseReviews);

reviewAddFormOpenButtonEl.addEventListener('click', handleOpenReviewAddForm);
reviewAddFormSubmitButtonEl.addEventListener('click', handleAddReview);
reviewAddFormCancelButtonEl.addEventListener('click', handleCloseAddReviewForm);

reviewsListEl.addEventListener('click', handleDeleteReview)
clearAllButtonEl.addEventListener('click', handleClearAll)

renderProductList();

function getProducts() {
  const jsonData = localStorage.getItem('products')
  if (!jsonData) {
    return {};
  }

  try {
    return JSON.parse(jsonData);
  } catch (e) {
    // console.error('Failed to parse reviews:', e);
    return {};
  }
}

function saveReview(productId, review) {
  let productReviews = [];
  const reviews = getReviews();
  if (productId in reviews) {
    productReviews = reviews[productId];
  }
  productReviews.push(review)
  reviews[productId] = productReviews;
  localStorage.setItem('reviews', JSON.stringify(reviews));
}

function saveProduct(productId, productName) {
  const products = getProducts();
  products[productId] = {id: productId, name: productName};
  localStorage.setItem('products', JSON.stringify(products));
  return products[productId];
}

function getLastProductId() {
  const products = getProducts();
  // превращаем все ключи-строки в числа
  const ids = Object.keys(products).map(id => parseInt(id));
  // находим максимальное или 0 если массив пуст
  return ids.length > 0 ? Math.max(...ids) : 0;
}

function getLastReviewId(productId) {
  const productReviews = getReviewsByProduct(productId);
  const ids = productReviews.map(el => el.id);
  return ids.length > 0 ? Math.max(...ids) : 0;
}

function getProductByName(name) {
  const products = getProducts()
  return Object.values(products).find(el => el.name === name);
}

function getReviews() {
  const jsonData = localStorage.getItem('reviews')
  if (!jsonData) {
    return {};
  }

  try {
    return JSON.parse(jsonData);
  } catch (e) {
    // console.error('Failed to parse reviews:', e);
    return {};
  }
}

function getReviewsByProduct(productId) {
  const reviews = getReviews();
  if (productId in reviews) {
    return reviews[productId];
  }
  return [];
}

function deleteReview(productId, reviewId) {
  const reviews = getReviews();
  if (reviews[productId]) {
    const numReviewId = parseInt(reviewId);
    const reviewIndex = reviews[productId].findIndex(review => review.id === numReviewId);
    if (reviewIndex !== -1) {
      reviews[productId].splice(reviewIndex, 1);
      // если нет отзывов, то удаляем ключ продукта из объекта
      if (reviews[productId].length === 0) {
        delete reviews[productId];
      }
      localStorage.setItem('reviews', JSON.stringify(reviews));
    }
  }
}

function handleAddReview(e) {
  e.preventDefault();
  let product = getProductByName(reviewAddFormProductEl.value);
  if (!product) {
    product = saveProduct(getLastProductId() + 1, reviewAddFormProductEl.value)
  }
  saveReview(product.id, {
    id: getLastReviewId(product.id) + 1,
    date: new Date(),
    text: reviewAddFormTextEl.value
  });
  closeModalWindow();
  renderProductList();
}

function createProductNode(product) {
  const productTemplateEl = document.getElementById('product-template');
  const productNode = productTemplateEl.content.cloneNode(true);
  const productReviews = getReviewsByProduct(product.id);
  productNode.querySelector('.product').setAttribute('data-id', product.id);
  productNode.querySelector('.product__name').textContent = product.name;
  productNode.querySelector('.product__review-count').textContent = productReviews.length;
  return productNode;
}

function createReviewNode(data) {
  const reviewTemplateEl = document.getElementById('review-template');
  const reviewNode = reviewTemplateEl.content.cloneNode(true);
  reviewNode.querySelector('.review').setAttribute('data-id', data.id);
  reviewNode.querySelector('.review__date').textContent = data.date;
  reviewNode.querySelector('.review__text').textContent = data.text;
  return reviewNode;
}

function handleOpenReviewAddForm(e) {
  reviewsListEl.classList.add('hidden');
  reviewAddFormEl.classList.remove('hidden');
  reviewsTitleEl.textContent = 'Добавление отзыва'
  reviewAddFormTextEl.value = '';
  reviewAddFormProductEl.value = '';
  openModalWindow();
}

function handleCloseAddReviewForm(e) {
  e.preventDefault();
  closeModalWindow();
}

function openModalWindow() {
  // событие закрытия модального окна
  window.addEventListener('click', handleCloseReviews);

  reviewsEl.classList.remove('hidden');
  setTimeout(() => {
    reviewsEl.classList.add("show");
  }, 10);
}

function closeModalWindow() {
  reviewsEl.classList.remove("show");
  setTimeout(() => {
    reviewsEl.classList.add('hidden');
  }, 300);
}

function handleCloseReviews(e) {
  if (e.target === reviewsEl || e.target === reviewsCloseButtonEl) {
    closeModalWindow();
    // удаляем обработчик закрытия при клике вне окна
    window.removeEventListener('click', handleCloseReviews);
  }
}

function handleOpenReviews(e) {
  const productEl = e.target.closest('.product');
  if (productEl) {
    const productId = productEl.getAttribute('data-id');
    reviewsEl.setAttribute('data-productId', productId);
    // reviewProductEl.textContent = productEl.querySelector('.product__name').textContent;

    reviewsListEl.innerHTML = '';
    reviewsListEl.classList.remove('hidden');
    reviewAddFormEl.classList.add('hidden');
    reviewsTitleEl.textContent = `Отзывы на ${productEl.querySelector('.product__name').textContent}`;
    openModalWindow();
    renderReviewsList(productId);
  }
}

function handleDeleteReview(e) {
  const reviewsEl = e.target.closest('.reviews');
  const reviewEl = e.target.closest('.review');
  if (reviewsEl && reviewEl) {
    const productId = reviewsEl.getAttribute('data-productId');
    const reviewId = reviewEl.getAttribute('data-id');
    deleteReview(productId, reviewId);
    renderReviewsList(productId);
    renderProductList();
  }
}

function renderReviewsList(productId) {
  const reviews = getReviewsByProduct(productId);
  reviewsListEl.innerHTML = '';
  reviews.forEach(el => {
    const reviewItemNode = createReviewNode(el);
    reviewsListEl.appendChild(reviewItemNode);
  });
}

function renderProductList() {
  const products = getProducts();
  productListEl.innerHTML = '';
  for (const product of Object.values(products)) {
    const productItemEl = createProductNode(product);
    productListEl.appendChild(productItemEl);
  }
}

function handleClearAll(e) {
  localStorage.clear();
  renderProductList();
}