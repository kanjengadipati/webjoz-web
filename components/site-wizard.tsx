"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { request } from "@/lib/api/client";
import {
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  Globe,
  Laptop,
  Pencil,
  Sparkles,
  Wand2,
} from "lucide-react";
import { Button } from "@/components/ui";
import { useToast } from "@/components/toast-provider";

// ─── Types ──────────────────────────────────────────────────────────────────

export interface SiteWizardProps {
  mode: "public" | "dashboard";
  token: string | null;
  authReady?: boolean;
  tenantLoading?: boolean;
  activeTenantId: number | string | null;
  memberships?: { tenant: { id: number | string } }[];
  createTenant?: (name: string, slug: string) => Promise<{ id: number | string } | null>;
  onNeedAuth?: () => void;
}

type Message = {
  id: string;
  sender: "ai" | "user";
  text: string;
};

// content + design_token returned from public generate-preview endpoint
type PreviewData = {
  content: Record<string, any>;
  design_token: Record<string, any>;
};

// ─── Constants ──────────────────────────────────────────────────────────────

const PENDING_KEY = "webjoz_pending_wizard_data";

const AI_LOADING_STEPS = [
  "Menganalisis profil bisnis Anda...",
  "Merumuskan headline copywriting yang memikat...",
  "Menyusun cerita brand yang berkesan...",
  "Menyusun deskripsi layanan secara terstruktur...",
  "Merumuskan Pertanyaan Umum (FAQ) pelanggan...",
  "Mengatur optimasi tag metadata SEO...",
  "Memilih palet warna & tipografi yang sempurna...",
  "Merakit layout visual yang menawan...",
];

const BUSINESS_TYPES = [
  { value: "Kuliner", emoji: "🍽️" },
  { value: "Toko/UMKM", emoji: "🛍️" },
  { value: "Online Shop", emoji: "📦" },
  { value: "Jasa", emoji: "🔧" },
  { value: "Industri", emoji: "🏭" },
  { value: "Organisasi", emoji: "🏛️" },
  { value: "Lainnya", emoji: "✨" },
];

const MOODS = [
  { value: "Profesional", emoji: "🎯", desc: "Serius & terpercaya" },
  { value: "Modern & Minimalis", emoji: "⚡", desc: "Clean & elegan" },
  { value: "Fun & Colorful", emoji: "🎨", desc: "Ceria & energik" },
  { value: "Elegan & Mewah", emoji: "👑", desc: "Premium & eksklusif" },
  { value: "Natural & Hangat", emoji: "🌿", desc: "Earthy & ramah" },
  { value: "Bold & Tegas", emoji: "🔥", desc: "Kuat & impactful" },
];

// ─── Component ──────────────────────────────────────────────────────────────

