import type { Page, Locator } from "@playwright/test";

export class SettingsPage {
  readonly page: Page;
  readonly nameInput: Locator;
  readonly saveButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.nameInput = page.locator("input[name=name], #settings-name").first();
    this.saveButton = page.getByRole("button", { name: /save|simpan/i }).first();
  }

  async goto() {
    await this.page.goto("/dashboard/settings");
    await this.page.waitForLoadState("networkidle");
  }
}
