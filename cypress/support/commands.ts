import '@percy/cypress';

Cypress.Commands.add('darkmode', () => {
  cy.openPanel();
  cy.get('.aa-Input').type('/');
  cy.contains('Toggle dark mode').click({ force: true });
  cy.get('.aa-ClearButton').click();
});

Cypress.Commands.add('openPanel', () => {
  cy.get('body')
    .then((body) => {
      const input = body.find('.aa-Input').length;
      return input ? '.aa-Input' : '.aa-DetachedSearchButton';
    })
    .then((selector) => {
      cy.get(selector).click();
    });
});

Cypress.Commands.add('closePanel', () => {
  cy.get('body').type('{esc}');
});

Cypress.Commands.add('typeQueryMatching', () => {
  cy.wait(1000);
  cy.openPanel();
  cy.get('.aa-Input').type('apple');
});

Cypress.Commands.add('typeQueryNotMatching', () => {
  cy.wait(1000);
  cy.openPanel();
  cy.get('.aa-Input').type('zzzzz');
});
