/**

 * Waits n amount of milliseconds in an awaitable manner
 * @param {Number} milliseconds 
 */
const sleep = milliseconds => {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
};

export default sleep;