"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { request } from "@/lib/api/client";
import {
  ArrowRight,
  CheckCircle2,
  ChevronLeft,
  Loader2,
  Pencil,
  Sparkles,
  Wand2,
} from "lucide-react";
import { useToast } from "@/components/toast-provider";
import { TemplateDynamicWithCart } from "@/components/templates";

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
  widget?: "type-chips" | "advantage-chips" | "mood-chips";
};

// content + design_token returned from public generate-preview endpoint
type PreviewData = {
  content: Record<string, any>;
  design_token: Record<string, any>;
};

// ─── Constants ──────────────────────────────────────────────────────────────

const PENDING_KEY = "webjoz_pending_wizard_data";
const INITIAL_MESSAGE = "🤖 Halo! Saya akan membantu membuat website bisnis Anda. Apa nama bisnis Anda?";
const INITIAL_MESSAGE_WORDS = INITIAL_MESSAGE.split(" ");

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
  { value: "Kuliner", emoji: "🍜", label: "Kuliner", desc: "Restoran & Cafe" },
  { value: "Toko & UMKM", emoji: "🛍️", label: "Toko & UMKM", desc: "Toko & UMKM" },
  { value: "Jasa", emoji: "💼", label: "Jasa", desc: "Agency" },
  { value: "Company", emoji: "🏢", label: "Company", desc: "Corporate" },
];

const MOODS = [
  { value: "Profesional", emoji: "🎯", desc: "Serius & terpercaya" },
  { value: "Modern & Minimalis", emoji: "⚡", desc: "Clean & elegan" },
  { value: "Fun & Colorful", emoji: "🎨", desc: "Ceria & energik" },
  { value: "Elegan & Mewah", emoji: "👑", desc: "Premium & eksklusif" },
  { value: "Natural & Hangat", emoji: "🌿", desc: "Earthy & ramah" },
  { value: "Bold & Tegas", emoji: "🔥", desc: "Kuat & impactful" },
];

const ADVANTAGE_SUGGESTIONS: Record<string, string[]> = {
  "Kuliner": [
    "Menu andalan dibuat fresh setiap hari dengan resep khas keluarga.",
    "Tempat nyaman untuk makan bersama, reservasi, dan acara kecil.",
    "Bahan pilihan, rasa konsisten, dan pelayanan cepat.",
  ],
  "Toko & UMKM": [
    "Produk lengkap, harga bersaing, dan bisa konsultasi sebelum membeli.",
    "Stok ready, kualitas terjamin, dan pengiriman cepat.",
    "Pilihan produk lokal berkualitas dengan layanan ramah.",
  ],
  "Jasa": [
    "Tim berpengalaman, proses kerja jelas, dan hasil rapi tepat waktu.",
    "Konsultasi mudah, rekomendasi transparan, dan support setelah pekerjaan selesai.",
    "Solusi dibuat sesuai kebutuhan, bukan paket yang kaku.",
  ],
  "Company": [
    "Tim profesional, standar kerja tinggi, dan dipercaya banyak klien.",
    "Proses produksi terukur, kualitas konsisten, dan layanan responsif.",
    "Pengalaman industri kuat dengan solusi yang bisa disesuaikan.",
  ],
};

// ─── Build full content with AI data + defaults ─────────────────────────────

function preserveUserBrand(content: Record<string, any>, businessName: string): Record<string, any> {
  return {
    ...content,
    header: {
      ...(content.header || {}),
      brand_name: businessName,
    },
    footer: {
      ...(content.footer || {}),
      brand_name: businessName,
    },
    seo: {
      ...(content.seo || {}),
      title: content.seo?.title || businessName,
    },
  };
}

function buildFullContent(data: PreviewData, businessName: string, businessType: string, description: string, whatsapp: string, matraValue?: string) {
  const c = preserveUserBrand(data.content as Record<string, any>, businessName);
  const logoUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(businessName)}&background=random&color=fff&size=256&format=png`;

  // All images come from the backend (populateImageUrls). Never override with random frontend picks.
  return {
    header: {
      brand_name: businessName,
      nav_cta_text: c.header?.nav_cta_text || "Hubungi Kami",
      logo_url: c.header?.logo_url || logoUrl,
      tagline: c.header?.tagline || "",
    },
    hero: {
      headline: c.hero?.headline || businessName,
      matra: c.hero?.matra || matraValue || "",
      subheadline: c.hero?.subheadline || description,
      cta_text: c.hero?.cta_text || c.hero?.cta_label || "Hubungi Kami",
      cta_url: whatsapp ? `https://wa.me/${whatsapp.replace(/\D/g, "")}` : "#contact",
      image_url: c.hero?.image_url || "",
      badge_text: c.hero?.badge_text || businessType,
    },
    about: {
      title: c.about?.title || `Tentang ${businessName}`,
      body: c.about?.body || description,
      image_url: c.about?.image_url || "",
    },
    benefits: {
      title: c.benefits?.title || "Kenapa Pilih Kami?",
      items: (c.benefits?.items?.length ? c.benefits.items : [
        { title: "Kualitas Terjamin", description: "Produk dan layanan pilihan terbaik untuk Anda." },
        { title: "Harga Terjangkau", description: "Harga kompetitif tanpa mengorbankan kualitas." },
        { title: "Pelayanan Ramah", description: "Tim kami siap membantu kapan saja Anda butuh." },
      ]),
    },
    testimonials: {
      ...c.testimonials,
      items: c.testimonials?.items ?? [],
    },
    faq: {
      title: c.faq?.title || "Pertanyaan Umum",
      items: (c.faq?.items?.length ? c.faq.items : [
        { question: `Apa yang ditawarkan ${businessName}?`, answer: description || `${businessName} menyediakan produk dan layanan berkualitas terbaik untuk kebutuhan Anda.` },
        { question: "Bagaimana cara menghubungi kami?", answer: whatsapp ? `Anda bisa menghubungi kami via WhatsApp di ${whatsapp}.` : "Silakan hubungi kami melalui formulir kontak di bawah ini." },
        { question: "Apakah ada garansi?", answer: "Kami berkomitmen memberikan produk dan layanan terbaik. Kepuasan Anda adalah prioritas kami." },
      ]),
    },
    cta: {
      headline: c.cta?.headline || `Siap Memulai dengan ${businessName}?`,
      button_text: c.cta?.button_text || "Hubungi Sekarang",
      button_url: whatsapp ? `https://wa.me/${whatsapp.replace(/\D/g, "")}` : "#contact",
    },
    contact: {
      title: c.contact?.title || "Hubungi Kami",
      address: c.contact?.address || "",
      phone: c.contact?.phone || whatsapp || "",
      email: c.contact?.email || "",
    },
    footer: {
      brand_name: businessName,
      tagline: c.footer?.tagline || description,
      copyright_text: c.footer?.copyright_text || `© ${new Date().getFullYear()} ${businessName}. All rights reserved.`,
    },
    ...(c.menu ? { menu: c.menu } : {}),
    ...(c.catalog ? { catalog: c.catalog } : {}),
    seo: {
      title: c.seo?.title || businessName,
      description: c.seo?.description || description,
      favicon_url: c.seo?.favicon_url || logoUrl,
      og_image_url: c.seo?.og_image_url || "",
    },
  };
}

