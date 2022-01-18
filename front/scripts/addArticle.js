const userCredentials =
  window.sessionStorage["user"] && JSON.parse(window.sessionStorage["user"]);

if (!userCredentials?.email) {
  window.location.href = "/login";
}

const addSectionButton = document.querySelector("#add-section");
const form = document.querySelector("#add-photo");
let inputs = form.elements;
const buttonsContainer = document.querySelector(".buttons-container");
const modal = document.querySelector("#modal");
const photosGrid = document.querySelector(".photos");

const imageInput = document.querySelector("#image-input");
const imagePreview = document.querySelector(".image-preview");
imageInput.addEventListener("change", (e) => {
  imagePreview.src = URL.createObjectURL(e.target.files[0]);
  imagePreview.onload = function () {
    URL.revokeObjectURL(imagePreview.src);
    document.querySelector("#image-preview-text").style.display = "none";
  };
});

const SERVER_URL = "http://127.0.0.1:3000";
let articleData = {};
const sections = [];
let sectionsCount = 0;
let categories = [];
let photos = [];

let currentImageSelector = {};

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
    <div class="input-photo-container" data-index=${
      sections[index].gallery.photos.length - 1
    }>
    <div class="photo">
      <div class="img">
        <p>Image Preview</p>
        <img
          src="#"
          alt="Click to choose photo"
          class="gallery-img"
          data-index=${sections[index].gallery.photos.length - 1}
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
  let section = { title: "", content: "" };
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

const showModal = () => {
  modal.classList.remove("hidden");
};

const hideModal = () => {
  photosGrid.innerHTML = "";
  modal.classList.add("hidden");
};
modal.addEventListener("click", (e) => {
  let image = e.target.closest(".photo-card");
  let chosenPhoto;
  if (image) {
    chosenPhoto = photos.find((el) => el.id == image.dataset.index);
    sections[currentImageSelector.section].gallery.photos[
      currentImageSelector.photo
    ] = {
      id: image.dataset.index,
      title: "",
      alternative: "",
      source: "",
    };
  }
  document.querySelector(
    `.add-section-container[data-index="${currentImageSelector.section}"] .gallery-img[data-index="${currentImageSelector.photo}"]`
  ).src = `${SERVER_URL}/static/user_photos/${chosenPhoto.filepath}`;
  hideModal();
});
const renderImage = (image) => {
  const imgContainer = `<div class="photo-card" data-index=${image.id}>
  <div class="img" >
  <img
  src="${SERVER_URL}/static/user_photos/${image.filepath}"
  alt="${image.filepath}"
  />
  </div>
  <p>${image.name}</p>
</div>`;
  photosGrid.innerHTML += imgContainer;
};
const renderImages = (json) => {
  photosGrid.innerHTML = "";
  showModal();
  json.forEach((image) => {
    renderImage(image);
  });
};
const selectPhoto = async () => {
  const data = await fetch(`${SERVER_URL}/photos/${userCredentials.email}`);
  const json = await data.json();
  photos = json;
  renderImages(json);
};
form.addEventListener("click", async (e) => {
  if (e.target.classList.contains("add-gallery-btn")) {
    appendGallery(e.target.dataset.index);
  } else if (e.target.classList.contains("add-photo-btn")) {
    appendPhoto(e.target.dataset.index);
  } else if (e.target.classList.contains("gallery-img")) {
    const sectionIndex = e.target.closest(".add-section-container").dataset
      .index;
    console.log(
      `CHANGE PHOTO ON SECTION #${sectionIndex} ON PHOTO #${e.target.dataset.index}`
    );
    currentImageSelector = {
      section: sectionIndex,
      photo: e.target.dataset.index,
    };
    await selectPhoto();
  }
});

const fillCategories = () => {
  const categoriesContainer = document.querySelector("#category");
  categories.forEach((category) => {
    categoriesContainer.innerHTML += `<option value="${category.ID}">${category.title}</option>`;
  });
};

const getBase64 = (file) => {
  return new Promise((resolve, reject) => {
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.onerror = (err) => {
      reject("Error: ", error);
    };
  });
};

const splitTags = (tags) =>
  tags.split(",").map((tag) => tag.trim().toLowerCase());

const parseArticleData = async () => {
  let img;
  if (inputs["image-input"].files[0]) {
    try {
      img = await getBase64(inputs["image-input"].files[0]);
    } catch (err) {
      console.error(err);
    }
  }
  let title = document.querySelector("#name").value;
  let description = document.querySelector("#description").value;
  let category = categories.find(
    (el) => el.ID == document.querySelector("#category").value
  );
  let tagsInput = document.querySelector("#tags").value;
  if (tagsInput !== "") {
    tags = splitTags(tagsInput);
  } else {
    tags = [];
  }

  const sectionsContainer = document.querySelectorAll(".add-section-container");
  sectionsContainer.forEach((section) => {
    console.log(sections);
    const sectionIndex = section.dataset.index;
    const sectionTitle = section.querySelector(`#title-${sectionIndex}`).value;
    const sectionContent = section.querySelector(
      `#content-${sectionIndex}`
    ).value;
    const galleries = section.querySelectorAll(".add-gallery-container");
    galleries.forEach((gallery) => {
      const galleryIndex = gallery.dataset.index;
      const galleryTitle = gallery.querySelector(
        `#gallery-title-${galleryIndex}`
      ).value;
      const images = gallery.querySelectorAll(".input-photo-container");
      images.forEach((img) => {
        const imgIndex = img.dataset.index;
        if (sections[sectionIndex].gallery.photos[imgIndex].id) {
          console.log(img);
          console.log(`#photo-title-${imgIndex}`);
          console.log(img.querySelector(`#photo-title-${imgIndex}`));
          const imgTitle = img.querySelector(`#photo-title-${imgIndex}`).value;
          const imgAlt = img.querySelector(
            `#photo-alternative-${imgIndex}`
          ).value;
          const imgSource = img.querySelector(
            `#photo-source-${imgIndex}`
          ).value;
          sections[sectionIndex].gallery.photos[imgIndex].title = imgTitle;
          sections[sectionIndex].gallery.photos[imgIndex].alternative = imgAlt;
          sections[sectionIndex].gallery.photos[imgIndex].source = imgSource;
        }
      });
      sections[sectionIndex].gallery.title = galleryTitle;
    });
    sections[sectionIndex].title = sectionTitle;
    sections[sectionIndex].content = sectionContent;
  });

  articleData = {
    img,
    title,
    description,
    category,
    tags,
    sections,
  };
};

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  await parseArticleData();
  console.log(articleData);
});

// FETCH CATEGORIES
(async () => {
  const result = await fetch(`${SERVER_URL}/categories/all`);
  const json = await result.json();
  categories = json;
  fillCategories();
})();
