const { By } = require('selenium-webdriver')
const BasePage = require('./base_page.js')

module.exports = class AboutPage extends BasePage {
  constructor () {
    super()
    
    this.path = '/about'
  
    this.locators = {
    }

    this.text = {
      pageTitle: 'About | test automation exercise site',
      h1: 'このサイトについて',
      footer: '© 2019 Polar Tech',
    }
  }
}
