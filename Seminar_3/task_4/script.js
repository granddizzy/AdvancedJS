const registerPageEl = document.getElementById('registerPage');
const loginPageEl = document.getElementById('loginPage');
const welcomePageEl = document.getElementById('welcomePage');

const registerUsernameEl = document.getElementById('registerUsername');
const registerPasswordEl = document.getElementById('registerPassword');
const registerButtonEl = document.getElementById('registerButton');
const registerErrorEl = document.getElementById('registerError');

const loginUsernameEl = document.getElementById('loginUsername');
const loginPasswordEl = document.getElementById('loginPassword');
const loginButtonEl = document.getElementById('loginButton');
const loginErrorEl = document.getElementById('loginError');

const logoutButtonEl = document.getElementById('logoutButton');

registerButtonEl.addEventListener('click', handleRegister);
loginButtonEl.addEventListener('click', handleLogin);
logoutButtonEl.addEventListener('click', handleLogout);

function handleRegister() {
  const username = registerUsernameEl.value;
  const password = registerPasswordEl.value;

  if (!username || !password) {
    registerErrorEl.textContent = "Пожалуйста, введите логин и пароль.";
    registerErrorEl.classList.remove('hidden');
    return;
  }

  localStorage.setItem('username', username);
  localStorage.setItem('password', password);

  registerErrorEl.classList.add('hidden');
  switchToLoginPage();
}

function handleLogin() {
  const username = loginUsernameEl.value;
  const password = loginPasswordEl.value;

  const storedUsername = localStorage.getItem('username');
  const storedPassword = localStorage.getItem('password');

  if (username === storedUsername && password === storedPassword) {
    loginErrorEl.classList.add('hidden');
    switchToWelcomePage();
  } else {
    loginErrorEl.textContent = "Неправильный логин или пароль.";
    loginErrorEl.classList.remove('hidden');
  }
}

function handleLogout() {
  switchToLoginPage();
}

function switchToLoginPage() {
  registerPageEl.classList.add('hidden');
  loginPageEl.classList.remove('hidden');
  welcomePageEl.classList.add('hidden');
}

function switchToWelcomePage() {
  registerPageEl.classList.add('hidden');
  loginPageEl.classList.add('hidden');
  welcomePageEl.classList.remove('hidden');
}