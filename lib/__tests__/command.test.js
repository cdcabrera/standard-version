const command = require('../command');

describe('command', () => {
  it('should return generated commands', () => {
    expect({ ...command.argv, preset: undefined }).toMatchSnapshot('generated');
  });
});
