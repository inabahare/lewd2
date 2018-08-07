import { schedule }         from 'node-cron';
import getFilesToDelete     from "./Functions/FileDeletion/getFilesToDelete";
import deleteFiles          from "./Functions/FileDeletion/deleteFiles";
import updateDatabase       from "./Functions/FileDeletion/updateDeletedFiles";
import dotenv from "dotenv";

dotenv.config();

// process.env.FILE_DELETION_CRON

schedule("*/10 * * * * *", async () => {
    const files = await getFilesToDelete();
    
    if (files.length == 0)
        return;

    console.log(`Removing ${files.length} files!`);

    const unique = [...new Set(files.map(file => file.filename))];
    console.log(unique);
    deleteFiles(unique);
});