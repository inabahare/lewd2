import getFilesToDelete         from "../../Functions/FileDeletion/getFilesToDelete";
import deleteFiles              from "../../Functions/FileDeletion/deleteFiles";


async function fileDeletion() {
    const files = await getFilesToDelete();
    
    // Prevent additional files from being scanned
    if (files.length === 0)
        return;

    // Removes duplicates
    const unique = [...new Set(files.map(file => file.filename))];

    deleteFiles(unique);
}

export { fileDeletion };