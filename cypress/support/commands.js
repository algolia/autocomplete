import '@percy/cypress';

Cypress.Commands.add('darkmode', () => {
  cy.get('.react-toggle').click({ force: true });
});

Cypress.Commands.add('viewportShot', (name) => {
  const sizes = ['iphone-x', 'ipad-2', 'macbook-13', 'macbook-15'];
  sizes.forEach((size) => {
    if (Cypress._.isArray(size)) {
      cy.viewport(size[0], size[1]);
    } else {
      cy.viewport(size);
    }
    cy.percySnapshot(`${name}__${size}`);
    cy.screenshot(`${name}__${size}`, { capture: 'viewport' });
    cy.darkmode();
    cy.percySnapshot(`${name}__${size}__darkmode`);
    cy.screenshot(`${name}__${size}__darkmode`, { capture: 'viewport' });
  });
});
