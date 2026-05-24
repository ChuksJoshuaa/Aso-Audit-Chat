describe("ASO Audit Chat", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  describe("Initial State", () => {
    it("displays the welcome screen", () => {
      cy.contains("Welcome to ASO Audit").should("be.visible");
      cy.contains("Paste an Apple App Store URL").should("be.visible");
    });

    it("shows the example URL", () => {
      cy.contains("apps.apple.com/us/app/spotify").should("be.visible");
    });

    it("has an enabled input field", () => {
      cy.get("textarea")
        .should("be.visible")
        .and("not.be.disabled")
        .and("have.attr", "placeholder", "Paste an App Store URL to start...");
    });

    it("has a disabled submit button when input is empty", () => {
      cy.get('button[type="submit"]').should("be.disabled");
    });
  });

  describe("User Input", () => {
    it("enables submit button when text is entered", () => {
      cy.get("textarea").type("test message");
      cy.get('button[type="submit"]').should("not.be.disabled");
    });

    it("clears input after sending a message", () => {
      cy.get("textarea").type("Hello");
      cy.get('button[type="submit"]').click();
      cy.get("textarea").should("have.value", "");
    });

    it("displays user message in chat", () => {
      const testMessage = "https://apps.apple.com/us/app/test/id123456789";
      cy.get("textarea").type(testMessage);
      cy.get('button[type="submit"]').click();
      cy.contains(testMessage).should("be.visible");
    });

    it("supports Enter key to submit", () => {
      cy.get("textarea").type("Test message{enter}");
      cy.contains("Test message").should("be.visible");
    });

    it("supports Shift+Enter for newlines", () => {
      cy.get("textarea").type("Line 1{shift+enter}Line 2");
      cy.get("textarea").should("contain.value", "Line 1\nLine 2");
    });
  });

  describe("Chat Flow", () => {
    it("shows typing indicator after sending message", () => {
      cy.get("textarea").type("Hello");
      cy.get('button[type="submit"]').click();
      cy.get('[class*="animate-bounce"]').should("exist");
    });

    it("removes welcome screen after first message", () => {
      cy.get("textarea").type("Hello");
      cy.get('button[type="submit"]').click();
      cy.contains("Welcome to ASO Audit").should("not.exist");
    });
  });

  describe("URL Validation", () => {
    it("handles invalid URL gracefully", () => {
      cy.get("textarea").type("not a valid url");
      cy.get('button[type="submit"]').click();
      cy.contains("not a valid url").should("be.visible");
    });
  });

  describe("Accessibility", () => {
    it("has proper heading structure", () => {
      cy.get("h1").contains("ASO Audit").should("be.visible");
      cy.get("h2").contains("Welcome to ASO Audit").should("be.visible");
    });

    it("has visible focus states", () => {
      cy.get("textarea").focus();
      cy.get("textarea").parent().should("have.css", "border-color");
    });
  });

  describe("Responsive Layout", () => {
    it("adapts to mobile viewport", () => {
      cy.viewport(375, 667);
      cy.get("textarea").should("be.visible");
      cy.get('button[type="submit"]').should("be.visible");
    });

    it("adapts to tablet viewport", () => {
      cy.viewport(768, 1024);
      cy.get("textarea").should("be.visible");
      cy.get('button[type="submit"]').should("be.visible");
    });
  });
});
