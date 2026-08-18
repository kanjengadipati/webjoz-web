export const TEST_DATA = {
  user: {
    email: process.env.TEST_USER_EMAIL || "test-e2e@webjoz.com",
    password: process.env.TEST_USER_PASSWORD || "TestPassword123!",
    name: "E2E Test User",
    phone: "+6281234567890",
  },
  admin: {
    email: process.env.TEST_ADMIN_EMAIL || "admin@webjoz.com",
    password: process.env.TEST_ADMIN_PASSWORD || "AdminPassword123!",
    name: "E2E Admin",
  },
  registration: {
    name: "New E2E User",
    email: `new-e2e-${Date.now()}@test.com`,
    password: "NewUser123!",
    phone: "+6289876543210",
  },
  site: {
    name: "E2E Test Site",
    subdomain: `e2e-test-${Date.now()}`,
  },
  domain: {
    custom: "example-custom.com",
    purchase: "mynewsite",
    tld: "com",
  },
  resetToken: "mock-reset-token-abc123",
  verificationToken: "mock-verify-token-xyz789",
} as const;
