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
    openModal(): Chainable<Element>;
    /**
     * Closes the DocSearch modal.
     */
    closeModal(): Chainable<Element>;
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
