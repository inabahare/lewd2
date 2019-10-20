import { format } from "url";
import { patreon, oauth } from "patreon";

const redirectUrl = `${process.env.SITE_LINK}user`;

const patreonLink = format({
    protocol: "https",
    host: "patreon.com",
    pathname: "/oauth2/authorize",
    query: {
        response_type: "code",
        client_id: process.env.PATREON_CLIENT_ID,
        redirect_uri: redirectUrl,
        state: "chill"
    }
});

const oathClient = oauth(process.env.PATREON_CLIENT_ID, process.env.PATREON_SECRET_ID);

let skip = false;

async function get(req, res) {
    if (skip) {
        const { code } = req.query;
        const reply = await oathClient.getTokens(code, redirectUrl);
    
        const token = reply.access_token;
    
        const apiClient = patreon(token);
        try {
            const { store } = await apiClient("/current_user");
            const user = store.findAll("user").map(u => u.serialize());
            console.log(user);
        }
        catch (e) {
            console.log(e);
        }
    }
    skip = true;

    res.render("user", { 
        menuItem: "index",
        patreonLink: patreonLink
    });
}

export { get };