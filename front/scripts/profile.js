const userCredentials = window.sessionStorage["user"];
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

const URL = "http://127.0.0.1:3000";
const params = urlParams.getAll("id");

const id = urlParams.get("id");
if (id != null) {
  console.log("Someones page");
  getProfileDataByID(id);
} else {
  //'My profile'
  if (userCredentials) {
    //if logged in
    console.log("My page");
    console.log(JSON.parse(userCredentials));
    getProfileDataByEmail(JSON.parse(userCredentials).email);
  } else {
    //redirect if not
    window.location.replace("/login");
  }
}
let userData;

function getProfileDataByEmail(email) {
  fetch(`${URL}/users/byEmail/${email}`)
    .then((res) => res.json())
    .then((uData) => {
      if (uData) {
        userData = uData;
        fetch(`${URL}/articles/byUser/${email}`)
          .then((data) => data.json())
          .then((data) => {
            console.log(data);
            renderUI(userData);
          });
      }
    })
    .catch((err) => console.log(err));
}
function getProfileDataByID(id) {
  fetch(`${URL}/users/byID/${id}`)
    .then((res) => res.json())
    .then((data) => {
      if (data) {
        renderUI(data);
      }
    })
    .catch((err) => console.log(err));
}

function renderUI(user) {
  console.log(user);
  if (id === null) {
    // my page
    // render buttons
    const profileButtons = document.querySelector(".profile-buttons");
    profileButtons.innerHTML += `
    <a class="button-link" href="/notifications">Notifications</a>
          <a class="button-link" href="/photos">Photos</a>
          <a class="button-link" href="/questions">Questions</a>
    `;
    if (user.role === "Administrator") {
      profileButtons.innerHTML += `
      <a class="button-link" href="/addcategory">Add FAQ</a>
      <a class="button-link" href="/addcategory">Add Category</a>
      <a class="button-link" href="edit">Edit Profile</a> -->
      `;
    }
  }
  const imageContainer = document.querySelector(".profile-photo img");
  imageContainer.src = `${URL}/static/profile_pics/${user.avatar_path}`;

  const nameContainer = document.querySelector(".name-surname");
  nameContainer.innerHTML = `${user.name} ${user.surname}`;

  // TODO: location
  const locationContainer = document.querySelector(".location");
  // locationContainer.innerHTML = `${}`

  const profileNameContainer = document.querySelector(".profile-name");
  if (user.Role === "Default" && id === null) {
    profileNameContainer.innerHTML += ` <a class="button-link" href="/questions">Edit profile</a>`;
  }
  if (id !== null) {
    //   TODO: check if following
    profileNameContainer.innerHTML += ` <a class="button-link" href="/follow">Follow/Unfollow</a>`;
  }

  const followersFollowingContainer =
    document.querySelector(".profile-followers");
  followersFollowingContainer.innerHTML = `
    <p>
    Followers:
    <span><a class="followers-link" href="/followers/${user.id}">${user.followers}</a></span>
    </p>
    <p>
    Following:
    <span><a class="followers-link" href="/following/${user.following}">${user.following}</a></span>
    </p>
    `;

  const profileDescription = document.querySelector(".profile-description p");
  profileDescription.innerHTML = user.profile_description;

  const socialMediaLinksContainer = document.querySelector(".profile-links");
  user.socials.forEach((el) => {
    socialMediaLinksContainer.innerHTML += `
      <a class="dark" href="${el.link}">${el.title}</a>
      `;
  });

  // RENDER ARTICLES
}
