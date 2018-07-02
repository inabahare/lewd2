import { schedule }         from 'node-cron';
import { fileDeletionCron } from "./config"
import getFilesToDelete     from "./functions/FileDeletion/getFilesToDelete";
import deleteFiles          from "./functions/FileDeletion/deleteFiles";
import updateDatabase       from "./functions/FileDeletion/updateDeletedFiles";

schedule("*/5 * * * * *", async () => {
    const files = await getFilesToDelete();

    if (files.length == 0){
        return;
    }

    deleteFiles(files);
    updateDatabase(files);

    console.log(files);
});