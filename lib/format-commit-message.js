module.exports = (rawMsg, newVersion) => String(rawMsg).replace(/{{currentTag}}/g, newVersion);
