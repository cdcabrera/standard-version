'use strict';

const chalk = require('chalk');
const checkpoint = require('../checkpoint');
const conventionalRecommendedBump = require('conventional-recommended-bump');
const figures = require('figures');
const fs = require('fs');
const DotGitignore = require('dotgitignore');
const path = require('path');
const presetLoader = require('../preset-loader');
const runLifecycleScript = require('../run-lifecycle-script');
const semver = require('semver');
const writeFile = require('../write-file');
const { resolveUpdaterObjectFromArgument } = require('../updaters');

// ToDo: move TypeList to defaults.js
const TypeList = ['major', 'minor', 'patch'].reverse();
let configsToUpdate = {};

/**
 * Calculate the priority of release type,
 * major - 2, minor - 1, patch - 0
 *
 * @param {*} type
 * @param {object} options
 * @param {Array} options.typeList
 * @returns {number}
 */
const getTypePriority = (type, { typeList = TypeList } = {}) => typeList.indexOf(type);

/**
 * Extract the in-pre-release type in target version
 *
 * @param {*|string} version
 * @param {object} options
 * @param {Array} options.typeList
 * @returns {string}
 */
const getCurrentActiveType = (version, { typeList = TypeList } = {}) => {
  let returnType;

  for (let i = 0; i < typeList.length; i++) {
    if (semver[typeList[i]](version)) {
      returnType = typeList[i];
      break;
    }
  }

  return returnType;
};

/**
 * if a version is currently in pre-release state, and if it current in-pre-release
 * type is same as expect type, it should continue the pre-release with the same type
 *
 * @param {*|string} prerelease
 * @param {*} expectedReleaseType
 * @param {*|string} currentVersion
 * @returns {string|*}
 */
const getReleaseType = (prerelease, expectedReleaseType, currentVersion) => {
  if (typeof prerelease === 'string') {
    if (Array.isArray(semver.prerelease(currentVersion))) {
      if (
        getCurrentActiveType(currentVersion) === expectedReleaseType ||
        getTypePriority(getCurrentActiveType(currentVersion)) > getTypePriority(expectedReleaseType)
      ) {
        return 'prerelease';
      }
    }

    return `pre${expectedReleaseType}`;
  }

  return expectedReleaseType;
};

/**
 * BumpVersion
 *
 * @param {*} releaseAs
 * @param {*|string} currentVersion
 * @param {object} args
 * @returns {Promise<unknown>}
 */
const bumpVersion = (releaseAs, currentVersion, args = {}) =>
  new Promise((resolve, reject) => {
    if (releaseAs) {
      resolve({
        releaseType: releaseAs
      });
    } else {
      const presetOptions = presetLoader(args);

      if (typeof presetOptions === 'object' && semver.lt(currentVersion, '1.0.0')) {
        presetOptions.preMajor = true;
      }

      conventionalRecommendedBump(
        {
          ...args,
          debug: args?.verbose && console.info.bind(console, 'conventional-recommended-bump'),
          preset: presetOptions
        },
        (err, release) => {
          if (err) {
            reject(err);
          } else {
            resolve(release);
          }
        }
      );
    }
  });

/**
 * Attempt to update the version number in provided `bumpFiles`
 * Flag any config files that we modify the version # for as having been updated.
 *
 * @param {object} args config object
 * @param {*|string} newVersion version number to update to.
 * @returns {void}
 */
const updateConfigs = (args = {}, newVersion) => {
  const dotgit = DotGitignore();

  args?.bumpFiles?.forEach(bumpFile => {
    const updater = resolveUpdaterObjectFromArgument(bumpFile);

    if (!updater) {
      return;
    }

    const { filename, updater: subUpdater = {} } = updater;
    const configPath = path.resolve(process.cwd(), filename);

    if (dotgit?.ignore(configPath)) {
      return;
    }

    try {
      const stat = fs.lstatSync(configPath);

      if (!stat?.isFile()) {
        return;
      }

      const contents = fs.readFileSync(configPath, 'utf8');
      checkpoint(args, `bumping version in ${filename} from %s to %s`, [subUpdater?.readVersion(contents), newVersion]);
      writeFile(args, configPath, subUpdater?.writeVersion(contents, newVersion));
      configsToUpdate[filename] = true;
    } catch (err) {
      if (err.code !== 'ENOENT') {
        console.warn(err.message);
      }
    }
  });
};

/**
 * Bump
 * Reset the cache of updated config files each time we perform the version bump step.
 *
 * @param {object} args
 * @param {*|string} version
 * @returns {Promise<string|*>}
 */
async function Bump(args = {}, version) {
  configsToUpdate = {};

  if (args?.skip?.bump) {
    return version;
  }
  const updatedArgs = { ...args };
  let newVersion = version;

  await runLifecycleScript(updatedArgs, 'prerelease');
  const stdout = await runLifecycleScript(updatedArgs, 'prebump');

  if (stdout?.trim().length) {
    updatedArgs.releaseAs = stdout.trim();
  }

  const { releaseType } = await bumpVersion(updatedArgs?.releaseAs, version, updatedArgs);

  if (!updatedArgs?.firstRelease) {
    const updatedReleaseType = getReleaseType(updatedArgs?.prerelease, releaseType, version);
    newVersion = semver.valid(updatedReleaseType) || semver.inc(version, updatedReleaseType, updatedArgs?.prerelease);

    updateConfigs(updatedArgs, newVersion);
  } else {
    checkpoint(updatedArgs, 'skip version bump on first release', [], chalk.red(figures.cross));
  }

  await runLifecycleScript(updatedArgs, 'postbump');
  return newVersion;
}

Bump.getUpdatedConfigs = () => configsToUpdate;

module.exports = Bump;
