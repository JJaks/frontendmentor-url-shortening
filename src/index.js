// Variables 
const mobileNavToggle = document.getElementById("icon-mobile-nav-toggle");
const mobileNav = document.getElementById("nav-links");
const formShorten = document.getElementById("shorten-form");
const urlInputField = document.getElementById("shorten");
const errorMsg = document.getElementById("error-msg");
const shortenedLinks = document.querySelector(".shortened-links");

// Display previously shortened links from localstorage 
shortenedLinks.innerHTML = localStorage.getItem("shortenedLinks");

function displayMobileNav() {
    // Change nav icon & display mobile nav
    mobileNavToggle.className = "fas fa-times nav-toggle";
    mobileNav.classList.add("main-nav__ul--active");
}

function hideMobileNav() {
    // Reset nav icon & hide mobile nav
    mobileNavToggle.className = "fas fa-bars nav-toggle";
    mobileNav.classList.remove("main-nav__ul--active");
}

function shortenURL() {
    let shrtnURL = `https://api.shrtco.de/v2/shorten?url=${encodeURIComponent(urlInputField.value)}`;

    document.getElementById("loader").style.display = "block";
    formShorten.classList.remove("shorten-form--empty");

    return fetch(shrtnURL).then(res => res.json()).then(data => {
        if (!data.ok) {
            console.error(data.error);
            throw new Error("ShortCode API failed");
        }
        createResultEl(data.result.short_link);
    }).catch(err => {
        console.error(err);
        formShorten.classList.add("shorten-form--empty");
        errorMsg.innerHTML = "Please add a valid link!";
    }).finally(() => {
        document.getElementById("loader").style.display = "none";
        urlInputField.value = "";
    });
}

function createResultEl(url) {
    // Display shortened link div 
    let result = document.createElement("div");
    result.classList.add("shortened-link");

    // Add results to shortened link div
    result.innerHTML = `
    <p class="link-to-shorten">${urlInputField.value}</p>
    <hr>
    <p class="shortened-link">${url}</p>
    <a href="#" class="btn btn--primary btn--copy" role='button'>Copy</a>`;
    shortenedLinks.appendChild(result);

    // Save results to localstorage
    localStorage.setItem("shortenedLinks", shortenedLinks.innerHTML);
}

/* Listeners */

// Copy button event listener
shortenedLinks.addEventListener("click", (e) => {
    e.preventDefault();

    if (e.target.classList.contains("btn--copy")) {

        // Change copy icon and background
        e.target.classList.add("btn--copied");
        e.target.innerText = "Copied!";

        let short_url = e.target.parentElement.children[2].innerText;

        // Create temporary input element & append it to body
        let tempInputEl = document.createElement("input");
        tempInputEl.type = "text";
        tempInputEl.value = short_url;
        document.body.appendChild(tempInputEl);

        // Copy tempInputEl value to clipboard
        tempInputEl.select();
        document.execCommand("Copy");

        // Delete tempInputEl
        document.body.removeChild(tempInputEl);
    }
});

// Toggle mobile nav
mobileNavToggle.addEventListener("click", () => {
    if (mobileNavToggle.classList.contains("fa-bars")) {
        displayMobileNav();
    } else {
        hideMobileNav();
    }
});

// Nav functionality
mobileNav.addEventListener("click", (e) => {
    if (e.target.tagName.toLowerCase() === "a") {
        hideMobileNav();
    }
});

// ShortenURL
formShorten.addEventListener("submit", (e) => {
    e.preventDefault();
    shortenURL();
});

