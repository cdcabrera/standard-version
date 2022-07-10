const chalk = require('chalk');
const checkpoint = require('./checkpoint');
const figures = require('figures');
const runExec = require('./run-exec');

/**
 * Run lifecycle script
 *
 * @param {object} args
 * @param {object} args.scripts
 * @param {object} args.args
 * @param {string} hookName
 * @returns {Promise<void>|Promise<*>}
 */
module.exports = ({ scripts, ...args } = {}, hookName) => {
  if (!scripts?.[hookName]) {
    return Promise.resolve();
  }

  const updatedArgs = { scripts, ...args };

  const command = scripts[hookName];
  checkpoint(updatedArgs, 'Running lifecycle script "%s"', [hookName]);
  checkpoint(updatedArgs, '- execute command: "%s"', [command], chalk.blue(figures.info));

  return runExec(updatedArgs, command);
};
