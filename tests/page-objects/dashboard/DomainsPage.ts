import type { Page, Locator } from "@playwright/test";

export class DomainsPage {
  readonly page: Page;
  readonly domainList: Locator;
  readonly addDomainButton: Locator;
  readonly searchInput: Locator;

  constructor(page: Page) {
    this.page = page;
    this.domainList = page.locator("[class*=domain], tr, [class*=card]");
    this.addDomainButton = page.getByRole("button", { name: /add|bind|tambah/i }).first();
    this.searchInput = page.locator("input[type=text], input[placeholder*=domain], input[placeholder*=search]").first();
  }

  async goto() {
    await this.page.goto("/dashboard/domains");
    await this.page.waitForLoadState("networkidle");
  }
}
