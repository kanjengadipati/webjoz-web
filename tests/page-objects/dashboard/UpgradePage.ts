import type { Page, Locator } from "@playwright/test";

export class UpgradePage {
  readonly page: Page;
  readonly gatewayToggle: Locator;
  readonly midtransOption: Locator;
  readonly paypalOption: Locator;
  readonly proPlanButton: Locator;
  readonly enterprisePlanButton: Locator;
  readonly paypalPopup: Locator;
  readonly successIndicator: Locator;

  constructor(page: Page) {
    this.page = page;
    this.gatewayToggle = page.locator("[data-testid=gateway-toggle], button:has-text('PayPal'), button:has-text('Midtrans')").first();
    this.midtransOption = page.getByRole("button", { name: /midtrans|idr/i }).first();
    this.paypalOption = page.getByRole("button", { name: /paypal|usd/i }).first();
    this.proPlanButton = page.getByRole("button", { name: /pro/i }).first();
    this.enterprisePlanButton = page.getByRole("button", { name: /enterprise/i }).first();
    this.paypalPopup = page.locator("[data-testid=paypal-popup], .paypal-checkout, #paypal-button-container").first();
    this.successIndicator = page.locator("[class*=emerald], [class*=success]").first();
  }

  async goto() {
    await this.page.goto("/dashboard/upgrade");
    await this.page.waitForLoadState("networkidle");
  }

  async selectPlan(name: string) {
    const btn = this.page.getByRole("button", { name: new RegExp(name, "i") }).first();
    await btn.click();
  }

  async selectPaypalGateway() {
    if (await this.paypalOption.isVisible()) {
      await this.paypalOption.click();
    }
  }

  async selectMidtransGateway() {
    if (await this.midtransOption.isVisible()) {
      await this.midtransOption.click();
    }
  }
}
