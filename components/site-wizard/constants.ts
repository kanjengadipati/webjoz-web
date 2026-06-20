import type { BusinessTypeItem, SubTypeItem } from "./types";

export const PENDING_KEY = "webjoz_pending_wizard_data";

export const INITIAL_MESSAGE = "🤖 Halo! Saya akan membantu membuat website bisnis Anda. Apa nama bisnis Anda?";

export const AI_LOADING_STEPS = [
  "Menganalisis profil bisnis Anda...",
  "Merumuskan headline copywriting yang memikat...",
  "Menyusun cerita brand yang berkesan...",
  "Menyusun deskripsi layanan secara terstruktur...",
  "Merumuskan Pertanyaan Umum (FAQ) pelanggan...",
  "Mengatur optimasi tag metadata SEO...",
  "Memilih palet warna & tipografi yang sempurna...",
  "Merakit layout visual yang menawan...",
];

export const BUSINESS_TYPES: BusinessTypeItem[] = [
  { value: "Kuliner", emoji: "🍜", label: "Kuliner", desc: "Restoran & Cafe" },
  { value: "Toko & UMKM", emoji: "🛍️", label: "Toko & UMKM", desc: "Toko & UMKM" },
  { value: "Jasa", emoji: "💼", label: "Jasa", desc: "Agency" },
  { value: "Company", emoji: "🏢", label: "Company", desc: "Corporate" },
];

export const SUB_TYPES: Record<string, SubTypeItem[]> = {
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

export const TEMPLATE_NAMES: Record<string, string> = {
  "TEMPLATE_KULINER01": "Vista Prime 🍜",
  "TEMPLATE_JASA02": "Elevate One 💼",
  "TEMPLATE_PRODUK03": "Forge Flow 🛍️",
  "TEMPLATE_ELEGANT": "Noir Prestige 👑",
  "TEMPLATE_NATURAL": "Bumi Lestari 🌿",
  "TEMPLATE_COLORFUL": "Pop Riot 🎨",
  "TEMPLATE_MINIMALIST": "White Space ⚡",
  "TEMPLATE_DYNAMIC": "AI Design ✨",
};

export const LOADING_CHECKLIST = [
  { label: "Analisis bisnis", desc: "Memahami jenis bisnis dan target pasar Anda" },
  { label: "Menentukan layout", desc: "Memilih struktur halaman yang paling efektif" },
  { label: "Menulis headline", desc: "Membuat copywriting yang menarik" },
  { label: "Membuat SEO", desc: "Optimasi SEO on-page & keyword" },
  { label: "Mendesain halaman", desc: "Menyusun desain & komponen halaman" },
  { label: "Publish website", desc: "Mempersiapkan hosting & domain" },
];

export const LOADING_STEPS_PERCENT = [15, 30, 45, 60, 75, 100];

export const WIREFRAME_STEPS = ["Tentang", "Keunggulan", "Kontak"] as const;
