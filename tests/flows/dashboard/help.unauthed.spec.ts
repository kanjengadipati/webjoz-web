import { test, expect } from "../../fixtures/base";
import { mockAllRoutes } from "../../api-mocks";

test.describe("Help Center - Interactive", () => {
  test.beforeEach(async ({ page }) => {
    mockAllRoutes(page);
  });

  test("help page loads with search and categories", async ({ page }) => {
    await page.goto("/help");
    await page.waitForLoadState("networkidle");

    // Check title & search input
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    const searchInput = page.getByPlaceholder(/cari pertanyaan/i);
    await expect(searchInput).toBeVisible();

    // Check categories exist
    await expect(page.locator("button", { hasText: "Semua" })).toBeAttached();
    await expect(page.locator("button", { hasText: "Memulai" })).toBeAttached();
    await expect(page.locator("button", { hasText: "Fitur" })).toBeAttached();
  });

  test("search filters questions in help center", async ({ page }) => {
    await page.goto("/help");
    await page.waitForLoadState("networkidle");

    const searchInput = page.getByPlaceholder(/cari pertanyaan/i);
    await searchInput.fill("domain");

    // Results count should be displayed
    await expect(page.locator("body")).toContainText(/hasil untuk/i);
    await expect(page.locator("body")).toContainText(/domain/i);
  });

  test("accordion expands and reveals answer", async ({ page }) => {
    await page.goto("/help");
    await page.waitForLoadState("networkidle");

    // Click on the first question button
    const firstQuestion = page.getByRole("button", { name: /apa itu webjoz\?/i });
    await expect(firstQuestion).toBeVisible();
    await firstQuestion.click();

    // Answer text should become visible
    await expect(page.locator("body")).toContainText(/platform AI website builder/i);
  });
});
