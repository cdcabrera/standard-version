const runExecFile = require('../run-execFile');

describe('run-execFile', () => {
  it('should attempt to execFile commands', async () => {
    const dryRunResults = await runExecFile({ dryRun: true });
    const echoCmdResults = await runExecFile({}, 'echo', ['lorem ipsum']);

    expect({
      dryRunResults,
      echoCmdResults
    }).toMatchSnapshot('command results');
  });
});
