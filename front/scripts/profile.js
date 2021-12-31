const userCredentials = window.sessionStorage["user"];
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const id = urlParams.get("id");
if (id != null) {
  console.log("Someones page");
} else {
  //'My profile'
  if (userCredentials) {
    //if logged in
    console.log("My page");
    console.log(JSON.parse(userCredentials));
  } else {
    //redirect if not
    window.location.replace("/login");
  }
}
