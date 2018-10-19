import db from "../../helpers/database";

/**
 * 
 */
const getAllFromTransparency = async () => {
    const client          = await db.connect();
    const getTransparency = await client.query(`SELECT "Date", "FileName", "FileHash", "Type", "Origin"
                                                FROM "Transparency"`);
                            await client.release();
    
    return getTransparency.rows.length > 0 ? getTransparency.rows 
                                           : null; 
}

export default getAllFromTransparency;