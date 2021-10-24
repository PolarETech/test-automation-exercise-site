const assert = require('assert')

Feature('Login view test.js @login @desktop')

Scenario('displays "Login" page', ({ I }) => {
  I.amOnPage('/login')
  I.seeTitleEquals('Login | test automation exercise site')
  I.seeElement({ css: 'header .navbar' })
  I.see('ログイン', { css: 'h1' })
  I.seeElement({ css: '#user-id-input' })
  I.seeElement({ css: '#password-input' })
  I.see('ログイン', { css: 'button' })
  I.seeElementIsDisabled({ css: '#login-submit' })
  I.dontSeeElement({ css: '#require-message' })
  I.dontSeeElement({ css: '.error-message' })
  I.see('© 2019 Polar Tech', { css: 'footer' })
}).tag('@smoke')

Scenario('moves to TodoList view and sets auth token cookie after selecting "Login" button with correct ID and Password', async ({ I }) => {
  I.amOnPage('/login')
  I.fillField('ユーザーIDを入力してください', 'testID')
  I.fillField('パスワードを入力してください', 'testPASS')
  I.waitForEnabled({ css: '#login-submit' })
  I.click('ログイン', { css: 'button' })
  I.waitInUrl('/todo', 5)
  I.seeTitleEquals('TodoList | test automation exercise site')
  I.seeCookie('PtExampleToken')
  const cookie = await I.grabCookie('PtExampleToken')
  const cookieValue = JSON.parse(decodeURI(cookie.value))
  assert.equal(cookieValue.auth.token, 'dummy-token')
}).tag('@smoke')

Scenario('shows error message after selecting "Login" button with wrong ID and Password', ({ I }) => {
  I.amOnPage('/login')
  I.fillField('ユーザーIDを入力してください', 'foo')
  I.fillField('パスワードを入力してください', 'boo')
  I.pressKey('Enter')
  I.seeElement({ css: '#login-submit .p-button-loading-icon' })
  I.waitForInvisible({ css: '#login-submit .p-button-loading-icon' }, 5)
  I.seeTitleEquals('Login | test automation exercise site')
  I.see('ログインエラー\nユーザーIDまたはパスワードが違います', { css: '.error-message' })
})

Scenario('shows require log-in message if user accessed Login view by redirect', ({ I }) => {
  I.amOnPage('/todo')
  I.seeTitleEquals('Login | test automation exercise site')
  I.see('ログインが必要です', { css: '#require-message' })
})
