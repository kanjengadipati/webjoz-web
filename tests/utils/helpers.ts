import { type Page, expect } from "@playwright/test";

/** Wait for the page to finish loading (no pending network requests for API calls). */
export async function waitForIdle(page: Page) {
  await page.waitForLoadState("networkidle");
}

/** Assert the page does not show an error boundary / blank white screen. */
export async function expectNoCrash(page: Page) {
  await expect(page.locator("body")).not.toBeEmpty();
}

/** Assert the URL matches the given pattern. */
export async function expectURL(page: Page, pattern: string | RegExp) {
  await expect(page).toHaveURL(pattern);
}
