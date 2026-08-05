import { expect, test } from "@playwright/test";

test.describe("shop", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/shop");
  });

  test("shows the catalogue", async ({ page }) => {
    await expect(page.getByRole("heading", { name: "Best Sellers" })).toBeVisible();
    await expect(page.getByText("Snake Plant").first()).toBeVisible();
  });

  test("search matches names", async ({ page }) => {
    await page.getByLabel("Search plants and pots").fill("monstera");
    await expect(page.getByText("Monstera").first()).toBeVisible();
    await expect(page.getByText("Snake Plant")).toHaveCount(0);
  });

  test("search matches latin names", async ({ page }) => {
    await page.getByLabel("Search plants and pots").fill("sansevieria");
    await expect(page.getByText("Snake Plant").first()).toBeVisible();
  });

  test("search matches category labels", async ({ page }) => {
    // Regression: "low light" used to hit the empty state despite being a category.
    await page.getByLabel("Search plants and pots").fill("low light");
    await expect(page.getByText("No plants match your search")).toHaveCount(0);
    await expect(page.getByText("Snake Plant").first()).toBeVisible();
  });

  test("shows the empty state for a genuine miss", async ({ page }) => {
    await page.getByLabel("Search plants and pots").fill("zzzzzz");
    await expect(page.getByText("No plants match your search")).toBeVisible();
  });

  test("category chips filter and report pressed state", async ({ page }) => {
    const petFriendly = page.getByRole("button", { name: "Pet Friendly" });
    await expect(petFriendly).toHaveAttribute("aria-pressed", "false");
    await petFriendly.click();
    await expect(petFriendly).toHaveAttribute("aria-pressed", "true");
    await expect(page.getByText("Spider Plant").first()).toBeVisible();
    await expect(page.getByText("Fiddle Leaf Fig")).toHaveCount(0);
  });

  test("adding to cart does not navigate away", async ({ page }) => {
    // Regression: the add button used to be nested inside the card's <a>.
    await page.getByRole("button", { name: "Add Snake Plant to cart" }).click();
    await expect(page).toHaveURL(/\/shop$/);
    await expect(page.getByLabel("Cart").first()).toContainText("1");
  });

  test("a card links through to its product", async ({ page }) => {
    await page.getByRole("link", { name: /Snake Plant/ }).first().click();
    await expect(page).toHaveURL(/\/plant\/snake-plant$/);
    await expect(page.getByRole("heading", { name: "Snake Plant" })).toBeVisible();
  });

  test("an unknown product 404s", async ({ page }) => {
    const res = await page.goto("/plant/does-not-exist");
    expect(res?.status()).toBe(404);
  });
});
