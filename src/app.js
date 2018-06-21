"use strict";

import express       from "express";
import handlebars    from "express-handlebars";
import path          from 'path';
import session       from "express-session";
import validator     from "express-validator";
import cookieSession from "cookie-session";
import bodyParser    from "body-parser";
import Util          from "util";

import db       from "./helpers/database";
import passport from "./helpers/passport";
 
// Routers
import index  from "./Routes/index";
import login  from "./Routes/login";
import upload from "./Routes/upload";
import user   from "./Routes/user";

const app = express();

// Load views
app.engine ("hbs", handlebars ({ 
    defaultLayout: __dirname + "/views/main",
    extname: "hbs",
    partialsDir: __dirname + "/views/partials/",
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
        }
    }
}));
app.set ("view engine", "hbs");
app.set('views', path.join(__dirname, "views"));
// app.enable('view cache');

// Static files
// app.use(express.static(path.join(__dirname, "public")));

// parse various different custom JSON types as JSON
app.use(bodyParser.json({ type: 'application/*+json' }))
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieSession({
    secret: "lewd",
    httpOnly: true, 
    maxAge: 30 * 60 * 1000,
    secure: false,
    overwrite: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(validator());

// Set local user
app.use((req, res, next) => {
    res.locals.user = req.user ? req.user : null;
    next()
});

app.use((req, res, next) => {
    if (req.session.err) {
        res.locals.errors = [];
        req.session.err.forEach(error => {
            res.locals.errors[error.param] = error.msg;
        });
        delete req.session.err;
    }
    next();
});

// Set the routes
app.use("/", index);
app.use("/login", login);
app.use("/upload", upload);
app.use("/user", user);

// 404
app.use((req, res, next) =>{
    res.status(404).send("404 - Page not found");
});

app.listen(8080, () => console.log("It's up and running :3"));