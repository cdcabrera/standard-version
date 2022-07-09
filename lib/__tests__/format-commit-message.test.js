const formatCommitMessage = require('../format-commit-message');

describe('formatCommitMessage', () => {
  it('should format a commit message', () => {
    expect(formatCommitMessage('lorem ipsum, {{currentTag}}', '0.0.0')).toMatchSnapshot('format');
  });
});
