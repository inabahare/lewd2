import { DbClient } from "../../helpers/database";

export default async () => {
  const client = DbClient();
  await client.connect();
  const getFiles = await client.query(`SELECT id, filename, filesha 
                                       FROM "Uploads" 
                                       WHERE deleted = FALSE 
                                       AND uploaddate < NOW() - '${process.env.TIME_FILE_CAN_STAY_ALIVE}'::INTERVAL;`);
  await client.end();

  return getFiles.rows;
};