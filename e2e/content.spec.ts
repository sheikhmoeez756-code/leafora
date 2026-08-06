import { expect, test } from "@playwright/test";

test.describe("care guide", () => {
  test("renders every care section", async ({ page }) => {
    await page.goto("/care");
    await expect(page.getByRole("heading", { name: "Keeping them alive" })).toBeVisible();
    for (const s of ["Light", "Water", "Humidity", "Pets"]) {
      await expect(page.getByRole("heading", { name: s, exact: true })).toBeVisible();
    }
  });

  test("groups plants by their catalogue care data", async ({ page }) => {
    await page.goto("/care");
    // Snake Plant is low light + fortnightly watering in lib/products.ts.
    await expect(page.getByRole("heading", { name: "Low light" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Snake Plant" }).first()).toBeVisible();
  });

  test("pet lists split safe from toxic", async ({ page }) => {
    await page.goto("/care#pets");
    const safe = page.getByRole("heading", { name: "Safe around pets" });
    await expect(safe).toBeVisible();
    // Spider Plant is petFriendly; Monstera is not.
    await expect(page.getByRole("heading", { name: "Keep out of reach" })).toBeVisible();
  });

  test("a care chip links to its product", async ({ page }) => {
    await page.goto("/care");
    await page.getByRole("link", { name: "Snake Plant" }).first().click();
    await expect(page).toHaveURL(/\/plant\/snake-plant$/);
  });
});

test.describe("faq", () => {
  test("renders all three groups", async ({ page }) => {
    await page.goto("/faq");
    for (const s of ["Delivery", "Returns", "Plant guarantee"]) {
      await expect(page.getByRole("heading", { name: s, exact: true })).toBeVisible();
    }
  });

  test("states plainly that it is a demo", async ({ page }) => {
    await page.goto("/faq");
    await expect(page.getByText("This is a portfolio demo.")).toBeVisible();
  });

  test("answers expand on click", async ({ page }) => {
    await page.goto("/faq");
    const answer = page.getByText("A flat $4.99 on every order");
    await expect(answer).toBeHidden();
    await page.getByText("How much is delivery?").click();
    await expect(answer).toBeVisible();
  });
});

test.describe("footer and homepage sections", () => {
  test("footer links reach the new pages", async ({ page }) => {
    await page.goto("/shop");
    await page.getByRole("link", { name: "Plant care guide" }).click();
    await expect(page).toHaveURL(/\/care$/);

    await page.getByRole("link", { name: "FAQ", exact: true }).click();
    await expect(page).toHaveURL(/\/faq$/);
  });

  test("footer credits the photography", async ({ page }) => {
    await page.goto("/shop");
    await expect(page.getByRole("link", { name: "Unsplash" })).toBeVisible();
  });

  test("homepage bands show only when browsing, not while searching", async ({
    page,
  }) => {
    await page.goto("/shop");
    await expect(page.getByRole("heading", { name: "30-day guarantee" })).toBeVisible();

    await page.getByLabel("Search plants and pots").fill("monstera");
    await expect(page.getByRole("heading", { name: "30-day guarantee" })).toBeHidden();
  });

  test("newsletter confirms without claiming to have sent anything", async ({
    page,
  }) => {
    await page.goto("/shop");
    await page.getByLabel("Email address").fill("someone@example.com");
    await page.getByRole("button", { name: "Subscribe" }).click();
    await expect(page.getByText("this is a demo, so nothing was actually sent")).toBeVisible();
  });
});
