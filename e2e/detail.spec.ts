import { expect, test } from "@playwright/test";

test.describe("product detail", () => {
  test("shows the rating summary with an accessible value", async ({ page }) => {
    await page.goto("/plant/snake-plant");
    await expect(page.getByRole("heading", { name: "Ratings" })).toBeVisible();
    await expect(
      page.getByRole("img", { name: "Rated 4.8 out of 5, from 120 ratings" })
    ).toBeVisible();
  });

  test("does not invent written reviews", async ({ page }) => {
    await page.goto("/plant/snake-plant");
    await expect(
      page.getByText("Written reviews aren’t part of this demo")
    ).toBeVisible();
  });

  test("suggests four related plants, never itself", async ({ page }) => {
    await page.goto("/plant/snake-plant");
    const section = page.locator("section", { hasText: "Pairs well with" }).first();
    const hrefs = await section.locator("a[href^='/plant/']").evaluateAll((els) => [
      ...new Set(els.map((e) => e.getAttribute("href"))),
    ]);
    expect(hrefs).toHaveLength(4);
    expect(hrefs).not.toContain("/plant/snake-plant");
  });

  test("relates by shared conditions, not at random", async ({ page }) => {
    // Snake Plant is indoor + low-light, so its matches should be too.
    await page.goto("/plant/snake-plant");
    const section = page.locator("section", { hasText: "Pairs well with" }).first();
    await expect(section.getByText("Pothos")).toBeVisible();
    await expect(section.getByText("ZZ Plant")).toBeVisible();
    // Bamboo is outdoors and full sun — it should not appear.
    await expect(section.getByText("Bamboo")).toHaveCount(0);
  });

  test("a related card navigates to that plant", async ({ page }) => {
    await page.goto("/plant/snake-plant");
    const section = page.locator("section", { hasText: "Pairs well with" }).first();
    await section.getByRole("link", { name: /Pothos/ }).first().click();
    await expect(page).toHaveURL(/\/plant\/pothos$/);
    await expect(page.getByRole("heading", { name: "Pothos" })).toBeVisible();
  });

  test("a price and add-to-cart are visible in either layout", async ({ page }) => {
    // Desktop shows them inline; mobile uses the fixed bottom bar, and the
    // other copy is display:none — so assert on whichever is actually shown.
    await page.goto("/plant/snake-plant");
    await expect(page.getByRole("button", { name: /Add to Cart/ })).toBeVisible();
    await expect(
      page.locator("span:visible").filter({ hasText: /^\$24\.99$/ }).first()
    ).toBeVisible();
  });

  test("the care stats link to the guide", async ({ page }) => {
    await page.goto("/plant/snake-plant");
    await page.getByRole("link", { name: "Read the care guide" }).click();
    await expect(page).toHaveURL(/\/care$/);
  });
});
