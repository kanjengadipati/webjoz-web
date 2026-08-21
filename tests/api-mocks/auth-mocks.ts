import type { Page } from "@playwright/test";
import { TEST_DATA } from "../fixtures/test-data";

export function mockAuthRoutes(page: Page) {
  page.route("**/auth/login", async (route) => {
    const body = route.request().postDataJSON();
    if (body?.email === TEST_DATA.user.email && body?.password === TEST_DATA.user.password) {
      await route.fulfill({ status: 200, json: { status: "success", data: { access_token: "mock-user-token-e2e" } } });
    } else if (body?.email === TEST_DATA.admin.email && body?.password === TEST_DATA.admin.password) {
      await route.fulfill({ status: 200, json: { status: "success", data: { access_token: "mock-admin-token-e2e" } } });
    } else {
      await route.fulfill({ status: 401, json: { status: "error", message: "Invalid credentials" } });
    }
  });

  page.route("**/auth/register", async (route) => {
    await route.fulfill({ status: 200, json: { status: "success", message: "Verification email sent" } });
  });

  page.route("**/auth/passwordless/start", async (route) => {
    await route.fulfill({ status: 200, json: { status: "success", data: { next_step: "otp" } } });
  });

  page.route("**/auth/verify-otp", async (route) => {
    try {
      const body = route.request().postDataJSON();
      if (body?.otp === "123456") {
        await route.fulfill({ status: 200, json: { status: "success", data: { access_token: "mock-otp-token-e2e" } } });
      } else {
        await route.fulfill({ status: 400, json: { status: "error", message: "Invalid or expired OTP" } });
      }
    } catch {
      await route.fulfill({ status: 200, json: { status: "success", data: { access_token: "mock-otp-token-e2e" } } });
    }
  });

  page.route("**/auth/social-login", async (route) => {
    const body = route.request().postDataJSON();
    await route.fulfill({
      status: 200,
      json: { status: "success", data: { access_token: `mock-social-${body?.provider}-token-e2e` } },
    });
  });

  page.route("**/auth/forgot-password", async (route) => {
    await route.fulfill({ status: 200, json: { status: "success", message: "Reset email sent" } });
  });

  page.route("**/auth/reset-password", async (route) => {
    const body = route.request().postDataJSON();
    if (body?.token === TEST_DATA.resetToken) {
      await route.fulfill({ status: 200, json: { status: "success", message: "Password reset" } });
    } else {
      await route.fulfill({ status: 400, json: { status: "error", message: "Invalid or expired token" } });
    }
  });

  page.route("**/auth/verify*", async (route) => {
    const url = new URL(route.request().url());
    const token = url.searchParams.get("token");
    if (token === TEST_DATA.verificationToken) {
      await route.fulfill({ status: 200, json: { status: "success", message: "Email verified" } });
    } else {
      await route.fulfill({ status: 400, json: { status: "error", message: "Invalid token" } });
    }
  });

  page.route("**/auth/profile", async (route) => {
    if (route.request().method() === "GET") {
      const authHeader = route.request().headers()["authorization"] || "";
      const isAdmin = authHeader.includes("mock-admin-token");
      await route.fulfill({
        status: 200,
        json: {
          status: "success",
          data: {
            id: isAdmin ? 99 : 1,
            name: isAdmin ? TEST_DATA.admin.name : TEST_DATA.user.name,
            email: isAdmin ? TEST_DATA.admin.email : TEST_DATA.user.email,
            phone_number: isAdmin ? "" : TEST_DATA.user.phone,
            role: isAdmin ? "admin" : "user",
            permissions: isAdmin
              ? ["tenant:manage", "site:view", "site:edit", "domain:manage", "lead:read", "analytics:read", "commission:read_all"]
              : ["site:view", "site:edit", "domain:manage", "lead:read", "analytics:read"],
          },
        },
      });
    } else {
      await route.fulfill({ status: 200, json: { status: "success", data: { id: 1, name: "Updated", email: TEST_DATA.user.email, phone_number: "", role: "user" } } });
    }
  });

  page.route("**/auth/sessions", async (route) => {
    if (route.request().method() === "GET") {
      await route.fulfill({
        status: 200,
        json: {
          status: "success",
          data: [
            { id: 1, device_name: "Chrome Desktop", ip: "127.0.0.1", created_at: new Date().toISOString(), is_current: true },
            { id: 2, device_name: "Safari Mobile", ip: "192.168.1.1", created_at: new Date().toISOString(), is_current: false },
          ],
        },
      });
    }
  });

  page.route("**/auth/sessions/*", async (route) => {
    if (route.request().method() === "DELETE") {
      await route.fulfill({ status: 200, json: { status: "success", message: "Session revoked" } });
    }
  });

  page.route("**/auth/logout", async (route) => {
    await route.fulfill({ status: 200, json: { status: "success", message: "Logged out" } });
  });

  page.route("**/auth/logout-others", async (route) => {
    await route.fulfill({ status: 200, json: { status: "success", message: "Other sessions revoked" } });
  });

  page.route("**/auth/refresh", async (route) => {
    await route.fulfill({ status: 200, json: { status: "success", data: { access_token: "mock-user-token-e2e" } } });
  });
}
