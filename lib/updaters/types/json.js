const stringifyPackage = require('stringify-package');
const detectIndent = require('detect-indent');
const detectNewline = require('detect-newline');

/**
 * IsPrivate
 *
 * @param {string} contents
 * @returns {boolean|undefined}
 */
module.exports.isPrivate = contents => JSON.parse(contents)?.private;

/**
 * ReadVersion
 *
 * @param {string} contents
 * @returns {string|undefined}
 */
module.exports.readVersion = contents => JSON.parse(contents)?.version;

/**
 * WriteVersion
 *
 * @param {string} contents
 * @param {string} version
 * @returns {*}
 */
module.exports.writeVersion = (contents, version) => {
  const json = JSON.parse(contents);
  const indent = detectIndent(contents).indent;
  const newline = detectNewline(contents);
  json.version = version;

  // package-lock v2 stores version there too
  if (json?.packages?.['']) {
    json.packages[''].version = version;
  }

  return stringifyPackage(json, indent, newline);
};
