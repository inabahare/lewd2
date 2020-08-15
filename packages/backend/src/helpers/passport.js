import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { User, LoginToken } from "/DataAccessObjects";

const generateLoginToken = userid => crypto.createHash("sha1")
    .update(userid.toString() + Date.now().toString())
    .digest("hex");

passport.use(new LocalStrategy({
    usernameField: "username",
    passwordField: "password"
}, async (username, password, next) => {
    const res = await User.GetPaswordAndId(username);

    if (!res) {
        return next(null, false);
    }

    const user = res[0];

    const checkPassword = await bcrypt.compare(password, user.password);

    if (checkPassword == true) {
        const userId = parseInt(user.id);
        const token = generateLoginToken(userId);

        const data = {
            userId,
            token
        };

        await LoginToken.Add(data);

        return next(null, token);
    } else {
        return next(null, false);
    }
}));

passport.serializeUser((user, next) => next(null, user));
passport.deserializeUser((user, next) => next(null, user));


export default passport;
