import passport from "passport";
import { Strategy as LocalStrategy } from 'passport-local';
import db from "./database";
import bcrypt from "bcrypt";

passport.use(new LocalStrategy({
    usernameField: "username",
    passwordField: "password"
}, async (username, password, next) => {
    const client = await db.connect();
    const res    = await client.query("SELECT id, username, password FROM \"Users\" WHERE username = $1;", [username]);
    
    await client.release();

    const user   = res.rows[0];

    bcrypt.compare(password, user.password)
          .then(result => {
              if (result == true)
                next(null, user);
              else
                next(null, false);

          });
}));

passport.serializeUser(  (user, next) => next(null, user));
passport.deserializeUser((user, next) => next(null, user));


export default passport;
