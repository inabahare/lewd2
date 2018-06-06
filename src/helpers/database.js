import { Pool } from "pg";
import { databaseConnection } from "../config";

const Pool = new Pool(databaseConnection);

export default Pool;