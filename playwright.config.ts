import { defineConfig, devices } from "@playwright/test";

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ["list"],
    ["html", { open: "never" }],
  ],
  timeout: 30_000,
  expect: { timeout: 10_000 },

  use: {
    baseURL: BASE_URL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    locale: "id-ID",
    timezoneId: "Asia/Jakarta",
  },

  projects: [
    {
      name: "setup",
      testMatch: /.*\.setup\.ts/,
    },
    {
      name: "chromium",
      testMatch: /^(?!.*\.admin\.)(?!.*\.unauthed\.).*\.spec\.ts$/,
      use: { ...devices["Desktop Chrome"], storageState: "tests/.auth/user.json" },
      dependencies: ["setup"],
    },
    {
      name: "mobile-chrome",
      testMatch: /^(?!.*\.admin\.)(?!.*\.unauthed\.).*\.spec\.ts$/,
      use: { ...devices["Pixel 7"], storageState: "tests/.auth/user.json" },
      dependencies: ["setup"],
    },
    {
      name: "unauthed",
      testMatch: /.*\.unauthed\.spec\.ts/,
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "admin",
      testMatch: /.*\.admin\.spec\.ts/,
      use: { ...devices["Desktop Chrome"], storageState: "tests/.auth/admin.json" },
      dependencies: ["setup"],
    },
  ],
});
