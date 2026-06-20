"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuthToken } from "@/lib/auth-store";
import { useActiveTenant } from "@/lib/tenant-store";
import { request } from "@/lib/api/client";
import { 
  Globe, Plus, Loader2, RefreshCw, Eye, Edit3, Trash2, 
  Check, Copy, Info, CheckCircle2, FileText, ChevronRight, AlertCircle, 
  ArrowRight, ShieldAlert, Search, TriangleAlert, X, MoreVertical, EyeOff, Layout
} from "lucide-react";
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Badge } from "@/components/ui";
import { useToast } from "@/components/toast-provider";
import TemplateThumbnail from "./[id]/TemplateThumbnail";
import { getTemplate } from "@/lib/template-registry";
import { getTemplateDefaultDesignToken } from "@/lib/template-defaults";

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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-modal-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/75 backdrop-blur-sm"
        onClick={!loading ? onCancel : undefined}
      />

      {/* Panel */}
      <div className="relative z-10 w-full max-w-md bg-[#13131a] border border-red-500/20 rounded-2xl shadow-2xl animate-in zoom-in-95 duration-200 p-6 space-y-5">
        {/* Close button */}
        {!loading && (
          <button
            onClick={onCancel}
            className="absolute top-4 right-4 text-[#65656f] hover:text-white transition-colors cursor-pointer"
            aria-label="Tutup"
          >
            <X className="w-4 h-4" />
          </button>
        )}

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
          <p className="text-sm text-[#9b9ba5] leading-relaxed">
            Anda akan menghapus website{" "}
            <span className="text-white font-semibold">"{siteName}"</span> secara permanen.
            Tindakan ini tidak dapat dibatalkan.
          </p>
        </div>

        {/* Warning notice */}
        <div className="flex items-start gap-2.5 bg-red-950/20 border border-red-500/20 rounded-xl px-4 py-3">
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
            className="flex-1 rounded-xl h-10 text-sm border-white/10 hover:bg-white/[0.04]"
            onClick={onCancel}
            disabled={loading}
          >
            Batal
          </Button>
          <Button
            className="flex-1 rounded-xl h-10 text-sm bg-red-600 hover:bg-red-700 text-white border-0 gap-2 cursor-pointer"
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
  );
}

/* ── Rename Modal ─────────────────────────────────────── */
interface RenameModalProps {
  currentName: string;
  onConfirm: (newName: string) => void;
  onCancel: () => void;
  loading: boolean;
}

function RenameModal({ currentName, onConfirm, onCancel, loading }: RenameModalProps) {
  const [name, setName] = useState(currentName);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && name.trim() !== currentName) {
      onConfirm(name.trim());
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/75 backdrop-blur-sm"
        onClick={!loading ? onCancel : undefined}
      />

      {/* Panel */}
      <div className="relative z-10 w-full max-w-md bg-[#13131a] border border-white/[0.08] rounded-2xl shadow-2xl animate-in zoom-in-95 duration-200 p-6">
        {!loading && (
          <button
            onClick={onCancel}
            className="absolute top-4 right-4 text-[#65656f] hover:text-white transition-colors cursor-pointer"
            aria-label="Tutup"
          >
            <X className="w-4 h-4" />
          </button>
        )}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <h2 className="text-lg font-bold text-white">Ganti Nama Website</h2>
            <p className="text-xs text-[#9b9ba5]">Masukkan nama baru untuk website Anda.</p>
          </div>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={loading}
            className="w-full bg-[#0b0b0d] border border-white/15 rounded-xl px-4 py-2.5 text-[14px] text-[#f3f3f4] outline-none focus:border-[#6f6fff] placeholder:text-[#6b6b75]"
            required
            autoFocus
          />
          <div className="flex gap-3 pt-1">
            <Button
              type="button"
              variant="outline"
              className="flex-1 rounded-xl h-10 text-sm border-white/10 hover:bg-white/[0.04]"
              onClick={onCancel}
              disabled={loading}
            >
              Batal
            </Button>
            <Button
              type="submit"
              className="flex-1 rounded-xl h-10 text-sm bg-primary text-white border-0 cursor-pointer"
              disabled={loading || !name.trim() || name.trim() === currentName}
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Simpan"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

interface IframePreviewProps {
  subdomain: string;
}

function IframePreview({ subdomain }: IframePreviewProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.25);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width } = entry.contentRect;
        // Base width is 1200px
        setScale(width / 1200);
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="w-full h-full relative overflow-hidden bg-[#0d0f14]">
      <iframe
        src={`/s/${subdomain}`}
        loading="lazy"
        className="absolute top-0 left-0 border-0 pointer-events-none origin-top-left"
        style={{
          width: "1200px",
          height: "675px",
          transform: `scale(${scale})`,
        }}
      />
      {/* Overlay to catch clicks and prevent interaction with iframe content */}
      <div className="absolute inset-0 z-10 cursor-pointer bg-transparent" />
    </div>
  );
}

