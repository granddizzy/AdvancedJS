async function initializeStorage() {
  try {
    if (!localStorage.getItem('products')) {
      localStorage.setItem('products', JSON.stringify({}));
    }
    if (!localStorage.getItem('reviews')) {
      localStorage.setItem('reviews', JSON.stringify({}));
    }
  } catch (e) {
    console.error('Failed to initialize storage:', e);
  }
}

function getProducts() {
  // хотя localstorage это синхронная операция добавил promise для примера
  // работы аля база данных
  return new Promise((resolve, reject) => {
    try {
      const jsonData = localStorage.getItem('products');
      if (!jsonData) {
        resolve({});
      } else {
        resolve(JSON.parse(jsonData));
      }
    } catch (e) {
      reject('Failed to parse products:', e);
    }
  });
}

function getReviews() {
  return new Promise((resolve, reject) => {
    const jsonData = localStorage.getItem('reviews');
    if (!jsonData) {
      resolve({});
    } else {
      try {
        resolve(JSON.parse(jsonData));
      } catch (e) {
        reject('Failed to parse reviews:', e);
      }
    }
  });
}

function saveReview(productId, review) {
  return getReviews().then((reviews) => {
    let productReviews = reviews[productId] || [];
    productReviews.push(review);
    reviews[productId] = productReviews;
    localStorage.setItem('reviews', JSON.stringify(reviews));
  }).catch((e) => {
    console.error('Failed to save review:', e);
  });
}

function saveProduct(productId, productName) {
  return getProducts().then((products) => {
    products[productId] = {id: productId, name: productName};
    localStorage.setItem('products', JSON.stringify(products));
    return products[productId];
  }).catch((e) => {
    console.error('Failed to save product:', e);
  });
}

function deleteProduct(productId) {
  return getProducts().then((products) => {
    if (products[productId]) {
      delete products[productId];
      localStorage.setItem('products', JSON.stringify(products));
    }
  }).catch((e) => {
    console.error('Failed to delete product:', e);
  });
}

function deleteReview(productId, reviewId) {
  return getReviews().then((reviews) => {
    if (reviews[productId]) {
      const numReviewId = parseInt(reviewId);
      const reviewIndex = reviews[productId].findIndex(review => review.id === numReviewId);
      if (reviewIndex !== -1) {
        reviews[productId].splice(reviewIndex, 1);
        if (reviews[productId].length === 0) {
          delete reviews[productId];
          return deleteProduct(productId)
            .then(() => {
              localStorage.setItem('reviews', JSON.stringify(reviews));
            });
        }
        localStorage.setItem('reviews', JSON.stringify(reviews));
      }
    }
  }).catch((e) => {
    console.error('Failed to delete review:', e);
  });
}

function getReviewsByProduct(productId) {
  return getReviews().then((reviews) => {
    return reviews[productId] || [];
  });
}

function getLastReviewId(productId) {
  return getReviewsByProduct(productId).then((productReviews) => {
    const ids = productReviews.map(el => el.id);
    return ids.length > 0 ? Math.max(...ids) : 0;
  });
}

function getProductByName(name) {
  return getProducts().then((products) => {
    return Object.values(products).find(el => el.name === name);
  });
}

function getLastProductId() {
  return getProducts().then((products) => {
    // превращаем все ключи-строки в числа
    const ids = Object.keys(products).map(id => parseInt(id));
    // находим максимальное или 0 если массив пуст
    return ids.length > 0 ? Math.max(...ids) : 0;
  });
}

function getReview(reviewId) {
  return getReviews().then((reviews) => {
    return reviews[reviewId];
  });
}

function getProduct(productId) {
  return getProducts().then((products) => {
    return products[productId];
  });
}

export {
  initializeStorage,
  getProducts,
  getReviews,
  saveProduct,
  saveReview,
  deleteProduct,
  deleteReview,
  getReviewsByProduct,
  getLastReviewId,
  getProductByName,
  getLastProductId,
  getReview,
  getProduct
}