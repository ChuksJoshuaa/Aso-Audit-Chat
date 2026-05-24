describe("ASO Audit Flow", () => {
  const spotifyUrl =
    "https://apps.apple.com/us/app/spotify-music-and-podcasts/id324684580";

  beforeEach(() => {
    cy.visit("/");
  });

  describe("Full Audit Flow", () => {
    it("fetches app metadata when given a valid App Store URL", () => {
      cy.sendMessage(spotifyUrl);

      cy.contains(spotifyUrl, { timeout: 5000 }).should("be.visible");

      cy.get('[class*="animate-bounce"]', { timeout: 5000 }).should("exist");
    });

    it("displays streaming response from agent", () => {
      cy.sendMessage(spotifyUrl);

      cy.get('[class*="prose"]', { timeout: 30000 }).should("exist");
    });
  });

  describe("Error Handling", () => {
    it("handles malformed App Store URL", () => {
      cy.sendMessage("https://apps.apple.com/invalid");

      cy.get('[class*="prose"]', { timeout: 30000 }).should("exist");
    });

    it("handles non-App Store URL", () => {
      cy.sendMessage("https://google.com");

      cy.get('[class*="prose"]', { timeout: 30000 }).should("exist");
    });
  });

  describe("Conversation Continuity", () => {
    it("maintains message history", () => {
      cy.sendMessage("Hello");
      cy.waitForResponse();

      cy.sendMessage("What can you help me with?");
      cy.waitForResponse();

      cy.get('[class*="prose"]').should("have.length.at.least", 2);
    });
  });

  describe("UI Feedback", () => {
    it("disables input while processing", () => {
      cy.sendMessage(spotifyUrl);
      cy.get("textarea").should("be.disabled");
    });

    it("re-enables input after response", () => {
      cy.sendMessage("Hello");
      cy.waitForResponse();
      cy.get("textarea").should("not.be.disabled");
    });
  });
});
