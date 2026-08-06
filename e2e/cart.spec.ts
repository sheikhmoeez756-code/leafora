import { expect, test, type Page } from "@playwright/test";

const STORAGE_KEY = "leafora-cart-v1";

/** Seed storage from a same-origin URL that doesn't boot React. Writing it
 *  from a live app page races the provider's own first write. */
async function seedCart(page: Page, value: unknown) {
  await page.goto("/robots.txt");
  await page.evaluate(
    ([key, json]) => localStorage.setItem(key, json),
    [STORAGE_KEY, JSON.stringify(value)]
  );
}

test.describe("cart", () => {
  test("empty state", async ({ page }) => {
    await page.goto("/cart");
    await expect(page.getByText("Your cart is empty")).toBeVisible();
  });

  test("add, adjust quantity and see totals", async ({ page }) => {
    await page.goto("/plant/monstera");
    await page.getByRole("button", { name: /Add to Cart/ }).first().click();
    await page.goto("/cart");

    await expect(page.getByText("Monstera").first()).toBeVisible();
    await expect(page.getByText("$39.98")).toBeVisible(); // 34.99 + 4.99 shipping

    await page.getByRole("button", { name: "Increase quantity" }).first().click();
    await expect(page.getByText("$74.97")).toBeVisible(); // 69.98 + 4.99
  });

  test("decrease is disabled at one so it cannot silently delete the line", async ({
    page,
  }) => {
    await page.goto("/plant/monstera");
    await page.getByRole("button", { name: /Add to Cart/ }).first().click();
    await page.goto("/cart");
    await expect(
      page.getByRole("button", { name: "Decrease quantity" }).first()
    ).toBeDisabled();
  });

  test("removing the last item returns the empty state", async ({ page }) => {
    await page.goto("/plant/monstera");
    await page.getByRole("button", { name: /Add to Cart/ }).first().click();
    await page.goto("/cart");
    await page.getByRole("button", { name: "Remove Monstera" }).click();
    await expect(page.getByText("Your cart is empty")).toBeVisible();
  });

  test("a valid promo discounts the total", async ({ page }) => {
    await page.goto("/plant/snake-plant");
    await page.getByRole("button", { name: /Add to Cart/ }).first().click();
    await page.goto("/plant/monstera");
    await page.getByRole("button", { name: /Add to Cart/ }).first().click();
    await page.goto("/cart");

    await page.getByLabel("Promo code").fill("leaf10"); // lower case on purpose
    await page.getByRole("button", { name: "Apply" }).click();

    await expect(page.getByText("LEAF10 applied — 10% off")).toBeVisible();
    await expect(page.getByText("−$6.00")).toBeVisible();
    await expect(page.getByText("$58.97")).toBeVisible();
  });

  test("an invalid promo explains itself and changes nothing", async ({ page }) => {
    await page.goto("/plant/monstera");
    await page.getByRole("button", { name: /Add to Cart/ }).first().click();
    await page.goto("/cart");

    await page.getByLabel("Promo code").fill("BOGUS");
    await page.getByRole("button", { name: "Apply" }).click();

    await expect(page.getByText("That code isn't valid")).toBeVisible();
    await expect(page.getByText("$39.98")).toBeVisible();
  });

  test("survives a reload", async ({ page }) => {
    await page.goto("/plant/monstera");
    await page.getByRole("button", { name: /Add to Cart/ }).first().click();
    await page.goto("/cart");
    await page.reload();
    await expect(page.getByText("Monstera").first()).toBeVisible();
  });

  test("a saved cart is not wiped by a later page load", async ({ page }) => {
    // Regression: the persist effect used to write the empty initial state
    // before hydration committed, destroying a saved cart.
    await seedCart(page, { items: [{ slug: "monstera", qty: 2 }], promo: null });

    await page.goto("/cart");
    await expect(page.getByText("Monstera").first()).toBeVisible();
    expect(await page.evaluate((k) => localStorage.getItem(k), STORAGE_KEY)).toContain(
      "monstera"
    );
  });

  test("hostile storage cannot produce NaN totals", async ({ page }) => {
    // Regression: promo "constructor" resolved through the prototype chain to a
    // function, and `subtotal * fn` is NaN.
    await seedCart(page, {
      items: [
        { slug: "monstera", qty: 2 },
        { slug: "pothos", qty: -5 },
        { slug: "not-a-plant", qty: 1 },
      ],
      promo: "constructor",
    });

    await page.goto("/cart");
    await expect(page.getByText("Monstera").first()).toBeVisible();
    await expect(page.locator("body")).not.toContainText("NaN");
    await expect(page.getByText("Pothos")).toHaveCount(0);
    await expect(page.getByText("$74.97")).toBeVisible(); // 69.98 + 4.99, no discount
  });
});

test.describe("checkout", () => {
  test("redirects an empty cart", async ({ page }) => {
    await page.goto("/checkout");
    await expect(page.getByText("Nothing to check out yet")).toBeVisible();
  });

  test("places an order and empties the cart", async ({ page }) => {
    await page.goto("/plant/monstera");
    await page.getByRole("button", { name: /Add to Cart/ }).first().click();
    await page.goto("/checkout");

    await page.getByLabel("Full name").fill("Ada Lovelace");
    await page.getByLabel("Email").fill("ada@example.com");
    await page.getByLabel("Street address").fill("12 Analytical Way");
    await page.getByLabel("City").fill("London");
    await page.getByLabel("Postal code").fill("EC1A 1BB");
    await page.getByRole("button", { name: "Place Order" }).click();

    await expect(page.getByRole("heading", { name: /Order placed/ })).toBeVisible();
    await expect(page.getByText("$39.98")).toBeVisible();

    await page.goto("/cart");
    await expect(page.getByText("Your cart is empty")).toBeVisible();
  });
});
