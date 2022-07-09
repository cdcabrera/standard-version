const checkpoint = require('../checkpoint');

describe('checkpoint', () => {
  it('should attempt to display console messaging', () => {
    const mockInfo = jest.fn();
    const spy = jest.spyOn(console, 'info').mockImplementation(mockInfo);

    const args = ['lorem ipsum'];
    args.dryRun = true;
    checkpoint({ silent: false }, undefined, args, undefined);

    args.dryRun = false;
    checkpoint({ silent: false }, undefined, args, undefined);
    checkpoint({ silent: false }, undefined, args, 'mock-figure');
    checkpoint({ silent: false }, 'dolor sit', args, 'mock-figure');

    expect(mockInfo.mock.calls).toMatchSnapshot('console');

    spy.mockClear();
  });
});
