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

{/* <div class="dz-preview dz-file-preview">
<div class="dz-details">
    <div class="dz-size" data-dz-size></div> 
    <div class="dz-filename"><span data-dz-name></span></div>
    </div>
    <div class="dz-progress"><span class="dz-upload" data-dz-uploadprogress>100%</span></div>
    <div class="dz-success-mark"><span>✔</span></div>
    <div class="dz-error-mark"><span>✘</span></div>
    <div class="dz-error-message"><span data-dz-errormessage></span></div>
</div> */}

const preview =`
    <article class="message is-success">
        <div class="message-header">
            <p><span data-dz-name></span> <span data-dz-uploadprogress></span></p>
            <button class="delete" aria-label="delete"></button>
        </div>
        <div class="message-body">
            <a href="htto://192.168.87.176:3000/uploads/33de763b0c6e_ASR%20Calls%20Pronunciation%20Trainer.pdf" target="_blank">link</a> <a href="http://192.168.87.176:3000/delete/cb4ebc21-c657-11e9-8b6d-953c0971e241">Delete</a>
        </div>
    </article>

`;

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
    const resultMessageBox = file.previewElement.children[1];
    console.log(resultMessageBox, response);
    const uploadedURL   = response.data.link;
    const deleteionURL  = response.data.deleteionURL;

    resultMessageBox.innerHTML = '<a href="' + uploadedURL + '" target="_blank">link</a> <a href="' + deleteionURL + '">Delete</a>';
});

dropZone.on("error", file => {
    // const errorAsArray = file.previewElement.innerText.split("\n");
    // const fileName     = file.name;
    // const error        = errorAsArray[errorAsArray.length - 1];
});

const message = document.querySelector(".dz-message.hidden");
message.classList.remove("hidden");

shortUrlButton.onclick = e => {
    dropZone.options.headers.shortUrl = e.target.checked;
};


dropZone.on("uploadprogress",  (previewElement, progress) => {
    const progressInt = parseInt(progress);

    const progressHeader = previewElement.previewElement.children[0];
    const progressTextElement = progressHeader.children[0].children[1];

    progressTextElement.innerText = `${progressInt}%`;
    // progressHeader.style.background = "rgb(32,156,238)";
    progressHeader.style.background = `linear-gradient(90deg, rgba(98,196,98,1) 0%, 
                                                              rgba(98,196,98,1) ${progress - 0.1}%, 
                                                              rgba(1,4,6,1) ${progress}%, 
                                                              rgba(32,156,238,1) ${progress + 0.1}%, 
                                                              rgba(32,156,238,1) 100%)`;
});
