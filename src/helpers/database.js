import { Pool } from "pg";
require('dotenv').config();


const pool = new Pool({
    user:     process.env.DB_USER,     
    host:     process.env.DB_HOST,     
    database: process.env.DB_DATABASE, 
    password: process.env.DB_PASSWORD, 
    port:     process.env.DB_PORT,   
});

pool.on("error", (error, client) => {
    console.error("Unexpected db error", error);
    process.exit(-1);
});

(async function() {
    try {
        const connection = await pool.connect();
        await connection.release();
    } catch (e) {
        console.error(e.message);
    }
})();

export default pool;