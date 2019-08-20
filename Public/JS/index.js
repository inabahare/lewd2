import Dropzone from "./dropzone";
import { messageGenerator } from "./includes/bulma/messageGenerator";

const tokenContainer   = document.getElementById("token");
const uploadList       = document.getElementById("uploads");
const token            = tokenContainer.defaultValue;

const maxSizeContainer = document.getElementById("uploadSize");
const maxUploadSize    = parseInt(maxSizeContainer.innerHTML) / 1000000; // Needs to be in Megabytes

// First definition of the short url
const shortUrlButton = document.querySelector(".short-url");
const shortUrl = shortUrlButton.checked;

const dropZone = new Dropzone("#uploader", {
    url: "/upload",
    // maxFiles: 12,
    paramName: "file",
    maxFilesize: maxUploadSize,
    headers: {
        token: token,
        shortUrl: shortUrl
    }, 
    params: {
        test: "test"
    },
    timeout: 3000000 // Fuck this timeOut limit shit
});

console.log("Dropzone got initialized with the following headers:");
console.log(dropZone.options.headers);
console.log("-------------------------------------");

dropZone.on("success", (file, response) => {
    console.log("The file got uploaded with the following headers:");
    console.log(dropZone.options.headers);
    console.log("-------------------------------------");

    const fileName      = file.name;
    const uploadedURL   = response.data.link;
    const deleteionURL  = response.data.deleteionURL;

    const successLinks = `<a href="${uploadedURL}" target="_blank">link</a> <a href="${deleteionURL}">Delete</a>`;
    const successMessage = messageGenerator("success", `${fileName} uploaded`, successLinks);

    uploadList.appendChild(successMessage);
});

dropZone.on("error", file => {
    const errorAsArray = file.previewElement.innerText.split("\n");
    const fileName     = file.name;
    const error        = errorAsArray[errorAsArray.length - 1];

    const errorMessage = messageGenerator("danger", `${fileName} failed to upload`, error);
    uploadList.appendChild(errorMessage);
});

const message = document.querySelector(".dz-message.hidden");
message.classList.remove("hidden");

shortUrlButton.onclick = e => {
    dropZone.options.headers.shortUrl = e.target.checked;
};