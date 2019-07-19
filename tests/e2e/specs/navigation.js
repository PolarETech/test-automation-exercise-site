describe('Navigation menu test', () => {
  it('Move to Home view after selecting "Home" menu in navigation', () => {
    cy.visit('/About')
    cy.contains('a', 'Home').click()
    cy.title().should('eq', 'Home | test automation exercise site')
  })

  it('Move to About view after selecting "About" menu in navigation', () => {
    cy.visit('/')
    cy.contains('a', 'About').click()
    cy.title().should('eq', 'About | test automation exercise site')
  })

  it('Move to Login view after selecting "Login" menu in navigation', () => {
    cy.visit('/')
    cy.contains('a', 'Login').click()
    cy.title().should('eq', 'Login | test automation exercise site')
  })

  it('Move to Home view after selecting "Logout" menu in navigation', () => {
    cy.visit('/login')
    cy.get('input[type=text]').type('testID')
    cy.get('input[type=password]').type('testPASS')
    cy.get('button[type=submit]').click()
    cy.title().should('eq', 'TodoList | test automation exercise site')
    cy.contains('a', 'Logout').click()
    cy.title().should('eq', 'Home | test automation exercise site')
  })

  it('Move to Login view after selecting "TodoList" menu in navigation without logged-in', () => {
    cy.visit('/')
    cy.contains('a', 'TodoList').click()
    cy.title().should('eq', 'Login | test automation exercise site')
  })

  it('Move to TodoList view after selecting "TodoList" menu in navigation with logged-in', () => {
    cy.visit('/login')
    cy.get('input[type=text]').type('testID')
    cy.get('input[type=password]').type('testPASS')
    cy.get('button[type=submit]').click()
    cy.title().should('eq', 'TodoList | test automation exercise site')
    cy.contains('a', 'Home').click()
    cy.title().should('eq', 'Home | test automation exercise site')
    cy.contains('a', 'TodoList').click()
    cy.title().should('eq', 'TodoList | test automation exercise site')
    cy.contains('a', 'Logout').click()
  })
})
