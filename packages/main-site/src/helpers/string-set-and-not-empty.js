/**
 * If the string is undefined, null, or "" it will return false
 * @param {string} str 
 */
const stringSetAndNotEmpty = 
  str => !str || str.length === 0;

export { stringSetAndNotEmpty };