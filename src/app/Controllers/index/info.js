import { getStatistics } from "../../Functions/Info/getStatistics";
import { getAmountOfDaysFilesAreStored } from "../../Functions/Info/getAmountOfDaysFilesAreStored";

async function get(req, res) {
    const days = getAmountOfDaysFilesAreStored();
    const stats = await getStatistics(days);

    console.log(stats);
    
    res.render("info", {
        stats: stats
    });
}

export { get };