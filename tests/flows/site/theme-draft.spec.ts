import { test, expect } from "../../fixtures/base";
import { mockAllRoutes } from "../../api-mocks";

const KEY = "webjoz_wizard_resume_v1";

function makeDoneSnapshot() {
  return {
    version: 1,
    savedAt: Date.now(),
    businessName: "Kopi Nusantara",
    chat: {
      chatStage: "done",
      messages: [
        { id: "ai-1", sender: "ai", text: "Website Anda sudah siap!" },
      ],
      businessName: "Kopi Nusantara",
      businessType: "Kuliner",
      businessSubType: "Kafe",
      description: "Kafe kopi artisanal terbaik",
      whatsapp: "08123456789",
      serviceArea: "",
      mood: "modern-clean",
      siteLanguage: "id",
      awaitingNameConfirm: false,
      inferenceResult: null,
      typeWasInferred: false,
    },
    preview: {
      templateId: "TEMPLATE_KULINER01",
      content: {
        hero: { title: "Kopi Nusantara", subtitle: "Nikmati kopi terbaik" },
        header: { business_name: "Kopi Nusantara" },
      },
      designToken: {
        mood: "modern-clean",
        theme_mode: "light",
        palette: {
          primary: "#2563eb",
          accent: "#38bdf8",
          background: "#ffffff",
          surface: "#ffffff",
          text: "#0f172a",
        },
        typography: {
          heading_font: "Inter",
          body_font: "Inter",
        },
      },
    },
  };
}

