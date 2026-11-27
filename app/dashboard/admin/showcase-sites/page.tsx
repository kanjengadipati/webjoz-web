"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useAuthToken } from "@/lib/auth-store";
import { usePermissions } from "@/hooks/use-permissions";
import { useToast } from "@/components/toast-provider";
import { useI18n } from "@/lib/i18n/context";
import {
  fetchAdminShowcase,
  fetchShowcaseCandidates,
  saveAdminShowcase,
  type ShowcaseArchetypeOption,
  type ShowcaseCandidate,
} from "@/lib/api/showcase";
import { archetypeLabel } from "@/lib/showcase-archetypes";
import { ArchetypeIcon } from "@/components/archetype-icon";
import { useRealSiteData } from "@/lib/mockup-showcase-sites";
import { TemplatePreview } from "@/components/landing-template-showcase";
import { ArrowDown, ArrowUp, ExternalLink, Eye, Monitor, Plus, Search, ShieldOff, Smartphone, Trash2 } from "lucide-react";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CustomSelect,
  Dialog,
  EmptyState,
  FormField,
  Input,
  Spinner,
} from "webjoz-ui";

/** One row of the curated list as edited on this page. */
interface DraftItem {
  site_id: string;
  business_name: string;
  /** "" = use the website's own archetype */
  archetype_override: string;
  site_name: string;
  host: string;
  url: string;
  /** archetype the website itself carries (shown as the default) */
  own_archetype: string;
}

function errorMessage(err: unknown, fallback: string): string {
  return err instanceof Error && err.message ? err.message : fallback;
}

function serialize(items: DraftItem[]): string {
  return JSON.stringify(items.map((i) => [i.site_id, i.business_name.trim(), i.archetype_override]));
}

