const fs = require('fs');
const changelog = require('../changelog');

const CHANGELOG = `
# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [2.0.0](https://github.com/conventional-changelog/standard-version/compare/v1.1.0...v2.0.0) (2022-06-02)

### Features

* **deprecated:** add deprecation message ([#907](https://github.com/conventional-changelog/standard-version/issues/907)) ([XXXXXXX](https://github.com/conventional-changelog/standard-version/commit/XXXXXXX))

<a name="1.1.0"></a>
# [1.1.0](https://github.com/conventional-changelog/standard-version/compare/v1.0.0...v1.1.0) (2022-06-01)

### Bug Fixes

* corrected an issue ([#123](https://github.com/conventional-changelog/standard-version/issues/123)) ([XXXXXXX](https://github.com/conventional-changelog/standard-version/commit/XXXXXXX))
`;

describe('changelog', () => {
  const mockInfo = jest.fn();
  let spy;

  beforeEach(() => {
    spy = jest.spyOn(console, 'info').mockImplementation(mockInfo);
  });

  afterEach(() => {
    mockInfo.mockClear();
    spy.mockClear();
  });

  it('should skip setting up changelog', async () => {
    const changelogInvalid = await changelog({ skip: { changelog: true } });

    expect({
      changelogInvalid
    }).toMatchSnapshot('results');
    expect(mockInfo.mock.calls).toMatchSnapshot('console');
  });

  it('should attempt to update changelog', async () => {
    const { path: filepath } = generateFixture(CHANGELOG, {
      filename: 'CHANGELOG_ATTEMPT.md'
    });

    await changelog({
      skip: {},
      infile: filepath
    });

    const changelogUpdate = fs.readFileSync(filepath, { encoding: 'utf8' });

    expect(changelogUpdate).toContain('undefined');
    expect({
      changelogUpdate
    }).toMatchSnapshot('results');
    expect(mockInfo.mock.calls.map(results => results.map(result => result.replace(__basedir, '')))).toMatchSnapshot(
      'console'
    );
  });

  it('should update changelog', async () => {
    const { path: filepath } = generateFixture(CHANGELOG, {
      filename: 'CHANGELOG_UPDATE.md'
    });

    await changelog(
      {
        skip: {},
        infile: filepath,
        header: 'lorem ipsum'
      },
      '3.0.0'
    );

    const changelogUpdate = fs.readFileSync(filepath, { encoding: 'utf8' });

    expect(changelogUpdate).toContain('lorem ipsum');
    expect(changelogUpdate).toContain('[3.0.0]');
    expect(mockInfo.mock.calls.map(results => results.map(result => result.replace(__basedir, '')))).toMatchSnapshot(
      'console'
    );
  });
});
