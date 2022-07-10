const spec = require('conventional-changelog-config-spec');

/**
 * Defaults
 *
 * @type {{noVerify: boolean, silent: boolean, tagPrefix: string, dryRun: boolean, gitTagFallback: boolean,
 *     commitAll: boolean, sign: boolean, skip: {}, infile: string, preset: string, scripts: {}, firstRelease: boolean}}
 */
const defaults = {
  infile: 'CHANGELOG.md',
  firstRelease: false,
  sign: false,
  noVerify: false,
  commitAll: false,
  silent: false,
  tagPrefix: 'v',
  scripts: {},
  skip: {},
  dryRun: false,
  gitTagFallback: true,
  preset: require.resolve('conventional-changelog-conventionalcommits')
};

/**
 * Merge in defaults provided by the spec
 */
Object.keys(spec?.properties).forEach(propertyKey => {
  const property = spec?.properties?.[propertyKey];

  if (property) {
    defaults[propertyKey] = property.default;
  }
});

/**
 * Sets the default for `header` (provided by the spec) for backwards
 * compatibility. This should be removed in the next major version.
 */
defaults.header =
  '# Changelog\n\nAll notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.\n';

defaults.packageFiles = ['package.json', 'bower.json', 'manifest.json'];

defaults.bumpFiles = defaults.packageFiles.concat(['package-lock.json', 'npm-shrinkwrap.json']);

module.exports = defaults;
