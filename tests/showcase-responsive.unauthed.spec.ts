// Responsive gate untuk SEMUA varian di showcase-section internal.
//
// Sumber daftar:
//   - app/dashboard/admin/section-showcase/page.tsx -> SECTION_CONFIG_LIST
//   - components/sections/variant-registry.ts       -> SECTION_VARIANT_OPTIONS
// Target render:
//   - /sp/section/<section>/<variant> -> SectionVariantPreviewClient ->
//     SectionRenderer + MOCK_SHOWCASE_DATA (jalur yang sama dengan showcase internal).
//
// Jalankan: npm run test:responsive-sections (dev server harus aktif di :3000).
// Simpan screenshot tiap viewport: SECTION_RESPONSIVE_SHOTS=1 npm run test:responsive-sections
import { readFileSync } from "node:fs";
import { mkdirSync } from "node:fs";
import { resolve, join } from "node:path";
import { expect, test, type Page } from "@playwright/test";

const BASE_URL = process.env.BASE_URL ?? "http://localhost:3000";
const VIEWPORTS = [
  { width: 360, height: 900 },  // small phone
  { width: 390, height: 844 },  // typical phone
  { width: 768, height: 1024 }, // tablet
  { width: 1280, height: 900 }, // desktop
];

function readSource(relativePath: string): string {
  return readFileSync(resolve(process.cwd(), relativePath), "utf8");
}

