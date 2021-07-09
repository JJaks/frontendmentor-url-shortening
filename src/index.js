/* Variables */
const mobileNavToggle = document.getElementById("icon-mobile-nav-toggle");
const mobileNav = document.getElementById("nav-links");
const formShorten = document.getElementById("shorten-form");
const urlInputField = document.getElementById("shorten");
const errorMsg = document.getElementById("error-msg");
const shortenedLinks = document.querySelector(".shortened-links");

/* Display previously shortened links from localstorage */
shortenedLinks.innerHTML = localStorage.getItem("shortenedLinks");

function displayMobileNav() {
    // Change nav icon
    mobileNavToggle.className = "fas fa-times nav-toggle";
    // Display mobile nav
    mobileNav.classList.add("main-nav__ul--active");
}

function hideMobileNav() {
    // Reset nav icon
    mobileNavToggle.className = "fas fa-bars nav-toggle";
    // Hide mobile nav
    mobileNav.classList.remove("main-nav__ul--active");
}

async function shortenURL() {
    let shortLink;

    try {
        document.getElementById("loader").style.display = "block";
        const resp = await fetch(
            `https://api.shrtco.de/v2/shorten?url=${urlInputField.value}`,
            {
                method: "post",
                body: "JSON.stringify(opts)",
            }
        );
        const data = await resp.json();
        document.getElementById("loader").style.display = "none";
        shortLink = data.result.short_link;
    } catch (error) {
        shortLink = "failed";
    }

    if (shortLink === "failed" && urlInputField.value.length === 0) {
        formShorten.classList.add("shorten-form--empty");
        errorMsg.innerText = "Please add a link";
    } else if (shortLink === "failed") {
        formShorten.classList.add("shorten-form--empty");
        errorMsg.innerText = "Please add a valid url";
    } else {
        formShorten.classList.remove("shorten-form--empty");
        createResultEl(shortLink);
        // clear input field
        urlInputField.value = "";
    }
}

function createResultEl(url) {
    // Display shortened link section
    let result = document.createElement("section");
    result.classList.add("shortened-link");

    // Add results to shortened link section
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
    console.log(mobileNav);
    if (mobileNavToggle.classList.contains("fa-bars")) {
        displayMobileNav();
    } else {
        hideMobileNav();
    }
});

// Nav functionality
mobileNav.addEventListener("click", (e) => {
    if (e.target.tagName === "A") {
        hideMobileNav();
    }
});

// ShortenURL
formShorten.addEventListener("submit", (e) => {
    e.preventDefault();
    shortenURL();
});

