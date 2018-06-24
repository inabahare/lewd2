import sha1 from "sha1";
import moment from "moment";
import crypto from "crypto";

//#######################################
// CONSTANTS
// 
//#######################################
const SITE_NAME          = "localhost";
const DEST               = "build/Public/uploads/";
const FILE_DIR           = SITE_NAME + "/uploads/";

const DEFAULT_ROLE_ID    = 1;
const DEFAULT_ROLE_NAME  = "default"
const ADMIN_ID           = 3;

const BCRYPT_SALT_ROUNDS = 10;

const constants = Object.freeze({
    DEFAULT_ROLE_ID:    DEFAULT_ROLE_ID,
    DEFAULT_ROLE_NAME:  DEFAULT_ROLE_NAME,
    ADMIN_ID:           ADMIN_ID,
    SITE_NAME:          SITE_NAME,
    DEST:               DEST,
    FILE_DIR:           FILE_DIR,
    BCRYPT_SALT_ROUNDS: BCRYPT_SALT_ROUNDS
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
// STORAGE CONFIG 
// https://github.com/expressjs/multer
//#######################################
const filenamePattern = file => crypto.randomBytes(6).toString("hex") + file.originalname;

// How to store files
// https://github.com/expressjs/multer#storage
const storage = {
    destination: (req, file, next) => next(null, constants.DEST),
    filename:    (req, file, next) => next(null, filenamePattern(file))
};
//#######################################

//#######################################
// TOKEN CONFIG
// FUNCTION TO CALCULATE USERS TOKEN
//#######################################
const loginTokenCalculator = input => crypto.createHash("sha1")
                                            .update(input + Date.now().toString())
                                            .digest("hex");
//#######################################

//#######################################
// TOKEN CONFIG
// FUNCTION TO CALCULATE TOKEN THAT ALLOWS USERS TO REGISTER
//#######################################
const registerTokenCalculator = () => loginTokenCalculator("You are chosen");
//#######################################

//#######################################
// ERROR MESSAGE NAMES 
// https://bulma.io/documentation/components/message/
//#######################################
const errorTypes = Object.freeze({
    SUCCESS: "is-success",
    ERROR:   "is-error"
});
//#######################################


export { constants               as constants};
export { db                      as databaseConnection };
export { storage                 as storageConfig };
export { loginTokenCalculator    as loginTokenCalculator };
export { errorTypes              as errorTypes };
export { registerTokenCalculator as registerTokenCalculator }