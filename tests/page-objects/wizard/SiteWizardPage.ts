import type { Page, Locator } from "@playwright/test";

export class SiteWizardPage {
  readonly page: Page;
  readonly businessNameInput: Locator;
  readonly categorySelect: Locator;
  readonly locationInput: Locator;
  readonly submitButton: Locator;
  readonly previewArea: Locator;
  readonly saveButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.businessNameInput = page.locator("input[name*=name], input[name*=business], textarea[name*=name]").first();
    this.categorySelect = page.locator("select, [role=combobox]").first();
    this.locationInput = page.locator("input[name*=location], input[name*=alamat], textarea[name*=location]").first();
    this.submitButton = page.getByRole("button", { name: /generate|create|buat|submit/i }).first();
    this.previewArea = page.locator("iframe, [class*=preview]").first();
    this.saveButton = page.getByRole("button", { name: /save|simpan|publish/i }).first();
  }

  async goto() {
    await this.page.goto("/create");
    await this.page.waitForLoadState("networkidle");
  }
}
