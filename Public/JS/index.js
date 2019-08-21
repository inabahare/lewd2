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

const preview =`
    <div class="dz-preview dz-file-preview">
        <div class="dz-details">
            <div class="dz-filename"><span data-dz-name></span></div>
            <div class="dz-size" data-dz-size></div>
            <img data-dz-thumbnail />
        </div>
        <div class="dz-progress"><span class="dz-upload" data-dz-uploadprogress>100%</span></div>
        <div class="dz-success-mark"><span>✔</span></div>
        <div class="dz-error-mark"><span>✘</span></div>
        <div class="dz-error-message"><span data-dz-errormessage></span></div>
    </div>`;

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
    timeout: parseInt(process.env.FRONTPAGE_UPLOAD_TIMOUT), // Fuck this timeOut limit shit,
    previewTemplate: preview
});

dropZone.on("success", (file, response) => {
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


dropZone.on("uploadprogress",  (previewElement, progress) => {
    const progressInt = parseInt(progress);
    const dzProgress = previewElement.previewElement.children[1].firstChild;
    dzProgress.textContent = `${progressInt}%`;
});
