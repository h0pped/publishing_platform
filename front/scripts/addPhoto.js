const userCredentials =
  window.sessionStorage["user"] && JSON.parse(window.sessionStorage["user"]);

if (!userCredentials?.email) {
  window.location.href = "/login";
}

const form = document.querySelector("#add-photo");
const inputs = form.elements;

const imageInput = document.querySelector("#image-input");
const imagePreview = document.querySelector(".image-preview");

const SERVER_URL = "https://awril-publishing-platform.herokuapp.com";

function getBase64(file) {
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
}

imageInput.addEventListener("change", (e) => {
  imagePreview.src = URL.createObjectURL(e.target.files[0]);
  imagePreview.onload = function () {
    URL.revokeObjectURL(imagePreview.src);
    document.querySelector("#image-preview-text").style.display = "none";
  };
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  console.log(inputs);
  let img;
  if (inputs["image-input"].files[0]) {
    try {
      img = await getBase64(inputs["image-input"].files[0]);
    } catch (err) {
      console.error(err);
    }
  }
  const data = {
    email: userCredentials?.email,
    img,
    name: inputs["name"].value,
  };
  //   console.log(data);
  const res = await fetch(`${SERVER_URL}/photos/add`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (res.status === 201) {
    window.location.href = "/photos";
  }
});
