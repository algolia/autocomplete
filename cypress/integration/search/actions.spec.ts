context('Start', () => {
  beforeEach(() => {
    cy.visit(Cypress.config().baseUrl!);
  });

  it('Open Panel on Search Input click', () => {
    cy.get('.aa-Input').click();
    cy.get('.aa-Panel').should('be.visible');
    cy.get('.aa-Input').should('be.focus');
    cy.percySnapshot('panel-opened');
  });
});

context('End', () => {
  beforeEach(() => {
    cy.visit(Cypress.config().baseUrl!);
    cy.get('.aa-Input').click();
  });

  it('Close Panel with Esc key', () => {
    cy.get('body').type('{esc}');
    cy.get('.aa-Panel').should('not.to.exist');
    cy.percySnapshot('panel-closed');
  });
});

context('Search', () => {
  beforeEach(() => {
    cy.visit(Cypress.config().baseUrl!);
    cy.get('.aa-Input').click();
  });

  it('Results are displayed after a Query', () => {
    cy.get('.aa-Input').type('apple');
    cy.get('.aa-SourceHeader').should('be.visible');
    cy.percySnapshot('search-results');
  });

  it('Query can be cleared', () => {
    cy.get('.aa-Input').type('apple');
    cy.get('.aa-ClearButton').click();
    cy.get('.aa-Input').should('be.empty');
  });

  it("No Results are displayed if query doesn't match", () => {
    cy.get('.aa-Input').type('zzzzz');
    cy.contains('No products for this query.').should('be.visible');
    cy.percySnapshot('no-results');
  });
});

context('Recent searches', () => {
  beforeEach(() => {
    cy.visit(Cypress.config().baseUrl!);
    cy.get('.aa-Input').click();
    cy.get('.aa-Input').type('apple');
    cy.get('.aa-Item').first().click({ force: true });
  });

  it('Recent search is displayed after visiting a result', () => {
    cy.get('.aa-Input').click();
    cy.get('.aa-Item')
      .first()
      .find('[title="Remove this search"]')
      .should('be.visible');
    cy.percySnapshot('recent-search');
  });

  it('Recent search can be deleted', () => {
    cy.get('.aa-Input').click();
    cy.get('.aa-Item')
      .first()
      .find('[title="Remove this search"]')
      .trigger('click');
    cy.get('.aa-Item')
      .first()
      .find('[title="Remove this search"]')
      .should('not.to.exist');
  });
});
