const tokenContainer   = document.getElementById("token");
const uploadList       = document.getElementById("uploads")
const token            = tokenContainer == null ? "default" 
                                                : tokenContainer.innerHTML;

const maxSizeContainer = document.getElementById("uploadSize");
const maxFilesize      = parseInt(maxSizeContainer.innerHTML) / 1000000;

const dropZone = new Dropzone("#uploader", {
    url: "/upload",
    maxFiles: 12,
    maxFilesize: 999999999999999,
    headers: {
        token: token
    }, 
    params: {
        test: "test"
    }
});


dropZone.on("success", file => {
    const fileName = file.name;
    const uploadedUrl = file.xhr.response;
    uploadList.innerHTML += `<article class="notification is-success">
                                <button class="delete" aria-label="delete"></button>
                                <div class="columns">
                                    <div class="column has-text-left"><p>${fileName}</p></div> 
                                    <div class="column has-text-right"><a href="//${uploadedUrl}" target="_blank">${uploadedUrl}</a></div>
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
                                    <div class="column has-text-left"><p>${fileName}</p></div> 
                                    <div class="column has-text-right"><p>${error}</p></div>
                                </div>
                            </article>`;  
});

// dropZone.