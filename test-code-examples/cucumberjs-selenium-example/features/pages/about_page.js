const { By, until } = require('selenium-webdriver')
const BasePage = require('./base_page.js')

module.exports = class AboutPage extends BasePage {
  constructor () {
    super()

    this.path = '/about'

    this.locators = {
      'About-Tab': By.css('ul.p-tabview-nav li[role = "presentation"]'),
      'Tab-Content-Transitioning': By.css('section.tab-content.is-transitioning'),
      'Tab-Items': By.css('.p-tabview-panel'),
      'Tab-Item-Headers': By.css('h2'),
    }

    this.text = {
      pageTitle: 'About | test automation exercise site',
      h1: 'このサイトについて',
      footer: '© 2019 Polar Tech',
    }

    this.tabs = [
      {
        label: 'テストコンテンツ',
        headers: [
          'テストコンテンツの利用について',
          '利用上の注意',
          'TodoList 機能概要'
        ]
      }, {
        label: '動作環境',
        headers: [
          '動作環境'
        ]
      }, {
        label: '著作権と免責事項',
        headers: [
          '著作権',
          '免責事項'
        ]
      }, {
        label: '技術情報',
        headers: [
          'ソースコードの公開について',
          '本サイトの作成で使用している主な技術要素'
        ]
      }
    ]
  }

  // NOTE:
  // Buefy has the tab transition state,
  // but PrimeVue does not have the state at v3.8.0.
  async waitTabTransition (world) {
    const locator = this.getTargetLocator('Tab-Content-Transitioning')

    // wait until tab content transition starts
    const element = await world.driver
      .wait(
        until.elementLocated(locator),
        2000,
      )
      .catch(error => { return true })

    // wait until the end of tab content transition
    await world.driver
      .wait(
        until.stalenessOf(element),
        2000,
      )
      .catch(error => { return true })
  }
}
