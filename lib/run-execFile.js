const { promisify } = require('util');
const printError = require('./print-error');

const execFile = promisify(require('child_process').execFile);

module.exports = async (args, cmd, cmdArgs) => {
  let updatedStdout;

  if (args.dryRun) {
    return updatedStdout;
  }

  try {
    const { stderr, stdout } = await execFile(cmd, cmdArgs);
    // If execFile returns content in stderr, but no error, print it as a warning
    if (stderr) {
      printError(args, stderr, { level: 'warn', color: 'yellow' });
    }
    updatedStdout = stdout;
  } catch (error) {
    // If execFile returns an error, print it and exit with return code 1
    printError(args, error.stderr || error.message);
    throw error;
  }

  return updatedStdout;
};
