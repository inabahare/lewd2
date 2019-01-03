import { Client } from "pg";
require("dotenv").config();


function DbClient() {
    return new Client({
        user:     process.env.DB_USER,     
        host:     process.env.DB_HOST,     
        database: process.env.DB_DATABASE, 
        password: process.env.DB_PASSWORD, 
        port:     parseInt(process.env.DB_PORT),   
    });
}

export { DbClient };