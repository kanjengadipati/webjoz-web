import type { BusinessTypeItem, SubTypeItem, MoodItem } from "./types";

export const PENDING_KEY = "webjoz_pending_wizard_data";

export const MOOD_OPTIONS: MoodItem[] = [
  {
    value: "clean-modern",
    emoji: "✨",
    label: "Modern & Bersih",
    desc: "Bersih, rapi, dan profesional",
    palette: ["#FFFFFF", "#2563EB", "#0F172A"],
    font: "Space Grotesk",
    suitableFor: "Jasa, Korporat, Agency, Toko",
    dark: false,
  },
  {
    value: "warm-earthy",
    emoji: "🌿",
    label: "Hangat & Alami",
    desc: "Hangat, alami, dan bersahaja",
    palette: ["#F5F0E8", "#4D7C0F", "#92400E"],
    font: "Playfair Display",
    suitableFor: "Kafe, Kuliner, Organik, Handmade",
    dark: false,
  },
  {
    value: "bold-vibrant",
    emoji: "🎨",
    label: "Ceria & Berwarna",
    desc: "Ceria, ramah, dan penuh warna",
    palette: ["#FFF7ED", "#F97316", "#8B5CF6"],
    font: "Outfit",
    suitableFor: "Kuliner Kekinian, Fashion, Kreatif",
    dark: false,
  },
  {
    value: "dark-premium",
    emoji: "👑",
    label: "Elegan & Mewah",
    desc: "Gelap, mewah, dan eksklusif",
    palette: ["#0D0D0B", "#D4AF37", "#F5F0E8"],
    font: "Cormorant Garamond",
    suitableFor: "Hotel, Beauty Clinic, Perhiasan",
    dark: true,
  },
  {
    value: "bold-dark",
    emoji: "⚡",
    label: "Tegas & Berenergi",
    desc: "Kontras tinggi, tegas, dan bersemangat",
    palette: ["#0A0A0A", "#E63946", "#F4A261"],
    font: "Oswald",
    suitableFor: "Gym, Bengkel, Barbershop, Sport",
    dark: true,
  },
  {
    value: "retro",
    emoji: "⏳",
    label: "Klasik & Retro",
    desc: "Klasik, nostalgia, dan berkarakter",
    palette: ["#EFE6D5", "#8B4513", "#D97706"],
    font: "Merriweather",
    suitableFor: "Kopi Tradisional, Batik, Antik",
    dark: false,
  },
  {
    value: "futuristic",
    emoji: "🤖",
    label: "Futuristik",
    desc: "Modern, teknologi, dan futuristik",
    palette: ["#0B0F19", "#06B6D4", "#A855F7"],
    font: "Plus Jakarta Sans",
    suitableFor: "Tech Startup, SaaS, Digital",
    dark: true,
  },
];

export const INITIAL_MESSAGE = "Halo! Saya Joz-AI, asisten AI yang akan membantu Anda membuat website. Mari kita mulai: apa nama bisnis atau brand Anda?";

export const AI_LOADING_STEPS = [
  "Menganalisis profil bisnis Anda...",
  "Merumuskan headline copywriting yang memikat...",
  "Menyusun cerita brand yang berkesan...",
  "Menyusun deskripsi layanan secara terstruktur...",
  "Merumuskan Pertanyaan Umum (FAQ) pelanggan...",
  "Mengatur optimasi tag metadata SEO...",
  "Merakit layout visual yang menawan...",
];

export const BUSINESS_TYPES: BusinessTypeItem[] = [
  { value: "Kuliner", emoji: "🍽️", label: "Kuliner", desc: "Restoran, Warung, Cafe & Catering" },
  { value: "Toko", emoji: "🛒", label: "Toko Online & Retail", desc: "Katalog produk, jualan online & toko fisik" },
  { value: "Layanan & Reservasi", emoji: "📅", label: "Layanan & Reservasi", desc: "Salon, Hotel, Bengkel, Rental, Klinik, dll" },
  // "Portofolio" untuk kreator & profesional individual yang menampilkan karya
  { value: "Portofolio", emoji: "🎨", label: "Portofolio", desc: "Fotografer, Desainer, Developer, Kreator & Personal Brand" },
  // "Kreatif & Profesional" untuk agensi, tim, dan jasa profesional
  { value: "Kreatif & Profesional", emoji: "💼", label: "Kreatif & Profesional", desc: "Agency, Konsultan, Notaris & Jasa Profesional" },
  { value: "Company Profile", emoji: "🏢", label: "Company Profile", desc: "Properti, Konstruksi, Manufaktur, Yayasan, & Institusi" },
];

