import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000",
    viewportWidth: 1280,
    viewportHeight: 720,
    defaultCommandTimeout: 10000,
    requestTimeout: 30000,
    responseTimeout: 120000,
    video: false,
    screenshotOnRunFailure: true,
    setupNodeEvents() {},
  },
});
