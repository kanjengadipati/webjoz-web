import type { Page, Locator } from "@playwright/test";

export class ForgotPasswordPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly submitButton: Locator;
  readonly successMessage: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.locator("#email");
    this.submitButton = page.locator("button[type=submit]");
    this.successMessage = page.locator("[class*=emerald]");
    this.errorMessage = page.locator("[class*=rose-500]");
  }

  async goto() {
    await this.page.goto("/forgot-password");
    await this.page.waitForLoadState("networkidle");
  }

  async submitEmail(email: string) {
    await this.emailInput.fill(email);
    await this.submitButton.click();
  }
}
