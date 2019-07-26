describe('Navigation menu test', () => {
  context('desktop screen', () => {
    beforeEach(() => {
      cy.viewport(1920, 1080)
    })

    it('moves to Home view after selecting Top Logo in navigation menu', () => {
      cy.visit('/about')
      cy.get('#top-logo-link').click()
      cy.title().should('eq', 'Home | test automation exercise site')
    })

    it('moves to Home view after selecting "Home" in navigation menu', () => {
      cy.visit('/about')
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

    it('moves to Home view and unsets auth token cookie after selecting "Logout" in navigation menu', () => {
      cy.setTokenCookie()
      cy.visit('/')
      cy.contains('a', 'Logout').click()
      cy.title().should('eq', 'Home | test automation exercise site')
      cy.get('.toast')
        .should('be.visible')
        .should('contain', 'ログアウトしました')
      cy.getCookie('PtExampleToken')
        .should('exist')
        .and((cookieData) => {
          const cookieValue = JSON.parse(decodeURI(cookieData.value))
          expect(cookieValue.auth.token).to.eq('')
        })
    })

    it('moves to Login view after selecting "TodoList" in navigation menu without logged in', () => {
      cy.visit('/')
      cy.contains('a', 'TodoList').click()
      cy.title().should('eq', 'Login | test automation exercise site')
    })

    it('moves to TodoList view after selecting "TodoList" in navigation menu with logged in', () => {
      cy.setTokenCookie()
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
      cy.visit('/about')
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

    it('moves to Home view and unsets auth token cookie after selecting "Logout" in navigation menu', () => {
      cy.setTokenCookie()
      cy.visit('/')
      cy.get('.navbar-burger').click()
      cy.contains('a', 'Logout').click()
      cy.title().should('eq', 'Home | test automation exercise site')
      cy.get('.toast')
        .should('be.visible')
        .should('contain', 'ログアウトしました')
      cy.getCookie('PtExampleToken')
        .should('exist')
        .and((cookieData) => {
          const cookieValue = JSON.parse(decodeURI(cookieData.value))
          expect(cookieValue.auth.token).to.eq('')
        })
    })

    it('moves to Login view after selecting "TodoList" in navigation menu without logged in', () => {
      cy.visit('/')
      cy.get('.navbar-burger').click()
      cy.contains('a', 'TodoList').click()
      cy.title().should('eq', 'Login | test automation exercise site')
    })

    it('moves to TodoList view after selecting "TodoList" in navigation menu with logged in', () => {
      cy.setTokenCookie()
      cy.visit('/')
      cy.get('.navbar-burger').click()
      cy.contains('a', 'TodoList').click()
      cy.title().should('eq', 'TodoList | test automation exercise site')
    })

    it('closes navigation menu after moving page', () => {
      cy.visit('/')

      cy.get('.navbar-burger').click()
      cy.get('.navbar-menu').should('be.visible')
      cy.contains('button', 'このサイトについて - About').click()
      cy.title().should('eq', 'About | test automation exercise site')
      cy.get('.navbar-menu').should('not.be.visible')

      cy.get('.navbar-burger').click()
      cy.get('.navbar-menu').should('be.visible')
      cy.contains('a', 'Home').click()
      cy.get('.navbar-menu').should('not.be.visible')
      cy.title().should('eq', 'Home | test automation exercise site')
    })
  })
})
