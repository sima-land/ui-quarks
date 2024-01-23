module.exports = {
  root: true,
  extends: [require.resolve('@sima-land/linters/eslint')],
  rules: {
    'require-jsdoc': 'off',
    'jsdoc/require-jsdoc': 'off',
    'no-console': 'off',
  },
};
