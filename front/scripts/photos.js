const userCredentials =
  window.sessionStorage["user"] && JSON.parse(window.sessionStorage["user"]);

const URL = "https://awril-publishing-platform.herokuapp.com";

if (!userCredentials?.email) {
  window.location.href = "/login";
}

const photosGrid = document.querySelector(".photos");
const renderImages = (data) => {
  data.reverse().forEach((img) => {
    renderImage(img);
  });
};
const renderImage = (image) => {
  const imgContainer = `<a href="/photo/${image.id}"><div class="photo-card">
  <div class="img">
  <img
  src="${image.filepath}"
  alt="${image.filepath}"
  />
  </div>
  <p>${image.name}</p>
</div></a>`;
  photosGrid.innerHTML += imgContainer;
};
fetch(`${URL}/photos/${userCredentials.email}`)
  .then((res) => res.json())
  .then((data) => {
    renderImages(data);
  });
