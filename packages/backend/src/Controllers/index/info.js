import { getAmountOfDaysFilesAreStored } from "/Functions/Info/getAmountOfDaysFilesAreStored";
import { Statistics } from "/DataAccessObjects";

async function get(req, res) {
  const days = getAmountOfDaysFilesAreStored();
  const stats = await Statistics.GetStatistics(days);

  res.render("info", {
    stats: stats
  });
}

export { get };