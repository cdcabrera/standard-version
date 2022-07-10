/**
 * Format commit message
 *
 * @param {string} rawMsg
 * @param {string} newVersion
 * @returns {string}
 */
module.exports = (rawMsg, newVersion) => String(rawMsg).replace(/{{currentTag}}/g, newVersion);
