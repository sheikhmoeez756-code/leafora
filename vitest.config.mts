import { defineConfig } from "vitest/config";
import { fileURLToPath } from "url";

export default defineConfig({
  resolve: {
    alias: { "@": fileURLToPath(new URL("./", import.meta.url)) },
  },
  test: {
    // Unit tests only — the Playwright specs under e2e/ drive a real browser.
    include: ["lib/**/*.test.ts"],
  },
});
