"use client";

import React, { useState, useEffect } from "react";
import { useAuthToken } from "@/lib/auth-store";
import { useActiveTenant } from "@/lib/tenant-store";
import { request } from "@/lib/api/client";
import {
  Loader2, Trash2, Globe, Clock, RefreshCw,
  Server, Copy, Info, Check, Sparkles, ArrowRight,
  Link2, ChevronUp,
} from "lucide-react";
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

const WEBJOZ_SUFFIX = ".webjoz.com";
const CNAME_TARGET  = "sites.webjoz.com";

// subdomain prefix: lowercase letters, numbers, hyphens, 3-30 chars
const subdomainRegex = /^[a-z0-9][a-z0-9-]{1,28}[a-z0-9]$/;
const customDomainRegex = /^([a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,}$/i;

export default function DomainsPage() {
  const token          = useAuthToken();
  const { pushToast }  = useToast();
  const { activeTenantId } = useActiveTenant();

  const [domains,       setDomains]       = useState<Domain[]>([]);
  const [sites,         setSites]         = useState<Site[]>([]);
  const [loading,       setLoading]       = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  // ── Webjoz subdomain form ────────────────────────────────
  const [wjSiteId,      setWjSiteId]      = useState("");
  const [wjPrefix,      setWjPrefix]      = useState("");   // just the prefix part
  const [wjFormOpen,    setWjFormOpen]    = useState(false);
  const [wjSubmitting,  setWjSubmitting]  = useState(false);

  // ── Custom domain form ───────────────────────────────────
  const [cdSiteId,      setCdSiteId]      = useState("");
  const [cdDomain,      setCdDomain]      = useState("");
  const [cdFormOpen,    setCdFormOpen]    = useState(false);
  const [cdSubmitting,  setCdSubmitting]  = useState(false);
  const [copied,        setCopied]        = useState(false);

  // ────────────────────────────────────────────────────────
  const fetchData = async () => {
    if (!token || !activeTenantId) return;
    try {
      setLoading(true);
      const [dr, sr] = await Promise.all([
        request<Domain[]>("/domains", { headers: { "X-Tenant-ID": activeTenantId.toString() } }, token),
        request<Site[]>  ("/sites",   { headers: { "X-Tenant-ID": activeTenantId.toString() } }, token),
      ]);
      setDomains(dr.data || []);
      const list = sr.data || [];
      setSites(list);
      if (list.length > 0) { setWjSiteId(list[0].id.toString()); setCdSiteId(list[0].id.toString()); }

      const params      = new URLSearchParams(window.location.search);
      const qSiteId     = params.get("site_id");
      if (qSiteId && list.some(s => s.id.toString() === qSiteId)) {
        setCdSiteId(qSiteId);
        setCdFormOpen(true);
      }
    } catch (err: any) {
      pushToast(err.message || "Gagal memuat data domain", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (activeTenantId) fetchData(); }, [activeTenantId]);

  // ── Submit helpers ────────────────────────────────────────
  const submitDomain = async (domain: string, siteId: string, onSuccess: () => void) => {
    await request<Domain>("/domains", {
      method: "POST",
      headers: { "X-Tenant-ID": activeTenantId!.toString() },
      body: JSON.stringify({ site_id: Number(siteId), domain }),
    }, token!);
    onSuccess();
    fetchData();
  };

  const handleAddWebjoz = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wjPrefix || !wjSiteId) return;
    try {
      setWjSubmitting(true);
      const domain = `${wjPrefix.toLowerCase().trim()}${WEBJOZ_SUFFIX}`;
      await submitDomain(domain, wjSiteId, () => {
        pushToast("Subdomain berhasil ditautkan!", "success");
        setWjPrefix("");
        setWjFormOpen(false);
      });
    } catch (err: any) {
      pushToast(err.message || "Gagal menambahkan subdomain", "error");
    } finally {
      setWjSubmitting(false);
    }
  };

  const handleAddCustom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cdDomain || !cdSiteId) return;
    try {
      setCdSubmitting(true);
      await submitDomain(cdDomain.toLowerCase().trim(), cdSiteId, () => {
        pushToast("Domain berhasil ditautkan! Silakan atur CNAME di DNS registrar Anda.", "success");
        setCdDomain("");
        setCdFormOpen(false);
      });
    } catch (err: any) {
      pushToast(err.message || "Gagal menambahkan domain", "error");
    } finally {
      setCdSubmitting(false);
    }
  };

  const handleVerify = async (id: number) => {
    if (!token || !activeTenantId) return;
    try {
      setActionLoading(id);
      await request<any>("/domains/verify", {
        method: "POST",
        headers: { "X-Tenant-ID": activeTenantId.toString() },
        body: JSON.stringify({ domain_id: id }),
      }, token);
      pushToast("Domain berhasil diverifikasi!", "success");
      fetchData();
    } catch (err: any) {
      pushToast(err.message || "Verifikasi DNS gagal. Periksa record CNAME Anda.", "error");
      fetchData();
    } finally { setActionLoading(null); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Hapus domain ini?") || !token || !activeTenantId) return;
    try {
      setActionLoading(id);
      await request(`/domains/${id}`, {
        method: "DELETE",
        headers: { "X-Tenant-ID": activeTenantId.toString() },
      }, token);
      pushToast("Domain dihapus.", "success");
      fetchData();
    } catch (err: any) {
      pushToast(err.message || "Gagal menghapus domain", "error");
    } finally { setActionLoading(null); }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(CNAME_TARGET);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // ── Derived ───────────────────────────────────────────────
  const wjDomains  = domains.filter(d => d.domain.endsWith(WEBJOZ_SUFFIX));
  const cdDomains  = domains.filter(d => !d.domain.endsWith(WEBJOZ_SUFFIX));
  const wjValid    = subdomainRegex.test(wjPrefix.trim());
  const cdValid    = customDomainRegex.test(cdDomain.trim());
  const wjPreview  = wjPrefix.trim() ? `${wjPrefix.trim().toLowerCase()}${WEBJOZ_SUFFIX}` : "";

  // ────────────────────────────────────────────────────────
  if (loading && domains.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-80 gap-3">
        <Loader2 className="w-5 h-5 text-[#9a9aa3] animate-spin" />
        <p className="text-[13px] text-[#6b6b75]">Memuat data domain...</p>
      </div>
    );
  }

  // ── Shared domain row ─────────────────────────────────────
  const DomainRow = ({ dom }: { dom: Domain }) => {
    const site = sites.find(s => s.id === dom.site_id);
    const ok   = dom.status === "verified";
    const busy = actionLoading === dom.id;
    return (
      <div className="bg-[#15151a] border border-white/[0.08] rounded-2xl px-5 py-3.5 flex items-center gap-3">
        <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${ok ? "bg-[#3ddc84]/12 text-[#5fe3a0]" : "bg-[#f0b429]/12 text-[#f3c451]"}`}>
          {ok ? <Globe className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-[14px] m-0 text-[#f3f3f4] truncate">{dom.domain}</p>
          <p className="text-[12px] text-[#6b6b75] m-0 mt-0.5 truncate">
            → {site?.name || `Site #${dom.site_id}`}
            {!ok && " · menunggu propagasi DNS"}
          </p>
        </div>
        <span className={`text-[11px] px-2.5 py-1 rounded-full font-semibold shrink-0 ${ok ? "bg-[#3ddc84]/12 text-[#5fe3a0]" : "bg-[#f0b429]/12 text-[#f3c451]"}`}>
          {ok ? "Aktif" : "Pending"}
        </span>
        <div className="flex items-center gap-1.5">
          {!ok && (
            <button onClick={() => handleVerify(dom.id)} disabled={busy}
              className="w-8 h-8 rounded-lg border border-white/10 bg-[#1b1b21] text-[#9a9aa3] flex items-center justify-center hover:text-white hover:border-white/25 transition-colors disabled:opacity-40 cursor-pointer" title="Cek DNS">
              {busy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
            </button>
          )}
          <button onClick={() => handleDelete(dom.id)} disabled={busy}
            className="w-8 h-8 rounded-lg border border-white/10 bg-[#1b1b21] text-[#9a9aa3] flex items-center justify-center hover:text-red-400 hover:border-red-400/40 transition-colors disabled:opacity-40 cursor-pointer" title="Hapus">
            {busy && ok ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
    );
  };

  // ── Section header helper ────────────────────────────────
  const SectionHeader = ({
    title, badge, count, subtitle, action,
  }: {
    title: string; badge?: React.ReactNode; count?: number;
    subtitle: string; action?: React.ReactNode;
  }) => (
    <div className="flex items-start justify-between mb-3">
      <div>
        <h2 className="text-[15px] font-bold m-0 text-[#f3f3f4] flex items-center gap-2 flex-wrap">
          {title}
          {count !== undefined && count > 0 && <span className="text-[#6b6b75] font-normal">({count})</span>}
          {badge}
        </h2>
        <p className="text-[13px] text-[#6b6b75] m-0 mt-0.5">{subtitle}</p>
      </div>
      {action}
    </div>
  );

  // ────────────────────────────────────────────────────────────
  return (
    <div className="max-w-3xl text-[#f3f3f4] font-sans space-y-10">

      {/* ═══════════════════════════════════════════════
          SECTION 1 — Subdomain Webjoz
      ══════════════════════════════════════════════ */}
      <section>
        <SectionHeader
          title="Subdomain Webjoz"
          count={wjDomains.length}
          subtitle={`Domain gratis — format: namaanda${WEBJOZ_SUFFIX}`}
          action={
            wjDomains.length > 0 && !wjFormOpen ? (
              <button onClick={() => setWjFormOpen(true)}
                className="shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-[13px] font-semibold bg-white/[0.07] text-[#f3f3f4] border border-white/10 hover:bg-white/10 transition-colors cursor-pointer">
                + Tambah
              </button>
            ) : null
          }
        />

        {/* List */}
        {wjDomains.length > 0 && (
          <div className="flex flex-col gap-2 mb-3">
            {wjDomains.map(dom => <DomainRow key={dom.id} dom={dom} />)}
          </div>
        )}

        {/* Form — collapsible */}
        {wjFormOpen ? (
          <form onSubmit={handleAddWebjoz} className="bg-[#15151a] border border-white/[0.08] rounded-2xl px-6 py-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[14px] font-bold text-[#f3f3f4]">Pilih nama subdomain</span>
              <button type="button" onClick={() => { setWjFormOpen(false); setWjPrefix(""); }}
                className="text-[#6b6b75] hover:text-[#9a9aa3] transition-colors cursor-pointer">
                <ChevronUp className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[12px] font-semibold text-[#8fa8ff] mb-1.5">Website</label>
                <select value={wjSiteId} onChange={e => setWjSiteId(e.target.value)}
                  className="w-full bg-[#0b0b0d] border border-white/15 rounded-xl px-4 py-2.5 text-[14px] text-[#f3f3f4] outline-none focus:border-[#6f6fff] cursor-pointer">
                  {sites.map(s => <option key={s.id} value={s.id}>{s.name} ({s.subdomain})</option>)}
                  {sites.length === 0 && <option disabled value="">Belum ada website</option>}
                </select>
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-[#8fa8ff] mb-1.5">Nama subdomain</label>
                {/* Input with inline suffix */}
                <div className={`flex items-center bg-[#0b0b0d] border rounded-xl overflow-hidden transition-colors ${wjPrefix && !wjValid ? "border-[#ff8a8a]" : "border-white/15 focus-within:border-[#6f6fff]"}`}>
                  <input
                    type="text"
                    value={wjPrefix}
                    onChange={e => setWjPrefix(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                    placeholder="namaanda"
                    maxLength={30}
                    className="flex-1 bg-transparent px-4 py-2.5 text-[14px] text-[#f3f3f4] outline-none placeholder:text-[#6b6b75] min-w-0"
                  />
                  <span className="px-3 py-2.5 text-[13px] text-[#6b6b75] font-mono shrink-0 border-l border-white/[0.06] bg-white/[0.02]">.webjoz.com</span>
                </div>
                {wjPreview && (
                  <p className={`text-[11px] mt-1.5 mx-0.5 font-mono ${wjValid ? "text-[#5fe3a0]" : "text-[#ff8a8a]"}`}>
                    {wjValid ? `✓ ${wjPreview}` : "Gunakan huruf kecil, angka, atau tanda hubung (-)"}
                  </p>
                )}
              </div>
            </div>

            <div className="flex gap-2.5 pt-1">
              <button type="button" onClick={() => { setWjFormOpen(false); setWjPrefix(""); }}
                className="flex-1 py-2.5 rounded-xl text-[14px] font-semibold bg-transparent text-[#9a9aa3] border border-white/10 hover:bg-white/[0.04] transition-colors cursor-pointer">
                Batal
              </button>
              <button type="submit" disabled={!wjValid || wjSubmitting}
                className="flex-1 py-2.5 rounded-xl text-[14px] font-semibold bg-white text-[#0b0b0d] hover:bg-[#e6e6e6] disabled:bg-[#2a2a2a] disabled:text-[#6b6b75] disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 cursor-pointer">
                {wjSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Tautkan Subdomain"}
              </button>
            </div>
          </form>
        ) : wjDomains.length === 0 ? (
          /* Empty state + inline CTA */
          <div className="bg-[#15151a] border border-white/[0.08] rounded-2xl px-5 py-4 flex items-center justify-between gap-4">
            <p className="text-[13px] text-[#6b6b75] m-0">
              Belum ada subdomain. Buat subdomain gratis untuk website Anda.
            </p>
            <button onClick={() => setWjFormOpen(true)}
              className="shrink-0 px-4 py-2 rounded-xl text-[13px] font-semibold bg-white/[0.07] text-[#f3f3f4] border border-white/10 hover:bg-white/10 transition-colors cursor-pointer">
              + Buat Subdomain
            </button>
          </div>
        ) : null}
      </section>

      {/* ═══════════════════════════════════════════════
          SECTION 2 — Custom Domain (Premium)
      ══════════════════════════════════════════════ */}
      <section>
        <SectionHeader
          title="Custom Domain"
          count={cdDomains.length}
          badge={<span className="bg-[#6f6fff]/15 text-[#8fa8ff] text-[10px] px-2 py-0.5 rounded-md uppercase tracking-wider font-bold">Premium</span>}
          subtitle={`Domain sendiri (mis. tokokamu.com) — tampil lebih profesional`}
          action={
            cdDomains.length > 0 && !cdFormOpen ? (
              <button onClick={() => setCdFormOpen(true)}
                className="shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-[13px] font-semibold bg-[#6f6fff] text-white hover:bg-[#5a5ae8] transition-colors cursor-pointer">
                <Link2 className="w-3.5 h-3.5" /> Tambah
              </button>
            ) : null
          }
        />

        {/* List */}
        {cdDomains.length > 0 && (
          <div className="flex flex-col gap-2 mb-3">
            {cdDomains.map(dom => <DomainRow key={dom.id} dom={dom} />)}
          </div>
        )}

        {/* Upsell banner — only when no custom domain yet and form closed */}
        {cdDomains.length === 0 && !cdFormOpen && (
          <div className="relative overflow-hidden rounded-2xl border border-[#6f6fff]/25 bg-gradient-to-br from-[#191930] to-[#15151a] px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="absolute -top-10 -right-10 w-36 h-36 rounded-full bg-[#6f6fff]/10 blur-2xl pointer-events-none" />
            <div className="w-10 h-10 rounded-xl bg-[#6f6fff]/15 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-[#8fa8ff]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-[14px] m-0 text-[#f3f3f4]">Punya domain sendiri?</p>
              <p className="text-[13px] text-[#9a9aa3] mt-1 m-0 leading-relaxed">
                Tampil lebih profesional dengan domain milik Anda — pelanggan lebih mudah mengingat dan mempercayai brand Anda.
              </p>
            </div>
            <button onClick={() => setCdFormOpen(true)}
              className="relative z-10 shrink-0 flex items-center gap-1.5 px-5 py-2.5 rounded-full text-[13px] font-semibold bg-[#6f6fff] text-white hover:bg-[#5a5ae8] transition-colors cursor-pointer">
              Tautkan Domain <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Custom domain form — collapsible */}
        {cdFormOpen && (
          <form onSubmit={handleAddCustom} className="bg-[#15151a] border border-white/[0.08] rounded-2xl px-6 py-5 space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Link2 className="w-4 h-4 text-[#8fa8ff]" />
                <h3 className="m-0 text-[14px] font-bold text-[#f3f3f4]">Tautkan Custom Domain</h3>
              </div>
              <button type="button" onClick={() => { setCdFormOpen(false); setCdDomain(""); }}
                className="text-[#6b6b75] hover:text-[#9a9aa3] transition-colors cursor-pointer">
                <ChevronUp className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[12px] font-semibold text-[#8fa8ff] mb-1.5">Website</label>
                <select value={cdSiteId} onChange={e => setCdSiteId(e.target.value)}
                  className="w-full bg-[#0b0b0d] border border-white/15 rounded-xl px-4 py-2.5 text-[14px] text-[#f3f3f4] outline-none focus:border-[#6f6fff] cursor-pointer">
                  {sites.map(s => <option key={s.id} value={s.id}>{s.name} ({s.subdomain})</option>)}
                  {sites.length === 0 && <option disabled value="">Belum ada website</option>}
                </select>
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-[#8fa8ff] mb-1.5">Alamat domain</label>
                <input type="text" value={cdDomain} onChange={e => setCdDomain(e.target.value)}
                  placeholder="cth. tokokamu.com"
                  className="w-full bg-[#0b0b0d] border border-white/15 rounded-xl px-4 py-2.5 text-[14px] text-[#f3f3f4] outline-none focus:border-[#6f6fff] placeholder:text-[#6b6b75]" />
                {cdDomain.trim() !== "" && (
                  <p className={`text-[11px] mt-1 mx-0.5 ${cdValid ? "text-[#5fe3a0]" : "text-[#ff8a8a]"}`}>
                    {cdValid ? "Format valid" : "Format tidak valid — tanpa https:// atau www."}
                  </p>
                )}
              </div>
            </div>

            {/* DNS instruction card */}
            <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-4">
              <div className="flex items-center gap-2 mb-2">
                <Server className="w-4 h-4 text-[#8fa8ff]" />
                <span className="text-[13px] font-semibold text-[#c8c8d4]">Instruksi CNAME DNS</span>
              </div>
              <p className="text-[12px] text-[#6b6b75] m-0 mb-3 leading-relaxed">
                Buka registrar domain Anda (Niagahoster, GoDaddy, dll) → Kelola DNS → tambahkan record:
              </p>
              <div className="grid grid-cols-[60px_80px_1fr_32px] gap-2 text-[10px] uppercase tracking-wider text-[#6b6b75] pb-2 border-b border-white/[0.06]">
                <span>Tipe</span><span>Host</span><span>Value/Target</span><span />
              </div>
              <div className="grid grid-cols-[60px_80px_1fr_32px] gap-2 items-center pt-2.5 font-mono text-[13px] text-[#c8c8d4]">
                <span>CNAME</span>
                <span>www</span>
                <span className="truncate">{CNAME_TARGET}</span>
                <button type="button" onClick={handleCopy}
                  className="w-7 h-7 rounded-lg border border-white/10 bg-white/[0.04] text-[#9a9aa3] flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer">
                  {copied ? <Check className="w-3.5 h-3.5 text-[#5fe3a0]" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              {copied && <p className="text-[11px] text-[#5fe3a0] mt-2 m-0">Disalin!</p>}
            </div>

            <div className="flex items-start gap-2 text-[12px] text-[#6b6b75]">
              <Info className="w-3.5 h-3.5 mt-0.5 shrink-0" />
              <span>Propagasi DNS bisa memakan waktu 5 menit–24 jam. Status otomatis berubah ke "Aktif" setelah terdeteksi.</span>
            </div>

            <div className="flex gap-2.5 pt-1">
              <button type="button" onClick={() => { setCdFormOpen(false); setCdDomain(""); }}
                className="flex-1 py-2.5 rounded-xl text-[14px] font-semibold bg-transparent text-[#9a9aa3] border border-white/10 hover:bg-white/[0.04] transition-colors cursor-pointer">
                Batal
              </button>
              <button type="submit" disabled={!cdValid || cdSubmitting}
                className="flex-1 py-2.5 rounded-xl text-[14px] font-semibold bg-[#6f6fff] text-white hover:bg-[#5a5ae8] disabled:bg-[#2a2a4a] disabled:text-[#6b6baa] disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 cursor-pointer">
                {cdSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Tautkan Domain"}
              </button>
            </div>
          </form>
        )}
      </section>
    </div>
  );
}
