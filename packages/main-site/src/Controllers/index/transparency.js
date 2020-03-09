import logToTransparency from "../../Functions/Transparency/logToTransparency";

async function get(req, res) {
    const transparency = await getAllFromTransparency();
    
    res.render("transparency", {
        transparencyElements: transparency
    });
}

export { get };