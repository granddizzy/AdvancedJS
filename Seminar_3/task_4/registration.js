"use strict"

import {getUser, setUser} from './storage.js'

const registerUsernameEl = document.getElementById('registerUsername');
const registerPasswordEl = document.getElementById('registerPassword');
const registerButtonEl = document.getElementById('registerButton');
const registerErrorEl = document.getElementById('registerError');

registerButtonEl.addEventListener('click', handleRegister);

function handleRegister() {
  const username = registerUsernameEl.value;
  const password = registerPasswordEl.value;

  if (!username || !password) {
    registerErrorEl.textContent = "Пожалуйста, введите логин и пароль.";
    registerErrorEl.classList.remove('hidden');
    return;
  }

  setUser(username, password)
  switchToLoginPage();
}

function switchToLoginPage() {
  window.location.assign('login.html');
}