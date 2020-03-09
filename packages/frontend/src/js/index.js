import Dropzone from "./dropzone";

const tokenContainer   = document.getElementById("token");
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
            -Bottom text-
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

/**
 * Uses the dropzone "file" object to get the messagebox in the response
 * @param {*} file 
 */
const getMessageBox =
    file => file.previewElement.children[1];

dropZone.on("success", (file, response) => {
    const uploadedURL   = response.data.link;
    const deleteionURL  = response.data.deleteionURL;
    
    const resultMessageBox = getMessageBox(file);
    resultMessageBox.innerHTML = `<a href="${uploadedURL}" target="_blank">link</a> 
                                  <a href="${deleteionURL}">Delete</a>`;
});

dropZone.on("error", (file, error) => {
    file.previewElement.classList.remove("is-success");
    file.previewElement.classList.add("is-danger");

    const messageBox = getMessageBox(file);
    messageBox.innerText = error;
});

const message = document.querySelector(".dz-message.hidden");
message.classList.remove("hidden");

shortUrlButton.onclick = e => {
    dropZone.options.headers.shortUrl = e.target.checked;
};


dropZone.on("uploadprogress",  (file, progress) => {
    const resultMessageBox = getMessageBox(file);
    const progressHeader = file.previewElement.children[0];
    // const progressTextElement = progressHeader.children[0].children[1];

    resultMessageBox.innerText = `${progress.toFixed(2)}%`;
    progressHeader.style.background = `linear-gradient(90deg, rgba(98,196,98,1) 0%, 
                                                              rgba(98,196,98,1) ${progress - 0.1}%, 
                                                              rgba(1,4,6,1) ${progress}%, 
                                                              rgba(32,156,238,1) ${progress + 0.1}%, 
                                                              rgba(32,156,238,1) 100%)`;
});
