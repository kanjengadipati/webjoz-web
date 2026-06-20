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
import { Dialog } from "@/components/ui/dialog";

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

  // Consolidated Form States
  const [siteId,        setSiteId]        = useState("");
  const [isCustom,      setIsCustom]      = useState(false);
  const [domainInput,   setDomainInput]   = useState("");
  const [submitting,    setSubmitting]    = useState(false);
  const [copied,        setCopied]        = useState(false);
  const [showUpsellModal, setShowUpsellModal] = useState(false);

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

      const params      = new URLSearchParams(window.location.search);
      const qSiteId     = params.get("site_id");
      if (qSiteId && list.some(s => s.id.toString() === qSiteId)) {
        setSiteId(qSiteId);
        const selectedSite = list.find(s => s.id.toString() === qSiteId);
        if (selectedSite) {
          setDomainInput(selectedSite.subdomain);
        }
      } else if (list.length > 0) {
        setSiteId(list[0].id.toString());
        setDomainInput(list[0].subdomain);
      }
    } catch (err: any) {
      pushToast(err.message || "Gagal memuat data domain", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (activeTenantId) fetchData(); }, [activeTenantId]);

  // ── Submit helpers ────────────────────────────────────────
  const handleAddDomain = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !activeTenantId || !domainInput || !siteId) return;

    const trimmed = domainInput.toLowerCase().trim();
    const finalDomain = isCustom ? trimmed : `${trimmed}${WEBJOZ_SUFFIX}`;

    // Validate
    if (isCustom) {
      if (!customDomainRegex.test(trimmed)) {
        pushToast("Format domain tidak valid. Contoh: domainanda.com", "error");
        return;
      }
    } else {
      if (!subdomainRegex.test(trimmed)) {
        pushToast("Format subdomain tidak valid. Gunakan huruf kecil, angka, atau tanda hubung (-)", "error");
        return;
      }
    }

    try {
      setSubmitting(true);
      await request<Domain>("/domains", {
        method: "POST",
        headers: { "X-Tenant-ID": activeTenantId.toString() },
        body: JSON.stringify({ site_id: Number(siteId), domain: finalDomain }),
      }, token);

      if (isCustom) {
        pushToast("Custom domain berhasil ditautkan! Silakan atur CNAME di DNS registrar Anda.", "success");
        setDomainInput("");
      } else {
        pushToast("Subdomain berhasil ditautkan!", "success");
        const selectedSite = sites.find(s => s.id.toString() === siteId);
        setDomainInput(selectedSite ? selectedSite.subdomain : "");
      }
      fetchData();
    } catch (err: any) {
      pushToast(err.message || "Gagal menambahkan domain", "error");
    } finally {
      setSubmitting(false);
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

  const selectSubdomain = () => {
    setIsCustom(false);
    const selectedSite = sites.find(s => s.id.toString() === siteId);
    setDomainInput(selectedSite ? selectedSite.subdomain : "");
  };

  const selectCustom = () => {
    if (!isCustom) {
      setDomainInput("");
      setShowUpsellModal(true);
    }
  };

  // ── Derived ───────────────────────────────────────────────
  const inputValid = isCustom ? customDomainRegex.test(domainInput.trim()) : subdomainRegex.test(domainInput.trim());
  const previewDomain = !isCustom && domainInput.trim() ? `${domainInput.trim().toLowerCase()}${WEBJOZ_SUFFIX}` : "";

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
    const isWj  = dom.domain.endsWith(WEBJOZ_SUFFIX);
    const ok   = dom.status === "verified";
    const busy = actionLoading === dom.id;
    return (
      <div className="bg-[#15151a] border border-white/[0.08] rounded-2xl px-5 py-3.5 flex items-center gap-3">
        <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${ok ? "bg-[#3ddc84]/12 text-[#5fe3a0]" : "bg-[#f0b429]/12 text-[#f3c451]"}`}>
          {ok ? <Globe className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-semibold text-[14px] m-0 text-[#f3f3f4] truncate">{dom.domain}</p>
            <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${isWj ? "bg-white/10 text-[#c8c8d4]" : "bg-[#6f6fff]/20 text-[#8fa8ff]"}`}>
              {isWj ? "Subdomain" : "Custom Domain"}
            </span>
          </div>
          <p className="text-[12px] text-[#6b6b75] m-0 mt-0.5 truncate">
            → {site?.name || `Site #${dom.site_id}`}
            {!ok && !isWj && " · menunggu propagasi DNS"}
            {!ok && isWj && " · menunggu aktivasi"}
          </p>
        </div>
        <span className={`text-[11px] px-2.5 py-1 rounded-full font-semibold shrink-0 ${ok ? "bg-[#3ddc84]/12 text-[#5fe3a0]" : "bg-[#f0b429]/12 text-[#f3c451]"}`}>
          {ok ? "Aktif" : "Pending"}
        </span>
        <div className="flex items-center gap-1.5">
          {!ok && !isWj && (
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

  // ── Upselling Modal Footer ───────────────────────────────
  const upsellFooter = (
    <div className="flex w-full gap-3">
      <button
        type="button"
        onClick={() => {
          setIsCustom(true);
          setShowUpsellModal(false);
        }}
        className="flex-1 py-2.5 rounded-xl text-[14px] font-semibold bg-transparent text-[#9a9aa3] border border-white/10 hover:bg-white/[0.04] transition-colors cursor-pointer"
      >
        Lanjutkan Hubungkan
      </button>
      <button
        type="button"
        onClick={() => {
          pushToast("Upgrade Premium sedang dikembangkan! Anda tetap bisa menggunakan custom domain secara gratis untuk saat ini.", "info");
          setIsCustom(true);
          setShowUpsellModal(false);
        }}
        className="flex-1 py-2.5 rounded-xl text-[14px] font-semibold bg-[#6f6fff] text-white hover:bg-[#5a5ae8] transition-all hover:shadow-[0_0_12px_rgba(111,111,255,0.4)] cursor-pointer"
      >
        Upgrade Sekarang
      </button>
    </div>
  );

  return (
    <div className="max-w-3xl text-[#f3f3f4] font-sans space-y-8">
      {/* ═══════════════════════════════════════════════
          SECTION 1 — Connected Domains List
      ══════════════════════════════════════════════ */}
      {domains.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-[14px] font-bold text-[#6b6b75] uppercase tracking-wider">
            Domain & Subdomain Terhubung ({domains.length})
          </h2>
          <div className="flex flex-col gap-2">
            {domains.map(dom => <DomainRow key={dom.id} dom={dom} />)}
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════
          SECTION 2 — Simplified Form Card
      ══════════════════════════════════════════════ */}
      <section className="bg-[#15151a] border border-white/[0.08] rounded-2xl p-6 space-y-6">
        <div>
          <h2 className="text-[16px] font-bold text-[#f3f3f4] flex items-center gap-2 m-0">
            <Globe className="w-4.5 h-4.5 text-[#8fa8ff]" /> Tautkan Alamat Website Baru
          </h2>
          <p className="text-[13px] text-[#6b6b75] m-0 mt-1">
            Pilih website Anda dan gunakan subdomain gratis atau domain kustom Anda sendiri.
          </p>
        </div>

        <form onSubmit={handleAddDomain} className="space-y-5">
          {/* Website Selection */}
          <div>
            <label className="block text-[12px] font-semibold text-[#8fa8ff] mb-1.5">Pilih Website</label>
            <select
              value={siteId}
              onChange={e => {
                const val = e.target.value;
                setSiteId(val);
                const selectedSite = sites.find(s => s.id.toString() === val);
                if (selectedSite && !isCustom) {
                  setDomainInput(selectedSite.subdomain);
                }
              }}
              className="w-full bg-[#0b0b0d] border border-white/15 rounded-xl px-4 py-2.5 text-[14px] text-[#f3f3f4] outline-none focus:border-[#6f6fff] cursor-pointer"
            >
              {sites.map(s => <option key={s.id} value={s.id}>{s.name} ({s.subdomain})</option>)}
              {sites.length === 0 && <option disabled value="">Belum ada website</option>}
            </select>
          </div>

          {/* Selector / Switcher */}
          <div>
            <label className="block text-[12px] font-semibold text-[#8fa8ff] mb-1.5">Pilihan Tipe Alamat</label>
            <div className="grid grid-cols-2 gap-1.5 bg-[#0b0b0d] border border-white/10 rounded-xl p-1">
              <button
                type="button"
                onClick={selectSubdomain}
                className={`py-2 rounded-lg text-[13px] font-semibold transition-all cursor-pointer ${!isCustom ? "bg-white/[0.08] text-white" : "text-[#6b6b75] hover:text-[#9a9aa3]"}`}
              >
                Subdomain Gratis (.webjoz.com)
              </button>
              <button
                type="button"
                onClick={selectCustom}
                className={`py-2 rounded-lg text-[13px] font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${isCustom ? "bg-[#6f6fff] text-white" : "text-[#6b6b75] hover:text-[#9a9aa3]"}`}
              >
                Custom Domain (Premium)
              </button>
            </div>
          </div>

          {/* Conditional Inputs */}
          <div>
            <label className="block text-[12px] font-semibold text-[#8fa8ff] mb-1.5">
              {isCustom ? "Alamat Custom Domain" : "Nama Subdomain"}
            </label>

            {isCustom ? (
              <div className="space-y-4">
                <input
                  type="text"
                  value={domainInput}
                  onChange={e => setDomainInput(e.target.value)}
                  placeholder="cth. tokokamu.com"
                  className="w-full bg-[#0b0b0d] border border-white/15 rounded-xl px-4 py-2.5 text-[14px] text-[#f3f3f4] outline-none focus:border-[#6f6fff] placeholder:text-[#6b6b75]"
                />
                {domainInput.trim() !== "" && (
                  <p className={`text-[11px] mt-1 mx-0.5 font-mono ${inputValid ? "text-[#5fe3a0]" : "text-[#ff8a8a]"}`}>
                    {inputValid ? "✓ Format domain valid" : "Format tidak valid — masukkan domain tanpa http:// atau www."}
                  </p>
                )}

                {/* DNS instructions card */}
                <div className="bg-white/[0.02] border border-white/[0.08] rounded-xl px-4 py-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <Server className="w-4 h-4 text-[#8fa8ff]" />
                    <span className="text-[13px] font-semibold text-[#c8c8d4]">Instruksi CNAME DNS</span>
                  </div>
                  <p className="text-[12px] text-[#6b6b75] m-0 leading-relaxed">
                    Buka penyedia domain Anda (Niagahoster, GoDaddy, dll) → Kelola DNS → tambahkan record CNAME berikut:
                  </p>
                  <div className="grid grid-cols-[60px_85px_1fr_32px] gap-2 text-[10px] uppercase tracking-wider text-[#6b6b75] pb-2 border-b border-white/[0.06]">
                    <span>Tipe</span><span>Host</span><span>Value/Target</span><span />
                  </div>
                  <div className="grid grid-cols-[60px_85px_1fr_32px] gap-2 items-center pt-1 font-mono text-[13px] text-[#c8c8d4]">
                    <span>CNAME</span>
                    <span>www</span>
                    <span className="truncate">{CNAME_TARGET}</span>
                    <button
                      type="button"
                      onClick={handleCopy}
                      className="w-7 h-7 rounded-lg border border-white/10 bg-white/[0.04] text-[#9a9aa3] flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-[#5fe3a0]" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <p className="text-[11px] text-[#6b6b75] m-0 pt-1 flex items-start gap-1.5 leading-relaxed">
                    <Info className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                    <span>Propagasi DNS biasanya memakan waktu 5 menit hingga 24 jam.</span>
                  </p>
                </div>
              </div>
            ) : (
              <div>
                <div className={`flex items-center bg-[#0b0b0d] border rounded-xl overflow-hidden transition-colors ${domainInput && !inputValid ? "border-[#ff8a8a]" : "border-white/15 focus-within:border-[#6f6fff]"}`}>
                  <input
                    type="text"
                    value={domainInput}
                    onChange={e => setDomainInput(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                    placeholder="namaanda"
                    maxLength={30}
                    className="flex-1 bg-transparent px-4 py-2.5 text-[14px] text-[#f3f3f4] outline-none placeholder:text-[#6b6b75] min-w-0"
                  />
                  <span className="px-3 py-2.5 text-[13px] text-[#6b6b75] font-mono shrink-0 border-l border-white/[0.06] bg-white/[0.02] select-none">
                    .webjoz.com
                  </span>
                </div>
                {previewDomain && (
                  <p className={`text-[11px] mt-1.5 mx-0.5 font-mono ${inputValid ? "text-[#5fe3a0]" : "text-[#ff8a8a]"}`}>
                    {inputValid ? `✓ Subdomain tersedia: ${previewDomain}` : "Gunakan huruf kecil, angka, atau tanda hubung (-)"}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!inputValid || submitting}
            className={`w-full py-2.5 rounded-xl text-[14px] font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer ${
              !inputValid || submitting
                ? "bg-[#2a2a2a] text-[#6b6b75] cursor-not-allowed"
                : isCustom
                  ? "bg-[#6f6fff] text-white hover:bg-[#5a5ae8]"
                  : "bg-white text-[#0b0b0d] hover:bg-[#e6e6e6]"
            }`}
          >
            {submitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : isCustom ? (
              "Tautkan Custom Domain"
            ) : (
              "Tautkan Subdomain"
            )}
          </button>
        </form>
      </section>

      {/* Upselling Dialog */}
      <Dialog
        open={showUpsellModal}
        onOpenChange={setShowUpsellModal}
        title="✨ Tingkatkan Kredibilitas Bisnis Anda"
        footer={upsellFooter}
      >
        <div className="space-y-4">
          <p className="text-[14px] leading-relaxed text-[#9a9aa3] m-0">
            Custom Domain adalah fitur <strong>Premium</strong> yang membantu brand Anda terlihat lebih profesional, terpercaya di mata pelanggan, dan lebih mudah ditemukan di Google (SEO).
          </p>
          <div className="bg-[#1b1b21] border border-white/10 rounded-xl p-4 space-y-3">
            <div className="flex items-start gap-3">
              <span className="text-emerald-400 font-bold leading-none mt-0.5">✓</span>
              <p className="text-[13px] text-[#f3f3f4] m-0 leading-relaxed">
                <strong>Branding Profesional:</strong> Gunakan domain milik Anda (cth. <code>tokomu.com</code>) tanpa embel-embel <code>.webjoz.com</code>.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-emerald-400 font-bold leading-none mt-0.5">✓</span>
              <p className="text-[13px] text-[#f3f3f4] m-0 leading-relaxed">
                <strong>SEO Lebih Baik:</strong> Google memprioritaskan domain utama untuk mendapatkan posisi teratas di hasil pencarian.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-emerald-400 font-bold leading-none mt-0.5">✓</span>
              <p className="text-[13px] text-[#f3f3f4] m-0 leading-relaxed">
                <strong>SSL/HTTPS Otomatis:</strong> Keamanan data terjamin dengan enkripsi SSL gratis yang dipasang langsung ke domain Anda.
              </p>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
