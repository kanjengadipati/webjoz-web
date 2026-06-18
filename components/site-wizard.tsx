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
import {
  TemplateDynamicWithCart,
  TemplateKuliner,
  TemplateJasa,
  TemplateProduk,
  TemplateElegant,
  TemplateNatural,
  TemplateColorful,
  TemplateMinimalist,
  TemplateBold,
  type TemplateProps,
} from "@/components/templates";
import { useGenerateStream } from "@/hooks/use-generate-stream";
import type { StreamSection } from "@/hooks/use-generate-stream";
import { buildFullContent } from "@/lib/build-full-content";

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
  template_id?: string;
};

// ─── Template selection (mirrors backend autoSelectTemplate) ─────────────────
function extractKeyPhrase(sentence: string): string {
  // Strip filler words, keep core concept (max 4 words)
  const filler = /\b(yang|dengan|untuk|dari|dan|atau|ini|itu|kami|anda|setiap|selalu|semua|sangat|lebih|juga|sudah|akan|ada|tidak|bisa|paling|agar|di|ke|pada|dalam|oleh|adalah|sebagai|serta|karena|sehingga|tanpa|namun|jadi|telah)\b/gi;
  const cleaned = sentence.replace(filler, ' ').replace(/\s+/g, ' ').trim();
  const words = cleaned.split(' ').filter(w => w.length > 2);
  return words.slice(0, 4).join(' ');
}

function selectTemplate(businessType: string, mood: string): string {
  const lower = businessType.toLowerCase();
  const lm = mood.toLowerCase();

  // Mood overrides (highest priority)
  if (lm.includes("elegan") || lm.includes("mewah")) return "TEMPLATE_ELEGANT";
  if (lm.includes("natural") || lm.includes("hangat")) return "TEMPLATE_NATURAL";
  if (lm.includes("fun") || lm.includes("colorful") || lm.includes("playful")) return "TEMPLATE_COLORFUL";
  if (lm.includes("bold") || lm.includes("tegas")) return "TEMPLATE_BOLD";
  if (lm.includes("modern") || lm.includes("minimalis")) {
    const isJasaType = lower.includes("jasa") || lower.includes("konsultan") || lower.includes("company") ||
      lower.includes("fotografer") || lower.includes("properti") || lower.includes("konstruksi") ||
      lower.includes("pendidikan");
    return isJasaType ? "TEMPLATE_MINIMALIST" : "TEMPLATE_COLORFUL";
  }

  // Business type mapping
  if (lower.includes("kafe") || lower.includes("cafe") || lower.includes("kopi") ||
    lower.includes("restoran") || lower.includes("warung") || lower.includes("bakery") ||
    lower.includes("catering") || lower.includes("kuliner")) return "TEMPLATE_KULINER01";
  if (lower.includes("jasa") || lower.includes("konsultan") || lower.includes("agensi") ||
    lower.includes("fotografer") || lower.includes("klinik") || lower.includes("dokter")) return "TEMPLATE_JASA02";
  if (lower.includes("produk") || lower.includes("toko") || lower.includes("retail") ||
    lower.includes("fashion") || lower.includes("elektronik") || lower.includes("umkm") ||
    lower.includes("online") || lower.includes("minuman") || lower.includes("bubble") ||
    lower.includes("boba")) return "TEMPLATE_PRODUK03";
  if (lower.includes("properti") || lower.includes("konstruksi") || lower.includes("hotel") ||
    lower.includes("travel") || lower.includes("pendidikan") || lower.includes("manufaktur")) return "TEMPLATE_JASA02";

  return "TEMPLATE_DYNAMIC";
}

// Returns a rotation of different templates on re-generate so user sees real layout variety.
// regenCount=0 → primary selection, 1→ alt1, 2→alt2, cycles back.
function selectAlternateTemplate(businessType: string, mood: string, regenCount: number): string {
  const primary = selectTemplate(businessType, mood);
  // Build a pool of all 8 templates, put primary first, then rotate
  const all = [
    "TEMPLATE_KULINER01",
    "TEMPLATE_JASA02",
    "TEMPLATE_PRODUK03",
    "TEMPLATE_DYNAMIC",
    "TEMPLATE_ELEGANT",
    "TEMPLATE_NATURAL",
    "TEMPLATE_COLORFUL",
    "TEMPLATE_MINIMALIST",
  ];
  // Remove primary from pool so it doesn't repeat on regen=1
  const others = all.filter(t => t !== primary);
  if (regenCount === 0) return primary;
  // Cycle through the others
  return others[(regenCount - 1) % others.length];
}

function getTemplateComponent(templateId: string): React.ComponentType<TemplateProps> {
  switch (templateId) {
    case "TEMPLATE_KULINER01": return TemplateKuliner;
    case "TEMPLATE_JASA02": return TemplateJasa;
    case "TEMPLATE_PRODUK03": return TemplateProduk;
    case "TEMPLATE_ELEGANT": return TemplateElegant;
    case "TEMPLATE_NATURAL": return TemplateNatural;
    case "TEMPLATE_COLORFUL": return TemplateColorful;
    case "TEMPLATE_MINIMALIST": return TemplateMinimalist;
    case "TEMPLATE_BOLD": return TemplateBold;
    default: return TemplateDynamicWithCart;
  }
}

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

