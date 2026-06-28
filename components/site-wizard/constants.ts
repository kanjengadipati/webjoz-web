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
  "TEMPLATE_RETRO": "Neon Wave 🌆",
  "TEMPLATE_FUTURISTIC": "Cyber Core 🤖",
};

export const LOADING_CHECKLIST = [
  { label: "Menulis headline & hero", desc: "Membuat judul utama yang menarik perhatian" },
  { label: "Menyusun cerita bisnis", desc: "Menulis tentang brand dan nilai bisnis Anda" },
  { label: "Menulis keunggulan & layanan", desc: "Merinci kelebihan dan layanan yang ditawarkan" },
  { label: "Menyiapkan testimoni & FAQ", desc: "Mengumpulkan bukti sosial dan pertanyaan umum" },
  { label: "Menyusun call-to-action", desc: "Membuat ajakan untuk bertindak yang meyakinkan" },
  { label: "Optimasi SEO & finalisasi", desc: "Mengatur metadata agar mudah ditemukan di Google" },
];

export const LOADING_STEPS_PERCENT = [15, 30, 45, 60, 75, 100];

export const SECTION_STEP_MAP: Record<string, number> = {
  header: 0, hero: 0,
  about: 1,
  benefits: 2,
  testimonials: 3, faq: 3,
  cta: 4,
  seo: 5, footer: 5, menu: 5, catalog: 5, contact: 5,
};

export const WIREFRAME_STEPS = ["Tentang", "Keunggulan", "Kontak"] as const;

// Variants for name acknowledgement / confirmation
export const NAME_ACK_VARIANTS = [
  "Bagus! Nama tersebut bisa jadi identitas yang kuat.",
  "Sip, nama yang profesional dan mudah diingat. 👍",
  "Keren — nama yang sederhana dan mudah dipercaya.",
  "Oke, kami catat namanya. Selanjutnya pilih jenis bisnisnya ya."
];

export const DESCRIPTION_PROMPT = "Ceritakan bisnis Anda secara singkat (cukup 2-3 kalimat) (optional) enter untuk lanjut.";
export const DESCRIPTION_SKIP_KEYWORD = "lewat";
export const DESCRIPTION_INFERENCE_HIGH = "Saya lihat Anda bergerak di bidang %s — %s. Langsung buat website-nya?";
export const DESCRIPTION_INFERENCE_MEDIUM = "Saya lihat bidang usaha Anda adalah %s. Bisa pilih yang lebih spesifik?";
export const DESCRIPTION_INFERENCE_NONE = "Baik, silakan pilih jenis bisnis Anda:";

export const NAME_CONFIRM_VARIANTS = [
  "Itu nama bisnis aslinya, atau masih nama sementara? Kalau sudah pas, ketik lagi untuk lanjut, atau ganti nama yang Anda mau pakai 😊",
  "Apakah itu nama sebenarnya? Ketik 'ya' untuk lanjut, atau masukkan nama lain jika ingin diganti.",
  "Nama tersebut terdengar seperti percobaan — pastikan ini yang Anda mau. Ketik 'ya' untuk lanjut, atau masukkan nama baru."
];

// Mapping keyword -> suggested type/subtype
export const NAME_TYPE_HINTS: Record<string, { type?: string; subType?: string }> = {
  "kopi": { type: "Kuliner", subType: "Kafe" },
  "kafe": { type: "Kuliner", subType: "Kafe" },
  "cafe": { type: "Kuliner", subType: "Kafe" },
  "restoran": { type: "Kuliner", subType: "Restoran" },
  "warung": { type: "Kuliner", subType: "Warung Makan" },
  "bakery": { type: "Kuliner", subType: "Bakery & Pastry" },
  "roti": { type: "Kuliner", subType: "Bakery & Pastry" },
  "klinik": { type: "Jasa", subType: "Klinik & Kesehatan" },
  "dokter": { type: "Jasa", subType: "Klinik & Kesehatan" },
  "salon": { type: "Jasa", subType: "Salon & Kecantikan" },
  "barbershop": { type: "Jasa", subType: "Barbershop" },
  "travel": { type: "Company", subType: "Travel & Wisata" },
  "hotel": { type: "Company", subType: "Hotel & Penginapan" },
  "toko": { type: "Toko & UMKM", subType: "Toko Online" },
  "toko online": { type: "Toko & UMKM", subType: "Toko Online" },
  "fashion": { type: "Toko & UMKM", subType: "Fashion & Pakaian" },
  "bengkel": { type: "Jasa", subType: "Otomotif & Bengkel" },
  "laundry": { type: "Jasa", subType: "Laundry" },
  "konsultan": { type: "Jasa", subType: "Konsultan" },
  "fotogra": { type: "Jasa", subType: "Fotografer" }, // partial to catch fotografer/photographer
  "minuman": { type: "Kuliner", subType: "Minuman & Bubble Tea" },
  "bubble": { type: "Kuliner", subType: "Minuman & Bubble Tea" },
};
