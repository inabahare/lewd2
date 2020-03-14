
import { query } from "../../Functions/database";

/**
 * Take a token and get the 
 * @param {string} token 
 */
const getUploader = async token => { 
    const getUploader = await query(`SELECT id, uploadsize
                                     FROM "Users"
                                     WHERE token = $1;`, [ token ]);
    

    return getUploader;
};

export { getUploader };