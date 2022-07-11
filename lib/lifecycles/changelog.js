const chalk = require('chalk');
const checkpoint = require('../checkpoint');
const conventionalChangelog = require('conventional-changelog');
const fs = require('fs');
const presetLoader = require('../preset-loader');
const runLifecycleScript = require('../run-lifecycle-script');
const writeFile = require('../write-file');
// ToDo: move this to defaults, rename towards "legacy-like"
const START_OF_LAST_RELEASE_PATTERN = /(^#+ \[?[0-9]+\.[0-9]+\.[0-9]+|<a name=)/m;

/**
 * CreateIfMissing
 *
 * @param {object} args
 * @param {*} args.infile
 * @param {object} args.args
 */
const createIfMissing = ({ infile, ...args } = {}) => {
  try {
    fs.accessSync(infile, fs.F_OK);
  } catch (err) {
    if (err.code === 'ENOENT') {
      checkpoint(args, 'created %s', [infile]);
      writeFile({ ...args, infile, outputUnreleased: true }, infile, '\n');
    }
  }
};

/**
 * OutputChangelog
 * Attempts to find the position of the last release (oldContentStart) and remove header
 *
 * @param {object} args
 * @param {*|string} newVersion
 * @returns {Promise<unknown>}
 */
const outputChangelog = (args = {}, newVersion) =>
  new Promise((resolve, reject) => {
    const { dryRun, header, infile, path, tagPrefix, verbose } = args;
    createIfMissing(args);

    let oldContent = dryRun ? '' : fs.readFileSync(infile, 'utf-8');
    const oldContentStart = oldContent.search(START_OF_LAST_RELEASE_PATTERN);

    if (oldContentStart !== -1) {
      oldContent = oldContent.substring(oldContentStart);
    }

    let content = '';
    const changelogStream = conventionalChangelog(
      {
        debug: verbose && console.info.bind(console, 'conventional-changelog'),
        preset: presetLoader(args),
        tagPrefix
      },
      { version: newVersion },
      { merges: null, path }
    ).on('error', function (err) {
      return reject(err);
    });

    changelogStream.on('data', buffer => {
      content += buffer.toString();
    });

    changelogStream.on('end', () => {
      checkpoint(args, 'outputting changes to %s', [infile]);

      if (dryRun) {
        console.info(`\n---\n${chalk.gray(content.trim())}\n---\n`);
      } else {
        writeFile(args, infile, `${header}\n${(content + oldContent).replace(/\n+$/, '\n')}`);
      }

      return resolve();
    });
  });

/**
 * Changelog
 *
 * @param {object} args
 * @param {*|string} newVersion
 * @returns {Promise<void>}
 */
async function Changelog(args = {}, newVersion) {
  if (args?.skip?.changelog) {
    return;
  }

  await runLifecycleScript(args, 'prechangelog');
  await outputChangelog(args, newVersion);
  await runLifecycleScript(args, 'postchangelog');
}

Changelog.START_OF_LAST_RELEASE_PATTERN = START_OF_LAST_RELEASE_PATTERN;

module.exports = Changelog;
