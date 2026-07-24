"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthToken } from "@/lib/auth-store";
import { useActiveTenant } from "@/lib/tenant-store";
import { request } from "@/lib/api/client";
import { Button, Input } from "@/components/ui";
import { useToast } from "@/components/toast-provider";
import { SiteSubNav } from "@/components/site-sub-nav";
import FileUpload from "@/components/file-upload";
import { marked } from "marked";
import {
  Loader2, Bold, Italic, Heading2, Heading3,
  Link as LinkIcon, Image, List, ListOrdered, Quote,
  Eye, Edit3, Lock, ArrowLeft, Save,
} from "lucide-react";

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content_html: string;
  cover_image_url: string;
  seo_title: string;
  seo_description: string;
  noindex: boolean;
  status: string;
  published_at: string | null;
  created_at: string;
}

function ToolbarButton({ icon: Icon, label, onClick }: { icon: any; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      className="p-1.5 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
    >
      <Icon className="w-4 h-4" />
    </button>
  );
}

function wrapSelection(textarea: HTMLTextAreaElement, content: string, before: string, after: string): string {
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const selected = content.substring(start, end);
  return content.substring(0, start) + before + selected + after + content.substring(end);
}

function insertAtCursor(textarea: HTMLTextAreaElement, content: string, text: string): string {
  const start = textarea.selectionStart;
  return content.substring(0, start) + text + content.substring(start);
}

