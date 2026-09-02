"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useAuthToken } from "@/lib/auth-store";
import { useActiveTenant } from "@/lib/tenant-store";
import { request } from "@/lib/api/client";
import { Button, Card, CardContent, CardHeader, CardTitle, Input } from "@/components/ui";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/toast-provider";
import { LayoutGrid, List, Star, AlignLeft, Loader2, FileText, Plus, ChevronLeft, Check } from "lucide-react";
import { SparkleGenAI } from "@/components/sparkle-icon";
import Link from "next/link";
import { SiteSubNav } from "@/components/site-sub-nav";
import type { BlogLayout } from "@/components/templates/types";
import { useI18n } from "@/lib/i18n/context";
import { decodeSiteId } from "@/lib/sqids";

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  status: string;
  published_at: string | null;
  created_at: string;
}

const LAYOUT_OPTIONS: { value: BlogLayout; label: string; icon: any; desc: string }[] = [
  { value: "grid", label: "dashboard.sitesBlog.layoutGrid", icon: LayoutGrid, desc: "dashboard.sitesBlog.layoutGridDesc" },
  { value: "list", label: "dashboard.sitesBlog.layoutList", icon: List, desc: "dashboard.sitesBlog.layoutListDesc" },
  { value: "featured", label: "dashboard.sitesBlog.layoutFeatured", icon: Star, desc: "dashboard.sitesBlog.layoutFeaturedDesc" },
  { value: "minimal", label: "dashboard.sitesBlog.layoutMinimal", icon: AlignLeft, desc: "dashboard.sitesBlog.layoutMinimalDesc" },
];

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  status: string;
  published_at: string | null;
  created_at: string;
}

