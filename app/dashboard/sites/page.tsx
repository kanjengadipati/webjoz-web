"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuthToken } from "@/lib/auth-store";
import { useActiveTenant } from "@/lib/tenant-store";
import { request } from "@/lib/api/client";
import { 
  Globe, Plus, Loader2, RefreshCw, Eye, Edit3, Trash2, 
  Settings, CheckCircle2, FileText, ChevronRight, AlertCircle, 
  ArrowRight, ShieldAlert
} from "lucide-react";
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Badge } from "@/components/ui";
import { useToast } from "@/components/toast-provider";

interface Site {
  id: number;
  created_at: string;
  tenant_id: number;
  name: string;
  template_id: string;
  status: "draft" | "published";
  subdomain: string;
}

export default function SitesPage() {
  const token = useAuthToken();
  const { pushToast } = useToast();
  const { 
    activeTenantId, memberships, loading: tenantLoading
  } = useActiveTenant();

  const [sites, setSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  const fetchSites = async () => {
    if (!token || !activeTenantId) return;
    try {
      setLoading(true);
      const res = await request<Site[]>("/sites", {
        headers: { "X-Tenant-ID": activeTenantId.toString() }
      }, token);
      setSites(res.data || []);
    } catch (err: any) {
      pushToast(err.message || "Failed to load sites", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTenantId) {
      fetchSites();
    } else {
      setSites([]);
    }
  }, [activeTenantId]);

  const handlePublishToggle = async (site: Site) => {
    if (!token || !activeTenantId) return;
    try {
      setActionLoading(site.id);
      const action = site.status === "published" ? "unpublish" : "publish";
      const res = await request<Site>(`/sites/${site.id}/${action}`, {
        method: "POST",
        headers: { "X-Tenant-ID": activeTenantId.toString() }
      }, token);
      
      pushToast(`Website berhasil di-${action === "publish" ? "publikasi" : "draft"}!`, "success");
      fetchSites();
    } catch (err: any) {
      pushToast(err.message || "Gagal mengubah status publikasi", "error");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteSite = async (siteId: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus situs ini secara permanen?")) return;
    if (!token || !activeTenantId) return;
    try {
      setActionLoading(siteId);
      await request(`/sites/${siteId}`, {
        method: "DELETE",
        headers: { "X-Tenant-ID": activeTenantId.toString() }
      }, token);
      pushToast("Situs berhasil dihapus.", "success");
      fetchSites();
    } catch (err: any) {
      pushToast(err.message || "Gagal menghapus situs", "error");
    } finally {
      setActionLoading(null);
    }
  };

  if (tenantLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-80 gap-3">
        <Loader2 className="w-6 h-6 text-primary animate-spin" />
        <p className="text-xs text-muted-foreground">Menghubungkan ke workspace...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Daftar Website</h1>
          <p className="text-xs text-muted-foreground">Kelola website yang telah Anda buat.</p>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard/sites/new">
            <Button className="rounded-full gap-1.5">
              <Plus className="w-4 h-4" />
              Website AI Baru
            </Button>
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Loader2 className="w-6 h-6 text-primary animate-spin" />
          <p className="text-xs text-muted-foreground">Memuat situs Anda...</p>
        </div>
      ) : sites.length === 0 ? (
        <Card className="border-dashed border-border/70 p-12 text-center max-w-lg mx-auto">
          <div className="w-16 h-16 bg-primary/5 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
            <Globe className="w-8 h-8 opacity-75" />
          </div>
          <h2 className="text-xl font-bold mb-2">Belum Ada Website</h2>
          <p className="text-xs text-muted-foreground mb-6 max-w-sm mx-auto leading-relaxed">
            Workspace ini belum memiliki website. Gunakan AI Generator kami untuk mendesain website profesional dalam 5 langkah mudah.
          </p>
          <Link href="/dashboard/sites/new">
            <Button className="rounded-full gap-2">
              Mulai AI Generator
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sites.map((site) => (
            <Card key={site.id} className="border-border/40 hover:shadow-lg transition-all duration-300 flex flex-col justify-between overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-primary/5 via-transparent to-transparent p-6 pb-4">
                <div className="flex justify-between items-start gap-4">
                  <div className="space-y-1">
                    <CardTitle className="text-lg font-bold tracking-tight">{site.name}</CardTitle>
                    <CardDescription className="text-xs flex items-center gap-1.5">
                      <span className="font-mono bg-slate-100 dark:bg-slate-800 text-[10px] px-2 py-0.5 rounded">
                        {site.template_id}
                      </span>
                    </CardDescription>
                  </div>
                  <Badge 
                    variant={site.status === "published" ? "default" : "secondary"}
                    className="capitalize text-[10px] font-bold"
                  >
                    {site.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-6 pt-0 space-y-6 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground/60">Subdomain Web</div>
                  <a 
                    href={`http://localhost:3000/s/${site.subdomain}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm font-semibold text-primary hover:underline flex items-center gap-1.5"
                  >
                    localhost:3000/s/{site.subdomain}
                    <Eye className="w-3.5 h-3.5" />
                  </a>
                </div>

                <div className="flex gap-2 pt-4 border-t border-border/30">
                  <Link href={`/dashboard/sites/${site.id}`} className="flex-1">
                    <Button variant="outline" className="w-full rounded-xl gap-1.5 text-xs h-9">
                      <Edit3 className="w-3.5 h-3.5" />
                      Edit & Preview
                    </Button>
                  </Link>
                  <Button 
                    variant={site.status === "published" ? "secondary" : "default"} 
                    className="flex-1 rounded-xl gap-1.5 text-xs h-9"
                    onClick={() => handlePublishToggle(site)}
                    disabled={actionLoading === site.id}
                  >
                    {actionLoading === site.id ? "Memuat..." : (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {site.status === "published" ? "Draftkan" : "Publikasikan"}
                      </>
                    )}
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="rounded-xl h-9 w-9 text-red-500 hover:text-red-600 hover:bg-red-50"
                    onClick={() => handleDeleteSite(site.id)}
                    disabled={actionLoading === site.id}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