// ─── Component ───────────────────────────────────────────────────────────────

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
  const [chatStage, setChatStage] = useState<"name" | "type" | "advantage" | "mood" | "whatsapp" | "done">("name");
  // Stage order: name → type → advantage → mood → whatsapp → done
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "init",
      sender: "ai",
      text: INITIAL_MESSAGE,
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [initialWordCount, setInitialWordCount] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const isInitialTyping = chatStage === "name" && initialWordCount < INITIAL_MESSAGE_WORDS.length;

  const getProgressPercentage = () => {
    switch (chatStage) {
      case "name": return 20;
      case "type": return 40;
      case "advantage": return 60;
      case "mood": return 78;
      case "whatsapp": return 92;
      case "done": return 100;
      default: return 100;
    }
  };

  const getStageNumber = () => {
    switch (chatStage) {
      case "name": return 1;
      case "type": return 2;
      case "advantage": return 3;
      case "mood": return 4;
      case "whatsapp": return 5;
      case "done": return 5;
      default: return 1;
    }
  };

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
      return;
    }

    router.push("/");
  };

  // Form data
  const [businessName, setBusinessName] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [description, setDescription] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [mood, setMood] = useState("");
  const [matra, setMatra] = useState("");
  const [selectedAdvantages, setSelectedAdvantages] = useState<string[]>([]);

  // Right panel state: wireframe → loading → result
  const [previewState, setPreviewState] = useState<"wireframe" | "loading" | "result">("wireframe");
  const [previewData, setPreviewData] = useState<PreviewData | null>(null);

  // Loading animation state
  const [loadingStep, setLoadingStep] = useState(0);

  // Helper to animate AI typing
  const [isAiTyping, setIsAiTyping] = React.useState(false);

  const typeMessage = (fullText: string, onComplete: () => void) => {
    let idx = 0;
    const typingId = 'typing';
    setIsAiTyping(true);
    const interval = setInterval(() => {
      idx++;
      const partial = fullText.slice(0, idx);
      setMessages((prev) => {
        const filtered = prev.filter((m) => m.id !== typingId);
        return [...filtered, { id: typingId, sender: "ai", text: partial }];
      });
      if (idx >= fullText.length) {
        clearInterval(interval);
        setMessages((prev) => {
          const filtered = prev.filter((m) => m.id !== typingId);
          return [...filtered, { id: Date.now().toString(), sender: "ai", text: fullText }];
        });
        setIsAiTyping(false);
        onComplete();
      }
    }, 30);
  };
  const [pendingPreview, setPendingPreview] = useState<PreviewData | null>(null);

  // Auto-scroll chat
  useEffect(() => {
    setTimeout(() => {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }, [messages, chatStage, previewState]);

  // Type the opening question word-by-word on first load.
  useEffect(() => {
    const interval = setInterval(() => {
      setInitialWordCount((count) => {
        if (count >= INITIAL_MESSAGE_WORDS.length) {
          clearInterval(interval);
          return count;
        }

        return count + 1;
      });
    }, 130);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!isInitialTyping && (chatStage === "name" || chatStage === "advantage" || chatStage === "whatsapp")) {
      inputRef.current?.focus();
    }
  }, [isInitialTyping, chatStage]);

  // Cycle checklist steps during loading state
  useEffect(() => {
    if (previewState === "loading") {
      setLoadingStep(0);
      const interval = setInterval(() => {
        setLoadingStep((prev) => {
          if (prev < 5) return prev + 1;
          return prev;
        });
      }, 1500); // 1.5s per step, total 7.5s
      return () => clearInterval(interval);
    }
  }, [previewState]);

  // Transition to results screen only when API is done AND progress reaches step 5
  useEffect(() => {
    if (pendingPreview && loadingStep >= 5) {
      setPreviewData(pendingPreview);
      setPreviewState("result");
      setPendingPreview(null);
    }
  }, [pendingPreview, loadingStep]);

  // When user submits WA number (chatStage -> "done"), type the final message THEN start generate
  useEffect(() => {
    if (chatStage === "done" && previewState === "wireframe" && mood) {
      typeMessage("Sempurna. Semua data sudah siap. Website sedang dibuat...", () => {
        handleGenerate(businessName, businessType, mood, description);
      });
    }
  }, [chatStage]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Chat handlers ────────────────────────────────────────────────────────

  const handleSendText = (e: React.FormEvent) => {
    e.preventDefault();
    if (isInitialTyping) return;
    if (!inputValue.trim() && chatStage !== "whatsapp") return;
    const val = inputValue.trim();
    setInputValue("");

    if (chatStage === "name") {
      const capitalized = val
        .split(/\s+/)
        .map((w) => (w.length > 0 ? w[0].toUpperCase() + w.slice(1).toLowerCase() : ""))
        .join(" ");
      setBusinessName(capitalized);
      setMessages((prev) => [
        ...prev,
        { id: Date.now().toString(), sender: "user", text: val },
      ]);
      setTimeout(() => {
        typeMessage("Nama yang profesional dan mudah dipercaya. 👍", () => {
          setTimeout(() => {
            typeMessage("Sekarang, pilih jenis bisnis Anda:", () => {
              setMessages((prev) => [
                ...prev,
                { id: `widget-type-chips-${Date.now()}`, sender: "ai", text: "", widget: "type-chips" },
              ]);
              setChatStage("type");
            });
          }, 300);
        });
      }, 500);

    } else if (chatStage === "advantage") {
      setDescription(val);
      setMessages((prev) => [
        ...prev,
        { id: Date.now().toString(), sender: "user", text: val },
      ]);
      setTimeout(() => {
        typeMessage("Mantap. Keunggulan ini akan saya tonjolkan di headline, benefit, dan CTA. Sekarang pilih gaya visualnya.", () => {
          setMessages((prev) => [
            ...prev,
            { id: `widget-mood-chips-${Date.now()}`, sender: "ai", text: "", widget: "mood-chips" },
          ]);
          setChatStage("mood");
        });
      }, 500);

    } else if (chatStage === "whatsapp") {
      // WA is optional — user can skip with empty input
      const digits = val.replace(/\D/g, "");
      if (digits) {
        // normalize: 08xx → 628xx
        const normalized = digits.startsWith("0") ? "62" + digits.slice(1) : digits;
        setWhatsapp(normalized);
        setMessages((prev) => [
          ...prev,
          { id: Date.now().toString(), sender: "user", text: val },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { id: Date.now().toString(), sender: "user", text: "Lewati" },
        ]);
      }
      setChatStage("done");
    }
  };

  const handleSelectType = (type: string) => {
    setBusinessType(type);
    setSelectedAdvantages([]);
    setInputValue("");

    const userText = type === "Toko & UMKM" ? "Toko & UMKM" :
      type === "Kuliner" ? "Kuliner / Restoran" :
        type === "Jasa" ? "Layanan Jasa" : "Company / Perusahaan";

    const typeContext = type === "Toko & UMKM"
      ? "toko & produk unggulan"
      : type === "Kuliner"
        ? "menu andalan & suasana"
        : type === "Jasa"
          ? "layanan & portofolio"
          : "profil perusahaan & kredibilitas";

    const aiResponse = `Bagus! Saya akan membuat website dengan fokus ${typeContext}.\n\nCeritakan produk/layanan utama dan keunggulan bisnis Anda:`;

    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), sender: "user", text: userText },
    ]);
    setTimeout(() => {
      typeMessage(aiResponse, () => {
        setMessages((prev) => [
          ...prev,
          { id: `widget-advantage-chips-${Date.now()}`, sender: "ai", text: "", widget: "advantage-chips" },
        ]);
        setChatStage("advantage");
      });
    }, 500);
  };

  const toggleAdvantageSuggestion = (suggestion: string) => {
    setSelectedAdvantages((current) => {
      const next = current.includes(suggestion)
        ? current.filter((item) => item !== suggestion)
        : [...current, suggestion];

      setInputValue(next.join(" "));
      return next;
    });
    inputRef.current?.focus();
  };

  // ── Generate (public, no login needed) ──────────────────────────────────

  const handleGenerate = async (
    bName = businessName,
    bType = businessType,
    bMood = mood,
    bDescription = description
  ) => {
    setPreviewState("loading");
    setLoadingStep(0);
    setPendingPreview(null);

    try {
      const res = await request<any>("/ai/public/generate-preview", {
        method: "POST",
        body: JSON.stringify({
          business_name: bName,
          business_type: bType,
          description: bDescription,
          whatsapp: "",     // Send empty WhatsApp to allow backend fallback
          mood: bMood,
        }),
      });

      if (res.status !== "success") throw new Error(res.message);

      const preservedContent = preserveUserBrand(res.data.content, bName);
      const loadedData = {
        content: preservedContent,
        design_token: res.data.design_token,
      };

      // Save the generated preview to localStorage so we can use it after login
      localStorage.setItem(
        PENDING_KEY,
        JSON.stringify({
          businessName: bName,
          businessType: bType,
          description: bDescription,
          whatsapp: "",
          mood: bMood,
          previewContent: preservedContent,
          previewDesignToken: res.data.design_token,
        })
      );

      setPendingPreview(loadedData);
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

  const formatText = (text: string, isUser: boolean) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={i} className={`font-bold ${isUser ? "text-white" : "text-slate-950"}`}>
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

  // Helper to get logs based on selected mood/type
  const getLogMessages = () => {
    const keyword = businessType === "Toko & UMKM" ? "toko & produk" :
      businessType === "Kuliner" ? "kuliner" :
        businessType === "Jasa" ? "jasa profesional" : "corporate";

    const toneMap: Record<string, string> = {
      "Profesional": "profesional & tepercaya",
      "Modern & Minimalis": "modern & profesional",
      "Fun & Colorful": "ceria & dinamis",
      "Elegan & Mewah": "premium & eksklusif",
      "Natural & Hangat": "hangat & natural",
      "Bold & Tegas": "kuat & tegas",
    };
    const tone = toneMap[mood] || mood.toLowerCase() || "modern & profesional";

    return [
      `Menemukan keyword: ${keyword}`,
      `Memilih tone: ${tone}`,
      `Menambahkan CTA WhatsApp`,
      `Membuat struktur halaman...`,
    ];
  };

  const getModalProgressPercent = () => {
    switch (loadingStep) {
      case 0: return 15;
      case 1: return 30;
      case 2: return 45;
      case 3: return 60;
      case 4: return 75;
      case 5: return 100;
      default: return 100;
    }
  };

  const renderChecklistItem = (label: string, index: number) => {
    let statusIcon = null;
    let textClass = "text-slate-400";

    if (loadingStep > index) {
      statusIcon = <span className="text-emerald-400 font-bold">✓</span>;
      textClass = "text-slate-200 font-medium";
    } else if (loadingStep === index) {
      statusIcon = <Loader2 className="w-5 h-5 text-[#7c3aed] animate-spin shrink-0" />;
      textClass = "text-[#7c3aed] font-semibold";
    } else {
      statusIcon = <span className="text-slate-600">⏳</span>;
      textClass = "text-slate-500";
    }

    return (
      <div className={`flex items-center gap-3 text-base ${textClass} transition-colors duration-300`}>
        <span className="w-6 flex justify-center shrink-0">
          {statusIcon}
        </span>
        <span>{label}</span>
      </div>
    );
  };

  const skeletonSubtle = { background: "rgba(255,255,255,0.04)" };
  const skeletonSoft = { background: "rgba(255,255,255,0.06)" };
  const skeletonStrong = { background: "rgba(255,255,255,0.08)" };
  const skeletonPanel = { background: "rgba(255,255,255,0.035)", border: "1px solid rgba(255,255,255,0.055)" };

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="flex w-screen h-screen overflow-hidden bg-[#0d0f14]">

      {/* ══ LEFT SIDEBAR: Chat Panel ══════════════════════════════════════════ */}
      <div className="w-[380px] shrink-0 flex flex-col bg-[#111318] border-r h-full overflow-hidden shadow-xl z-10" style={{ borderColor: "rgba(255,255,255,0.07)" }}>

        {/* ── Sidebar Header ──────────────────────────────────────────────── */}
        <div className="px-5 pt-4 pb-5 shrink-0" style={{ borderBottom: "1px solid rgba(255,255,255,0.09)", boxShadow: "0 1px 0 rgba(255,255,255,0.025)" }}>
          <div className="flex items-start gap-3 mb-4">
            <button
              type="button"
              onClick={handleBack}
              aria-label="Kembali"
              className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-slate-300 transition-all hover:border-violet-400/40 hover:bg-violet-500/10 hover:text-white active:scale-95"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#7c3aed] to-indigo-600 flex items-center justify-center shrink-0">
                    <Sparkles className="w-[18px] h-[18px] text-white" />
                  </div>
                  <span className="font-bold text-white text-[17px] leading-tight">
                    Webjoz AI Assistant
                  </span>
                </div>
                <span className="shrink-0 text-[10px] font-semibold text-violet-300 bg-violet-500/10 border border-violet-500/20 px-2 py-0.5 rounded-full">BETA</span>
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] text-slate-500 font-medium">
              Langkah {getStageNumber()} dari 5
            </span>
            <span className="text-[11px] font-bold text-[#7c3aed]">{getProgressPercentage()}%</span>
          </div>
          <div className="h-[5px] bg-white/5 rounded-full overflow-hidden w-full">
            <div
              className="h-full bg-gradient-to-r from-[#7c3aed] to-[#38bdf8] transition-all duration-700 rounded-full"
              style={{ width: `${getProgressPercentage()}%` }}
            />
          </div>
        </div>

        {/* ── Chat messages ────────────────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto px-4 py-5 pb-8 space-y-4">
          {messages.map((m) => (
            (() => {
              // ── Inline widget messages ──
              if (m.widget === "type-chips") {
                const isLocked = chatStage !== "type";
                return (
                  <div key={m.id} className="animate-in fade-in slide-in-from-bottom-2 duration-400">
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {BUSINESS_TYPES.map((t) => {
                        const isSelected = businessType === t.value;
                        return (
                          <button
                            key={t.value}
                            onClick={() => !isLocked && handleSelectType(t.value)}
                            disabled={isLocked}
                            className={`flex flex-col items-start gap-1 p-3 border rounded-xl text-left transition-all ${isSelected
                                ? "border-[#7c3aed]/70"
                                : isLocked
                                  ? "opacity-30 cursor-default"
                                  : "hover:border-[#7c3aed]/50 active:scale-[0.97] cursor-pointer"
                              }`}
                            style={isSelected
                              ? { background: "rgba(124,58,237,0.15)", borderColor: "rgba(124,58,237,0.5)" }
                              : { background: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.07)" }}
                          >
                            <span className="text-lg">{t.emoji}</span>
                            <span className={`text-xs font-bold ${isSelected ? "text-[#a78bfa]" : "text-slate-200"}`}>{t.label}</span>
                            <span className="text-[10px] text-slate-500">{t.desc}</span>
                            {isSelected && <span className="text-[9px] font-bold text-[#7c3aed] mt-0.5">✓ Dipilih</span>}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              }

              if (m.widget === "advantage-chips") {
                const isLocked = chatStage !== "advantage";
                const handleSubmitAdvantages = () => {
                  const combined = selectedAdvantages.join(". ") || inputValue.trim();
                  if (!combined) return;
                  setDescription(combined);
                  setInputValue("");
                  setSelectedAdvantages([]);
                  // Format as checklist for the user bubble
                  const displayText = selectedAdvantages.length > 0
                    ? selectedAdvantages.map(s => `✓ ${s}`).join("\n")
                    : combined;
                  setMessages((prev) => [
                    ...prev,
                    { id: Date.now().toString(), sender: "user", text: displayText },
                  ]);
                  setTimeout(() => {
                    typeMessage("Mantap. Keunggulan ini akan saya tonjolkan di headline, benefit, dan CTA. Sekarang pilih gaya visualnya.", () => {
                      setMessages((prev) => [
                        ...prev,
                        { id: `widget-mood-chips-${Date.now()}`, sender: "ai", text: "", widget: "mood-chips" },
                      ]);
                      setChatStage("mood");
                    });
                  }, 400);
                };
                return (
                  <div key={m.id} className="animate-in fade-in slide-in-from-bottom-2 duration-400 space-y-3">
                    {!isLocked && (
                      <p className="text-[11px] font-semibold text-slate-500 px-1">
                        Pilih satu atau lebih:
                      </p>
                    )}
                    {/* Chips grid */}
                    <div className="flex flex-col gap-2">
                      {(ADVANTAGE_SUGGESTIONS[businessType] || ADVANTAGE_SUGGESTIONS.Company).map((suggestion) => {
                        const selected = !isLocked && selectedAdvantages.includes(suggestion);
                        return (
                          <button
                            key={suggestion}
                            type="button"
                            disabled={isLocked}
                            onClick={() => !isLocked && toggleAdvantageSuggestion(suggestion)}
                            className={`flex items-start gap-2.5 w-full px-3.5 py-2.5 rounded-xl border text-left text-sm leading-snug transition-all cursor-pointer active:scale-[0.98] ${
                              selected
                                ? "text-violet-100 border-violet-500/50"
                                : isLocked
                                  ? "opacity-30 cursor-default text-slate-400 border-white/8"
                                  : "text-slate-300 border-white/10 hover:border-violet-400/40 hover:text-white"
                            }`}
                            style={selected
                              ? { background: "rgba(124,58,237,0.18)" }
                              : { background: "rgba(255,255,255,0.04)" }}
                          >
                            {/* Checkbox circle */}
                            <span className={`mt-0.5 flex-shrink-0 w-4 h-4 rounded-full border flex items-center justify-center transition-all ${
                              selected ? "bg-violet-500 border-violet-400" : "border-slate-600"
                            }`}>
                              {selected && (
                                <svg viewBox="0 0 10 8" className="w-2.5 h-2 fill-white">
                                  <path d="M1 4l2.5 2.5L9 1" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                              )}
                            </span>
                            <span>{suggestion}</span>
                          </button>
                        );
                      })}
                    </div>
                    {/* Lanjut button — appears when something is selected */}
                    {!isLocked && selectedAdvantages.length > 0 && (
                      <button
                        type="button"
                        onClick={handleSubmitAdvantages}
                        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold text-white transition-all active:scale-[0.98] cursor-pointer"
                        style={{ background: "linear-gradient(135deg, #7c3aed, #5b21b6)" }}
                      >
                        Lanjut dengan {selectedAdvantages.length} keunggulan
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                );
              }

              if (m.widget === "mood-chips") {
                const isLocked = chatStage === "whatsapp" || chatStage === "done";
                return (
                  <div key={m.id} className="animate-in fade-in slide-in-from-bottom-2 duration-400">
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {MOODS.map((mo) => {
                        const isSelected = mood === mo.value;
                        return (
                          <button
                            key={mo.value}
                            disabled={isLocked}
                            onClick={() => {
                              if (isLocked) return;
                              setMood(mo.value);
                              setMessages((prev) => [
                                ...prev,
                                { id: Date.now().toString(), sender: "user", text: `${mo.emoji} ${mo.value}` },
                              ]);
                              // Ask for WA number before generating
                              setTimeout(() => {
                                typeMessage("Hampir selesai! 🎉 Masukkan nomor WhatsApp bisnis Anda — akan dipakai untuk tombol CTA di website. (Opsional — tekan Enter untuk lewati)", () => {
                                  setChatStage("whatsapp");
                                });
                              }, 400);
                            }}
                            className={`flex items-center gap-2 p-2.5 border rounded-xl text-left transition-all ${isSelected
                                ? "border-[#7c3aed]/70"
                                : isLocked
                                  ? "opacity-30 cursor-default"
                                  : "hover:border-[#7c3aed]/50 active:scale-[0.97] cursor-pointer"
                              }`}
                            style={isSelected
                              ? { background: "rgba(124,58,237,0.15)", borderColor: "rgba(124,58,237,0.5)" }
                              : { background: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.07)" }}
                          >
                            <span className="text-base shrink-0">{mo.emoji}</span>
                            <div className="flex-1 min-w-0">
                              <span className={`text-xs font-bold block leading-tight ${isSelected ? "text-[#a78bfa]" : "text-slate-200"}`}>{mo.value}</span>
                              <span className="text-[10px] text-slate-500 leading-tight">{mo.desc}</span>
                              {isSelected && <span className="text-[9px] font-bold text-[#7c3aed] block mt-0.5">✓ Dipilih</span>}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              }

              // ── Regular text messages ──
              const messageText =
                m.id === "init" && chatStage === "name"
                  ? INITIAL_MESSAGE_WORDS.slice(0, initialWordCount).join(" ")
                  : m.text;

              return (
                <div
                  key={m.id}
                  className={`flex gap-2.5 ${m.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  {m.sender === "ai" && (
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#7c3aed] to-indigo-600 flex items-center justify-center shrink-0 mt-0.5">
                      <Sparkles className="w-3 h-3 text-white" />
                    </div>
                  )}
                  <div
                    className={`max-w-[78%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${m.sender === "user"
                      ? "bg-[#7c3aed] text-white rounded-tr-sm"
                      : "rounded-tl-sm text-slate-200"
                      }`}
                    style={m.sender !== "user" ? { background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.07)" } : {}}
                  >
                    {formatText(messageText, m.sender === "user")}
                    {m.id === "init" && isInitialTyping && (
                      <span className="ml-0.5 inline-block h-4 w-0.5 translate-y-0.5 animate-pulse rounded-full bg-slate-300" />
                    )}
                  </div>
                </div>
              );
            })()
          ))}

          {/* Loading bubble — visible during generate */}
          {previewState === "loading" && (
            <div className="flex gap-2.5 justify-start animate-in fade-in slide-in-from-bottom-2 duration-400">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#7c3aed] to-indigo-600 flex items-center justify-center shrink-0 mt-0.5">
                <Sparkles className="w-3 h-3 text-white" />
              </div>
              <div
                className="flex-1 min-w-0 rounded-2xl rounded-tl-sm px-3.5 py-3 space-y-3"
                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.07)" }}
              >
                {/* Progress bar */}
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.07)" }}>
                    <div
                      className="h-full rounded-full transition-all duration-1000 ease-out"
                      style={{
                        width: `${[15, 30, 45, 60, 75, 100][loadingStep] ?? 15}%`,
                        background: "linear-gradient(90deg, #7c3aed, #38bdf8)",
                      }}
                    />
                  </div>
                  <span className="text-[10px] font-bold shrink-0" style={{ color: "#a78bfa" }}>
                    {[15, 30, 45, 60, 75, 100][loadingStep] ?? 15}%
                  </span>
                </div>

                {/* Step list */}
                <div className="space-y-2">
                  {[
                    { label: "Analisis bisnis & target pasar", icon: "🔍" },
                    { label: "Menyusun struktur halaman", icon: "📐" },
                    { label: "Menulis headline & copywriting", icon: "✍️" },
                    { label: "Optimasi SEO on-page", icon: "🔎" },
                    { label: "Memilih palet warna & tipografi", icon: "🎨" },
                    { label: "Website siap dipublish!", icon: "🚀" },
                  ].map(({ label, icon }, idx) => {
                    const done = loadingStep > idx;
                    const active = loadingStep === idx;
                    return (
                      <div
                        key={idx}
                        className="flex items-center gap-2.5 transition-all duration-300"
                        style={{ opacity: done ? 1 : active ? 1 : 0.3 }}
                      >
                        <div
                          className="w-4 h-4 rounded-full flex items-center justify-center shrink-0 transition-all duration-300"
                          style={
                            done
                              ? { background: "rgba(52,211,153,0.2)", border: "1px solid rgba(52,211,153,0.4)" }
                              : active
                                ? { background: "rgba(124,58,237,0.2)", border: "1px solid rgba(124,58,237,0.5)" }
                                : { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }
                          }
                        >
                          {done ? (
                            <span className="text-[8px] text-emerald-400 font-bold">✓</span>
                          ) : active ? (
                            <Loader2 className="w-2.5 h-2.5 text-[#7c3aed] animate-spin" />
                          ) : null}
                        </div>
                        <span
                          className="text-[11px] font-medium leading-tight"
                          style={{ color: done ? "#86efac" : active ? "#a78bfa" : "rgba(148,163,184,1)" }}
                        >
                          {label}
                        </span>
                        {active && (
                          <span className="ml-auto text-[9px] font-mono shrink-0" style={{ color: "#7c3aed" }}>
                            {String(idx + 2).padStart(2, "0")}s
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Result status in chat — rich AI bubble with CTA */}
          {previewState === "result" && (
            <div className="flex gap-2.5 justify-start animate-in fade-in slide-in-from-bottom-2 duration-500">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#7c3aed] to-indigo-600 flex items-center justify-center shrink-0 mt-0.5">
                <Sparkles className="w-3 h-3 text-white" />
              </div>
              <div className="flex flex-col gap-3 flex-1 min-w-0">
                {/* Info bubble */}
                <div
                  className="rounded-2xl rounded-tl-sm px-3.5 py-3 text-sm leading-relaxed"
                  style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.07)" }}
                >
                  <div className="flex items-center gap-1.5 mb-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="text-emerald-400 font-bold text-xs">Website siap!</span>
                  </div>
                  <p className="text-slate-300 text-xs leading-relaxed">
                    Website <strong className="text-white">{businessName}</strong> sudah selesai dibuat. Lihat preview di panel kanan, lalu kustomisasi dan publish kapan saja.
                  </p>
                </div>

                {/* CTA buttons */}
                <div className="flex flex-col gap-2">
                  <button
                    onClick={handleGoToEditor}
                    className="flex items-center justify-between gap-2 w-full px-3.5 py-2.5 rounded-xl text-white text-xs font-bold transition-all hover:opacity-90 active:scale-[0.98]"
                    style={{ background: "linear-gradient(135deg, #7c3aed, #5b21b6)", boxShadow: "0 4px 16px rgba(124,58,237,0.3)" }}
                  >
                    <div className="flex items-center gap-2">
                      <Pencil className="w-3.5 h-3.5" />
                      Kustomisasi & Publish
                    </div>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleGenerate(businessName, businessType, mood, description)}
                    className="flex items-center justify-center gap-2 w-full px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-400 transition-all hover:text-slate-200 active:scale-[0.98]"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
                  >
                    <Wand2 className="w-3 h-3" />
                    Generate ulang dengan desain berbeda
                  </button>
                </div>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* ── Chat Input ───────────────────────────────────────────────────── */}
        {chatStage !== "type" && chatStage !== "mood" && chatStage !== "done" && (
          <div className="px-4 py-3 shrink-0" style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
            <form onSubmit={handleSendText} className="flex items-center rounded-2xl px-4 py-1 gap-2 transition-all" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <input
                ref={inputRef}
                type={chatStage === "whatsapp" ? "tel" : "text"}
                inputMode={chatStage === "whatsapp" ? "tel" : undefined}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={
                  chatStage === "whatsapp"
                    ? "cth. 08123456789 (atau Enter untuk lewati)"
                    : chatStage === "advantage"
                    ? "Contoh: produk fresh, harga terjangkau, layanan cepat..."
                    : "Ketik nama bisnis Anda..."
                }
                autoFocus
                disabled={isInitialTyping || isAiTyping}
                className="flex-1 bg-transparent border-none py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={isInitialTyping || isAiTyping || (chatStage === "name" && !inputValue.trim())}
                className="w-8 h-8 flex items-center justify-center rounded-xl bg-[#7c3aed] text-white transition-all disabled:opacity-30 hover:bg-[#6d28d9] shrink-0"
              >
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        )}

        {/* ── Sidebar Footer ───────────────────────────────────────────────── */}
        <div className="px-5 py-3 shrink-0 flex items-center justify-between" style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
          <span className="text-[11px] text-slate-500 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            Draft tersimpan otomatis
          </span>
          <span className="text-[11px] text-slate-500">
            {new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })} WIB
          </span>
        </div>
      </div>

      {/* ══ RIGHT: Browser Preview ════════════════════════════════════════════ */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden bg-[#0d0f14]">

        {/* ── Browser Top Bar ──────────────────────────────────────────────── */}
        <div className="h-12 flex items-center px-4 gap-3 shrink-0" style={{ background: "#111318", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
          {/* Tab favicon + url */}
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div className="w-4 h-4 rounded-sm bg-emerald-500 shrink-0 flex items-center justify-center">
              <span className="text-[7px] text-white font-bold">W</span>
            </div>
            <div className="flex items-center gap-1.5 rounded-lg px-3 py-1 flex-1 max-w-xs" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <div className={`w-2 h-2 rounded-full shrink-0 transition-colors duration-500 ${businessName ? "bg-emerald-400" : "bg-slate-600"}`} />
              <span className="text-xs text-slate-400 truncate font-medium transition-all duration-300">
                {businessName
                  ? `${businessName.toLowerCase().replace(/[^a-z0-9]/g, "")}.webjoz.com`
                  : "preview.webjoz.com"}
              </span>
              {previewState === "loading" && (
                <span className="ml-auto text-[10px] font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 rounded-full shrink-0">
                  Draft Preview
                </span>
              )}
              {previewState === "result" && (
                <span className="ml-auto text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded-full shrink-0">
                  Live Preview
                </span>
              )}
            </div>
          </div>

          {/* Right browser controls */}
          <div className="flex items-center gap-2 shrink-0">
            {previewState === "result" && (
              <button
                onClick={handleGoToEditor}
                className="flex items-center gap-1.5 px-4 py-1.5 bg-gradient-to-r from-[#7c3aed] to-violet-600 text-white text-xs font-bold rounded-lg shadow-md hover:shadow-lg transition-all"
              >
                <Pencil className="w-3 h-3" />
                Pratinjau Penuh ↗
              </button>
            )}
          </div>
        </div>

        {/* ── Browser Content Area ─────────────────────────────────────────── */}
        <div className="flex-1 overflow-hidden relative bg-white">

          {/* Wireframe state — reacts to user input with subtle animations */}
          {previewState === "wireframe" && (
            <div className="h-full overflow-y-auto p-8" style={{ background: "#0d0f14" }}>
              <div className="max-w-3xl mx-auto">
                {/* Header skeleton — shows brand name when filled */}
                <header className="flex justify-between items-center pb-6 mb-10" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                  <div className="flex items-center gap-3">
                    {businessName ? (
                      <div
                        className="h-7 px-3 flex items-center rounded-md text-sm font-bold text-white animate-in fade-in slide-in-from-left-2 duration-400"
                        style={{ background: "rgba(124,58,237,0.25)", border: "1px solid rgba(124,58,237,0.4)" }}
                      >
                        {businessName}
                      </div>
                    ) : (
                      <div className="h-7 w-28 rounded-md animate-pulse" style={skeletonStrong} />
                    )}
                  </div>
                  <div className="flex gap-4 items-center">
                    {businessType ? (
                      <div className="flex gap-2 items-center animate-in fade-in duration-400">
                        {["Tentang", "Keunggulan", "Kontak"].map(l => (
                          <span key={l} className="text-[11px] text-slate-500">{l}</span>
                        ))}
                      </div>
                    ) : (
                      <>
                        <div className="h-4 w-14 rounded animate-pulse" style={skeletonSoft} />
                        <div className="h-4 w-14 rounded animate-pulse" style={skeletonSoft} />
                        <div className="h-4 w-14 rounded animate-pulse" style={skeletonSoft} />
                      </>
                    )}
                    <div className="h-8 w-24 rounded-md animate-pulse" style={skeletonStrong} />
                  </div>
                </header>

                {/* Hero skeleton — reacts to each step */}
                <section
                  className="relative rounded-2xl overflow-hidden mb-10 transition-all duration-500"
                  style={{
                    ...skeletonPanel,
                    height: 260,
                    border: chatStage === "advantage" || chatStage === "mood" || chatStage === "whatsapp" || chatStage === "done"
                      ? "1px solid rgba(124,58,237,0.35)"
                      : "1px solid rgba(255,255,255,0.055)",
                    boxShadow: chatStage === "done" ? "0 0 30px rgba(124,58,237,0.15)" : "none",
                  }}
                >
                  <div className="absolute inset-0 flex flex-col justify-center px-12 gap-4">
                    {/* Business type badge */}
                    {businessType ? (
                      <div
                        className="h-5 w-fit px-3 flex items-center rounded-full text-[10px] font-bold uppercase tracking-widest animate-in fade-in duration-400"
                        style={{ background: "rgba(124,58,237,0.2)", color: "#a78bfa", border: "1px solid rgba(124,58,237,0.3)" }}
                      >
                        {businessType}
                      </div>
                    ) : (
                      <div className="h-5 w-20 rounded-full animate-pulse" style={skeletonStrong} />
                    )}

                    {/* Headline area */}
                    <div className="space-y-2">
                      {businessName ? (
                        <div
                          className="h-10 px-3 flex items-center rounded-lg text-white font-black text-xl animate-in fade-in slide-in-from-bottom-2 duration-500"
                          style={{ background: "rgba(255,255,255,0.06)" }}
                        >
                          {businessName}
                        </div>
                      ) : (
                        <div className="h-10 w-3/4 rounded-lg animate-pulse" style={skeletonStrong} />
                      )}
                      {description ? (
                        <div
                          className="h-6 px-3 flex items-center rounded-lg text-slate-300 text-xs animate-in fade-in duration-500"
                          style={{ background: "rgba(255,255,255,0.04)" }}
                        >
                          <span className="truncate">{description.slice(0, 60)}{description.length > 60 ? "..." : ""}</span>
                        </div>
                      ) : (
                        <div className="h-10 w-1/2 rounded-lg animate-pulse" style={skeletonStrong} />
                      )}
                    </div>

                    <div className="h-5 w-2/3 rounded-full animate-pulse" style={skeletonSoft} />

                    {/* CTA button — shows mood color when mood selected */}
                    <div
                      className="h-11 w-36 rounded-lg flex items-center justify-center text-xs font-bold transition-all duration-500"
                      style={mood
                        ? { background: "rgba(124,58,237,0.7)", color: "#fff", border: "1px solid rgba(124,58,237,0.8)" }
                        : { ...skeletonStrong }
                      }
                    >
                      {mood ? "Pesan Sekarang →" : ""}
                    </div>
                  </div>
                  <div className="absolute right-0 inset-y-0 w-2/5" style={skeletonSubtle} />
                </section>

                {/* Benefits skeleton — reacts when advantage submitted */}
                <section className="grid grid-cols-4 gap-4 mb-10">
                  {[0, 1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className={`p-4 rounded-xl space-y-3 transition-all duration-300 ${description && i === 0 ? "ring-1 ring-violet-500/30" : ""}`}
                      style={{
                        ...skeletonPanel,
                        animationDelay: `${i * 80}ms`,
                      }}
                    >
                      <div className="w-8 h-8 rounded-full animate-pulse" style={skeletonStrong} />
                      <div className="h-3 w-3/4 rounded animate-pulse" style={skeletonStrong} />
                      <div className="h-2 w-full rounded animate-pulse" style={skeletonSoft} />
                    </div>
                  ))}
                </section>

                {/* About skeleton */}
                <section className="flex gap-8 items-center p-8 rounded-xl" style={skeletonPanel}>
                  <div className="flex-1 space-y-4">
                    <div className="h-7 w-3/4 rounded-md animate-pulse" style={skeletonStrong} />
                    <div className="h-3 w-full rounded animate-pulse" style={skeletonSoft} />
                    <div className="h-3 w-5/6 rounded animate-pulse" style={skeletonSoft} />
                    <div className="h-3 w-4/6 rounded animate-pulse" style={skeletonSoft} />
                  </div>
                  <div className="w-40 h-40 rounded-xl shrink-0 animate-pulse" style={skeletonSoft} />
                </section>

                {/* Scanning line effect when stage changes */}
                {(chatStage === "advantage" || chatStage === "mood" || chatStage === "whatsapp") && (
                  <div className="mt-6 flex items-center gap-2 text-[11px] text-violet-400/70">
                    <div className="w-2 h-2 rounded-full bg-violet-500 animate-pulse" />
                    <span>AI sedang mempersiapkan desain untuk {businessName || "bisnis Anda"}...</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Loading state */}
          {previewState === "loading" && (
            <div className="h-full relative flex flex-col overflow-hidden">
              {/* Blurred background preview */}
              <div className="flex-1 overflow-y-auto p-8 filter blur-[8px] opacity-30 select-none pointer-events-none" style={{ background: "#0d0f14" }}>
                <div className="max-w-3xl mx-auto">
                  <header className="flex justify-between items-center pb-6 border-b border-slate-200 mb-10">
                    <div>
                      <div className="h-5 font-bold text-slate-700 text-lg">{businessName || "TB Simatupang"}</div>
                      <div className="h-3 text-slate-400 text-xs">Toko Bahan Bangunan</div>
                    </div>
                    <div className="flex gap-4 items-center">
                      {["Beranda", "Produk", "Tentang", "Layanan", "Kontak"].map(l => (
                        <span key={l} className="text-xs text-slate-600">{l}</span>
                      ))}
                      <div className="h-9 w-28 bg-yellow-500 rounded-xl flex items-center justify-center text-white text-xs font-bold px-4">
                        Hubungi Kami
                      </div>
                    </div>
                  </header>
                  <section className="relative rounded-3xl overflow-hidden mb-10 bg-gradient-to-br from-slate-700 to-slate-900" style={{ height: 300 }}>
                    <div className="absolute inset-0 flex flex-col justify-center px-12 gap-4 text-white">
                      <h1 className="text-3xl font-extrabold">Solusi Material Bangunan Terpercaya</h1>
                      <p className="text-slate-300 text-sm max-w-sm">Menyediakan bahan bangunan berkualitas untuk rumah dan proyek Anda.</p>
                      <div className="h-11 w-40 bg-yellow-500 rounded-xl flex items-center justify-center text-white text-sm font-bold">
                        Hubungi Kami
                      </div>
                    </div>
                  </section>
                </div>
              </div>

              {/* Floating modal overlay */}
              <div className="absolute inset-0 z-30 flex items-center justify-end pr-8">
                <div className="backdrop-blur-xl rounded-3xl w-full max-w-sm p-7 shadow-2xl flex flex-col gap-5 animate-in slide-in-from-right-4 zoom-in-95 duration-500" style={{ background: "rgba(17,19,24,0.97)", border: "1px solid rgba(255,255,255,0.1)" }}>

                  {/* Modal header */}
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#7c3aed] to-indigo-600 flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h3 className="text-sm font-extrabold text-white m-0 leading-tight">
                        AI sedang membangun website Anda ✨
                      </h3>
                      <p className="text-[11px] text-slate-400 mt-0.5">Mohon tunggu sebentar...</p>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="h-2.5 rounded-full overflow-hidden flex-1 mr-3" style={{ background: "rgba(255,255,255,0.06)" }}>
                        <div
                          className="h-full bg-gradient-to-r from-[#7c3aed] to-[#38bdf8] transition-all duration-1000 ease-out rounded-full"
                          style={{ width: `${getModalProgressPercent()}%` }}
                        />
                      </div>
                      <span className="text-xs font-bold text-[#7c3aed] shrink-0">{getModalProgressPercent()}%</span>
                    </div>
                  </div>

                  {/* Checklist items */}
                  <div className="space-y-3">
                    {[
                      { label: "Analisis bisnis", desc: "Memahami jenis bisnis dan target pasar Anda", idx: 0 },
                      { label: "Menentukan layout", desc: "Memilih struktur halaman yang paling efektif", idx: 1 },
                      { label: "Menulis headline", desc: "Membuat copywriting yang menarik", idx: 2 },
                      { label: "Membuat SEO", desc: "Optimasi SEO on-page & keyword", idx: 3 },
                      { label: "Mendesain halaman", desc: "Menyusun desain & komponen halaman", idx: 4 },
                      { label: "Publish website", desc: "Mempersiapkan hosting & domain", idx: 5 },
                    ].map(({ label, desc, idx }) => {
                      const done = loadingStep > idx;
                      const active = loadingStep === idx;
                      return (
                        <div key={idx} className={`flex items-start gap-3 transition-all duration-300 ${done ? "opacity-100" : active ? "opacity-100" : "opacity-40"}`}>
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all duration-300 ${done ? "border-[#7c3aed] bg-[#7c3aed]" : active ? "border-[#7c3aed]" : "border-slate-700"
                            }`} style={!done ? { background: "rgba(255,255,255,0.04)" } : {}}>
                            {done ? (
                              <span className="text-white text-[10px] font-bold">✓</span>
                            ) : active ? (
                              <Loader2 className="w-2.5 h-2.5 text-[#7c3aed] animate-spin" />
                            ) : null}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className={`text-xs font-semibold leading-tight ${done ? "text-slate-200" : active ? "text-[#7c3aed]" : "text-slate-600"}`}>
                              {label}
                            </div>
                            <div className="text-[10px] text-slate-600 leading-tight mt-0.5">{desc}</div>
                          </div>
                          <div className={`text-[10px] font-mono shrink-0 mt-0.5 ${active ? "text-[#7c3aed]" : "text-slate-300"}`}>
                            {active ? `00:${String(idx + 3).padStart(2, "0")}` : done ? `00:0${idx + 3}` : "00:00"}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* AI Insight footer */}
                  {loadingStep >= 3 && (
                    <div className="rounded-2xl p-3.5 animate-in fade-in duration-500" style={{ background: "rgba(124,58,237,0.08)", border: "1px solid rgba(124,58,237,0.2)" }}>
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <Sparkles className="w-3 h-3 text-[#7c3aed]" />
                        <span className="text-[11px] font-bold text-violet-400">AI Insight</span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        {businessType === "Kuliner"
                          ? "Website dengan foto makanan berkualitas tinggi meningkatkan konversi 3x lebih besar."
                          : businessType === "Toko & UMKM"
                            ? "Website dengan tone modern memiliki konversi lebih tinggi untuk bisnis toko & UMKM."
                            : businessType === "Jasa"
                              ? "Website dengan portofolio & testimoni nyata meningkatkan kepercayaan calon klien secara signifikan."
                              : "Website profesional dengan profil perusahaan yang kuat mempercepat kepercayaan klien korporat."}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Result state */}
          {previewState === "result" && previewData && (
            <div className="h-full flex flex-col overflow-hidden">
              <div className="flex-1 overflow-y-auto">
                <TemplateDynamicWithCart
                  content={buildFullContent(previewData, businessName, businessType, description, whatsapp) as any}
                  design_token={previewData.design_token as any}
                  previewMode={true}
                />
              </div>

              {/* CTA strip at bottom */}
              <div className="shrink-0 px-6 py-4 flex items-center justify-between gap-4" style={{ background: "#111318", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
                <div className="flex items-center gap-2 min-w-0">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <p className="text-xs font-semibold text-slate-300 truncate">
                    Website <strong className="text-white">{businessName}</strong> sudah selesai dibuat!
                  </p>
                </div>
                <button
                  onClick={handleGoToEditor}
                  className="shrink-0 flex items-center gap-2 py-2.5 px-5 rounded-xl text-white text-xs font-bold shadow-md transition-all whitespace-nowrap"
                  style={{ background: "linear-gradient(135deg, #7c3aed, #5b21b6)", boxShadow: "0 4px 20px rgba(124,58,237,0.35)" }}
                >
                  <Pencil className="w-3.5 h-3.5" />
                  Kustomisasi & Publish →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}