describe('Login view test', () => {
  it('displays "Login" page', () => {
    cy.visit('/login')
    cy.title().should('eq', 'Login | test automation exercise site')
    cy.get('header .navbar').should('be.visible')
    cy.get('h1').should('contain', 'ログイン')
    cy.get('#user-id-input').should('be.visible')
    cy.get('#password-input').should('be.visible')
    cy.get('button').should('contain', 'ログイン')
    cy.contains('button', 'ログイン').should('be.disabled')
    cy.get('#require-message').should('not.be.visible')
    cy.get('.error-message').should('not.be.visible')
    cy.contains('footer', '© 2019 Polar Tech').should('be.visible')
  })

  it('moves to TodoList view and sets auth token cookie after selecting "Login" button with correct ID and Password', () => {
    cy.visit('/login')
    cy.get('input[type=text]').type('testID')
    cy.get('input[type=password]').type('testPASS')
    cy.contains('button', 'ログイン')
      .should('not.be.disabled')
      .click()
    cy.title().should('eq', 'TodoList | test automation exercise site')
    cy.getCookie('PtExampleToken')
      .should('exist')
      .and((cookieData) => {
        const cookieValue = JSON.parse(decodeURI(cookieData.value))
        expect(cookieValue.auth.token).to.eq('dummy-token')
      })
  })

  it('shows error message after selecting "Login" button with wrong ID and Password', () => {
    cy.visit('/login')
    cy.get('input[type=text]').type('foo')
    cy.get('input[type=password]').type('boo{enter}')
    cy.title().should('eq', 'Login | test automation exercise site')
    cy.get('.error-message')
      .should('be.visible')
      .and('contain', 'ログインエラーユーザーIDまたはパスワードが違います')
  })

  it('shows require log-in message if user accessed Login view by redirect', () => {
    cy.visit('/todo')
    cy.title().should('eq', 'Login | test automation exercise site')
    cy.get('#require-message')
      .should('be.visible')
      .and('contain', 'ログインが必要です')
  })
})