export function SiteWizard({
  mode,
  token,
  activeTenantId,
  createTenant,
  onNeedAuth,
}: SiteWizardProps) {
  const router = useRouter();
  const { pushToast } = useToast();

  // Chat state
  const [chatStage, setChatStage] = useState<"name" | "type" | "desc" | "wa" | "mood" | "done">("name");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "init",
      sender: "ai",
      text: "Hai! Saya akan bantu kamu buat website bisnis dalam beberapa menit. 🚀\n\nPertama, apa nama bisnis atau brand kamu?",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Form data
  const [businessName, setBusinessName] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [description, setDescription] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [mood, setMood] = useState("");

  // Right panel state: wireframe → loading → result
  const [previewState, setPreviewState] = useState<"wireframe" | "loading" | "result">("wireframe");
  const [aiStepIdx, setAiStepIdx] = useState(0);
  const [previewData, setPreviewData] = useState<PreviewData | null>(null);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, chatStage]);

  // Cycle AI loading steps
  useEffect(() => {
    if (previewState === "loading") {
      setAiStepIdx(0);
      const interval = setInterval(() => {
        setAiStepIdx((prev) => (prev < AI_LOADING_STEPS.length - 1 ? prev + 1 : prev));
      }, 2800);
      return () => clearInterval(interval);
    }
  }, [previewState]);

  // ── Chat handlers ────────────────────────────────────────────────────────

  const handleSendText = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    const val = inputValue.trim();
    setInputValue("");

    if (chatStage === "name") {
      setBusinessName(val);
      setMessages((prev) => [
        ...prev,
        { id: Date.now().toString(), sender: "user", text: val },
        {
          id: (Date.now() + 1).toString(),
          sender: "ai",
          text: `Wah, **${val}** — nama yang keren! 🎉\n\nBisnis ini bergerak di bidang apa?`,
        },
      ]);
      setChatStage("type");
    } else if (chatStage === "desc") {
      setDescription(val);
      setMessages((prev) => [
        ...prev,
        { id: Date.now().toString(), sender: "user", text: val },
        {
          id: (Date.now() + 1).toString(),
          sender: "ai",
          text: "Mantap! 📱 Sekarang, berikan nomor WhatsApp bisnis kamu.\n\nNomor ini akan kami pasang sebagai tombol kontak di website.",
        },
      ]);
      setChatStage("wa");
    } else if (chatStage === "wa") {
      setWhatsapp(val);
      setMessages((prev) => [
        ...prev,
        { id: Date.now().toString(), sender: "user", text: val },
        {
          id: (Date.now() + 1).toString(),
          sender: "ai",
          text: "Terakhir, pilih **vibe** website yang cocok untuk bisnis kamu! 🎨",
        },
      ]);
      setChatStage("mood");
    }
  };

  const handleSelectType = (type: string) => {
    setBusinessType(type);
    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), sender: "user", text: type },
      {
        id: (Date.now() + 1).toString(),
        sender: "ai",
        text: `Bisnis **${type}**, mantap! 💪\n\nSekarang ceritakan sedikit produk/layanan utamanya. Apa yang membuat bisnis kamu berbeda dari yang lain?`,
      },
    ]);
    setChatStage("desc");
  };

  // ── Generate (public, no login needed) ──────────────────────────────────

  const handleGenerate = async () => {
    setPreviewState("loading");

    try {
      const res = await request<any>("/ai/public/generate-preview", {
        method: "POST",
        body: JSON.stringify({
          business_name: businessName,
          business_type: businessType,
          description: description,
          whatsapp: whatsapp,
          mood: mood,
        }),
      });

      if (res.status !== "success") throw new Error(res.message);

      setPreviewData({
        content: res.data.content,
        design_token: res.data.design_token,
      });

      // Save the generated preview to localStorage so we can use it after login
      localStorage.setItem(
        PENDING_KEY,
        JSON.stringify({
          businessName,
          businessType,
          description,
          whatsapp,
          mood,
          previewContent: res.data.content,
          previewDesignToken: res.data.design_token,
        })
      );

      setPreviewState("result");
    } catch (err: any) {
      console.error(err);
      pushToast(err.message || "Terjadi kesalahan saat membuat preview.", "error");
      setPreviewState("wireframe");
    }
  };

  // ── Go to editor (requires login, then saves site using existing preview) ──

  const handleGoToEditor = async () => {
    if (!token) {
      // Save current data (including AI preview result) to localStorage, redirect to login
      localStorage.setItem(
        PENDING_KEY,
        JSON.stringify({
          businessName,
          businessType,
          description,
          previewContent: previewData?.content,
          previewDesignToken: previewData?.design_token,
        })
      );
      if (onNeedAuth) {
        onNeedAuth();
      } else {
        router.push("/login?redirect=/create?action=save");
      }
      return;
    }

    // User is logged in → save the site from existing preview data (no re-generate)
    try {
      let tenantId = activeTenantId;
      if (!tenantId && mode === "public" && createTenant) {
        const slug =
          businessName.toLowerCase().replace(/[^a-z0-9-]/g, "") +
          "-" +
          Math.floor(Math.random() * 1000);
        const created = await createTenant(businessName + " Workspace", slug);
        if (created?.id) tenantId = created.id;
        else throw new Error("Gagal membuat workspace.");
      }
      if (!tenantId) throw new Error("Workspace tidak ditemukan.");

      const subdomain =
        businessName.toLowerCase().replace(/[^a-z0-9-]/g, "") +
        "-" +
        Math.floor(Math.random() * 9000 + 1000);

      // 1. Create site entry
      const createRes = await request<any>(
        "/sites",
        {
          method: "POST",
          headers: { "X-Tenant-ID": tenantId.toString() },
          body: JSON.stringify({
            name: businessName,
            template_id: "TEMPLATE_DYNAMIC",
            subdomain,
          }),
        },
        token
      );
      if (createRes.status !== "success") throw new Error(createRes.message);
      const siteId = createRes.data.id;

      // 2. Save the existing AI-generated preview content (no second AI call!)
      if (previewData) {
        await request(
          `/sites/${siteId}/content`,
          {
            method: "PUT",
            headers: { "X-Tenant-ID": tenantId.toString() },
            body: JSON.stringify({
              content: previewData.content,
              design_token: previewData.design_token,
            }),
          },
          token
        );
      }

      localStorage.removeItem(PENDING_KEY);
      router.push(`/dashboard/sites/${siteId}`);
    } catch (err: any) {
      console.error(err);
      pushToast(err.message || "Terjadi kesalahan. Silakan coba lagi.", "error");
    }
  };

  // ── Text formatter (bold **text**) ───────────────────────────────────────

  const formatText = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={i} className="text-white font-semibold">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return <React.Fragment key={i}>{part}</React.Fragment>;
    });
  };

  // ── Derived values for result panel ─────────────────────────────────────

  const heroCopy = previewData?.content?.hero as Record<string, any> | undefined;
  const headerCopy = previewData?.content?.header as Record<string, any> | undefined;
  const palette = previewData?.design_token?.palette as Record<string, string> | undefined;
  const typography = previewData?.design_token?.typography as Record<string, string> | undefined;

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="w-full max-w-6xl mx-auto px-4">
      <div
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        style={{ height: "calc(100vh - 140px)", minHeight: "600px" }}
      >
        {/* ── Left: Chat ─────────────────────────────────────────────────── */}
        <div className="bg-white/5 border border-white/10 rounded-3xl flex flex-col overflow-hidden shadow-xl backdrop-blur-md">
          {/* Header */}
          <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between shrink-0 bg-white/[0.02]">
            <h2 className="text-sm font-bold flex items-center gap-2 text-white">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              Webjoz AI Assistant
            </h2>
            <span className="text-[10px] text-emerald-400 px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
              ● Gratis · Tanpa Daftar
            </span>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-3 ${m.sender === "user" ? "flex-row-reverse" : ""}`}
              >
                {m.sender === "ai" && (
                  <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center shrink-0 shadow-lg">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                    m.sender === "user"
                      ? "bg-indigo-600 text-white rounded-tr-sm"
                      : "bg-white/[0.08] text-slate-300 border border-white/5 rounded-tl-sm"
                  }`}
                >
                  {formatText(m.text)}
                </div>
              </div>
            ))}

            {/* Category chips */}
            {chatStage === "type" && (
              <div className="pl-11 pr-2 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="flex flex-wrap gap-2">
                  {BUSINESS_TYPES.map((t) => (
                    <button
                      key={t.value}
                      onClick={() => handleSelectType(t.value)}
                      className="flex items-center gap-1.5 px-4 py-2 bg-white/[0.05] hover:bg-indigo-600/20 hover:border-indigo-500/40 border border-white/10 rounded-xl text-sm text-slate-200 transition-all"
                    >
                      <span>{t.emoji}</span>
                      {t.value}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Mood chips */}
            {chatStage === "mood" && (
              <div className="pl-11 pr-2 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="flex flex-wrap gap-2">
                  {MOODS.map((m) => (
                    <button
                      key={m.value}
                      onClick={() => {
                        setMood(m.value);
                        setMessages((prev) => [
                          ...prev,
                          { id: Date.now().toString(), sender: "user", text: `${m.emoji} ${m.value}` },
                          {
                            id: (Date.now() + 1).toString(),
                            sender: "ai",
                            text: "Sempurna! Semua data sudah siap. 🚀\n\nSekarang saya akan membuat website kamu — tekan tombol di bawah!",
                          },
                        ]);
                        setChatStage("done");
                      }}
                      className="flex flex-col gap-0.5 px-3.5 py-2.5 bg-white/[0.05] hover:bg-indigo-600/20 hover:border-indigo-500/40 border border-white/10 rounded-xl text-sm text-slate-200 transition-all text-left"
                    >
                      <span className="text-base">{m.emoji} <span className="font-semibold">{m.value}</span></span>
                      <span className="text-[10px] text-slate-400">{m.desc}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Generate button */}
            {chatStage === "done" && previewState === "wireframe" && (
              <div className="pl-11 pr-2 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <button
                  onClick={handleGenerate}
                  className="flex items-center gap-2 px-6 py-3.5 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-sm font-bold shadow-lg shadow-indigo-600/30 transition-all"
                >
                  <Wand2 className="w-4 h-4" />
                  Generate Website Sekarang ✨
                </button>
              </div>
            )}

            {/* Loading hint in chat */}
            {previewState === "loading" && (
              <div className="pl-11 pr-2 animate-in fade-in duration-500">
                <div className="flex items-center gap-2 text-slate-400 text-sm">
                  <span className="inline-flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <span
                        key={i}
                        className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce"
                        style={{ animationDelay: `${i * 0.15}s` }}
                      />
                    ))}
                  </span>
                  AI sedang merakit website kamu...
                </div>
              </div>
            )}

            {/* Result hint in chat */}
            {previewState === "result" && (
              <div className="pl-11 pr-2 animate-in fade-in slide-in-from-bottom-2 duration-700">
                <div className="flex items-center gap-2 text-emerald-400 text-sm font-medium">
                  <CheckCircle2 className="w-4 h-4" />
                  Website siap! Lihat hasilnya di sebelah kanan →
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Input area */}
          {chatStage !== "type" && chatStage !== "mood" && chatStage !== "done" && (
            <div className="p-4 bg-white/[0.02] border-t border-white/10 shrink-0">
              <form onSubmit={handleSendText} className="relative flex items-center">
                {chatStage === "desc" ? (
                  <textarea
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Tuliskan di sini..."
                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-5 pr-14 py-3.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 resize-none h-24"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendText(e);
                      }
                    }}
                  />
                ) : chatStage === "wa" ? (
                  <input
                    type="tel"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Contoh: 08123456789"
                    autoFocus
                    className="w-full bg-white/5 border border-white/10 rounded-full pl-5 pr-14 py-3.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50"
                  />
                ) : (
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Ketik jawaban Anda..."
                    autoFocus
                    className="w-full bg-white/5 border border-white/10 rounded-full pl-5 pr-14 py-3.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50"
                  />
                )}
                <button
                  type="submit"
                  disabled={!inputValue.trim()}
                  className={`absolute ${
                    chatStage === "desc" ? "bottom-3 right-3" : "right-2"
                  } w-10 h-10 flex items-center justify-center rounded-full bg-indigo-600 text-white transition-all disabled:opacity-30 hover:bg-indigo-500`}
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}
        </div>

        {/* ── Right: Preview Panel ────────────────────────────────────────── */}
        <div className="hidden lg:flex flex-col rounded-3xl border border-white/10 shadow-xl overflow-hidden">
          {/* Browser chrome bar */}
          <div className="h-10 bg-slate-200 border-b border-slate-300 flex items-center px-4 gap-2 shrink-0">
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <div className="w-3 h-3 rounded-full bg-amber-400" />
            <div className="w-3 h-3 rounded-full bg-emerald-400" />
            <div className="ml-4 h-6 flex-1 bg-white/60 rounded-md border border-slate-300 flex items-center px-3">
              <span className="text-[10px] text-slate-400 truncate">
                {previewState === "result" ? `${businessName.toLowerCase().replace(/[^a-z0-9]/g, "")}.webjoz.com` : "preview.webjoz.com"}
              </span>
            </div>
          </div>

          {/* ── Wireframe state ── */}
          {previewState === "wireframe" && (
            <div className="flex-1 overflow-y-auto bg-white p-6 opacity-60">
              <header className="flex justify-between items-center pb-6 border-b border-slate-200 mb-8">
                <div className="h-6 w-24 bg-slate-300 rounded" />
                <div className="flex gap-4">
                  <div className="h-4 w-12 bg-slate-200 rounded" />
                  <div className="h-4 w-12 bg-slate-200 rounded" />
                </div>
              </header>
              <main className="space-y-10">
                <section className="text-center space-y-5 py-10 px-8 bg-slate-50 rounded-2xl border border-slate-200">
                  <h1 className="text-3xl md:text-4xl font-extrabold text-slate-700 transition-all duration-500 min-h-[2.5rem]">
                    {businessName || <span className="text-slate-300">Nama Bisnis Anda</span>}
                  </h1>
                  <p className="max-w-lg mx-auto text-slate-400 text-xs leading-relaxed transition-all duration-500 min-h-[2rem]">
                    {description ||
                      "Deskripsi produk atau layanan utama Anda akan tampil di sini sebagai subheadline yang menarik."}
                  </p>
                  <div className="h-10 w-36 bg-slate-300 rounded-full mx-auto mt-4" />
                </section>
                <section className="grid grid-cols-3 gap-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="p-5 border border-slate-200 rounded-xl space-y-3 text-center">
                      <div className="w-10 h-10 bg-slate-200 rounded-full mx-auto" />
                      <div className="h-3.5 w-3/4 bg-slate-300 rounded mx-auto" />
                      <div className="h-2.5 w-full bg-slate-200 rounded" />
                      <div className="h-2.5 w-5/6 bg-slate-200 rounded mx-auto" />
                    </div>
                  ))}
                </section>
                <section className="flex gap-6 items-center bg-slate-50 p-6 rounded-2xl border border-slate-200">
                  <div className="flex-1 space-y-3">
                    <div className="h-6 w-3/4 bg-slate-300 rounded" />
                    <div className="h-2.5 w-full bg-slate-200 rounded" />
                    <div className="h-2.5 w-full bg-slate-200 rounded" />
                    <div className="h-2.5 w-2/3 bg-slate-200 rounded" />
                  </div>
                  <div className="w-1/3 aspect-square bg-slate-200 rounded-xl" />
                </section>
              </main>
            </div>
          )}

          {/* ── Loading state ── */}
          {previewState === "loading" && (
            <div className="flex-1 bg-gradient-to-br from-slate-900 to-indigo-950 flex flex-col items-center justify-center gap-8 p-10">
              {/* Animated logo/icon */}
              <div className="relative">
                <div className="w-20 h-20 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center">
                  <Wand2 className="w-9 h-9 text-indigo-400 animate-pulse" />
                </div>
                <div className="absolute -inset-2 rounded-3xl border border-indigo-500/20 animate-ping opacity-30" />
              </div>

              {/* Step text */}
              <div className="text-center space-y-2">
                <p className="text-white font-semibold text-base">AI sedang merakit website...</p>
                <p className="text-indigo-300/80 text-sm transition-all duration-700 min-h-[1.25rem]">
                  {AI_LOADING_STEPS[aiStepIdx]}
                </p>
              </div>

              {/* Skeleton preview bars */}
              <div className="w-full max-w-xs space-y-3 opacity-30">
                <div className="h-8 bg-white/10 rounded-xl animate-pulse" />
                {["w-full", "w-5/6", "w-4/6", "w-full", "w-3/4"].map((w, i) => (
                  <div
                    key={i}
                    className={`h-3 ${w} bg-white/10 rounded-full animate-pulse`}
                    style={{ animationDelay: `${i * 0.1}s` }}
                  />
                ))}
                <div className="grid grid-cols-3 gap-2 pt-2">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="h-16 bg-white/10 rounded-xl animate-pulse"
                      style={{ animationDelay: `${i * 0.15}s` }}
                    />
                  ))}
                </div>
              </div>

              {/* Progress dots */}
              <div className="flex items-center gap-1.5">
                {AI_LOADING_STEPS.map((_, i) => (
                  <div
                    key={i}
                    className={`h-1 rounded-full transition-all duration-500 ${
                      i <= aiStepIdx ? "bg-indigo-400 w-6" : "bg-white/10 w-3"
                    }`}
                  />
                ))}
              </div>
            </div>
          )}

          {/* ── Result state ── */}
          {previewState === "result" && previewData && (
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Preview content area */}
              <div
                className="flex-1 overflow-y-auto p-6 space-y-5"
                style={{
                  background: palette?.background || "#ffffff",
                }}
              >
                {/* Hero section preview */}
                <div
                  className="rounded-2xl p-8 text-center space-y-4"
                  style={{
                    background: `linear-gradient(135deg, ${palette?.primary || "#6366f1"}22, ${palette?.accent || "#8b5cf6"}11)`,
                    border: `1px solid ${palette?.primary || "#6366f1"}30`,
                  }}
                >
                  <div className="inline-flex items-center gap-2 text-xs px-3 py-1 rounded-full bg-white/50 text-slate-600">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ background: palette?.primary || "#6366f1" }}
                    />
                    {businessType || "Bisnis"}
                  </div>
                  <h1
                    className="text-2xl font-extrabold leading-tight"
                    style={{
                      color: palette?.text || "#1f2937",
                      fontFamily: typography?.heading_font ? `"${typography.heading_font}", serif` : undefined,
                    }}
                  >
                    {heroCopy?.headline || businessName}
                  </h1>
                  <p className="text-sm text-slate-500 max-w-sm mx-auto leading-relaxed">
                    {heroCopy?.subheadline || description}
                  </p>
                  <button
                    className="mt-2 px-6 py-2.5 rounded-full text-white text-sm font-semibold shadow-md"
                    style={{ background: palette?.primary || "#6366f1" }}
                  >
                    {heroCopy?.cta_label || "Hubungi Kami"}
                  </button>
                </div>

                {/* Benefits grid preview */}
                {Array.isArray((previewData.content?.benefits as any)?.items) && (
                  <div className="grid grid-cols-3 gap-3">
                    {((previewData.content.benefits as any).items as any[])
                      .slice(0, 3)
                      .map((item: any, i: number) => (
                        <div
                          key={i}
                          className="rounded-xl p-4 text-center space-y-2 border"
                          style={{
                            background: palette?.surface || "#fff",
                            borderColor: `${palette?.primary || "#6366f1"}20`,
                          }}
                        >
                          <div
                            className="w-8 h-8 rounded-full mx-auto flex items-center justify-center text-white text-xs font-bold"
                            style={{ background: palette?.primary || "#6366f1" }}
                          >
                            {i + 1}
                          </div>
                          <p className="text-xs font-semibold" style={{ color: palette?.text || "#1f2937" }}>
                            {item.title || item.heading}
                          </p>
                        </div>
                      ))}
                  </div>
                )}

                {/* About preview */}
                {(previewData.content?.about as any)?.body && (
                  <div
                    className="rounded-xl p-5 border"
                    style={{
                      background: palette?.surface || "#fff",
                      borderColor: `${palette?.primary || "#6366f1"}15`,
                    }}
                  >
                    <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
                      {(previewData.content.about as any).body}
                    </p>
                  </div>
                )}
              </div>

              {/* CTA Footer */}
              <div className="shrink-0 p-5 border-t border-slate-200 bg-gradient-to-r from-indigo-50 to-violet-50 space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <p className="text-xs font-semibold text-slate-700">
                    Website <strong>{businessName}</strong> sudah selesai dibuat!
                  </p>
                </div>
                <button
                  onClick={handleGoToEditor}
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-sm font-bold shadow-lg shadow-indigo-600/20 transition-all"
                >
                  <Pencil className="w-4 h-4" />
                  Kustomisasi & Publish Website →
                </button>
                <p className="text-center text-[10px] text-slate-500">
                  Gratis selamanya · Tidak perlu kartu kredit · Simpan kapan saja
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
