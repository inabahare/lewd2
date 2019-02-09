import { deleteFile } from "./delete";

// Make it so checkboxes can be checked when clicking the delete element thing
const deleteContainers = document.querySelectorAll(".delete-container");

for (const container of deleteContainers) {
    container.onclick = e => {
        const deletionKey = e.target.dataset.value;
        const checkBox = document.querySelector(`input[data-value="${deletionKey}"]`);
        
        if (checkBox)
            checkBox.checked = !checkBox.checked;
    };
}

// Handle the delete button
const deleteButton = document.querySelector("#delete-selected");

deleteButton.onclick = () => {
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