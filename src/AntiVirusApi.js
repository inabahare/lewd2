import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { Headers } from "./app/config/app/Headers";

const app = express();

Headers.SetBodyParser(app);

app.listen(parseInt(process.env.MESSAGE_SERVER_PORT), () => {
    console.log("");
});