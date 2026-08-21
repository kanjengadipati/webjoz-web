import { test, expect } from "../../fixtures/base";
import { mockAllRoutes } from "../../api-mocks";

test.describe("Unauthenticated - Public Pages", () => {
  test.beforeEach(async ({ page }) => {
    mockAllRoutes(page);
  });

  test("landing page loads", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await expect(page.locator("body")).not.toBeEmpty();
  });

  test("login page loads without auth", async ({ page }) => {
    await page.goto("/login");
    await page.waitForLoadState("networkidle");
    await expect(page.locator("body")).toContainText(/login|masuk|sign/i);
  });

  test("register page loads without auth", async ({ page }) => {
    await page.goto("/register");
    await page.waitForLoadState("networkidle");
    await expect(page.locator("body")).toContainText(/register|daftar|sign/i);
  });

  test("forgot-password page loads without auth", async ({ page }) => {
    await page.goto("/forgot-password");
    await page.waitForLoadState("networkidle");
    await expect(page.locator("body")).toContainText(/forgot|password|lupa/i);
  });

  test("template gallery loads", async ({ page }) => {
    await page.goto("/template-gallery");
    await page.waitForLoadState("networkidle");
    await expect(page.locator("body")).toContainText(/template|gallery|kuliner|jasa/i);
  });

  test("terms page loads", async ({ page }) => {
    await page.goto("/terms");
    await page.waitForLoadState("networkidle");
    await expect(page.locator("body")).toContainText(/terms|syarat|ketentuan/i);
  });

  test("privacy policy page loads", async ({ page }) => {
    await page.goto("/privacy-policy");
    await page.waitForLoadState("networkidle");
    await expect(page.locator("body")).toContainText(/privacy|privasi|data/i);
  });

  test("contact page loads", async ({ page }) => {
    await page.goto("/contact");
    await page.waitForLoadState("networkidle");
    await expect(page.locator("body")).toContainText(/hubungi|kontak|email|whatsapp/i);
  });

  test("help center page loads", async ({ page }) => {
    await page.goto("/help");
    await page.waitForLoadState("networkidle");
    await expect(page.locator("body")).toContainText(/bantuan|help|faq|pertanyaan/i);
  });

  test("changelog page loads", async ({ page }) => {
    await page.goto("/changelog");
    await page.waitForLoadState("networkidle");
    await expect(page.locator("body")).toContainText(/changelog|baru|pembaruan|update/i);
  });
});
