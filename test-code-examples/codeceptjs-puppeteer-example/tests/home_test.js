Feature('Home view test.js @home @desktop')

Scenario('displays "Home" page', (I) => {
  I.amOnPage('/')
  I.seeTitleEquals('Home | test automation exercise site')
  I.seeElement({ css: 'header .navbar' })
  I.see('TEST\nAUTOMATION\nEXERCISE\nSITE', { css: 'h1' })
  I.see('このサイトについて - About', { css: '.link-buttons' })
  I.see('テストコンテンツ - TodoList', { css: '.link-buttons' })
  I.see('© 2019 Polar Tech', { css: 'footer' })
}).tag('@smoke')

Scenario('moves to About view after selecting "About" button', (I) => {
  I.amOnPage('/')
  I.click('このサイトについて - About', { css: '.link-buttons' })
  I.seeTitleEquals('About | test automation exercise site')
})

Scenario('moves to Login view after selecting "Todo" button without logged in', (I) => {
  I.amOnPage('/')
  I.click('テストコンテンツ - TodoList', { css: '.link-buttons' })
  I.seeTitleEquals('Login | test automation exercise site')
})

Scenario('moves to TodoList view after selecting "Todo" button with logged in', (I) => {
  I.setTokenCookie()
  I.amOnPage('/')
  I.click('テストコンテンツ - TodoList', { css: '.link-buttons' })
  I.seeTitleEquals('TodoList | test automation exercise site')
})
