const path = require('path');
const findUp = require('find-up');
const { existsSync, readFileSync } = require('fs');

/**
 * ToDo; CONFIGURATION_FILES should be set as default via command.js or
 * moved into defaults
 */
/**
 * ToDo: we could eventually have deeper validation of the configuration (using `ajv`) and
 * provide a more helpful error.
 */
/**
 * GetConfiguration
 *
 * @param {Array|string} CONFIGURATION_FILES
 * @returns {{}|*}
 */
module.exports.getConfiguration = (
  CONFIGURATION_FILES = ['.versionrc', '.versionrc.cjs', '.versionrc.json', '.versionrc.js']
) => {
  const configPath = findUp.sync(CONFIGURATION_FILES);
  let config = {};

  if (!configPath) {
    return config;
  }

  const ext = path.extname(configPath);

  if (ext === '.js' || ext === '.cjs') {
    const jsConfiguration = require(configPath);
    config = (typeof jsConfiguration !== 'function' && jsConfiguration) || jsConfiguration();
  } else if (existsSync(configPath)) {
    config = JSON.parse(readFileSync(configPath));
  }

  if (typeof config !== 'object') {
    throw Error(
      `[standard-version] Invalid configuration in ${configPath} provided. Expected an object but found ${typeof config}.`
    );
  }

  return config;
};
