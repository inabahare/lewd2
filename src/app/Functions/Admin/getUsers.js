import { query } from "../../Functions/database";

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
    const allUsers = await query(sql);
    
    return allUsers;
};

export default getAllUsers;