const countrySelect = document.querySelector("#country-input");
const genderSelect = document.querySelector("#gender-input");
const cityList = document.querySelector("#cityname");
const cityInput = document.querySelector("#city-input");
const SERVER_URL = "http://127.0.0.1:3000";

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
    .then((data) => data.json())
    .then((data) => {
      cityList.innerHTML = "";

      data.forEach((city) => {
        let cityOption = document.createElement("option");
        cityOption.setAttribute("value", city.title);
        cityList.appendChild(cityOption);
      });
    });
};
const loadGenders = () => {
  fetch(`${SERVER_URL}/genders/all`)
    .then((data) => data.json())
    .then((data) => {
      data.forEach((city) => {
        let genderOption = document.createElement("option");
        genderOption.setAttribute("value", gender.ID);
        genderOption.innerHTML = city.title;
        genderSelect.appendChild(genderOption);
      });
    });
};

countrySelect.addEventListener("change", (e) => {
  console.log(e.target.value);
  cityInput.value = "";
  loadCities(e.target.value);
});

loadCountries();
loadGenders();
