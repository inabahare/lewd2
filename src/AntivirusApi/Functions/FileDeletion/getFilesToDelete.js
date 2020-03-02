import { query } from "../../../app/Functions/database";

export default async () => {
  const getFiles = await query(`SELECT id, filename, filesha 
                                       FROM "Uploads" 
                                       WHERE deleted = FALSE 
                                       AND uploaddate < NOW() - '${process.env.TIME_FILE_CAN_STAY_ALIVE}'::INTERVAL;`);
  
  return getFiles;
};