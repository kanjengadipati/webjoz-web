import { test, expect } from "@playwright/test";
import { formatPriceWithAmount, formatIdNumber } from "../../lib/utils";

test.describe("formatPriceWithAmount", () => {
  const cases: Array<[string | null, number, string]> = [
    ["Rp 450.000/malam", 30000, "Rp 30.000/malam"],
    ["Rp 25.000 / porsi", 30000, "Rp 30.000 / porsi"],
    ["Mulai Rp 25rb", 30000, "Mulai Rp 30.000"],
    ["2 for Rp 50.000", 30000, "2 for Rp 30.000"],
    ["Rp 25.000,-", 30000, "Rp 30.000,-"],
    ["Rp 25.000.", 30000, "Rp 30.000."],
    ["Rp 20.000 - Rp 35.000", 30000, "Rp 30.000"],
    ["Rp 20.000 - 35.000 / paket", 30000, "Rp 30.000 / paket"],
    ["Mulai dari Rp 20.000 - Rp 35.000", 30000, "Mulai dari Rp 30.000"],
    ["Gratis", 30000, "Rp 30.000"],
    ["Mulai dari Gratis", 30000, "Mulai dari Rp 30.000"],
    ["450.000/malam", 30000, "30.000/malam"],
    [null, 30000, "30.000"],
  ];

  for (const [tpl, amt, expected] of cases) {
    test(`correctly formats ${tpl ?? "null"} to ${expected}`, () => {
      expect(formatPriceWithAmount(amt, tpl)).toBe(expected);
    });
  }

  test("formatIdNumber formats Indonesian numbers with dot separator", () => {
    expect(formatIdNumber(25000)).toBe("25.000");
    expect(formatIdNumber(1500000)).toBe("1.500.000");
  });
});
