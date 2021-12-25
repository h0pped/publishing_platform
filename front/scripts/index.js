const articlesGrid = document.querySelector(".articles-grid");

const SERVER_URL = "http://127.0.0.1:3000";

const generateArticle = (data) => {
  const article = document.createElement("div");
  article.classList.add("article");
  article.innerHTML = `
    <div class="article-thumbnail">
      <img
        src="${SERVER_URL}/static/article_thumbnails/${data.thumbnail_path}"
        alt="article thumbnail"
      />
    </div>
    <div class="article-title">
      <p class="subtitle">
        ${data.title}
      </p>
    </div>
    `;
  return article;
};

const appendArticle = (article) => articlesGrid.appendChild(article);

fetch(`${SERVER_URL}/articles/recent`)
  .then((res) => res.json())
  .then((data) =>
    data.forEach((article) => appendArticle(generateArticle(article)))
  )
  .catch((err) => console.error(err));
