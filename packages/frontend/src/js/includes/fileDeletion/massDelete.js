import { deleteFile } from "./delete";


// Handle the delete button
const deleteButton = document.querySelector("#delete-selected");

deleteButton.onclick = () => {
    if (!confirm("You sure you want to delete the selected files?")) {
        return;
    }
    // Get all checked checkboxes
    const toDeleteChecked = document.querySelectorAll(".mass-delete:checked");

    // If nothing selected do nothing
    if (toDeleteChecked.length === 0) {
        return;
    }

    console.log(toDeleteChecked);

    toDeleteChecked.forEach(async checkBox => {
        const deletionKey = checkBox.dataset.value;
        await deleteFile(deletionKey);
    });
};