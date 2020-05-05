import { Transparency } from "/DataAccessObjects";

async function get(req, res) {
    const transparency = await Transparency.GetAll ();
    
    res.render("transparency", {
        transparencyElements: transparency
    });
}

export { get };