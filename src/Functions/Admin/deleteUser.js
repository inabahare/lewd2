import db from "../../helpers/database";

const deleteUser = async id => {
    const client = await db.connect();
                   await client.query(`DELETE FROM "Users" WHERE id = $1;`, [id]);
                   await client.release();
} 

export default deleteUser;