const userCredentials =
  window.sessionStorage["user"] && JSON.parse(window.sessionStorage["user"]);

const URL = "http://127.0.0.1:3000";

if (!userCredentials?.email) {
  window.location.href = "/login";
}

const photosGrid = document.querySelector(".photos");
const renderImages = (data) => {
  data.forEach((img) => {
    renderImage(img);
  });
};
const renderImage = (image) => {
  const imgContainer = `<a href="/photo/${image.id}"><div class="photo-card">
  <div class="img">
  <img
  src="${URL}/static/user_photos/${image.filepath}"
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
