const { By } = require('selenium-webdriver')
const BasePage = require('./base_page.js')

module.exports = class TodoListPage extends BasePage {
  constructor () {
    super()
    
    this.path = '/todo'
  
    this.locators = {
    }

    this.text = {
      pageTitle: 'TodoList | test automation exercise site',
      h1: 'ToDoリスト',
      footer: '© 2019 Polar Tech',
    }
  }
}
