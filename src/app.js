"use strict";

import express from "express";
import handlebars from "express-handlebars";
import path from 'path';

// Routers
import index from "./routes/index";
import login from "./routes/login";

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
app.use(express.static(path.join(__dirname, "public")));

// Set the routes
app.use("/", index);
app.use("/login", login);

app.listen(8080, () => console.log("It's up and running :3"));