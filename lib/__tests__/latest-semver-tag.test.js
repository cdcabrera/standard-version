const latestSemverTag = require('../latest-semver-tag');

jest.mock('git-semver-tags', () => (options, callback) => {
  const tags = [];
  callback(undefined, tags);
});

describe('latestSemverTag', () => {
  it('should attempt to get and parse tags', async () => {
    const result = await latestSemverTag();
    expect(result).toMatchSnapshot('default');
  });
});
