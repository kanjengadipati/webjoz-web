"use client";

import React, { useState, useEffect } from "react";
import { useAuthToken } from "@/lib/auth-store";
import { useActiveTenant } from "@/lib/tenant-store";
import { request } from "@/lib/api/client";
import { 
  Link2, Plus, Loader2, Trash2, CheckCircle2, AlertTriangle, 
  HelpCircle, RefreshCw, Globe, ArrowRight, Server, Copy, Check
} from "lucide-react";
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Badge } from "@/components/ui";
import { useToast } from "@/components/toast-provider";

interface Domain {
  id: number;
  created_at: string;
  tenant_id: number;
  site_id: number;
  domain: string;
  type: string;
  status: "pending" | "verified" | "failed";
  verified_at?: string;
}

interface Site {
  id: number;
  name: string;
  subdomain: string;
}

export default function DomainsPage() {
  const token = useAuthToken();
  const { pushToast } = useToast();
  const { activeTenantId } = useActiveTenant();

  const [domains, setDomains] = useState<Domain[]>([]);
  const [sites, setSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  // Add domain states
  const [showAddForm, setShowAddForm] = useState(false);
  const [targetSiteId, setTargetSiteId] = useState("");
  const [domainName, setDomainName] = useState("");
  const [copied, setCopied] = useState(false);

  const fetchData = async () => {
    if (!token || !activeTenantId) return;
    try {
      setLoading(true);
      // Fetch domains
      const domainsRes = await request<Domain[]>("/domains", {
        headers: { "X-Tenant-ID": activeTenantId.toString() }
      }, token);
      setDomains(domainsRes.data || []);

      // Fetch sites for dropdown
      const sitesRes = await request<Site[]>("/sites", {
        headers: { "X-Tenant-ID": activeTenantId.toString() }
      }, token);
      setSites(sitesRes.data || []);
      
      // Handle pre-selecting site from URL search params
      const params = new URLSearchParams(window.location.search);
      const querySiteId = params.get("site_id");
      if (querySiteId && sitesRes.data && sitesRes.data.some(s => s.id.toString() === querySiteId)) {
        setTargetSiteId(querySiteId);
        setShowAddForm(true);
      } else if (sitesRes.data && sitesRes.data.length > 0) {
        setTargetSiteId(sitesRes.data[0].id.toString());
      }
    } catch (err: any) {
      pushToast(err.message || "Gagal memuat data domain", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTenantId) {
      fetchData();
    }
  }, [activeTenantId]);

  const handleAddDomain = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !activeTenantId || !domainName || !targetSiteId) return;
    try {
      setLoading(true);
      const cleanDomain = domainName.toLowerCase().trim();
      const res = await request<Domain>("/domains", {
        method: "POST",
        headers: { "X-Tenant-ID": activeTenantId.toString() },
        body: JSON.stringify({
          site_id: Number(targetSiteId),
          domain: cleanDomain,
        }),
      }, token);

      pushToast("Domain berhasil ditambahkan! Silakan atur CNAME di DNS registrar Anda.", "success");
      setDomainName("");
      setShowAddForm(false);
      fetchData();
    } catch (err: any) {
      pushToast(err.message || "Gagal menambahkan domain", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyDomain = async (domainId: number) => {
    if (!token || !activeTenantId) return;
    try {
      setActionLoading(domainId);
      const res = await request<any>("/domains/verify", {
        method: "POST",
        headers: { "X-Tenant-ID": activeTenantId.toString() },
        body: JSON.stringify({ domain_id: domainId }),
      }, token);

      pushToast("Domain berhasil diverifikasi dan aktif!", "success");
      fetchData();
    } catch (err: any) {
      pushToast(err.message || "DNS Verification failed. Silakan periksa record CNAME Anda kembali.", "error");
      fetchData();
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteDomain = async (domainId: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus domain ini?")) return;
    if (!token || !activeTenantId) return;
    try {
      setActionLoading(domainId);
      await request(`/domains/${domainId}`, {
        method: "DELETE",
        headers: { "X-Tenant-ID": activeTenantId.toString() },
      }, token);
      pushToast("Domain berhasil dihapus.", "success");
      fetchData();
    } catch (err: any) {
      pushToast(err.message || "Gagal menghapus domain", "error");
    } finally {
      setActionLoading(null);
    }
  };

  const handleCopyCNAME = () => {
    navigator.clipboard.writeText("sites.webjoz.com");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading && domains.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-80 gap-3">
        <Loader2 className="w-6 h-6 text-primary animate-spin" />
        <p className="text-xs text-muted-foreground">Memuat data domain...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-4">
        <div>
          <h1 className="text-lg font-bold tracking-tight">Custom Domains</h1>
          <p className="text-xs text-muted-foreground">Tautkan alamat domain milik Anda sendiri ke website publik.</p>
        </div>
        {!showAddForm && (
          <Button 
            disabled={sites.length === 0}
            onClick={() => setShowAddForm(true)} 
            className="rounded-full gap-1.5"
          >
            <Plus className="w-4 h-4" />
            Tautkan Domain
          </Button>
        )}
      </div>

      {/* Add Domain Form Block */}
      {showAddForm && (
        <Card className="border-border/40 shadow-xl max-w-xl">
          <CardHeader>
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Link2 className="w-4 h-4 text-primary" />
              Tautkan Domain Baru
            </CardTitle>
            <CardDescription className="text-xs">
              Masukkan alamat domain Anda dan pilih website yang ingin ditautkan.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddDomain} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500">Pilih Website</label>
                  <select 
                    value={targetSiteId} 
                    onChange={(e) => setTargetSiteId(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl text-xs outline-none focus:border-primary"
                  >
                    {sites.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.subdomain})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500">Alamat Domain Custom</label>
                  <input 
                    type="text" 
                    required
                    value={domainName}
                    onChange={(e) => setDomainName(e.target.value)}
                    placeholder="cth. kopijogja.com"
                    className="w-full px-3 py-2 border rounded-xl text-xs outline-none focus:border-primary"
                  />
                </div>
              </div>

              {/* Instructions container */}
              <div className="p-4 bg-slate-50 border rounded-2xl space-y-2.5">
                <h4 className="text-xs font-bold flex items-center gap-1.5 text-slate-700">
                  <Server className="w-3.5 h-3.5" />
                  Instruksi Pengaturan CNAME Registrar DNS
                </h4>
                <p className="text-[10px] text-muted-foreground leading-relaxed">
                  Buka dashboard registrar domain Anda (cth. Niagahoster, GoDaddy, dll), cari menu kelola DNS, lalu tambahkan record berikut:
                </p>
                <div className="grid grid-cols-3 gap-2 text-[10px] font-mono border-t pt-2.5">
                  <div>
                    <span className="font-sans block font-semibold text-slate-400">TIPE</span>
                    CNAME
                  </div>
                  <div>
                    <span className="font-sans block font-semibold text-slate-400">HOST/NAME</span>
                    @ atau www
                  </div>
                  <div className="flex items-center justify-between col-span-1">
                    <div>
                      <span className="font-sans block font-semibold text-slate-400">TARGET/VALUE</span>
                      sites.webjoz.com
                    </div>
                    <button 
                      type="button" 
                      onClick={handleCopyCNAME}
                      className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-500"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <Button type="button" variant="outline" className="flex-1 rounded-xl" onClick={() => setShowAddForm(false)}>
                  Batal
                </Button>
                <Button type="submit" className="flex-1 rounded-xl">
                  Tautkan
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {domains.length === 0 ? (
        <Card className="border-dashed border-border/70 p-12 text-center max-w-lg mx-auto">
          <div className="w-16 h-16 bg-primary/5 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
            <Globe className="w-8 h-8 opacity-75" />
          </div>
          <h2 className="text-xl font-bold mb-2">Belum Ada Domain Kustom</h2>
          <p className="text-xs text-muted-foreground mb-6 max-w-sm mx-auto leading-relaxed">
            Anda belum menambahkan domain kustom. Tambahkan domain Anda sekarang untuk mempublikasikan website dengan branding profesional.
          </p>
          <Button disabled={sites.length === 0} onClick={() => setShowAddForm(true)} className="rounded-full gap-2">
            Mulai Hubungkan Domain
          </Button>
        </Card>
      ) : (
        <div className="space-y-4">
          {domains.map((dom) => {
            const mappedSite = sites.find(s => s.id === dom.site_id);
            return (
              <Card key={dom.id} className="border-border/40 hover:shadow-sm transition-all duration-300">
                <CardContent className="p-6 flex flex-wrap items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-base tracking-tight">{dom.domain}</h3>
                      <Badge 
                        variant={dom.status === "verified" ? "default" : dom.status === "failed" ? "destructive" : "secondary"}
                        className="text-[9px] font-bold py-0 h-4 px-2 capitalize"
                      >
                        {dom.status}
                      </Badge>
                    </div>
                    <div className="text-[10px] text-muted-foreground">
                      Menghubungkan ke: <span className="font-semibold">{mappedSite?.name || `Website ID #${dom.site_id}`}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {dom.status !== "verified" && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="rounded-xl gap-1.5 text-xs h-9"
                        onClick={() => handleVerifyDomain(dom.id)}
                        disabled={actionLoading === dom.id}
                      >
                        {actionLoading === dom.id ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <RefreshCw className="w-3.5 h-3.5" />
                        )}
                        Verifikasi DNS
                      </Button>
                    )}
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="rounded-xl h-9 w-9 text-red-500 hover:text-red-600 hover:bg-red-50"
                      onClick={() => handleDeleteDomain(dom.id)}
                      disabled={actionLoading === dom.id}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
