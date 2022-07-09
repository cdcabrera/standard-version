const runExec = require('../run-exec');

describe('run-exec', () => {
  it('should attempt to exec commands', async () => {
    const mockWarn = jest.fn();
    const spy = jest.spyOn(console, 'warn').mockImplementation(mockWarn);

    const dryRunResults = await runExec({ dryRun: true });
    const echoCmdResults = await runExec({}, 'echo "lorem ipsum"');
    const errorResults = await runExec({}, 'echo "dolor sit error" && exit 0');
    const errorResultsStdOut = await runExec({}, 'echo "dolor sit stdout error" 1>&2 && exit 0');

    expect({
      dryRunResults,
      echoCmdResults,
      errorResults,
      errorResultsStdOut
    }).toMatchSnapshot('command results');

    expect(mockWarn.mock.calls).toMatchSnapshot('console messages');

    spy.mockClear();
  });
});
