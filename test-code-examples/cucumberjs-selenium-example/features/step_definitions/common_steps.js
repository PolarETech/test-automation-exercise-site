const { By, until } = require('selenium-webdriver')
const { Given, When, Then } = require('@cucumber/cucumber')
const { createPageObject, objectName2tagName, headerTarget2selector } = require('../support/helpers.js')
const assert = require('assert')

Given('I am on the {word} view', async function (viewName) {
  const page = createPageObject(viewName)
  const path = page.path

  await this.driver
    .get(`${this.baseURL}${path}`)
    .catch(error => { throw error })

  await this.driver
    .wait(
      until.titleContains('test automation exercise site'),
      10000,
      `the ${viewName} view is unreachable`
    )
})

When('I click the {word} in the {word} view', async function (target, viewName) {
  // Step example:
  // I click the About-Button in the Home view

  const page = createPageObject(viewName)
  const locator = page.getTargetLocator(target)
  const element = await this.driver.findElement(locator)

  // NOTE: wait until the target status change from disabled to enabled
  await this.driver
  .wait(
    until.elementIsEnabled(element),
    10000,
    `the ${target} is not enabled in the ${viewName} view.`
  )
  .click()
})

Then('the page title should be correct as the {word} view', async function (viewName) {
  const page = createPageObject(viewName)
  const expected = page.text.pageTitle

  // NOTE: wait until the SPA screen transition is complete
  await this.driver
    .wait(
      until.titleIs(expected),
      10000
    )
    .finally (async () => {
      const actual = await this.driver
        .getTitle()
        .catch(error => { throw error })

      assert.strictEqual(actual, expected)
    })
})

Then('the {string} element should have the correct text as the {word} view', async function (selector, viewName) {
  // Step example:
  // the 'h1' element should have the correct text as the Home view
  // NOTE: the element needs to be expressed in css selector or xpath, and defined in page object

  const page = createPageObject(viewName)
  const expected = page.text[selector]

  const locator = (
    (selector.indexOf('/') !== -1)
    ? By.xpath(selector)
    : By.css(selector)
  )

  if (expected === undefined || locator === undefined) {
    throw new Error(`an unexpected element "${selector}" is given by scenario.`)
  }

  // NOTE: wait until the target appears
  const actual = await this.driver
    .wait(
      until.elementLocated(locator),
      10000,
      `the ${selector} element is not located in the ${viewName} view.`
    )
    .getAttribute('outerText')

  assert.strictEqual(actual, expected)
})

Then('the {word} should have the correct text {word} in the {word} view', async function (target, targetText, viewName) {
  // Step example:
  // the Login-Error-Message should have the correct text errorMessage in the Login view

  const page = createPageObject(viewName)
  const expected = page.getTargetMessage(targetText)
  const locator = page.getTargetLocator(target)

  // NOTE: wait until the target appears
  const actual = await this.driver
    .wait(
      until.elementLocated(locator),
      10000,
      `the ${target} is not located in the ${viewName} view.`
    )
    .getAttribute('outerText')

  assert.strictEqual(actual, expected)
})

Then('the {word} should be displayed in the {word} view', async function (target, viewName) {
  // Step example:
  // the About-Button should be displayed in the Home view

  const page = createPageObject(viewName)
  const locator = page.getTargetLocator(target)

  const actual = await this.driver
    .wait(
      until.elementLocated(locator),
      10000,
      `the ${target} is not located in the ${viewName} view.`
    )
    .isDisplayed()

    assert.ok(actual)
})

Then('the {word} should NOT be displayed in the {word} view', async function (target, viewName) {
  // Step example:
  // the Login-Error-Message should NOT be displayed in the Login view

  const page = createPageObject(viewName)
  const locator = page.getTargetLocator(target)

  // Assert the target is one of the following or not:
  // - the element exists and not displayed
  // - the element does not exists
  await this.driver
    .wait(
      until.elementLocated(locator),
      3000
    )
    .isDisplayed()
    .then(actual => {
      // OK if the target exists and the target is not displayed
      assert.ok(actual === false)
    })
    .catch((error) => {
      if (error.name === 'TimeoutError') {
        // OK if the targe does not exist
        assert.ok(true)
      } else {
        assert.fail(error)
      }
    })
})

