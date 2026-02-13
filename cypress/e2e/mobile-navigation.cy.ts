describe('Mobile Navigation', () => {
  beforeEach(() => {
    cy.viewport(375, 667)
    cy.visit('/')
  })

  it('renders on mobile viewport', () => {
    cy.get('main').should('exist')
  })

  it('hamburger menu visible on mobile', () => {
    cy.get('[data-testid="sidebar-toggle"]').should('be.visible')
  })

  it('sidebar toggles on mobile', () => {
    cy.get('[data-testid="sidebar-toggle"]').click()
    // Sidebar should appear or change state
    cy.get('nav').should('exist')
  })

  it('page is responsive', () => {
    cy.viewport(375, 667)
    cy.get('main').should('be.visible')
    cy.viewport('ipad')
    cy.get('main').should('be.visible')
  })
})
