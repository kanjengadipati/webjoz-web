export interface SiteWizardProps {
  mode: "public" | "dashboard";
  token: string | null;
  authReady?: boolean;
  tenantLoading?: boolean;
  activeTenantId: number | string | null;
  memberships?: { tenant: { id: number | string } }[];
  createTenant?: (name: string, slug: string) => Promise<{ id: number | string } | null>;
  onNeedAuth?: () => void;
}

export type Message = {
  id: string;
  sender: "ai" | "user";
  text: string;
  widget?: "type-chips" | "detail-inputs" | "inference-confirm" | "subtype-chips";
};

export type PreviewData = {
  content: Record<string, any>;
  design_token: Record<string, any>;
  template_id?: string;
};

export type ChatStage = "name" | "description" | "type" | "done";
export type InferenceConfidence = "high" | "medium" | "low";
export type InferenceResult = {
  type?: string;
  subType?: string;
  confidence: InferenceConfidence;
};

export type PreviewState = "wireframe" | "loading" | "result";

export type PreviewDevice = "desktop" | "mobile";

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
