import type { Page, Locator } from "@playwright/test";

export class DashboardPage {
  readonly page: Page;
  readonly welcomeHeading: Locator;
  readonly statCards: Locator;
  readonly quickActions: Locator;
  readonly tenantSelector: Locator;

  constructor(page: Page) {
    this.page = page;
    this.welcomeHeading = page.locator("h2").first();
    this.statCards = page.locator("[class*=StatCard], a[href*=dashboard]").first();
    this.quickActions = page.locator("a[href*=dashboard]");
    this.tenantSelector = page.locator("[data-testid=tenant-selector], button:has-text('Workspace'), button:has-text('workspace')").first();
  }

  async goto() {
    await this.page.goto("/dashboard");
    await this.page.waitForLoadState("networkidle");
  }

  async navigateTo(href: string) {
    await this.page.goto(href);
    await this.page.waitForLoadState("networkidle");
  }

  async switchTenant(index: number) {
    if (await this.tenantSelector.isVisible()) {
      await this.tenantSelector.click();
      const option = this.page.locator("[role=menuitem], [role=option]").nth(index);
      await option.click();
    }
  }
}
