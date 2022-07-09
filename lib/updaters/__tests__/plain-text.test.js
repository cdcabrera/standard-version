const { readVersion, writeVersion } = require('../types/plain-text');

describe('plain-text updaters', () => {
  it('should read version information', () => {
    const contents = {
      version: 'lorem ipsum'
    };

    expect(readVersion(JSON.stringify(contents))).toMatchSnapshot('read');
  });

  it('should return version information to write', () => {
    const contents = {
      version: 'lorem ipsum'
    };

    expect(writeVersion(JSON.stringify(contents), 'dolor sit')).toMatchSnapshot('write');
  });
});
