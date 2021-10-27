const { After, Before, Status } = require('@cucumber/cucumber')
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
    const featureName = scenario.pickle.uri.split(/[/.]/)[1]

    const scenarioName = () => {
      let name = scenario.pickle.name
      name = name.replace(/[\s".:*?<>|\\/]/g, '_')
      return name.replace(/__/g, '_')
    }

    const time = () => {
      const t = new Date()
      return t.toString().split(/[ :]/).slice(4, 7).join('')
    }

    const filename = () => {
      let name = `${featureName}__${scenarioName()}`
      const maxlength = 80
      if (name.length > maxlength) {
        name = name.substr(0, maxlength)
      }
      return `${name}__${time()}`
    }

    await saveScreenshot(this.driver, filename())
  }

  await this.driver.quit().catch(error => { throw error })
})
