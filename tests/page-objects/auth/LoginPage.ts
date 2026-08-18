import type { Page, Locator } from "@playwright/test";

export class LoginPage {
  readonly page: Page;
  readonly passwordlessPhone: Locator;
  readonly passwordlessEmail: Locator;
  readonly loginEmail: Locator;
  readonly loginPassword: Locator;
  readonly otpCode: Locator;
  readonly submitButton: Locator;
  readonly switchToPassword: Locator;
  readonly switchToEmail: Locator;
  readonly switchToWhatsApp: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.passwordlessPhone = page.locator("#passwordless-phone");
    this.passwordlessEmail = page.locator("#passwordless-email");
    this.loginEmail = page.locator("#login-email");
    this.loginPassword = page.locator("#login-password");
    this.otpCode = page.locator("#otp-code");
    this.submitButton = page.locator("button[type=submit]");
    this.switchToPassword = page.getByRole("button", { name: /password/i }).first();
    this.switchToEmail = page.getByRole("button", { name: /email/i }).first();
    this.switchToWhatsApp = page.getByRole("button", { name: /whatsapp/i }).first();
    this.errorMessage = page.locator("[class*=rose-500]");
  }

  async goto() {
    await this.page.goto("/login");
    await this.page.waitForLoadState("networkidle");
  }

  async loginWithPassword(email: string, password: string) {
    await this.switchToPassword.click();
    await this.loginEmail.fill(email);
    await this.loginPassword.fill(password);
    await this.submitButton.click();
  }

  async loginWithOTP(channel: "email" | "whatsapp", target: string, otp: string) {
    if (channel === "email") {
      await this.switchToEmail.click();
      await this.passwordlessEmail.fill(target);
    } else {
      await this.switchToWhatsApp.click();
      await this.passwordlessPhone.fill(target);
    }
    await this.submitButton.click();
    await this.page.waitForTimeout(1000);
    await this.otpCode.fill(otp);
    await this.submitButton.click();
  }
}
