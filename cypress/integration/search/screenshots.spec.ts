/// <reference path="../../support/commands.d.ts" />

describe('Screenshots', () => {
  before(() => {
    cy.exec('yarn cy:clean');
  });

  beforeEach(() => {
    cy.visit(Cypress.config().baseUrl!);
  });

  const sizes: Cypress.ViewportPreset[] = ['iphone-x', 'ipad-2', 'macbook-11'];
  const modes = ['light', 'dark'];

  modes.forEach((mode) => {
    context(mode, () => {
      sizes.forEach((size) => {
        context(size, () => {
          it('Open Panel', () => {
            if (mode === 'dark') {
              cy.darkmode();
            }
            cy.viewport(size);
            cy.openPanel();
            cy.screenshot('panel-opened__' + size + '__' + mode, {
              capture: 'viewport',
            });
          });

          it('Close Panel', () => {
            if (mode === 'dark') {
              cy.darkmode();
            }
            cy.viewport(size);
            cy.closePanel();
            cy.screenshot('panel-closed__' + size + '__' + mode, {
              capture: 'viewport',
            });
          });

          it('Results after Query', () => {
            if (mode === 'dark') {
              cy.darkmode();
            }
            cy.viewport(size);
            cy.openPanel();
            cy.typeQueryMatching();
            cy.screenshot('search-results__' + size + '__' + mode, {
              capture: 'viewport',
            });
          });

          it('No Results', () => {
            if (mode === 'dark') {
              cy.darkmode();
            }
            cy.viewport(size);
            cy.openPanel();
            cy.typeQueryNotMatching();
            cy.contains('No products for this query.').should('be.visible');
            cy.screenshot('no-results__' + size + '__' + mode, {
              capture: 'viewport',
            });
          });

          it('Recent searches', () => {
            if (mode === 'dark') {
              cy.darkmode();
            }
            cy.viewport(size);
            cy.openPanel();
            cy.typeQueryMatching();
            cy.get('.aa-Item').first().click({
              force: true,
            });
            cy.wait(1000);
            cy.openPanel();
            cy.get('.aa-Item')
              .first()
              .find('[title="Remove this search"]')
              .should('be.visible');
            cy.screenshot('recent-search__' + size + '__' + mode, {
              capture: 'viewport',
            });
          });
        });
      });
    });
  });
});
