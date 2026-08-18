import type { Page, Locator } from "@playwright/test";

export class SessionsPage {
  readonly page: Page;
  readonly sessionList: Locator;
  readonly revokeButtons: Locator;

  constructor(page: Page) {
    this.page = page;
    this.sessionList = page.locator("[class*=session], [class*=card], tr").filter({ hasNot: page.locator("th") });
    this.revokeButtons = page.getByRole("button", { name: /revoke|hapus|remove/i });
  }

  async goto() {
    await this.page.goto("/dashboard/sessions");
    await this.page.waitForLoadState("networkidle");
  }
}
