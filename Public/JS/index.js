import Dropzone from "./dropzone";

const tokenContainer   = document.getElementById("token");
const uploadList       = document.getElementById("uploads")
const token            = tokenContainer.defaultValue;

const maxSizeContainer = document.getElementById("uploadSize");
const maxUploadSize    = parseInt(maxSizeContainer.innerHTML) / 1000000; // Needs to be in Megabytes

const dropZone = new Dropzone("#uploader", {
    url: "/upload",
    // maxFiles: 12,
    paramName: "file",
    maxFilesize: maxUploadSize,
    headers: {
        token: token
    }, 
    params: {
        test: "test"
    }
});


dropZone.on("success", (file, response) => {
    const fileName      = file.name;
    const uploadedURL   = response.data.link;
    const deleteionURL  = response.data.deleteionURL;

    uploadList.innerHTML += `<article class="notification is-success">
                                <button class="delete" aria-label="delete"></button>
                                <div class="columns">
                                    <div class="column has-text-left">
                                        <p>${fileName}</p>
                                    </div> 
                                    <div class="column has-text-right">
                                        <a href="${uploadedURL}" target="_blank">link</a>
                                        <a href="${deleteionURL}">Delete</a>
                                    </div>
                                </div>
                            </article>`;
});

dropZone.on("error", file => {
    const errorAsArray = file.previewElement.innerText.split("\n");
    const fileName     = file.name;
    const error        = errorAsArray[errorAsArray.length - 1];

    uploadList.innerHTML += `<article class="notification is-danger">
                                <button class="delete" aria-label="delete"></button>
                                <div class="columns">
                                    <div class="column has-text-left is-half"><p class="error-text">${fileName}</p></div> 
                                    <div class="column has-text-right"><p>${error}</p></div>
                                </div>
                            </article>`;  
});

const message = document.querySelector(".dz-message.hidden");
message.classList.remove("hidden");