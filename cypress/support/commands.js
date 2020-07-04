import '@percy/cypress';

Cypress.Commands.add('darkmode', () => {
  cy.get('.react-toggle').click({ force: true });
});

Cypress.Commands.add('viewportShot', (name) => {
  const sizes = ['iphone-x', 'ipad-2', 'macbook-11'];
  cy.percySnapshot(`${name}`);
  sizes.forEach((size) => {
    if (Cypress._.isArray(size)) {
      cy.viewport(size[0], size[1]);
    } else {
      cy.viewport(size);
    }
    cy.screenshot(`${name}__${size}`, { capture: 'viewport' });
  });
  cy.darkmode();
  cy.percySnapshot(`${name}__darkmode`);
  sizes.forEach((size) => {
    if (Cypress._.isArray(size)) {
      cy.viewport(size[0], size[1]);
    } else {
      cy.viewport(size);
    }
    cy.screenshot(`${name}__${size}__darkmode`, { capture: 'viewport' });
  });
});
