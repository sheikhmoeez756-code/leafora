import { expect, test } from "@playwright/test";

test.describe("url-driven filters", () => {
  test("a category link deep-links into a filtered view", async ({ page }) => {
    await page.goto("/shop?c=pet-friendly");
    await expect(
      page.getByRole("button", { name: "Pet Friendly" })
    ).toHaveAttribute("aria-pressed", "true");
    await expect(page.getByText("Spider Plant").first()).toBeVisible();
    await expect(page.getByText("Fiddle Leaf Fig")).toHaveCount(0);
  });

  test("a search term deep-links and populates the field", async ({ page }) => {
    await page.goto("/shop?q=monstera");
    await expect(page.getByLabel("Search plants and pots")).toHaveValue("monstera");
    await expect(page.getByText("Monstera").first()).toBeVisible();
    await expect(page.getByText("Snake Plant")).toHaveCount(0);
  });

  test("clicking a chip writes it to the URL", async ({ page }) => {
    await page.goto("/shop");
    await page.getByRole("button", { name: "Low Light" }).click();
    await expect(page).toHaveURL(/\?c=low-light$/);
  });

  test("typing writes a debounced query to the URL", async ({ page }) => {
    await page.goto("/shop");
    await page.getByLabel("Search plants and pots").fill("pothos");
    await expect(page).toHaveURL(/\?q=pothos$/);
  });

  test("selecting All Plants clears the param rather than leaving c=all", async ({
    page,
  }) => {
    await page.goto("/shop?c=indoor");
    await page.getByRole("button", { name: "All Plants" }).click();
    await expect(page).toHaveURL(/\/shop$/);
  });

  test("back steps out of a filter", async ({ page }) => {
    await page.goto("/shop");
    await page.getByRole("button", { name: "Outdoor" }).click();
    await expect(page).toHaveURL(/\?c=outdoor$/);
    await page.goBack();
    await expect(page).toHaveURL(/\/shop$/);
    await expect(page.getByRole("button", { name: "All Plants" })).toHaveAttribute(
      "aria-pressed",
      "true"
    );
  });

  test("typing does not pile up history entries", async ({ page }) => {
    // Deliberate: a chip click is undoable, but debounced keystrokes replace
    // rather than push, so back leaves the shop instead of replaying a search
    // one character at a time.
    await page.goto("/care");
    await page.goto("/shop");
    await page.getByLabel("Search plants and pots").fill("bamboo");
    await expect(page).toHaveURL(/\?q=bamboo$/);
    await page.goBack();
    await expect(page).toHaveURL(/\/care$/);
  });

  test("an unknown category falls back to showing everything", async ({ page }) => {
    await page.goto("/shop?c=not-a-category");
    await expect(page.getByRole("button", { name: "All Plants" })).toHaveAttribute(
      "aria-pressed",
      "true"
    );
    await expect(page.getByText("Snake Plant").first()).toBeVisible();
  });

  test("clear filters resets to the bare URL", async ({ page }) => {
    await page.goto("/shop?q=zzzzzz");
    await expect(page.getByText("No plants match your search")).toBeVisible();
    await page.getByRole("button", { name: "Clear filters" }).click();
    await expect(page).toHaveURL(/\/shop$/);
    await expect(page.getByLabel("Search plants and pots")).toHaveValue("");
  });

  test("the care guide deep-links into filtered views", async ({ page }) => {
    await page.goto("/care");
    // Also matches the footer's shortcut, so take the in-page CTA.
    await page.getByRole("link", { name: "Low light", exact: true }).first().click();
    await expect(page).toHaveURL(/\/shop\?c=low-light$/);
    await expect(page.getByText("Snake Plant").first()).toBeVisible();
  });
});