const SUB_TYPES: Record<string, Array<{ value: string; emoji: string; label: string }>> = {
  "Kuliner": [
    { value: "Restoran", emoji: "🍛", label: "Restoran" },
    { value: "Kafe", emoji: "☕", label: "Kafe" },
    { value: "Bakery & Pastry", emoji: "🥐", label: "Bakery" },
    { value: "Catering", emoji: "🍱", label: "Catering" },
    { value: "Warung Makan", emoji: "🥘", label: "Warung Makan" },
    { value: "Minuman & Bubble Tea", emoji: "🧋", label: "Minuman" },
  ],
  "Toko & UMKM": [
    { value: "Fashion & Pakaian", emoji: "👗", label: "Fashion" },
    { value: "Elektronik", emoji: "📱", label: "Elektronik" },
    { value: "Produk Lokal Handmade", emoji: "🧺", label: "Handmade" },
    { value: "Toko Online", emoji: "🛒", label: "Toko Online" },
    { value: "Minimarket", emoji: "🏪", label: "Minimarket" },
    { value: "Perabot & Furnitur", emoji: "🪑", label: "Furnitur" },
  ],
  "Jasa": [
    { value: "Salon & Kecantikan", emoji: "💄", label: "Salon" },
    { value: "Barbershop", emoji: "✂️", label: "Barbershop" },
    { value: "Laundry", emoji: "🧺", label: "Laundry" },
    { value: "Otomotif & Bengkel", emoji: "🔧", label: "Bengkel" },
    { value: "Klinik & Kesehatan", emoji: "🏥", label: "Klinik" },
    { value: "Konsultan", emoji: "📊", label: "Konsultan" },
    { value: "Fotografer", emoji: "📷", label: "Fotografer" },
  ],
  "Company": [
    { value: "Properti & Real Estate", emoji: "🏠", label: "Properti" },
    { value: "Konstruksi", emoji: "🏗️", label: "Konstruksi" },
    { value: "Pendidikan & Kursus", emoji: "📚", label: "Pendidikan" },
    { value: "Travel & Wisata", emoji: "✈️", label: "Travel" },
    { value: "Hotel & Penginapan", emoji: "🏨", label: "Hotel" },
    { value: "Manufaktur", emoji: "🏭", label: "Manufaktur" },
  ],
};

const MOODS = [
  { value: "Profesional", emoji: "🎯", desc: "Serius & terpercaya" },
  { value: "Modern & Minimalis", emoji: "⚡", desc: "Clean & elegan" },
  { value: "Fun & Colorful", emoji: "🎨", desc: "Ceria & energik" },
  { value: "Elegan & Mewah", emoji: "👑", desc: "Premium & eksklusif" },
  { value: "Natural & Hangat", emoji: "🌿", desc: "Earthy & ramah" },
  { value: "Bold & Tegas", emoji: "🔥", desc: "Kuat & impactful" },
];

const ADVANTAGE_SUGGESTIONS: Record<string, string[]> = {
  // Broad types
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
  // Sub-types — Kuliner
  "Restoran": [
    "Resep autentik yang tidak berubah sejak pertama kali buka.",
    "Bahan segar dari supplier pilihan, dimasak setiap hari.",
    "Suasana hangat untuk makan bersama keluarga atau rekan bisnis.",
  ],
  "Kafe": [
    "Single origin beans pilihan, diseduh dengan metode yang tepat.",
    "Tempat kerja dan ngobrol yang nyaman dengan WiFi cepat.",
    "Menu minuman unik yang tidak ada di tempat lain.",
  ],
  "Bakery & Pastry": [
    "Dipanggang setiap pagi — tidak ada produk dari hari sebelumnya.",
    "Bahan-bahan premium: butter asli, tepung pilihan, tanpa pengawet.",
    "Menerima custom order untuk acara dan hampers.",
  ],
  "Catering": [
    "Menu bisa disesuaikan dengan selera dan budget acara Anda.",
    "Tim terlatih untuk acara dari 20 orang hingga ribuan tamu.",
    "Kebersihan dan keamanan pangan jadi prioritas utama.",
  ],
  "Warung Makan": [
    "Masakan rumahan yang terasa seperti dimasak sendiri.",
    "Harga terjangkau dengan porsi yang mengenyangkan.",
    "Buka setiap hari, cocok untuk sarapan sampai makan malam.",
  ],
  "Minuman & Bubble Tea": [
    "Bahan premium: teh asli, susu segar, tanpa sirup murahan.",
    "Ratusan variasi rasa dan level kemanisan sesuai selera.",
    "Sistem antrian digital yang membuat proses order lebih cepat.",
  ],
  // Sub-types — Toko & UMKM
  "Fashion & Pakaian": [
    "Desain eksklusif yang tidak dijual di toko lain.",
    "Ukuran lengkap dari S hingga XL, bisa custom ukuran.",
    "Material berkualitas yang nyaman dipakai seharian.",
  ],
  "Elektronik": [
    "Produk bergaransi resmi, bukan barang rekondisi.",
    "Teknisi tersedia untuk instalasi dan konsultasi teknis.",
    "Harga transparan, tidak ada biaya tersembunyi.",
  ],
  "Produk Lokal Handmade": [
    "Setiap produk dibuat tangan — tidak ada dua yang sama persis.",
    "Bahan lokal berkelanjutan yang mendukung pengrajin setempat.",
    "Bisa custom nama, warna, atau ukuran sesuai permintaan.",
  ],
  "Toko Online": [
    "Pengiriman ke seluruh Indonesia dalam 1-2 hari kerja.",
    "Foto produk akurat, tidak ada perbedaan dengan aslinya.",
    "Proses komplain dan return yang mudah tanpa ribet.",
  ],
  "Minimarket": [
    "Stok lengkap, jarang kosong, buka dari pagi hingga malam.",
    "Harga bersaing dengan minimarket besar, tanpa antrian panjang.",
    "Lokasi strategis dan mudah dijangkau dari mana saja.",
  ],
  "Perabot & Furnitur": [
    "Dibuat dari kayu solid pilihan, bukan partikel board.",
    "Desain bisa dikustomisasi sesuai ukuran dan selera ruangan.",
    "Pengiriman dan pemasangan termasuk dalam harga.",
  ],
  // Sub-types — Jasa
  "Salon & Kecantikan": [
    "Stylist berpengalaman yang memahami karakter rambut Anda.",
    "Produk perawatan premium yang tidak merusak rambut.",
    "Sistem booking online yang mudah, tidak perlu antri lama.",
  ],
  "Barbershop": [
    "Barber bersertifikat dengan teknik cutting terkini.",
    "Suasana maskulin yang nyaman, dilengkapi WiFi dan minuman.",
    "Booking slot tersedia online, tidak perlu datang duluan.",
  ],
  "Laundry": [
    "Pakaian bersih, harum, dan dilipat rapi — siap pakai langsung.",
    "Antar-jemput tersedia, tidak perlu keluar rumah.",
    "Mesin cuci modern yang aman untuk semua jenis kain.",
  ],
  "Otomotif & Bengkel": [
    "Mekanik bersertifikat dengan pengalaman lebih dari 5 tahun.",
    "Harga transparan — estimasi diberikan sebelum pengerjaan dimulai.",
    "Spare part original, tidak ada barang KW tanpa persetujuan.",
  ],
  "Klinik & Kesehatan": [
    "Dokter berpengalaman dengan jadwal yang fleksibel.",
    "Alat diagnostik modern untuk hasil pemeriksaan yang akurat.",
    "Antrian teratur, tidak ada waktu tunggu yang berlebihan.",
  ],
  "Konsultan": [
    "Analisis mendalam sebelum memberikan rekomendasi.",
    "Laporan yang jelas dan bisa langsung diimplementasikan.",
    "Tersedia untuk sesi tindak lanjut setelah konsultasi selesai.",
  ],
  "Fotografer": [
    "Editing profesional — hasil foto siap pakai dalam 3 hari kerja.",
    "Memahami momen — tidak perlu banyak arahan untuk hasil terbaik.",
    "Paket fleksibel untuk berbagai jenis acara dan kebutuhan.",
  ],
  // Sub-types — Company
  "Properti & Real Estate": [
    "Database properti terlengkap di area yang kami layani.",
    "Agen bersertifikat dengan pengetahuan pasar yang mendalam.",
    "Proses legal yang transparan dan pendampingan sampai akad.",
  ],
  "Konstruksi": [
    "RAB detail dan transparan sebelum proyek dimulai.",
    "Tim arsitek dan kontraktor berpengalaman dalam satu atap.",
    "Garansi pengerjaan — kami perbaiki jika ada yang kurang.",
  ],
  "Pendidikan & Kursus": [
    "Kurikulum berbasis industri, bukan sekadar teori.",
    "Instruktur praktisi yang masih aktif di bidangnya.",
    "Program mentoring hingga peserta benar-benar bisa mandiri.",
  ],
  "Travel & Wisata": [
    "Itinerari yang fleksibel — bisa disesuaikan kapan saja.",
    "Pemandu lokal berpengalaman yang tahu tempat terbaik.",
    "All-inclusive yang jelas, tidak ada biaya kejutan di perjalanan.",
  ],
  "Hotel & Penginapan": [
    "Kamar bersih dan nyaman dengan standar hotel yang ketat.",
    "Sarapan buatan sendiri — bukan dari paket frozen.",
    "Lokasi strategis dekat pusat kota atau objek wisata utama.",
  ],
  "Manufaktur": [
    "Kapasitas produksi yang bisa disesuaikan dengan kebutuhan order.",
    "Quality control ketat di setiap tahap produksi.",
    "Lead time yang konsisten dan bisa diprediksi.",
  ],
};

