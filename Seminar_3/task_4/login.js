"use strict"

import {getUser, setAuthorized, setUser} from './storage.js'

const loginUsernameEl = document.getElementById('loginUsername');
const loginPasswordEl = document.getElementById('loginPassword');
const loginButtonEl = document.getElementById('loginButton');
const loginErrorEl = document.getElementById('loginError');
const registerButtonEl = document.getElementById('registerButton');

registerButtonEl.addEventListener('click', handleRegister);
loginButtonEl.addEventListener('click', handleLogin);

function handleLogin() {
  const username = loginUsernameEl.value;
  const password = loginPasswordEl.value;

  const {storedUsername, storedPassword} = getUser()

  if (username === storedUsername && password === storedPassword) {
    setAuthorized('true');
    switchToWelcomePage();
  } else {
    loginErrorEl.textContent = "Неправильный логин или пароль.";
  }
}

function handleRegister() {
  switchToRegisterPage();
}

function switchToRegisterPage() {
  window.location.assign('registration.html');
}

function switchToWelcomePage() {
  window.location.assign('index.html');
}