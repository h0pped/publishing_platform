"use strict";

var userCredentials = window.sessionStorage["user"];
var queryString = window.location.search;
var urlParams = new URLSearchParams(queryString);
var URL = "http://127.0.0.1:3000";
var params = urlParams.getAll("id");
var id = urlParams.get("id");
console.log(id);
var article;
fetch("".concat(URL, "/articles/byID/").concat(id)).then(function (res) {
  return res.json();
}).then(function (data) {
  article = data;
  console.log(data);
  renderUI(article);
})["catch"](function (err) {
  console.log(err);
  renderError(err);
});
var currentIndex = [];
var translateX = [];
var galleries = [];

var renderUI = function renderUI(article) {
  console.log("render", article);
  var container = document.querySelector(".container");
  var articleContainer = "<div class=\"article\">";
  articleContainer += "<div class=\"article-main\">";
  articleContainer += "\n        <h2 class=\"article-title\">\n        ".concat(article.title, "\n      </h2>\n      <img\n        src=\"").concat(URL, "/static/article_thumbnails/").concat(article.thumbnail_path, "\"\n        alt=\"article thumbnail\"\n        class=\"article-image\"\n      />\n      <p class=\"article-description\">\n        ").concat(article.description, "\n      </p>\n        ");
  articleContainer += "</div>";
  article.sections.forEach(function (section, index) {
    galleries.push(section.gallery.photos);
    currentIndex.push(0);
    translateX.push(0);
    articleContainer += "<div class=\"article-section\">";
    articleContainer += "<h2>".concat(section.title, "</h2>");
    articleContainer += "<div class=\"section-gallery\">";
    articleContainer += "<div class=\"gallery\" data-index=".concat(index, ">");

    if (section.gallery.photos.length > 1) {
      articleContainer += "<button class=\"prev\"><</button>";
    }

    articleContainer += "Gallery: ".concat(section.gallery.title);
    articleContainer += "<div class=\"gallery-images\">";
    section.gallery.photos.forEach(function (photo) {
      articleContainer += "<div class=\"image\">\n        <img src=\"".concat(URL, "/static/user_photos/").concat(photo.filepath, "\" alt=\"").concat(photo.alt_text, "\" />\n        <h4>\n          ").concat(photo.title, "\n        </h4>\n        <p>Source: ").concat(photo.source, "</p>\n      </div>");
    });
    articleContainer += "</div>";

    if (section.gallery.photos.length > 1) {
      articleContainer += "<button class=\"next\">></button>";
    }

    articleContainer += "</div>";
    articleContainer += "</div>";
    articleContainer += "<div class=\"section-content\">".concat(section.content, "</div>");
    articleContainer += "</div>";
  });
  articleContainer += "</div>";
  container.innerHTML += articleContainer;
  var articleGalleries = container.querySelectorAll(".gallery");
  console.log("GALLERIES", articleGalleries);
  articleGalleries.forEach(function (gallery) {
    gallery.addEventListener("click", function (e) {
      var prev = e.target.closest(".prev");
      var next = e.target.closest(".next");

      if (prev) {
        if (currentIndex[gallery.dataset.index] != 0) {
          translateX[gallery.dataset.index] += gallery.offsetWidth;
          currentIndex[gallery.dataset.index] -= 1;
          var images = gallery.querySelectorAll(".gallery-images .image");
          images.forEach(function (image) {
            image.style.transform = "translateX(".concat(translateX[gallery.dataset.index], "px)");
          });
        }
      }

      if (next) {
        var _images = gallery.querySelectorAll(".gallery-images .image");

        if (currentIndex[gallery.dataset.index] != _images.length - 1) {
          translateX[gallery.dataset.index] -= gallery.offsetWidth;
          currentIndex[gallery.dataset.index] += 1;

          _images.forEach(function (image) {
            image.style.transform = "translateX(".concat(translateX[gallery.dataset.index], "px)");
          });
        }
      }
    });
  });
};

var renderError = function renderError(error) {
  console.log(error);
}; // const prevButton = document.querySelector(".prev");
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