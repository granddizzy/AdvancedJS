"use strict";

class Library {
  #books;

  constructor(initialBooks = []) {
    this.#books = [];
    if (initialBooks.length > 0) {
      this.#checkForDuplicates(initialBooks);
      this.#books = initialBooks;
    }
  }

  get allBooks() {
    return this.#books;
  }

  addBook(title) {
    if (this.hasBook(title)) {
      throw new Error(`The book titled "${title}" already exists.`);
    }
    this.#books.push(title);
  }

  removeBook(title) {
    const bookIndex = this.#books.indexOf(title);
    if (bookIndex === -1) {
      throw new Error(`The book titled "${title}" does not exist.`);
    }
    this.#books.splice(bookIndex, 1);
  }

  hasBook(title) {
    return this.#books.includes(title);
  }

  #checkForDuplicates(books) {
    const uniqueBooks = new Set(books);
    if (uniqueBooks.size !== books.length) {
      throw new Error('Initial book list contains duplicates.');
    }
  }
}

try {
  const library = new Library(['Book1', 'Book2', 'Book3']);
  console.log(library.allBooks);
  library.addBook('Book4');
  console.log(library.allBooks);
  library.removeBook('Book2');
  console.log(library.allBooks);
  console.log(library.hasBook('Book1'));
  console.log(library.hasBook('Book2'));
} catch (error) {
  console.error(error.message);
}