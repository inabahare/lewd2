
/**
 * @returns {Number} - All the days files can stay alive from the process.env.TIME_FILE_CAN_STAY_ALIVE
 */
function getAmountOfDaysFilesAreStored() {
  const daysString = process.env
    .TIME_FILE_CAN_STAY_ALIVE
    .split(" ")[0];
  return parseInt(daysString);
}

export { getAmountOfDaysFilesAreStored };