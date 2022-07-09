const bump = require('../bump');

describe('bump', () => {
  const mockInfo = jest.fn();
  let spy;

  beforeEach(() => {
    spy = jest.spyOn(console, 'info').mockImplementation(mockInfo);
  });

  afterEach(() => {
    mockInfo.mockClear();
    spy.mockClear();
  });

  it('should skip returning version information', async () => {
    const bumpSkip = await bump({ skip: { bump: true } }, 'lorem ipsum');

    expect({
      bumpSkip
    }).toMatchSnapshot('results');
    expect(mockInfo.mock.calls).toMatchSnapshot('console');
  });

  it('should run lifecycles returning version information', async () => {
    const bumpLifecycle = await bump(
      {
        bumpFiles: [],
        skip: {},
        scripts: {
          prerelease: 'echo "prerelease lifecycle mock"',
          prebump: 'echo "prebump lifecycle mock"',
          postbump: 'echo "postbump lifecycle mock"'
        }
      },
      'lorem ipsum'
    );

    expect({
      bumpLifecycle
    }).toMatchSnapshot('results');
    expect(mockInfo.mock.calls).toMatchSnapshot('console');
  });

  it('should run release-as returning version information', async () => {
    const bumpReleaseAs = await bump(
      {
        bumpFiles: [],
        releaseAs: '1.5.0',
        skip: {},
        scripts: {
          prerelease: 'echo "prerelease releaseAs mock"'
        }
      },
      '1.0.0'
    );

    const bumpReleaseAsStdout = await bump(
      {
        bumpFiles: [],
        skip: {},
        scripts: {
          prerelease: 'echo "prerelease releaseAsStdout mock"',
          prebump: 'echo "2.0.0"'
        }
      },
      '1.0.0'
    );

    const bumpRelease = await bump(
      {
        bumpFiles: [],
        skip: {},
        scripts: {
          prerelease: 'echo "prerelease release mock"'
        }
      },
      '0.0.0'
    );

    const bumpReleasePatch = await bump(
      {
        bumpFiles: [],
        releaseAs: 'patch',
        skip: {},
        scripts: {
          prerelease: 'echo "prerelease release patch mock"'
        }
      },
      '0.0.0'
    );

    const bumpReleaseMinor = await bump(
      {
        bumpFiles: [],
        releaseAs: 'minor',
        skip: {},
        scripts: {
          prerelease: 'echo "prerelease release minor mock"'
        }
      },
      '0.0.0'
    );

    const bumpReleaseMajor = await bump(
      {
        bumpFiles: [],
        releaseAs: 'major',
        skip: {},
        scripts: {
          prerelease: 'echo "prerelease release major mock"'
        }
      },
      '0.0.0'
    );

    expect({
      bumpReleaseAs,
      bumpReleaseAsStdout,
      bumpRelease,
      bumpReleasePatch,
      bumpReleaseMinor,
      bumpReleaseMajor
    }).toMatchSnapshot('results');

    expect(mockInfo.mock.calls).toMatchSnapshot('console');
  });

  it('should run first release returning version information', async () => {
    const bumpReleaseFirst = await bump(
      {
        bumpFiles: [],
        firstRelease: true,
        skip: {},
        scripts: {
          prerelease: 'echo "prerelease first release mock"'
        }
      },
      '0.1.0'
    );

    expect({
      bumpReleaseFirst
    }).toMatchSnapshot('results');

    expect(mockInfo.mock.calls).toMatchSnapshot('console');
  });
});
