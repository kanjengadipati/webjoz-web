import type { Page, Locator } from "@playwright/test";

export class SitesPage {
  readonly page: Page;
  readonly siteList: Locator;
  readonly newSiteButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.siteList = page.locator("a[href*=dashboard/sites]");
    this.newSiteButton = page.getByRole("link", { name: /new|create|baru/i }).first();
  }

  async goto() {
    await this.page.goto("/dashboard/sites");
    await this.page.waitForLoadState("networkidle");
  }
}
