/**
 *  Generate a new deletion key
 */
const deletionKey = length => [...Array(length)].map(i=>(~~(Math.random()*36 + (i - i))).toString(36)).join("");

export default deletionKey;