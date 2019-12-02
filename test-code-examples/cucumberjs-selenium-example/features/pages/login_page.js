const { By } = require('selenium-webdriver')
const BasePage = require('./base_page.js')

module.exports = class LoginPage extends BasePage {
  constructor () {
    super()

    this.path = '/login',

    this.locators = {
      'UserID-Input-Form': By.css('#user-id-input'),
      'Password-Input-Form': By.css('#password-input'),
      'Require-Login-Message': By.css('#require-message'),
      'Login-Error-Message': By.css('.error-message'),
      'Login-Button': By.xpath('//button[normalize-space(.)="ログイン"]')
    }

    this.text = {
      pageTitle: 'Login | test automation exercise site',
      h1: 'ログイン',
      footer: '© 2019 Polar Tech',
      errorMessage: 'ログインエラー\nユーザーIDまたはパスワードが違います',
      requireMessage: 'ログインが必要です',
    }

    this.users = {
      valid: {
        id: 'testID',
        password: 'testPASS',
      },
      invalid: {
        id: 'foo',
        password: 'boo',
      }
    },

    this.tokenCookie = {
      key: 'PtExampleToken',
      value: '{%22auth%22:{%22token%22:%22dummy-token%22}}',
    }
  }

  async getLoginTokenCookie (world) {
    const cookieValue = await world.driver
      .manage().getCookie(this.tokenCookie.key)
      .then(cookieData => cookieData.value)
      .catch(error => { throw error })

    return cookieValue
  }

  async setLoginTokenCookie (world) {
    await world.driver
      .get(`${world.baseURL}`)
      .catch(error => { throw error })

    await world.driver
      .manage().addCookie({
        name: this.tokenCookie.key,
        value: this.tokenCookie.value
      })

    // NOTE: apply added cookie by refresh
    await world.driver.navigate().refresh()
  }

  key2locator (key) {
    switch (key) {
      case 'id':
        return this.locators['UserID-Input-Form']
      case 'password':
        return this.locators['Password-Input-Form']
    }
  }
}
