
const units = {
    B: 1,
    kB: 1000,
    MB: 1000000,
    GB: 1000000000,
    TB: 100000000000
}
/**
 * Returns the input size in bytes according to the unit
 * @param {number} size 
 * @param {string} unit 
 */
const formatUploadSize = (size, unit) => parseInt(size) * units[unit];


export default formatUploadSize;