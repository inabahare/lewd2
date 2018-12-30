/**
 * Replaces dangerous charactes
 * @param {string} str 
 */
const escape = str => str.replace(/&/g, "&amp;")
                         .replace(/</g, "&lt;")
                         .replace(/>/g, "&gt;")
                         .replace(/\//g, "&sol;")
                         .replace(/\\/g, "&bsol;")
                         .replace(/"/g, "&quot;")
                         .replace(/'/g, "&#039;");

export default escape;