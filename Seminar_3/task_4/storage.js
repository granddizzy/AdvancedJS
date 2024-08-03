"use strict"

function getUser() {
  const storedUsername = localStorage.getItem('username');
  const storedPassword = localStorage.getItem('password');

  return {storedUsername: storedUsername, storedPassword: storedPassword}
}

function setUser(username, password) {
  localStorage.setItem('username', username);
  localStorage.setItem('password', password);
}

function isAuthorized() {
  return sessionStorage.getItem('authorized');
}

function setAuthorized(value) {
  sessionStorage.setItem('authorized', value);
}

export {getUser, setUser, isAuthorized, setAuthorized};