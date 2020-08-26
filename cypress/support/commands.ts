import '@percy/cypress';

Cypress.Commands.add('darkmode', () => {
  cy.get('.react-toggle').click({ force: true });
  cy.get('.react-toggle-screenreader-only').blur();
});

Cypress.Commands.add('openModal', () => {
  cy.get('.DocSearch-Button').click();
});

Cypress.Commands.add('closeModal', () => {
  cy.get('body').type('{esc}');
});

Cypress.Commands.add('typeQueryMatching', () => {
  cy.wait(1000);
  cy.get('.DocSearch-Input').type('get');
});

Cypress.Commands.add('typeQueryNotMatching', () => {
  cy.wait(1000);
  cy.get('.DocSearch-Input').type('zzzzz');
});
