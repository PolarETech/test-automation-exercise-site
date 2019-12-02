const { By } = require('selenium-webdriver')
const BasePage = require('./base_page.js')

module.exports = class HomePage extends BasePage {
  constructor () {
    super()

    this.path = '/'

    this.locators = {
      'About-Button': By.xpath('//button[normalize-space(.)="このサイトについて - About"]'),
      'TodoList-Button': By.xpath('//button[normalize-space(.)="テストコンテンツ - TodoList"]'),
    }

    this.text = {
      pageTitle: 'Home | test automation exercise site',
      h1: 'TEST\nAUTOMATION\nEXERCISE\nSITE',
      footer: '© 2019 Polar Tech',
    }
  }
}
