import { DbClient } from "../../helpers/database";

async function get(req, res) {
    const client = DbClient();
    await client.connect();
    await client.query(`DELETE FROM "LoginTokens" WHERE token = $1`, [req.user]);
    await client.end();
    
    req.flash("userAdded", "You are now logged out!");
    res.redirect("/");
}

export { get };