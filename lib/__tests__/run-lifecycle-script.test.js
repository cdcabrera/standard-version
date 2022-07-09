const runLifecycleScriptTest = require('../run-lifecycle-script');

describe('run-lifecycle-script', () => {
  it('should attempt to exec commands', async () => {
    const mockInfo = jest.fn();
    const spyInfo = jest.spyOn(console, 'info').mockImplementation(mockInfo);

    const mockWarn = jest.fn();
    const spyWarn = jest.spyOn(console, 'warn').mockImplementation(mockWarn);

    const scriptMismatchResults = await runLifecycleScriptTest({ scripts: { lorem: 'echo "mismatch"' } }, 'dolor');
    const dryRunResults = await runLifecycleScriptTest({ dryRun: true, scripts: { lorem: 'echo "dry run"' } }, 'lorem');
    const echoCmdResults = await runLifecycleScriptTest({ scripts: { lorem: 'echo "lorem ipsum"' } }, 'lorem');
    const errorResults = await runLifecycleScriptTest(
      { scripts: { lorem: 'echo "dolor sit error" && exit 0' } },
      'lorem'
    );
    const errorResultsStdOut = await runLifecycleScriptTest(
      { scripts: { lorem: 'echo "dolor sit stdout error" 1>&2 && exit 0' } },
      'lorem'
    );

    expect({
      scriptMismatchResults,
      dryRunResults,
      echoCmdResults,
      errorResults,
      errorResultsStdOut
    }).toMatchSnapshot('command results');

    expect({ info: mockInfo.mock.calls, warn: mockWarn.mock.calls }).toMatchSnapshot('console messages');

    spyInfo.mockClear();
    spyWarn.mockClear();
  });
});
