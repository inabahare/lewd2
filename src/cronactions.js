import { schedule }         from 'node-cron';
import getFilesToDelete     from "./functions/FileDeletion/getFilesToDelete";
import deleteFiles          from "./functions/FileDeletion/deleteFiles";
import updateDatabase       from "./functions/FileDeletion/updateDeletedFiles";
import dotenv from "dotenv";

dotenv.config();

schedule(process.env.FILE_DELETION_CRON, async () => {
    const files = await getFilesToDelete();

    if (files.length == 0){
        return;
    }

    deleteFiles(files);
    updateDatabase(files);
});