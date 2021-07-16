let userFormEl = document.querySelector("#user-form");
let nameInputEl = document.querySelector("#username");
let repoContainerEl = document.querySelector("#repos-container");
let repoSearchTerm = document.querySelector("#repo-search-term");
let languageButtonsEl = document.querySelector("#language-buttons");

let formSubmitHandler = function(event) {
  event.preventDefault();

  // get value from input element 
  let username = nameInputEl.value.trim();

  if (username) {
    getUserRepos(username);
    repoContainerEl.textContent = "";
    nameInputEl.value = "";
  } else {
    alert("Please enter a GitHub username");
  }
};

let buttonClickHandler = function(event) {
  let language = event.target.getAttribute("data-language");
  if (language) {
    getFeaturedRepos(language);

    // clear old content 
    repoContainerEl.textContent = "";
  };
};

let getUserRepos = function(user) {
  // format the github api url 
  let apiUrl = "https://api.github.com/users/" + user + "/repos";

  // make a request to the url 
  fetch(apiUrl)
    .then(function(response) {
      // request was succesful 
      if (response.ok) {
        response.json()
          .then(function(data) {
          displayRepos(data, user);
          });
      } else {
        alert("Error: " + reponse.statusText);
      }
    })
    .catch(function(error) {
      alert("Unable to connect to GitHub");
    });
};

let getFeaturedRepos = function(language) {
  let apiUrl = "https://api.github.com/search/repositories?q=" + language + "+is:featured&sort=help-wanted-issues";

  fetch(apiUrl)
    .then(function(response) {
      if (response.ok) {
        response.json()
          .then(function(data) {
            displayRepos(data.items, language);
          });
      } else {
        alert("Error: " + response.statusText);
      };
    });
};

let displayRepos = function(repos, searchTerm) {
  if (repos.length === 0) {
    repoContainerEl.textContent = "No repositories found.";
    return;
  }
  repoSearchTerm.textContent = searchTerm;

  // loop over repos 
  for (let i = 0; i < repos.length; i++) {
    // format repo name 
    let repoName = repos[i].owner.login + "/" + repos[i].name;

    // create container for repos 
    let repoEl = document.createElement("a");
    repoEl.classList = "list-item flex-row justify-space-between align-center";
    repoEl.setAttribute("href", "./single-repo.html?repo=" + repoName);

    // create a span element to hold repo name 
    let titleEl = document.createElement("span");
    titleEl.textContent = repoName;

    repoEl.appendChild(titleEl);

    // create a status element 
    let statusEl = document.createElement("span");
    statusEl.classList = "flex-row align-center";

    // check if current repo has issues or not 
    if (repos[i].open_issues_count > 0) {
      statusEl.innerHTML = 
        "<i class='fas fa-times status-icon icon-danger'></i>" + repos[i].open_issues_count + " issue(s)";
    } else {
      statusEl.innerHTML = "<i class='fas fa-check-square status-icon icon-success'></i>";
    }

    // apend to container 
    repoEl.appendChild(statusEl);

    // append container to dom 
    repoContainerEl.appendChild(repoEl);
  };
};

userFormEl.addEventListener("submit", formSubmitHandler);
languageButtonsEl.addEventListener("click", buttonClickHandler);