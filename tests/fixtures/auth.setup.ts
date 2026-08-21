import { test as setup } from "@playwright/test";
import path from "path";
import fs from "fs";

const authDir = path.join(__dirname, "../.auth");
const userStorageFile = path.join(authDir, "user.json");
const adminStorageFile = path.join(authDir, "admin.json");

const API_URL = process.env.API_URL || "http://localhost:8080";
const USER_EMAIL = process.env.TEST_USER_EMAIL || "test-e2e@webjoz.com";
const USER_PASSWORD = process.env.TEST_USER_PASSWORD || "TestPassword123!";
const ADMIN_EMAIL = process.env.TEST_ADMIN_EMAIL || "admin@webjoz.com";
const ADMIN_PASSWORD = process.env.TEST_ADMIN_PASSWORD || "AdminPassword123!";

async function ensureUser(request: any, email: string, password: string, name: string): Promise<string | null> {
  try {
    // Try register (ignore if already exists)
    await request.post(`${API_URL}/api/auth/register`, {
      data: { name, email, phone: "+6281234567890", password },
    }).catch(() => {});

    // Try login
    const res = await request.post(`${API_URL}/api/auth/login`, {
      data: { email, password },
    });
    const body = await res.json();
    if (body.status === "success" && body.data?.access_token) {
      return body.data.access_token;
    }
    return null;
  } catch {
    return null;
  }
}

async function saveAuthState(browser: any, token: string, email: string, storageFile: string) {
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto("/");
  await page.evaluate(([t, e]: [string, string]) => {
    localStorage.setItem("webjoz_access_token", t);
    localStorage.setItem("webjoz_email", e);
  }, [token, email] as [string, string]);
  await page.waitForTimeout(300);
  await context.storageState({ path: storageFile });
  await context.close();
}

async function createMockAuthState(email: string, storageFile: string, token = "mock-token-e2e") {
  // No API available — create a mock storageState so authed tests work with mocked routes
  if (!fs.existsSync(authDir)) fs.mkdirSync(authDir, { recursive: true });
  const mockState = {
    cookies: [],
    origins: [{
      origin: process.env.BASE_URL || "http://localhost:3000",
      localStorage: [
        { name: "webjoz_access_token", value: token },
        { name: "webjoz_email", value: email },
      ],
    }],
  };
  fs.writeFileSync(storageFile, JSON.stringify(mockState, null, 2));
}

setup("authenticate as regular user", async ({ request, browser }) => {
  try {
    const token = await ensureUser(request, USER_EMAIL, USER_PASSWORD, "E2E Test User");
    if (token) {
      await saveAuthState(browser, token, USER_EMAIL, userStorageFile);
      return;
    }
  } catch {}
  await createMockAuthState(USER_EMAIL, userStorageFile);
});

setup("authenticate as admin", async ({ request, browser }) => {
  try {
    const token = await ensureUser(request, ADMIN_EMAIL, ADMIN_PASSWORD, "E2E Admin");
    if (token) {
      await saveAuthState(browser, token, ADMIN_EMAIL, adminStorageFile);
      return;
    }
  } catch {}
  await createMockAuthState(ADMIN_EMAIL, adminStorageFile, "mock-admin-token-e2e");
});
