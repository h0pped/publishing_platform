const userCredentials = window.sessionStorage["user"];
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

const URL = "http://127.0.0.1:3000";
const params = urlParams.getAll("id");

const id = urlParams.get("id");

console.log(id);
let article;
fetch(`${URL}/articles/byID/${id}`)
  .then((res) => res.json())
  .then((data) => {
    article = data;
    console.log(data);
    renderUI(article);
  })
  .catch((err) => {
    console.log(err);
    renderError(err);
  });

const renderUI = (article) => {
  console.log("render", article);
  const container = document.querySelector(".container");
  let articleContainer = `<div class="article">`;
  articleContainer += `<div class="article-main">`;
  articleContainer += `
        <h2 class="article-title">
        ${article.title}
      </h2>
      <img
        src="${URL}/static/article_thumbnails/${article.thumbnail_path}"
        alt="article thumbnail"
        class="article-image"
      />
      <p class="article-description">
        ${article.description}
      </p>
        `;
  articleContainer += "</div>";
  article.sections.forEach((section) => {
    articleContainer += `<div class="article-section">`;
    articleContainer += `<h2>${section.title}</h2>`;
    articleContainer += `<div class="section-gallery">`;
    articleContainer += `<div class="gallery">`;
    articleContainer += `<button class="prev"><</button>`;
    articleContainer += `Gallery: ${section.gallery.title}`;
    articleContainer += `<div class="gallery-images">`;

    section.gallery.photos.forEach((photo) => {
      articleContainer += `<div class="image">
        <img src="${URL}/static/user_photos/${photo.filepath}" alt="${photo.alt_text}" />
        <h4>
          ${photo.title}
        </h4>
        <p>Source: ${photo.source}</p>
      </div>`;
    });
    articleContainer += `</div>`;
    articleContainer += `<button class="next">></button>`;
    articleContainer += `</div>`;
    articleContainer += `</div>`;
    articleContainer += `<div class="section-content">${section.content}</div>`;
    articleContainer += `</div>`;
  });
  articleContainer += "</div>";
  container.innerHTML += articleContainer;
};
const renderError = (error) => {
  console.log(error);
};
// const prevButton = document.querySelector(".prev");
// const nextButton = document.querySelector(".next");
// const imagesGallery = document.querySelector(".gallery-images");
// let currentIndex = [0];
// let translateX = [0];
// console.log(prevButton);

// prevButton.addEventListener("click", (e) => {
//   images = imagesGallery.querySelectorAll(".image");
//   if (currentIndex[0] != 0) {
//     translateX[0] += 700;
//     currentIndex[0] -= 1;

//     images.forEach((image) => {
//       image.style.transform = `translateX(${translateX[0]}px)`;
//     });
//   }
// });

// nextButton.addEventListener("click", (e) => {
//   images = imagesGallery.querySelectorAll(".image");
//   translateX[0] -= 700;
//   currentIndex[0] += 1;

//   images.forEach((image) => {
//     image.style.transform = `translateX(${translateX[0]}px)`;
//   });
// });
