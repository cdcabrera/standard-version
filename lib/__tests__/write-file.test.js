const fs = require('fs');
const writeFile = require('../write-file');

describe('write-file', () => {
  it('should attempt to write a file', () => {
    const mockWriteFile = jest.fn();
    const spy = jest.spyOn(fs, 'writeFileSync').mockImplementation(mockWriteFile);

    writeFile({ dryRun: true });
    writeFile({}, 'lorem/ipsum/dolor.sit', 'hello world');
    expect(mockWriteFile.mock.calls).toMatchSnapshot('write');

    spy.mockClear();
  });
});
