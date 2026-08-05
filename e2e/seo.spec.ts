import { expect, test } from "@playwright/test";

test.describe("metadata", () => {
  test("each product page has its own title and description", async ({ page }) => {
    await page.goto("/plant/snake-plant");
    await expect(page).toHaveTitle(/Snake Plant/);
    const snakeDesc = await page
      .locator('meta[name="description"]')
      .getAttribute("content");

    await page.goto("/plant/monstera");
    await expect(page).toHaveTitle(/Monstera/);
    const monsteraDesc = await page
      .locator('meta[name="description"]')
      .getAttribute("content");

    // Regression: every product page used to inherit the root metadata.
    expect(snakeDesc).not.toBe(monsteraDesc);
  });

  test("product pages carry a canonical and an OG image", async ({ page }) => {
    await page.goto("/plant/monstera");
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      /\/plant\/monstera$/
    );
    await expect(page.locator('meta[property="og:image"]')).toHaveCount(1);
  });

  test("product pages expose valid Product JSON-LD", async ({ page }) => {
    await page.goto("/plant/monstera");
    const raw = await page
      .locator('script[type="application/ld+json"]')
      .first()
      .textContent();
    const data = JSON.parse(raw ?? "{}");

    expect(data["@type"]).toBe("Product");
    expect(data.name).toBe("Monstera");
    expect(data.offers.price).toBe("34.99");
    expect(data.offers.priceCurrency).toBe("USD");
    expect(data.aggregateRating.ratingValue).toBe(4.8);
  });

  test("robots.txt points at the sitemap and protects the funnel", async ({
    request,
  }) => {
    const res = await request.get("/robots.txt");
    expect(res.status()).toBe(200);
    const body = await res.text();
    expect(body).toContain("Sitemap:");
    expect(body).toContain("/cart");
  });

  test("sitemap lists every product", async ({ request }) => {
    const res = await request.get("/sitemap.xml");
    expect(res.status()).toBe(200);
    const body = await res.text();
    for (const slug of ["snake-plant", "monstera", "ceramic-pot"]) {
      expect(body).toContain(`/plant/${slug}`);
    }
  });
});

test.describe("accessibility basics", () => {
  test("every checkout field has an accessible name", async ({ page }) => {
    await page.goto("/plant/monstera");
    await page.getByRole("button", { name: /Add to Cart/ }).first().click();
    await page.goto("/checkout");

    for (const label of [
      "Full name",
      "Email",
      "Street address",
      "City",
      "Postal code",
      "Delivery notes (optional)",
    ]) {
      await expect(page.getByLabel(label)).toBeVisible();
    }
  });

  test("the search and promo inputs are labelled", async ({ page }) => {
    await page.goto("/shop");
    await expect(page.getByLabel("Search plants and pots")).toBeVisible();

    // The promo field only exists once the cart has something in it.
    await page.getByRole("button", { name: "Add Monstera to cart" }).click();
    await page.goto("/cart");
    await expect(page.getByLabel("Promo code")).toBeVisible();
  });

  test("no anchor contains a nested button", async ({ page }) => {
    // Regression: the product card's add button lived inside the card's <a>.
    await page.goto("/shop");
    expect(await page.locator("a button").count()).toBe(0);
  });

  test("unbuilt nav sections are not focusable links", async ({ page }) => {
    await page.goto("/shop");
    expect(await page.locator('a[href="#"]').count()).toBe(0);
  });
});
