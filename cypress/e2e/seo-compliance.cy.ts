describe('SEO Compliance', () => {
  it('landing page has meta tags', () => {
    cy.visit('/')
    cy.get('meta[name="description"]').should('have.attr', 'content')
    cy.get('meta[property="og:title"]').should('exist')
    cy.get('meta[property="og:description"]').should('exist')
  })

  it('page has proper title tag', () => {
    cy.visit('/')
    cy.title().should('include', 'fmarcos')
  })

  it('all pages have meta descriptions', () => {
    const pages = ['/about_me', '/projects', '/blog']
    pages.forEach(page => {
      cy.visit(`/${page}`)
      cy.get('meta[name="description"]').should('have.attr', 'content')
    })
  })

  it('no 404 errors on page load', () => {
    cy.visit('/', {
      onBeforeLoad(win) {
        cy.spy(win.console, 'error').as('consoleError')
      }
    })
    cy.get('main').should('exist')
    cy.get('@consoleError').should('not.have.been.called')
  })

  it('links are accessible', () => {
    cy.visit('/')
    cy.get('a').each(link => {
      cy.wrap(link).should('have.attr', 'href')
    })
  })
})
