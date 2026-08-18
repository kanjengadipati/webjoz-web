import type { Page, Locator } from "@playwright/test";

export class RegisterPage {
  readonly page: Page;
  readonly nameInput: Locator;
  readonly emailInput: Locator;
  readonly phoneInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.nameInput = page.locator("#reg-name");
    this.emailInput = page.locator("#reg-email");
    this.phoneInput = page.locator("#reg-phone");
    this.passwordInput = page.locator("#reg-password");
    this.submitButton = page.locator("button[type=submit]");
    this.errorMessage = page.locator("[class*=rose-500]");
  }

  async goto() {
    await this.page.goto("/register");
    await this.page.waitForLoadState("networkidle");
  }

  async fillForm(data: { name: string; email: string; phone?: string; password: string }) {
    await this.nameInput.fill(data.name);
    await this.emailInput.fill(data.email);
    if (data.phone) await this.phoneInput.fill(data.phone);
    await this.passwordInput.fill(data.password);
  }

  async submit() {
    await this.submitButton.click();
  }
}
