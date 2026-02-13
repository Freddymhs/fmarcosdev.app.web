describe('Main Navigation Flow', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('renders landing page', () => {
    cy.get('main').should('exist')
  })

  it('navigates to About page', () => {
    cy.contains('About').click()
    cy.url().should('include', '/about_me')
  })

  it('navigates to Projects page', () => {
    cy.contains('Projects').click()
    cy.url().should('include', '/projects')
  })

  it('navigates to Blog page', () => {
    cy.contains('Blog').click()
    cy.url().should('include', '/blog')
  })

  it('navigates to Certificates page', () => {
    cy.contains('Certificates').click()
    cy.url().should('include', '/certificates')
  })

  it('navigates to Social page', () => {
    cy.contains('Social').click()
    cy.url().should('include', '/social')
  })
})