// Sub-tipe untuk "Portofolio" — kreator & profesional individual yang menampilkan karya
const PORTOFOLIO_PERSONAL_SUB_TYPES: SubTypeItem[] = [
  { value: "Fotografer", emoji: "📷", label: "Fotografer" },
  { value: "Videografer", emoji: "🎥", label: "Videografer" },
  { value: "Desainer", emoji: "🎨", label: "Desainer" },
  { value: "Ilustrator & Seniman", emoji: "🎭", label: "Ilustrator & Seniman" },
  { value: "Konten Kreator", emoji: "🎬", label: "Konten Kreator" },
  { value: "Developer & IT", emoji: "💻", label: "Developer & IT" },
  { value: "Penulis & Copywriter", emoji: "✍️", label: "Penulis & Copywriter" },
  { value: "Arsitek & Desainer Interior", emoji: "🏛️", label: "Arsitek & Interior" },
  { value: "Musisi & Entertainer", emoji: "🎵", label: "Musisi & Hiburan" },
];

// Sub-tipe untuk "Kreatif & Profesional" — agensi, tim, dan jasa profesional
const KREATIF_PRO_SUB_TYPES: SubTypeItem[] = [
  { value: "Digital & Marketing Agency", emoji: "📈", label: "Digital Agency" },
  { value: "SEO & Digital Specialist", emoji: "🔍", label: "SEO & Digital" },
  { value: "Konsultan", emoji: "📊", label: "Konsultan" },
  { value: "Tutor & Life Coach", emoji: "🎓", label: "Tutor & Coach" },
  { value: "Public Speaker & Trainer", emoji: "🎤", label: "Speaker & Trainer" },
  { value: "Notaris & PPAT", emoji: "⚖️", label: "Notaris & PPAT" },
];