/** Section yang benar-benar dirender di showcase internal (bukan pseudo-setting). */
function parseShowcaseSections(): string[] {
  const src = readSource("app/dashboard/admin/section-showcase/page.tsx");
  const block = src.match(/const SECTION_CONFIG_LIST[^=]*=\s*\[([\s\S]*?)\n\];/);
  if (!block) throw new Error("SECTION_CONFIG_LIST tidak ditemukan di section-showcase/page.tsx");
  return [...block[1].matchAll(/\{\s*id:\s*"([^"]+)"/g)].map((m) => m[1]);
}

/** Varian per section, dibaca dari sumber yang sama dengan check:variants. */
function parseRegistryVariants(): Record<string, string[]> {
  const registry = readSource("components/sections/variant-registry.ts");
  const result: Record<string, string[]> = {};
  let current: string | null = null;

  for (const line of registry.split("\n")) {
    const inline = line.match(/^ {2}([A-Za-z_]+): \[/);
    if (inline) {
      current = inline[1];
      result[current] = [];
      continue;
    }
    const fromFile = line.match(/^ {2}([A-Za-z_]+): variantOptions\((\w+)\),/);
    const fromMap = line.match(/^ {2}([A-Za-z_]+): (\w+)\.map\(/);
    const derived = fromFile ?? fromMap;
    if (derived) {
      result[derived[1]] = parseVariantsFile(derived[2], registry);
      current = null;
      continue;
    }
    if (/^ {2}\],?\s*$/.test(line)) {
      current = null;
      continue;
    }
    const value = current && line.match(/^\s*\{\s*value:\s*"([^"]+)"/);
    if (value && current) result[current].push(value[1]);
  }
  return result;
}

function parseVariantsFile(constName: string, registry: string): string[] {
  const imp = registry.match(new RegExp(`import \\{[^}]*\\b${constName}\\b[^}]*\\} from "\\./([^"]+)"`));
  if (!imp) return [];
  const src = readSource(`components/sections/${imp[1]}.ts`);
  // hero/meta.ts: entri array satu baris dengan `value: "..."`.
  const inline = [...src.matchAll(/^ {2}\{\s*value:\s*"([^"]+)"/gm)].map((m) => m[1]);
  if (inline.length) return inline;
  // variants.ts: entri objek multi-baris dengan kunci varian.
  return [...src.matchAll(/^ {2}"?([A-Za-z0-9_-]+)"?: \{\s*$/gm)].map((m) => m[1]);
}

async function waitForLayout(page: Page): Promise<void> {
  // Tunggu font maks. 1s agar pengukuran tidak gantung pada Google Fonts.
  await page.evaluate(async () => {
    if (document.fonts) {
      await Promise.race([
        document.fonts.ready,
        new Promise((done) => setTimeout(done, 1000)),
      ]);
    }
  });
  await page.waitForTimeout(80);
}

async function measure(page: Page) {
  return page.evaluate(() => {
    const inner = window.innerWidth;
    const main = document.querySelector("main");
    const offenders: string[] = [];

    const isClipped = (el: Element) => {
      for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) {
        const overflowX = getComputedStyle(p).overflowX;
        if (["hidden", "clip", "auto", "scroll"].includes(overflowX)) return true;
      }
      return false;
    };

    for (const el of Array.from(document.body.querySelectorAll("*"))) {
      const style = getComputedStyle(el);
      if (style.display === "none" || style.visibility === "hidden" || style.position === "fixed") continue;
      const rect = el.getBoundingClientRect();
      if (rect.width < 1 || rect.height < 1) continue;
      if ((rect.right > inner + 2 || rect.left < -2) && !isClipped(el)) {
        const cls = typeof el.className === "string" ? el.className.split(" ").slice(0, 2).join(".") : "";
        offenders.push(`${el.tagName.toLowerCase()}${cls ? `.${cls}` : ""} (${Math.round(rect.left)}..${Math.round(rect.right)})`);
      }
    }

    // Wrapper preview punya `overflow: hidden`, jadi overflow di dalamnya
    // tidak terlihat di documentElement.scrollWidth. Cek keduanya.
    const wrapper = main?.firstElementChild as HTMLElement | null;
    const docOverflow = Math.max(0, document.documentElement.scrollWidth - inner);
    const clippedOverflow = wrapper
      ? Math.max(0, wrapper.scrollWidth - wrapper.clientWidth)
      : 0;

    return {
      inner,
      scrollWidth: document.documentElement.scrollWidth,
      wrapperScrollWidth: wrapper?.scrollWidth ?? 0,
      wrapperClientWidth: wrapper?.clientWidth ?? 0,
      overflow: Math.max(docOverflow, clippedOverflow),
      overflowSource: clippedOverflow > docOverflow ? "wrapper (terklip)" : "document",
      mainHeight: Math.round(main?.getBoundingClientRect().height ?? 0),
      text: (main?.innerText ?? "").trim(),
      offenders: offenders.slice(0, 6),
    };
  });
}

const sections = parseShowcaseSections();
const variantsBySection = parseRegistryVariants();

test.describe("showcase-section responsive", () => {
  for (const section of sections) {
    test(`${section}: semua varian muat di semua viewport`, async ({ page }) => {
      test.setTimeout(15 * 60_000);
      const variants = variantsBySection[section] ?? [];
      expect(variants.length, `variant-registry.ts tidak punya varian untuk section "${section}"`).toBeGreaterThan(0);

      const problems: string[] = [];
      for (const variant of variants) {
        const url = `${BASE_URL}/sp/section/${encodeURIComponent(section)}/${encodeURIComponent(variant)}`;
        await page.setViewportSize(VIEWPORTS[0]);
        await page.goto(url, { waitUntil: "domcontentloaded" });
        await expect(page.locator("main")).toBeVisible();
        await waitForLayout(page);

        for (const viewport of VIEWPORTS) {
          await page.setViewportSize(viewport);
          await waitForLayout(page);
          const id = `${section}/${variant} @${viewport.width}`;
          const m = await measure(page);

          if (m.text.includes("Section renderer belum terdaftar")) {
            problems.push(`${id}: varian tidak dirender oleh showcase internal`);
          }
          if (m.mainHeight < 40 || m.text.length < 3) {
            problems.push(`${id}: konten kosong (tinggi ${m.mainHeight}px)`);
          }
          if (m.overflow > 1) {
            problems.push(
              `${id}: horizontal overflow ${m.overflow}px (${m.overflowSource}; doc ${m.scrollWidth}/${m.inner}, wrapper ${m.wrapperScrollWidth}/${m.wrapperClientWidth})` +
                (m.offenders.length ? ` — ${m.offenders.join(", ")}` : ""),
            );
          }

          if (process.env.SECTION_RESPONSIVE_SHOTS === "1") {
            const dir = join(process.cwd(), "test-results", "section-shots", section);
            mkdirSync(dir, { recursive: true });
            await page.screenshot({ path: join(dir, `${variant}-${viewport.width}.png`), fullPage: true });
          }
        }
      }

      expect(problems, problems.join("\n")).toEqual([]);
    });
  }
});
