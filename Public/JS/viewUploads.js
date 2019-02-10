import "babel-polyfill";
import { deleteFile } from "./includes/fileDeletion/delete";
import "./includes/fileDeletion/massDelete";


const buttons = document.querySelectorAll(".delete-one");

for (const button of buttons) {
    button.onclick = e => {
        e.preventDefault();
        onButtonClick(e);
    };
}


async function onButtonClick(e) {
    if (!confirm("You sure you want to delete this file?")) {
        return;
    }

    const deletionKey = e.target.dataset.key;
    await deleteFile(deletionKey);
}
