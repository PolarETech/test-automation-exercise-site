module.exports = {
  preset: '@vue/cli-plugin-unit-jest/presets/typescript-and-babel',
  transform: {
    '^.+\\.vue$': 'vue-jest',
    '^.+\\.tsx?$': 'ts-jest'
  },
  collectCoverage: true,
  collectCoverageFrom: [
    '<rootDir>/src/views/**/*.vue',
    '<rootDir>/src/components/**/*.vue',
    '<rootDir>/src/store/modules/*.ts'
  ]
}
