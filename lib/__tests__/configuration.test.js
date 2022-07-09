const path = require('path');
const { getConfiguration } = require('../configuration');

describe('configuration', () => {
  it('should attempt to getConfiguration', () => {
    expect(getConfiguration(path.join(__dirname, './__mocks__/versionrc.json'))).toMatchSnapshot('getConfiguration');
  });
});
