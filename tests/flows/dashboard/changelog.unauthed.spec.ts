import { test, expect } from "../../fixtures/base";
import { mockAllRoutes } from "../../api-mocks";

test.describe("Changelog - Interactive", () => {
  test.beforeEach(async ({ page }) => {
    mockAllRoutes(page);
  });

  test("changelog page loads with entries and filters", async ({ page }) => {
    await page.goto("/changelog");
    await page.waitForLoadState("networkidle");

    // Check heading & search input
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    const searchInput = page.getByPlaceholder(/cari pembaruan/i);
    await expect(searchInput).toBeVisible();

    // Check filter tags
    await expect(page.getByRole("button", { name: /semua/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /fitur baru/i })).toBeVisible();
  });

  test("search filters changelog entries", async ({ page }) => {
    await page.goto("/changelog");
    await page.waitForLoadState("networkidle");

    const searchInput = page.getByPlaceholder(/cari pembaruan/i);
    await searchInput.fill("Help Center");

    await expect(page.locator("body")).toContainText(/Help Center & Pusat Bantuan/i);
  });

  test("filter by category shows relevant entries", async ({ page }) => {
    await page.goto("/changelog");
    await page.waitForLoadState("networkidle");

    // Try finding the button by text content
    await page.locator('button', { hasText: 'Perbaikan' }).click();

    await expect(page.locator("body")).toContainText(/Perbaikan Domain Connection/i);
  });

  test("entry expands on click to reveal description", async ({ page }) => {
    await page.goto("/changelog");
    await page.waitForLoadState("networkidle");

    const entryBtn = page.getByRole("button", { name: /Help Center & Pusat Bantuan/i });
    await entryBtn.click();

    await expect(page.locator("body")).toContainText(/Halaman bantuan baru dengan pencarian FAQ/i);
  });
});
