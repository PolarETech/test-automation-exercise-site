const { When, Then } = require('@cucumber/cucumber')
const { createPageObject } = require('../support/helpers.js')
const assert = require('assert')

When('I click the {word} tab in the About view', async function (tabNumber) {
  // Step example:
  // I click the 1st tab in the About view

  const page = createPageObject('About')
  const locator = page.getTargetLocator('About-Tab')
  const index = page.numberText2index(tabNumber)

  const elements = await this.driver.findElements(locator)
  elements[index].click()

  await page.waitTabTransition(this)
})

Then('the About-Tab should have the correct tab list in the About view', async function () {
  const page = createPageObject('About')
  const expected = page.tabs.map(item => { return item.label })
  const locator = page.getTargetLocator('About-Tab')

  const tabList = await this.driver.findElements(locator)
  const actual = await Promise.all (
    tabList.map (async tab => await tab.getAttribute('outerText'))
  )

  assert.deepStrictEqual(actual, expected)
})

Then('the {word} tab content is displayed in the About view', async function (tabNumber) {
  // Step example:
  // the 1st tab content is displayed in the About view

  const page = createPageObject('About')
  const index = page.numberText2index(tabNumber)
  const locator = page.getTargetLocator('Tab-Items')
  const tabItems = await this.driver.findElements(locator)

  for (let i = 0; i < tabItems.length; i++) {
    const displayStatus = await tabItems[i].isDisplayed()
    const expected = (index === i)
    assert.strictEqual(displayStatus, expected)
  }
})

Then('the {word} tab content should have the correct headers in the About view', async function (tabNumber) {
  // Step example:
  // the 1st tab content should have the correct headers in the About view

  const page = createPageObject('About')
  const index = page.numberText2index(tabNumber)
  const expected = page.tabs[index].headers
  let locator = null
  const actual = []

  locator = page.getTargetLocator('Tab-Items')
  const tabItems = await this.driver.findElements(locator)

  locator = page.getTargetLocator('Tab-Item-Headers')
  const headers = await tabItems[index].findElements(locator)
  for (let i = 0; i < headers.length; i++) {
    text = await headers[i].getAttribute('outerText')
    actual.push(text)
  }

  assert.deepStrictEqual(actual, expected)
})
