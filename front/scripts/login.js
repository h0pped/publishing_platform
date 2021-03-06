const signInButton = document.querySelector("#sign-in-btn");
const emailInput = document.querySelector("#email-input");
const passwordInput = document.querySelector("#password-input");
const SERVER_URL = "https://awril-publishing-platform.herokuapp.com";

if (window.sessionStorage["user"]) {
  window.location.replace("/profile");
}

signInButton.addEventListener("click", (e) => {
  e.preventDefault();
  const data = {
    email: emailInput.value,
    password: passwordInput.value,
  };
  if (data.email !== "" && data.password !== "") {
    fetch(`${SERVER_URL}/users/findByCredentials`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        }
        throw "Invalid Data";
      })
      .then((data) => {
        console.log(data);
        if (data) {
          window.sessionStorage.setItem(
            "user",
            JSON.stringify({ email: data.email, password: data.password })
          );
          window.location.replace("/profile");
        }
      })
      .catch((err) => console.error(err));
  }
});
