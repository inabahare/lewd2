import axios from "axios";
import { messageGenerator } from "../messageGenerator";

async function deleteFile(deletionKey) {
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
    const messageBox = messageGenerator(`success`, `File Deleted`, message);
    const messageContainer = document.querySelector(".message-container");
    messageContainer.appendChild(messageBox);
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

export { 
    deleteFile
};