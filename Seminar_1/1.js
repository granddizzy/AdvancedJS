// Задание 1
// Создать механизм для безопасного добавления метаданных к
// объектам книг с использованием Symbol.
// 1. Создать уникальные символы для метаданных: отзывы,
//   рейтинг, теги.
// 2. Реализовать функции addMetadata (добавление метаданных)
// и getMetadata (получение метаданных).
// 3. Создать объект книги, добавить метаданные и вывести их на
// консоль.

const reviewSymbol = Symbol('reviews');
const ratingSymbol = Symbol('rating');
const tagsSymbol = Symbol('tags');

class Book {
  title;
  author;
  year;

  constructor(title, author, year) {
    this.title = title;
    this.author = author;
    this.year = year;
  }

  addMetadata(metadataType, data) {
    if (!this[metadataType]) {
      this[metadataType] = []
    }
    this[metadataType].push(data);
  }

  getMetadata(metadataType) {
    if (this[metadataType]) {
      return this[metadataType];
    }
    return [];
  }

  hasTag(tag) {
    const arrTags = this.getMetadata(tagsSymbol);
    return arrTags.includes(tag);
  }

  getAverageRating() {
    const ratings = this.getMetadata(ratingSymbol);
    if (ratings.length === 0) {
      return null;
    }
    const sum = ratings.reduce((acc, curr) => acc + curr, 0);
    return sum / ratings.length;
  }

  reviewsCount() {
    this.getMetadata(reviewSymbol).length;
  }
}

const book = new Book('JavaScript: The Good Parts', 'Douglas Crockford', 2008);

book.addMetadata(reviewSymbol, ['Excellent book', 'Must-read for JS developers']);
book.addMetadata(ratingSymbol, 4.8);
book.addMetadata(tagsSymbol, ['JavaScript', 'Programming', 'Web Development']);

const reviews = book.getMetadata(reviewSymbol);
const rating = book.getMetadata(ratingSymbol);
const tags = book.getMetadata(tagsSymbol);

console.log('Book:', book);
console.log('Reviews:', reviews);
console.log('Rating:', rating);
console.log('Tags:', tags);

console.log('Book with Symbols:', book);

console.log('Has reviews metadata:', reviewSymbol in book);
console.log('Has rating metadata:', ratingSymbol in book);
console.log('Has tags metadata:', tagsSymbol in book);