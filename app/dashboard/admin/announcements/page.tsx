"use client";

import React, { useState, useEffect } from "react";
import { useAuthToken } from "@/lib/auth-store";
import { request } from "@/lib/api/client";
import { usePermissions } from "@/hooks/use-permissions";
import { Loader2, Plus, Trash2, Megaphone, Info, AlertTriangle, AlertCircle } from "lucide-react";
import { Button, Card, CardContent, CardHeader, CardTitle, Dialog, FormField, Input, Textarea, Select } from "@/components/ui";
import { useToast } from "@/components/toast-provider";

interface AnnouncementItem {
  id: number;
  title: string;
  content: string;
  severity: string;
  active: boolean;
  created_by: number;
  created_at: string;
  expires_at?: string;
}

export default function AdminAnnouncementsPage() {
  const token = useAuthToken();
  const { pushToast } = useToast();
  const { role } = usePermissions();
  const [items, setItems] = useState<AnnouncementItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [severity, setSeverity] = useState("info");

  const isAdmin = role === "superadmin" || role === "admin";

  useEffect(() => {
    if (!token || !isAdmin) return;
    fetchItems();
  }, [token, isAdmin]);

  async function fetchItems() {
    try {
      setLoading(true);
      const res = await request<AnnouncementItem[]>("/admin/announcements", {}, token);
      setItems(res.data || []);
    } catch (err: any) {
      pushToast(err.message || "Failed to load announcements", "error");
    } finally {
      setLoading(false);
    }
  }

  function openCreate() {
    setTitle("");
    setContent("");
    setSeverity("info");
    setDialogOpen(true);
  }

  async function handleCreate() {
    if (!token || !title || !content) return;
    setSaving(true);
    try {
      await request("/admin/announcements", {
        method: "POST",
        body: JSON.stringify({ title, content, severity }),
      }, token);
      pushToast("Announcement created", "success");
      setDialogOpen(false);
      fetchItems();
    } catch (err: any) {
      pushToast(err.message || "Failed to create announcement", "error");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    if (!token || !confirm("Delete this announcement?")) return;
    try {
      await request(`/admin/announcements/${id}`, { method: "DELETE" }, token);
      pushToast("Announcement deleted", "success");
      fetchItems();
    } catch (err: any) {
      pushToast(err.message || "Failed to delete announcement", "error");
    }
  }

  function severityIcon(s: string) {
    switch (s) {
      case "warning": return AlertTriangle;
      case "important": return AlertCircle;
      default: return Info;
    }
  }

  function severityColor(s: string) {
    switch (s) {
      case "warning": return "text-amber-500 border-amber-500/30 bg-amber-500/5";
      case "important": return "text-red-500 border-red-500/30 bg-red-500/5";
      default: return "text-blue-500 border-blue-500/30 bg-blue-500/5";
    }
  }

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center h-80 text-muted-foreground gap-4">
        <Megaphone className="size-12 opacity-40" />
        <p className="text-sm">Anda tidak memiliki akses ke halaman ini.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight flex items-center gap-3">
            <Megaphone className="size-5 text-primary" />
            Announcements
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Broadcast messages to all tenants.
          </p>
        </div>
        <Button onClick={openCreate} className="gap-2">
          <Plus className="size-4" />
          New Announcement
        </Button>
      </div>

      <Card className="border-border/40 shadow-sm">
        <CardHeader className="border-b border-border/20 pb-4">
          <CardTitle className="text-lg font-bold tracking-tight flex items-center gap-3">
            <Megaphone className="size-5 text-primary" />
            All Announcements
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="size-6 animate-spin text-muted-foreground" />
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-3">
              <Megaphone className="size-10 opacity-30" />
              <p className="text-sm">No announcements yet</p>
              <Button variant="outline" size="sm" onClick={openCreate}>Create your first announcement</Button>
            </div>
          ) : (
            <div className="divide-y divide-border/10">
              {items.map((a) => {
                const SevIcon = severityIcon(a.severity);
                return (
                  <div key={a.id} className="flex items-start gap-4 px-6 py-4 hover:bg-muted/30 transition-colors">
                    <div className={`flex items-center justify-center size-9 rounded-full border shrink-0 ${severityColor(a.severity)}`}>
                      <SevIcon className="size-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-sm">{a.title}</h3>
                        <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium capitalize ${
                          a.active ? "border-green-500/30 text-green-600" : "border-red-500/30 text-red-500"
                        }`}>
                          {a.active ? "Active" : "Inactive"}
                        </span>
                        <span className="text-[10px] text-muted-foreground uppercase tracking-wider">{a.severity}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{a.content}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(a.created_at).toLocaleDateString("id-ID", {
                          year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit"
                        })}
                        {a.expires_at && ` · Expires: ${new Date(a.expires_at).toLocaleDateString("id-ID")}`}
                      </p>
                    </div>
                    <Button variant="ghost" size="icon" className="size-8 shrink-0 text-destructive" onClick={() => handleDelete(a.id)}>
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen} title="New Announcement">
        <div className="space-y-4">
          <FormField label="Title" required>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Maintenance scheduled" />
          </FormField>
          <FormField label="Severity">
            <Select value={severity} onChange={(e) => setSeverity(e.target.value)}>
              <option value="info">Info</option>
              <option value="warning">Warning</option>
              <option value="important">Important</option>
            </Select>
          </FormField>
          <FormField label="Content" required>
            <Textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="We will be performing maintenance..." rows={4} />
          </FormField>
          <div className="flex justify-end gap-3 pt-4 border-t border-border/20">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleCreate} disabled={saving || !title || !content}>
              {saving ? "Creating..." : "Create"}
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
