const { resolveUpdaterObjectFromArgument } = require('../index');

describe('updaters', () => {
  it('should attempt to run updaters with an invalid format', () => {
    const mockWarn = jest.fn();
    const spy = jest.spyOn(console, 'warn').mockImplementation(mockWarn);

    expect(() => resolveUpdaterObjectFromArgument('invalid updater')).toThrowErrorMatchingSnapshot(
      'invalid updater, string'
    );
    expect(mockWarn.mock.calls).toMatchSnapshot('console messages');

    spy.mockClear();
  });

  it('should attempt to run updaters with other formats', () => {
    const mockWarn = jest.fn();
    const spy = jest.spyOn(console, 'warn').mockImplementation(mockWarn);

    const mockValidUpdater = resolveUpdaterObjectFromArgument({
      readVersion: Function.prototype,
      writeVersion: Function.prototype,
      mockUpdater: 'Lorem ipsum mock'
    });

    const mockUpdaterString = resolveUpdaterObjectFromArgument({
      readVersion: Function.prototype,
      writeVersion: Function.prototype,
      updater: 'Lorem ipsum mock'
    });

    const mockUpdaterType = resolveUpdaterObjectFromArgument({
      readVersion: Function.prototype,
      writeVersion: Function.prototype,
      type: 'json'
    });

    const mockUpdaterFilename = resolveUpdaterObjectFromArgument({
      readVersion: Function.prototype,
      writeVersion: Function.prototype,
      filename: 'Lorem ipsum filename'
    });

    expect({
      mockValidUpdater,
      mockUpdaterString,
      mockUpdaterType,
      mockUpdaterFilename
    }).toMatchSnapshot('updaters');

    expect(mockWarn.mock.calls).toMatchSnapshot('console messages');

    spy.mockClear();
  });
});
