/**
 * Awaitable sleep function
 * @param {Number} milliseconds 
 */
const sleep = milliseconds => new Promise(resolve => setTimeout(resolve, milliseconds));

export default sleep;