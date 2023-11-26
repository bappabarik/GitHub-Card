const body = document.querySelector("body");
const darkThemeMq = window.matchMedia("(prefers-color-scheme:dark)");

const followers = document.querySelector(".followersBox");
const following = document.querySelector(".followingBox");
const repos = document.querySelector(".reposBox");

const lowerHalfUls = document.querySelectorAll(".lowerHalf ul");

const liItems = document.querySelectorAll(".nav-menu li");

liItems.forEach((item) => {
  item.addEventListener("click", () => {
    if (item.className.includes("followers")) {
      lowerHalfUls.forEach((ul) => {
        ul.classList.add("hidden");
      });
      followers.classList.remove("hidden");
    } else if (item.className.includes("following")) {
      lowerHalfUls.forEach((ul) => {
        ul.classList.add("hidden");
      });
      following.classList.remove("hidden");
    } else if (item.className.includes("repos")) {
      lowerHalfUls.forEach((ul) => {
        ul.classList.add("hidden");
      });
      repos.classList.remove("hidden");
    }

    liItems.forEach((items) => {
      items.classList.remove("active");
    });
    item.classList.add("active");
  });
});

const input = document.querySelector("input");
const card = document.querySelector(".card");
let inputValue = "";

const form = document.querySelector("form");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  inputValue = input.value.trim();
  input.value = "";
  const username = `https://api.github.com/users/${inputValue}`;
  apiRequest(username);
  card.classList.remove("hidden");
  followers.innerHTML = "";
  following.innerHTML = "";
  repos.innerHTML = "";
});

const xhr = new XMLHttpRequest();
// const userReqUrl = "https://api.github.com/users/bappabarik";

function apiRequest(url) {
  xhr.open("GET", url);
  xhr.onreadystatechange = function () {
    console.log(xhr.readyState);
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        const data = JSON.parse(this.responseText);
        if (url === `https://api.github.com/users/${inputValue}`) {
          display(data);
          console.log("main data");
        } else if (
          url === `https://api.github.com/users/${inputValue}/followers`
        ) {
          displayFollowers(data);
          console.log("followers data");
        } else if (
          url === `https://api.github.com/users/${inputValue}/following`
        ) {
          displayFollowing(data);
          console.log("following data");
        } else if (url === `https://api.github.com/users/${inputValue}/repos`) {
          displayRepos(data);
          console.log("repos data");
        }
      } else {
        console.error(`Request failed with status: ${xhr.status}`);
      }
    }
  };
  xhr.onerror = function () {
    console.error("An error occurred during the request.");
  };
  xhr.send();
}

const avatar = document.querySelector(".avatar");
const uName = document.querySelector(".name");
const bio = document.querySelector(".bio");
const address = document.querySelector(".location");
const followersCount = document.querySelector(".followersCount");
const followingCount = document.querySelector(".followingCount");
const repoCount = document.querySelector(".repoCount");

let userFollowersUrl = "";
let userFollowingUrl = "";
let userReposUrl = "";

function display(data) {
  avatar.innerHTML = ` <img src="${data.avatar_url}" alt="GitHub Avatar">`;
  uName.textContent = `${data.name}`;
  bio.textContent = `${data.bio}`;
  address.innerHTML = `<i class="fa-solid fa-location-dot"></i> ${data.location}`;
  followersCount.textContent = `${data.followers}`;
  followingCount.textContent = `${data.following}`;
  repoCount.textContent = `${data.public_repos}`;
  userFollowersUrl = data.followers_url;
  userFollowingUrl = `https://api.github.com/users/${inputValue}/following`;
  userReposUrl = data.repos_url;
  apiRequest(userFollowersUrl);
}

function displayFollowers(data) {
  data.forEach((item) => {
    followers.innerHTML += `<li>
    <a href="#">
      <img
        src="${item.avatar_url}"
        alt=""
      />
      <span>${item.login}</span>
    </a>
  </li>`;
  });
  apiRequest(userFollowingUrl);
}

function displayFollowing(data) {
  data.forEach((item) => {
    following.innerHTML += `<li>
    <a href="#">
      <img
        src="${item.avatar_url}"
        alt=""
      />
      <span>${item.login}</span>
    </a>
  </li>`;
  });

  const followersLi = document.querySelectorAll(".followersBox li");

  followersLi.forEach((item) => {
    item.addEventListener("click", () => {
      console.log(item.textContent);
      inputValue = item.textContent.trim();
      const followersUrl = `https://api.github.com/users/${inputValue}`;
      apiRequest(followersUrl);
    });
  });
  apiRequest(userReposUrl);
}

function displayRepos(data) {
  data.forEach((item) => {
    repos.innerHTML += `<li>
    <a href="${item.html_url}" target ="_blank">
      <span>${item.full_name}</span>
    </a>
  </li>`;
  });

  const followingLi = document.querySelectorAll(".followingBox li");

  followingLi.forEach((item) => {
    item.addEventListener("click", () => {
      console.log(item.textContent);
      inputValue = item.textContent.trim();
      const followingUrl = `https://api.github.com/users/${inputValue}`;
      apiRequest(followingUrl);
    });
  });
}
