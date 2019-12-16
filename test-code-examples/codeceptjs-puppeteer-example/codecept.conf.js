exports.config = {
  tests: './tests/*_test.js',
  output: './output',
  helpers: {
    Puppeteer: {
      url: 'https://polaretech.github.io/test-automation-exercise-site',
      show: false,
      waitForNavigation: 'networkidle0',
    },
  },
  plugins: {
    retryFailedStep: {
      enabled: true,
    },
  },
  include: {
    I: './steps_file.js',
  },
  bootstrap: null,
  mocha: {},
  name: 'codeceptjs-puppeteerpexample',
}
