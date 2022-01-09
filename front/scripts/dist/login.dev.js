"use strict";

var signInButton = document.querySelector("#sign-in-btn");
var emailInput = document.querySelector("#email-input");
var passwordInput = document.querySelector("#password-input");
var SERVER_URL = "http://127.0.0.1:3000";

if (window.sessionStorage["user"]) {
  window.location.replace("/profile");
}

signInButton.addEventListener("click", function (e) {
  e.preventDefault();
  var data = {
    email: emailInput.value,
    password: passwordInput.value
  };

  if (data.email !== "" && data.password !== "") {
    fetch("".concat(SERVER_URL, "/users/findByCredentials"), {
      headers: {
        "Content-Type": "application/json"
      },
      method: "POST",
      body: JSON.stringify(data)
    }).then(function (response) {
      if (response.status === 200) {
        return response.json();
      }

      throw "Invalid Data";
    }).then(function (data) {
      console.log(data);

      if (data) {
        window.sessionStorage.setItem("user", JSON.stringify({
          email: data.email,
          password: data.password
        }));
        window.location.replace("/profile");
      }
    })["catch"](function (err) {
      return console.error(err);
    });
  }
});