export default function BlogManagerPage() {
  const { id } = useParams();
  const { t, locale } = useI18n();
  const token = useAuthToken();
  const { activeTenantId, activeTenant } = useActiveTenant();
  const { pushToast } = useToast();
  const isPremium = activeTenant?.tenant?.plan === "pro" || activeTenant?.tenant?.plan === "enterprise";

  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  const [topic, setTopic] = useState("");
  const [generating, setGenerating] = useState(false);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [creating, setCreating] = useState(false);
  const [manualOpen, setManualOpen] = useState(false);

  const [blogLayout, setBlogLayout] = useState<BlogLayout>("grid");
  const [layoutSaving, setLayoutSaving] = useState(false);
  const [layoutIsAiPick, setLayoutIsAiPick] = useState(false);

  const siteId = decodeSiteId(id as string);
  const tenantHeaders = { "X-Tenant-ID": activeTenantId?.toString() ?? "" };

  const fetchBlogLayout = async () => {
    if (!token || !activeTenantId) return;
    try {
      const res = await request<{ design_token: any }>(`/sites/${siteId}/content`, { headers: tenantHeaders }, token);
      const layout = res.data?.design_token?.layout;
      if (layout?.blog_index_variant) {
        setBlogLayout(layout.blog_index_variant as BlogLayout);
        // Show AI badge only when variant has never been manually overridden
        setLayoutIsAiPick(layout.blog_index_variant_manual !== true);
      }
    } catch { }
  };

  useEffect(() => { fetchBlogLayout(); }, [siteId]);

  const fetchPosts = async () => {
    if (!token || !activeTenantId) return;
    try {
      const res = await request<BlogPost[]>(`/sites/${siteId}/blog-posts`, { headers: tenantHeaders }, token);
      setPosts(res.data || []);
    } catch (err: any) {
      pushToast(err.message || t("dashboard.sitesBlog.loadFailed"), "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPosts(); }, [siteId]);

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setGenerating(true);
    try {
      const res = await request<BlogPost>(`/sites/${siteId}/blog-posts/generate`, {
        method: "POST",
        headers: tenantHeaders,
        body: JSON.stringify({ topic }),
      }, token);
      setPosts(p => [res.data, ...p]);
      setTopic("");
      pushToast(t("dashboard.sitesBlog.draftCreated"), "success");
    } catch (err: any) {
      pushToast(err.message || t("dashboard.sitesBlog.generateFailed"), "error");
    } finally {
      setGenerating(false);
    }
  };

  const handleCreateManual = async () => {
    if (!title.trim()) return;
    setCreating(true);
    try {
      const res = await request<BlogPost>(`/sites/${siteId}/blog-posts`, {
        method: "POST",
        headers: tenantHeaders,
        body: JSON.stringify({ title, content, excerpt: content.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim().slice(0, 200) }),
      }, token);
      setPosts(p => [res.data, ...p]);
      setTitle("");
      setContent("");
      setManualOpen(false);
      pushToast(t("dashboard.sitesBlog.postCreated"), "success");
    } catch (err: any) {
      pushToast(err.message || t("dashboard.sitesBlog.createFailed"), "error");
    } finally {
      setCreating(false);
    }
  };

  const handlePublish = async (postId: number) => {
    try {
      await request(`/sites/${siteId}/blog-posts/${postId}/publish`, { method: "POST", headers: tenantHeaders }, token);
      pushToast(t("dashboard.sitesBlog.published"), "success");
      fetchPosts();
    } catch (err: any) {
      pushToast(err.message || t("dashboard.sitesBlog.publishFailed"), "error");
    }
  };

  const handleLayoutChange = async (layout: BlogLayout) => {
    const prev = blogLayout;
    setBlogLayout(layout);
    setLayoutIsAiPick(false);
    setLayoutSaving(true);
    try {
      await request(`/sites/${siteId}/blog-index-variant`, {
        method: "PATCH",
        headers: tenantHeaders,
        body: JSON.stringify({ variant: layout }),
      }, token);
      pushToast(t("dashboard.sitesBlog.layoutSaved"), "success");
    } catch (err: any) {
      setBlogLayout(prev);
      setLayoutIsAiPick(prev === blogLayout ? layoutIsAiPick : false);
      pushToast(err.message || t("dashboard.sitesBlog.layoutFailed"), "error");
    } finally {
      setLayoutSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-80">
        <Loader2 className="w-6 h-6 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SiteSubNav siteId={siteId} />
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link href={`/dashboard/sites/${siteId}`} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ChevronLeft className="w-4 h-4" /> {t("dashboard.sitesBlog.webLink")}
          </Link>
          <h2 className="text-lg font-bold">{t("dashboard.sitesBlog.title")}</h2>
        </div>
        <Button onClick={() => setManualOpen(true)}>
          <Plus className="w-4 h-4" /> {t("dashboard.sitesBlog.addNew")}
        </Button>
      </div>

      {/* Layout selector */}
      <Card>
        <CardContent className="py-3">
          <div className="flex items-center justify-between gap-3">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider shrink-0">{t("dashboard.sitesBlog.layoutLabel")}</span>
            <div className="flex gap-1">
              {LAYOUT_OPTIONS.map(opt => {
                const active = blogLayout === opt.value;
                const Icon = opt.icon;
                return (
                  <button
                    key={opt.value}
                    onClick={() => handleLayoutChange(opt.value)}
                    disabled={layoutSaving}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${active
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent"
                      }`}
                    title={t(opt.desc)}
                  >
                    {active && layoutSaving ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : active ? (
                      <Check className="w-3.5 h-3.5" />
                    ) : (
                      <Icon className="w-3.5 h-3.5" />
                    )}
                    {t(opt.label)}
                  </button>
                );
              })}
            </div>
          </div>
          {layoutIsAiPick && (
            <p className="text-[11px] text-muted-foreground mt-2 text-right">
              ✨ {t("dashboard.sitesBlog.aiPick")}
            </p>
          )}
        </CardContent>
      </Card>

      {manualOpen && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-bold">{t("dashboard.sitesBlog.writePostTitle")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Input
              placeholder="Judul postingan"
              value={title}
              onChange={e => setTitle(e.target.value)}
            />
            <textarea
              placeholder="Konten (Markdown)"
              value={content}
              onChange={e => setContent(e.target.value)}
              rows={6}
              className="w-full px-3 py-2 border rounded-xl text-sm outline-none focus:border-primary bg-background resize-y"
            />
            <div className="flex gap-2">
              <Button onClick={handleCreateManual} disabled={creating || !title.trim()}>
                {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                {t("dashboard.sitesBlog.savePost")}
              </Button>
              <Button variant="outline" onClick={() => setManualOpen(false)}>{t("dashboard.sitesBlog.cancel")}</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {isPremium && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <SparkleGenAI className="w-4 h-4 text-primary" />
              {t("dashboard.sitesBlog.aiCardTitle")}
              <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-full">Pro</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input
                placeholder="Topik: mis. 5 tips memilih jasa konsultasi pajak"
                value={topic}
                onChange={e => setTopic(e.target.value)}
                className="flex-1"
              />
              <Button onClick={handleGenerate} disabled={generating || !topic.trim()}>
                {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <SparkleGenAI className="w-4 h-4" />}
                {t("dashboard.sitesBlog.generate")}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {!isPremium && (
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <SparkleGenAI className="w-5 h-5 text-primary shrink-0" />
              <span>{t("dashboard.sitesBlog.nonPremiumText")} <strong>Pro</strong>.</span>
              <Link href="/dashboard/upgrade" className="ml-auto text-primary font-semibold hover:underline whitespace-nowrap">
                {t("dashboard.sitesBlog.upgrade")}
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-3">
        {posts.map(post => (
          <Card key={post.id}>
            <CardContent className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-muted-foreground shrink-0" />
                <div>
                  <div className="font-semibold text-sm">{post.title}</div>
                  <div className="text-xs text-muted-foreground">
                    {post.status === "published"
                      ? t("dashboard.sitesBlog.publishedDate", undefined, { date: post.published_at ? new Date(post.published_at).toLocaleDateString(locale === "id" ? "id-ID" : "en-US") : "" })
                      : t("dashboard.sitesBlog.draftDate", undefined, { date: new Date(post.created_at).toLocaleDateString(locale === "id" ? "id-ID" : "en-US") })}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={post.status === "published" ? "default" : "secondary"}>
                  {post.status === "published" ? t("dashboard.sitesBlog.publishedBadge") : t("dashboard.sitesBlog.draftBadge")}
                </Badge>
                <Link href={`/dashboard/sites/${siteId}/blog/${post.id}`} className="inline-flex items-center justify-center text-sm font-medium rounded-xl px-3 py-1.5 border hover:bg-accent transition-colors">
                  {t("dashboard.sitesBlog.edit")}
                </Link>
                {post.status === "draft" && (
                  <Button size="sm" onClick={() => handlePublish(post.id)}>{t("dashboard.sitesBlog.publish")}</Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
        {posts.length === 0 && (
          <div className="text-sm text-muted-foreground text-center py-12">
            {t("dashboard.sitesBlog.emptyDesc1")} <strong>{t("dashboard.sitesBlog.addNew")}</strong> {t("dashboard.sitesBlog.emptyDesc2")}
          </div>
        )}
      </div>
    </div>
  );
}
