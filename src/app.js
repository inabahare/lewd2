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
import { promisify }  from "util"

import db       from "./helpers/database";
import passport from "./helpers/passport";
 
// Routers
import index    from "./Routes";
import login    from "./Routes/login";
import upload   from "./Routes/upload";
import user     from "./Routes/user";
import register from "./Routes/register";
import deleter  from "./Routes/delete"; // God damn reserved keywords

const readdir = promisify(fs.readdir);

const randomNumber  = (x, y) =>  Math.floor((Math.random() * y) + x); 

const app = express();


// Load views
app.engine ("hbs", handlebars ({ 
    defaultLayout: __dirname + "/Views/main",
    extname: "hbs",
    partialsDir: __dirname + "/Views/partials/",
    helpers: {
        is: function (a, b, opts) {
            if (a == b) {
                return opts.fn(this)
            } else {
                return opts.inverse(this)
            }
        }, 
        partial: function (name) {
            return name;
        },
        waifu: () => {
            const files = fs.readdirSync(__dirname + "/Public/Images/Waifus");
            
            if (files.length === 0)
                return "";

            const randomIndex = randomNumber(0, files.length);
            return process.env.SITE_NAME + "Images/Waifus/" + files[randomIndex];
        }
    }
}));
app.set ("view engine", "hbs");
app.set('views', path.join(__dirname, "Views"));
// app.enable('view cache');

// Static files
// app.use(express.static(path.join(__dirname, "Public")));

// parse various different custom JSON types as JSON
app.use(bodyParser.json({ type: 'application/*+json' }))
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser("lewd"));
app.use(cookieSession({
    secret: "lewd",
    httpOnly: true, 
    maxAge: 30 * 60 * 1000,
    secure: false,
    overwrite: false
}));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

// Set local user
app.use(async (req, res, next) => {
    res.locals.user = await getUserDetails(req.user);
    next()
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
app.use("/",         index);
app.use("/login",    login);
app.use("/upload",   upload);
app.use("/user",     user);
app.use("/register", register);
app.use("/delete",   deleter);

// 404
app.use((req, res, next) =>{
    res.status(404).send("404 - Page not found");
});

app.listen(parseInt(process.env.SITE_PORT), () => console.log("It's up and running :3"));