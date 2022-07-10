const bump = require('./lifecycles/bump');
const changelog = require('./lifecycles/changelog');
const commit = require('./lifecycles/commit');
const fs = require('fs');
const latestSemverTag = require('./latest-semver-tag');
const path = require('path');
const printError = require('./print-error');
const tag = require('./lifecycles/tag');
const { resolveUpdaterObjectFromArgument } = require('./updaters');

/**
 * StandardVersion
 *
 * @param {object} argv
 * @returns {Promise<void>}
 */
module.exports = async (argv = {}) => {
  const defaults = require('./defaults');
  const updatedArgv = { ...argv };
  /**
   * `--message` (`-m`) support will be removed in the next major version.
   */
  const message = updatedArgv.m || updatedArgv.message;
  if (message) {
    /**
     * The `--message` flag uses `%s` for version substitutions, we swap this
     * for the substitution defined in the config-spec for future-proofing upstream
     * handling.
     */
    updatedArgv.releaseCommitMessageFormat = message.replace(/%s/g, '{{currentTag}}');
    if (!updatedArgv.silent) {
      console.warn(
        '[standard-version]: --message (-m) will be removed in the next major release. Use --releaseCommitMessageFormat.'
      );
    }
  }

  if (updatedArgv.changelogHeader) {
    updatedArgv.header = updatedArgv.changelogHeader;
    if (!updatedArgv.silent) {
      console.warn('[standard-version]: --changelogHeader will be removed in the next major release. Use --header.');
    }
  }

  if (updatedArgv.header && updatedArgv.header.search(changelog.START_OF_LAST_RELEASE_PATTERN) !== -1) {
    throw Error(`custom changelog header must not match ${changelog.START_OF_LAST_RELEASE_PATTERN}`);
  }

  /**
   * If an argument for `packageFiles` provided, we include it as a "default" `bumpFile`.
   */
  if (updatedArgv.packageFiles) {
    defaults.bumpFiles = defaults.bumpFiles.concat(updatedArgv.packageFiles);
  }

  const args = { ...defaults, ...updatedArgv };
  const pkg = {};

  args?.packageFiles?.forEach(packageFile => {
    const updater = resolveUpdaterObjectFromArgument(packageFile);

    if (!updater) {
      return;
    }

    const pkgPath = path.resolve(process.cwd(), updater.filename);

    if (fs.existsSync(pkgPath)) {
      const contents = fs.readFileSync(pkgPath, 'utf8');
      pkg.version = updater?.updater?.readVersion(contents);
      pkg.private = typeof updater?.updater?.isPrivate === 'function' ? updater.updater.isPrivate(contents) : false;
    }
  });

  try {
    const version = pkg.version || (args?.gitTagFallback && args?.tagPrefix && (await latestSemverTag(args.tagPrefix)));

    if (!version) {
      throw new Error('no package file found');
    }

    const newVersion = await bump(args, version);
    await changelog(args, newVersion);
    await commit(args, newVersion);
    await tag(newVersion, pkg?.private || false, args);
  } catch (err) {
    printError(args, err.message);
    throw err;
  }
};
