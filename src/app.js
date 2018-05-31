"use strict";

import express from "express";
import handlebars from "express-handlebars";
import path from 'path';

// Routers
import index from "./Routes/index";

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

// Set the routes
app.use("/", index);


app.listen(8080, () => console.log("It's up and running :3"));