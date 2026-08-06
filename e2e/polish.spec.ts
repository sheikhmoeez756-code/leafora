import { expect, test } from "@playwright/test";

test.describe("404 and errors", () => {
  test("an unknown route gets the branded 404, not Next's default", async ({
    page,
  }) => {
    const res = await page.goto("/no-such-page");
    expect(res?.status()).toBe(404);
    await expect(page.getByRole("heading", { name: /didn’t take root/ })).toBeVisible();
    await expect(page).toHaveTitle(/Page not found/);
  });

  test("an unknown product gets the same page", async ({ page }) => {
    await page.goto("/plant/does-not-exist");
    await expect(page.getByRole("heading", { name: /didn’t take root/ })).toBeVisible();
  });

  test("the 404 offers a way back", async ({ page }) => {
    await page.goto("/no-such-page");
    await page.getByRole("link", { name: /Browse the collection/ }).click();
    await expect(page).toHaveURL(/\/shop$/);
  });

  test("the 404 is not indexable, and says so exactly once", async ({ page }) => {
    await page.goto("/no-such-page");
    const robots = page.locator('meta[name="robots"]');
    await expect(robots).toHaveCount(1);
    await expect(robots).toHaveAttribute("content", /noindex/);
  });
});

test.describe("skip link and focus", () => {
  test("the skip link is the first thing tabbed to, and jumps to main", async ({
    page,
  }) => {
    await page.goto("/shop");
    await page.keyboard.press("Tab");
    const skip = page.getByRole("link", { name: "Skip to content" });
    await expect(skip).toBeFocused();
    await expect(skip).toBeVisible(); // hidden until focused
    await skip.press("Enter");
    await expect(page).toHaveURL(/#main$/);
  });

  test("every page exposes the skip target", async ({ page }) => {
    for (const path of ["/", "/shop", "/cart", "/care", "/faq", "/wishlist"]) {
      await page.goto(path);
      await expect(page.locator("#main")).toHaveCount(1);
    }
  });
});

test.describe("sorting", () => {
  test("sorting by price ascending reorders and writes the URL", async ({ page }) => {
    await page.goto("/shop");
    await page.getByLabel("Sort").selectOption("price-asc");
    await expect(page).toHaveURL(/sort=price-asc/);

    const prices = await page
      .locator("main p", { hasText: /^\$\d/ })
      .allTextContents();
    const nums = prices.map((t) => parseFloat(t.replace("$", "")));
    expect(nums).toEqual([...nums].sort((a, b) => a - b));
  });

  test("sorting collapses the curated sections into one list", async ({ page }) => {
    await page.goto("/shop");
    await expect(page.getByRole("heading", { name: "Best Sellers" })).toBeVisible();
    await page.getByLabel("Sort").selectOption("name");
    await expect(page.getByRole("heading", { name: "Best Sellers" })).toBeHidden();
  });

  test("a sort deep-link is honoured", async ({ page }) => {
    await page.goto("/shop?sort=price-desc");
    await expect(page.getByLabel("Sort")).toHaveValue("price-desc");
  });

  test("an unknown sort falls back to featured", async ({ page }) => {
    await page.goto("/shop?sort=nonsense");
    await expect(page.getByLabel("Sort")).toHaveValue("featured");
  });

  test("the result count reflects filtering", async ({ page }) => {
    await page.goto("/shop?c=pet-friendly");
    await expect(page.getByText(/^\d+ plants?$/)).toBeVisible();
  });
});

test.describe("quantity picker", () => {
  test("adds the chosen quantity in one go", async ({ page, isMobile }) => {
    test.skip(!!isMobile, "the picker is part of the desktop CTA row");
    await page.goto("/plant/monstera");
    await page.getByRole("button", { name: "Increase quantity" }).click();
    await page.getByRole("button", { name: "Increase quantity" }).click();
    await page.getByRole("button", { name: /Add to Cart/ }).click();

    await page.goto("/cart");
    await expect(page.getByText("$109.96")).toBeVisible(); // 34.99 x 3 + 4.99
  });

  test("resets to one after adding", async ({ page, isMobile }) => {
    test.skip(!!isMobile, "the picker is part of the desktop CTA row");
    await page.goto("/plant/monstera");
    await page.getByRole("button", { name: "Increase quantity" }).click();
    await page.getByRole("button", { name: /Add to Cart/ }).click();
    await expect(page.getByText("2", { exact: true })).toBeHidden();
  });
});

test.describe("undo remove", () => {
  test("restores the line with its quantity", async ({ page }) => {
    await page.goto("/plant/snake-plant");
    await page.getByRole("button", { name: /Add to Cart/ }).first().click();
    await page.goto("/cart");

    await page.getByRole("button", { name: "Increase quantity" }).first().click();
    await expect(page.getByText("$54.97")).toBeVisible(); // 24.99 x 2 + 4.99

    await page.getByRole("button", { name: "Remove Snake Plant" }).click();
    await expect(page.getByText("Your cart is empty")).toBeVisible();
    await expect(page.getByText("Removed Snake Plant (×2)")).toBeVisible();

    await page.getByRole("button", { name: "Undo" }).click();
    await expect(page.getByText("$54.97")).toBeVisible();
  });
});

test.describe("blur placeholders", () => {
  test("product images ship an inline preview", async ({ page }) => {
    await page.goto("/shop");
    const withBlur = await page
      .locator("img")
      .evaluateAll((els) =>
        els.filter((e) => (e.getAttribute("style") ?? "").includes("data:image/jpeg"))
      );
    expect(withBlur.length).toBeGreaterThan(0);
  });
});
