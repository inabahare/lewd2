import { db } from "../../helpers/database";

async function get(req, res) {
    const client = await db.connect();
    await client.query(`DELETE FROM "LoginTokens" 
                        WHERE token = $1`, [req.user]);
    await client.release();
    
    req.flash("userAdded", "You are now logged out!");
    res.redirect("/");
}

export { get };