import getFilesToDelete from "/Functions/FileDeletion/getFilesToDelete";
import { removeFile } from "/Functions/FileDeletion/removeFile";

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
      await removeFile(process.env.UPLOAD_DESTINATION, fileName);
    } catch (e) {
      console.error(`Could not delete ${fileName} because:`);
      console.error(e.message);
      console.error("----------------------------------------");
    }
  });
}

export { fileDeletion };