// Вы создаете интерфейс, где пользователь вводит число.
//   Ваша задача — проверить, является ли введенное значение числом или нет, и дать
// соответствующий ответ.
// 1. Создайте HTML-структуру: текстовое поле для ввода числа и кнопку
// "Проверить".
// 2. Добавьте место (например, div) для вывода сообщения пользователю.
// 3. Напишите функцию, которая будет вызвана при нажатии на кнопку. Эта функция
// должна использовать try и catch для проверки вводимого значения.

"use strict";

document.getElementById("button").addEventListener('click', (e) => {
  checkNumber();
});

function checkNumber() {
  const input = document.getElementById('numberInput').value;
  const messageDiv = document.getElementById('message');

  try {
    if (input.trim() === '') {
      throw new Error('Input is empty');
    }

    if (Number.isFinite(+input)) {
      throw new Error('This is not a number');
    }

    messageDiv.textContent = `The input is a valid number: ${input}`;
    messageDiv.style.color = 'green';
  } catch (error) {
    messageDiv.textContent = error.message;
    messageDiv.style.color = 'red';
  }
}