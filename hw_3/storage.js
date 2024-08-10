function initializeStorage() {
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
  const jsonData = localStorage.getItem('products')
  if (!jsonData) {
    return {};
  }

  try {
    return JSON.parse(jsonData);
  } catch (e) {
    console.error('Failed to parse reviews:', e);
    return {};
  }
}

function getReviews() {
  const jsonData = localStorage.getItem('reviews')
  if (!jsonData) {
    return {};
  }

  try {
    return JSON.parse(jsonData);
  } catch (e) {
    console.error('Failed to parse reviews:', e);
    return {};
  }
}

function saveReview(productId, review) {
  try {
    let productReviews = [];
    const reviews = getReviews();
    if (productId in reviews) {
      productReviews = reviews[productId];
    }
    productReviews.push(review)
    reviews[productId] = productReviews;
    localStorage.setItem('reviews', JSON.stringify(reviews));
  } catch (e) {
    console.error('Failed to save review:', e);
  }
}

function saveProduct(productId, productName) {
  try {
    const products = getProducts();
    products[productId] = {id: productId, name: productName};
    localStorage.setItem('products', JSON.stringify(products));
    return products[productId];
  } catch (e) {
    console.error('Failed to save product:', e);
  }
}

function deleteProduct(productId) {
  const products = getProducts();
  if (products[productId]) {
    delete products[productId];
    localStorage.setItem('products', JSON.stringify(products));
  }
}

function deleteReview(productId, reviewId) {
  try {
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
  } catch (e) {
    console.error('Failed to delete review:', e);
  }
}

function getReviewsByProduct(productId) {
  const reviews = getReviews();
  if (productId in reviews) {
    return reviews[productId];
  }
  return [];
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

function getLastProductId() {
  const products = getProducts();
  // превращаем все ключи-строки в числа
  const ids = Object.keys(products).map(id => parseInt(id));
  // находим максимальное или 0 если массив пуст
  return ids.length > 0 ? Math.max(...ids) : 0;
}

function getReview(reviewId) {
  const reviews = getReviews();
  return reviews[reviewId];
}

function getProduct(productId) {
  const products = getProducts();
  return products[productId];
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