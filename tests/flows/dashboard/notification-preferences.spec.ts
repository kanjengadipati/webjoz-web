import { test, expect } from "../../fixtures/base";
import { mockAllRoutes } from "../../api-mocks";

test("notification preferences tab renders toggles and persists", async ({ page }) => {
  mockAllRoutes(page);
  await page.goto("/dashboard/settings");
  await page.locator('button:visible:has-text("Notifikasi")').first().click();
  const switches = page.getByRole("switch");
  await expect(switches).toHaveCount(7);
  await expect(switches.first()).toHaveAttribute("aria-checked", "true");
  await switches.first().click();
  await expect(switches.first()).toHaveAttribute("aria-checked", "false");
});
