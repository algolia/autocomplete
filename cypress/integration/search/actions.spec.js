context('Start', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/');
  });

  it('Open Modal on Search Button click', () => {
    cy.get('.DocSearch-SearchButton').click();
    cy.get('.DocSearch-Modal').should('be.visible');
    cy.get('.DocSearch-Input').should('be.focus');
  });

  it('Open Modal with key shortcut on non macOS', () => {
    cy.get('body').type('{ctrl}k');
    cy.get('.DocSearch-Modal').should('be.visible');
    cy.get('.DocSearch-Input').should('be.focus');
  });

  it('Open Modal with key shortcut on macOS', () => {
    cy.get('body').type('{meta}k');
    cy.get('.DocSearch-Modal').should('be.visible');
    cy.get('.DocSearch-Input').should('be.focus');
  });
});

context('End', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/');
    cy.get('.DocSearch-SearchButton').click();
  });

  it('Close Modal with Esc key', () => {
    cy.get('body').type('{esc}');
    cy.get('.DocSearch-Modal').should('not.be.visible');
  });

  it('Close Modal by clicking outside its container', () => {
    cy.get('.DocSearch-Container').click();
    cy.get('.DocSearch-Modal').should('not.be.visible');
  });

  it('Close Modal with key shortcut on non macOS', () => {
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
    cy.visit('http://localhost:3000/');
    cy.get('.DocSearch-SearchButton').click();
  });

  it('Results are displayed after a Query', () => {
    cy.get('.DocSearch-Input').type('get');
    cy.get('.DocSearch-Hits').should('be.visible');
  });

});
