import getFilesToDelete from "/Functions/FileDeletion/getFilesToDelete";
import { deleteFileByName } from "/Functions/FileDeletion/deleteFiles";

async function fileDeletion() {
    const files = await getFilesToDelete();
    
    // Prevent additional files from being scanned
    if (!files) {
        return;
    }

    console.log(`Deleting ${files.length} files`);

    // Removes duplicates
    const unique = [...new Set(files.map(file => file.filename))];

    unique.forEach(async fileName => {
        try {
            await deleteFileByName(fileName, process.env.UPLOAD_DESTINATION);
        } catch (e) {
            console.error(`Could not delete ${fileName} because:`);
            console.error(e.message);
            console.error("----------------------------------------");
        }
    });
}

export { fileDeletion };