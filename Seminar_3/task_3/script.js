const tableSelectEl = document.getElementById('table');
const chairSelectEl = document.getElementById('chair');
const sofaSelectEl = document.getElementById('sofa');
const saveButtonEl = document.getElementById('save');
const clearButtonEl = document.getElementById('clear');
const resultDivEl = document.getElementById('result');

saveButtonEl.addEventListener('click', saveSelection);
clearButtonEl.addEventListener('click', clearSelection);

loadSavedSelection();

function saveSelection() {
  const selectedFurniture = {
    table: tableSelectEl.value,
    chair: chairSelectEl.value,
    sofa: sofaSelectEl.value,
  };
  localStorage.setItem('furnitureSelection', JSON.stringify(selectedFurniture));
  displaySelection(selectedFurniture);
}

function clearSelection() {
  localStorage.removeItem('furnitureSelection');
  resultDivEl.textContent = "Выбор не сделан. Предыдущие настройки удалены.";
}

function loadSavedSelection() {
  const savedSelection = localStorage.getItem('furnitureSelection');
  if (savedSelection) {
    const furnitureSelection = JSON.parse(savedSelection);
    tableSelectEl.value = furnitureSelection.table;
    chairSelectEl.value = furnitureSelection.chair;
    sofaSelectEl.value = furnitureSelection.sofa;
    displaySelection(furnitureSelection);
  }
}

function displaySelection(selection) {
  resultDivEl.textContent = `Выбранный комплект: Стол - ${selection.table}, Стул - ${selection.chair}, Диван - ${selection.sofa}`;
}
