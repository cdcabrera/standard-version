const chalk = require('chalk');
const figures = require('figures');
const util = require('util');

/**
 * Checkpoint
 *
 * @param {object} argv
 * @param {*|boolean} argv.silent
 * @param {string} msg
 * @param {*|object|Array} args
 * @param {boolean} args.dryRun
 * @param {*} figure
 */
module.exports = ({ silent } = {}, msg, args, figure) => {
  const defaultFigure = args?.dryRun ? chalk.yellow(figures.tick) : chalk.green(figures.tick);
  if (!silent) {
    console.info(
      `${figure || defaultFigure} ${util.format.apply(
        util,
        [msg]?.concat(
          args?.map(function (arg) {
            return chalk.bold(arg);
          })
        )
      )}`
    );
  }
};
