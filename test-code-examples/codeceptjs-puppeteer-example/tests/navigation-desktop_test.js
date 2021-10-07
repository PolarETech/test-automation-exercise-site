Feature('Navigation menu with desktop screen test.js @navigation @desktop')

Before(({ I }) => {
  I.resizeWindow(769, 600)
})

Scenario('moves to Home view after selecting Top Logo in navigation menu', ({ I }) => {
  I.amOnPage('/about')
  I.click({ css: '#top-logo-link' })
  I.seeTitleEquals('Home | test automation exercise site')
})

Scenario('moves to Home view after selecting "Home" in navigation menu', ({ I }) => {
  I.amOnPage('/about')
  I.click('Home', { css: '.navbar-menu' })
  I.seeTitleEquals('Home | test automation exercise site')
})

Scenario('moves to About view after selecting "About" in navigation menu', ({ I }) => {
  I.amOnPage('/')
  I.click('About', { css: '.navbar-menu' })
  I.seeTitleEquals('About | test automation exercise site')
})

Scenario('moves to Login view after selecting "Login" in navigation menu', ({ I }) => {
  I.amOnPage('/')
  I.click('Login', { css: '.navbar-menu' })
  I.seeTitleEquals('Login | test automation exercise site')
})

Scenario('moves to Home view and unsets auth token cookie after selecting "Logout" in navigation menu', async ({ I }) => {
  I.setTokenCookie()
  I.amOnPage('/')
  I.click('Logout', { css: '.navbar-menu' })
  I.seeTitleEquals('Home | test automation exercise site')
  I.see('ログアウトしました', { css: '.p-toast-message' })
  // the PrimeVue toast should disappear after 2000ms
  I.waitForDetached({ css: '.p-toast-message' }, 3)
  I.seeCookie('PtExampleToken')
  const cookie = await I.grabCookie('PtExampleToken')
  const cookieValue = JSON.parse(decodeURI(cookie.value))
  I.seeEqual(cookieValue.auth.token, '')
}).tag('@smoke').tag('@login')

Scenario('moves to Login view after selecting "TodoList" in navigation menu without logged in', ({ I }) => {
  I.amOnPage('/')
  I.click('TodoList', { css: '.navbar-menu' })
  I.seeTitleEquals('Login | test automation exercise site')
})

Scenario('moves to TodoList view after selecting "TodoList" in navigation menu with logged in', async ({ I }) => {
  I.setTokenCookie()
  I.amOnPage('/')
  I.click('TodoList', { css: '.navbar-menu' })
  I.seeTitleEquals('TodoList | test automation exercise site')
})
