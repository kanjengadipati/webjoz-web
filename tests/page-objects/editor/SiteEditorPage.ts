import type { Page, Locator } from "@playwright/test";

export class SiteEditorPage {
  readonly page: Page;
  readonly publishButton: Locator;
  readonly unpublishButton: Locator;
  readonly saveButton: Locator;
  readonly sectionList: Locator;
  readonly previewContainer: Locator;
  readonly regenerateButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.publishButton = page.getByRole("button", { name: /publish|terbitkan/i }).first();
    this.unpublishButton = page.getByRole("button", { name: /unpublish|draft/i }).first();
    this.saveButton = page.getByRole("button", { name: /save|simpan/i }).first();
    this.sectionList = page.locator("[data-testid=section], [class*=section-item]").first();
    this.previewContainer = page.locator("iframe, [class*=preview]").first();
    this.regenerateButton = page.getByRole("button", { name: /regenerate|ulang/i }).first();
  }

  async goto(siteId: number = 1) {
    await this.page.goto(`/dashboard/sites/${siteId}`);
    await this.page.waitForLoadState("networkidle");
  }
}
