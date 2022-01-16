const addSectionButton = document.querySelector("#add-section");
const form = document.querySelector("#add-photo");
const buttonsContainer = document.querySelector(".buttons-container");

const articleData = {};
const sections = [];
let sectionsCount = 0;

const addSectionToUI = (section) => {
  let sectionContainer = document.createElement("div");
  sectionContainer.classList.add(`add-section-container`);
  sectionContainer.dataset.index = sectionsCount;
  sectionContainer.innerHTML = `
    <div class="input-container" >
    <label for="title-${sectionsCount}">Title</label>
    <input type="text" name="title-${sectionsCount}" id="title-${sectionsCount}" />
  </div>
  <div class="input-container">
    <label for="content-${sectionsCount}">Content</label>
    <textarea
      type="text"
      name="content-${sectionsCount}"
      id="content-${sectionsCount}"
      rows="10"
    ></textarea>
  </div>
  <button type="button" id="add-gallery-${sectionsCount}" data-index=${sectionsCount} class="btn dark add-gallery-btn">Add Gallery</button>
    `;
  form.insertBefore(sectionContainer, buttonsContainer);
};
const addGalleryToUI = (index) => {
  let galleryContainer = document.createElement("div");
  galleryContainer.classList.add("add-gallery-container");
  galleryContainer.dataset.index = index;

  galleryContainer.innerHTML = `
  <div class="input-container">
    <label for="gallery-title-${index}">Gallery Title</label>
    <input type="text" name="gallery-title-${index}" id="gallery-title-${index}" />
  </div>
  <button type="button" class="btn dark add-photo-btn" data-index=${index}>Add Photo</button>

  `;
  document
    .querySelector(`.add-section-container[data-index="${index}"]`)
    .appendChild(galleryContainer);
};
const addPhotoToUI = (index) => {
  let photoContainer = document.createElement("div");
  photoContainer.classList.add("add-photo-container");
  photoContainer.dataset.index = index;
  photoContainer.innerHTML = `
    <div class="input-photo-container" dataset-index=${
      sections[index].gallery.photos.length - 1
    }>
    <div class="photo">
      <div class="img">
        <p>Image Preview</p>
        <img
          src="#"
          alt="Click to choose photo"
        />
      </div>
      <div class="img-data">
        <div class="input-container">
          <label for="photo-title-${
            sections[index].gallery.photos.length - 1
          }">Title</label>
          <input type="text" name="photo-title-${
            sections[index].gallery.photos.length - 1
          }" id="photo-title-${sections[index].gallery.photos.length - 1}" />
        </div>
        <div class="input-container">
          <label for="photo-alternative-${
            sections[index].gallery.photos.length - 1
          }">Alternative Text</label>
          <input
            type="text"
            name="photo-alternative-${
              sections[index].gallery.photos.length - 1
            }"
            id="photo-alternative-${sections[index].gallery.photos.length - 1}"
          />
        </div>
        <div class="input-container">
          <label for="photo-source-${
            sections[index].gallery.photos.length - 1
          }">Source</label>
          <input type="text" name="photo-source-${
            sections[index].gallery.photos.length - 1
          }" id="photo-source-${sections[index].gallery.photos.length - 1}" />
        </div>
      </div>
      <div class="img-remove">
        <button type="button" class="btn dark btn-photo-remove" dataset-index=${
          sections[index].gallery.photos.length - 1
        }>Remove</button>
      </div>
    </div>
  </div>
    `;
  document
    .querySelector(`.add-gallery-container[data-index="${index}"]`)
    .insertBefore(
      photoContainer,
      document.querySelector(
        `.add-gallery-container[data-index="${index}"] .add-photo-btn`
      )
    );
};

const appendSection = () => {
  let section = { title: "", desctiption: "" };
  sections.push(section);
  addSectionToUI(section);
  sectionsCount++;
};
const appendGallery = (index) => {
  sections[index].gallery = { title: "", photos: [] };
  addGalleryToUI(index);
  document.querySelector(`#add-gallery-${index}`).remove();
};
const appendPhoto = (index) => {
  sections[index].gallery.photos.push({
    id: "",
    title: "",
    alternative: "",
    source: "",
  });
  addPhotoToUI(index);
};
addSectionButton.addEventListener("click", (e) => {
  appendSection();
  console.log(sections);
});

form.addEventListener("click", (e) => {
  if (e.target.classList.contains("add-gallery-btn")) {
    appendGallery(e.target.dataset.index);
  } else if (e.target.classList.contains("add-photo-btn")) {
    console.log("APPEND PHOTO", e.target.dataset.index);
    appendPhoto(e.target.dataset.index);
  }
});
