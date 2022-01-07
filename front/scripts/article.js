const userCredentials = window.sessionStorage["user"];
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

const URL = "http://127.0.0.1:3000";
const params = urlParams.getAll("id");

const id = urlParams.get("id");

console.log(id);

const prevButton = document.querySelector(".prev");
const nextButton = document.querySelector(".next");
const imagesGallery = document.querySelector(".gallery-images");
let currentIndex = [0];
let translateX = [0];
console.log(prevButton);

prevButton.addEventListener("click", (e) => {
  images = imagesGallery.querySelectorAll(".image");
  if (currentIndex[0] != 0) {
    translateX[0] += 700;
    currentIndex[0] -= 1;

    images.forEach((image) => {
      image.style.transform = `translateX(${translateX[0]}px)`;
    });
  }
});

nextButton.addEventListener("click", (e) => {
  images = imagesGallery.querySelectorAll(".image");
  translateX[0] -= 700;
  currentIndex[0] += 1;

  images.forEach((image) => {
    image.style.transform = `translateX(${translateX[0]}px)`;
  });
});
