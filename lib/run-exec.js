const { promisify } = require('util');
const printError = require('./print-error');

const exec = promisify(require('child_process').exec);

// ToDo: combine run-exec/File
/**
 * Run exec
 * If exec returns content in stderr, but no error, print it as a warning. If exec
 * returns an error, print it and exit.
 *
 * @param {object} args
 * @param {boolean} args.dryRun
 * @param {*|string} cmd
 * @returns {Promise<*>}
 */
module.exports = async (args = {}, cmd) => {
  let updatedStdout;

  if (args?.dryRun) {
    return updatedStdout;
  }

  try {
    const { stderr, stdout } = await exec(cmd);
    if (stderr) {
      printError(args, stderr, { level: 'warn', color: 'yellow' });
    }
    updatedStdout = stdout;
  } catch (error) {
    printError(args, error.stderr || error.message);
    throw error;
  }

  return updatedStdout;
};
