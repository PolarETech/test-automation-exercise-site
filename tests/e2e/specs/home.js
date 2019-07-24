describe('Home view test', () => {
  it('displays "Home" page', () => {
    cy.visit('/')
    cy.title().should('eq', 'Home | test automation exercise site')
    cy.get('header .navbar').should('be.visible')
    cy.get('h1').should('contain', 'TEST AUTOMATION EXERCISE SITE')
    cy.contains('button', 'このサイトについて - About').should('be.visible')
    cy.contains('button', 'テストコンテンツ - TodoList').should('be.visible')
    cy.contains('footer', '© 2019 Polar Tech').should('be.visible')
  })

  it('moves to About view after selecting "About" button', () => {
    cy.visit('/')
    cy.contains('button', 'このサイトについて - About').click()
    cy.title().should('eq', 'About | test automation exercise site')
  })

  it('moves to Login view after selecting "Todo" button without logged in', () => {
    cy.visit('/')
    cy.contains('button', 'テストコンテンツ - TodoList').click()
    cy.title().should('eq', 'Login | test automation exercise site')
  })

  it('moves to TodoList view after selecting "Todo" button with logged in', () => {
    cy.setCookie('PtExampleToken', '{%22auth%22:{%22token%22:%22dummy-token%22}}')
    cy.visit('/')
    cy.contains('button', 'テストコンテンツ - TodoList').click()
    cy.title().should('eq', 'TodoList | test automation exercise site')
  })
})
