const chalk = require('chalk');

/**
 * Print error
 *
 * @param {object} args
 * @param {object} args.silent
 * @param {string} msg
 * @param {object} options
 * @param {string} options.level
 * @param {string} options.color
 * @param {object} options.opts
 */
module.exports = ({ silent } = {}, msg, { level = 'error', color = 'red', ...opts } = {}) => {
  if (!silent) {
    const updatedOpts = { level, color, ...opts };

    console[updatedOpts.level](chalk[updatedOpts.color](msg));
  }
};
