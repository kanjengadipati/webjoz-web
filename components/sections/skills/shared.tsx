import type { DesignToken, TemplateProps, SkillGroup, SkillItem } from "@/components/templates/types";

export interface SkillsVariantProps {
  skills: NonNullable<TemplateProps["content"]["skills"]>;
  design_token?: DesignToken | null;
  language?: "id" | "en";
  onUpdateField?: (section: string, key: string, value: any) => void;
  isEditorMode?: boolean;
  isSelected?: boolean;
  collapseSheetForInlineEdit?: () => void;
  onEditingStateChange?: (isEditing: boolean) => void;
}

export function getLevelPercent(level?: "beginner" | "intermediate" | "expert"): number {
  switch (level) {
    case "beginner":
      return 33;
    case "intermediate":
      return 66;
    case "expert":
      return 100;
    default:
      return 75;
  }
}

export function getLevelLabel(level?: "beginner" | "intermediate" | "expert", lang: "id" | "en" = "id"): string {
  if (!level) return "";
  if (lang === "en") {
    switch (level) {
      case "beginner":
        return "Beginner";
      case "intermediate":
        return "Intermediate";
      case "expert":
        return "Expert";
    }
  }
  switch (level) {
    case "beginner":
      return "Pemula";
    case "intermediate":
      return "Menengah";
    case "expert":
      return "Mahir";
  }
}
