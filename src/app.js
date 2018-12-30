"use strict";
require("dotenv").config();

import express        from "express";
import path           from "path";
import flash          from "express-flash";
import fs             from "fs";
import frontEndError  from "./app/helpers/frontendErrorFormatter";
import getUserDetails from "./app/Functions/User/getUserDetails";
import passport       from "./app/helpers/passport";

import { Routes }  from "./app/config/app/Routes";
import { Views }   from "./app/config/app/Views";
import { Headers } from "./app/config/app/Headers";

import { Setup } from "./app/config/setup";

const app = express();

// Load views
Views.SetEngine(app);
Views.SetDetails(app);

// app.enable("view cache");
// Static files
if (process.env.NODE_ENV === "development") {
    app.use(express.static(path.join(__dirname, "/../Public")));
}

// parse various different custom JSON types as JSON
Headers.SetBodyParser(app);
Headers.SetCookieParser(app);
Headers.SetSession(app);

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

app.locals.siteName   = process.env.SITE_NAME;
app.locals.siteLink   = process.env.SITE_LINK;
app.locals.uploadLink = process.env.UPLOAD_LINK;

// Set local user
app.use(async (req, res, next) => {
    if (req.user) {
        res.locals.user = await getUserDetails(req.user);
    }

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
    
    next();
});

// Set the routes
Routes.SetPages(app);

// 404
Routes.SetErrorPages(app);

if (!fs.existsSync(process.env.UPLOAD_DESTINATION)) {
    console.error(`Could not open upload directory at: ${process.env.UPLOAD_DESTINATION}`);
    console.error("Try checking if the UPLOAD_DESTINATION environment variable is correct");
    process.exit(1);
}

///////////////////
// STARTUP SETUP //
///////////////////
(async function() {
    await Setup.Database.SetUp();
})();


app.listen(parseInt(process.env.SITE_PORT), () => console.log("It's up and running :3"));