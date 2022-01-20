const userCredentials = window.sessionStorage["user"];
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

const URL = "https://awril-publishing-platform.herokuapp.com";
const params = urlParams.getAll("id");

const id = urlParams.get("id");

function sqlToJsDate(sqlDate) {
  var dateParts = sqlDate.split("-");
  return new Date(dateParts[0], dateParts[1] - 1, dateParts[2].substr(0, 2));
}

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

let currentIndex = [];
let translateX = [];
let galleries = [];

const renderUI = (article) => {
  console.log("render", article);
  const container = document.querySelector(".container");
  let articleContainer = `<div class="article">`;
  articleContainer += `<div class="article-main">`;
  articleContainer += `
        <h1 class="article-title title">
        ${article.title}
      </h1>
      ${
        article.thumbnail_path
          ? `<img
      src="${article.thumbnail_path}"
      alt="article thumbnail"
      class="article-image"
    />`
          : ""
      }
      
      <p class="article-description">
        ${article.description}
      </p>
        `;
  articleContainer += "</div>";
  article.sections.forEach((section, index) => {
    console.log(section);
    if (section.gallery) {
      galleries.push(section.gallery.photos);
    } else {
      galleries.push(null);
    }
    currentIndex.push(0);
    translateX.push(0);
    articleContainer += `<div class="article-section">`;
    articleContainer += `<h2>${section.title}</h2>`;
    if (section.gallery) {
      articleContainer += `<div class="section-gallery">`;
      articleContainer += `<div class="gallery" data-index=${index}>`;
      if (section.gallery?.photos.length > 1) {
        articleContainer += `<button class="prev"><</button>`;
      }
      articleContainer += `${
        section.gallery?.title != "null"
          ? `Gallery: ${section.gallery?.title}`
          : "Gallery"
      }`;
      articleContainer += `<div class="gallery-images">`;

      section.gallery?.photos.forEach((photo) => {
        articleContainer += `<div class="image">
        <img src="${photo.filepath}" alt="${photo.alt_text}" />
          ${photo.title == null ? "" : `<h4>${photo.title}</h4>`}
        <p>Source: ${photo.source}</p>
      </div>`;
      });
      articleContainer += `</div>`;
      if (section.gallery?.photos.length > 1) {
        articleContainer += `<button class="next">></button>`;
      }
      articleContainer += `</div>`;
      articleContainer += `</div>`;
    }

    articleContainer += `<div class="section-content">${section.content}</div>`;
    articleContainer += `</div>`;
  });
  articleContainer += `
  <div class="article-data">
  <p class="author">Author: <a href="/profile/?id=${article.user_id}">${
    article.user.surname
  } ${article.user.name}</a></p>
  <p class="likes">Likes: <a href="/article/likes/?id=${article.id}">${
    article.likes
  }</a></p>
  <p class="date">Date: ${sqlToJsDate(article.postDate).toLocaleString(
    "fr-CA",
    { year: "numeric", month: "2-digit", day: "2-digit" }
  )}</p>
</div>
  `;
  articleContainer += "</div>";
  container.innerHTML += articleContainer;
  let articleGalleries = container.querySelectorAll(".gallery");
  console.log("GALLERIES", articleGalleries);
  articleGalleries.forEach((gallery) => {
    gallery.addEventListener("click", (e) => {
      const prev = e.target.closest(".prev");
      const next = e.target.closest(".next");
      if (prev) {
        if (currentIndex[gallery.dataset.index] != 0) {
          translateX[gallery.dataset.index] += gallery.offsetWidth;
          currentIndex[gallery.dataset.index] -= 1;
          const images = gallery.querySelectorAll(".gallery-images .image");
          images.forEach((image) => {
            image.style.transform = `translateX(${
              translateX[gallery.dataset.index]
            }px)`;
          });
        }
      }
      if (next) {
        const images = gallery.querySelectorAll(".gallery-images .image");
        if (currentIndex[gallery.dataset.index] != images.length - 1) {
          translateX[gallery.dataset.index] -= gallery.offsetWidth;
          currentIndex[gallery.dataset.index] += 1;
          images.forEach((image) => {
            image.style.transform = `translateX(${
              translateX[gallery.dataset.index]
            }px)`;
          });
        }
      }
    });
  });
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
