import cron from "node-cron";
import db from "./helpers/database.js";

cron.schedule("* * * * *", () => {
    console.log("Hello every minute");
});