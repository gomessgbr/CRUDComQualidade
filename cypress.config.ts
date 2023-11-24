import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    video: false,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
