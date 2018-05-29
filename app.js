"use strict";

const express       = require("express");
const handlebars    = require("express-handlebars");
const path          = require("path");
const bodyParser    = require("body-parser");
const session       = require("express-session");
// const passport      = require("./helpers/passport");

const app = express();

// Load views
app.engine ("hbs", handlebars ({
    defaultLayout: "main", 
    layoutsDir: "views",
    extname: "hbs"
}));
app.set ("view engine", "handlebars");

// Static files
app.use(express.static(path.join(__dirname, "public")));


app.get("/",(req, res) => {
    res.render("index.hbs");
});

app.listen(8080, () => console.log("It's up and running :3"));