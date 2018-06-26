import passport from "passport";
import { Strategy as LocalStrategy } from 'passport-local';
import db from "./database";
import bcrypt from "bcrypt";

passport.use(new LocalStrategy({
    usernameField: "username",
    passwordField: "password"
}, async (username, password, next) => {
    console.log(username, password);
    const client = await db.connect();
    const res    = await client.query("SELECT \"Users\".id, username, roleid, \"Roles\".name, \"Roles\".\"uploadsize\", token, password "
                                    + "FROM \"Users\", \"Roles\" "
                                    + "WHERE \"Users\".username = $1 AND roleid = \"Roles\".id;", [username]);
    
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
