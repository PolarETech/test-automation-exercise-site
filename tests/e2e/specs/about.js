describe('About view test', () => {
  beforeEach(() => {
    cy.visit('/about')
  })

  it('displays "About" page', () => {
    cy.title().should('eq', 'About | test automation exercise site')
    cy.get('header .navbar').should('be.visible')
    cy.get('h1').should('contain', 'このサイトについて')
    cy.get('nav li')
      .should('contain', 'テストコンテンツ')
      .should('contain', '動作環境')
      .should('contain', '著作権と免責事項')
      .should('contain', '技術情報')
    cy.contains('footer', '© 2019 Polar Tech').should('be.visible')
  })

  it('displays "Test Contents" tab', () => {
    cy.contains('nav li', 'テストコンテンツ').click()
    cy.get('h2')
      .should('contain', 'テストコンテンツの利用について')
      .should('contain', '利用上の注意')
      .should('contain', 'TodoList 機能概要')
  })

  it('displays "Environment" tab', () => {
    cy.contains('nav li', '動作環境').click()
    cy.get('h2')
      .should('contain', '動作環境')
  })

  it('displays "Copyright and Disclaimer" tab', () => {
    cy.contains('nav li', '著作権と免責事項').click()
    cy.get('h2')
      .should('contain', '著作権')
      .should('contain', '免責事項')
  })

  it('displays "Technical Information" tab', () => {
    cy.contains('nav li', '技術情報').click()
    cy.get('h2')
      .should('contain', 'ソースコードの公開について')
      .should('contain', '本サイトの作成で使用している主な技術要素')
  })
})
