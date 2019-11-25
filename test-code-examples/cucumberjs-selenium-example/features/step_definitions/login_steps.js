const { until } = require('selenium-webdriver')
const { Given, When, Then } = require('cucumber')
const { createPageObject } = require('../support/helpers.js')
const assert = require('assert')

Given('I am already logged in', async function () {
  const page = createPageObject('Login')
  await page.setLoginTokenCookie(this)
})

When('I input the {word} user {word} in the Login view', async function (userStatus, key) {
  // Step example:
  // I input the valid user id in the Login view

  const page = createPageObject('Login')

  // get the login user data
  let value = null
  try {
    value = page.users[userStatus][key]
  } catch (error) {
    throw new Error(`an unexpected user status "${userStatus}" is given by scenario.`)
  }

  if (value === undefined) {
    throw new Error(`an unexpected key "${key}" is given by scenario.`)
  }

  const locator = page.key2locator(key)
  await this.driver
  .wait(
    until.elementLocated(locator),
    10000,
    `the ${key} input form is not located in the Login view.`
  )
  .sendKeys(value)
})

Then('the login token cookie should be stored correctly', async function () {
  const page = createPageObject('Login')
  const actual = await page.getLoginTokenCookie(this)
  const expected = page.tokenCookie.value
  assert.strictEqual(actual, expected)
})

Then('the login token cookie should be empty', async function () {
  const page = createPageObject('Login')
  const rowTokenCookieValue = await page.getLoginTokenCookie(this)
  const tokenCookieValue = JSON.parse(decodeURI(rowTokenCookieValue))
  assert.strictEqual(tokenCookieValue.auth.token, '')
})
