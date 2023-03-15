module.exports = {
  root: true,
  extends: [require.resolve('@sima-land/linters/eslint'), 'plugin:react/jsx-runtime'],
  rules: {
    'require-jsdoc': 'off',
    'jsdoc/require-jsdoc': 'off',
    'no-console': 'off',
  },
};
