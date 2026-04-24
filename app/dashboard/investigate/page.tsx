"use client";

import { useEffect, useMemo, useState } from "react";
import { Button, Card, CardContent, CardHeader, EmptyState, Input, Label, SectionTitle, StatusBadge } from "@/components/ui";
import { useToast } from "@/components/toast-provider";
import { fetchInvestigationDetail, fetchInvestigationHistory, investigateLogs } from "@/lib/api";
import { useAuthToken } from "@/lib/auth-store";
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

  useEffect(() => {
    if (!isLoading) return;
    const id = window.setInterval(() => {
      setLoadingIndex((current) => (current + 1) % loadingMessages.length);
    }, 900);
    return () => window.clearInterval(id);
  }, [isLoading]);

  async function loadHistory() {
    if (!token) return;
    try {
      const response = await fetchInvestigationHistory(token);
      setHistory(response.data || []);
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

  const riskLevel = useMemo(() => {
    const signals = result?.suspicious_signals.length || 0;
    if (signals >= 3) return "high";
    if (signals >= 1) return "medium";
    return "low";
  }, [result?.suspicious_signals.length]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="border-b border-border/60">
          <SectionTitle eyebrow="Killer Feature" title="Investigate with AI" action={<Button onClick={() => void handleInvestigate()}>Run Investigation</Button>} />
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

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <CardHeader className="border-b border-border/60">
            <SectionTitle eyebrow={isLoading ? "streaming analysis" : "latest result"} title="AI Investigation Output" />
          </CardHeader>
          <CardContent className="pt-6">
          {isLoading ? (
            <div className="space-y-4">
              <div className="rounded-3xl bg-slate-950 px-5 py-6 text-white dark:bg-slate-900">
                <div className="text-xs uppercase tracking-[0.24em] text-slate-400">Thinking</div>
                <div className="mt-3 text-2xl font-semibold">{loadingMessages[loadingIndex]}</div>
                <div className="mt-4 h-1 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full w-1/3 animate-pulse rounded-full bg-orange-400" />
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
                  <StatusBadge status={riskLevel} />
                </div>
                <p className="mt-4 text-base leading-8 text-foreground">{result.summary}</p>
              </div>
              <ResultList title="Timeline" items={result.timeline} />
              <ResultList title="Suspicious Signals" items={result.suspicious_signals} />
              <ResultList title="Recommendations" items={result.recommendations} />
              {meta ? <pre className="overflow-auto rounded-2xl border border-border/70 bg-muted/35 p-4 text-xs text-muted-foreground">{JSON.stringify(meta, null, 2)}</pre> : null}
            </div>
          ) : (
            <EmptyState text="Run an AI investigation to generate a summary, timeline, suspicious signals, and recommendations." />
          )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="border-b border-border/60">
            <SectionTitle eyebrow={String(history.length)} title="Saved Investigations" action={<Button variant="outline" onClick={() => void loadHistory()}>Refresh</Button>} />
          </CardHeader>
          <CardContent className="space-y-3 pt-6">
            {history.length === 0 ? (
              <EmptyState text="No saved investigations loaded yet." />
            ) : (
              history.map((item) => (
                <button key={item.id} type="button" onClick={() => void openHistory(item.id)} className="w-full rounded-2xl border border-border/70 bg-muted/35 px-4 py-4 text-left transition hover:border-primary/40 hover:bg-primary/5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-medium">Investigation #{item.id}</div>
                      <div className="mt-1 text-sm text-muted-foreground">{item.summary}</div>
                    </div>
                    <StatusBadge status={item.status} />
                  </div>
                </button>
              ))
            )}
          </CardContent>
          {selected ? (
            <div className="mx-6 mb-6 rounded-2xl border border-border/70 bg-background/70 p-4">
              <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Selected Investigation</div>
              <div className="mt-2 text-lg font-semibold">#{selected.id}</div>
              <p className="mt-2 text-sm leading-7 text-muted-foreground">{selected.summary}</p>
            </div>
          ) : null}
        </Card>
      </section>
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