export const SUB_TYPES: Record<string, SubTypeItem[]> = {
  "Kuliner": [
    { value: "Restoran & Warung Makan", emoji: "🍛", label: "Restoran" },
    { value: "Kuliner Tradisional & Nusantara", emoji: "🍲", label: "Kuliner Tradisional" },
    { value: "Kafe", emoji: "☕", label: "Kafe" },
    { value: "Bakery & Pastry", emoji: "🥐", label: "Bakery" },
    { value: "Catering", emoji: "🍱", label: "Catering" },
    { value: "Minuman & Bubble Tea", emoji: "🧋", label: "Minuman" },
    { value: "Makanan Rumahan & Frozen Food", emoji: "🍲", label: "Dapur Rumahan" },
    { value: "Frozen Food Homemade", emoji: "🧊", label: "Frozen Food" },
    { value: "Kuliner Kaki Lima & Angkringan", emoji: "🍢", label: "Kaki Lima" },
    { value: "Jajanan Pasar & Kuliner Tradisional", emoji: "🍘", label: "Jajanan Pasar" },
    { value: "Herbal & Jamu", emoji: "🌿", label: "Herbal & Jamu" },
  ],
  "Toko": [
    { value: "Fashion & Pakaian", emoji: "👗", label: "Fashion" },
    { value: "Elektronik", emoji: "📱", label: "Elektronik" },
    { value: "Kecantikan & Kosmetik", emoji: "💄", label: "Kosmetik & Skincare" },
    { value: "Produk Lokal Handmade", emoji: "🧺", label: "Handmade" },
    { value: "Minimarket & Sembako", emoji: "🏪", label: "Minimarket & Sembako" },
    { value: "Perabot & Furnitur", emoji: "🪑", label: "Furnitur" },
    { value: "Otomotif & Sparepart", emoji: "🏎️", label: "Sparepart & Aksesoris" },
    { value: "Pertanian & Peternakan", emoji: "🌾", label: "Pertanian & Peternakan" },
  ],
  "Toko & UMKM": [
    { value: "Fashion & Pakaian", emoji: "👗", label: "Fashion" },
    { value: "Elektronik", emoji: "📱", label: "Elektronik" },
    { value: "Kecantikan & Kosmetik", emoji: "💄", label: "Kosmetik & Skincare" },
    { value: "Produk Lokal Handmade", emoji: "🧺", label: "Handmade" },
    { value: "Minimarket & Sembako", emoji: "🏪", label: "Minimarket & Sembako" },
    { value: "Perabot & Furnitur", emoji: "🪑", label: "Furnitur" },
    { value: "Otomotif & Sparepart", emoji: "🏎️", label: "Sparepart & Aksesoris" },
    { value: "Pertanian & Peternakan", emoji: "🌾", label: "Pertanian & Peternakan" },
  ],
  "Toko Online & Retail": [
    { value: "Fashion & Pakaian", emoji: "👗", label: "Fashion" },
    { value: "Elektronik", emoji: "📱", label: "Elektronik" },
    { value: "Kecantikan & Kosmetik", emoji: "💄", label: "Kosmetik & Skincare" },
    { value: "Produk Lokal Handmade", emoji: "🧺", label: "Handmade" },
    { value: "Minimarket & Sembako", emoji: "🏪", label: "Minimarket & Sembako" },
    { value: "Perabot & Furnitur", emoji: "🪑", label: "Furnitur" },
    { value: "Otomotif & Sparepart", emoji: "🏎️", label: "Sparepart & Aksesoris" },
    { value: "Pertanian & Peternakan", emoji: "🌾", label: "Pertanian & Peternakan" },
  ],
  "Layanan & Reservasi": [
    { value: "Rental Mobil & Kendaraan", emoji: "🚗", label: "Rental Mobil & Kendaraan" },
    { value: "Travel & Wisata", emoji: "✈️", label: "Travel & Wisata" },
    { value: "Hotel & Penginapan", emoji: "🏨", label: "Penginapan" },
    { value: "Makeup Artist (MUA)", emoji: "💄", label: "Makeup Artist (MUA)" },
    { value: "Salon & Kecantikan", emoji: "💇", label: "Salon & Spa" },
    { value: "Barbershop", emoji: "✂️", label: "Barbershop" },
    { value: "Klinik & Kesehatan", emoji: "🏥", label: "Klinik & Kesehatan" },
    { value: "Gym & Olahraga", emoji: "🏋️", label: "Gym & Olahraga" },
    { value: "Event & Wedding Organizer", emoji: "🎉", label: "Event Organizer" },
    { value: "Otomotif & Bengkel", emoji: "🔧", label: "Bengkel & Servis" },
    { value: "Laundry", emoji: "🧺", label: "Laundry" },
    { value: "Jasa Rumah & Kebersihan", emoji: "🧹", label: "Jasa Rumah & Bersih" },
    { value: "Pendidikan & Kursus", emoji: "📚", label: "Les & Kursus" },
    { value: "Biro Jasa & Perizinan", emoji: "📋", label: "Biro Jasa" },
  ],
  "Jasa & Booking": [
    { value: "Rental Mobil & Kendaraan", emoji: "🚗", label: "Rental Mobil & Kendaraan" },
    { value: "Travel & Wisata", emoji: "✈️", label: "Travel & Wisata" },
    { value: "Hotel & Penginapan", emoji: "🏨", label: "Penginapan" },
    { value: "Makeup Artist (MUA)", emoji: "💄", label: "Makeup Artist (MUA)" },
    { value: "Salon & Kecantikan", emoji: "💇", label: "Salon & Spa" },
    { value: "Barbershop", emoji: "✂️", label: "Barbershop" },
    { value: "Klinik & Kesehatan", emoji: "🏥", label: "Klinik & Kesehatan" },
    { value: "Gym & Olahraga", emoji: "🏋️", label: "Gym & Olahraga" },
    { value: "Event & Wedding Organizer", emoji: "🎉", label: "Event Organizer" },
    { value: "Otomotif & Bengkel", emoji: "🔧", label: "Bengkel & Servis" },
    { value: "Laundry", emoji: "🧺", label: "Laundry" },
    { value: "Jasa Rumah & Kebersihan", emoji: "🧹", label: "Jasa Rumah & Bersih" },
    { value: "Pendidikan & Kursus", emoji: "📚", label: "Les & Kursus" },
    { value: "Biro Jasa & Perizinan", emoji: "📋", label: "Biro Jasa" },
  ],
  // "Portofolio" — individual / personal brand
  "Portofolio": PORTOFOLIO_PERSONAL_SUB_TYPES,
  // Backward-compat aliases (data lama di database)
  "Portofolio & Kreator": PORTOFOLIO_PERSONAL_SUB_TYPES,
  "Kreatif & Profesional": KREATIF_PRO_SUB_TYPES,
  "Company Profile": [
    { value: "Properti & Real Estate", emoji: "🏠", label: "Properti" },
    { value: "Konstruksi & Kontraktor", emoji: "🏗️", label: "Konstruksi" },
    { value: "Manufaktur & Pabrik", emoji: "🏭", label: "Manufaktur" },
    { value: "Logistik & Ekspedisi", emoji: "🚚", label: "Logistik & Kargo" },
    { value: "Yayasan & Organisasi Nonprofit", emoji: "🤝", label: "Yayasan & Organisasi" },
    { value: "Institusi Pendidikan & Pesantren", emoji: "🏫", label: "Sekolah & Kampus" },
  ],
  "Company": [
    { value: "Properti & Real Estate", emoji: "🏠", label: "Properti" },
    { value: "Konstruksi & Kontraktor", emoji: "🏗️", label: "Konstruksi" },
    { value: "Manufaktur & Pabrik", emoji: "🏭", label: "Manufaktur" },
    { value: "Logistik & Ekspedisi", emoji: "🚚", label: "Logistik & Kargo" },
    { value: "Yayasan & Organisasi Nonprofit", emoji: "🤝", label: "Yayasan & Organisasi" },
    { value: "Institusi Pendidikan & Pesantren", emoji: "🏫", label: "Sekolah & Kampus" },
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
  { label: "Menyusun katalog & galeri", desc: "Membuat daftar menu/layanan dan galeri foto" },
  { label: "Kurasi portofolio proyek", desc: "Menyusun karya terbaik dan pencapaian bisnis" },
  { label: "Optimasi SEO & finalisasi", desc: "Mengatur metadata dan call-to-action kontak" },
];

export const LOADING_STEPS_PERCENT = [15, 30, 46, 58, 70, 82, 92];

export const SECTION_STEP_MAP: Record<string, number> = {
  header: 0, hero: 0,
  about: 1,
  benefits: 2,
  testimonials: 3, faq: 3,
  menu: 4, catalog: 4, gallery: 4, works: 4,
  cta: 5, contact: 5, footer: 5, seo: 5,
};

export const WIREFRAME_STEPS = ["Tentang", "Keunggulan", "Kontak"] as const;

// Variants for name acknowledgement / confirmation
export const NAME_ACK_VARIANTS = [
  "Baik, nama telah dicatat.",
  "Nama berhasil disimpan.",
  "Oke, nama sudah tersimpan.",
  "Siap, nama tercatat.",
  "Nama Anda sudah masuk sistem.",
  "Baik, nama sudah terdaftar."
];

export const DESCRIPTION_PROMPT = "Ceritakan bisnis atau profil Anda secara singkat — cukup 1-2 kalimat. Misalnya: karya/jasa yang ditawarkan, keahlian Anda, atau untuk siapa. Tekan Enter untuk lanjut jika ingin skip.";
export const DESCRIPTION_SKIP_KEYWORD = "lewat";
export const DESCRIPTION_INFERENCE_HIGH = "Saya lihat Anda bergerak di bidang %s — %s. Langsung buat website-nya?";
export const DESCRIPTION_INFERENCE_MEDIUM = "Saya lihat bidang usaha Anda adalah %s. Bisa pilih yang lebih spesifik?";
export const DESCRIPTION_INFERENCE_NONE = "Baik, silakan pilih kategori Anda:";
export const DESCRIPTION_AI_FAILED = "Koneksi ke AI bermasalah. Silakan pilih kategori secara manual:";

export const NAME_CONFIRM_VARIANTS = [
  "Itu nama aslinya, atau masih nama sementara? Pilih 'Ya' untuk lanjut, atau 'Ganti' jika ingin diubah 😊",
  "Apakah itu nama sebenarnya? Klik 'Ya' untuk lanjut, atau 'Ganti' jika ingin memasukkan nama lain.",
  "Nama tersebut terdengar seperti percobaan — pastikan ini yang Anda mau. Klik 'Ya' untuk lanjut atau 'Ganti'."
];

