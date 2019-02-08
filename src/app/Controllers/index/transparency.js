import getAllFromTransparency from "../../../AntivirusApi/Functions/Transparency/getAllFromTransparency";


async function get(req, res) {
    const transparency = await getAllFromTransparency();
    
    res.render("transparency", {
        transparencyElements: transparency
    });
}

export { get };