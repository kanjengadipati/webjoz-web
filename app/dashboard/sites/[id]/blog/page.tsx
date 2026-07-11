"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useAuthToken } from "@/lib/auth-store";
import { useActiveTenant } from "@/lib/tenant-store";
import { request } from "@/lib/api/client";
import { Button, Card, CardContent, CardHeader, CardTitle, Input } from "@/components/ui";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/toast-provider";
import { Loader2, FileText, Plus, Sparkles, ChevronLeft } from "lucide-react";
import { SparkleGenAI } from "@/components/sparkle-icon";
import Link from "next/link";

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

  const siteId = Number(id);
  const tenantHeaders = { "X-Tenant-ID": activeTenantId?.toString() ?? "" };

  const fetchPosts = async () => {
    if (!token || !activeTenantId) return;
    try {
      const res = await request<BlogPost[]>(`/sites/${siteId}/blog-posts`, { headers: tenantHeaders }, token);
      setPosts(res.data || []);
    } catch (err: any) {
      pushToast(err.message || "Gagal memuat blog", "error");
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
      pushToast("Draft blog berhasil dibuat", "success");
    } catch (err: any) {
      pushToast(err.message || "Gagal generate blog", "error");
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
        body: JSON.stringify({ title, content, excerpt: content.slice(0, 200) }),
      }, token);
      setPosts(p => [res.data, ...p]);
      setTitle("");
      setContent("");
      setManualOpen(false);
      pushToast("Postingan berhasil dibuat", "success");
    } catch (err: any) {
      pushToast(err.message || "Gagal membuat postingan", "error");
    } finally {
      setCreating(false);
    }
  };

  const handlePublish = async (postId: number) => {
    try {
      await request(`/sites/${siteId}/blog-posts/${postId}/publish`, { method: "POST", headers: tenantHeaders }, token);
      pushToast("Postingan diterbitkan", "success");
      fetchPosts();
    } catch (err: any) {
      pushToast(err.message || "Gagal menerbitkan", "error");
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
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link href={`/dashboard/sites/${siteId}`} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ChevronLeft className="w-4 h-4" /> Web
          </Link>
          <h2 className="text-lg font-bold">Blog Postingan</h2>
        </div>
        <Button onClick={() => setManualOpen(true)}>
          <Plus className="w-4 h-4" /> Tambah Baru
        </Button>
      </div>

      {manualOpen && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-bold">Tulis Postingan Baru</CardTitle>
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
                Simpan Postingan
              </Button>
              <Button variant="outline" onClick={() => setManualOpen(false)}>Batal</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {isPremium && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <SparkleGenAI className="w-4 h-4 text-primary" />
              Buat Konten Blog dengan AI
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
                Generate
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {!isPremium && (
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <Sparkles className="w-5 h-5 text-primary shrink-0" />
              <span>Generate konten dengan AI tersedia di paket <strong>Pro</strong>.</span>
              <Link href="/dashboard/upgrade" className="ml-auto text-primary font-semibold hover:underline whitespace-nowrap">
                Upgrade →
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
                      ? `Terbit ${post.published_at ? new Date(post.published_at).toLocaleDateString("id-ID") : ""}`
                      : "Draft · " + new Date(post.created_at).toLocaleDateString("id-ID")}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={post.status === "published" ? "default" : "secondary"}>
                  {post.status === "published" ? "Terbit" : "Draft"}
                </Badge>
                <Link href={`/dashboard/sites/${siteId}/blog/${post.id}`} className="inline-flex items-center justify-center text-sm font-medium rounded-xl px-3 py-1.5 border hover:bg-accent transition-colors">
                  Edit
                </Link>
                {post.status === "draft" && (
                  <Button size="sm" onClick={() => handlePublish(post.id)}>Terbitkan</Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
        {posts.length === 0 && (
          <div className="text-sm text-muted-foreground text-center py-12">
            Belum ada konten blog. Klik <strong>Tambah Baru</strong> untuk membuat postingan pertama.
          </div>
        )}
      </div>
    </div>
  );
}
