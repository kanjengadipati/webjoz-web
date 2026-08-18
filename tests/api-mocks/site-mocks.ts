import type { Page } from "@playwright/test";

export function mockSiteRoutes(page: Page) {
  page.route("**/sites", async (route) => {
    if (route.request().method() === "GET") {
      await route.fulfill({
        status: 200,
        json: {
          status: "success",
          data: [
            { id: 1, name: "My Test Site", subdomain: "test-site", status: "published", template_id: "kuliner", created_at: new Date().toISOString() },
          ],
        },
      });
    } else if (route.request().method() === "POST") {
      await route.fulfill({
        status: 200,
        json: { status: "success", data: { id: 99, name: "New Site", subdomain: "new-site", status: "draft" } },
      });
    }
  });

  page.route("**/sites/1", async (route) => {
    if (route.request().method() === "GET") {
      await route.fulfill({
        status: 200,
        json: {
          status: "success",
          data: {
            id: 1, name: "My Test Site", subdomain: "test-site", status: "published",
            template_id: "kuliner", created_at: new Date().toISOString(),
            content: { hero: { title: "Welcome" }, sections: [] },
          },
        },
      });
    } else {
      await route.fulfill({ status: 200, json: { status: "success", message: "Site updated" } });
    }
  });

  page.route("**/ai/generate*", async (route) => {
    if (route.request().method() === "POST") {
      await route.fulfill({
        status: 200,
        json: {
          status: "success",
          data: {
            content: { hero: { title: "AI Generated Site" }, sections: [] },
            preview_url: "/preview/99",
          },
        },
      });
    }
  });

  page.route("**/ai/regenerate*", async (route) => {
    await route.fulfill({
      status: 200,
      json: { status: "success", data: { content: { title: "Regenerated Section" } } },
    });
  });

  page.route("**/sites/*/publish", async (route) => {
    await route.fulfill({ status: 200, json: { status: "success", data: { status: "published" } } });
  });

  page.route("**/sites/*/unpublish", async (route) => {
    await route.fulfill({ status: 200, json: { status: "success", data: { status: "draft" } } });
  });

  page.route("**/sites/*/content", async (route) => {
    await route.fulfill({ status: 200, json: { status: "success", message: "Content updated" } });
  });

  page.route("**/sites/public*", async (route) => {
    await route.fulfill({
      status: 200,
      json: { status: "success", data: [] },
    });
  });
}
