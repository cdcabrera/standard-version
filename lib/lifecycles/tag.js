const bump = require('../lifecycles/bump');
const chalk = require('chalk');
const checkpoint = require('../checkpoint');
const figures = require('figures');
const formatCommitMessage = require('../format-commit-message');
const runExecFile = require('../run-execFile');
const runLifecycleScript = require('../run-lifecycle-script');

/**
 * ExecTag
 *
 * @param {*|string} newVersion
 * @param {boolean} pkgPrivate
 * @param {object} args
 * @returns {Promise<void>}
 */
const execTag = async (newVersion, pkgPrivate, args = {}) => {
  const { prerelease, releaseCommitMessageFormat, sign, tagPrefix } = args;
  const tagOption = (sign && '-s') || '-a';

  checkpoint(args, 'tagging release %s%s', [tagPrefix, newVersion]);

  await runExecFile(args, 'git', [
    'tag',
    tagOption,
    tagPrefix + newVersion,
    '-m',
    `${formatCommitMessage(releaseCommitMessageFormat, newVersion)}`
  ]);

  const currentBranch = await runExecFile('', 'git', ['rev-parse', '--abbrev-ref', 'HEAD']);
  let message = `git push --follow-tags origin ${currentBranch.trim()}`;

  if (pkgPrivate !== true && bump.getUpdatedConfigs()['package.json']) {
    message += ' && npm publish';
    message += (prerelease === '' && ' --tag prerelease') || (prerelease !== undefined && ` --tag ${prerelease}`) || '';
  }

  checkpoint(args, 'Run `%s` to publish', [message], chalk.blue(figures.info));
};

/**
 * Tags
 *
 * @param {*|string} newVersion
 * @param {boolean} pkgPrivate
 * @param {object} args
 * @returns {Promise<void>}
 */
module.exports = async (newVersion, pkgPrivate, args = {}) => {
  if (args?.skip?.tag) {
    return;
  }

  await runLifecycleScript(args, 'pretag');
  await execTag(newVersion, pkgPrivate, args);
  await runLifecycleScript(args, 'posttag');
};
