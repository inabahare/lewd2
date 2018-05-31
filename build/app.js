"use strict";

var _express = require("express");

var _express2 = _interopRequireDefault(_express);

var _expressHandlebars = require("express-handlebars");

var _expressHandlebars2 = _interopRequireDefault(_expressHandlebars);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _index = require("./Routes/index");

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();

// Routers


console.log(__dirname + "/views");

// Load views
app.engine("hbs", (0, _expressHandlebars2.default)({
    defaultLayout: __dirname + "/views/main",
    extname: "hbs"
}));
app.set("view engine", "hbs");
app.set('views', _path2.default.join(__dirname, "views"));
// Static files
// app.use(static(join(__dirname, "public")));

// Set the routes
app.use("/", _index2.default);

app.listen(8080, function () {
    return console.log("It's up and running :3");
});
//# sourceMappingURL=app.js.map
