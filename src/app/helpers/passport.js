import passport                      from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { db }                  from "./database";
import bcrypt                        from "bcrypt";
import crypto                        from "crypto";

const generateLoginToken = userid => crypto.createHash("sha1")
                                           .update(userid.toString() + Date.now().toString())
                                           .digest("hex");

passport.use(new LocalStrategy({
    usernameField: "username",
    passwordField: "password"
}, async (username, password, next) => {
    const client = await db.connect();
    const res    = await client.query(`SELECT id, password 
                                       FROM "Users" 
                                       WHERE username = $1;`, [username]);
    const user = res.rows[0];

    if (user === undefined) {
        await client.release();
        return next(null, false);
    }

    const checkPassword = await bcrypt.compare(password, user.password);

    if (checkPassword == true){
        const userId    = parseInt(user.id);
        let userToken = generateLoginToken(userId);

        try {
            await client.query(`INSERT INTO "LoginTokens" (token, registered, userid)
            VALUES ($1, NOW(), $2);`, [
                userToken,
                userId
            ]);
        } 
        catch(ex) {
            console.error(`Failed to insert to LoginToken with message ${ex.message}`);
            userToken = null;
        }
        finally {
            await client.release(); 
        }

        return next(null, userToken);
    } else {
        await client.release();
        return next(null, false);
    }     
}));

passport.serializeUser(  (user, next) => next(null, user));
passport.deserializeUser((user, next) => next(null, user));


export default passport;
