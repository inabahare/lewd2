import { Pool } from "pg";
require("dotenv").config();


const db = new Pool({
    user:     process.env.DB_USER,     
    host:     process.env.DB_HOST,     
    database: process.env.DB_DATABASE, 
    password: process.env.DB_PASSWORD, 
    port:     parseInt(process.env.DB_PORT),   
});

db.on("error", err => {
    console.error(`Unexpected database error: ${err}`);
});

export { db };