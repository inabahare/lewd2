import "babel-polyfill";
import axios from "axios";

const buttons = document.querySelectorAll(".delete-one");

for (const button of buttons) {
    button.onclick = e => {
        e.preventDefault();
        onButtonClick(e);
    };
}


async function onButtonClick(e) {
    const deletionKey = e.target.dataset.key;
    const result = await axios.get(`/delete/${deletionKey}`);

    if (result.status === 200) {
        removeFromList(deletionKey);
        updateUploadCount();
        return showSuccess(result.data);    
    }
    else {
        showError(result.data);
    }
}

function showSuccess(message) {
    alert(message);
}

function removeFromList(key) {
    const toRemove = document.getElementById(`${key}`);
    toRemove.remove();
}

function updateUploadCount() {
    const uploadCount = document.getElementById("upload-count");
    uploadCount.innerText = parseInt(uploadCount.innerText) - 1;
}

function showError(err) {
    alert(err);
}