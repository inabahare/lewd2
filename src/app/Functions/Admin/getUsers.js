import db from "../../helpers/database";

/**
 * Gets all users except for the default one
 */
const getAllUsers = async () => {
    const client    = await db.connect();
    const allUsers  = await db.query(`SELECT id, username, uploadsize, isadmin FROM "Users" ORDER BY id ASC;`);
                      await client.release();

    return allUsers.rows;
};

export default getAllUsers;