const { After, Before, Status } = require('cucumber')
const { changeWindowWidth, saveScreenshot } = require('./helpers.js')

Before({ tags: '@desktop' }, async function () {
  // resize window to desktop
  const newWidth = 769
  await changeWindowWidth(this.driver, newWidth)
})

Before({ tags: '@mobile' }, async function () {
  // resize window to mobile
  const newWidth = 768
  await changeWindowWidth(this.driver, newWidth)
})

After(async function (scenario) {
  // save screenshot if scenario failed
  if (scenario.result.status === Status.FAILED) {
    const featureName = scenario.sourceLocation.uri.split(/[/.]/)[1]
    const featureLine = scenario.sourceLocation.line
    const filename = `${featureName}_line${featureLine}`
    await saveScreenshot(this.driver, filename)
  }

  await this.driver.quit().catch(error => { throw error })
})