export default function AdminShowcaseSitesPage() {
  const token = useAuthToken();
  const { pushToast } = useToast();
  const { isIndonesian } = useI18n();
  const { role } = usePermissions();
  const isAdmin = role === "superadmin" || role === "admin";

  const tr = useCallback((id: string, en: string) => (isIndonesian ? id : en), [isIndonesian]);

  const [items, setItems] = useState<DraftItem[]>([]);
  const [savedSnapshot, setSavedSnapshot] = useState("[]");
  const [archetypes, setArchetypes] = useState<ShowcaseArchetypeOption[]>([]);
  const [candidates, setCandidates] = useState<ShowcaseCandidate[]>([]);
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingCandidates, setLoadingCandidates] = useState(false);
  const [saving, setSaving] = useState(false);
  const [previewTarget, setPreviewTarget] = useState<{
    name: string;
    host: string;
    url: string;
    candidate?: ShowcaseCandidate;
  } | null>(null);
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "mobile">("desktop");

  const previewData = useRealSiteData(previewTarget?.host ?? null);

  const dirty = useMemo(() => serialize(items) !== savedSnapshot, [items, savedSnapshot]);

  // Current curated list. The API already drops entries whose site was
  // unpublished/locked, so what we load is always valid.
  const loadList = useCallback(async () => {
    if (!token || !isAdmin) return;
    try {
      setLoading(true);
      const res = await fetchAdminShowcase(token);
      const raw = res.data?.items ?? [];
      const next: DraftItem[] = raw.map((it) => ({
        site_id: it.site_id,
        business_name: it.business_name,
        archetype_override: it.archetype_override ?? "",
        site_name: it.site_name,
        host: it.host,
        url: it.url,
        own_archetype: it.own_archetype ?? "",
      }));
      setItems(next);
      setSavedSnapshot(serialize(next));
      setArchetypes(res.data?.archetypes ?? []);
    } catch (err) {
      pushToast(errorMessage(err, tr("Gagal memuat showcase", "Failed to load showcase")), "error");
    } finally {
      setLoading(false);
    }
  }, [token, isAdmin, pushToast, tr]);

  const loadCandidates = useCallback(async () => {
    if (!token || !isAdmin) return;
    try {
      setLoadingCandidates(true);
      const res = await fetchShowcaseCandidates(token, query);
      setCandidates(res.data ?? []);
    } catch (err) {
      pushToast(errorMessage(err, tr("Gagal memuat daftar website", "Failed to load websites")), "error");
    } finally {
      setLoadingCandidates(false);
    }
  }, [token, isAdmin, query, pushToast, tr]);

  useEffect(() => {
    void loadList();
  }, [loadList]);

  useEffect(() => {
    void loadCandidates();
  }, [loadCandidates]);

  const selectedIds = useMemo(() => new Set(items.map((i) => i.site_id)), [items]);

  const addCandidate = (c: ShowcaseCandidate) => {
    if (selectedIds.has(c.site_id)) return;
    setItems((prev) => [
      ...prev,
      {
        site_id: c.site_id,
        business_name: c.business_name || c.site_name,
        archetype_override: "",
        site_name: c.site_name,
        host: c.host,
        url: c.url,
        own_archetype: c.own_archetype ?? "",
      },
    ]);
  };

  const update = (siteId: string, patch: Partial<DraftItem>) =>
    setItems((prev) => prev.map((i) => (i.site_id === siteId ? { ...i, ...patch } : i)));

  const remove = (siteId: string) => setItems((prev) => prev.filter((i) => i.site_id !== siteId));

  const move = (index: number, dir: -1 | 1) =>
    setItems((prev) => {
      const target = index + dir;
      if (target < 0 || target >= prev.length) return prev;
      const next = prev.slice();
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });

  const handleSave = async () => {
    if (!token) return;
    try {
      setSaving(true);
      const res = await saveAdminShowcase(
        token,
        items.map((i) => ({
          site_id: i.site_id,
          business_name: i.business_name.trim(),
          archetype: i.archetype_override,
        })),
      );
      const saved = res.data?.items ?? [];
      // Re-sync from the server so the UI mirrors exactly what is stored.
      setSavedSnapshot(serialize(items));
      pushToast(
        tr(`Showcase disimpan (${saved.length} website)`, `Showcase saved (${saved.length} websites)`),
        "success",
      );
      void loadCandidates();
    } catch (err) {
      pushToast(errorMessage(err, tr("Gagal menyimpan showcase", "Failed to save showcase")), "error");
    } finally {
      setSaving(false);
    }
  };

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center h-80 text-muted-foreground gap-4">
        <ShieldOff className="size-12 opacity-40" />
        <p className="text-sm">{tr("Halaman ini hanya untuk admin.", "This page is for admins only.")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <p className="max-w-2xl text-sm text-muted-foreground">
          {tr(
            "Pilih website hasil generate milik admin/superadmin yang sudah published. Daftar ini dipakai oleh Interactive Mockup di landing page dan halaman Inspirasi Website.",
            "Pick published, generated websites owned by an admin/superadmin. This list powers the landing-page Interactive Mockup and the Website Inspiration modal.",
          )}
        </p>
        <Button onClick={handleSave} disabled={!dirty} loading={saving} className="gap-2">
          {tr("Simpan", "Save")}
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* ── Selected (ordered) ───────────────────────────────────────── */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-base">
              <span>{tr("Showcase aktif", "Active showcase")}</span>
              <Badge variant="secondary">{items.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {loading ? (
              <div className="flex items-center justify-center py-10">
                <Spinner size="md" variant="muted" />
              </div>
            ) : items.length === 0 ? (
              <EmptyState
                title={tr("Belum ada showcase aktif", "No active showcase")}
                text={tr(
                  "Tambahkan website dari daftar di sebelah. Selama kosong, mockup memakai preview template lokal.",
                  "Add websites from the list on the right. While empty, the mockup uses the local template preview.",
                )}
                icon={<Plus className="size-5 text-primary" />}
                className="min-h-44"
              />
            ) : (
              items.map((item, index) => (
                <div key={item.site_id} className="space-y-2 rounded-xl border border-border/70 bg-background/60 p-3">
                  <div className="flex items-center gap-2">
                    <Input
                      value={item.business_name}
                      onChange={(e) => update(item.site_id, { business_name: e.target.value })}
                      placeholder={tr("Nama bisnis (tampil di chat mockup)", "Business name (shown in the mockup chat)")}
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setPreviewTarget({
                          name: item.business_name || item.site_name,
                          host: item.host,
                          url: item.url,
                        })
                      }
                      aria-label={tr("Pratinjau", "Preview")}
                      title={tr("Pratinjau website", "Preview website")}
                    >
                      <Eye className="size-3.5" />
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => move(index, -1)}
                      disabled={index === 0}
                      aria-label={tr("Naikkan", "Move up")}
                    >
                      <ArrowUp className="size-3.5" />
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => move(index, 1)}
                      disabled={index === items.length - 1}
                      aria-label={tr("Turunkan", "Move down")}
                    >
                      <ArrowDown className="size-3.5" />
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => remove(item.site_id)}
                      aria-label={tr("Hapus", "Remove")}
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 font-mono text-[11px] text-muted-foreground hover:text-foreground hover:underline"
                    >
                      {item.host}
                      <ExternalLink className="size-3" />
                    </a>
                    <div className="w-full min-w-[220px] sm:w-auto sm:min-w-[260px]">
                      <FormField label={tr("Kategori", "Category")}>
                        <CustomSelect
                          size="sm"
                          value={item.archetype_override}
                          onChange={(value) => update(item.site_id, { archetype_override: value })}
                          options={[
                            {
                              value: "",
                              icon: item.own_archetype ? (
                                <ArchetypeIcon id={item.own_archetype} className="size-3.5 text-muted-foreground" />
                              ) : undefined,
                              label: item.own_archetype
                                ? `${tr("Otomatis", "Auto")}: ${archetypeLabel(item.own_archetype, isIndonesian)}`
                                : tr("Otomatis (dari website)", "Auto (from website)"),
                            },
                            ...archetypes.map((a) => ({
                              value: a.id,
                              icon: <ArchetypeIcon id={a.id} className="size-3.5 text-muted-foreground" />,
                              label: archetypeLabel(a.id, isIndonesian, a),
                            })),
                          ]}
                        />
                      </FormField>
                    </div>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* ── Candidates: published, admin/superadmin-owned ─────────────── */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{tr("Website published (admin/superadmin)", "Published websites (admin/superadmin)")}</CardTitle>
            <div className="relative mt-2">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") setQuery(search);
                }}
                onBlur={() => setQuery(search)}
                placeholder={tr("Cari nama / subdomain…", "Search name / subdomain…")}
                className="pl-9"
              />
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {loadingCandidates ? (
              <div className="flex items-center justify-center py-10">
                <Spinner size="md" variant="muted" />
              </div>
            ) : candidates.length === 0 ? (
              <EmptyState
                title={tr("Tidak ada website", "No websites found")}
                text={tr(
                  "Belum ada website published milik admin/superadmin yang cocok dengan pencarian.",
                  "No published websites owned by an admin/superadmin match this search.",
                )}
                icon={<Search className="size-5 text-muted-foreground" />}
                className="min-h-44"
              />
            ) : (
              candidates.map((c) => {
                const picked = selectedIds.has(c.site_id);
                return (
                  <div
                    key={c.site_id}
                    className="flex items-center justify-between gap-3 rounded-xl border border-border/70 bg-background/60 p-3"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-foreground">{c.site_name}</p>
                      <p className="truncate font-mono text-[11px] text-muted-foreground">{c.host}</p>
                      <div className="mt-1 flex flex-wrap items-center gap-1.5">
                        {c.archetype ? (
                          <Badge variant="secondary" className="inline-flex items-center gap-1">
                            <ArchetypeIcon id={c.archetype} className="size-3" />
                            <span>{archetypeLabel(c.archetype, isIndonesian)}</span>
                          </Badge>
                        ) : (
                          <Badge variant="outline">{tr("Kategori belum ada", "No category")}</Badge>
                        )}
                        {c.owner_name && (
                          <span className="text-[11px] text-muted-foreground">
                            {c.owner_name} · {c.owner_role}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-1.5">
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          setPreviewTarget({
                            name: c.business_name || c.site_name,
                            host: c.host,
                            url: c.url,
                            candidate: c,
                          })
                        }
                        aria-label={tr("Pratinjau", "Preview")}
                        title={tr("Pratinjau website", "Preview website")}
                        className="gap-1"
                      >
                        <Eye className="size-3.5" />
                        <span className="hidden sm:inline">{tr("Lihat", "Preview")}</span>
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant={picked ? "outline" : "default"}
                        disabled={picked}
                        onClick={() => addCandidate(c)}
                        className="gap-1"
                      >
                        <Plus className="size-3.5" />
                        {picked ? tr("Dipilih", "Added") : tr("Tambah", "Add")}
                      </Button>
                    </div>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>
      </div>

      {/* ── Popup Preview Website ─────────────────────────────────────── */}
      <Dialog
        open={!!previewTarget}
        onOpenChange={(nextOpen) => {
          if (!nextOpen) setPreviewTarget(null);
        }}
        size="xl"
        backdrop="subtle"
        className="sm:!max-w-4xl"
        style={{ maxWidth: "min(920px, calc(100vw - 1.5rem))" }}
        title={
          <div className="flex items-center justify-between gap-2.5 w-full">
            <div className="min-w-0">
              <span className="block font-bold text-sm sm:text-base text-foreground truncate">
                {previewTarget?.name}
              </span>
              {previewTarget?.url && (
                <a
                  href={previewTarget.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-mono text-[11px] font-normal text-muted-foreground hover:text-foreground hover:underline truncate"
                >
                  <span>{previewTarget.host}</span>
                  <ExternalLink className="size-3 shrink-0" />
                </a>
              )}
            </div>
            <div className="flex items-center bg-muted/80 p-0.5 rounded-lg border border-border/60 shrink-0">
              <Button
                type="button"
                size="sm"
                variant={previewDevice === "mobile" ? "secondary" : "ghost"}
                onClick={() => setPreviewDevice("mobile")}
                title={tr("Tampilan HP", "Mobile view")}
                aria-label={tr("Tampilan HP", "Mobile view")}
                className="gap-0"
              >
                <Smartphone className="size-3.5" />
              </Button>
              <Button
                type="button"
                size="sm"
                variant={previewDevice === "desktop" ? "secondary" : "ghost"}
                onClick={() => setPreviewDevice("desktop")}
                title={tr("Tampilan Desktop", "Desktop view")}
                aria-label={tr("Tampilan Desktop", "Desktop view")}
                className="gap-0"
              >
                <Monitor className="size-3.5" />
              </Button>
            </div>
          </div>
        }
        footer={
          <div className="flex items-center justify-end gap-2 w-full">
            <Button type="button" variant="outline" onClick={() => setPreviewTarget(null)}>
              {tr("Tutup", "Close")}
            </Button>
            {previewTarget?.candidate && !selectedIds.has(previewTarget.candidate.site_id) && (
              <Button
                type="button"
                onClick={() => {
                  if (previewTarget.candidate) addCandidate(previewTarget.candidate);
                  setPreviewTarget(null);
                }}
                className="gap-1.5"
              >
                <Plus className="size-4" />
                {tr("Tambahkan ke Showcase", "Add to Showcase")}
              </Button>
            )}
          </div>
        }
      >
        <div className="h-[68dvh] sm:h-[65vh] overflow-y-auto rounded-xl border border-border/70 bg-muted/30 p-1.5 sm:p-3">
          <div
            className={`rounded-lg overflow-hidden border border-border/50 shadow-sm bg-white transition-all duration-200 min-h-[240px] flex items-center justify-center ${
              previewDevice === "mobile" ? "max-w-[390px] mx-auto w-full" : "w-full"
            }`}
          >
            {!previewData || !previewData.content ? (
              <div className="flex flex-col items-center justify-center p-8 gap-2.5 text-muted-foreground">
                <Spinner size="md" />
                <span className="text-xs">
                  {tr("Memuat pratinjau website…", "Loading website preview…")}
                </span>
              </div>
            ) : (
              <TemplatePreview
                key={`${previewTarget?.host}-${previewDevice}`}
                templateId={previewData.templateId || "TEMPLATE_DYNAMIC"}
                content={previewData.content}
                designToken={previewData.design_token}
                scaleBase={previewDevice === "mobile" ? 390 : 1280}
                scrollable
              />
            )}
          </div>
        </div>
      </Dialog>
    </div>
  );
}
