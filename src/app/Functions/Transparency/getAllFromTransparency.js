import { DbClient } from "../../helpers/database";

/**
 * 
 */
const getAllFromTransparency = async () => {
    const client = DbClient();
    await client.connect();
    const getTransparency = await client.query(`SELECT "Date", "FileName", "FileHash", "Type", "Origin"
                                                FROM "Transparency"`);
                            await client.end();
    
    return getTransparency.rows.length > 0 ? getTransparency.rows 
                                           : null; 
};

export default getAllFromTransparency;