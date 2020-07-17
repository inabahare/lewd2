import { Pool } from "pg";

const config = {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT),
};

const database = new Pool(config);

database.on("error", err => {
    console.error(`Unexpected database error: ${err}`);
});

export { database };