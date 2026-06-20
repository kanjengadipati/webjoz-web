"use client";

import React, { useState, useEffect } from "react";
import { useAuthToken } from "@/lib/auth-store";
import { useActiveTenant } from "@/lib/tenant-store";
import { request } from "@/lib/api/client";
import { 
  Link2, Loader2, Trash2, Globe, Clock, RefreshCw,
  ChevronRight, Server, Copy, Info, Check
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

export default function DomainsPage() {
  const token = useAuthToken();
  const { pushToast } = useToast();
  const { activeTenantId } = useActiveTenant();

  const [domains, setDomains] = useState<Domain[]>([]);
  const [sites, setSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  // Add domain states
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
      await request<Domain>("/domains", {
        method: "POST",
        headers: { "X-Tenant-ID": activeTenantId.toString() },
        body: JSON.stringify({
          site_id: Number(targetSiteId),
          domain: cleanDomain,
        }),
      }, token);

      pushToast("Domain berhasil ditambahkan! Silakan atur CNAME di DNS registrar Anda.", "success");
      setDomainName("");
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
      await request<any>("/domains/verify", {
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

  // Domain validation
  const domainRegex = /^([a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,}$/i;
  const isDomainValid = domainName.trim() === "" || domainRegex.test(domainName.trim());
  const canSubmit = domainName.trim() !== "" && isDomainValid;

  if (loading && domains.length === 0 && sites.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-80 gap-3">
        <Loader2 className="w-6 h-6 text-[#9a9aa3] animate-spin" />
        <p className="text-[13px] text-[#6b6b75]">Memuat data domain...</p>
      </div>
    );
  }

  return (
    <div className="max-w-[1100px] text-[#f3f3f4] font-sans">
      <div className="bg-[#15151a] border border-white/10 rounded-[18px] px-[30px] py-[26px] mb-6">
        <h2 className="text-[28px] font-bold m-0 leading-tight">Custom Domains</h2>
      </div>

      <div className="flex items-center gap-1.5 text-[13px] text-[#6b6b75] mb-4">
        <span>Website builder</span>
        <ChevronRight className="w-3.5 h-3.5" />
        <span>Custom domains</span>
      </div>

      {domains.length > 0 && (
        <>
          <p className="text-[17px] font-bold m-0 pb-1">
            Domain yang terhubung <span className="text-[#6b6b75] font-normal">({domains.length})</span>
          </p>
          <p className="text-[14px] text-[#9a9aa3] m-0 mb-6">
            Tautkan alamat domain milik Anda sendiri ke website publik.
          </p>

          <div className="flex flex-col gap-2.5 mb-8">
            {domains.map((dom) => {
              const mappedSite = sites.find((s) => s.id === dom.site_id);
              const isVerified = dom.status === "verified";
              
              return (
                <div key={dom.id} className="bg-[#15151a] border border-white/10 rounded-[18px] px-5 py-4 flex items-center gap-3.5">
                  <div className={`w-[38px] h-[38px] rounded-full flex items-center justify-center shrink-0 ${isVerified ? "bg-[#3ddc84]/15 text-[#5fe3a0]" : "bg-[#f0b429]/15 text-[#f3c451]"}`}>
                    {isVerified ? <Globe className="w-[18px] h-[18px]" /> : <Clock className="w-[18px] h-[18px]" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-[15px] m-0 text-[#f3f3f4]">{dom.domain}</p>
                    <p className="text-[13px] text-[#9a9aa3] mt-0.5 m-0">
                      Terhubung ke {mappedSite?.name || `Website ID #${dom.site_id}`} 
                      {!isVerified && " · menunggu propagasi DNS"}
                    </p>
                  </div>
                  <span className={`text-[12px] px-[12px] py-[5px] rounded-full font-semibold shrink-0 ${isVerified ? "bg-[#3ddc84]/15 text-[#5fe3a0]" : "bg-[#f0b429]/15 text-[#f3c451]"}`}>
                    {isVerified ? "Terverifikasi" : "Pending"}
                  </span>
                  
                  <div className="flex items-center gap-2">
                    {!isVerified && (
                      <button 
                        onClick={() => handleVerifyDomain(dom.id)}
                        disabled={actionLoading === dom.id}
                        className="w-[34px] h-[34px] rounded-xl border border-white/15 bg-[#1b1b21] text-[#9a9aa3] flex items-center justify-center cursor-pointer shrink-0 hover:text-[#f3f3f4] hover:border-[#9a9aa3] transition-colors disabled:opacity-50" 
                        title="Cek status DNS"
                      >
                        {actionLoading === dom.id ? <Loader2 className="w-[18px] h-[18px] animate-spin" /> : <RefreshCw className="w-[18px] h-[18px]" />}
                      </button>
                    )}
                    <button 
                      onClick={() => handleDeleteDomain(dom.id)}
                      disabled={actionLoading === dom.id}
                      className="w-[34px] h-[34px] rounded-xl border border-white/15 bg-[#1b1b21] text-[#9a9aa3] flex items-center justify-center cursor-pointer shrink-0 hover:text-red-400 hover:border-red-400 transition-colors disabled:opacity-50" 
                      title="Hapus domain"
                    >
                      {actionLoading === dom.id && dom.status === "verified" ? <Loader2 className="w-[18px] h-[18px] animate-spin" /> : <Trash2 className="w-[18px] h-[18px]" />}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      <form onSubmit={handleAddDomain} className="bg-[#15151a] border border-white/10 rounded-[18px] px-[30px] py-[28px]">
        <div className="flex items-center gap-2.5 mb-1">
          <Link2 className="w-[18px] h-[18px] text-[#9a9aa3]" />
          <h3 className="m-0 text-[18px] font-bold text-[#f3f3f4]">Tautkan domain baru</h3>
        </div>
        <p className="text-[14px] text-[#9a9aa3] m-0 mb-[22px]">
          Masukkan alamat domain Anda dan pilih website yang ingin ditautkan.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-[18px] mb-[18px]">
          <div>
            <label className="block text-[13px] font-semibold text-[#8fa8ff] mb-2">Pilih website</label>
            <select 
              value={targetSiteId} 
              onChange={(e) => setTargetSiteId(e.target.value)}
              className="w-full bg-[#0b0b0d] border border-white/15 rounded-full px-[18px] py-[13px] text-[15px] text-[#f3f3f4] outline-none focus:border-[#6f6fff] appearance-none cursor-pointer"
            >
              {sites.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.subdomain})
                </option>
              ))}
              {sites.length === 0 && <option value="" disabled>Belum ada website</option>}
            </select>
          </div>
          <div>
            <label className="block text-[13px] font-semibold text-[#8fa8ff] mb-2">Alamat domain custom</label>
            <input 
              type="text" 
              value={domainName}
              onChange={(e) => setDomainName(e.target.value)}
              placeholder="cth. kopijogja.com" 
              className="w-full bg-[#0b0b0d] border border-white/15 rounded-full px-[18px] py-[13px] text-[15px] text-[#f3f3f4] outline-none focus:border-[#6f6fff] placeholder:text-[#6b6b75]"
            />
            {domainName.trim() === "" ? (
              <p className="text-[12px] mt-1.5 mx-1 text-[#6b6b75]">
                Masukkan domain tanpa "https://" atau "www."
              </p>
            ) : isDomainValid ? (
              <p className="text-[12px] mt-1.5 mx-1 text-[#5fe3a0]">
                Format domain valid
              </p>
            ) : (
              <p className="text-[12px] mt-1.5 mx-1 text-[#ff8a8a]">
                Format domain tidak valid
              </p>
            )}
          </div>
        </div>

        <div className="bg-[#fafafa] text-[#1a1a1a] rounded-xl px-5 py-[18px]">
          <div className="flex items-center gap-2 mb-1">
            <Server className="w-[17px] h-[17px] text-[#2a3aa0]" />
            <strong className="text-[14px]">Instruksi pengaturan CNAME registrar DNS</strong>
          </div>
          <p className="text-[13px] text-[#5a5a5a] m-0 mb-3.5">
            Buka dashboard registrar domain Anda (cth. Niagahoster, GoDaddy), cari menu kelola DNS, lalu tambahkan record berikut:
          </p>
          <div className="grid grid-cols-[80px_110px_1fr_36px] gap-2 text-[11px] tracking-wider uppercase text-[#9a9a9a] px-1 pb-2 border-b border-[#e6e6e6]">
            <span>Tipe</span>
            <span>Host/name</span>
            <span>Target/value</span>
            <span></span>
          </div>
          <div className="grid grid-cols-[80px_110px_1fr_36px] gap-2 items-center py-2.5 px-1 font-mono text-[13.5px]">
            <span>CNAME</span>
            <span>www</span>
            <span>sites.webjoz.com</span>
            <button 
              type="button"
              onClick={handleCopyCNAME}
              className="w-7 h-7 rounded-lg border border-[#e0e0e0] bg-white text-[#555] flex items-center justify-center cursor-pointer hover:bg-[#f0f0f0] transition-colors" 
              title="Salin nilai"
            >
              {copied ? <Check className="w-[15px] h-[15px] text-[#1f9d55]" /> : <Copy className="w-[15px] h-[15px]" />}
            </button>
          </div>
          <p className="text-[12px] text-[#1f9d55] h-4 px-1 m-0 pt-0.5">
            {copied && "Disalin ke clipboard"}
          </p>
        </div>

        <p className="flex items-start gap-2 text-[13px] text-[#9a9aa3] mt-[18px] mb-0">
          <Info className="w-[15px] h-[15px] mt-[1px] text-[#6b6b75] shrink-0" />
          <span>Propagasi DNS biasanya 5 menit–24 jam. Status domain akan otomatis berubah menjadi "Terverifikasi" setelah terdeteksi.</span>
        </p>

        <div className="flex gap-3 mt-[22px]">
          <button 
            type="button" 
            onClick={() => setDomainName("")}
            className="flex-1 p-[14px] rounded-full text-[15px] font-semibold cursor-pointer text-center transition-colors bg-[#1b1b21] text-[#f3f3f4] border border-white/15 hover:bg-[#26262e]"
          >
            Batal
          </button>
          <button 
            type="submit" 
            disabled={!canSubmit || loading}
            className="flex-1 p-[14px] rounded-full text-[15px] font-semibold cursor-pointer text-center transition-colors bg-white text-[#0b0b0d] border border-transparent hover:bg-[#e6e6e6] disabled:bg-[#3a3a3f] disabled:text-[#7a7a82] disabled:cursor-not-allowed flex justify-center items-center gap-2"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Tautkan"}
          </button>
        </div>
      </form>
    </div>
  );
}
