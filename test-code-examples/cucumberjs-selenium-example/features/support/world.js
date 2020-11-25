require('chromedriver')
const { Builder, Capabilities } = require('selenium-webdriver')
const { setWorldConstructor, setDefaultTimeout } = require('@cucumber/cucumber')

const baseURL = 'https://polaretech.github.io/test-automation-exercise-site'
const timeout = 60 * 1000

const capabilities = Capabilities.chrome()
capabilities.set('chromeOptions', {
  args: [
    '--headless',
    '--no-sandbox',
    '--disable-gpu',
    `--window-size=1024,768`
  ],
  w3c: false
})

class CustomWorld {
  constructor () {
    this.driver = new Builder()
      .withCapabilities(capabilities)
      .build()

    this.baseURL = baseURL

    // Use this variable if the test scenario needs to
    // store a temporary value for sharing between steps.
    this.tempValue = null
  }
}

setWorldConstructor(CustomWorld)

// cucumber default timeout should be larger than selenium-webdriver's wait timeout
setDefaultTimeout(timeout)
