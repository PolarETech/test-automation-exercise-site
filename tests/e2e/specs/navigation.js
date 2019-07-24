describe('Navigation menu test', () => {
  context('desktop screen', () => {
    beforeEach(() => {
      cy.viewport(1920, 1080)
    })

    it('moves to Home view after selecting Top Logo in navigation menu', () => {
      cy.visit('/About')
      cy.get('#top-logo-link').click()
      cy.title().should('eq', 'Home | test automation exercise site')
    })

    it('moves to Home view after selecting "Home" in navigation menu', () => {
      cy.visit('/About')
      cy.contains('a', 'Home').click()
      cy.title().should('eq', 'Home | test automation exercise site')
    })

    it('moves to About view after selecting "About" in navigation menu', () => {
      cy.visit('/')
      cy.contains('a', 'About').click()
      cy.title().should('eq', 'About | test automation exercise site')
    })

    it('moves to Login view after selecting "Login" in navigation menu', () => {
      cy.visit('/')
      cy.contains('a', 'Login').click()
      cy.title().should('eq', 'Login | test automation exercise site')
    })

    it('moves to Home view after selecting "Logout" in navigation menu', () => {
      cy.setCookie('PtExampleToken', '{%22auth%22:{%22token%22:%22dummy-token%22}}')
      cy.visit('/')
      cy.contains('a', 'Logout').click()
      cy.title().should('eq', 'Home | test automation exercise site')
    })

    it('moves to Login view after selecting "TodoList" in navigation menu without logged in', () => {
      cy.visit('/')
      cy.contains('a', 'TodoList').click()
      cy.title().should('eq', 'Login | test automation exercise site')
    })

    it('moves to TodoList view after selecting "TodoList" in navigation menu with logged in', () => {
      cy.setCookie('PtExampleToken', '{%22auth%22:{%22token%22:%22dummy-token%22}}')
      cy.visit('/')
      cy.contains('a', 'TodoList').click()
      cy.title().should('eq', 'TodoList | test automation exercise site')
    })
  })

  context('mobile screen', () => {
    beforeEach(() => {
      cy.viewport(375, 667)
    })

    it('toggles expand navigation menu', () => {
      cy.visit('/')
      cy.get('.navbar-menu').should('not.be.visible')
      cy.get('.navbar-burger').click()
      cy.get('.navbar-menu').should('be.visible')
      cy.get('.navbar-burger').click()
      cy.get('.navbar-menu').should('not.be.visible')
    })

    it('moves to Home view after selecting Top Logo in navigation menu', () => {
      cy.visit('/About')
      cy.get('#top-logo-link').click()
      cy.title().should('eq', 'Home | test automation exercise site')
    })

    it('moves to About view after selecting "About" in navigation menu', () => {
      cy.visit('/')
      cy.get('.navbar-burger').click()
      cy.contains('a', 'About').click()
      cy.title().should('eq', 'About | test automation exercise site')
    })

    it('moves to Login view after selecting "Login" in navigation menu', () => {
      cy.visit('/')
      cy.get('.navbar-burger').click()
      cy.contains('a', 'Login').click()
      cy.title().should('eq', 'Login | test automation exercise site')
    })

    it('moves to Home view after selecting "Logout" in navigation menu', () => {
      cy.setCookie('PtExampleToken', '{%22auth%22:{%22token%22:%22dummy-token%22}}')
      cy.visit('/')
      cy.get('.navbar-burger').click()
      cy.contains('a', 'Logout').click()
      cy.title().should('eq', 'Home | test automation exercise site')
    })

    it('moves to Login view after selecting "TodoList" in navigation menu without logged in', () => {
      cy.visit('/')
      cy.get('.navbar-burger').click()
      cy.contains('a', 'TodoList').click()
      cy.title().should('eq', 'Login | test automation exercise site')
    })

    it('moves to TodoList view after selecting "TodoList" in navigation menu with logged in', () => {
      cy.setCookie('PtExampleToken', '{%22auth%22:{%22token%22:%22dummy-token%22}}')
      cy.visit('/')
      cy.get('.navbar-burger').click()
      cy.contains('a', 'TodoList').click()
      cy.title().should('eq', 'TodoList | test automation exercise site')
    })
  })
})
