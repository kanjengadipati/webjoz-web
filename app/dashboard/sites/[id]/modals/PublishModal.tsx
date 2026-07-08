"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Rocket, Globe, Loader2 } from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui";

export interface PublishModalProps {
  site: {
    name: string;
    subdomain: string;
  };
  onConfirm: (subdomain: string) => void;
  onCancel: () => void;
  loading: boolean;
}

export default function PublishModal({ site, onConfirm, onCancel, loading }: PublishModalProps) {
  const [subdomain, setSubdomain] = useState(() => {
    if (site.subdomain.startsWith("draft-")) return "";
    return site.subdomain;
  });

  const subdomainRegex = /^[a-z0-9][a-z0-9-]{1,28}[a-z0-9]$/;

  const handleSubdomainChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cleaned = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "");
    setSubdomain(cleaned);
  };

  const isInputValid = subdomainRegex.test(subdomain);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isInputValid) return;
    onConfirm(subdomain);
  };

  const previewDomain = subdomain.trim() ? `${subdomain.trim().toLowerCase()}.webjoz.com` : "";

  return (
    <Dialog
      open={!!site}
      onOpenChange={(open) => {
        if (!open && !loading) onCancel();
      }}
      title="Publikasikan Website"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Celebration Header Banner */}
        <div className="bg-gradient-to-tr from-primary/10 to-primary/5 border border-primary/20 rounded-2xl p-4 flex items-center gap-3.5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 blur-2xl rounded-full pointer-events-none" />
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-primary to-primary/80 flex items-center justify-center shrink-0 shadow-[0_4px_12px_color-mix(in_srgb,var(--primary)_30%,transparent)]">
            <Rocket className="w-6 h-6 text-white animate-pulse" />
          </div>
          <div>
            <h4 className="text-[13.5px] font-bold text-white leading-snug">
              Satu Langkah Lagi! 🚀
            </h4>
            <p className="text-[11.5px] text-[#9b9ba5] leading-relaxed mt-0.5">
              Website <span className="text-primary font-semibold">{site.name}</span> Anda siap
              untuk dipublikasikan ke seluruh dunia.
            </p>
          </div>
        </div>

        {/* Subdomain Input Field */}
        <div className="space-y-2">
          <label className="text-[12px] font-bold text-[#c8c8d4] tracking-wide block">
            Nama Subdomain
          </label>
          <div
            className={`flex items-center bg-[#0b0b0d] border rounded-xl overflow-hidden transition-all duration-200 ${
              subdomain && !isInputValid
                ? "border-red-500/50 shadow-[0_0_10px_rgba(239,68,68,0.15)] bg-red-500/[0.01]"
                : subdomain && isInputValid
                  ? "border-[#3ddc84]/50 shadow-[0_0_10px_rgba(61,220,132,0.15)] bg-[#3ddc84]/[0.01]"
                  : "border-white/10 hover:border-white/20 focus-within:border-primary/60 focus-within:shadow-[0_0_12px_color-mix(in_srgb,var(--primary)_20%,transparent)]"
            }`}
          >
            <input
              type="text"
              value={subdomain}
              onChange={handleSubdomainChange}
              disabled={loading}
              placeholder="namaanda"
              maxLength={30}
              className="flex-1 bg-transparent px-4 py-2.5 text-[14px] text-[#f3f3f4] outline-none placeholder:text-[#6b6b75] min-w-0 font-medium"
              autoFocus
            />
            <span className="px-3 py-2.5 text-[13px] text-primary font-mono font-bold shrink-0 border-l border-white/[0.06] bg-white/[0.02] select-none">
              .webjoz.com
            </span>
          </div>

          {previewDomain && (
            <div
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-[12px] font-mono transition-all ${
                isInputValid
                  ? "bg-[#3ddc84]/8 text-[#5fe3a0] border border-[#3ddc84]/20"
                  : "bg-red-500/8 text-[#ff8a8a] border border-red-500/20"
              }`}
            >
              <span className="shrink-0 text-[14px]">{isInputValid ? "✓" : "⚠"}</span>
              <span className="truncate leading-none">
                {isInputValid
                  ? `Tersedia: https://${previewDomain}`
                  : "Gunakan huruf kecil, angka, atau tanda hubung (-)"}
              </span>
            </div>
          )}

          <p className="text-[11px] text-[#6b6b75] leading-relaxed mx-0.5">
            Hanya huruf kecil, angka, dan tanda hubung. Subdomain tidak bisa diubah setelah
            dipublikasikan.
          </p>
        </div>

        {/* Custom Domain premium upselling banner */}
        <div className="bg-[#15151c] border border-white/[0.06] hover:border-white/10 rounded-xl p-4 flex gap-3 transition-colors relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-tr from-primary/10 to-transparent blur-xl pointer-events-none" />
          <div className="w-9 h-9 rounded-lg bg-white/[0.03] border border-white/10 flex items-center justify-center shrink-0 text-primary group-hover:text-white transition-colors">
            <Globe className="w-4.5 h-4.5" />
          </div>
          <div className="space-y-1">
            <h5 className="text-[12px] font-bold text-white flex items-center gap-1.5 leading-none">
              Hubungkan Custom Domain{" "}
              <span className="text-[9px] px-1.5 py-0.5 bg-primary text-primary-foreground rounded font-extrabold uppercase shrink-0 tracking-wider">
                Pro
              </span>
            </h5>
            <p className="text-[11.5px] text-[#9a9aa3] leading-relaxed">
              Ingin brand yang lebih profesional seperti <strong>domainanda.com</strong>? Anda
              dapat mengaturnya di{" "}
              <Link
                href="/dashboard/domains"
                className="text-primary font-semibold hover:text-white underline underline-offset-2 transition-colors"
                onClick={onCancel}
              >
                Custom Domain
              </Link>{" "}
              setelah website Anda live.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-1">
          <Button
            type="button"
            variant="outline"
            className="flex-1 rounded-xl h-11 text-sm border-white/10 hover:bg-white/[0.04]"
            onClick={onCancel}
            disabled={loading}
          >
            Batal
          </Button>
          <Button
            type="submit"
            className={`flex-1 rounded-xl h-11 text-[13.5px] font-bold border-0 transition-all flex items-center justify-center gap-2 cursor-pointer ${
              !isInputValid || loading
                ? "bg-[#2a2a2a] text-[#6b6b75] cursor-not-allowed"
                : "bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground shadow-[0_4px_14px_color-mix(in_srgb,var(--primary)_25%,transparent)] hover:shadow-[0_4px_18px_color-mix(in_srgb,var(--primary)_35%,transparent)] transform hover:scale-[1.02] active:scale-[0.98]"
            }`}
            disabled={loading || !isInputValid}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Meluncurkan...
              </>
            ) : (
              <>
                <Rocket className="w-4 h-4 animate-bounce" style={{ animationDuration: "2.5s" }} />
                Luncurkan Website
              </>
            )}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
