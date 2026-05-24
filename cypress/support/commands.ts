declare global {
  namespace Cypress {
    interface Chainable {
      sendMessage(message: string): Chainable<void>;
      waitForResponse(): Chainable<void>;
    }
  }
}

Cypress.Commands.add("sendMessage", (message: string) => {
  cy.get("textarea").type(message);
  cy.get('button[type="submit"]').click();
});

Cypress.Commands.add("waitForResponse", () => {
  cy.get('[class*="animate-bounce"]', { timeout: 5000 }).should("not.exist");
  cy.get("textarea").should("not.be.disabled");
});

export {};
