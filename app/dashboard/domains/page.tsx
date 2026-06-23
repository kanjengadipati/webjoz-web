"use client";

import React, { useState, useEffect } from "react";
import { useAuthToken } from "@/lib/auth-store";
import { useActiveTenant } from "@/lib/tenant-store";
import { request } from "@/lib/api/client";
import {
  Loader2, Trash2, Globe, Clock, RefreshCw,
  Server, Copy, Info, Check, Link2, ExternalLink,
  AlertCircle,
} from "lucide-react";
import { useToast } from "@/components/toast-provider";
import { Dialog } from "@/components/ui/dialog";
import Link from "next/link";

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
  status: "draft" | "published";
  template_id?: string;
}

const CNAME_TARGET = "sites.webjoz.com";
const customDomainRegex = /^([a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,}$/i;

export default function DomainsPage() {
  const token         = useAuthToken();
  const { pushToast } = useToast();
  const { activeTenantId } = useActiveTenant();

  const [domains,       setDomains]       = useState<Domain[]>([]);
  const [sites,         setSites]         = useState<Site[]>([]);
  const [loading,       setLoading]       = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  // Form states
  const [siteId,      setSiteId]      = useState("");
  const [domainInput, setDomainInput] = useState("");
  const [submitting,  setSubmitting]  = useState(false);
  const [copied,      setCopied]      = useState(false);
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

      const params  = new URLSearchParams(window.location.search);
      const qSiteId = params.get("site_id");
      if (qSiteId && list.some(s => s.id.toString() === qSiteId)) {
        setSiteId(qSiteId);
      } else if (list.length > 0) {
        setSiteId(list[0].id.toString());
      }
    } catch (err: any) {
      pushToast(err.message || "Gagal memuat data domain", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (activeTenantId) fetchData(); }, [activeTenantId]);

  // ── Submit helpers ────────────────────────────────────────
  const proceedAddDomain = async (finalDomain: string) => {
    if (!token || !activeTenantId || !siteId) return;
    try {
      setSubmitting(true);
      await request<Domain>("/domains", {
        method: "POST",
        headers: { "X-Tenant-ID": activeTenantId.toString() },
        body: JSON.stringify({ site_id: Number(siteId), domain: finalDomain }),
      }, token);

      pushToast("Custom domain berhasil ditautkan! Silakan atur CNAME di DNS registrar Anda.", "success");
      setDomainInput("");
      fetchData();
    } catch (err: any) {
      pushToast(err.message || "Gagal menambahkan domain", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddDomain = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !activeTenantId || !domainInput || !siteId) return;
    const trimmed = domainInput.toLowerCase().trim();
    if (!customDomainRegex.test(trimmed)) {
      pushToast("Format domain tidak valid. Contoh: domainanda.com", "error");
      return;
    }
    // Show upselling modal before linking
    setShowUpsellModal(true);
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
  const inputValid = customDomainRegex.test(domainInput.trim());

  // Published sites (have a real subdomain)
  const publishedSites = sites.filter(s => s.status === "published" && s.subdomain && !s.subdomain.startsWith("draft-"));

  // ── Upselling Modal Footer ───────────────────────────────
  const upsellFooter = (
    <div className="flex w-full gap-3">
      <button
        type="button"
        onClick={() => {
          setShowUpsellModal(false);
          proceedAddDomain(domainInput.toLowerCase().trim());
        }}
        className="flex-1 py-2.5 rounded-xl text-[14px] font-semibold bg-transparent text-[#9a9aa3] border border-white/10 hover:bg-white/[0.04] transition-colors cursor-pointer"
      >
        Lanjutkan Hubungkan
      </button>
      <button
        type="button"
        onClick={() => {
          pushToast("Upgrade Premium sedang dikembangkan! Anda tetap bisa menggunakan custom domain secara gratis untuk saat ini.", "info");
          setShowUpsellModal(false);
          proceedAddDomain(domainInput.toLowerCase().trim());
        }}
        className="flex-1 py-2.5 rounded-xl text-[14px] font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-all hover:shadow-[0_0_12px_color-mix(in_srgb,var(--primary)_40%,transparent)] cursor-pointer"
      >
        Upgrade Sekarang
      </button>
    </div>
  );

  // ────────────────────────────────────────────────────────
  if (loading && domains.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-80 gap-3">
        <Loader2 className="w-5 h-5 text-[#9a9aa3] animate-spin" />
        <p className="text-[13px] text-[#6b6b75]">Memuat data domain...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl text-[#f3f3f4] font-sans space-y-8">

      {/* ═══════════════════════════════════════════════
          SECTION 1 — Connected Custom Domains List
      ══════════════════════════════════════════════ */}
      {domains.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-[14px] font-bold text-[#6b6b75] uppercase tracking-wider">
            Custom Domain Terhubung ({domains.length})
          </h2>
          <div className="flex flex-col gap-2">
            {domains.map(dom => {
              const site = sites.find(s => s.id === dom.site_id);
              const ok   = dom.status === "verified";
              const busy = actionLoading === dom.id;
              return (
                <div key={dom.id} className="bg-[#15151a] border border-white/[0.08] rounded-2xl px-5 py-3.5 flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${ok ? "bg-[#3ddc84]/12 text-[#5fe3a0]" : "bg-[#f0b429]/12 text-[#f3c451]"}`}>
                    {ok ? <Globe className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-[14px] m-0 text-[#f3f3f4] truncate">{dom.domain}</p>
                      <span className="text-[9px] px-1.5 py-0.5 rounded font-bold bg-primary/20 text-primary">
                        Custom Domain
                      </span>
                    </div>
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
            })}
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════
          SECTION 2 — Custom Domain Form
      ══════════════════════════════════════════════ */}
      <section className="bg-[#15151a] border border-white/[0.08] rounded-2xl p-6 space-y-6">
        <div>
          <h2 className="text-[16px] font-bold text-[#f3f3f4] flex items-center gap-2 m-0">
            <Link2 className="w-4 h-4 text-primary" /> Hubungkan Custom Domain
          </h2>
          <p className="text-[13px] text-[#6b6b75] m-0 mt-1">
            Gunakan domain milik Anda sendiri untuk tampil lebih profesional.
          </p>
        </div>

        {/* Warning if no published sites */}
        {publishedSites.length === 0 ? (
          <div className="flex items-start gap-3 bg-amber-500/5 border border-amber-500/20 rounded-xl px-4 py-3.5">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-[13px] text-amber-300 font-medium m-0">
                Belum ada website yang dipublikasikan
              </p>
              <p className="text-[12px] text-[#9a9aa3] m-0 leading-relaxed">
                Custom domain hanya bisa dihubungkan ke website yang sudah live. Publikasikan website Anda terlebih dahulu melalui halaman{" "}
                <Link href="/dashboard/sites" className="text-primary underline underline-offset-2 hover:text-white transition-colors">
                  My Websites
                </Link>
                .
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleAddDomain} className="space-y-5">
            {/* Website Selection */}
            <div>
              <label className="block text-[12px] font-semibold text-primary mb-1.5">
                Tautkan ke Website
              </label>
              <select
                value={siteId}
                onChange={e => setSiteId(e.target.value)}
                className="w-full bg-[#0b0b0d] border border-white/15 rounded-xl px-4 py-2.5 text-[14px] text-[#f3f3f4] outline-none focus:border-primary cursor-pointer"
              >
                {publishedSites.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.subdomain}.webjoz.com)
                  </option>
                ))}
              </select>
            </div>

            {/* Custom Domain Input */}
            <div>
              <label className="block text-[12px] font-semibold text-primary mb-1.5">
                Alamat Custom Domain
              </label>
              <input
                type="text"
                value={domainInput}
                onChange={e => setDomainInput(e.target.value)}
                placeholder="cth. tokokamu.com atau toko.domainanda.com"
                className="w-full bg-[#0b0b0d] border border-white/15 rounded-xl px-4 py-2.5 text-[14px] text-[#f3f3f4] outline-none focus:border-primary placeholder:text-[#6b6b75]"
              />
              {domainInput.trim() !== "" && (
                <p className={`text-[11px] mt-1.5 mx-0.5 font-mono ${inputValid ? "text-[#5fe3a0]" : "text-[#ff8a8a]"}`}>
                  {inputValid ? "✓ Format domain valid" : "Format tidak valid — masukkan domain tanpa http:// atau www."}
                </p>
              )}
            </div>

            {/* DNS instructions card */}
            <div className="bg-white/[0.02] border border-white/[0.08] rounded-xl px-5 py-5 space-y-4">
              <div className="flex items-center gap-2">
                <Server className="w-4 h-4 text-primary" />
                <span className="text-[13px] font-semibold text-[#c8c8d4]">Petunjuk Konfigurasi DNS di Provider Domain</span>
              </div>

              <div className="space-y-3.5 text-[12px] text-[#9a9aa3] leading-relaxed">
                <div className="flex items-start gap-2.5">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-white/5 border border-white/10 text-[10px] text-white shrink-0 font-mono font-bold">1</span>
                  <p className="m-0">
                    Masuk ke akun <strong>Registrar Domain</strong> tempat Anda membeli domain (seperti Niagahoster, Rumahweb, Cloudflare, Namecheap, GoDaddy, dll).
                  </p>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-white/5 border border-white/10 text-[10px] text-white shrink-0 font-mono font-bold">2</span>
                  <p className="m-0">
                    Cari domain yang ingin diatur dan buka halaman <strong>DNS Management</strong>, <strong>DNS Zone Editor</strong>, atau <strong>Manage DNS</strong>.
                  </p>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-white/5 border border-white/10 text-[10px] text-white shrink-0 font-mono font-bold">3</span>
                  <div className="space-y-2 flex-1">
                    <p className="m-0">
                      Tambahkan <strong>DNS Record baru</strong> dengan tipe <strong>CNAME</strong> dan isi kolom sesuai data di bawah:
                    </p>
                    <div className="bg-[#0b0b0d] border border-white/5 rounded-xl p-3.5 space-y-2">
                      <div className="grid grid-cols-3 gap-2 text-[10px] uppercase tracking-wider text-[#6b6b75] font-semibold pb-1 border-b border-white/[0.04]">
                        <span>Tipe / Type</span>
                        <span>Host / Nama</span>
                        <span>Target / Value</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 items-center font-mono text-[12px] text-[#c8c8d4]">
                        <span className="text-primary font-semibold">CNAME</span>
                        <span>www</span>
                        <div className="flex items-center gap-1.5 min-w-0">
                          <span className="truncate" title={CNAME_TARGET}>{CNAME_TARGET}</span>
                          <button
                            type="button"
                            onClick={handleCopy}
                            className="w-6 h-6 rounded-md border border-white/10 bg-white/[0.04] text-[#9a9aa3] flex items-center justify-center hover:bg-white/10 hover:text-white transition-colors cursor-pointer shrink-0"
                          >
                            {copied ? <Check className="w-3 h-3 text-[#5fe3a0]" /> : <Copy className="w-3 h-3" />}
                          </button>
                        </div>
                      </div>
                    </div>
                    <p className="text-[11px] text-[#6b6b75] m-0 italic">
                      Catatan: Jika ingin menggunakan subdomain kustom seperti <code>toko.domainanda.com</code>, ubah kolom <strong>Host / Nama</strong> menjadi <code>toko</code>.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-white/5 border border-white/10 text-[10px] text-white shrink-0 font-mono font-bold">4</span>
                  <p className="m-0">
                    Simpan perubahan DNS Anda. Proses propagasi dan verifikasi domain biasanya memerlukan waktu mulai dari <strong>5 menit hingga maksimal 24 jam</strong>.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2 bg-primary/5 border border-primary/20 rounded-xl px-3.5 py-3 text-[11px] text-primary leading-relaxed">
                <Info className="w-4 h-4 shrink-0 mt-0.5" />
                <span>Setelah menyimpan konfigurasi DNS di atas, kembali ke dashboard dan klik tombol <strong>"Cek DNS" (ikon Refresh)</strong> pada daftar domain Anda untuk memverifikasi.</span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!inputValid || submitting || !siteId}
              className={`w-full py-2.5 rounded-xl text-[14px] font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer ${
                !inputValid || submitting || !siteId
                  ? "bg-[#2a2a2a] text-[#6b6b75] cursor-not-allowed"
                  : "bg-primary text-primary-foreground hover:bg-primary/90"
              }`}
            >
              {submitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Link2 className="w-4 h-4" />
                  Tautkan Custom Domain
                </>
              )}
            </button>
          </form>
        )}
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
