import getAllFromTransparency from "/Functions/Transparency/getAllFromTransparency";

async function get(req, res) {
    const transparency = await getAllFromTransparency();
    
    res.render("transparency", {
        transparencyElements: transparency
    });
}

export { get };