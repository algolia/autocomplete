/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    /**
     * Toggles the dark mode on the preview website.
     */
    darkmode(): Chainable<Element>;
    /**
     * Opens the DocSearch modal.
     */
    openPanel(): Chainable<Element>;
    /**
     * Closes the DocSearch modal.
     */
    closePanel(): Chainable<Element>;
    /**
     * Types a query that returns results.
     */
    typeQueryMatching(): Chainable<Element>;
    /**
     * Types a query that returns no results.
     */
    typeQueryNotMatching(): Chainable<Element>;
  }
}
