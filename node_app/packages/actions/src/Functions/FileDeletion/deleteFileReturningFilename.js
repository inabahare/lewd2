import { query } from "/Functions/database";

async function deleteFileByHashReturningFilename(fileHash) {
  if (!fileHash) {
    throw new Error("To delete file by hash and return a filename you need to set the filehash");
  }
    
  const filenames = await query(`DELETE FROM "Uploads"
                                    WHERE filesha = $1
                                    RETURNING filename`, fileHash);


  // Since the output from the query will be an array containing objects where the field will be filename. 
  // IE loads of {filename: whatever} I'll just turn them into an array of filenames instead!
  if(!filenames) {
    return null;
  }
    
  return filenames.rows.map(f => f.filename);
}

export { deleteFileByHashReturningFilename };