interface Site {
  id: number;
  created_at: string;
  updated_at: string;
  tenant_id: number;
  name: string;
  template_id: string;
  status: "draft" | "published";
  published_at?: string;
  subdomain: string;
}

export default function SitesPage() {
  const token = useAuthToken();
  const { pushToast } = useToast();
  const { 
    activeTenantId, loading: tenantLoading
  } = useActiveTenant();

  const [sites, setSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  // Modals & action targets
  const [deleteTarget, setDeleteTarget] = useState<Site | null>(null);
  const [renameTarget, setRenameTarget] = useState<Site | null>(null);
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [currentFilter, setCurrentFilter] = useState<"all" | "draft" | "published">("all");
  const [limit, setLimit] = useState(10);

  useEffect(() => {
    setLimit(10);
  }, [searchQuery, currentFilter]);

  const fetchSites = async () => {
    if (!token || !activeTenantId) return;
    try {
      setLoading(true);
      const res = await request<Site[]>("/sites", {
        headers: { "X-Tenant-ID": activeTenantId.toString() }
      }, token);
      const sortedSites = (res.data || []).sort((a, b) => {
        const timeA = new Date(a.updated_at || a.created_at || 0).getTime();
        const timeB = new Date(b.updated_at || b.created_at || 0).getTime();
        return timeB - timeA;
      });
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

  // Click outside to close dropdowns
  useEffect(() => {
    const handleOutsideClick = () => {
      setActiveDropdown(null);
    };
    window.addEventListener("click", handleOutsideClick);
    return () => window.removeEventListener("click", handleOutsideClick);
  }, []);

  const handlePublishToggle = async (site: Site) => {
    if (!token || !activeTenantId) return;
    try {
      setActionLoading(site.id);
      const action = site.status === "published" ? "unpublish" : "publish";
      await request<Site>(`/sites/${site.id}/${action}`, {
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

  const handleRenameSite = async (newName: string) => {
    if (!renameTarget || !token || !activeTenantId) return;
    try {
      setActionLoading(renameTarget.id);
      await request(`/sites/${renameTarget.id}`, {
        method: "PATCH",
        headers: { "X-Tenant-ID": activeTenantId.toString() },
        body: JSON.stringify({
          name: newName,
          template_id: renameTarget.template_id,
          subdomain: renameTarget.subdomain
        })
      }, token);
      pushToast("Nama website berhasil diubah.", "success");
      setRenameTarget(null);
      fetchSites();
    } catch (err: any) {
      pushToast(err.message || "Gagal mengubah nama website", "error");
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

  const handleDuplicateSite = async (site: Site) => {
    if (!token || !activeTenantId) return;
    try {
      setActionLoading(site.id);
      pushToast("Menduplikasi website...", "info");

      // 1. Get original content & design token
      const contentRes = await request<any>(`/sites/${site.id}/content`, {
        headers: { "X-Tenant-ID": activeTenantId.toString() }
      }, token);

      // Generate a random 4-char suffix for subdomain uniqueness
      const randSuffix = Math.random().toString(36).substring(2, 6);
      const newSubdomain = `${site.subdomain}-copy-${randSuffix}`.substring(0, 30);

      // 2. Create the duplicated site
      const createRes = await request<any>("/sites", {
        method: "POST",
        headers: { "X-Tenant-ID": activeTenantId.toString() },
        body: JSON.stringify({
          name: `${site.name} (Copy)`,
          template_id: site.template_id,
          subdomain: newSubdomain
        })
      }, token);

      if (createRes.status !== "success" || !createRes.data) {
        throw new Error(createRes.message || "Gagal membuat duplikat website");
      }

      const newSite = createRes.data;

      // 3. Put content to new site
      await request(`/sites/${newSite.id}/content`, {
        method: "PUT",
        headers: { "X-Tenant-ID": activeTenantId.toString() },
        body: JSON.stringify({
          content: contentRes.data?.content || {},
          design_token: contentRes.data?.design_token || {}
        })
      }, token);

      pushToast("Website berhasil diduplikat!", "success");
      fetchSites();
    } catch (err: any) {
      pushToast(err.message || "Gagal menduplikasi website", "error");
    } finally {
      setActionLoading(null);
    }
  };

  const handleCopyLink = (subdomain: string, siteId: number) => {
    const url = getSiteUrl(subdomain);
    navigator.clipboard.writeText(url);
    setCopiedId(siteId);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const getSiteUrl = (subdomain: string) => {
    if (typeof window === "undefined") return `http://localhost:3000/s/${subdomain}`;
    const host = window.location.host;
    if (host.includes("localhost") || host.includes("127.0.0.1")) {
      return `http://localhost:3000/s/${subdomain}`;
    }
    const domainPart = host.substring(host.indexOf(".") + 1);
    return `https://${subdomain}.${domainPart || "webjoz.com"}`;
  };

  const getFriendlyDate = (site: Site) => {
    const isLive = site.status === "published";
    const dateStr = isLive ? (site.published_at || site.updated_at || site.created_at) : (site.updated_at || site.created_at);
    if (!dateStr) return "";
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (60 * 1000));
    const diffHours = Math.floor(diffMs / (60 * 60 * 1000));
    const diffDays = Math.floor(diffMs / (24 * 60 * 60 * 1000));

    const prefix = isLive ? "Dipublikasikan" : "Diubah";

    if (diffMins < 1) return `${prefix} baru saja`;
    if (diffMins < 60) return `${prefix} ${diffMins} menit lalu`;
    if (diffHours < 24) return `${prefix} ${diffHours} jam lalu`;
    if (diffDays === 1) return `${prefix} kemarin`;
    if (diffDays < 7) return `${prefix} ${diffDays} hari lalu`;

    return `${prefix} ${date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
    })}`;
  };

  if (tenantLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-80 gap-3">
        <Loader2 className="w-6 h-6 text-primary animate-spin" />
        <p className="text-xs text-muted-foreground">Menghubungkan ke workspace...</p>
      </div>
    );
  }

  // Filtered lists
  const filteredSites = sites.filter(site => {
    const matchesSearch = site.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          site.subdomain.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = currentFilter === "all" || site.status === currentFilter;
    return matchesSearch && matchesFilter;
  });

  const displayedSites = filteredSites.slice(0, limit);

  // Counts
  const countAll = sites.length;
  const countDraft = sites.filter(s => s.status === "draft").length;
  const countPublished = sites.filter(s => s.status === "published").length;

  return (
    <div className="wrap max-w-[1080px] mx-auto text-[#f5f5f7] font-sans pb-20 space-y-6">
      {/* Modals */}
      {deleteTarget && (
        <DeleteConfirmModal
          siteName={deleteTarget.name}
          onConfirm={handleDeleteSite}
          onCancel={() => setDeleteTarget(null)}
          loading={actionLoading === deleteTarget.id}
        />
      )}

      {renameTarget && (
        <RenameModal
          currentName={renameTarget.name}
          onConfirm={handleRenameSite}
          onCancel={() => setRenameTarget(null)}
          loading={actionLoading === renameTarget.id}
        />
      )}

      {/* Panel / Header Card */}
      <div className="bg-[#13131a] border border-white/[0.08] rounded-[20px] p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold m-0 tracking-tight text-white">My Websites</h1>
          <p className="text-sm text-[#9b9ba5] m-0 mt-1.5">Kelola dan kustomisasi seluruh website Anda.</p>
        </div>
        <Link href="/dashboard/sites/new">
          <button className="flex items-center gap-2 bg-[#5b7cf8] text-white hover:brightness-105 active:scale-98 transition-all px-5 py-3 rounded-full font-medium text-[14.5px] cursor-pointer shadow-[0_4px_16px_rgba(91,124,248,0.2)]">
            <Plus className="w-4 h-4" /> Website AI Baru
          </button>
        </Link>
      </div>

      {/* Search Input bar */}
      <div className="relative">
        <Search className="absolute left-[18px] top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[#65656f] pointer-events-none" />
        <input 
          type="text" 
          placeholder="Cari website berdasarkan nama atau subdomain..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-[#1a1a23] border border-white/[0.08] hover:border-white/15 focus:border-[#5b7cf8]/50 rounded-full py-3.5 pl-12 pr-6 text-[15px] text-[#f5f5f7] outline-none transition-all placeholder:text-[#65656f]"
        />
        {searchQuery && (
          <button 
            onClick={() => setSearchQuery("")} 
            className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#9b9ba5] hover:text-white cursor-pointer"
          >
            Reset
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 flex-wrap">
        <button 
          onClick={() => setCurrentFilter("all")}
          className={`text-[13.5px] px-4 py-2 rounded-full border transition-all cursor-pointer flex items-center gap-1.5 ${
            currentFilter === "all" 
              ? "bg-[#f5f5f7] text-[#0a0a0f] border-[#f5f5f7]" 
              : "bg-transparent border-white/[0.08] text-[#9b9ba5] hover:border-white/15 hover:text-[#f5f5f7]"
          }`}
        >
          Semua <span className={`count text-[11px] font-mono ${currentFilter === "all" ? "text-[#0a0a0f]/60" : "text-[#65656f]"}`}>{countAll}</span>
        </button>
        <button 
          onClick={() => setCurrentFilter("draft")}
          className={`text-[13.5px] px-4 py-2 rounded-full border transition-all cursor-pointer flex items-center gap-1.5 ${
            currentFilter === "draft" 
              ? "bg-[#f5f5f7] text-[#0a0a0f] border-[#f5f5f7]" 
              : "bg-transparent border-white/[0.08] text-[#9b9ba5] hover:border-white/15 hover:text-[#f5f5f7]"
          }`}
        >
          Draft <span className={`count text-[11px] font-mono ${currentFilter === "draft" ? "text-[#0a0a0f]/60" : "text-[#65656f]"}`}>{countDraft}</span>
        </button>
        <button 
          onClick={() => setCurrentFilter("published")}
          className={`text-[13.5px] px-4 py-2 rounded-full border transition-all cursor-pointer flex items-center gap-1.5 ${
            currentFilter === "published" 
              ? "bg-[#f5f5f7] text-[#0a0a0f] border-[#f5f5f7]" 
              : "bg-transparent border-white/[0.08] text-[#9b9ba5] hover:border-white/15 hover:text-[#f5f5f7]"
          }`}
        >
          Dipublikasikan <span className={`count text-[11px] font-mono ${currentFilter === "published" ? "text-[#0a0a0f]/60" : "text-[#65656f]"}`}>{countPublished}</span>
        </button>
      </div>

      {/* Grid of Site Cards */}
      {loading && sites.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Loader2 className="w-6 h-6 text-primary animate-spin" />
          <p className="text-xs text-muted-foreground">Memuat situs Anda...</p>
        </div>
      ) : filteredSites.length === 0 ? (
        <div className="bg-[#13131a] border border-white/[0.08] rounded-2xl py-16 px-6 text-center max-w-lg mx-auto flex flex-col items-center gap-3">
          <div className="w-12 h-12 bg-white/[0.03] border border-white/[0.08] rounded-full flex items-center justify-center text-[#65656f]">
            <Search className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-lg text-white m-0">Tidak ada website yang cocok</h3>
          <p className="text-sm text-[#9b9ba5] m-0 max-w-sm leading-relaxed">
            Coba kata kunci pencarian lain, filter status yang berbeda, atau buat website baru.
          </p>
          {searchQuery && (
            <Button variant="outline" className="rounded-xl text-xs h-8 border-white/10 hover:bg-white/[0.04] mt-2" onClick={() => setSearchQuery("")}>
              Bersihkan Pencarian
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {displayedSites.map((site) => {
              const isLive = site.status === "published";
              const isWj = site.subdomain;
              const tplDef = getTemplate(site.template_id);
              const dToken = getTemplateDefaultDesignToken(site.template_id);
              const friendlyUrl = getSiteUrl(site.subdomain).replace("https://", "").replace("http://", "");

              return (
                <div key={site.id} className="bg-[#13131a] border border-white/[0.08] hover:border-white/[0.14] rounded-2xl p-[18px] flex flex-col gap-3.5 transition-all group relative">
                  {/* Real website preview iframe */}
                  <div className="w-full aspect-video rounded-lg relative overflow-hidden select-none bg-[#19191f]">
                    <IframePreview subdomain={site.subdomain} />
                  </div>

                  {/* Header / Info Row */}
                  <div className="flex justify-between items-start gap-2">
                    <div className="min-w-0">
                      <h3 className="text-[16px] font-semibold text-white m-0 truncate leading-tight group-hover:text-primary transition-colors">{site.name}</h3>
                      <span className="inline-block text-[11px] bg-[#1a1a23] text-[#9b9ba5] px-2.5 py-0.5 rounded mt-1 font-mono">
                        {tplDef?.name || site.template_id}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 shrink-0 relative">
                      {/* Status badge */}
                      <span className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full ${
                        isLive 
                          ? "bg-[#34c77b]/12 text-[#34c77b] border border-[#34c77b]/35 flex items-center gap-1" 
                          : "bg-[#1a1a23] text-[#9b9ba5]"
                      }`}>
                        {isLive && <span className="w-1.5 h-1.5 rounded-full bg-[#34c77b]" />}
                        {isLive ? "Live" : "Draft"}
                      </span>

                      {/* 3-dots Dropdown Trigger */}
                      <div className="relative">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveDropdown(activeDropdown === site.id ? null : site.id);
                          }}
                          className="p-1 rounded-lg text-[#9b9ba5] hover:text-white hover:bg-[#1a1a23] transition-colors cursor-pointer"
                          aria-label="Opsi lainnya"
                        >
                          <MoreVertical className="w-4.5 h-4.5" />
                        </button>

                        {/* Interactive Dropdown Menu */}
                        {activeDropdown === site.id && (
                          <div 
                            onClick={(e) => e.stopPropagation()} 
                            className="absolute top-8 right-0 z-20 bg-[#1a1a23] border border-white/[0.14] rounded-lg p-1.5 min-w-[170px] shadow-2xl flex flex-col gap-0.5 animate-in fade-in slide-in-from-top-1 duration-150"
                          >
                            <button 
                              onClick={() => {
                                handleDuplicateSite(site);
                                setActiveDropdown(null);
                              }}
                              disabled={actionLoading === site.id}
                              className="w-full text-left bg-transparent border-none text-[#f5f5f7] hover:bg-white/[0.06] text-[13.5px] px-2.5 py-2 rounded-md cursor-pointer flex items-center gap-2 transition-colors disabled:opacity-50"
                            >
                              <Copy className="w-3.5 h-3.5 text-[#9b9ba5]" /> Duplikat
                            </button>
                            <button 
                              onClick={() => {
                                setRenameTarget(site);
                                setActiveDropdown(null);
                              }}
                              className="w-full text-left bg-transparent border-none text-[#f5f5f7] hover:bg-white/[0.06] text-[13.5px] px-2.5 py-2 rounded-md cursor-pointer flex items-center gap-2 transition-colors"
                            >
                              <Edit3 className="w-3.5 h-3.5 text-[#9b9ba5]" /> Ganti nama
                            </button>
                            {isLive && (
                              <button 
                                onClick={() => {
                                  handlePublishToggle(site);
                                  setActiveDropdown(null);
                                }}
                                disabled={actionLoading === site.id}
                                className="w-full text-left bg-transparent border-none text-[#f5f5f7] hover:bg-white/[0.06] text-[13.5px] px-2.5 py-2 rounded-md cursor-pointer flex items-center gap-2 transition-colors disabled:opacity-50"
                              >
                                <EyeOff className="w-3.5 h-3.5 text-[#9b9ba5]" /> Batalkan publikasi
                              </button>
                            )}
                            <button 
                              onClick={() => {
                                setDeleteTarget(site);
                                setActiveDropdown(null);
                              }}
                              disabled={actionLoading === site.id}
                              className="w-full text-left bg-transparent border-none text-[#f0556b] hover:bg-[#f0556b]/10 text-[13.5px] px-2.5 py-2 rounded-md cursor-pointer flex items-center gap-2 transition-colors disabled:opacity-50 font-medium"
                            >
                              <Trash2 className="w-3.5 h-3.5" /> Hapus
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Subdomain URL Row */}
                  <div className="bg-[#1a1a23] rounded-lg px-3 py-2 flex items-center justify-between gap-2 border border-white/[0.02]">
                    <div className="flex items-center gap-2 min-w-0">
                      <Globe className="w-3.5 h-3.5 text-[#65656f] shrink-0" />
                      <span className="text-[12.5px] text-[#f5f5f7] font-mono truncate select-all">{friendlyUrl}</span>
                    </div>
                    <button 
                      onClick={() => handleCopyLink(site.subdomain, site.id)}
                      className={`p-1 text-[#9b9ba5] hover:text-white hover:bg-white/[0.06] rounded transition-all cursor-pointer shrink-0 ${copiedId === site.id ? "text-[#34c77b] bg-[#34c77b]/10" : ""}`}
                      aria-label="Salin tautan"
                    >
                      {copiedId === site.id ? <Check className="w-3.5 h-3.5 text-[#34c77b]" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  {/* Modification Time Row */}
                  <div className="flex items-center gap-1 text-[11.5px] text-[#65656f] font-medium">
                    <Info className="w-3.5 h-3.5" />
                    <span>{getFriendlyDate(site)}</span>
                  </div>

                  {/* Primary card actions */}
                  <div className="flex gap-2 border-t border-white/[0.08] pt-3.5 mt-1">
                    <Link 
                      href={`/dashboard/sites/${site.id}`} 
                      className="flex-1 py-2 px-1 rounded-xl border border-white/10 text-white hover:bg-white/[0.04] transition-all font-semibold text-[12px] flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" /> Edit & Preview
                    </Link>

                    {isLive ? (
                      <button 
                        onClick={() => window.open(getSiteUrl(site.subdomain), "_blank")}
                        className="flex-1 py-2 px-1 rounded-xl border border-white/10 bg-[#1a1a23] text-white hover:bg-white/[0.06] transition-all font-semibold text-[12px] cursor-pointer flex items-center justify-center gap-1.5 whitespace-nowrap"
                      >
                        <Globe className="w-3.5 h-3.5" /> Lihat Web
                      </button>
                    ) : (
                      <button 
                        onClick={() => handlePublishToggle(site)}
                        disabled={actionLoading === site.id}
                        className="flex-1 py-2 px-1 rounded-xl bg-[#5b7cf8]/12 text-[#a9bcff] border border-[#5b7cf8]/40 hover:bg-[#5b7cf8]/20 transition-all font-semibold text-[12px] cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50 whitespace-nowrap"
                      >
                        {actionLoading === site.id ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5" /> Publikasikan
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Load More Button */}
          {filteredSites.length > limit && (
            <div className="flex justify-center pt-4">
              <button 
                onClick={() => setLimit(prev => prev + 10)}
                className="bg-transparent border border-white/[0.14] hover:bg-white/[0.04] text-white font-medium text-xs px-6 py-2.5 rounded-xl cursor-pointer flex items-center gap-1.5 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Muat Lebih Banyak
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
