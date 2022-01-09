"use strict";

var userCredentials = window.sessionStorage["user"];
var queryString = window.location.search;
var urlParams = new URLSearchParams(queryString);
var URL = "http://127.0.0.1:3000";
var params = urlParams.getAll("id");
var id = urlParams.get("id");

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

var userData;
var userArticles;

function getProfileDataByEmail(email) {
  fetch("".concat(URL, "/users/byEmail/").concat(email)).then(function (res) {
    return res.json();
  }).then(function (uData) {
    if (uData) {
      console.log(uData);
      userData = uData;
      fetch("".concat(URL, "/articles/byUser/").concat(email)).then(function (data) {
        return data.json();
      }).then(function (articles) {
        userArticles = articles.articles;
        renderUI(userData);
      });
    }
  })["catch"](function (err) {
    return console.log(err);
  });
}

function getProfileDataByID(id) {
  fetch("".concat(URL, "/users/byID/").concat(id)).then(function (res) {
    return res.json();
  }).then(function (data) {
    if (data) {
      userData = data;
      fetch("".concat(URL, "/articles/byUser/").concat(userData.email)).then(function (data) {
        return data.json();
      }).then(function (articles) {
        userArticles = articles.articles;
        renderUI(userData);
      });
    }
  })["catch"](function (err) {
    return console.log(err);
  });
}

function renderUI(user) {
  console.log(userData);
  console.log(userArticles);

  if (id === null) {
    // my page
    // render buttons
    var profileButtons = document.querySelector(".profile-buttons");
    profileButtons.innerHTML += "\n    <a class=\"button-link\" href=\"/notifications\">Notifications</a>\n          <a class=\"button-link\" href=\"/photos\">Photos</a>\n          <a class=\"button-link\" href=\"/questions\">Questions</a>\n    ";

    if (user.role === "Administrator") {
      profileButtons.innerHTML += "\n      <a class=\"button-link\" href=\"/addcategory\">Add FAQ</a>\n      <a class=\"button-link\" href=\"/addcategory\">Add Category</a>\n      <a class=\"button-link\" href=\"edit\">Edit Profile</a> -->\n      ";
    }
  }

  var imageContainer = document.querySelector(".profile-photo img");
  imageContainer.src = "".concat(URL, "/static/profile_pics/").concat(user.avatar_path);
  var nameContainer = document.querySelector(".name-surname");
  nameContainer.innerHTML = "".concat(user.name, " ").concat(user.surname); // TODO: location

  var locationContainer = document.querySelector(".location"); // locationContainer.innerHTML = `${}`

  var profileNameContainer = document.querySelector(".profile-name");

  if (user.Role === "Default" && id === null) {
    profileNameContainer.innerHTML += " <a class=\"button-link\" href=\"/questions\">Edit profile</a>";
  }

  if (id !== null) {
    //   TODO: check if following
    profileNameContainer.innerHTML += " <a class=\"button-link\" href=\"/follow\">Follow/Unfollow</a>";
  }

  var followersFollowingContainer = document.querySelector(".profile-followers");
  followersFollowingContainer.innerHTML = "\n    <p>\n    Followers:\n    <span><a class=\"followers-link\" href=\"/followers/".concat(user.id, "\">").concat(user.followers, "</a></span>\n    </p>\n    <p>\n    Following:\n    <span><a class=\"followers-link\" href=\"/following/").concat(user.following, "\">").concat(user.following, "</a></span>\n    </p>\n    ");
  var profileDescription = document.querySelector(".profile-description p");
  profileDescription.innerHTML = user.profile_description;
  var socialMediaLinksContainer = document.querySelector(".profile-links");
  user.socials.forEach(function (el) {
    socialMediaLinksContainer.innerHTML += "\n      <a class=\"dark\" href=\"".concat(el.link, "\">").concat(el.title, "</a>\n      ");
  }); // RENDER ARTICLES

  var articlesContainer = document.querySelector(".articles");
  console.log("CONTAINER", articlesContainer);
  userArticles.forEach(function (article) {
    var articleContainer = "<div class=\"article\" data-id=\"".concat(article.ID, "\">");
    articleContainer += "<div class=\"article-photo\">\n    <img src=\"".concat(URL, "/static/article_thumbnails/").concat(article.thumbnail_path, "\" alt=\"article_thumbnail\" />\n    </div>");
    articleContainer += "<div class=\"article-information\">";
    articleContainer += "<h3>".concat(article.title, "</h3>\n  <p>\n    ").concat(article.description, "\n  </p>");
    articleContainer += "<div class=\"article-tags\">";
    article.tags.forEach(function (tag) {
      articleContainer += "<a href=\"/articles/byTag/?tag=".concat(tag.Tag, "\" class=\"tag\">").concat(tag.Tag, "</a>");
    });
    articleContainer += "</div></div></div>";
    articlesContainer.innerHTML += articleContainer;
  });
  articlesContainer.addEventListener("click", function (e) {
    var article = e.target.closest(".article");

    if (article) {
      console.log(article.dataset.id);
      window.location.replace("/article/?id=" + article.dataset.id);
    }
  });
}