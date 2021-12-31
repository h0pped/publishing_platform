const countrySelect = document.querySelector("#country-input");
const genderSelect = document.querySelector("#gender-input");
const cityList = document.querySelector("#cityname");
const cityInput = document.querySelector("#city-input");
const SERVER_URL = "http://127.0.0.1:3000";
const signUpForm = document.querySelector("#signup-form");
const inputs = signUpForm.elements;
const imageInput = document.querySelector("#image-input");

const imagePreview = document.querySelector(".image-preview");
const loadCountries = () => {
  fetch(`${SERVER_URL}/countries/all`)
    .then((data) => data.json())
    .then((data) =>
      data.forEach((country) => {
        let countryOption = document.createElement("option");
        countryOption.setAttribute("value", country.ID);
        countryOption.innerHTML = `${country.title}`;
        countrySelect.appendChild(countryOption);
      })
    );
};

const loadCities = (countryID) => {
  fetch(`${SERVER_URL}/cities/byCountryID/${countryID}`)
    .then((data) => {
      console.log(data);
      return data.json();
    })
    .then((data) => {
      cityList.innerHTML = "";

      data.forEach((city) => {
        let cityOption = document.createElement("option");
        cityOption.setAttribute("value", city.title);
        cityList.appendChild(cityOption);
      });
    })
    .catch((err) => console.log(err));
};
const loadGenders = () => {
  fetch(`${SERVER_URL}/genders/all`)
    .then((data) => data.json())
    .then((data) => {
      data.forEach((gender) => {
        let genderOption = document.createElement("option");
        genderOption.setAttribute("value", gender.ID);
        genderOption.innerHTML = gender.title;
        genderSelect.appendChild(genderOption);
      });
    });
};

countrySelect.addEventListener("change", (e) => {
  console.log(e.target.value);
  cityInput.value = "";
  loadCities(e.target.value);
});
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

signUpForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  console.log("processing...");
  const img = await getBase64(inputs["image-input"].files[0]);
  const user = {
    avatar: img,
    name: inputs["name-input"].value,
    surname: inputs["surname-input"].value,
    email: inputs["email-input"].value,
    password: inputs["password-input"].value,
    countryID: inputs["country-input"].value,
    city: inputs["city-input"].value,
    genderID: inputs["gender-input"].value,
    street: inputs["street-input"].value,
    postalCode: inputs["postal-input"].value,
    description: inputs["description-input"].value,
  };
  fetch(`${SERVER_URL}/users/signup`, {
    headers: {
      "Content-type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(user),
  })
    .then((response) => response.json())
    .then((data) => {
      window.sessionStorage.setItem(
        "user",
        JSON.stringify({ email: data.email, password: data.password })
      );
      window.location.replace("/profile");
    })
    .catch((err) => console.error(err));
});
imageInput.addEventListener("change", (e) => {
  imagePreview.src = URL.createObjectURL(e.target.files[0]);
  imagePreview.onload = function () {
    URL.revokeObjectURL(imagePreview.src);
    document.querySelector("#image-preview-text").style.display = "none";
  };
});
loadCountries();
loadGenders();
