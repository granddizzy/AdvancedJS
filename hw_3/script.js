"use strict"

const reviewsEl = document.getElementById('reviews');
const reviewsContentEl = document.getElementById('reviews-content');
const reviewAddFormOpenButtonEl = document.getElementById('open-addReviewForm-button');
const productListEl = document.getElementById('product-list');
const reviewsListEl = document.getElementById('reviews-list');
const reviewsTitleEl = document.getElementById('reviews-title');
const reviewsCloseButtonEl = reviewsEl.querySelector('.reviews__close-button');
const reviewsAddFormOpenByProductButtonEl = document.getElementById('open-addReviewForm-button-byProduct');

const reviewAddFormEl = reviewsEl.querySelector('.add-review-form');
const reviewAddFormProductEl = reviewAddFormEl.querySelector('.add-review-form__product');
const reviewAddFormTextEl = reviewAddFormEl.querySelector('.add-review-form__text');
const reviewAddFormSubmitButtonEl = document.getElementById('add-review-button');
const reviewAddFormCancelButtonEl = document.getElementById('cancel-review-button');

const clearAllButtonEl = document.getElementById('clear-all-button');

productListEl.addEventListener('click', handleOpenReviews);
reviewsCloseButtonEl.addEventListener('click', handleCloseReviews);
reviewsAddFormOpenByProductButtonEl.addEventListener('click', handleOpenReviewAddFormByProduct);

reviewAddFormOpenButtonEl.addEventListener('click', handleOpenReviewAddForm);
reviewAddFormSubmitButtonEl.addEventListener('click', handleAddReview);
reviewAddFormCancelButtonEl.addEventListener('click', handleCloseAddReviewForm);

reviewsListEl.addEventListener('click', handleDeleteReview);
clearAllButtonEl.addEventListener('click', handleClearAll);

const productsPerPage = 5;
let currentProductPage = 1;
const productsPaginationEl = document.querySelector('.product-list-pagination');
const productPaginationPrevButtonEl = productsPaginationEl.querySelector('.product-list-pagination__prevButton');
const productPaginationNextButtonEl = productsPaginationEl.querySelector('.product-list-pagination__nextButton');
const productPaginationPageInfoEl = productsPaginationEl.querySelector('.product-list-pagination__page-info');

productPaginationPrevButtonEl.addEventListener('click', (e) => {
  if (currentProductPage > 1) {
    currentProductPage--;
    renderProductList();
  }
});

productPaginationNextButtonEl.addEventListener('click', (e) => {
  const totalProducts = Object.keys(getProducts()).length;
  const totalPages = Math.ceil(totalProducts / productsPerPage);
  if (currentProductPage < totalPages) {
    currentProductPage++;
    renderProductList();
  }
});

const reviewPerPage = 5;
let currentReviewPage = 1;
const reviewPaginationEl = document.querySelector('.review-list-pagination');
const reviewPaginationPrevButtonEl = reviewPaginationEl.querySelector('.review-list-pagination__prevButton');
const reviewPaginationNextButtonEl = reviewPaginationEl.querySelector('.review-list-pagination__nextButton');
const reviewPaginationPageInfoEl = reviewPaginationEl.querySelector('.review-list-pagination__page-info');

reviewPaginationPrevButtonEl.addEventListener('click', (e) => {
  if (currentReviewPage > 1) {
    currentReviewPage--;
    const productId = reviewsEl.getAttribute('data-productId');
    renderReviewsList(productId);
  }
});

reviewPaginationNextButtonEl.addEventListener('click', (e) => {
  const productId = reviewsEl.getAttribute('data-productId');
  const totalReviews = Object.keys(getReviewsByProduct(productId)).length;
  const totalPages = Math.ceil(totalReviews / reviewPerPage);
  if (currentReviewPage < totalPages) {
    currentReviewPage++;
    renderReviewsList(productId);
  }
});

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
  reviewsContentEl.classList.add('hidden');
  reviewAddFormEl.classList.remove('hidden');
  reviewsTitleEl.textContent = 'Добавление отзыва'
  reviewAddFormTextEl.value = '';
  reviewAddFormProductEl.value = '';
  openModalWindow();
}

function handleOpenReviewAddFormByProduct(e) {
  const reviewsEl = e.target.closest('.reviews');
  if (reviewsEl) {
    reviewsContentEl.classList.add('hidden');
    reviewAddFormEl.classList.remove('hidden');
    reviewsTitleEl.textContent = 'Добавление отзыва'
    const product = getProduct(reviewsEl.getAttribute('data-productId'))
    reviewAddFormTextEl.value = '';
    reviewAddFormProductEl.value = product.name;
    openModalWindow();
  }
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

    reviewsListEl.innerHTML = '';
    reviewsContentEl.classList.remove('hidden');
    reviewAddFormEl.classList.add('hidden');
    reviewsTitleEl.textContent = `Отзывы на ${productEl.querySelector('.product__name').textContent}`;
    openModalWindow();
    renderReviewsList(productId);
  }
}

function handleDeleteReview(e) {
  if (e.target.classList.contains('review__delete-button')) {
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
}

function renderReviewsList(productId) {
  const reviews = getReviewsByProduct(productId);
  const reviewsArray = Object.values(reviews);
  const totalReviews = reviewsArray.length;

  const start = (currentReviewPage - 1) * reviewPerPage;
  const end = start + reviewPerPage;
  const paginatedReviews = reviewsArray.slice(start, end);

  const totalPages = Math.max(1, Math.ceil(totalReviews / reviewPerPage));
  reviewPaginationPageInfoEl.textContent = `Страница ${currentReviewPage} из ${totalPages}`;
  reviewPaginationPrevButtonEl.disabled = currentReviewPage === 1;
  reviewPaginationNextButtonEl.disabled = currentReviewPage === totalPages;

  reviewsListEl.innerHTML = '';
  paginatedReviews.forEach(el => {
    const reviewItemNode = createReviewNode(el);
    reviewsListEl.appendChild(reviewItemNode);
  });
}

function renderProductList() {
  const products = getProducts();
  const productArray = Object.values(products);
  const totalProducts = productArray.length;

  const start = (currentProductPage - 1) * productsPerPage;
  const end = start + productsPerPage;
  const paginatedProducts = productArray.slice(start, end);

  const totalPages = Math.max(1, Math.ceil(totalProducts / productsPerPage));
  productPaginationPageInfoEl.textContent = `Страница ${currentProductPage} из ${totalPages}`;
  productPaginationPrevButtonEl.disabled = currentProductPage === 1;
  productPaginationNextButtonEl.disabled = currentProductPage === totalPages;

  productListEl.innerHTML = '';
  paginatedProducts.forEach(product => {
    const productItemEl = createProductNode(product);
    productListEl.appendChild(productItemEl);
  });
}

function handleClearAll(e) {
  localStorage.clear();
  renderProductList();
}

function getProduct(productId) {
  const products = getProducts();
  return products[productId];
}

function getReview(reviewId) {
  const reviews = getReviews();
  return reviews[reviewId];
}