Then('the {word} should be enabled in the {word} view', async function (target, viewName) {
  // Step example:
  // the Login-Button should be enabled in the Login view

  const page = createPageObject(viewName)
  const locator = page.getTargetLocator(target)
  const element = await this.driver.findElement(locator)

  const actual = await this.driver
    .wait(
      until.elementIsEnabled(element),
      10000,
      `the ${target} is not enabled in the ${viewName} view.`
    )
    .isEnabled()

    assert.ok(actual)
})

Then('the {word} should be disabled in the {word} view', async function (target, viewName) {
  // Step example:
  // the Login-Button should be disabled in the Login view

  const page = createPageObject(viewName)
  const locator = page.getTargetLocator(target)
  const element = await this.driver.findElement(locator)

  const actual = await this.driver
    .wait(
      until.elementIsDisabled(element),
      10000,
      `the ${target} is not disabled in the ${viewName} view.`
    )
    .isEnabled()

    assert.ok(actual === false)
})

Then('the {string} toast should be pop-up', async function (text) {
  let actual = null
  const locator = By.xpath(`//div[contains(@class, "toast") and normalize-space(.)="${text}"]`)

  actual = await this.driver
    .wait(
      until.elementLocated(locator),
      10000,
      `the "${text}" toast does not appear.`
    )
    .isDisplayed()

  assert.ok(actual)

  // the Buefy toast should disappear after 2000ms
  const element = await this.driver.findElement(locator)
  actual = await this.driver
    .wait(
      until.stalenessOf(element),
      2500,
      `the "${text}" toast does not disappear.`
    )

  assert.ok(actual)
})

/*****************************
 * Navigation Area Operation
 *****************************/
When('I click the {word} in the header', async function (target) {
  // Step example:
  // I click the Hamburger-Icon in the header

  const selector = headerTarget2selector(target)
  const locator = By.css(selector)

  // NOTE: wait until the target appears
  await this.driver
  .wait(
    until.elementLocated(locator),
    10000,
    `the ${target} is not located in the header.`
  )
  .click()
})

When('I click the {string} {word} in the header', async function (text, object) {
  // Step example:
  // I click the 'Login' link in the header

  const tagName = objectName2tagName(object)
  const locator = By.xpath(`//header//${tagName}[normalize-space(.)="${text}"]`)

  // NOTE: wait until the target appears
  await this.driver
  .wait(
    until.elementLocated(locator),
    10000,
    `the "${text}" ${object} is not located in the header.`
  )
  .click()
})

Then('the {string} {word} should be displayed in the header', async function (text, object) {
  // Step example:
  // the 'Logout' button should be displayed in the header

  const tagName = objectName2tagName(object)
  const locator = By.xpath(`//header//${tagName}[normalize-space(.)="${text}"]`)

  const actual = await this.driver
    .wait(
      until.elementLocated(locator),
      10000,
      `the "${text}" ${object} is not located in the header.`
    )
    .isDisplayed()

  assert.ok(actual)
})

Then('the {word} should be displayed/opened in the header', async function (target) {
  // Step example:
  // the Navigation-Menu should be opened in the header

  const selector = headerTarget2selector(target)
  const locator = By.css(selector)

  const actual = await this.driver
    .wait(
      until.elementLocated(locator),
      10000,
      `the ${target} is not located in the header.`
    )
    .isDisplayed()

  assert.ok(actual)
})

Then('the Navigation-Menu should be closed in the header', async function () {
  const locator = By.css('header .navbar-menu')

  const actual = await this.driver
    .wait(
      until.elementLocated(locator),
      10000,
      `the Navigation-Menu is not located in the header.`
    )
    .isDisplayed()

  assert.ok(actual === false)
})
