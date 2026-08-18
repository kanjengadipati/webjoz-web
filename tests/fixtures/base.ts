import { test as base, expect, type Page, type APIRequestContext } from "@playwright/test";
import { LoginPage } from "../page-objects/auth/LoginPage";
import { RegisterPage } from "../page-objects/auth/RegisterPage";
import { ForgotPasswordPage } from "../page-objects/auth/ForgotPasswordPage";
import { DashboardPage } from "../page-objects/dashboard/DashboardPage";
import { SitesPage } from "../page-objects/dashboard/SitesPage";
import { UpgradePage } from "../page-objects/dashboard/UpgradePage";
import { DomainsPage } from "../page-objects/dashboard/DomainsPage";
import { TeamPage } from "../page-objects/dashboard/TeamPage";
import { SessionsPage } from "../page-objects/dashboard/SessionsPage";
import { SettingsPage } from "../page-objects/dashboard/SettingsPage";
import { SiteWizardPage } from "../page-objects/wizard/SiteWizardPage";
import { SiteEditorPage } from "../page-objects/editor/SiteEditorPage";

type Fixtures = {
  loginPage: LoginPage;
  registerPage: RegisterPage;
  forgotPasswordPage: ForgotPasswordPage;
  dashboardPage: DashboardPage;
  sitesPage: SitesPage;
  siteWizardPage: SiteWizardPage;
  siteEditorPage: SiteEditorPage;
  upgradePage: UpgradePage;
  domainsPage: DomainsPage;
  teamPage: TeamPage;
  sessionsPage: SessionsPage;
  settingsPage: SettingsPage;
};

export const test = base.extend<Fixtures>({
  loginPage: async ({ page }, use) => use(new LoginPage(page)),
  registerPage: async ({ page }, use) => use(new RegisterPage(page)),
  forgotPasswordPage: async ({ page }, use) => use(new ForgotPasswordPage(page)),
  dashboardPage: async ({ page }, use) => use(new DashboardPage(page)),
  sitesPage: async ({ page }, use) => use(new SitesPage(page)),
  siteWizardPage: async ({ page }, use) => use(new SiteWizardPage(page)),
  siteEditorPage: async ({ page }, use) => use(new SiteEditorPage(page)),
  upgradePage: async ({ page }, use) => use(new UpgradePage(page)),
  domainsPage: async ({ page }, use) => use(new DomainsPage(page)),
  teamPage: async ({ page }, use) => use(new TeamPage(page)),
  sessionsPage: async ({ page }, use) => use(new SessionsPage(page)),
  settingsPage: async ({ page }, use) => use(new SettingsPage(page)),
});

export { expect } from "@playwright/test";
