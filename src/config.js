import sha1 from "sha1";

//#######################################
// NODE POSTGRES CONFIG
// https://node-postgres.com
//#######################################
const db = {
    user:     'katt',
    host:     'localhost',
    database: 'lewd',
    password: 'root',
    port:      5432,
};
//#######################################

//#######################################
// MULTER CONFIG 
// https://github.com/expressjs/multer
const files = {
    dest: "Public/",
    size: 1280
}

// How to store files
// https://github.com/expressjs/multer#storage
const storage = {
    destination: (req, file, next) => {next(null, files.dest);},
    filename:    (req, file, next) => {next(null, sha1(file.originalname) + file.originalname);}
};
//#######################################



export { db as databaseConnection };
export { storage as storageConfig }