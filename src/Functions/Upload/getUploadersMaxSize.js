
import db from "../../helpers/database";
/**
 * Take a token and get the 
 * @param {string} token 
 */
const getUploadersMaxUploadSize = async token => {
    const client    = await db.connect();
    const getRoleId = await client.query(`SELECT roleid 
                                          FROM "Users" 
                                          WHERE token = $1`, 
                                          [token]);
    
    // The program still needs to be able to work if no user is logged in
    const roleId = (getRoleId.rows[0] === undefined) ? parseInt(process.env.DEFAULT_ROLE_ID) 
                                                     : getRoleId.rows[0].roleid;


    const getUploadSize = await client.query(`SELECT uploadsize 
                                              FROM "Roles" 
                                              WHERE id = $1`, 
                                              [roleId]);
    await client.release();

    return getUploadSize.rows[0].uploadsize;
};

export default getUploadersMaxUploadSize;