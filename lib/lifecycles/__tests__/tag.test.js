const tag = require('../tag');

jest.mock('../../run-execFile', () => (...args) => {
  console.info(args);
  return 'mock-exec-file-response';
});

describe('tag', () => {
  const mockInfo = jest.fn();
  let spyInfo;

  beforeEach(() => {
    spyInfo = jest.spyOn(console, 'info').mockImplementation(mockInfo);
  });

  afterEach(() => {
    mockInfo.mockClear();
    spyInfo.mockClear();
  });

  it('should skip returning tag information', async () => {
    await tag('lorem ipsum', undefined, { skip: { tag: true } });
    expect(mockInfo.mock.calls).toMatchSnapshot('console');
  });

  it('should run lifecycles returning tag information', async () => {
    await tag('lorem ipsum', undefined, {
      bumpFiles: [],
      skip: {},
      scripts: {
        prerelease: 'echo "prerelease lifecycle mock"',
        pretag: 'echo "pretag lifecycle mock"',
        posttag: 'echo "posttag lifecycle mock"'
      }
    });

    expect(mockInfo.mock.calls).toMatchSnapshot('console');
  });
});
