const { Key } = require('selenium-webdriver')
const { When, Then } = require('cucumber')
const { createPageObject } = require('../support/helpers.js')
const assert = require('assert')

When('I wait {int} ms to advance timestamp', async function (waitTime) {
  await this.driver.sleep(waitTime)
})

When('I input {string} in the Subject-Input-Form in the TodoList view', async function (inputText) {
  // Step example:
  // I input 'テストアイテム' in the Subject-Input-Form in the TodoList view

  const page = createPageObject('TodoList')
  await page.inputNewSubject(inputText, this)
})

When('I input the subject variation No. {int} in the Subject-Input-Form in the TodoList view', async function (variationIndex) {
  // Step example:
  // I input the subject variation No. 1 in the Subject-Input-Form in the TodoList view

  const page = createPageObject('TodoList')
  const inputText = page.subjectVariation[variationIndex - 1]
  const locator = page.getTargetLocator('Subject-Input-Form')
  const element = await this.driver.findElement(locator)

  // NOTE: sendKeys function can not input utf8mb4 character like 𠀋🍺
  await this.driver.executeScript(
    function(args) {
      args.element.value = args.inputText
    }, { element, inputText })
    .catch(error => { throw error })

  // NOTE: refrect value string to view
  await element.sendKeys('_', Key.BACK_SPACE)
})

When('I input {string} in the {word} Todo-Subject in the TodoList view', async function (inputText, itemIndex) {
  // Step example:
  // I input '２' the 1st Todo-Subject in the TodoList view
  // I input '%%backspace%%' the 2nd Todo-Subject in the TodoList view

  const page = createPageObject('TodoList')
  const index = page.numberText2index(itemIndex)
  await page.updateTodoSubject(inputText, index, this)
})

When('I clear the {word} Todo-Subject in the TodoList view', async function (itemIndex) {
  // Step example:
  // I clear the 1st Todo-Subject in the TodoList view

  const page = createPageObject('TodoList')
  const index = page.numberText2index(itemIndex)
  await page.clearTodoSubject(index, this)
})

When ('I register the todo in the TodoList view', async function () {
  const page = createPageObject('TodoList')
  await page.registerSubject(this)

  // WARNING:
  // In rare cases, the test about timestamp may fail due to a second difference 
  // between the timestamp stored in Vuex and 
  // the timestamp obtained by the following function.
  page.storeOperationDateTimeToWorld(this)
})

When('I click the {word} {word} in the TodoList view', async function (itemIndex, target) {
  // Step example:
  // I click the 1st Todo-Checkbox-Click-Area in the TodoList view

  const page = createPageObject('TodoList')
  const locator = page.getTargetLocator(target)
  const index = page.numberText2index(itemIndex)
  const elements = await this.driver.findElements(locator)
  elements[index].click()

  // WARNING:
  // In rare cases, the test about timestamp may fail due to a second difference 
  // between the timestamp stored in Vuex and 
  // the timestamp obtained by the following function.
  if (target === 'Todo-Checkbox-Click-Area') {
    page.storeOperationDateTimeToWorld(this)
  }
})

When('I drag and drop the {word} {word} onto the {word} {word}', async function (fromItemIndex, fromTarget, ontoItemIndex, ontoTarget) {
  // Step example:
  // I drag and drop the 1st Todo-Drag-Icon onto the 2nd Todo-Drag-Icon

  const page = createPageObject('TodoList')

  let locator = null
  let elements = null
  let index = null

  // define the element to drag
  locator = page.getTargetLocator(fromTarget)
  elements = await this.driver.findElements(locator)
  index = page.numberText2index(fromItemIndex)
  const sourceElement = await elements[index]

  // define the element to drop
  locator = page.getTargetLocator(ontoTarget)
  elements = await this.driver.findElements(locator)
  index = page.numberText2index(ontoItemIndex)
  const targetElement = await elements[index]

  await page.simulateDragAndDrop(sourceElement, targetElement, this)
})

Then('the {word} Todo-Subject should have the text {string} in the TodoList view', async function (itemIndex, subjectText) {
  // Step example:
  // I the 1st Todo-Subject should have the text 'テストアイテム' in the TodoList view

  const page = createPageObject('TodoList')
  const index = page.numberText2index(itemIndex)
  const actual = await page.getSubjectValue(index, this)
  const expected = subjectText

  assert.strictEqual(actual, expected)
})

Then('the 1st Todo-Subject should have the text of subject variation No. {int} in the TodoList view', async function (variationIndex) {
  // Step example:
  // the 1st Todo-Subject should have the text of subject variation No. 1 in the TodoList view'

  const page = createPageObject('TodoList')
  const actual = await page.getSubjectValue(0, this)
  const expected = page.subjectVariation[variationIndex - 1]

  assert.strictEqual(actual, expected)
})

Then('the {word} Todo-Checkbox should be checked in the TodoList view', async function (itemIndex) {
  // Step example:
  // the 1st Todo-Checkbox should be checked in the TodoList view

  const page = createPageObject('TodoList')
  const index = page.numberText2index(itemIndex)
  const actual = await page.getCheckboxStatus(index, this)

  assert.ok(actual)
})

Then('the {word} Todo-Checkbox should NOT be checked in the TodoList view', async function (itemIndex) {
  // Step example:
  // the 1st Todo-Checkbox should NOT be checked in the TodoList view

  const page = createPageObject('TodoList')
  const index = page.numberText2index(itemIndex)
  const actual = await page.getCheckboxStatus(index, this)

  assert.ok(actual === false)
})

Then('the {word} Todo-Timestamp should contain the {word} date and time in the TodoList view', async function (itemIndex, _) {
  // Step example:
  // the 1st Todo-Timestamp should include the registration date and time in the TodoList view

  const page = createPageObject('TodoList')
  const index = page.numberText2index(itemIndex)
  const actual = await page.getTimestampDateTimeValue(index, this)
  const expected = this.tempValue  // the date and time when todo item was registered

  assert.strictEqual(actual, expected)
})

Then('the Item-Count should have the text {string} in the TodoList view', async function (itemCountText) {
  // Step example:
  // the Item-Count should have the text '登録件数：1 / 5 件' in the TodoList view

  const page = createPageObject('TodoList')
  const actual = await page.getItemCountText(this)
  const expected = itemCountText

  assert.strictEqual(actual, expected)
})

Then('the {word} {string} data in the Todo storage items should match the data on the view', async function (itemIndex, targetData) {
  // Step example:
  // the 1st 'subject' data in the Todo storage items should match the data on the view

  const page = createPageObject('TodoList')
  const index = page.numberText2index(itemIndex)
  const storageData = await page.getTodoLocalStorage(this)
  const actual = storageData.todo.items[index][targetData]
  let expected = null

  // obtain the data on the view
  switch (targetData) {
    case 'subject':
      expected = await page.getSubjectValue(index, this)
      break
    case 'isDone':
      expected = await page.getCheckboxStatus(index, this)
      break
    case 'timestamp':
      expected = await page.getTimestampDateTimeValue(index, this)
      break
    default:
      throw new Error(`an unexpected key "${targetData}" is given by scenario.`)
  }

  assert.strictEqual(actual, expected)
})

Then('the the Todo storage items should be empty', async function () {
  const page = createPageObject('TodoList')
  const storageData = await page.getTodoLocalStorage(this)
  const actual = storageData.todo.items.length
  
  assert.strictEqual(actual, 0)
})
