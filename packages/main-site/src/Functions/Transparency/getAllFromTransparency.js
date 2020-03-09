import { query } from "../database";

const getAllFromTransparency = async () => {
    const getTransparency = await query(`SELECT "Date", "FileName", "FileHash", "Type", "Origin"
                                         FROM "Transparency"`);
    
    return getTransparency;
};

export default getAllFromTransparency;