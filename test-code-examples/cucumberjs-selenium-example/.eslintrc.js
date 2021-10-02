module.exports = {
  root: true,
  env: {
    node: true,
  },
  parser: '@babel/eslint-parser',
  plugins: [
    'cucumber',
  ],
  extends: [
  ],
  rules: {
    'cucumber/async-then': 2,
    'cucumber/expression-type': 2,
    'cucumber/no-restricted-tags': [2, 'wip', 'broken', 'foo'],
    'cucumber/no-arrow-functions': 2,
  },
  parserOptions: {
    'requireConfigFile': false,
  }
}
