import React from "react";
import {
  TemplateDynamicWithCart,
  TemplateKuliner,
  TemplateJasa,
  TemplateProduk,
  TemplateElegant,
  TemplateNatural,
  TemplateColorful,
  TemplateMinimalist,
  TemplateBold,
  type TemplateProps,
} from "@/components/templates";

export function selectTemplate(businessType: string): string {
  const lower = businessType.toLowerCase();

  if (lower.includes("kafe") || lower.includes("cafe") || lower.includes("kopi") ||
    lower.includes("restoran") || lower.includes("warung") || lower.includes("bakery") ||
    lower.includes("catering") || lower.includes("kuliner")) return "TEMPLATE_KULINER01";
  if (lower.includes("jasa") || lower.includes("konsultan") || lower.includes("agensi") ||
    lower.includes("fotografer") || lower.includes("klinik") || lower.includes("dokter")) return "TEMPLATE_JASA02";
  if (lower.includes("produk") || lower.includes("toko") || lower.includes("retail") ||
    lower.includes("fashion") || lower.includes("elektronik") || lower.includes("umkm") ||
    lower.includes("online") || lower.includes("minuman") || lower.includes("bubble") ||
    lower.includes("boba")) return "TEMPLATE_PRODUK03";
  if (lower.includes("properti") || lower.includes("konstruksi") || lower.includes("hotel") ||
    lower.includes("travel") || lower.includes("pendidikan") || lower.includes("manufaktur")) return "TEMPLATE_JASA02";

  return "TEMPLATE_DYNAMIC";
}

export function getTemplateComponent(templateId: string): React.ComponentType<TemplateProps> {
  switch (templateId) {
    case "TEMPLATE_KULINER01": return TemplateKuliner;
    case "TEMPLATE_JASA02": return TemplateJasa;
    case "TEMPLATE_PRODUK03": return TemplateProduk;
    case "TEMPLATE_ELEGANT": return TemplateElegant;
    case "TEMPLATE_NATURAL": return TemplateNatural;
    case "TEMPLATE_COLORFUL": return TemplateColorful;
    case "TEMPLATE_MINIMALIST": return TemplateMinimalist;
    case "TEMPLATE_BOLD": return TemplateBold;
    default: return TemplateDynamicWithCart;
  }
}

export function formatText(text: string, isUser: boolean) {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className={`font-bold ${isUser ? "text-white" : "text-slate-950"}`}>
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <React.Fragment key={i}>{part}</React.Fragment>;
  });
}

export function capitalizeWords(val: string): string {
  return val
    .split(/\s+/)
    .map((w) => (w.length > 0 ? w[0].toUpperCase() + w.slice(1).toLowerCase() : ""))
    .join(" ");
}

export function normalizeWhatsapp(val: string): string {
  const digits = val.replace(/\D/g, "");
  return digits.startsWith("0") ? "62" + digits.slice(1) : digits;
}

export function generateSubdomain(name: string): string {
  return (
    name.toLowerCase().replace(/[^a-z0-9-]/g, "") +
    "-" +
    Math.floor(Math.random() * 9000 + 1000)
  );
}

export function generateSlug(name: string): string {
  return (
    name.toLowerCase().replace(/[^a-z0-9-]/g, "") +
    "-" +
    Math.floor(Math.random() * 1000)
  );
}

export function calculateProgress(chatStage: string): number {
  switch (chatStage) {
    case "name": return 15;
    case "type": return 28;
    case "service_area": return 55;
    case "whatsapp": return 70;
    case "confirm": return 100;
    case "done": return 100;
    default: return 100;
  }
}

export function getStageNumber(chatStage: string): number {
  switch (chatStage) {
    case "name": return 1;
    case "type": return 2;
    case "service_area": return 3;
    case "whatsapp": return 4;
    case "confirm": return 5;
    case "done": return 5;
    default: return 1;
  }
}
