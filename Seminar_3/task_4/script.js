"use strict"

import {isAuthorized, setAuthorized} from './storage.js'

const logoutButtonEl = document.getElementById('logoutButton');
logoutButtonEl.addEventListener('click', handleLogout);

function handleLogout() {
  setAuthorized('false');
  switchToLoginPage();
}

function switchToLoginPage() {
  window.location.assign('login.html');
}

if (isAuthorized() !== 'true') {
  switchToLoginPage();
}