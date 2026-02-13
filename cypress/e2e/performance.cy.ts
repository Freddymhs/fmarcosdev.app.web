describe('Performance & Loading', () => {
  it('page loads quickly', () => {
    const start = performance.now()
    cy.visit('/')
    cy.get('main').should('exist').then(() => {
      const loadTime = performance.now() - start
      expect(loadTime).to.be.lessThan(3000) // 3 seconds
    })
  })

  it('no console errors on navigation', () => {
    cy.visit('/', {
      onBeforeLoad(win) {
        cy.spy(win.console, 'error').as('consoleError')
      }
    })
    cy.get('main').should('exist')
    cy.contains('Projects').click()
    cy.get('main').should('exist')
    cy.get('@consoleError').should('not.have.been.called')
  })

  it('images load properly', () => {
    cy.visit('/')
    cy.get('img').each(img => {
      cy.wrap(img).should('have.prop', 'naturalHeight').and('be.greaterThan', 0)
    })
  })

  it('main content renders without errors', () => {
    cy.visit('/')
    cy.get('main').should('be.visible')
    cy.get('main').should('not.be.empty')
  })
})
