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

context('Recent and Favorites', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/');
    cy.get('.DocSearch-SearchButton').click();
    cy.get('.DocSearch-Input').type('get');
    // cy.get('body').type('{downArrow}{upArrow}');
    cy.get('.DocSearch-Hits #docsearch-item-0').click({ force: true });
  });

  it('Recent search is displayed after visiting a result', () => {
    cy.get('.DocSearch-SearchButton').click();
    cy.get('#docsearch-item-0').should('be.visible');
  });

  it('Recent searches can be favorited', () => {
    cy.get('.DocSearch-SearchButton').click();
    cy.contains('Recent').should('be.visible');
    cy.get('.DocSearch-Hit-action-button[title="Save this search"]').click();
    cy.get('body').type('{esc}');
    cy.get('.DocSearch-SearchButton').click();
    cy.contains('Favorites').should('be.visible');
    cy.get('#docsearch-item-0').should('be.visible');
  });

  it('Favorites can be deleted', () => {
      cy.get('.DocSearch-SearchButton').click();
      cy.contains('Recent').should('be.visible');
      cy.get('.DocSearch-Hit-action-button[title="Save this search"]').click();
      cy.get('body').type('{esc}');
      cy.get('.DocSearch-SearchButton').click();
      cy.contains('Favorites').should('be.visible');
      cy.get('#docsearch-item-0').should('be.visible');
      cy.get('.DocSearch-Hit-action-button[title="Remove this search from history"]').click();
      cy.contains('No recent searches').should('be.visible');
    });

});
