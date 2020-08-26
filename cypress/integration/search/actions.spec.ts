context('Start', () => {
  beforeEach(() => {
    cy.visit(Cypress.config().baseUrl!);
  });

  it('Open Modal on Search Button click', () => {
    cy.get('.DocSearch-Button').click();
    cy.get('.DocSearch-Modal').should('be.visible');
    cy.get('.DocSearch-Input').should('be.focus');
    cy.percySnapshot('modal-opened');
  });

  it('Open Modal with key shortcut on Windows/Linux', () => {
    cy.get('body').type('{ctrl}k');
    cy.get('.DocSearch-Modal').should('be.visible');
    cy.get('.DocSearch-Input').should('be.focus');
  });

  it('Open Modal with key shortcut on macOS', () => {
    cy.get('body').type('{meta}k');
    cy.get('.DocSearch-Modal').should('be.visible');
    cy.get('.DocSearch-Input').should('be.focus');
  });

  it('Open Modal with forward slash key shortcut', () => {
    cy.get('body').type('/');
    cy.get('.DocSearch-Modal').should('be.visible');
    cy.get('.DocSearch-Input').should('be.focus');
  });
});

context('End', () => {
  beforeEach(() => {
    cy.visit(Cypress.config().baseUrl!);
    cy.get('.DocSearch-Button').click();
  });

  it('Close Modal with Esc key', () => {
    cy.get('body').type('{esc}');
    cy.get('.DocSearch-Modal').should('not.be.visible');
    cy.percySnapshot('modal-closed');
  });

  it('Close Modal by clicking outside its container', () => {
    cy.get('.DocSearch-Container').click();
    cy.get('.DocSearch-Modal').should('not.be.visible');
  });

  it('Close Modal with key shortcut on Windows/Linux', () => {
    cy.get('body').type('{ctrl}k');
    cy.get('.DocSearch-Modal').should('not.be.visible');
  });

  it('Close Modal with key shortcut on macOS', () => {
    cy.get('body').type('{meta}k');
    cy.get('.DocSearch-Modal').should('not.be.visible');
  });
});

context('Search', () => {
  beforeEach(() => {
    cy.visit(Cypress.config().baseUrl!);
    cy.get('.DocSearch-Button').click();
  });

  it('Results are displayed after a Query', () => {
    cy.get('.DocSearch-Input').type('get');
    cy.get('.DocSearch-Hits').should('be.visible');
    cy.percySnapshot('search-results');
  });

  it('Query can be cleared', () => {
    cy.get('.DocSearch-Input').type('get');
    cy.get('.DocSearch-Reset').click();
    cy.get('.DocSearch-Hits').should('not.be.visible');
    cy.contains('No recent searches').should('be.visible');
  });

  it('Keyboard Navigation leads to result', () => {
    cy.get('.DocSearch-Input').type('get');
    cy.get('.DocSearch-Input').type('{downArrow}{downArrow}{upArrow}');
    cy.get('.DocSearch-Input').type('{enter}');
    cy.url().should('include', '/docs/getalgoliahits');
    cy.percySnapshot('result-page-anchor');
  });

  it('Pointer Navigation leads to result', () => {
    cy.get('.DocSearch-Input').type('get');
    cy.get('.DocSearch-Hits #docsearch-item-1 > a').click({ force: true });
    cy.url().should('include', '/docs/getalgoliahits');
  });

  it("No Results are displayed if query doesn't match", () => {
    cy.get('.DocSearch-Input').type('zzzzz');
    cy.contains('No results for "zzzzz"').should('be.visible');
    cy.percySnapshot('no-results');
  });
});

context('Recent and Favorites', () => {
  beforeEach(() => {
    cy.visit(Cypress.config().baseUrl!);
    cy.get('.DocSearch-Button').click();
    cy.get('.DocSearch-Input').type('get');
    cy.get('.DocSearch-Hits #docsearch-item-0 > a').click({ force: true });
  });

  it('Recent search is displayed after visiting a result', () => {
    cy.get('.DocSearch-Button').click();
    cy.contains('Recent').should('be.visible');
    cy.get('#docsearch-item-0').should('be.visible');
    cy.percySnapshot('recent-search');
  });

  it('Recent search can be deleted', () => {
    cy.get('.DocSearch-Button').click();
    cy.get('#docsearch-item-0')
      .find('[title="Remove this search from history"]')
      .trigger('click');
    cy.contains('No recent searches').should('be.visible');
  });

  it('Recent search can be favorited', () => {
    cy.get('.DocSearch-Button').click();
    cy.get('#docsearch-item-0')
      .find('[title="Save this search"]')
      .trigger('click');
    cy.contains('Favorites').should('be.visible');
    cy.get('#docsearch-item-0').should('be.visible');
    cy.percySnapshot('favorite');
  });

  it('Favorite can be deleted', () => {
    cy.get('.DocSearch-Button').click();
    cy.get('#docsearch-item-0')
      .find('[title="Save this search"]')
      .trigger('click');
    cy.wait(2000);
    cy.get('#docsearch-item-0')
      .find('[title="Remove this search from favorites"]')
      .trigger('click');
    cy.contains('No recent searches').should('be.visible');
  });
});
