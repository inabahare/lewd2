import { query } from "../../Functions/database"; 

async function get(req, res) {
    await query(`DELETE FROM "LoginTokens" 
                 WHERE token = $1`, [req.user]);
    
    req.flash("userAdded", "You are now logged out!");
    res.redirect("/");
}

export { get };