context('Start', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/');
  });

  it('Open Modal on Search Button click', () => {
    cy.get('.DocSearch-SearchButton').click();
    cy.get('.DocSearch-Modal').should('be.visible');
    cy.get('.DocSearch-Input').should('be.focus');
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
    cy.get('.DocSearch-Hits #docsearch-item-0').click({ force: true });
  });

  it('Recent search is displayed after visiting a result', () => {
    cy.get('.DocSearch-SearchButton').click();
    cy.contains('Recent').should('be.visible');
    cy.get('#docsearch-item-0').should('be.visible');
  });

  it('Recent search can be deleted', () => {
    cy.get('.DocSearch-SearchButton').click();
    cy.get('#docsearch-item-0').find('[data-cy=remove-recent]').trigger('click');
    cy.contains('No recent searches').should('be.visible');
  });

  it('Recent search can be favorited', () => {
    cy.get('.DocSearch-SearchButton').click();
    cy.get('#docsearch-item-0').find('[data-cy=fav-recent]').trigger('click');
    cy.contains('Favorites').should('be.visible');
    cy.get('#docsearch-item-0').should('be.visible');
  });

  it('Favorite can be deleted', () => {
    cy.get('.DocSearch-SearchButton').click();
    cy.get('#docsearch-item-0').find('[data-cy=fav-recent]').trigger('click');
    cy.wait(2000);
    cy.get('#docsearch-item-0').find('[data-cy=remove-fav]').trigger('click');
    cy.contains('No recent searches').should('be.visible');
  });
});
