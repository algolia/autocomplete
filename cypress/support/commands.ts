import '@percy/cypress';

Cypress.Commands.add('darkmode', () => {
  cy.get('.aa-Input').type('/');
  cy.contains('Toggle dark mode').click({ force: true });
  cy.get('.aa-ResetButton').click();
});

Cypress.Commands.add('openPanel', () => {
  cy.get('.aa-Input').click();
});

Cypress.Commands.add('closePanel', () => {
  cy.get('body').type('{esc}');
});

Cypress.Commands.add('typeQueryMatching', () => {
  cy.wait(1000);
  cy.get('.aa-Input').type('get');
});

Cypress.Commands.add('typeQueryNotMatching', () => {
  cy.wait(1000);
  cy.get('.aa-Input').type('zzzzz');
});
