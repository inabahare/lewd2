import handlebars     from "express-handlebars";
import path           from "path";
import fs             from "fs";
import moment         from "moment"; 

const randomNumber  = (x, y) =>  Math.floor((Math.random() * y) + x); 

class Views {
    static SetEngine(app) {
        app.engine ("hbs", handlebars ({ 
            defaultLayout: "main",
            extname: "hbs",
            partialsDir: __dirname + "/../views/partials/",
            helpers: {
                partial: this._partial,
                waifu: this._getRandomImage,
                dateFormatter: this._dateFormatter, 
                typeFormatter: this._typeFormatter
            }
        }));
    }

    // This is used to render the partials
    static _partial (name) {
        return name;
    }

    // This is used for the pictures shown on the site
    static _getRandomImage() {
        const files = fs.readdirSync(__dirname + "/../Public/Images/Waifus");
                    
        if (files.length === 0)
            return "";

        const randomIndex = randomNumber(0, files.length);
        return process.env.SITE_LINK + "Images/Waifus/" + files[randomIndex];
    }

    // Used when showing time on the site
    static _dateFormatter(date) {
        return moment(date).format("LL");
    }

    static _typeFormatter(data) {
        if (data.startsWith("https://") || data.startsWith("http://")) {
            return `<a href="${data}">Link</a>`;
        } else {
            return data.split(`found in file ${process.env.UPLOAD_DESTINATION}`)[0]
                       .split("Virus ")[1]
                       .split("'")[1];
        }

    }

    static SetDetails(app) {
        app.set ("view engine", "hbs");
        app.set("views", path.join(__dirname, "/../views"));
    }
}

export { Views };