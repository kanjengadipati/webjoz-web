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
const REQUIRE_REAL_AUTH = process.env.E2E_REQUIRE_REAL_AUTH === "1";

type AuthResult = { token?: string; error?: string };

async function ensureUser(request: any, email: string, password: string, name: string): Promise<AuthResult> {
  await request
    .post(`${API_URL}/auth/register`, {
      data: { name, email, phone: "+6281234567890", password },
    })
    .catch(() => {});

  const res = await request
    .post(`${API_URL}/auth/login`, {
      data: { email, password },
    })
    .catch(() => null);

  if (!res) {
    return { error: `login request to ${API_URL} did not complete (API unreachable?)` };
  }

  if (!res.ok()) {
    let message = res.statusText();
    try {
      message = (await res.json())?.message || message;
    } catch {}
    return { error: `login rejected with HTTP ${res.status()}: ${message}` };
  }

  let body: any;
  try {
    body = await res.json();
  } catch {
    return { error: "login succeeded but the response was not JSON" };
  }

  if (body?.status !== "success" || !body?.data?.access_token) {
    return { error: `login response carried no access_token (code=${body?.code ?? "unknown"})` };
  }

  return { token: body.data.access_token };
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

async function authenticate(
  request: any,
  browser: any,
  opts: { label: string; email: string; password: string; name: string; storageFile: string; mockToken: string }
) {
  const { token, error } = await ensureUser(request, opts.email, opts.password, opts.name);

  if (token) {
    await saveAuthState(browser, token, opts.email, opts.storageFile);
    return;
  }

  if (REQUIRE_REAL_AUTH) {
    throw new Error(
      `[e2e] ${opts.label} could not sign in: ${error}\n` +
        `      E2E_REQUIRE_REAL_AUTH=1 forbids the mock fallback. Unset it to allow offline runs.`
    );
  }

  console.warn(
    [
      "",
      `[e2e] WARNING — ${opts.label} is running on a MOCK token.`,
      `       reason: ${error}`,
      `       Specs that do not call mockAllRoutes() see no real data, and the`,
      `       catch-all mocks return empty lists, so an empty-state assertion can`,
      `       pass even when the feature is broken. Treat this run as unverified.`,
      `       Set E2E_REQUIRE_REAL_AUTH=1 to fail instead of falling back.`,
      "",
    ].join("\n")
  );

  await createMockAuthState(opts.email, opts.storageFile, opts.mockToken);
}

setup("authenticate as regular user", async ({ request, browser }) => {
  await authenticate(request, browser, {
    label: "regular user",
    email: USER_EMAIL,
    password: USER_PASSWORD,
    name: "E2E Test User",
    storageFile: userStorageFile,
    mockToken: "mock-token-e2e",
  });
});

setup("authenticate as admin", async ({ request, browser }) => {
  await authenticate(request, browser, {
    label: "admin",
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
    name: "E2E Admin",
    storageFile: adminStorageFile,
    mockToken: "mock-admin-token-e2e",
  });
});