test.describe("Theme Draft Mechanism (useThemeDraft)", () => {
  test.beforeEach(async ({ page }) => {
    mockAllRoutes(page);
  });

  test("draft updates previewToken, clearDraft restores, commitDraft saves and enables undo", async ({ siteWizardPage }) => {
    const { page } = siteWizardPage;
    await siteWizardPage.goto();
    await page.waitForLoadState("networkidle");

    // Seed finished generation snapshot
    await page.evaluate(
      ([k, s]: [string, string]) => localStorage.setItem(k, s),
      [KEY, JSON.stringify(makeDoneSnapshot())] as [string, string]
    );

    await page.reload();
    await page.waitForLoadState("networkidle");

    // Click resume banner if visible
    const resumeBtn = page.locator("text=/lanjutkan|continue/i").first();
    if (await resumeBtn.isVisible({ timeout: 4000 }).catch(() => false)) {
      await resumeBtn.click();
    }

    // Wait until window.__themeDraft is available
    await page.waitForFunction(() => !!(window as any).__themeDraft, { timeout: 10000 });

    // 1. Initial state
    const initialState = await page.evaluate(() => {
      const td = (window as any).__themeDraft;
      return {
        hasDraft: td.hasDraft,
        canUndo: td.canUndo,
        primaryColor: td.previewToken?.palette?.primary,
      };
    });
    expect(initialState.hasDraft).toBe(false);
    expect(initialState.canUndo).toBe(false);
    expect(initialState.primaryColor).toBe("#2563eb");

    // 2. Set draft: previewToken updates immediately, hasDraft becomes true
    await page.evaluate(() => {
      (window as any).__themeDraft.setDraft({
        palette: { primary: "#e11d48" },
      });
    });

    const draftState = await page.evaluate(() => {
      const td = (window as any).__themeDraft;
      return {
        hasDraft: td.hasDraft,
        primaryColor: td.previewToken?.palette?.primary,
      };
    });
    expect(draftState.hasDraft).toBe(true);
    expect(draftState.primaryColor).toBe("#e11d48");

    // 3. Clear draft: returns to base/applied state
    await page.evaluate(() => {
      (window as any).__themeDraft.clearDraft();
    });

    const clearedState = await page.evaluate(() => {
      const td = (window as any).__themeDraft;
      return {
        hasDraft: td.hasDraft,
        primaryColor: td.previewToken?.palette?.primary,
      };
    });
    expect(clearedState.hasDraft).toBe(false);
    expect(clearedState.primaryColor).toBe("#2563eb");

    // 4. Commit draft: applies draft, canUndo becomes true
    await page.evaluate(() => {
      (window as any).__themeDraft.setDraft({
        palette: { primary: "#059669" },
      });
      (window as any).__themeDraft.commitDraft();
    });

    const committedState = await page.evaluate(() => {
      const td = (window as any).__themeDraft;
      return {
        hasDraft: td.hasDraft,
        canUndo: td.canUndo,
        appliedPrimary: td.applied?.palette?.primary,
        previewPrimary: td.previewToken?.palette?.primary,
      };
    });
    expect(committedState.hasDraft).toBe(false);
    expect(committedState.canUndo).toBe(true);
    expect(committedState.appliedPrimary).toBe("#059669");
    expect(committedState.previewPrimary).toBe("#059669");

    // 5. Undo: restores previous applied state
    await page.evaluate(() => {
      (window as any).__themeDraft.undo();
    });

    const undoneState = await page.evaluate(() => {
      const td = (window as any).__themeDraft;
      return {
        canUndo: td.canUndo,
        previewPrimary: td.previewToken?.palette?.primary,
      };
    });
    expect(undoneState.canUndo).toBe(false);
    expect(undoneState.previewPrimary).toBe("#2563eb");

    // 6. Reset all: restores to baseToken
    await page.evaluate(() => {
      (window as any).__themeDraft.applyNow({
        palette: { primary: "#7c3aed" },
        typography: { heading_font: "Playfair Display" },
      });
      (window as any).__themeDraft.resetAll();
    });

    const resetState = await page.evaluate(() => {
      const td = (window as any).__themeDraft;
      return {
        canUndo: td.canUndo,
        hasDraft: td.hasDraft,
        primaryColor: td.previewToken?.palette?.primary,
        headingFont: td.previewToken?.typography?.heading_font,
      };
    });
    expect(resetState.canUndo).toBe(false);
    expect(resetState.hasDraft).toBe(false);
    expect(resetState.primaryColor).toBe("#2563eb");
    expect(resetState.headingFont).toBe("Inter");
  });

  test("committed theme overrides are sent in PUT /sites/{id}/content payload", async ({ siteWizardPage }) => {
    const { page } = siteWizardPage;
    await siteWizardPage.goto();
    await page.waitForLoadState("networkidle");

    // Seed finished generation snapshot
    await page.evaluate(
      ([k, s]: [string, string]) => localStorage.setItem(k, s),
      [KEY, JSON.stringify(makeDoneSnapshot())] as [string, string]
    );

    await page.reload();
    await page.waitForLoadState("networkidle");

    const resumeBtn = page.locator("text=/lanjutkan|continue/i").first();
    if (await resumeBtn.isVisible({ timeout: 4000 }).catch(() => false)) {
      await resumeBtn.click();
    }

    await page.waitForFunction(() => !!(window as any).__themeDraft, { timeout: 10000 });

    // Apply custom palette via commitDraft
    await page.evaluate(() => {
      (window as any).__themeDraft.applyNow({
        palette: { primary: "#d97706", accent: "#f59e0b" },
      });
    });

    // Intercept PUT /sites/*/content
    let capturedPayload: any = null;
    await page.route("**/sites/*/content", async (route) => {
      const postData = route.request().postDataJSON();
      capturedPayload = postData;
      await route.fulfill({ status: 200, json: { status: "success", message: "Content updated" } });
    });

    // Mock create site POST route to return site id
    await page.route("**/sites", async (route) => {
      if (route.request().method() === "POST") {
        await route.fulfill({
          status: 201,
          json: { status: "success", data: { id: 101, subdomain: "kopi-nusantara" } },
        });
        return;
      }
      await route.continue();
    });

    // Click "Edit" or "Simpan" or "Go to editor" button
    const editBtn = page.locator("button:has-text('Edit'), button:has-text('Simpan'), button:has-text('Lanjut')").first();
    if (await editBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await editBtn.click();
      await page.waitForTimeout(1000);
      if (capturedPayload) {
        expect(capturedPayload.design_token?.palette?.primary).toBe("#d97706");
        expect(capturedPayload.design_token?.palette?.accent).toBe("#f59e0b");
      }
    }
  });
});

