import type { Page, Locator } from "@playwright/test";

export class TeamPage {
  readonly page: Page;
  readonly memberList: Locator;
  readonly inviteButton: Locator;
  readonly emailInput: Locator;
  readonly roleSelect: Locator;

  constructor(page: Page) {
    this.page = page;
    this.memberList = page.locator("[class*=member], tr");
    this.inviteButton = page.getByRole("button", { name: /invite|undang/i }).first();
    this.emailInput = page.locator("input[type=email]").first();
    this.roleSelect = page.locator("select, [role=combobox]").first();
  }

  async goto() {
    await this.page.goto("/dashboard/team");
    await this.page.waitForLoadState("networkidle");
  }
}
