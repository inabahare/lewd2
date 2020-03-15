import { getStatistics } from "/Functions/Info/getStatistics";
import { getAmountOfDaysFilesAreStored } from "/Functions/Info/getAmountOfDaysFilesAreStored";

async function get(req, res) {
    let stats = null;
    try {
        const days = getAmountOfDaysFilesAreStored();
        stats = await getStatistics(days);
    }
    catch (ex) {
        console.error(`Something went wrong on the info page`, ex);
    }


    res.render("info", {
        stats: stats
    });
}

export { get };