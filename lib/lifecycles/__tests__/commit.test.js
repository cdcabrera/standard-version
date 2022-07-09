const commit = require('../commit');

jest.mock('../../run-execFile', () => (...args) => {
  console.info(args);
  return 'mock-exec-file-response';
});

describe('commit', () => {
  const mockInfo = jest.fn();
  let spyInfo;

  beforeEach(() => {
    spyInfo = jest.spyOn(console, 'info').mockImplementation(mockInfo);
  });

  afterEach(() => {
    mockInfo.mockClear();
    spyInfo.mockClear();
  });

  it('should skip returning commit information', async () => {
    await commit({ skip: { commit: true } }, 'lorem ipsum');
    expect(mockInfo.mock.calls).toMatchSnapshot('console');
  });

  it('should skip returning changelog and bump information', async () => {
    await commit({ skip: { changelog: true, bump: true } }, 'lorem ipsum');
    expect(mockInfo.mock.calls).toMatchSnapshot('console');
  });

  it('should run lifecycles returning commit information', async () => {
    await commit(
      {
        bumpFiles: [],
        skip: {},
        scripts: {
          prerelease: 'echo "prerelease lifecycle mock"',
          precommit: 'echo "precommit lifecycle mock"',
          postcommit: 'echo "postcommit lifecycle mock"'
        }
      },
      'lorem ipsum'
    );

    expect(mockInfo.mock.calls).toMatchSnapshot('console');
  });
});
