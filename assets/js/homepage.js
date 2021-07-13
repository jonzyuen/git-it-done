let userFormEl = document.querySelector("#user-form");
let nameInputEl = document.querySelector("#username");
let repoContainerEl = document.querySelector("#repos-container");
let repoSearchTerm = document.querySelector("#repo-search-term");

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
        alert("Error: GitHub User Not Found");
      }
    })
    .catch(function(error) {
      alert("Unable to connect to GitHub");
    })
};

let formSubmitHandler = function(event) {
  event.preventDefault();

  // get value from input element 
  let username = nameInputEl.value.trim();

  if (username) {
    getUserRepos(username);
    nameInputEl.value = "";
  } else {
    alert("Please enter a GitHub username");
  }
  console.log(event);
};

let displayRepos = function(repos, searchTerm) {
  // clear old content 
  repoContainerEl.textContent = "";
  repoSearchTerm.textContent = searchTerm;

  // loop over repos 
  for (let i = 0; i < repos.length; i++) {
    // format repo name 
    let repoName = repos[i].owner.login + "/" + repos[i].name;

    // create container for repos 
    let repoEl = document.createElement("div");
    repoEl.classList = "list-item flex-row justify-space-between align-center";

    // clreate a span element to hold repo name 
    let titleEl = document.createElement("span");
    titleEl.textContent = repoName;

    // create a status element 
    let statusel = document.createelement("span");
    statusel.classList = "flex-row align-center";

    // check if current repo has issues or not 
    if (repos[i].open_issues_count > 0) {
      statusEl.innerHTML = 
        "<i class='fas fa-times status-icon icon-danger'></i>" + repos[i].open_issues_count + " issue(s)";
    } else {
      statusEl.innerHTML = "<i class='fas fa-check-square status-icon icon-success'></i>";
    };

    // apend to container 
    repoEl.appendChild(titleEl);

    // append container to dom 
    repoContainerEl.appendChild(repoEl);
  };

  console.log(repos);
  console.log(searchTerm);
};

userFormEl.addEventListener("submit", formSubmitHandler);