Feature('Navigation menu with mobile screen test.js @navigation @mobile')

Before(({ I }) => {
  I.resizeWindow(768, 600)
})

Scenario('toggles expand navigation menu', ({ I }) => {
  I.amOnPage('/')
  I.dontSeeElement({ css: '.navbar-menu' })
  I.click({ css: '.navbar-burger' })
  I.seeElement({ css: '.navbar-menu' })
  I.click({ css: '.navbar-burger' })
  I.dontSeeElement({ css: '.navbar-menu' })
})

Scenario('moves to Home view after selecting Top Logo in navigation menu', ({ I }) => {
  I.amOnPage('/about')
  I.click({ css: '#top-logo-link' })
  I.seeTitleEquals('Home | test automation exercise site')
})

Scenario('moves to Home view after selecting "Home" in navigation menu', ({ I }) => {
  I.amOnPage('/about')
  I.click({ css: '.navbar-burger' })
  I.click('Home', { css: '.navbar-menu' })
  I.seeTitleEquals('Home | test automation exercise site')
})

Scenario('moves to About view after selecting "About" in navigation menu', ({ I }) => {
  I.amOnPage('/')
  I.click({ css: '.navbar-burger' })
  I.click('About', { css: '.navbar-menu' })
  I.seeTitleEquals('About | test automation exercise site')
})

Scenario('moves to Login view after selecting "Login" in navigation menu', ({ I }) => {
  I.amOnPage('/')
  I.click({ css: '.navbar-burger' })
  I.click('Login', { css: '.navbar-menu' })
  I.seeTitleEquals('Login | test automation exercise site')
})

Scenario('moves to Home view and unsets auth token cookie after selecting "Logout" in navigation menu', async ({ I }) => {
  I.setTokenCookie()
  I.amOnPage('/')
  I.click({ css: '.navbar-burger' })
  I.click('Logout', { css: '.navbar-menu' })
  I.seeTitleEquals('Home | test automation exercise site')
  I.see('ログアウトしました', { css: '.toast' })
  // the Buefy toast should disappear after 2000ms
  I.waitForDetached({ css: '.toast' }, 3)
  I.seeCookie('PtExampleToken')
  const cookie = await I.grabCookie('PtExampleToken')
  const cookieValue = JSON.parse(decodeURI(cookie.value))
  I.seeEqual(cookieValue.auth.token, '')
}).tag('@login')

Scenario('moves to Login view after selecting "TodoList" in navigation menu without logged in', ({ I }) => {
  I.amOnPage('/')
  I.click({ css: '.navbar-burger' })
  I.click('TodoList', { css: '.navbar-menu' })
  I.seeTitleEquals('Login | test automation exercise site')
})

Scenario('moves to TodoList view after selecting "TodoList" in navigation menu with logged in', async ({ I }) => {
  I.setTokenCookie()
  I.amOnPage('/')
  I.click({ css: '.navbar-burger' })
  I.click('TodoList', { css: '.navbar-menu' })
  I.seeTitleEquals('TodoList | test automation exercise site')
})

Scenario('closes navigation menu after moving page', ({ I }) => {
  I.amOnPage('/')

  I.click({ css: '.navbar-burger' })
  I.seeElement({ css: '.navbar-menu' })
  I.click('このサイトについて - About', { css: '.link-buttons' })
  I.seeTitleEquals('About | test automation exercise site')
  I.dontSeeElement({ css: '.navbar-menu' })

  I.click({ css: '.navbar-burger' })
  I.seeElement({ css: '.navbar-menu' })
  I.click('Home', { css: '.navbar-menu' })
  I.seeTitleEquals('Home | test automation exercise site')
  I.dontSeeElement({ css: '.navbar-menu' })
}).tag('@smoke')
