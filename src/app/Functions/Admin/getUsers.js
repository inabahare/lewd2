import { db } from "../../helpers/database";

const sql = `
    SELECT "Users".id, username, uploadsize, isadmin, COUNT("Uploads".filesha) "amountOfUploads"
    FROM "Users"
    LEFT JOIN "Uploads" ON "Users".id = "Uploads".userid
    GROUP BY "Users".id, username, uploadsize, isadmin
    ORDER BY "Users".id;
`;

/**
 * Gets all users except for the default one
 */
const getAllUsers = async () => {
    const client = await db.connect();
    const allUsers = await client.query(sql);
    await client.release();

    return allUsers.rows;
};

export default getAllUsers;