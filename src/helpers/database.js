import { Pool } from "pg";
import { databaseConnection } from "../config";

const pool = new Pool(databaseConnection);

pool.on("error", (error, client) => {
    console.error("Unexpected db error", error);
    process.exit(-1);
});

export default pool;