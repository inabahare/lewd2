import getFilesToDelete         from "../../Functions/FileDeletion/getFilesToDelete";
import deleteFiles              from "../../Functions/FileDeletion/deleteFiles";


async function fileDeletion() {
    const files = await getFilesToDelete();
    
    // Prevent additional files from being scanned
    if (files.length === 0)
        return;

    console.log(`Deleting ${files.length + 1} files`);

    // Removes duplicates
    const unique = [...new Set(files.map(file => file.filename))];

    deleteFiles(unique);
}

export { fileDeletion };