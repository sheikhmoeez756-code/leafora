import { defineConfig, devices } from "@playwright/test";

const PORT = 3000;
const BASE_URL = `http://localhost:${PORT}`;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  // Next optimizes images on demand, and the catalogue photos are large. Too
  // many workers requesting different images at once starves the optimizer and
  // navigation starts timing out — a test-harness limit, not an app fault.
  workers: 2,
  timeout: 60_000,
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL: BASE_URL,
    trace: "on-first-retry",
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
  },
  projects: [
    {
      name: "desktop",
      // Uses the locally installed Google Chrome rather than a downloaded
      // build — `npx playwright install chrome` provisions it in CI.
      use: { ...devices["Desktop Chrome"], channel: "chrome" },
    },
    {
      name: "mobile",
      use: { ...devices["Pixel 7"], channel: "chrome" },
    },
  ],
  webServer: {
    // The cart and wishlist depend on hydration timing, so these run against a
    // production build rather than the dev server.
    command: "npm run build && npm run start",
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
});
