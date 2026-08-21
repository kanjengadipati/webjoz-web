import type { ChatStage, InferenceResult, Message, PreviewData } from "./types";

export const WIZARD_RESUME_KEY = "webjoz_wizard_resume_v1";

export interface WizardResumeChat {
  chatStage: ChatStage;
  messages: Message[];
  businessName: string;
  businessType: string;
  businessSubType: string;
  description: string;
  whatsapp: string;
  serviceArea: string;
  mood: string;
  siteLanguage: "id" | "en" | null;
  awaitingNameConfirm: boolean;
  awaitingInferenceConfirm: boolean;
  inferenceResult: InferenceResult | null;
  suggestedHint: { type?: string; subType?: string } | null;
  typeWasInferred: boolean;
}

export interface WizardResumePreview {
  templateId?: string;
  content: Record<string, any>;
  designToken: Record<string, any>;
}

export interface WizardResumeSnapshot {
  version: 1;
  savedAt: number;
  businessName: string;
  chat: WizardResumeChat;
  preview?: WizardResumePreview;
}

const VALID_STAGES: ChatStage[] = ["name", "description", "type", "language", "mood", "done"];

function sanitizeMessages(messages: Message[]): Message[] {
  return Array.isArray(messages)
    ? messages.filter(
        (m) =>
          m &&
          typeof m.text === "string" &&
          (m.sender === "ai" || m.sender === "user") &&
          m.id !== "typing"
      )
    : [];
}

export function loadWizardSnapshot(): WizardResumeSnapshot | null {
  try {
    const raw = window.localStorage.getItem(WIZARD_RESUME_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as WizardResumeSnapshot;
    if (
      !parsed ||
      typeof parsed !== "object" ||
      !parsed.chat ||
      !VALID_STAGES.includes(parsed.chat.chatStage)
    ) {
      return null;
    }
    return {
      ...parsed,
      chat: {
        ...parsed.chat,
        messages: sanitizeMessages(parsed.chat.messages),
      },
      preview: parsed.preview && parsed.preview.content ? parsed.preview : undefined,
    };
  } catch {
    return null;
  }
}

export function saveWizardSnapshot(snapshot: WizardResumeSnapshot): void {
  try {
    window.localStorage.setItem(WIZARD_RESUME_KEY, JSON.stringify(snapshot));
  } catch {
    /* ignore quota errors */
  }
}

export function clearWizardSnapshot(): void {
  try {
    window.localStorage.removeItem(WIZARD_RESUME_KEY);
  } catch {
    /* ignore */
  }
}

export function snapshotHasProgress(snapshot: WizardResumeSnapshot | null): boolean {
  if (!snapshot) return false;
  return (
    Boolean(snapshot.businessName) ||
    snapshot.chat.messages.length > 1 ||
    Boolean(snapshot.preview)
  );
}

export const WIZARD_PENDING_UPGRADE_KEY = "webjoz_pending_upgrade_site";

export interface PendingUpgradeSiteDraft {
  businessName: string;
  businessType: string;
  businessSubType?: string;
  description?: string;
  whatsapp?: string;
  serviceArea?: string;
  mood?: string;
  templateId?: string;
  previewContent?: Record<string, any>;
  previewDesignToken?: Record<string, any>;
  savedAt: number;
}

export function savePendingUpgradeDraft(draft: PendingUpgradeSiteDraft): void {
  try {
    window.localStorage.setItem(WIZARD_PENDING_UPGRADE_KEY, JSON.stringify(draft));
  } catch {}
}

export function loadPendingUpgradeDraft(): PendingUpgradeSiteDraft | null {
  try {
    const raw = window.localStorage.getItem(WIZARD_PENDING_UPGRADE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as PendingUpgradeSiteDraft;
  } catch {
    return null;
  }
}

export function clearPendingUpgradeDraft(): void {
  try {
    window.localStorage.removeItem(WIZARD_PENDING_UPGRADE_KEY);
  } catch {}
}


export function toResumePreview(preview: PreviewData): WizardResumePreview {
  return {
    templateId: preview.template_id,
    content: preview.content,
    designToken: preview.design_token,
  };
}
