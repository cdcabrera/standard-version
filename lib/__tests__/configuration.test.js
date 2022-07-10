const { getConfiguration } = require('../configuration');

const CONFIGURATION = `{
  "types": [
    {"type":"feat","section":"Features"},
    {"type":"fix","section":"Bug Fixes"},
    {"type":"test","section":"Tests", "hidden": true},
    {"type":"build","section":"Build System", "hidden": true},
    {"type":"ci","hidden":true}
  ]
}
`;

describe('configuration', () => {
  it('should attempt to getConfiguration', () => {
    const { path: filepath } = generateFixture(CONFIGURATION, {
      filename: 'versionrc.json'
    });

    expect(getConfiguration(filepath)).toMatchSnapshot('getConfiguration');
  });
});
