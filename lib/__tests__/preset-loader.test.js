const presetLoader = require('../preset-loader');

describe('preset-loader', () => {
  it('should pass unknown presets', () => {
    expect(
      presetLoader({
        preset: 'lorem ipsum'
      })
    ).toMatchSnapshot('unknown');
  });
});
