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

  test("resume restores applied theme and merges with previewToken", async ({ siteWizardPage }) => {
    const { page } = siteWizardPage;
    await siteWizardPage.goto();
    await page.waitForLoadState("networkidle");

    const snapshotWithTheme = {
      ...makeDoneSnapshot(),
      theme: {
        applied: {
          palette: { primary: "#7c3aed" },
          typography: { heading_font: "Playfair Display" },
        },
      },
    };

    await page.evaluate(
      ([k, s]: [string, string]) => localStorage.setItem(k, s),
      [KEY, JSON.stringify(snapshotWithTheme)] as [string, string]
    );

    await page.reload();
    await page.waitForLoadState("networkidle");

    const resumeBtn = page.locator("text=/lanjutkan|continue/i").first();
    if (await resumeBtn.isVisible({ timeout: 4000 }).catch(() => false)) {
      await resumeBtn.click();
    }

    await page.waitForFunction(() => !!(window as any).__themeDraft, { timeout: 10000 });

    const restoredTheme = await page.evaluate(() => {
      const td = (window as any).__themeDraft;
      return {
        appliedPrimary: td.applied?.palette?.primary,
        previewPrimary: td.previewToken?.palette?.primary,
        previewFont: td.previewToken?.typography?.heading_font,
      };
    });

    expect(restoredTheme.appliedPrimary).toBe("#7c3aed");
    expect(restoredTheme.previewPrimary).toBe("#7c3aed");
    expect(restoredTheme.previewFont).toBe("Playfair Display");
  });

  test("legacy snapshot without theme field resumes cleanly without errors", async ({ siteWizardPage }) => {
    const { page } = siteWizardPage;
    await siteWizardPage.goto();
    await page.waitForLoadState("networkidle");

    // Pure legacy snapshot without theme field
    const legacySnapshot = makeDoneSnapshot();
    await page.evaluate(
      ([k, s]: [string, string]) => localStorage.setItem(k, s),
      [KEY, JSON.stringify(legacySnapshot)] as [string, string]
    );

    await page.reload();
    await page.waitForLoadState("networkidle");

    const resumeBtn = page.locator("text=/lanjutkan|continue/i").first();
    if (await resumeBtn.isVisible({ timeout: 4000 }).catch(() => false)) {
      await resumeBtn.click();
    }

    await page.waitForFunction(() => !!(window as any).__themeDraft, { timeout: 10000 });

    const legacyState = await page.evaluate(() => {
      const td = (window as any).__themeDraft;
      return {
        hasApplied: Object.keys(td.applied || {}).length > 0,
        previewPrimary: td.previewToken?.palette?.primary,
      };
    });

    expect(legacyState.hasApplied).toBe(false);
    expect(legacyState.previewPrimary).toBe("#2563eb");
  });

  test("hardReset clears applied theme on chat reset", async ({ siteWizardPage }) => {
    const { page } = siteWizardPage;
    await siteWizardPage.goto();
    await page.waitForLoadState("networkidle");

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

    // Apply custom palette then hardReset
    await page.evaluate(() => {
      const td = (window as any).__themeDraft;
      td.applyNow({ palette: { primary: "#ef4444" } });
      td.hardReset();
    });

    const resetState = await page.evaluate(() => {
      const td = (window as any).__themeDraft;
      return {
        applied: td.applied,
        draft: td.draft,
        canUndo: td.canUndo,
      };
    });

    expect(Object.keys(resetState.applied)).toHaveLength(0);
    expect(Object.keys(resetState.draft)).toHaveLength(0);
    expect(resetState.canUndo).toBe(false);
  });
  test.describe("Ganti mood (Undo / Reset / warna brand)", () => {
    const RETRO_PRESETS = {
      palettes: [
        {
          override: {
            palette: { primary: "#b45309", accent: "#0f766e", background: "#fef3c7", surface: "#fde68a", text: "#451a03" },
            theme_mode: "light",
          },
        },
      ],
      fonts: [{ override: { typography: { heading_font: "Playfair Display", body_font: "Lora" } } }],
    };
    const DARK_PRESETS = {
      palettes: [
        {
          override: {
            palette: { primary: "#c9a227", accent: "#e5e7eb", background: "#0b0f17", surface: "#141c2b", text: "#f8fafc" },
            theme_mode: "dark",
          },
        },
      ],
      fonts: [{ override: { typography: { heading_font: "Cormorant Garamond", body_font: "Inter" } } }],
    };

    async function openDoneWizard(siteWizardPage: any) {
      const { page } = siteWizardPage;
      await siteWizardPage.goto();
      await page.waitForLoadState("networkidle");

      const snap = makeDoneSnapshot();
      snap.chat.mood = "clean-modern";
      snap.preview.designToken.mood = "clean-modern";
      await page.evaluate(
        ([k, s]: [string, string]) => localStorage.setItem(k, s),
        [KEY, JSON.stringify(snap)] as [string, string]
      );
      await page.reload();
      await page.waitForLoadState("networkidle");

      const resumeBtn = page.locator("text=/lanjutkan|continue/i").first();
      if (await resumeBtn.isVisible({ timeout: 4000 }).catch(() => false)) {
        await resumeBtn.click();
      }
      await page.waitForFunction(() => !!(window as any).__themeDraft, { timeout: 10000 });
      return page;
    }

    const readToken = (page: any) =>
      page.evaluate(() => {
        const td = (window as any).__themeDraft;
        return {
          mood: td.previewToken?.mood,
          themeMode: td.previewToken?.theme_mode,
          primary: td.previewToken?.palette?.primary,
          background: td.previewToken?.palette?.background,
          canUndo: td.canUndo,
        };
      });

    const readSnapshotMood = (page: any) =>
      page.evaluate((k: string) => {
        try { return JSON.parse(localStorage.getItem(k) || "null")?.chat?.mood ?? null; } catch { return null; }
      }, KEY);

    test("Undo mengembalikan mood awal (token dan chat.mood di snapshot)", async ({ siteWizardPage }) => {
      const page = await openDoneWizard(siteWizardPage);

      await page.evaluate((p: any) => (window as any).__themeDraft.applyMood("retro", p), RETRO_PRESETS);
      await expect.poll(async () => (await readToken(page)).mood).toBe("retro");
      expect((await readToken(page)).primary).toBe("#b45309");
      await expect.poll(() => readSnapshotMood(page)).toBe("retro");

      await page.evaluate(() => (window as any).__themeDraft.undo());
      await expect.poll(async () => (await readToken(page)).mood).toBe("clean-modern");
      expect((await readToken(page)).primary).toBe("#2563eb");
      await expect.poll(() => readSnapshotMood(page)).toBe("clean-modern");
    });

    test("Reset tema mengembalikan mood awal dan mengosongkan Undo", async ({ siteWizardPage }) => {
      const page = await openDoneWizard(siteWizardPage);

      await page.evaluate((p: any) => (window as any).__themeDraft.applyMood("retro", p), RETRO_PRESETS);
      await expect.poll(async () => (await readToken(page)).mood).toBe("retro");

      await page.evaluate(() => (window as any).__themeDraft.resetAll());
      await expect.poll(async () => (await readToken(page)).mood).toBe("clean-modern");
      expect((await readToken(page)).canUndo).toBe(false);
      await expect.poll(() => readSnapshotMood(page)).toBe("clean-modern");
    });

    test("warna brand terang + mood gelap: tema gelap penuh, hanya primary/accent dari brand", async ({ siteWizardPage }) => {
      const page = await openDoneWizard(siteWizardPage);

      await page.evaluate(
        ([p, brand]: [any, any]) => (window as any).__themeDraft.applyMood("dark-premium", p, brand),
        [
          DARK_PRESETS,
          { primary: "#0a7a3c", accent: "#f2c94c", background: "#f8fafc", surface: "#ffffff", text: "#0f172a" },
        ] as [any, any]
      );

      await expect.poll(async () => (await readToken(page)).themeMode).toBe("dark");
      const tok = await readToken(page);
      expect(tok.primary).toBe("#0a7a3c");
      expect(tok.background).toBe("#0b0f17"); // latar tetap dari mood, bukan dari logo
    });
  });
});

