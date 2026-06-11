"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuthToken } from "@/lib/auth-store";
import { useActiveTenant } from "@/lib/tenant-store";
import { request } from "@/lib/api/client";
import { 
  Globe, Plus, Loader2, RefreshCw, Eye, Edit3, Trash2, 
  Settings, CheckCircle2, FileText, ChevronRight, AlertCircle, 
  ArrowRight, ShieldAlert, Search, TriangleAlert, X
} from "lucide-react";
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Badge } from "@/components/ui";
import { useToast } from "@/components/toast-provider";

/* ── Delete Confirmation Modal ─────────────────────────────────────── */
interface DeleteModalProps {
  siteName: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading: boolean;
}

function DeleteConfirmModal({ siteName, onConfirm, onCancel, loading }: DeleteModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-modal-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={!loading ? onCancel : undefined}
      />

      {/* Panel */}
      <div className="relative z-10 w-full max-w-md bg-slate-900 border border-red-500/30 rounded-2xl shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Close button */}
        {!loading && (
          <button
            onClick={onCancel}
            className="absolute top-4 right-4 text-slate-500 hover:text-slate-300 transition-colors"
            aria-label="Tutup"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        <div className="p-6 space-y-5">
          {/* Icon */}
          <div className="flex items-center justify-center">
            <div className="w-14 h-14 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center">
              <TriangleAlert className="w-7 h-7 text-red-400" />
            </div>
          </div>

          {/* Text */}
          <div className="text-center space-y-2">
            <h2 id="delete-modal-title" className="text-lg font-bold text-white">
              Hapus Website?
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              Anda akan menghapus website{" "}
              <span className="text-white font-semibold">"{siteName}"</span> secara permanen.
              Tindakan ini tidak dapat dibatalkan.
            </p>
          </div>

          {/* Warning notice */}
          <div className="flex items-start gap-2.5 bg-red-950/40 border border-red-500/20 rounded-xl px-4 py-3">
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-red-300 leading-relaxed">
              Semua konten, pengaturan, dan data website ini akan dihapus. 
              Subdomain akan dibebaskan dan tidak bisa dipulihkan.
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <Button
              variant="outline"
              className="flex-1 rounded-xl h-10 text-sm"
              onClick={onCancel}
              disabled={loading}
            >
              Batal
            </Button>
            <Button
              className="flex-1 rounded-xl h-10 text-sm bg-red-600 hover:bg-red-700 text-white border-0 gap-2"
              onClick={onConfirm}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Menghapus...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4" />
                  Ya, Hapus
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

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

  // Delete confirmation modal
  const [deleteTarget, setDeleteTarget] = useState<Site | null>(null);

  // Search & Pagination States
  const [searchQuery, setSearchQuery] = useState("");
  const [limit, setLimit] = useState(10);

  useEffect(() => {
    setLimit(10);
  }, [searchQuery]);

  const fetchSites = async () => {
    if (!token || !activeTenantId) return;
    try {
      setLoading(true);
      const res = await request<Site[]>("/sites", {
        headers: { "X-Tenant-ID": activeTenantId.toString() }
      }, token);
      const sortedSites = (res.data || []).sort((a, b) => b.id - a.id);
      setSites(sortedSites);
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

  const handleDeleteSite = async () => {
    if (!deleteTarget || !token || !activeTenantId) return;
    try {
      setActionLoading(deleteTarget.id);
      await request(`/sites/${deleteTarget.id}`, {
        method: "DELETE",
        headers: { "X-Tenant-ID": activeTenantId.toString() }
      }, token);
      pushToast("Situs berhasil dihapus.", "success");
      setDeleteTarget(null);
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
      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <DeleteConfirmModal
          siteName={deleteTarget.name}
          onConfirm={handleDeleteSite}
          onCancel={() => setDeleteTarget(null)}
          loading={actionLoading === deleteTarget.id}
        />
      )}
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
      {/* Search Input */}
      {!loading && sites.length > 0 && (
        <div className="flex items-center max-w-md w-full bg-slate-900 border border-border/40 rounded-xl px-3 py-2 gap-2 text-slate-400 focus-within:border-violet-500/50 transition-all">
          <Search className="w-4 h-4 text-slate-500 flex-shrink-0" />
          <input 
            type="text" 
            placeholder="Cari website berdasarkan nama atau subdomain..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent text-sm w-full outline-none text-white placeholder-slate-500"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")} className="text-slate-400 hover:text-white text-xs font-semibold">
              Reset
            </button>
          )}
        </div>
      )}

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
      ) : (() => {
        const filteredSites = sites.filter(site => 
          site.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          site.subdomain.toLowerCase().includes(searchQuery.toLowerCase())
        );
        const displayedSites = filteredSites.slice(0, limit);

        if (filteredSites.length === 0) {
          return (
            <Card className="border border-dashed border-border/40 p-12 text-center max-w-md mx-auto">
              <div className="w-12 h-12 bg-slate-900 border border-border/30 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-500">
                <Search className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-lg mb-1">Tidak Ada Hasil</h3>
              <p className="text-xs text-muted-foreground mb-4">
                Tidak menemukan website dengan nama atau subdomain "{searchQuery}".
              </p>
              <Button variant="outline" className="rounded-xl text-xs h-8" onClick={() => setSearchQuery("")}>
                Bersihkan Pencarian
              </Button>
            </Card>
          );
        }

        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {displayedSites.map((site) => (
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
                        onClick={() => setDeleteTarget(site)}
                        disabled={actionLoading === site.id}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Load More Button */}
            {filteredSites.length > limit && (
              <div className="flex justify-center pt-4">
                <Button 
                  variant="outline"
                  onClick={() => setLimit(prev => prev + 10)}
                  className="rounded-xl px-6 py-2 gap-1.5 text-xs font-semibold h-9"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Muat Lebih Banyak
                </Button>
              </div>
            )}
          </div>
        );
      })()}
    </div>
  );
}
