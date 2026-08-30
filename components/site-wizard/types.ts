export interface SiteWizardProps {
  mode: "public" | "dashboard";
  token: string | null;
  authReady?: boolean;
  tenantLoading?: boolean;
  activeTenantId: number | string | null;
  memberships?: { tenant: { id: number | string } }[];
  createTenant?: (name: string, slug: string, referralCode?: string) => Promise<{ id: number | string } | null>;
  onNeedAuth?: () => void;
  initialBusinessType?: string;
  initialBusinessSubType?: string;
  /** Design token yang dipilih user dari galeri landing page (starting point visual). */
  initialDesignToken?: Record<string, any>;
}

export type Message = {
  id: string;
  sender: "ai" | "user";
  text: string;
  widget?: "type-chips" | "detail-inputs" | "inference-confirm" | "subtype-chips" | "mood-chips" | "language-chips" | "stt-review-confirm" | "name-confirm";
  sttTranscript?: string;
  /** Mood value yang dipilih user — dipakai untuk render SVG icon di bubble */
  moodValue?: string;
  isPreparing?: boolean;
};

export type PreviewData = {
  content: Record<string, any>;
  design_token: Record<string, any>;
  template_id?: string;
};

export type ChatStage = "name" | "description" | "type" | "language" | "mood" | "done";
export type InferenceConfidence = "high" | "medium" | "low";
export type InferenceResult = {
  type?: string;
  subType?: string;
  confidence: InferenceConfidence;
};

export type PreviewState = "wireframe" | "loading" | "result";

export type PreviewDevice = "desktop" | "tablet" | "mobile";

export type BusinessTypeItem = {
  value: string;
  emoji: string;
  label: string;
  desc: string;
};

export type SubTypeItem = {
  value: string;
  emoji: string;
  label: string;
};

export type MoodItem = {
  value: string;
  emoji: string;
  label: string;
  desc: string;
  palette: [string, string, string]; // [bg, primary, accent]
  font: string;
  fontPreview?: string;
  suitableFor?: string;
  dark?: boolean;
};
