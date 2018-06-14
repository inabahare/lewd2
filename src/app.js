"use strict";

import express    from "express";
import handlebars from "express-handlebars";
import path       from 'path';
import session    from "express-session";
import bodyParser from "body-parser";
import Util       from "util";

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
        }
    }
}));
app.set ("view engine", "hbs");
app.set('views', path.join(__dirname, "views"));

// Static files
// app.use(express.static(path.join(__dirname, "public")));

// parse various different custom JSON types as JSON
app.use(bodyParser.json({ type: 'application/*+json' }))
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: "lewd.se",
    resave: true,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

/*
import Memwatch from "memwatch-next";
import trace from "@risingstack/trace";

let hd = null;
Memwatch.on('leak', (info) => {
  console.log('memwatch::leak');
  console.error(info);
  if (!hd) {
    hd = new Memwatch.HeapDiff();
 }
 else {
   const diff = hd.end();
   console.error(Util.inspect(diff, true, null));
   trace.report('memwatch::leak', {
     HeapDiff: hd
   });
   hd = null;
 }
});

*/
app.use((req, res, next) => {
    res.locals.user = req.user ? req.user : null;
    next()
});

// Set the routes
app.use("/", index);
app.use("/login", login);
app.use("/upload", upload);
app.use("/user", user);

app.post("/test", (req, res) => {
    console.log(req.body);
    res.send("Hello World");
});


app.listen(8080, () => console.log("It's up and running :3"));