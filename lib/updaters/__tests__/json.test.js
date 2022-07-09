const { readVersion, writeVersion, isPrivate } = require('../types/json');

describe('json updaters', () => {
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

  it('should return the private prop', () => {
    const contents = {
      version: 'lorem ipsum',
      private: 'hello world'
    };

    expect(isPrivate(JSON.stringify(contents))).toMatchSnapshot('isPrivate');
  });
});
