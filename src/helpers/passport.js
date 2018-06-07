import passport from "passport";
import { Strategy as LocalStrategy } from 'passport-local';
import db from "./database";

passport.use(new LocalStrategy({
    usernameField: "username",
    passwordField: "password"
}, async (username, password, next) => {
    const client = await db.connect();
    const res = await client.query("SELECT id, password FROM \"Users\" WHERE username = $1;", [username]);;
    console.log(res.rows[0]);
    await client.release()
    next(null, true);
}))

export default passport;
