import passport                      from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { query } from "../Functions/database";
import bcrypt                        from "bcrypt";
import crypto                        from "crypto";

const generateLoginToken = userid => crypto.createHash("sha1")
                                           .update(userid.toString() + Date.now().toString())
                                           .digest("hex");

passport.use(new LocalStrategy({
    usernameField: "username",
    passwordField: "password"
}, async (username, password, next) => {
    const res = await query(`SELECT id, password 
                             FROM "Users" 
                             WHERE username = $1;`, [username]);
    if (!res) {
        return next(null, false);
    }

    const user = res[0];

    const checkPassword = await bcrypt.compare(password, user.password);

    if (checkPassword == true){
        const userId    = parseInt(user.id);
        let userToken = generateLoginToken(userId);

        const data = [
            userToken,
            userId
        ];

        await query(`INSERT INTO "LoginTokens" (token, registered, userid)
                     VALUES ($1, NOW(), $2);`, data);

        return next(null, userToken);
    } else {
        return next(null, false);
    }     
}));

passport.serializeUser(  (user, next) => next(null, user));
passport.deserializeUser((user, next) => next(null, user));


export default passport;
