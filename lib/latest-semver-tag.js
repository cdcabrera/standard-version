const gitSemverTags = require('git-semver-tags');
const semver = require('semver');

/**
 * Latest semver tag
 *
 * @param {string} tagPrefix
 * @returns {Promise<unknown>}
 */
module.exports = (tagPrefix = undefined) =>
  new Promise((resolve, reject) => {
    gitSemverTags({ tagPrefix }, (err, tags) => {
      if (err) {
        return reject(err);
      } else if (!tags?.length) {
        return resolve('1.0.0');
      }

      // Respect tagPrefix
      // ensure that the largest semver tag is at the head.
      tags = tags.map(tag => tag.replace(new RegExp(`^${tagPrefix}`), '')).map(tag => semver.clean(tag));

      tags.sort(semver.rcompare);

      return resolve(tags[0]);
    });
  });
