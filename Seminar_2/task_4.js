// Пользователи вашего сайта могут добавлять элементы в список. Но есть условие:
//   введенное значение должно содержать от 3 до 10 символов.
// 1. Создайте HTML-структуру с текстовым полем, кнопкой и списком.
// 2. Напишите функцию, которая будет добавлять элементы в список или
// генерировать исключение, если длина введенного значения не соответствует
// требованиям.

"use strict";

const inputEl = document.getElementById('itemInput').value;
const messageEl = document.getElementById('message');
const itemListEl = document.getElementById('itemList');

document.getElementById("button").addEventListener('click', (e) => {
  addItem();
});

function addItem() {
  messageEl.textContent = '';

  try {
    if (inputEl.trim().length < 3 || inputEl.trim().length > 10) {
      throw new Error('Input must be between 3 and 10 characters');
    }

    const listItem = document.createElement('li');
    listItem.textContent = inputEl;
    itemListEl.appendChild(listItem);

    document.getElementById('itemInput').value = '';
    messageEl.textContent = 'Item added successfully!';
    messageEl.style.color = 'green';
  } catch (error) {
    messageEl.textContent = error.message;
    messageEl.style.color = 'red';
  } finally {
    console.log("Add attempt completed");
  }
}