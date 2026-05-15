"use client";

import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { Button, Card, CardContent, CardHeader, EmptyState, Input, Label, SectionTitle, StatusBadge } from "@/components/ui";
import { useToast } from "@/components/toast-provider";
import { fetchInvestigationDetail, fetchInvestigationHistory, investigateLogs } from "@/lib/api";
import { useAuthToken } from "@/lib/auth-store";
import { cn } from "@/lib/utils";
import type { InvestigationHistory, InvestigationResult } from "@/lib/types";

const loadingMessages = [
  "Clustering matching audit events...",
  "Building incident timeline...",
  "Cross-checking suspicious signals...",
  "Drafting recommendations for the operator...",
];

export default function InvestigatePage() {
  const token = useAuthToken();
  const { pushToast } = useToast();
  const [payload, setPayload] = useState({ resource: "auth", status: "failed", action: "", search: "", limit: 25, dateFrom: "", dateTo: "" });
  const [result, setResult] = useState<InvestigationResult | null>(null);
  const [meta, setMeta] = useState<Record<string, unknown> | null>(null);
  const [history, setHistory] = useState<InvestigationHistory[]>([]);
  const [selected, setSelected] = useState<InvestigationHistory | null>(null);
  const [loadingIndex, setLoadingIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (token) {
      void loadHistory(1);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  useEffect(() => {
    if (!isLoading) return;
    const id = window.setInterval(() => {
      setLoadingIndex((current) => (current + 1) % loadingMessages.length);
    }, 900);
    return () => window.clearInterval(id);
  }, [isLoading]);

  async function loadHistory(currentPage = page) {
    if (!token) return;
    try {
      const response = await fetchInvestigationHistory(token, currentPage, 10);
      setHistory(response.data || []);
      if (response.meta?.total) {
        setTotalPages(Math.ceil((response.meta.total as number) / 10));
      }
    } catch (error) {
      pushToast(error instanceof Error ? error.message : "Failed to load history", "error");
    }
  }

  async function handleInvestigate() {
    if (!token) return;
    setIsLoading(true);
    setLoadingIndex(0);
    try {
      const body: Record<string, unknown> = {
        resource: payload.resource,
        status: payload.status,
        limit: payload.limit,
      };
      if (payload.action) body.action = payload.action;
      if (payload.search) body.search = payload.search;
      if (payload.dateFrom) body.date_from = new Date(payload.dateFrom).toISOString();
      if (payload.dateTo) body.date_to = new Date(payload.dateTo).toISOString();

      const response = await investigateLogs(token, body);
      setResult(response.data || null);
      setMeta(response.meta || null);
      pushToast("AI investigation completed.", "success");
      await loadHistory();
    } catch (error) {
      pushToast(error instanceof Error ? error.message : "Failed to investigate logs", "error");
    } finally {
      setIsLoading(false);
    }
  }

  async function openHistory(id: number) {
    if (!token) return;
    try {
      const response = await fetchInvestigationDetail(token, id);
      setSelected(response.data || null);
    } catch (error) {
      pushToast(error instanceof Error ? error.message : "Failed to load investigation detail", "error");
    }
  }

  const riskAssessment = useMemo(() => {
    if (!result) {
      return {
        level: "low",
        score: 0,
        note: "No investigation result loaded yet.",
      };
    }

    const signals = result.suspicious_signals.length;
    const recommendations = result.recommendations.length;
    const summary = result.summary.toLowerCase();
    const metaStatus = String(meta?.status || "").toLowerCase();
    const logCount = Number(meta?.log_count || 0);

    let score = 0;

    score += Math.min(signals * 18, 54);
    score += Math.min(recommendations * 6, 18);

    if (logCount >= 100) score += 15;
    else if (logCount >= 50) score += 10;
    else if (logCount >= 20) score += 5;

    if (metaStatus === "failed" || metaStatus === "denied") score += 12;

    const urgentKeywords = ["critical", "immediate", "urgent", "breach", "compromise", "blocked", "escalate"];
    if (urgentKeywords.some((keyword) => summary.includes(keyword))) {
      score += 16;
    }

    const level = score >= 60 ? "high" : score >= 28 ? "medium" : "low";
    const note =
      level === "high"
        ? "Escalate quickly. Multiple strong signals point to elevated account or access risk."
        : level === "medium"
          ? "Needs review. There are enough suspicious patterns to warrant operator follow-up."
          : "Monitor only. The current evidence suggests a lower-confidence incident.";

    return { level, score, note };
  }, [meta, result]);

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader className="border-b border-border/60">
          <SectionTitle
            eyebrow="AI Powered"
            title="Investigate with AI"
            action={
              <Button variant="secondary" onClick={() => void handleInvestigate()} disabled={isLoading} className="rounded-full px-6 font-bold">
                <svg className={cn("mr-2 size-3.5", isLoading && "motion-safe:animate-spin")} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 2v4" /><path d="m16.2 7.8 2.9-2.9" /><path d="M18 12h4" /><path d="m16.2 16.2 2.9 2.9" /><path d="M12 18v4" /><path d="m4.9 19.1 2.9-2.9" /><path d="M2 12h4" /><path d="m4.9 4.9 2.9 2.9" /></svg>
                {isLoading ? "Analyzing..." : "Run Investigation"}
              </Button>
            }
          />
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <Field label="Resource" value={payload.resource} onChange={(value) => setPayload((current) => ({ ...current, resource: value }))} />
            <Field label="Status" value={payload.status} onChange={(value) => setPayload((current) => ({ ...current, status: value }))} />
            <Field label="Action" value={payload.action} onChange={(value) => setPayload((current) => ({ ...current, action: value }))} placeholder="login" />
            <Field label="Search" value={payload.search} onChange={(value) => setPayload((current) => ({ ...current, search: value }))} placeholder="invalid credentials" />
            <Field label="Date From" type="datetime-local" value={payload.dateFrom} onChange={(value) => setPayload((current) => ({ ...current, dateFrom: value }))} />
            <Field label="Date To" type="datetime-local" value={payload.dateTo} onChange={(value) => setPayload((current) => ({ ...current, dateTo: value }))} />
          </div>
        </CardContent>
      </Card>

      <section className="grid items-start gap-6 xl:grid-cols-[minmax(0,1.12fr)_minmax(22rem,0.88fr)]">
        <Card className="overflow-hidden">
          <CardHeader className="border-b border-border/60 px-6 py-5">
            <CompactPanelHeader eyebrow={isLoading ? "Streaming analysis" : "Latest result"} title="AI Investigation Output" />
          </CardHeader>
          <CardContent className="p-6">
            {isLoading ? (
              <div className="space-y-4 animate-in fade-in duration-500">
                <div className="rounded-3xl bg-slate-950 px-6 py-8 text-white dark:bg-slate-900 shadow-2xl shadow-primary/10">
                  <div className="flex items-center gap-2">
                    <div className="size-2 rounded-full bg-muted-foreground animate-ping" />
                    <div className="text-xs uppercase tracking-[0.24em] text-slate-400 font-bold">AI Processing</div>
                  </div>
                  <div className="mt-4 text-2xl font-semibold tracking-tight leading-tight">{loadingMessages[loadingIndex]}</div>
                  <div className="mt-6 h-1.5 overflow-hidden rounded-full bg-white/5">
                    <div className="h-full w-full bg-gradient-to-r from-muted via-primary to-muted bg-[length:200%_100%] animate-shimmer rounded-full" />
                  </div>
                </div>
                <div className="grid gap-3">
                  <div className="animate-pulse rounded-2xl bg-slate-100 px-4 py-6 dark:bg-slate-800" />
                  <div className="animate-pulse rounded-2xl bg-slate-100 px-4 py-6 dark:bg-slate-800" />
                  <div className="animate-pulse rounded-2xl bg-slate-100 px-4 py-6 dark:bg-slate-800" />
                </div>
              </div>
            ) : result ? (
              <div className="space-y-5">
                <div className="rounded-3xl border border-border/70 bg-muted/35 p-5">
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Risk Level</div>
                    <div className="flex flex-col items-end">
                      <StatusBadge status={riskAssessment.level} />
                      <span className="mt-1 text-[10px] text-muted-foreground/60">Weighted by signals, urgency, log volume, and incident status</span>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between gap-3 text-sm">
                    <span className="text-muted-foreground">{riskAssessment.note}</span>
                    <span className="rounded-full border border-border/60 px-2.5 py-1 font-medium text-foreground/80">
                      Score {riskAssessment.score}
                    </span>
                  </div>
                  <p className="mt-4 text-base leading-8 text-foreground">{result.summary}</p>
                </div>
                <ResultList title="Timeline" items={result.timeline} />
                <ResultList title="Suspicious Signals" items={result.suspicious_signals} />
                <ResultList title="Recommendations" items={result.recommendations} />
                {meta ? <pre className="overflow-auto rounded-2xl border border-border/70 bg-muted/35 p-4 text-xs text-muted-foreground">{JSON.stringify(meta, null, 2)}</pre> : null}
              </div>
            ) : (
              <EmptyState
                className="min-h-64 border-none bg-muted/20"
                title="Ready for analysis"
                text="Run an investigation to generate a summary, timeline, suspicious signals, and recommendations."
                action={(
                  <Button
                    variant="secondary"
                    size="sm"
                    className="h-9 rounded-full px-5 font-bold"
                    onClick={() => void handleInvestigate()}
                    disabled={isLoading || !token}
                  >
                    Run Investigation
                  </Button>
                )}
              />
            )}
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader className="border-b border-border/60 px-6 py-5">
            <CompactPanelHeader
              eyebrow={`${history.length} saved`}
              title="Saved Investigations"
              action={(
                <Button variant="outline" size="sm" className="h-9 rounded-full px-5 font-bold" onClick={() => void loadHistory()}>
                  Refresh
                </Button>
              )}
            />
          </CardHeader>
          <CardContent className="space-y-3 p-6">
            {history.length === 0 ? (
              <EmptyState
                className="min-h-64 border-none bg-muted/20"
                title="No saved investigations"
                text="Completed investigations will appear here for quick review."
              />
            ) : (
              history.map((item) => (
                <button key={item.id} type="button" onClick={() => void openHistory(item.id)} className="w-full rounded-2xl border border-border/70 bg-muted/35 px-4 py-4 text-left transition hover:border-primary/40 hover:bg-primary/5">
                  <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-3">
                    <div className="min-w-0 flex-1">
                      <div className="font-medium">Investigation #{item.id}</div>
                      <div className="mt-1 text-sm text-muted-foreground line-clamp-2">{item.summary}</div>
                    </div>
                    <StatusBadge status={item.status} />
                  </div>
                </button>
              ))
            )}
          </CardContent>
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 pb-6">
              <Button variant="outline" disabled={page === 1} onClick={() => { setPage(p => p - 1); void loadHistory(page - 1); }}>Previous</Button>
              <div className="text-sm font-medium text-muted-foreground">Page {page} of {totalPages}</div>
              <Button variant="outline" disabled={page === totalPages} onClick={() => { setPage(p => p + 1); void loadHistory(page + 1); }}>Next</Button>
            </div>
          )}
        </Card>
      </section>

      {selected ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setSelected(null)} />
          <Card className="relative z-50 w-full max-w-2xl shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <CardHeader className="border-b border-border/60 flex flex-row items-center justify-between">
              <CompactPanelHeader eyebrow="Investigation Details" title={`#${selected.id}`} />
              <button onClick={() => setSelected(null)} className="rounded-full p-2 hover:bg-muted transition-colors" aria-label="Close investigation details">
                <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </CardHeader>
            <CardContent className="p-6 max-h-[70vh] overflow-y-auto">
              <div className="mb-6 flex items-center justify-between">
                 <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-medium">Status</div>
                 <StatusBadge status={selected.status} />
              </div>
              <div className="text-sm leading-8 text-foreground whitespace-pre-wrap">
                {selected.summary}
              </div>
            </CardContent>
          </Card>
        </div>
      ) : null}
    </div>
  );
}

function CompactPanelHeader({ eyebrow, title, action }: { eyebrow?: string; title: string; action?: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="min-w-0">
        {eyebrow ? <div className="mb-1 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">{eyebrow}</div> : null}
        <h2 className="text-2xl font-bold tracking-tight text-foreground">{title}</h2>
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

function Field({ label, value, onChange, type = "text", placeholder }: { label: string; value: string | number; onChange: (value: string) => void; type?: string; placeholder?: string }) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Input type={type} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} />
    </div>
  );
}

function ResultList({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <div className="text-sm font-semibold uppercase tracking-[0.22em] text-muted-foreground">{title}</div>
      <div className="mt-3 grid gap-3">
        {items.length === 0 ? (
          <EmptyState text="No items returned." />
        ) : (
          items.map((item, index) => (
            <div key={`${title}-${index}`} className="rounded-2xl border border-border/70 bg-muted/35 px-4 py-4 text-sm leading-7 text-foreground">
              {item}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