// preserveUserBrand & buildFullContent dipindah ke lib/build-full-content.ts
// supaya bisa dipakai juga di app/create/page.tsx (auto-save setelah login),
// bukan cuma di preview wizard ini.

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
  const [chatStage, setChatStage] = useState<"name" | "type" | "advantage" | "mood" | "whatsapp" | "location" | "confirm" | "done">("name");
  // Stage order: name → type → advantage → mood → whatsapp → location → done
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
  const subTypeRef = useRef<HTMLDivElement>(null);
  const isInitialTyping = chatStage === "name" && initialWordCount < INITIAL_MESSAGE_WORDS.length;

  const getProgressPercentage = () => {
    switch (chatStage) {
      case "name": return 18;
      case "type": return 34;
      case "advantage": return 52;
      case "mood": return 68;
      case "whatsapp": return 82;
      case "location": return 88;
      case "confirm": return 96;
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
      case "location": return 6;
      case "confirm": return 6;
      case "done": return 6;
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
  const [businessSubType, setBusinessSubType] = useState("");
  const [description, setDescription] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [location, setLocation] = useState("");
  // Confirm stage inline-edit state (hoisted to avoid Rules of Hooks violation)
  const [confirmEditingField, setConfirmEditingField] = useState<string | null>(null);
  const [confirmDraftName, setConfirmDraftName] = useState("");
  const [confirmDraftWA, setConfirmDraftWA] = useState("");
  const [confirmDraftLocation, setConfirmDraftLocation] = useState("");
  const [mood, setMood] = useState("");
  const [matra, setMatra] = useState("");
  const [selectedAdvantages, setSelectedAdvantages] = useState<string[]>([]);

  // Right panel state: wireframe → loading → result
  const [previewState, setPreviewState] = useState<"wireframe" | "loading" | "result">("wireframe");
  const [previewData, setPreviewData] = useState<PreviewData | null>(null);
  const [streamedSections, setStreamedSections] = useState<Record<string, any>>({});
  const [streamedDesignToken, setStreamedDesignToken] = useState<Record<string, any> | null>(null);
  const [streamedTemplateId, setStreamedTemplateId] = useState<string>("");
  const [arrivedSections, setArrivedSections] = useState<StreamSection[]>([]);
  const [regenCount, setRegenCount] = useState(0);
  const [hasUnsavedEdits, setHasUnsavedEdits] = useState(false);
  // History for undo/redo — stores up to 5 past previews
  const [previewHistory, setPreviewHistory] = useState<PreviewData[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

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
  const streamedSectionsRef = useRef<Record<string, any>>({});
  useEffect(() => { streamedSectionsRef.current = streamedSections; }, [streamedSections]);
  const streamedTokenRef = useRef<Record<string, any> | null>(null);
  useEffect(() => { streamedTokenRef.current = streamedDesignToken; }, [streamedDesignToken]);

  const { startStream, cancelStream } = useGenerateStream({
    onDesignToken: (token) => {
      setStreamedDesignToken(token);
    },
    onSection: (section, data) => {
      setStreamedSections((prev) => ({ ...prev, [section]: data }));
      setArrivedSections((prev) => prev.includes(section) ? prev : [...prev, section]);
      if (section === "hero") {
        setPreviewState("result");
      }
    },
    onDone: (templateId, _qualityScore) => {
      setStreamedTemplateId(templateId);
      // Streaming: commit directly to previewData without waiting for loadingStep gate
      const finalContent = streamedSectionsRef.current;
      const finalToken = streamedTokenRef.current ?? {};
      const mergedPreview: PreviewData = {
        content: Object.keys(finalContent).length > 0 ? finalContent : {},
        design_token: finalToken,
        template_id: templateId,
      };
      setPreviewHistory((prev) => {
        const base = prev; // historyIndex handled below
        const next = [...base, mergedPreview].slice(-5);
        setHistoryIndex(next.length - 1);
        return next;
      });
      setPreviewData(mergedPreview);
      setPreviewState("result");
      localStorage.setItem(
        PENDING_KEY,
        JSON.stringify({
          businessName,
          businessType,
          description,
          whatsapp: whatsapp || "",
          location: location || "",
          mood,
          templateId: mergedPreview.template_id,
          previewContent: mergedPreview.content,
          previewDesignToken: mergedPreview.design_token,
        })
      );
    },
    onError: (message) => {
      pushToast(message || "Terjadi kesalahan saat membuat preview.", "error");
      setPreviewState("wireframe");
    },
  });

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
    if (!isInitialTyping && (chatStage === "name" || chatStage === "advantage" || chatStage === "whatsapp" || chatStage === "location")) {
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

  // When chatStage → "done" (legacy path, no longer triggered in normal flow)
  useEffect(() => {
    if (chatStage === "done" && previewState === "wireframe" && mood) {
      setRegenCount(0);
      handleGenerate(businessName, businessType, mood, description, 0);
    }
  }, [chatStage]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Chat handlers ────────────────────────────────────────────────────────

  const handleSendText = (e: React.FormEvent) => {
    e.preventDefault();
    if (isInitialTyping) return;
    if (!inputValue.trim() && chatStage !== "whatsapp" && chatStage !== "location") return;
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
      // WA is optional
      const digits = val.replace(/\D/g, "");
      if (digits) {
        const normalized = digits.startsWith("0") ? "62" + digits.slice(1) : digits;
        setWhatsapp(normalized);
        setMessages((prev) => [...prev, { id: Date.now().toString(), sender: "user", text: val }]);
      } else {
        setMessages((prev) => [...prev, { id: Date.now().toString(), sender: "user", text: "Lewati" }]);
      }
      // Advance to location step
      setTimeout(() => {
        typeMessage("Dimana lokasi bisnis Anda? Ini bantu AI buat konten yang lebih relevan. (opsional)", () => {
          setChatStage("location");
        });
      }, 400);

    } else if (chatStage === "location") {
      // Location is optional
      if (val.trim()) {
        setLocation(val.trim());
        setMessages((prev) => [...prev, { id: Date.now().toString(), sender: "user", text: val }]);
      } else {
        setMessages((prev) => [...prev, { id: Date.now().toString(), sender: "user", text: "Lewati" }]);
      }
      setTimeout(() => {
        // Seed confirm draft state with current values
        setConfirmDraftName(businessName);
        setConfirmDraftWA(whatsapp);
        setConfirmDraftLocation(val.trim() || location);
        setConfirmEditingField(null);
        setChatStage("confirm");
      }, 200);
    }
  };

  const handleSelectType = (type: string) => {
    setBusinessType(type);
    setBusinessSubType(""); // reset sub-type when main type changes
    setSelectedAdvantages([]);
    setInputValue("");
    // Scroll to sub-type section after render
    setTimeout(() => {
      subTypeRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }, 120);
  };

  const handleSelectSubType = (subType: string) => {
    setBusinessSubType(subType);
    setSelectedAdvantages([]);
    setInputValue("");

    const typeContext = subType || businessType;
    const aiResponse = `Bagus! Saya akan membuat website untuk bisnis ${subType} Anda.\n\nCeritakan produk/layanan utama dan keunggulan bisnis Anda:`;

    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), sender: "user", text: subType },
    ]);
    setTimeout(() => {
      typeMessage(aiResponse, () => {
        setMessages((prev) => [
          ...prev,
          { id: `widget-advantage-chips-${Date.now()}`, sender: "ai", text: "", widget: "advantage-chips" },
        ]);
        setChatStage("advantage");
      });
    }, 400);
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
    bDescription = description,
    regen = regenCount
  ) => {
    setStreamedSections({});
    setStreamedDesignToken(null);
    setArrivedSections([]);
    setStreamedTemplateId("");
    setPreviewState("loading");
    setLoadingStep(0);

    const effectiveType = businessSubType || bType;
    const selectedTemplateId = selectAlternateTemplate(effectiveType, bMood, regen);

    const enrichedDesc = [
      businessSubType || bType,
      bDescription,
      selectedAdvantages.length > 0
        ? selectedAdvantages.map((a) => extractKeyPhrase(a)).filter(Boolean).join(", ")
        : null,
      location ? `lokasi ${location}` : null,
    ].filter(Boolean).join(". ");

    localStorage.setItem(
      PENDING_KEY,
      JSON.stringify({
        businessName: bName,
        businessType: bType,
        description: bDescription,
        whatsapp: whatsapp || "",
        location: location || "",
        mood: bMood,
        templateId: selectedTemplateId,
      })
    );

    await startStream({
      business_name: bName,
      business_type: effectiveType,
      description: enrichedDesc,
      whatsapp: whatsapp || "",
      location: location || "",
      mood: bMood,
      template_id: selectedTemplateId,
      selling_points: selectedAdvantages.length > 0 ? selectedAdvantages : undefined,
    });
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
            template_id: previewData?.template_id || selectTemplate(businessSubType || businessType, mood),
            subdomain,
          }),
        },
        token
      );
      if (createRes.status !== "success") throw new Error(createRes.message);
      const siteId = createRes.data.id;

      // 2. Save the existing AI-generated preview content (no second AI call!)
      // PENTING: previewData.content adalah hasil mentah dari AI/stream — bisa
      // saja ada field kosong (AI tidak selalu lengkap). Jalankan buildFullContent
      // dulu supaya yang TERSIMPAN = yang TERLIHAT di preview (brand name, link WA,
      // dan fallback teks lain ikut tersimpan, bukan cuma tampil di memori).
      if (previewData) {
        const enrichedContent = buildFullContent(
          { content: previewData.content },
          businessName,
          businessType,
          description,
          whatsapp
        );
        await request(
          `/sites/${siteId}/content`,
          {
            method: "PUT",
            headers: { "X-Tenant-ID": tenantId.toString() },
            body: JSON.stringify({
              content: enrichedContent,
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

  // Result preview content (extracted from IIFE for Turbopack compat)
  let resultPreviewContent: React.ReactNode = null;

  // Template history navigation (extracted from IIFE for Turbopack compat)
  const TEMPLATE_NAMES: Record<string, string> = {
    "TEMPLATE_KULINER01": "Vista Prime 🍜",
    "TEMPLATE_JASA02": "Elevate One 💼",
    "TEMPLATE_PRODUK03": "Forge Flow 🛍️",
    "TEMPLATE_ELEGANT": "Noir Prestige 👑",
    "TEMPLATE_NATURAL": "Bumi Lestari 🌿",
    "TEMPLATE_COLORFUL": "Pop Riot 🎨",
    "TEMPLATE_MINIMALIST": "White Space ⚡",
    "TEMPLATE_DYNAMIC": "AI Design ✨",
  };
  const currentName = TEMPLATE_NAMES[previewData?.template_id ?? ""] || "Desain ini";
  let historyNavContent: React.ReactNode = null;
  if (previewHistory.length > 1) {
    historyNavContent = (
      <div className="space-y-2.5 pt-1">
        {/* Current template label */}
        <div className="text-center space-y-1">
          <p className="text-[11px] font-semibold" style={{ color: "#a78bfa" }}>{currentName}</p>
          {/* Dot indicators */}
          <div className="flex items-center justify-center gap-1.5">
            {previewHistory.map((_, i) => (
              <button
                key={i}
                onClick={() => { setHistoryIndex(i); setPreviewData(previewHistory[i]); }}
                className="transition-all duration-200"
                style={{
                  width: i === historyIndex ? 20 : 6,
                  height: 6,
                  borderRadius: 9999,
                  background: i === historyIndex ? "#7c3aed" : "rgba(255,255,255,0.18)",
                }}
              />
            ))}
          </div>
        </div>
        {/* Prev / Next arrows */}
        <div className="flex items-center justify-between gap-2">
          <button
            disabled={historyIndex <= 0}
            onClick={() => { const p = historyIndex - 1; setHistoryIndex(p); setPreviewData(previewHistory[p]); }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all disabled:opacity-25 disabled:cursor-not-allowed hover:opacity-80"
            style={{ background: "rgba(255,255,255,0.06)", color: "#94a3b8" }}
          >
            ‹ Desain sebelumnya
          </button>
          <button
            disabled={historyIndex >= previewHistory.length - 1}
            onClick={() => { const n = historyIndex + 1; setHistoryIndex(n); setPreviewData(previewHistory[n]); }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all disabled:opacity-25 disabled:cursor-not-allowed hover:opacity-80"
            style={{ background: "rgba(255,255,255,0.06)", color: "#94a3b8" }}
          >
            Desain berikutnya ›
          </button>
        </div>
      </div>
    );
  }
  if (previewState === "result") {
    // During streaming: use streamedSections + streamedDesignToken as live content
    // After done: use previewData (which has the final merged content)
    const hasLiveData = Object.keys(streamedSections).length > 0;
    const hasPreviewData = !!previewData;
    if (!hasLiveData && !hasPreviewData) {
      // Nothing to show yet — keep resultPreviewContent null
    } else {
      const liveContent = hasLiveData ? streamedSections : previewData!.content;
      const liveToken = streamedDesignToken ?? (hasPreviewData ? previewData!.design_token : {});
      const liveTemplateId = streamedTemplateId || (hasPreviewData ? previewData!.template_id : "") || selectTemplate(businessSubType || businessType, mood);
      const TemplateComponent = getTemplateComponent(liveTemplateId);
      const displayData: PreviewData = { content: liveContent, design_token: liveToken, template_id: liveTemplateId };
      resultPreviewContent = (
        <div className="h-full flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto min-h-0" key={`${liveTemplateId}-${regenCount}`}>
            <TemplateComponent
              content={buildFullContent(displayData, businessName, businessType, description, whatsapp) as any}
              design_token={liveToken as any}
              isEditorMode={false}
            />
          </div>
          {/* CTA strip — only when all sections arrived (done event) */}
          {hasPreviewData && (
          <div className="shrink-0 px-6 py-4 flex items-center justify-between gap-4" style={{ background: "#111318", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
            <div className="flex items-center gap-2 min-w-0">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <p className="text-xs font-semibold text-slate-300 truncate">
                Website <strong className="text-white">{businessName}</strong> sudah selesai dibuat!
              </p>
            </div>
            <button onClick={handleGoToEditor}
              className="shrink-0 flex items-center gap-2 py-2.5 px-5 rounded-xl text-white text-xs font-bold shadow-md transition-all whitespace-nowrap"
              style={{ background: "linear-gradient(135deg, #7c3aed, #5b21b6)", boxShadow: "0 4px 20px rgba(124,58,237,0.35)" }}>
              <Pencil className="w-3.5 h-3.5" />
              Kustomisasi & Publish →
            </button>
          </div>
          )}
        </div>
      );
    }
  }

  // ── Cleanup stream on unmount ────────────────────────────────────────────
  useEffect(() => {
    return () => { cancelStream(); };
  }, [cancelStream]);

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
              Langkah {getStageNumber()} dari 6
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
                const subTypes = businessType ? SUB_TYPES[businessType] : null;
                return (
                  <div key={m.id} className="animate-in fade-in slide-in-from-bottom-2 duration-400 space-y-3">
                    {/* Main type grid */}
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
                            {isSelected && !businessSubType && <span className="text-[9px] font-bold text-[#7c3aed] mt-0.5">✓ Dipilih — pilih jenis di bawah</span>}
                            {isSelected && businessSubType && <span className="text-[9px] font-bold text-emerald-400 mt-0.5">✓ {businessSubType}</span>}
                          </button>
                        );
                      })}
                    </div>

                    {/* Sub-type chips — appears inline after main type selected */}
                    {subTypes && !isLocked && (
                      <div ref={subTypeRef} className="animate-in fade-in slide-in-from-bottom-1 duration-300">
                        <p className="text-[10px] font-semibold text-slate-500 mb-2 px-0.5">Lebih spesifik:</p>
                        <div className="flex flex-wrap gap-1.5">
                          {subTypes.map((st) => {
                            const isSubSelected = businessSubType === st.value;
                            return (
                              <button
                                key={st.value}
                                type="button"
                                onClick={() => !isLocked && handleSelectSubType(st.value)}
                                disabled={isLocked}
                                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer active:scale-95 ${isSubSelected
                                    ? "text-white border-emerald-500/60"
                                    : "text-slate-300 border-white/10 hover:border-violet-400/50 hover:text-white"
                                  }`}
                                style={isSubSelected
                                  ? { background: "rgba(16,185,129,0.2)" }
                                  : { background: "rgba(255,255,255,0.05)" }}
                              >
                                <span>{st.emoji}</span>
                                <span>{st.label}</span>
                                {isSubSelected && <span className="text-emerald-400 text-[10px]">✓</span>}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
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
                      {(ADVANTAGE_SUGGESTIONS[businessSubType] || ADVANTAGE_SUGGESTIONS[businessType] || ADVANTAGE_SUGGESTIONS.Company).map((suggestion) => {
                        const selected = !isLocked && selectedAdvantages.includes(suggestion);
                        return (
                          <button
                            key={suggestion}
                            type="button"
                            disabled={isLocked}
                            onClick={() => !isLocked && toggleAdvantageSuggestion(suggestion)}
                            className={`flex items-start gap-2.5 w-full px-3.5 py-2.5 rounded-xl border text-left text-sm leading-snug transition-all cursor-pointer active:scale-[0.98] ${selected
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
                            <span className={`mt-0.5 flex-shrink-0 w-4 h-4 rounded-full border flex items-center justify-center transition-all ${selected ? "bg-violet-500 border-violet-400" : "border-slate-600"
                              }`}>
                              {selected && (
                                <svg viewBox="0 0 10 8" className="w-2.5 h-2 fill-white">
                                  <path d="M1 4l2.5 2.5L9 1" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
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
                const isLocked = chatStage === "whatsapp" || chatStage === "location" || chatStage === "confirm" || chatStage === "done";
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
                                typeMessage("Hampir selesai! 🎉 Nomor WhatsApp bisnis Anda? Akan dipakai untuk tombol CTA di website. (Opsional — tekan Enter untuk lewati)", () => {
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

          {/* Confirm step — show summary before generating */}
          {chatStage === "confirm" && (() => {
            const editingField = confirmEditingField;
            const setEditingField = setConfirmEditingField;
            const draftName = confirmDraftName;
            const setDraftName = setConfirmDraftName;
            const draftWA = confirmDraftWA;
            const setDraftWA = setConfirmDraftWA;
            const draftLocation = confirmDraftLocation;
            const setDraftLocation = setConfirmDraftLocation;

            const saveField = (field: string) => {
              if (field === "name" && draftName.trim()) { setBusinessName(draftName.trim()); setHasUnsavedEdits(true); }
              if (field === "wa") {
                const digits = draftWA.replace(/\D/g, "");
                setWhatsapp(digits ? (digits.startsWith("0") ? "62" + digits.slice(1) : digits) : "");
                setHasUnsavedEdits(true);
              }
              if (field === "location") { setLocation(draftLocation.trim()); setHasUnsavedEdits(true); }
              setEditingField(null);
            };

            const rowBorder = { borderColor: "rgba(255,255,255,0.06)" };
            const chipActive = { background: "rgba(124,58,237,0.18)", borderColor: "#7c3aed", color: "#a78bfa" };
            const chipDefault = { background: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.1)", color: "#64748b" };
            const editBtn = { color: "#7c3aed", background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.2)" };

            return (
              <div className="flex gap-2.5 justify-start animate-in fade-in slide-in-from-bottom-2 duration-400">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#7c3aed] to-indigo-600 flex items-center justify-center shrink-0 mt-0.5">
                  <Sparkles className="w-3 h-3 text-white" />
                </div>
                <div className="flex-1 min-w-0 rounded-2xl rounded-tl-sm overflow-hidden" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>

                  {/* Header */}
                  <div className="px-3 pt-2.5 pb-1.5 flex items-center justify-between">
                    <p className="text-[11px] font-bold uppercase tracking-widest" style={{ color: "#7c3aed" }}>✓ Cek & ubah sebelum generate</p>
                  </div>

                  {/* ── NAMA ── */}
                  <div className="flex items-center gap-2 px-3 py-1.5 border-t" style={rowBorder}>
                    <span className="text-[10px] font-semibold text-slate-500 shrink-0 w-14">Nama</span>
                    {editingField === "name" ? (
                      <div className="flex items-center gap-1.5 flex-1 min-w-0">
                        <input autoFocus type="text" value={draftName} onChange={(e) => setDraftName(e.target.value)}
                          onKeyDown={(e) => { if (e.key === "Enter") saveField("name"); if (e.key === "Escape") setEditingField(null); }}
                          className="flex-1 min-w-0 bg-transparent border-b text-[12px] text-slate-200 outline-none py-0.5" style={{ borderColor: "#7c3aed" }} />
                        <button onClick={() => saveField("name")} className="text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0" style={{ background: "#7c3aed", color: "#fff" }}>✓</button>
                        <button onClick={() => setEditingField(null)} className="text-[10px] text-slate-500 shrink-0">✕</button>
                      </div>
                    ) : (
                      <>
                        <span className="text-[12px] font-semibold text-white flex-1 truncate">{draftName || businessName}</span>
                        <button type="button" onClick={() => { setDraftName(businessName); setEditingField("name"); }} className="shrink-0 text-[10px] font-semibold px-1.5 py-0.5 rounded" style={editBtn}>Ubah</button>
                      </>
                    )}
                  </div>

                  {/* ── JENIS ── collapsed, expands on Ubah */}
                  <div className="px-3 py-1.5 border-t" style={rowBorder}>
                    {editingField === "type" ? (
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-semibold text-slate-500">Jenis Bisnis</span>
                          <button onClick={() => setEditingField(null)} className="text-[10px] text-slate-500">✕ tutup</button>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {BUSINESS_TYPES.map(t => (
                            <button key={t.value} type="button" onClick={() => { setBusinessType(t.value); setBusinessSubType(""); setHasUnsavedEdits(true); }}
                              className="flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold border transition-all"
                              style={businessType === t.value ? chipActive : chipDefault}>
                              {t.emoji} {t.label}
                            </button>
                          ))}
                        </div>
                        {businessType && SUB_TYPES[businessType] && (
                          <div className="flex flex-wrap gap-1">
                            {SUB_TYPES[businessType].map(st => (
                              <button key={st.value} type="button" onClick={() => { setBusinessSubType(st.value === businessSubType ? "" : st.value); setHasUnsavedEdits(true); }}
                                className="text-[10px] font-semibold px-2 py-0.5 rounded-full border transition-all"
                                style={businessSubType === st.value ? { background: "rgba(52,211,153,0.15)", borderColor: "#34d399", color: "#34d399" } : chipDefault}>
                                {st.emoji} {st.label}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-semibold text-slate-500 shrink-0 w-14">Jenis</span>
                        <span className="text-[12px] text-white flex-1 truncate">
                          {(() => {
                            const typeEmoji = BUSINESS_TYPES.find(t => t.value === businessType)?.emoji ?? "";
                            const subEmoji = businessSubType ? (SUB_TYPES[businessType]?.find(s => s.value === businessSubType)?.emoji ?? "") : "";
                            const label = [businessType, businessSubType].filter(Boolean).join(" › ");
                            return <>{typeEmoji && <span className="mr-1">{subEmoji || typeEmoji}</span>}{label}</>;
                          })()}
                        </span>
                        <button type="button" onClick={() => setEditingField("type")} className="shrink-0 text-[10px] font-semibold px-1.5 py-0.5 rounded" style={editBtn}>Ubah</button>
                      </div>
                    )}
                  </div>

                  {/* ── GAYA ── collapsed */}
                  <div className="px-3 py-1.5 border-t" style={rowBorder}>
                    {editingField === "mood" ? (
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-semibold text-slate-500">Gaya Visual</span>
                          <button onClick={() => setEditingField(null)} className="text-[10px] text-slate-500">✕ tutup</button>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {MOODS.map(mo => (
                            <button key={mo.value} type="button" onClick={() => { setMood(mo.value); setEditingField(null); setHasUnsavedEdits(true); }}
                              className="flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold border transition-all"
                              style={mood === mo.value ? chipActive : chipDefault}>
                              {mo.emoji} {mo.value}
                            </button>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-semibold text-slate-500 shrink-0 w-14">Gaya</span>
                        <span className="text-[12px] text-white flex-1 truncate">
                          {(() => {
                            const mo = MOODS.find(m => m.value === mood);
                            return <>{mo?.emoji && <span className="mr-1">{mo.emoji}</span>}{mood}</>;
                          })()}
                        </span>
                        <button type="button" onClick={() => setEditingField("mood")} className="shrink-0 text-[10px] font-semibold px-1.5 py-0.5 rounded" style={editBtn}>Ubah</button>
                      </div>
                    )}
                  </div>

                  {/* ── KEUNGGULAN ── collapsed */}
                  <div className="px-3 py-1.5 border-t" style={rowBorder}>
                    {editingField === "adv" ? (
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-semibold text-slate-500">Keunggulan</span>
                          <button onClick={() => setEditingField(null)} className="text-[10px] text-slate-500">✕ tutup</button>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {(ADVANTAGE_SUGGESTIONS[businessSubType] || ADVANTAGE_SUGGESTIONS[businessType] || []).slice(0, 6).map((adv) => {
                            const sel = selectedAdvantages.includes(adv);
                            return (
                              <button key={adv} type="button"
                                onClick={() => { setSelectedAdvantages(prev => sel ? prev.filter(a => a !== adv) : [...prev, adv]); setHasUnsavedEdits(true); }}
                                className="text-[10px] font-semibold px-2 py-0.5 rounded-full border transition-all text-left"
                                style={sel ? chipActive : chipDefault}>
                                {sel ? "✓ " : ""}{adv.slice(0, 28)}{adv.length > 28 ? "…" : ""}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-semibold text-slate-500 shrink-0 w-14">Keunggulan</span>
                        <span className="text-[11px] text-slate-300 flex-1 truncate">
                          {selectedAdvantages.length > 0 ? `${selectedAdvantages.length} dipilih` : <span className="text-slate-600 italic">belum dipilih</span>}
                        </span>
                        <button type="button" onClick={() => setEditingField("adv")} className="shrink-0 text-[10px] font-semibold px-1.5 py-0.5 rounded" style={editBtn}>Ubah</button>
                      </div>
                    )}
                  </div>

                  {/* ── WA ── inline */}
                  <div className="flex items-center gap-2 px-3 py-1.5 border-t" style={rowBorder}>
                    <span className="text-[10px] font-semibold text-slate-500 shrink-0 w-14">WA</span>
                    {editingField === "wa" ? (
                      <div className="flex items-center gap-1.5 flex-1 min-w-0">
                        <input autoFocus type="tel" value={draftWA} onChange={(e) => setDraftWA(e.target.value)}
                          onKeyDown={(e) => { if (e.key === "Enter") saveField("wa"); if (e.key === "Escape") setEditingField(null); }}
                          className="flex-1 min-w-0 bg-transparent border-b text-[12px] text-slate-200 outline-none py-0.5" style={{ borderColor: "#7c3aed" }} />
                        <button onClick={() => saveField("wa")} className="text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0" style={{ background: "#7c3aed", color: "#fff" }}>✓</button>
                        <button onClick={() => setEditingField(null)} className="text-[10px] text-slate-500 shrink-0">✕</button>
                      </div>
                    ) : (
                      <>
                        <span className="text-[12px] text-slate-300 flex-1 truncate">{draftWA || <span className="text-slate-600 italic">—</span>}</span>
                        <button type="button" onClick={() => { setDraftWA(whatsapp); setEditingField("wa"); }} className="shrink-0 text-[10px] font-semibold px-1.5 py-0.5 rounded" style={editBtn}>Ubah</button>
                      </>
                    )}
                  </div>

                  {/* ── LOKASI ── inline */}
                  <div className="flex items-center gap-2 px-3 py-1.5 border-t" style={rowBorder}>
                    <span className="text-[10px] font-semibold text-slate-500 shrink-0 w-14">Lokasi</span>
                    {editingField === "location" ? (
                      <div className="flex items-center gap-1.5 flex-1 min-w-0">
                        <input autoFocus type="text" value={draftLocation} onChange={(e) => setDraftLocation(e.target.value)}
                          onKeyDown={(e) => { if (e.key === "Enter") saveField("location"); if (e.key === "Escape") setEditingField(null); }}
                          className="flex-1 min-w-0 bg-transparent border-b text-[12px] text-slate-200 outline-none py-0.5" style={{ borderColor: "#7c3aed" }} />
                        <button onClick={() => saveField("location")} className="text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0" style={{ background: "#7c3aed", color: "#fff" }}>✓</button>
                        <button onClick={() => setEditingField(null)} className="text-[10px] text-slate-500 shrink-0">✕</button>
                      </div>
                    ) : (
                      <>
                        <span className="text-[12px] text-slate-300 flex-1 truncate">{draftLocation || <span className="text-slate-600 italic">—</span>}</span>
                        <button type="button" onClick={() => { setDraftLocation(location); setEditingField("location"); }} className="shrink-0 text-[10px] font-semibold px-1.5 py-0.5 rounded" style={editBtn}>Ubah</button>
                      </>
                    )}
                  </div>

                  {/* Generate — hidden when result is fresh, shown when edits pending */}
                  {(previewState !== "result" || hasUnsavedEdits) && (
                  <div className="px-3 py-2.5 border-t" style={rowBorder}>
                    <button
                      onClick={() => {
                        if (editingField) return;
                        const nextRegen = previewState === "result" ? regenCount + 1 : 0;
                        setRegenCount(nextRegen);
                        setHasUnsavedEdits(false);
                        handleGenerate(businessName, businessType, mood, description, nextRegen);
                      }}
                      disabled={!!editingField || previewState === "loading"}
                      className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl text-white text-sm font-bold transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-40"
                      style={{ background: hasUnsavedEdits ? "linear-gradient(135deg, #059669, #047857)" : "linear-gradient(135deg, #7c3aed, #5b21b6)", boxShadow: hasUnsavedEdits ? "0 4px 16px rgba(5,150,105,0.3)" : "0 4px 16px rgba(124,58,237,0.3)" }}
                    >
                      <Wand2 className="w-4 h-4" />
                      {editingField ? "Selesai edit dulu ↑"
                        : previewState === "loading" ? "Sedang dibuat..."
                        : hasUnsavedEdits ? "Terapkan & Generate Ulang →"
                        : "Generate Website →"}
                    </button>
                  </div>
                  )}
                </div>
              </div>
            );
          })()}

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

                {/* Template badge */}
                {mood && (() => {
                  const tid = selectAlternateTemplate(businessSubType || businessType, mood, regenCount);
                  const templateNames: Record<string, { name: string; emoji: string }> = {
                    "TEMPLATE_KULINER01": { name: "Vista Prime", emoji: "🍜" },
                    "TEMPLATE_JASA02": { name: "Elevate One", emoji: "💼" },
                    "TEMPLATE_PRODUK03": { name: "Forge Flow", emoji: "🛍️" },
                    "TEMPLATE_ELEGANT": { name: "Noir Prestige", emoji: "👑" },
                    "TEMPLATE_NATURAL": { name: "Bumi Lestari", emoji: "🌿" },
                    "TEMPLATE_COLORFUL": { name: "Pop Riot", emoji: "🎨" },
                    "TEMPLATE_MINIMALIST": { name: "White Space", emoji: "⚡" },
                    "TEMPLATE_DYNAMIC": { name: "AI Design Engine", emoji: "✨" },
                    "TEMPLATE_BOLD": { name: "Fire Force", emoji: "🔥" },
                  };
                  const tpl = templateNames[tid] || { name: tid, emoji: "✨" };
                  return (
                    <div className="flex items-center gap-1.5 pt-1">
                      <span className="text-[10px]" style={{ color: "rgba(148,163,184,0.6)" }}>Template terpilih:</span>
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full"
                        style={{ background: "rgba(124,58,237,0.15)", color: "#a78bfa", border: "1px solid rgba(124,58,237,0.25)" }}>
                        {tpl.emoji} {tpl.name}
                      </span>
                    </div>
                  );
                })()}

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
                  {/* History navigation — shown after 2+ generates */}
                  {historyNavContent}
                  {!hasUnsavedEdits && (
                  <button
                    onClick={() => {
                      const nextRegen = regenCount + 1;
                      setRegenCount(nextRegen);
                      handleGenerate(businessName, businessType, mood, description, nextRegen);
                    }}
                    className="flex items-center justify-center gap-2 w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all hover:opacity-80 active:scale-[0.98]"
                    style={{ background: "rgba(124,58,237,0.12)", border: "1px solid rgba(124,58,237,0.25)", color: "#a78bfa" }}
                  >
                    <Wand2 className="w-3.5 h-3.5" />
                    Generate ulang dengan desain berbeda
                  </button>
                  )}
                </div>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* ── Chat Input ───────────────────────────────────────────────────── */}
        {chatStage !== "type" && chatStage !== "mood" && chatStage !== "done" && chatStage !== "confirm" && (
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
                    : chatStage === "location"
                      ? "cth. Bandung, Yogyakarta, Jl. Malioboro..."
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
                    border: chatStage === "advantage" || chatStage === "mood" || chatStage === "whatsapp" || chatStage === "location" || chatStage === "confirm" || chatStage === "done"
                      ? "1px solid rgba(124,58,237,0.35)"
                      : "1px solid rgba(255,255,255,0.055)",
                    boxShadow: chatStage === "confirm" || chatStage === "done" ? "0 0 30px rgba(124,58,237,0.15)" : "none",
                  }}
                >
                  <div className="absolute inset-0 flex flex-col justify-center px-12 gap-4">
                    {/* Business type badge */}
                    {businessType ? (
                      <div
                        className="h-5 w-fit px-3 flex items-center rounded-full text-[10px] font-bold uppercase tracking-widest animate-in fade-in duration-400"
                        style={{ background: "rgba(124,58,237,0.2)", color: "#a78bfa", border: "1px solid rgba(124,58,237,0.3)" }}
                      >
                        {businessSubType || businessType}
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
                {(chatStage === "advantage" || chatStage === "mood" || chatStage === "whatsapp" || chatStage === "location" || chatStage === "confirm") && (
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
              {/* Blurred dark background — no fake white mockup */}
              <div className="flex-1 overflow-hidden filter blur-[12px] opacity-20 select-none pointer-events-none" style={{ background: "#0d0f14" }}>
                <div className="h-full w-full" style={{ background: "linear-gradient(135deg, #1a1040 0%, #0d0f14 50%, #0a1628 100%)" }}>
                  {/* Abstract shapes for visual depth */}
                  <div className="absolute top-12 left-1/4 w-64 h-64 rounded-full" style={{ background: "radial-gradient(circle, rgba(124,58,237,0.3) 0%, transparent 70%)" }} />
                  <div className="absolute bottom-20 right-1/4 w-80 h-80 rounded-full" style={{ background: "radial-gradient(circle, rgba(56,189,248,0.2) 0%, transparent 70%)" }} />
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
          {resultPreviewContent}
        </div>
      </div>
    </div>
  );
}