import handlebars     from "express-handlebars";
import path           from "path";
import fs             from "fs";
import moment         from "moment"; 
import { convertNumberToBestByteUnit } from "/Functions/convertNumberToBestByteUnit";

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
        typeFormatter: this._typeFormatter, 
        getSizeAndUnit: this._sizeFormatter,
        loopTimes: this._loop,
      }
    }));
  }
 
  // Because handlebars doesn't support just looping n times lmao
  static _loop(n, content) {
    let result = "";

    for (let i = 0; i < n; i++) {
      result += content.fn(i);
    }

    return result;
  }

  // This is used to render the partials
  static _partial (name) {
    return name;
  }

  static _sizeFormatter(size) {
    const sizeFormatted = convertNumberToBestByteUnit(size);
    return `${sizeFormatted.value} ${sizeFormatted.unit}`;
  }

  // This is used for the pictures shown on the site 
  static _getRandomImage() {
    let waifuDir = null;
    let files    = null;
    try {
      waifuDir = path.join(__dirname, "../../frontend/dist/waifus");
      files = fs.readdirSync(waifuDir);
    }
    catch(ex) {
      return;
    }
        
        
    if (files.length === 0)
      return "";

    const randomIndex = randomNumber(0, files.length);
    const randomWaifuLink = `${process.env.SITE_LINK}waifus/${files[randomIndex]}`;

    return randomWaifuLink;
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