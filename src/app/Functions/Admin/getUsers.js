import { DbClient } from "../../helpers/database";

/**
 * Gets all users except for the default one
 */
const getAllUsers = async () => {
    const client = DbClient();
    await client.connect();
    const allUsers  = await client.query(`SELECT id, username, uploadsize, isadmin FROM "Users" ORDER BY id ASC;`);
                      await client.end();

    return allUsers.rows;
};

export default getAllUsers;