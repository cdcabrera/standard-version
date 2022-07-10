const fs = require('fs');

/**
 * Write file
 *
 * @param {object} args
 * @param {boolean} args.dryRun
 * @param {string} filePath
 * @param {string} content
 */
module.exports = ({ dryRun } = {}, filePath, content) => {
  if (dryRun) {
    return;
  }

  fs.writeFileSync(filePath, content, 'utf8');
};
