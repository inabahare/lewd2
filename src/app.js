"use strict";

import express from "express";
import handlebars from "express-handlebars";
import path from 'path';

import db from "./helpers/database";
import passport from "./helpers/passport";

// Routers
import index from "./Routes/index";
import login from "./Routes/login";

const app = express();
 
console.log(__dirname + "/views")

// Load views
app.engine ("hbs", handlebars ({ 
    defaultLayout: __dirname + "/views/main",
    extname: "hbs"
}));
app.set ("view engine", "hbs");
app.set('views', path.join(__dirname, "views"));
// Static files
// app.use(static(join(__dirname, "public")));

app.use(passport.initialize());
app.use(passport.session());


app.use(async (req, res, next) => {


    const client = await db.connect();
    const res = await client.query("SELECT NOW() AS noaoow");
    console.log(res.rows[0]);
    client.release();
    next();
});

// Set the routes
app.use("/", index);
app.use("/login", login);

app.listen(8080, () => console.log("It's up and running :3"));