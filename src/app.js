"use strict";
require('dotenv').config();

import express       from "express";
import handlebars     from "express-handlebars";
import path           from 'path';
import flash          from "express-flash";
import cookieSession  from "cookie-session";
import bodyParser     from "body-parser";
import cookieParser   from "cookie-parser";
import frontEndError  from "./helpers/frontendErrorFormatter";
import getUserDetails from './Functions/User/getUserDetails';
import fs             from "fs";
import passport       from "./helpers/passport";
import moment         from "moment"; 

// Routers
import index    from "./Routes";
import login    from "./Routes/login";
import upload   from "./Routes/upload";
import user     from "./Routes/user";
import register from "./Routes/register";
import deleter  from "./Routes/delete"; // God damn reserved keywords
import admin    from "./Routes/admin";

const randomNumber  = (x, y) =>  Math.floor((Math.random() * y) + x); 

const app = express();

// Load views
app.engine ("hbs", handlebars ({ 
    defaultLayout: __dirname + "/../views/main",
    extname: "hbs",
    partialsDir: __dirname + "/../views/partials/",
    helpers: {
        partial: function (name) {
            return name;
        },
        waifu: () => {
            const files = fs.readdirSync(__dirname + "/../Public/Images/Waifus");
            
            if (files.length === 0)
                return "";

            const randomIndex = randomNumber(0, files.length);
            return process.env.SITE_LINK + "Images/Waifus/" + files[randomIndex];
        },
        dateFormatter: function(date) {
            return moment(date).format("LL");
        }, 
        typeFormatter: function(data) {
            if (data.startsWith("https://") || data.startsWith("http://")) {
                return `<a href="${data}">Link</a>`;
            } else {
                return data.split(`found in file ${process.env.UPLOAD_DESTINATION}`)[0]
                           .split("Virus ")[1]
                           .split("'")[1]
            }
        }
    }
}));
app.set ("view engine", "hbs");
// app.set('views', path.join(__dirname, "Views"));
// app.enable('view cache');
// Static files
app.use(express.static(path.join(__dirname, "/../Public")));

// parse various different custom JSON types as JSON
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cookieParser("lewd"));

app.use(cookieSession({
    name: "session",
    secret: "lewd",
    maxAge: 30 * 60 * 1000,
    overwrite: false
}));

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

app.locals.siteName   = process.env.SITE_NAME;
app.locals.uploadLink = process.env.UPLOAD_LINK;

// Set local user
app.use(async (req, res, next) => {
    res.locals.user = await getUserDetails(req.user);
    next();
});

// Set errors (if any)
app.use((req, res, next) => {
    if (req.session.err){
        res.locals.errors = frontEndError(req.session.err);
        delete req.session.err;
    }

    if (req.session.flash) {
        res.locals.message = req.session.flash;
        delete req.session.flash;
    }
    next()
});

// Set the routes
app.use("/",           index);
app.use("/login",      login);
app.use("/upload",     upload);
app.use("/user",       user);
app.use("/register",   register);
app.use("/delete",     deleter);
app.use("/user/admin", admin)

// 404
app.use((req, res, next) =>{
    res.status(404)
       .render("404");
});

if (!fs.existsSync(process.env.UPLOAD_DESTINATION)) {
    console.error(`Could not open upload directory at: ${process.env.UPLOAD_DESTINATION}`);
    console.error(`Try checking if the UPLOAD_DESTINATION environment variable is correct`);
    process.exit(1);
}


app.listen(parseInt(process.env.SITE_PORT), () => console.log("It's up and running :3"));