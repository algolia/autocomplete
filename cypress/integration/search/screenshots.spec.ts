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
          it('Open Modal', () => {
            if (mode === 'dark') {
              cy.darkmode();
            }
            cy.viewport(size);
            cy.openModal();
            cy.screenshot('modal-opened__' + size + '__' + mode, {
              capture: 'viewport',
            });
          });

          it('Close Modal', () => {
            if (mode === 'dark') {
              cy.darkmode();
            }
            cy.viewport(size);
            cy.closeModal();
            cy.screenshot('modal-closed__' + size + '__' + mode, {
              capture: 'viewport',
            });
          });

          it('Results after Query', () => {
            if (mode === 'dark') {
              cy.darkmode();
            }
            cy.viewport(size);
            cy.openModal();
            cy.typeQueryMatching();
            cy.screenshot('search-results__' + size + '__' + mode, {
              capture: 'viewport',
            });
          });

          it('Anchored result page', () => {
            cy.viewport(size);
            cy.openModal();
            cy.typeQueryMatching();
            cy.get('.DocSearch-Input').type('{downArrow}{downArrow}{upArrow}');
            cy.get('.DocSearch-Input').type('{enter}');
            cy.url().should('include', '/docs/getalgoliahits');
            cy.screenshot('result-page-anchor__' + size + '__' + mode, {
              capture: 'viewport',
            });
          });

          it('No Results', () => {
            if (mode === 'dark') {
              cy.darkmode();
            }
            cy.viewport(size);
            cy.openModal();
            cy.typeQueryNotMatching();
            cy.contains('No results for "zzzzz"').should('be.visible');
            cy.screenshot('no-results__' + size + '__' + mode, {
              capture: 'viewport',
            });
          });

          it('Recent searches', () => {
            if (mode === 'dark') {
              cy.darkmode();
            }
            cy.viewport(size);
            cy.openModal();
            cy.typeQueryMatching();
            cy.get('.DocSearch-Hits #docsearch-item-0 > a').click({
              force: true,
            });
            cy.wait(1000);
            cy.openModal();
            cy.contains('Recent').should('be.visible');
            cy.get('#docsearch-item-0').should('be.visible');
            cy.screenshot('recent-search__' + size + '__' + mode, {
              capture: 'viewport',
            });
          });

          it('Favorites', () => {
            if (mode === 'dark') {
              cy.darkmode();
            }
            cy.viewport(size);
            cy.openModal();
            cy.typeQueryMatching();
            cy.get('.DocSearch-Hits #docsearch-item-0 > a').click({
              force: true,
            });
            cy.wait(1000);
            cy.openModal();
            cy.get('#docsearch-item-0')
              .find('[title="Save this search"]')
              .trigger('click');
            cy.wait(1000);
            cy.contains('Favorites').should('be.visible');
            cy.get('#docsearch-item-0').should('be.visible');
            cy.screenshot('favorite__' + size + '__' + mode, {
              capture: 'viewport',
            });
          });
        });
      });
    });
  });
});
