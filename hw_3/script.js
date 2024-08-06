"use strict"

const reviewsEl = document.getElementById('reviews');
const reviewsContentEl = document.getElementById('reviews-content');
const reviewsContainerEl = reviewsEl.querySelector('.reviews__container');
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
const reviewAddFormErrorsEl = reviewAddFormEl.querySelector('.add-review-form__errors');

const clearAllButtonEl = document.getElementById('clear-all-button');

productListEl.addEventListener('click', handleOpenReviews);
reviewsCloseButtonEl.addEventListener('click', handleCloseReviews);
reviewsAddFormOpenByProductButtonEl.addEventListener('click', handleOpenReviewAddFormByProduct);

reviewAddFormOpenButtonEl.addEventListener('click', handleOpenReviewAddForm);
reviewAddFormSubmitButtonEl.addEventListener('click', handleAddReview);
reviewAddFormCancelButtonEl.addEventListener('click', handleCloseAddReviewForm);

const minCharCount = 50;
const maxCharCount = 500;
reviewAddFormTextEl.addEventListener('input', (e) => {
  updateCharCount(e.target.value.length);
});

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
      // если нет отзывов, то удаляем ключ продукта из объекта отзывов и сам продукт из объекта продуктов
      if (reviews[productId].length === 0) {
        delete reviews[productId];
        deleteProduct(productId);
      }
      localStorage.setItem('reviews', JSON.stringify(reviews));
    }
  }
}

function deleteProduct(productId) {
  const products = getProducts();
  if (products[productId]) {
    delete products[productId];
    localStorage.setItem('products', JSON.stringify(products));
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
  saveReview(product.id, {
    id: getLastReviewId(product.id) + 1,
    date: new Date(),
    text: reviewAddFormTextEl.value
  });
  closeModalWindow();
  renderProductList(false);
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
  const date = new Date(data.date);
  reviewNode.querySelector('.review__date').textContent = `${date.toLocaleDateString('ru-RU')} ${date.toLocaleTimeString('ru-RU')}`;
  reviewNode.querySelector('.review__text').textContent = data.text;
  return reviewNode;
}

function handleOpenReviewAddForm(e) {
  reviewsContentEl.classList.add('hidden');
  reviewAddFormEl.classList.remove('hidden');
  reviewsTitleEl.textContent = 'Добавление отзыва'
  reviewAddFormTextEl.value = '';
  reviewAddFormProductEl.value = '';
  reviewAddFormErrorsEl.value = '';
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
    renderReviewsList(productId, false);
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

function renderReviewsList(productId, fullCycle = true) {
  const reviews = getReviewsByProduct(productId);
  const reviewsArray = Object.values(reviews);
  const totalReviews = reviewsArray.length;

  const totalPages = Math.max(1, Math.ceil(totalReviews / reviewPerPage));
  currentReviewPage = Math.min(currentReviewPage, totalPages);

  const start = (currentReviewPage - 1) * reviewPerPage;
  const end = start + reviewPerPage;
  const paginatedReviews = reviewsArray.slice(start, end);

  reviewPaginationPageInfoEl.textContent = `Страница ${currentReviewPage} из ${totalPages}`;
  reviewPaginationPrevButtonEl.disabled = currentReviewPage === 1;
  reviewPaginationNextButtonEl.disabled = currentReviewPage === totalPages;

  if (fullCycle) {
    reviewsListEl.classList.add('invisible');
    setTimeout(() => {
      showReviewList(paginatedReviews);
    }, 500);
  } else {
    showReviewList(paginatedReviews);
  }

  if (totalReviews === 0) closeModalWindow();
}

function showReviewList(paginatedReviews) {
  reviewsListEl.innerHTML = '';
  paginatedReviews.forEach(el => {
    const reviewItemNode = createReviewNode(el);
    reviewsListEl.appendChild(reviewItemNode);
  });
  reviewsListEl.classList.remove('invisible');
}

function renderProductList(fullCycle = true) {
  const products = getProducts();
  const productArray = Object.values(products);
  const totalProducts = productArray.length;

  const totalPages = Math.max(1, Math.ceil(totalProducts / productsPerPage));
  currentProductPage = Math.min(currentProductPage, totalPages);

  const start = (currentProductPage - 1) * productsPerPage;
  const end = start + productsPerPage;
  const paginatedProducts = productArray.slice(start, end);

  productPaginationPageInfoEl.textContent = `Страница ${currentProductPage} из ${totalPages}`;
  productPaginationPrevButtonEl.disabled = currentProductPage === 1;
  productPaginationNextButtonEl.disabled = currentProductPage === totalPages;

  if (fullCycle) {
    productListEl.classList.add('invisible');
    setTimeout(() => {
      showProductList(paginatedProducts);
    }, 500);
  } else {
    showProductList(paginatedProducts);
  }
}

function showProductList(paginatedProducts) {
  productListEl.innerHTML = '';
  paginatedProducts.forEach(product => {
    const productItemEl = createProductNode(product);
    productListEl.appendChild(productItemEl);
  });

  productListEl.classList.remove('invisible');
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

function updateCharCount(count) {
  if (count < minCharCount || count > maxCharCount) {
    reviewAddFormErrorsEl.textContent = count;
  } else {
    reviewAddFormErrorsEl.textContent = '';
  }
}

function validateReview(productName, reviewText) {
  if (productName.length < 1 || reviewText.length > 100) {
    throw new Error('Название продукта должно быть от 1 до 100 символов.');
  }
  if (reviewText.length < minCharCount || reviewText.length > maxCharCount) {
    throw new Error(`Отзыв должен быть от ${minCharCount} до ${maxCharCount} символов.`);
  }
}

function showError(text) {
  reviewAddFormErrorsEl.textContent = text;
}