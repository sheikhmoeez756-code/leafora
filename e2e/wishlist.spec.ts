import { expect, test } from "@playwright/test";

const STORAGE_KEY = "leafora-wishlist-v1";

test.describe("wishlist", () => {
  test("empty state", async ({ page }) => {
    await page.goto("/wishlist");
    await expect(page.getByText("Nothing saved yet")).toBeVisible();
  });

  test("saving from a card updates the pressed state and the page", async ({
    page,
  }) => {
    await page.goto("/shop");
    const heart = page.getByRole("button", { name: "Add Snake Plant to wishlist" });
    await expect(heart).toHaveAttribute("aria-pressed", "false");
    await heart.click();
    await expect(
      page.getByRole("button", { name: "Remove Snake Plant from wishlist" })
    ).toHaveAttribute("aria-pressed", "true");

    await page.goto("/wishlist");
    await expect(page.getByText("1 saved plant")).toBeVisible();
    await expect(page.getByText("Snake Plant").first()).toBeVisible();
  });

  test("saving from the detail page persists across a reload", async ({ page }) => {
    await page.goto("/plant/monstera");
    await page.getByRole("button", { name: "Add Monstera to wishlist" }).click();
    await page.reload();
    await expect(
      page.getByRole("button", { name: "Remove Monstera from wishlist" })
    ).toBeVisible();
  });

  test("un-saving removes it from the list", async ({ page }) => {
    await page.goto("/shop");
    await page.getByRole("button", { name: "Add Pothos to wishlist" }).click();
    await page.goto("/wishlist");
    await expect(page.getByText("1 saved plant")).toBeVisible();

    await page.getByRole("button", { name: "Remove Pothos from wishlist" }).click();
    await expect(page.getByText("Nothing saved yet")).toBeVisible();
  });

  test("clear all empties the list", async ({ page }) => {
    await page.goto("/shop");
    await page.getByRole("button", { name: "Add Pothos to wishlist" }).click();
    await page.getByRole("button", { name: "Add Monstera to wishlist" }).click();
    await page.goto("/wishlist");
    await expect(page.getByText("2 saved plants")).toBeVisible();

    await page.getByRole("button", { name: "Clear all" }).first().click();
    await expect(page.getByText("Nothing saved yet")).toBeVisible();
  });

  test("hostile storage is sanitized", async ({ page }) => {
    // Seeded from a same-origin URL that doesn't boot React — writing it from a
    // live app page races the provider's own first write.
    await page.goto("/robots.txt");
    await page.evaluate(
      ([key, value]) => localStorage.setItem(key, value),
      [STORAGE_KEY, JSON.stringify(["monstera", "monstera", "not-a-plant", 42, null])]
    );
    await page.goto("/wishlist");
    await expect(page.getByText("1 saved plant")).toBeVisible();
    await expect(page.getByText("Monstera").first()).toBeVisible();
  });

  test("wishlist actions leave the cart alone", async ({ page }) => {
    await page.goto("/shop");
    await page.getByRole("button", { name: "Add Pothos to wishlist" }).click();
    await page.goto("/cart");
    await expect(page.getByText("Your cart is empty")).toBeVisible();
  });
});
