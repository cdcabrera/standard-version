const printError = require('../print-error');

describe('print-error', () => {
  it('should pass and run console methods', () => {
    const mockError = jest.fn();
    const spy = jest.spyOn(console, 'error').mockImplementation(mockError);

    printError({ silent: false });
    printError({ silent: false }, 'lorem ipsum');
    printError({ silent: false }, 'dolor sit', { color: 'green' });
    expect(mockError.mock.calls).toMatchSnapshot('console messages');

    spy.mockClear();
  });
});
