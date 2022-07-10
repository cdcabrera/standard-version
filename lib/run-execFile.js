const { promisify } = require('util');
const printError = require('./print-error');

const execFile = promisify(require('child_process').execFile);

// ToDo: combine run-exec/File
/**
 * Run exec file
 * If execFile returns content in stderr, but no error, print it as a warning. If execFile
 * returns an error, print it and exit.
 *
 * @param {object} args
 * @param {boolean} args.dryRun
 * @param {*|string} cmd
 * @param {Array} cmdArgs
 * @returns {Promise<*>}
 */
module.exports = async (args = {}, cmd, cmdArgs) => {
  let updatedStdout;

  if (args?.dryRun) {
    return updatedStdout;
  }

  try {
    const { stderr, stdout } = await execFile(cmd, cmdArgs);
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
