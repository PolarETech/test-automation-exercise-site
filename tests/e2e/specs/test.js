// https://docs.cypress.io/api/introduction/api.html

describe('Home view test', () => {
  it('Visits the app root url', () => {
    cy.visit('/')
    cy.title().should('eq', 'Home | test automation exercise site')
  })
})
