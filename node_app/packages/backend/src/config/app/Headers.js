import cookieSession  from "cookie-session";
import bodyParser     from "body-parser";
import cookieParser   from "cookie-parser";

class Headers {
  static SetBodyParser(app) {
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
  }

  static SetCookieParser(app) {
    app.use(cookieParser("lewd"));
  }

  static SetSession(app) {
    app.use(cookieSession({
      name: "session",
      secret: "lewd",
      maxAge: parseInt(process.env.SITE_COOKIE_MAX_AGE), // One year
      overwrite: false
    }));
  }
}

export { Headers };