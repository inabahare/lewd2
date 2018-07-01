import db from "../../helpers/database";

export default async () => {
  const client = await db.connect();
  const getFiles = await client.query(`SELECT id, filename, filesha ` + 
                                      `FROM \"Uploads\" ` + 
                                      `WHERE deleted = FALSE ` + 
                                      `AND uploaddate < NOW() - '90 days'::INTERVAL`);
  await client.release();

  return getFiles.rows;
}