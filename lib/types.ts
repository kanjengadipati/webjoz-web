export type ApiSuccessResponse<T> = {
  status: "success";
  message: string;
  data: T;
  meta?: Record<string, unknown>;
};

export type Suggestion = {
  title: string;
  description?: string;
  action: string;
  url?: string;
  priority: "primary" | "secondary" | "tertiary" | string;
};

export type ApiErrorResponse = {
  status: "error" | "failed";
  message: string;
  code?: string;
  details?: string;
  suggestions?: Suggestion[];
  docs_url?: string;
  support_url?: string;
  errors?: unknown;
  meta?: Record<string, unknown>;
};

export type ApiEnvelope<T> = ApiSuccessResponse<T> | ApiErrorResponse;

export type LoginResponse = {
  access_token: string;
};

export type Profile = {
  id: number;
  name: string;
  email: string;
  phone_number?: string;
  role: string;
  is_verified: boolean;
  phone_verified?: boolean;
  email_verified?: boolean;
  permissions?: string[];
};

export type ProfileUpdate = Partial<Profile>;

export type AuditLog = {
  id: number;
  created_at?: string;
  action: string;
  resource: string;
  status: string;
  description?: string;
  ip_address?: string;
  actor_user_id?: number | null;
  user_agent?: string;
};

export type InvestigationResult = {
  summary: string;
  timeline: string[];
  suspicious_signals: string[];
  recommendations: string[];
};

export type InvestigationHistory = {
  id: number;
  created_at: string;
  created_by_user_id?: number | null;
  resource: string;
  status: string;
  ai_provider: string;
  ai_model: string;
  summary: string;
  timeline: string[];
  suspicious_signals: string[];
  recommendations: string[];
  log_count: number;
};

export type Session = {
  id: number;
  device_id: string;
  user_agent: string;
  ip_address: string;
  created_at: string;
  updated_at: string;
  expired_at: string;
  is_current: boolean;
};

export type User = {
  id: number;
  name: string;
  email: string;
  phone_number?: string;
  role: string;
  is_verified: boolean;
  phone_verified?: boolean;
  email_verified?: boolean;
};

export enum SectionState {
  IDLE = "idle",
  LOADING = "loading",
  ERROR = "error",
  SUCCESS = "success",
}