export default function EditBlogPostPage() {
  const { id, postId } = useParams();
  const router = useRouter();
  const token = useAuthToken();
  const { activeTenantId, activeTenant } = useActiveTenant();
  const { pushToast } = useToast();
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const siteId = Number(id);
  const tenantHeaders = { "X-Tenant-ID": activeTenantId?.toString() ?? "" };
  const isPremium = activeTenant?.tenant?.plan === "pro" || activeTenant?.tenant?.plan === "enterprise";

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [post, setPost] = useState<BlogPost | null>(null);
  const [dirty, setDirty] = useState(false);
  const [preview, setPreview] = useState(false);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [noindex, setNoindex] = useState(false);

  const [html, setHtml] = useState("");

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!token || !activeTenantId || !postId) return;
    const fetchPost = async () => {
      try {
        const res = await request<BlogPost>(`/sites/${siteId}/blog-posts/${postId}`, { headers: tenantHeaders }, token);
        const p = res.data;
        if (p) {
          setPost(p);
          setTitle(p.title);
          setContent(p.content_html || "");
          setExcerpt(p.excerpt || "");
          setCoverImageUrl(p.cover_image_url || "");
          setSeoTitle(p.seo_title || "");
          setSeoDescription(p.seo_description || "");
          setNoindex(p.noindex || false);
        }
      } catch (err: any) {
        pushToast(err.message || "Gagal memuat postingan", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [siteId, postId, token, activeTenantId]);

  useEffect(() => {
    marked.setOptions({ breaks: true, gfm: true });
    const render = async () => {
      try {
        const result = await marked.parse(content || "");
        setHtml(result);
      } catch {
        setHtml(content);
      }
    };
    render();
  }, [content]);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const doSave = useCallback(async () => {
    if (!title.trim()) return;
    setSaving(true);
    try {
      await request(`/sites/${siteId}/blog-posts/${postId}`, {
        method: "PUT",
        headers: tenantHeaders,
        body: JSON.stringify({ title, content, excerpt, cover_image_url: coverImageUrl, seo_title: seoTitle, seo_description: seoDescription, noindex }),
      }, token);
      setLastSaved(new Date());
      setDirty(false);
    } catch (err: any) {
      pushToast(err.message || "Gagal menyimpan", "error");
    } finally {
      setSaving(false);
    }
  }, [siteId, postId, token, activeTenantId, title, content, excerpt, coverImageUrl, seoTitle, seoDescription, noindex]);

  const handleSave = () => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    doSave();
  };

  useEffect(() => {
    if (!dirty) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(doSave, 3000);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [dirty, doSave]);

  const markDirty = () => { if (!dirty) setDirty(true); };

  const uploadFile = async (file: File): Promise<string> => {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
    if (!cloudName || !uploadPreset) {
      throw new Error("Konfigurasi Cloudinary belum lengkap di env.");
    }
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("upload_preset", uploadPreset);
      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: fd,
      });
      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        throw new Error(errBody?.error?.message || "Gagal mengupload gambar ke Cloudinary.");
      }
      const body = await res.json();
      if (!body.secure_url) throw new Error("Format respon Cloudinary tidak valid.");
      return body.secure_url;
    } finally {
      setUploading(false);
    }
  };

  const handleToolbarImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const url = await uploadFile(file);
      const ta = textareaRef.current;
      if (ta) {
        const newContent = insertAtCursor(ta, content, `![${file.name}](${url})`);
        setContent(newContent);
        markDirty();
      }
    } catch (err: any) {
      pushToast(err.message || "Gagal mengupload gambar.", "error");
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const toolbar = () => {
    const fmt = (before: string, after = "") => {
      const ta = textareaRef.current;
      if (!ta) return;
      const start = ta.selectionStart;
      const newContent = wrapSelection(ta, content, before, after);
      setContent(newContent);
      markDirty();
      requestAnimationFrame(() => {
        ta.focus();
        const pos = start + before.length;
        ta.selectionStart = ta.selectionEnd = pos;
      });
    };

    const ins = (text: string) => {
      const ta = textareaRef.current;
      if (!ta) return;
      const start = ta.selectionStart;
      const newContent = insertAtCursor(ta, content, text);
      setContent(newContent);
      markDirty();
      requestAnimationFrame(() => {
        ta.focus();
        const pos = start + text.length;
        ta.selectionStart = ta.selectionEnd = pos;
      });
    };

    return (
      <div className="flex items-center gap-0.5">
        <ToolbarButton icon={Bold} label="Bold" onClick={() => fmt("**", "**")} />
        <ToolbarButton icon={Italic} label="Italic" onClick={() => fmt("*", "*")} />
        <span className="w-px h-5 bg-border mx-1" />
        <ToolbarButton icon={Heading2} label="Heading 2" onClick={() => ins("## ")} />
        <ToolbarButton icon={Heading3} label="Heading 3" onClick={() => ins("### ")} />
        <span className="w-px h-5 bg-border mx-1" />
        <ToolbarButton icon={List} label="Bullet List" onClick={() => ins("- ")} />
        <ToolbarButton icon={ListOrdered} label="Ordered List" onClick={() => ins("1. ")} />
        <ToolbarButton icon={Quote} label="Blockquote" onClick={() => ins("> ")} />
        <span className="w-px h-5 bg-border mx-1" />
        <ToolbarButton icon={LinkIcon} label="Link" onClick={() => fmt("[", "](url)")} />
        <ToolbarButton icon={Image} label="Upload Image" onClick={() => fileInputRef.current?.click()} />
        {uploading && <Loader2 className="w-3.5 h-3.5 animate-spin text-muted-foreground ml-1" />}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-80">
        <Loader2 className="w-6 h-6 text-primary animate-spin" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex flex-col items-center justify-center h-80 gap-4">
        <p className="text-muted-foreground">Postingan tidak ditemukan</p>
        <Link href={`/dashboard/sites/${siteId}/blog`} className="text-sm text-primary hover:underline">
          Kembali
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <SiteSubNav siteId={siteId} compact />

      {/* Sticky top bar */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b -mx-6 px-6 py-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <Link
            href={`/dashboard/sites/${siteId}/blog`}
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="min-w-0">
            <Input
              value={title}
              onChange={e => { setTitle(e.target.value); markDirty(); }}
              placeholder="Judul postingan"
              className="text-lg font-bold border-0 bg-transparent px-0 h-auto focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground/40 truncate"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {post.status === "published" ? (
            <span className="flex items-center gap-1.5 text-[11px]">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
              </span>
              <span className="text-emerald-400 font-medium">Terbit</span>
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-[11px] text-slate-500">
              <Lock className="w-3 h-3" />
              Draft
            </span>
          )}

          <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
            {saving ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : dirty ? (
              <span className="text-amber-400">Belum tersimpan</span>
            ) : lastSaved ? (
              <span className="text-emerald-400">Tersimpan {lastSaved.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}</span>
            ) : null}
          </div>

          <div className="flex gap-1">
            <Button variant="outline" size="sm" onClick={() => router.push(`/dashboard/sites/${siteId}/blog`)}>
              Kembali
            </Button>
            <Button size="sm" onClick={handleSave} disabled={saving || !title.trim()}>
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Simpan
            </Button>
          </div>
        </div>
      </div>

      {/* Main editor area: split pane */}
      <div className="flex gap-4 h-[calc(100vh-220px)] min-h-[500px]">
        {/* Left: Editor */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Edit3 className="w-4 h-4 text-muted-foreground" />
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Editor</span>
            </div>
          </div>
          <div className="flex items-center gap-0.5 border rounded-xl px-2 py-1.5 bg-muted/30 mb-2">
            {toolbar()}
          </div>
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleToolbarImage} />
          <textarea
            ref={textareaRef}
            value={content}
            onChange={e => { setContent(e.target.value); markDirty(); }}
            placeholder="Tulis konten dalam Markdown..."
            className="flex-1 w-full px-4 py-3 border rounded-xl text-sm outline-none focus:border-primary bg-background resize-none font-mono leading-relaxed"
          />
        </div>

        {/* Right: Preview */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <Eye className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Preview</span>
          </div>
          <div
            className="flex-1 border rounded-xl px-6 py-5 overflow-y-auto bg-card prose prose-sm prose-headings:font-bold prose-a:text-primary prose-img:rounded-xl prose-img:max-h-80 prose-img:object-cover max-w-none"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
      </div>

      {/* Meta panel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t pt-4">
        {/* Excerpt */}
        <div>
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">
            Excerpt <span className="text-[10px] text-muted-foreground/60">({excerpt.length}/500)</span>
          </label>
          <textarea
            value={excerpt}
            onChange={e => { setExcerpt(e.target.value); markDirty(); }}
            rows={3}
            maxLength={500}
            className="w-full px-3 py-2 border rounded-xl text-sm outline-none focus:border-primary bg-background resize-y"
          />
        </div>

        {/* Cover Image */}
        <div>
          <FileUpload
            label="Cover Image"
            value={coverImageUrl}
            onChange={(val) => { setCoverImageUrl(val); markDirty(); }}
            placeholder="https://..."
            previewSize="md"
          />
        </div>

        {/* SEO */}
        <div className="space-y-2">
          <div>
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">
              SEO Title <span className="text-[10px] text-muted-foreground/60">({seoTitle.length}/255)</span>
            </label>
            <Input
              value={seoTitle}
              onChange={e => { setSeoTitle(e.target.value); markDirty(); }}
              maxLength={255}
              placeholder="Judul untuk mesin pencari"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">
              SEO Description <span className="text-[10px] text-muted-foreground/60">({seoDescription.length}/500)</span>
            </label>
            <textarea
              value={seoDescription}
              onChange={e => { setSeoDescription(e.target.value); markDirty(); }}
              rows={2}
              maxLength={500}
              className="w-full px-3 py-2 border rounded-xl text-sm outline-none focus:border-primary bg-background resize-y"
            />
          </div>
          {/* Noindex toggle (Pro) */}
          <div className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2.5">
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-medium text-muted-foreground">Noindex (Sembunyi dari Google)</span>
                {!isPremium && <span className="text-[9px] font-bold uppercase bg-amber-500/10 text-amber-400 px-1.5 py-0.5 rounded-full border border-amber-500/30">Pro</span>}
              </div>
              <p className="text-[10px] text-muted-foreground/60">Halaman ini tidak akan muncul di hasil pencarian Google.</p>
            </div>
            {isPremium ? (
              <button
                type="button"
                role="switch"
                aria-checked={noindex}
                onClick={() => { setNoindex(!noindex); markDirty(); }}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full transition-colors ${noindex ? "bg-primary" : "bg-white/20"}`}
              >
                <span className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow-sm transition-transform ${noindex ? "translate-x-4" : "translate-x-1"}`} />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => router.push("/dashboard/upgrade")}
                className="flex items-center gap-1 px-2 py-1 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-semibold hover:bg-amber-500/20 transition-colors cursor-pointer"
              >
                <Lock className="w-3 h-3" /> Pro
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
