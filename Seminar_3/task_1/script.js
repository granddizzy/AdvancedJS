const news = [
  {title: "Новость 1", content: "Содержание новости 1"},
  {title: "Новость 2", content: "Содержание новости 2"},
  {title: "Новость 3", content: "Содержание новости 3"},
];

const newsContainerEl = document.querySelector('.news__news-container');
const errorEl = document.querySelector('.news__error');
const loadButtonEl = document.querySelector('.news__load-button');
loadButtonEl.addEventListener('click', () => {
  newsContainerEl.innerHTML = '';
  errorEl.textContent = '';
  loadButtonEl.disabled = true;

  fetchNews()
    .then(articles => {
      articles.forEach(article => {
        const articleDiv = document.createElement('div');
        const title = document.createElement('h2');
        const content = document.createElement('p');
        title.textContent = article.title;
        content.textContent = article.content;
        articleDiv.appendChild(title);
        articleDiv.appendChild(content);
        newsContainerEl.appendChild(articleDiv);
      });
    })
    .catch(error => {
      errorEl.textContent = error;
    })
    .finally(() => {
      loadButtonEl.disabled = false;
    });
});

function fetchNews() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() < 0.1) {
        reject("Ошибка загрузки новостей. Пожалуйста, попробуйте снова.");
      } else {
        resolve(news);
      }
    }, 2000);
  });
}
