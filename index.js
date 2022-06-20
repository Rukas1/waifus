"use strict";

const loader = document.querySelector(".loader");
const page = document.querySelector(".page");
window.addEventListener("load", () => {
    loader.classList.add("stop");
    page.classList.add("active");
})

const modalwarning = document.getElementById("warningModal");
const hamburger = document.querySelector(".hamburger");
const navigationMenu = document.querySelector(".navMenu");
const navigationLinks = document.querySelectorAll(".navLink");
const header = document.querySelector("header");
const setting = document.getElementById("setting");
const pullImage = document.getElementById("pullImage");
const sourceImage = document.getElementById("imageSource");
const root = document.querySelector(":root");
const gallery = document.getElementById("gallery");
let image = ["url", "source", "id"];
let setOfSetting = ["light", "sfw", "cover"];

function noInternetConnection() {
    document.querySelector(".internetStatus").classList.add("disconnected");
}

function applySettings() {
    applyTheme();
    applyFitImage();
}

function httpGet(typeBool) {
    let url = "https://api.waifu.im/random?is_nsfw="+typeBool;
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url, false);
    xhr.send();
    document.querySelector(".internetStatus").classList.remove("disconnected");
    return JSON.parse(xhr.responseText)
}

function chargeHTML() {
    pullImage.src = image[0];
    sourceImage.href = image[1];
}

function process() {
    let typeContent
    if (setOfSetting[1] === "sfw") {
        typeContent = false;
    } else {
        typeContent = true;
    }
    let data = httpGet(typeContent);
    image[0] = data.images[0].url;
    image[1] = data.images[0].source;
    image[2] = data.images[0].image_id;
    chargeHTML();
}

function readStorage() {
    if (!localStorage.imageData) {
        localStorage.imageData = "[]";
    }
    let storage = JSON.parse(JSON.stringify(localStorage));
    let imageData = JSON.parse(storage.imageData);
    return imageData;
}

function putStorage(image) {
    if (!localStorage.imageData) {
        localStorage.imageData = "[]";
    }
    let storage = JSON.parse(JSON.stringify(localStorage));
    let imageData = JSON.parse(storage.imageData);
    if (image === undefined || JSON.stringify(readStorage()).includes(JSON.stringify(image))) {
        return imageData;
    }
    imageData.push(image);
    localStorage.imageData = JSON.stringify(imageData);
    return imageData;
}

function applyFitImage() {
    if (setOfSetting[2] === "cover") {
        pullImage.classList.add("cover");
        pullImage.classList.remove("contain");
    } else {
        pullImage.classList.add("contain");
        pullImage.classList.remove("cover");
    }
}

function applyTheme() {
    if (setOfSetting[0] === "dark" ) {
        root.style.setProperty("--darkBack", "#202020");
        root.style.setProperty("--lightBack", "#262626");
        root.style.setProperty("--darkFore", "#fff");
        root.style.setProperty("--shadow", "#ffffff99");
        root.style.setProperty("--iconInvertColor", "1");
    } else {
        root.style.setProperty("--iconInvertColor", "0");
        root.style.setProperty("--darkBack", "#f1f1f1");
        root.style.setProperty("--lightBack", "#fff");
        root.style.setProperty("--darkFore", "#000");
        root.style.setProperty("--shadow", "#4d4d4db3");
    }
}

function showSavedPicture() {
    if (readStorage().length === 0) {
        document.querySelector(".noSaved").classList.add("active");
        return;
    }
    document.querySelector(".noSaved").classList.remove("active");
    for (let i = 0 ; i < readStorage().length ; i++) {
        let item = `
            <div class="item">
                <h3>${readStorage()[i][2]}</h3>
                <a href="${readStorage()[i][1]}"><img src="${readStorage()[i][0]}"></a>
            </div>
        `;
        gallery.insertAdjacentHTML("afterbegin", item);
    }
}

function clearGallery() {
    document.querySelectorAll(".item").forEach((el) => {
        el.remove();
    })
}

modalWarningClose.addEventListener("click", () => {
    modalwarning.classList.add("close");
})

hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    navigationMenu.classList.toggle("active");
    header.classList.toggle("active");
});

navigationLinks.forEach( (n) => 
    n.addEventListener("click", () => {
        hamburger.classList.remove("active");
        navigationMenu.classList.remove("active");
        header.classList.remove("active");
}));

openSettingsBtn.addEventListener("click", () => {
    setting.style.height = "100%";
})
closeSetting.addEventListener("click", () => {
    setting.style.height = "0%";  
})
openSavedBtn.addEventListener("click", () => {
    showSavedPicture();
    saved.style.height = "100%";
})
closeSaved.addEventListener("click", () => {
    saved.style.height = "0%";
    clearGallery();
})

// ------ 

pullBtn.addEventListener("click", () => {
    process();
})

window.addEventListener("keypress", (e) => {
    if (e.key === " ") {
        pullBtn.animate({
            backgroundColor: ["var(--pullBtnColor)", "var(--lightBack)"],
            color: ["var(--lightFore)", "var(--darkFore)"],
            border: ["none", "2px var(--darkFore) solid"]
          }, 200);
        process();
    }
})

copy.addEventListener("click", () => {
    navigator.clipboard.writeText(image[0]);
    copy.classList.add("active");
    setTimeout(() => {
        copy.classList.remove("active");
    }, 1000)
})

save.addEventListener("click", () => {
    save.classList.add("active");
    setTimeout(() => {
        save.classList.remove("active");
    }, 1000)
    putStorage(image);
})

window.addEventListener("error", (e) => {
    if (e.error.code && e.error.code === 19) {
        noInternetConnection();
    }
})

// -----

settingForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (setOfSetting.length > 0) {
        setOfSetting.splice(0, setOfSetting.length);
    }
    for (let i = 0 ; i < e.target.length; i++) {
        if (e.target[i].type === "radio" && e.target[i].checked === true) {
            setOfSetting.push(e.target[i].value);
        }
    }
    applySettings();
})

settingForm.addEventListener("reset", (e) => {
    setOfSetting = ["light", "sfw", "cover"];
    applySettings();
})

clearData.addEventListener("click", () => {
    if (confirm("Are you sure ?")) {
        localStorage.clear();
        alert("Data cleared");
    }
})

applySettings();
process();
