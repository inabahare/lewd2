import sha1 from "sha1";
import moment from "moment";
import crypto from "crypto";

//#######################################
// CONSTANTS
// 
//#######################################
const constants = Object.freeze({
    DEFAULT_TOKEN: "default",
    DEST: "Public/"
});

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
const filenamePattern = file => crypto.randomBytes(6).toString("hex") + file.originalname;

// How to store files
// https://github.com/expressjs/multer#storage
const storage = {
    destination: (req, file, next) => next(null, constants.DEST),
    filename:    (req, file, next) => next(null, filenamePattern(file))
};
//#######################################


export { constants as constants};
export { db as databaseConnection };
export { storage as storageConfig };