const defaults = require('../defaults');

describe('defaults', () => {
  it('should have defined properties', () => {
    expect({ ...defaults, preset: undefined }).toMatchSnapshot('properties');
  });
});
