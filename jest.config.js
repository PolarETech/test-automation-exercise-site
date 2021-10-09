module.exports = {
  preset: '@vue/cli-plugin-unit-jest',
  transform: {
    '^.+\\.vue$': 'vue-jest'
  },
  moduleNameMapper: {
    '^vue$': '@vue/compat'
  },
  collectCoverage: true,
  collectCoverageFrom: [
    '<rootDir>/src/views/**/*.vue',
    '<rootDir>/src/components/**/*.vue',
    '<rootDir>/src/store/modules/*.js',
    '!<rootDir>/src/components/Password.vue' // Excluded from the measurement because this is a third-party component that I copied to fix bugs
  ]
}
