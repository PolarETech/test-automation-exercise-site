const { By, Key, until } = require('selenium-webdriver')
const BasePage = require('./base_page.js')
const dayjs = require('dayjs')

module.exports = class TodoListPage extends BasePage {
  constructor () {
    super()

    this.path = '/todo'

    this.locators = {
      'Todo-List': By.css('.todo-list'),
      'Todo-Subject': By.css('.todo-subject'),
      'Todo-Checkbox': By.css('.todo-check'),
      'Todo-Checkbox-Click-Area': By.css('.todo-check+label'),
      'Todo-Timestamp': By.css('.todo-timestamp'),
      'Todo-Drag-Button': By.css('.todo-drag'),
      'Todo-Remove-Button': By.css('.todo-remove'),
      'Subject-Input-Form': By.css('input#subject-input'),
      'Subject-Submit-Button': By.css('button#subject-submit'),
      'Item-Count': By.css('#item-count'),
      'Empty-Message': By.css('#empty-message'),
    }

    this.text = {
      pageTitle: 'TodoList | test automation exercise site',
      h1: 'ToDoリスト',
      footer: '© 2019 Polar Tech',
      emptyMessage: 'ToDoは登録されていません',
      initialCountMessage: '登録件数：0 / 5 件',
    }

    this.subjectVariation = [
      'ア１a!"\',./:;=?\\',
      'あA　ヲンヰヱ<a>ヴーヾ・',
      'ａ"＠ ｧｰｭ","ｿﾏﾞﾟ',
      'Ａ@&lt;(&copy;)',
      '亜ｱ\'&amp;㈱£𠀋表\'',
      '1<pre>🍺</pre>'
    ]
  }

  async inputNewSubject (inputText, world) {
    const locator = this.locators['Subject-Input-Form']
    await world.driver.findElement(locator)
      .sendKeys(inputText)
      .then(() => { return true })
      .catch(error => { throw error })
  }

  async updateTodoSubject (inputText, index, world) {
    if (inputText === '%%backspace%%') {
      inputText = Key.BACK_SPACE
    }

    const locator = this.locators['Todo-Subject']
    const elements = await world.driver.findElements(locator)

    await elements[index]
      .sendKeys(inputText, Key.RETURN)
      .then(() => { return true })
      .catch(error => { throw error })
  }

  async clearTodoSubject (index, world) {
    const locator = this.locators['Todo-Subject']
    const elements = await world.driver.findElements(locator)
    const element = await elements[index]
    const length = await element
      .getAttribute('value')
      .then(value => {
        return value.length
      })

    for (let i = 0; i < length; i++) {
      await element.sendKeys(Key.BACK_SPACE)
    }

    await element.sendKeys(Key.RETURN)
  }

  async registerSubject (world) {
    const locator = this.locators['Subject-Submit-Button']
    const element = await world.driver.findElement(locator)

    // NOTE: wait until the target status change from disabled to enabled
    await world.driver
    .wait(
      until.elementIsEnabled(element),
      10000,
      `the register button is not enabled in the TodoList view.`
    )
    .click()
  }

  async getSubjectValue (index, world) {
    const locator = this.locators['Todo-Subject']
    const elements = await world.driver.findElements(locator)
    return elements[index].getAttribute('value')
  }

  async getCheckboxStatus (index, world) {
    const locator = this.locators['Todo-Checkbox']
    const elements = await world.driver.findElements(locator)
    const statusText = await elements[index].getAttribute('checked')
    return statusText === 'true'
  }

  async getTimestampDateTimeValue (index, world) {
    const locator = this.locators['Todo-Timestamp']
    const elements = await world.driver.findElements(locator)
    let date = await elements[index].getAttribute('outerText')
    date = date.replace('確認日時：', '')
    return dayjs(date).format('YYYY/MM/DD HH:mm:ss')
  }

  async getItemCountText (world) {
    const locator = this.locators['Item-Count']
    return await world.driver.findElement(locator)
      .getAttribute('outerText')
  }

  async getTodoLocalStorage (world) {
    return await world.driver.executeScript(
      "return JSON.parse(localStorage.PtExampleTodos)"
    )
  }

  getCurrentDateTimeValue () {
    return dayjs(new Date()).format('YYYY/MM/DD HH:mm:ss')
  }

  storeOperationDateTimeToWorld (world) {
    // store the operation date and time to use for verification in subsequent steps
    world.tempValue = this.getCurrentDateTimeValue()
  }

  async simulateDragAndDrop (sourceElement, targetElement, world) {
    // NOTE:
    // webdriver's dragAndDrop action does not work for vuedraggable component

    await world.driver.executeScript(
      async args => {
        const targetRect = args.targetElement.getBoundingClientRect()
        const targetPositionX = (targetRect.left + targetRect.right) / 2
        const targetPositionY = (targetRect.top + targetRect.bottom) / 2

        const pointerDownEvent = new PointerEvent('pointerdown', {
          bubbles: true,
          cancelable: true,
        })

        const dragStartEvent = new DragEvent('dragstart', {
          bubbles: true,
        })

        const dragOverEvent = new DragEvent('dragover', {
          bubbles: true,
          clientX: targetPositionX,
          clientY: targetPositionY,
        })

        const dropEvent = new DragEvent('drop', {
          bubbles: true,
        })

        const sleep = msec => new Promise(resolve => setTimeout(resolve, msec))

        args.sourceElement.dispatchEvent(pointerDownEvent)
        args.sourceElement.dispatchEvent(dragStartEvent)
        await sleep(1)
        args.targetElement.dispatchEvent(dragOverEvent)
        args.targetElement.dispatchEvent(dropEvent)
      }, { sourceElement, targetElement }
    )
    .then(() => { return true })
    .catch(error => { throw error })
  }
}
