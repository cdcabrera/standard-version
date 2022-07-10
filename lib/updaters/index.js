const path = require('path');
const JSON_BUMP_FILES = require('../defaults').bumpFiles;
const updatersByType = {
  json: require('./types/json'),
  'plain-text': require('./types/plain-text')
};
//ToDo: move this towards defaults
//ToDo: apply unit tests for exported functions
const PLAIN_TEXT_BUMP_FILES = ['VERSION.txt', 'version.txt'];

/**
 * isValidUpdater
 * Simple check to determine if the object provided is a compatible updater.
 *
 * @param {*} obj
 * @returns {boolean}
 */
const isValidUpdater = obj => typeof obj?.readVersion === 'function' && typeof obj?.writeVersion === 'function';

module.exports.getUpdaterByType = isValidUpdater;

/**
 * GetUpdaterByType
 *
 * @param {*|string} type
 * @returns {*}
 */
const getUpdaterByType = type => {
  const updater = updatersByType?.[type];
  if (!updater) {
    throw Error(`Unable to locate updater for provided type (${type}).`);
  }
  return updater;
};

module.exports.getUpdaterByType = getUpdaterByType;

/**
 * GetUpdaterByFilename
 *
 * @param {string} filename
 * @param {object} options
 * @param {Array} options.JSON_FILES
 * @param {Array} options.TXT_FILES
 * @returns {*}
 */
const getUpdaterByFilename = (filename, { JSON_FILES = JSON_BUMP_FILES, TXT_FILES = PLAIN_TEXT_BUMP_FILES } = {}) => {
  if (JSON_FILES.includes(path.basename(filename))) {
    return getUpdaterByType('json');
  }
  if (TXT_FILES.includes(filename)) {
    return getUpdaterByType('plain-text');
  }
  throw Error(
    `Unsupported file (${filename}) provided for bumping.\n Please specify the updater \`type\` or use a custom \`updater\`.`
  );
};

module.exports.getCustomUpdaterFromPath = getUpdaterByFilename;

/**
 * GetCustomUpdaterFromPath
 *
 * @param {string|object} updater
 * @returns {*}
 */
const getCustomUpdaterFromPath = updater => {
  if (typeof updater === 'string') {
    return require(path.resolve(process.cwd(), updater));
  }
  if (isValidUpdater(updater)) {
    return updater;
  }
  throw new Error('Updater must be a string path or an object with readVersion and writeVersion methods');
};

module.exports.getCustomUpdaterFromPath = getCustomUpdaterFromPath;

/**
 * ResolveUpdaterObjectFromArgument
 * If an Object was not provided, we assume it's the path/filename of the updater, or not.
 *
 * @param {string|object} arg
 * @returns {{}|boolean}
 */
module.exports.resolveUpdaterObjectFromArgument = arg => {
  if (isValidUpdater(arg)) {
    return arg;
  }

  const updater = (typeof arg === 'object' && { ...arg }) || {
    filename: arg
  };

  try {
    if (typeof updater.updater === 'string') {
      updater.updater = getCustomUpdaterFromPath(updater.updater);
    } else if (updater.type) {
      updater.updater = getUpdaterByType(updater.type);
    } else {
      updater.updater = getUpdaterByFilename(updater.filename);
    }
  } catch (err) {
    if (err?.code !== 'ENOENT')
      console.warn(`Unable to obtain updater for: ${JSON.stringify(arg)}\n - Error: ${err.message}\n - Skipping...`);
  }

  if (!isValidUpdater(updater.updater)) {
    return false;
  }

  return updater;
};
