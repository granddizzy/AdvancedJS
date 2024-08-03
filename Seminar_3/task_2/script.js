const saveButtonEl = document.querySelector('.text-storage__save-button');
saveButtonEl.addEventListener('click', saveText);
const loadButtonEl = document.querySelector('.text-storage__load-button');
loadButtonEl.addEventListener('click', loadText);
const clearButtonEl = document.querySelector('.text-storage__clear-button');
clearButtonEl.addEventListener('click', clearText);
const inputTextEL = document.querySelector('.text-storage__input-text');
const outputTextEl = document.querySelector('.text-storage__output')

function saveText() {
  if (inputTextEL.value) {
    localStorage.setItem('savedText', inputTextEL.value);
    outputTextEl.textContent = "Текст сохранен!";
  } else {
    outputTextEl.textContent = "Пожалуйста, введите текст для сохранения.";
  }
}

function loadText() {
  const savedText = localStorage.getItem('savedText');
  if (savedText) {
    outputTextEl.textContent = savedText;
  } else {
    outputTextEl.textContent = "Нет сохраненного текста.";
  }
}

function clearText() {
  localStorage.removeItem('savedText');
  outputTextEl.textContent = "Сохраненный текст удален.";
}