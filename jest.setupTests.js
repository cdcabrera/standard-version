const { existsSync, mkdirSync, readFileSync, writeFileSync } = require('fs');
const crypto = require('crypto');
const { extname, join, resolve } = require('path');

global.__basedir = __dirname;

/**
 * Generate a fixture from string literals.
 *
 * @param {string} contents
 * @param {object} options
 * @param {string} options.dir
 * @param {string} options.ext
 * @param {string} options.encoding
 * @param {string} options.filename
 * @returns {{path: string, file: string, contents: *, dir: string}}
 */
const generateFixture = (
  contents,
  { dir = resolve(__dirname, '.fixtures'), ext = 'txt', encoding = 'utf8', filename } = {}
) => {
  const updatedFileName = filename || crypto.createHash('md5').update(contents).digest('hex');
  const file = extname(updatedFileName) ? updatedFileName : `${updatedFileName}.${ext}`;
  const path = join(dir, file);

  if (!existsSync(dir)) {
    mkdirSync(dir);
  }

  writeFileSync(path, contents, { encoding });
  const updatedContents = readFileSync(path, { encoding });

  return { dir, file, path, contents: updatedContents };
};

global.generateFixture = generateFixture;

/**
 * Generate a mock for snapshot display
 *
 * @param {Array} mockFunctions
 * @returns {{}}
 */
const setMockResourceFunctions = mockFunctions => {
  const setupMock = mock => param => `<${mock}>${param}</${mock}>`;
  const mocks = {};

  mockFunctions.forEach(mock => {
    mocks[mock] = setupMock(mock);
  });

  return mocks;
};

jest.mock('chalk', () => setMockResourceFunctions(['blue', 'bold', 'yellow', 'green', 'red', 'gray']));
