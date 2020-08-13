import { query } from "/Functions/database";

const markAsScannedTwice = async files => {
  files.forEach(async fileName => {
    await query(`UPDATE "Uploads"
                     SET "scannedTwice" = TRUE
                     WHERE filename = $1;`, [ fileName.filename ]);
  });
};

export default markAsScannedTwice;