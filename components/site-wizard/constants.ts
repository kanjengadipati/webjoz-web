import type { BusinessTypeItem, SubTypeItem, MoodItem } from "./types";

export const PENDING_KEY = "webjoz_pending_wizard_data";

export const MOOD_OPTIONS: MoodItem[] = [
  {
    value: "clean-modern",
    emoji: "🖥️",
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
    emoji: "⏰",
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
    label: "Futuristik & Modern",
    desc: "Modern, teknologi, dan futuristik",
    palette: ["#0B0F19", "#06B6D4", "#A855F7"],
    font: "Plus Jakarta Sans",
    suitableFor: "Tech Startup, SaaS, Digital",
    dark: true,
  },
];

export const INITIAL_MESSAGE = "🤖 Halo! Saya akan membantu membuat website bisnis Anda. Apa nama bisnis Anda?";

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
  { value: "Toko", emoji: "🛒", label: "Toko", desc: "Retail & Produk Fisik" },
  { value: "Layanan & Reservasi", emoji: "📅", label: "Layanan & Reservasi", desc: "Salon, Bengkel, Rental, Klinik, dll" },
  { value: "Kreatif & Profesional", emoji: "🎨", label: "Kreatif & Profesional", desc: "Developer, Desainer, Agency, Konsultan" },
  { value: "Company Profile", emoji: "🏢", label: "Company Profile", desc: "Properti, Konstruksi, Manufaktur, Yayasan, & Institusi" },
];

export const SUB_TYPES: Record<string, SubTypeItem[]> = {
  "Kuliner": [
    { value: "Restoran & Warung Makan", emoji: "🍛", label: "Restoran & Warung Makan" },
    { value: "Kafe", emoji: "☕", label: "Kafe" },
    { value: "Bakery & Pastry", emoji: "🥐", label: "Bakery" },
    { value: "Catering", emoji: "🍱", label: "Catering" },
    { value: "Minuman & Bubble Tea", emoji: "🧋", label: "Minuman" },
    { value: "Makanan Rumahan & Frozen Food", emoji: "🍲", label: "Makanan Rumahan" },
    { value: "Herbal & Jamu", emoji: "🌿", label: "Herbal & Jamu" },
  ],
  "Toko": [
    { value: "Fashion & Pakaian", emoji: "👗", label: "Fashion" },
    { value: "Elektronik", emoji: "📱", label: "Elektronik" },
    { value: "Kecantikan & Kosmetik", emoji: "💄", label: "Kosmetik & Skincare" },
    { value: "Produk Lokal Handmade", emoji: "🧺", label: "Handmade" },
    { value: "Toko Online", emoji: "🛒", label: "Toko Online" },
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
    { value: "Toko Online", emoji: "🛒", label: "Toko Online" },
    { value: "Minimarket & Sembako", emoji: "🏪", label: "Minimarket & Sembako" },
    { value: "Perabot & Furnitur", emoji: "🪑", label: "Furnitur" },
    { value: "Otomotif & Sparepart", emoji: "🏎️", label: "Sparepart & Aksesoris" },
    { value: "Pertanian & Peternakan", emoji: "🌾", label: "Pertanian & Peternakan" },
  ],
  "Layanan & Reservasi": [
    { value: "Rental Mobil & Kendaraan", emoji: "🚗", label: "Rental Mobil & Kendaraan" },
    { value: "Travel & Wisata", emoji: "✈️", label: "Travel & Wisata" },
    { value: "Hotel & Penginapan", emoji: "🏨", label: "Penginapan" },
    { value: "Salon & Kecantikan", emoji: "💇", label: "Salon & Spa" },
    { value: "Barbershop", emoji: "✂️", label: "Barbershop" },
    { value: "Klinik & Kesehatan", emoji: "🏥", label: "Klinik & Kesehatan" },
    { value: "Gym & Olahraga", emoji: "🏋️", label: "Gym & Olahraga" },
    { value: "Event & Wedding Organizer", emoji: "🎉", label: "Event Organizer" },
    { value: "Otomotif & Bengkel", emoji: "🔧", label: "Bengkel & Servis" },
    { value: "Laundry", emoji: "🧺", label: "Laundry" },
    { value: "Jasa Rumah & Kebersihan", emoji: "🧹", label: "Jasa Rumah & Bersih" },
    { value: "Pendidikan & Kursus", emoji: "📚", label: "Les & Kursus" },
  ],
  "Jasa & Booking": [
    { value: "Rental Mobil & Kendaraan", emoji: "🚗", label: "Rental Mobil & Kendaraan" },
    { value: "Travel & Wisata", emoji: "✈️", label: "Travel & Wisata" },
    { value: "Hotel & Penginapan", emoji: "🏨", label: "Penginapan" },
    { value: "Salon & Kecantikan", emoji: "💇", label: "Salon & Spa" },
    { value: "Barbershop", emoji: "✂️", label: "Barbershop" },
    { value: "Klinik & Kesehatan", emoji: "🏥", label: "Klinik & Kesehatan" },
    { value: "Gym & Olahraga", emoji: "🏋️", label: "Gym & Olahraga" },
    { value: "Event & Wedding Organizer", emoji: "🎉", label: "Event Organizer" },
    { value: "Otomotif & Bengkel", emoji: "🔧", label: "Bengkel & Servis" },
    { value: "Laundry", emoji: "🧺", label: "Laundry" },
    { value: "Jasa Rumah & Kebersihan", emoji: "🧹", label: "Jasa Rumah & Bersih" },
    { value: "Pendidikan & Kursus", emoji: "📚", label: "Les & Kursus" },
  ],
  "Kreatif & Profesional": [
    { value: "Fotografer", emoji: "📷", label: "Fotografer" },
    { value: "Videografer", emoji: "🎥", label: "Videografer" },
    { value: "Desainer", emoji: "🎨", label: "Desainer" },
    { value: "Developer & IT", emoji: "💻", label: "Developer & IT" },
    { value: "Digital & Marketing Agency", emoji: "📈", label: "Digital Agency" },
    { value: "Konsultan", emoji: "📊", label: "Konsultan" },
    { value: "Musisi & Entertainer", emoji: "🎵", label: "Musisi & Hiburan" },
  ],
  "Portofolio & Kreator": [
    { value: "Fotografer", emoji: "📷", label: "Fotografer" },
    { value: "Videografer", emoji: "🎥", label: "Videografer" },
    { value: "Desainer", emoji: "🎨", label: "Desainer" },
    { value: "Developer & IT", emoji: "💻", label: "Developer & IT" },
    { value: "Digital & Marketing Agency", emoji: "📈", label: "Digital Agency" },
    { value: "Konsultan", emoji: "📊", label: "Konsultan" },
    { value: "Musisi & Entertainer", emoji: "🎵", label: "Musisi & Hiburan" },
  ],
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
  { label: "Optimasi SEO & finalisasi", desc: "Mengatur metadata dan call-to-action kontak" },
];

export const LOADING_STEPS_PERCENT = [15, 30, 48, 64, 80, 92];

export const SECTION_STEP_MAP: Record<string, number> = {
  header: 0, hero: 0,
  about: 1,
  benefits: 2,
  testimonials: 3, faq: 3,
  menu: 4, catalog: 4, gallery: 4,
  cta: 5, contact: 5, footer: 5, seo: 5,
};

export const WIREFRAME_STEPS = ["Tentang", "Keunggulan", "Kontak"] as const;

// Variants for name acknowledgement / confirmation
export const NAME_ACK_VARIANTS = [
  "Baik, nama bisnis telah dicatat.",
  "Nama bisnis berhasil disimpan.",
  "Oke, nama sudah tersimpan.",
  "Siap, nama bisnis tercatat.",
  "Nama usaha Anda sudah masuk sistem.",
  "Baik, nama bisnis terdaftar."
];

export const DESCRIPTION_PROMPT = "Ceritakan bisnis Anda secara singkat — cukup 1-2 kalimat. Misalnya: produk/jasa apa yang ditawarkan, untuk siapa, dan di mana lokasinya. Tekan Enter untuk lanjut jika ingin skip.";
export const DESCRIPTION_SKIP_KEYWORD = "lewat";
export const DESCRIPTION_INFERENCE_HIGH = "Saya lihat Anda bergerak di bidang %s — %s. Langsung buat website-nya?";
export const DESCRIPTION_INFERENCE_MEDIUM = "Saya lihat bidang usaha Anda adalah %s. Bisa pilih yang lebih spesifik?";
export const DESCRIPTION_INFERENCE_NONE = "Baik, silakan pilih jenis bisnis Anda:";

export const NAME_CONFIRM_VARIANTS = [
  "Itu nama bisnis aslinya, atau masih nama sementara? Pilih 'Ya' untuk lanjut, atau 'Ganti' jika ingin diubah 😊",
  "Apakah itu nama sebenarnya? Klik 'Ya' untuk lanjut, atau 'Ganti' jika ingin memasukkan nama lain.",
  "Nama tersebut terdengar seperti percobaan — pastikan ini yang Anda mau. Klik 'Ya' untuk lanjut atau 'Ganti'."
];

// Mapping keyword -> suggested type/subtype
export const NAME_TYPE_HINTS: Record<string, { type?: string; subType?: string }> = {
  "kopi": { type: "Kuliner", subType: "Kafe" },
  "kafe": { type: "Kuliner", subType: "Kafe" },
  "cafe": { type: "Kuliner", subType: "Kafe" },
  "restoran": { type: "Kuliner", subType: "Restoran & Warung Makan" },
  "warung": { type: "Kuliner", subType: "Restoran & Warung Makan" },
  "bakery": { type: "Kuliner", subType: "Bakery & Pastry" },
  "roti": { type: "Kuliner", subType: "Bakery & Pastry" },
  "frozen": { type: "Kuliner", subType: "Makanan Rumahan & Frozen Food" },
  "jamu": { type: "Kuliner", subType: "Herbal & Jamu" },
  "herbal": { type: "Kuliner", subType: "Herbal & Jamu" },
  "madu": { type: "Kuliner", subType: "Herbal & Jamu" },
  "rental": { type: "Layanan & Reservasi", subType: "Rental Mobil & Kendaraan" },
  "sewa mobil": { type: "Layanan & Reservasi", subType: "Rental Mobil & Kendaraan" },
  "sewa motor": { type: "Layanan & Reservasi", subType: "Rental Mobil & Kendaraan" },
  "klinik": { type: "Layanan & Reservasi", subType: "Klinik & Kesehatan" },
  "dokter": { type: "Layanan & Reservasi", subType: "Klinik & Kesehatan" },
  "salon": { type: "Layanan & Reservasi", subType: "Salon & Kecantikan" },
  "barbershop": { type: "Layanan & Reservasi", subType: "Barbershop" },
  "travel": { type: "Layanan & Reservasi", subType: "Travel & Wisata" },
  "hotel": { type: "Layanan & Reservasi", subType: "Hotel & Penginapan" },
  "villa": { type: "Layanan & Reservasi", subType: "Hotel & Penginapan" },
  "penginapan": { type: "Layanan & Reservasi", subType: "Hotel & Penginapan" },
  "wisata": { type: "Layanan & Reservasi", subType: "Travel & Wisata" },
  "tour": { type: "Layanan & Reservasi", subType: "Travel & Wisata" },
  "toko": { type: "Toko", subType: "Toko Online" },
  "toko online": { type: "Toko", subType: "Toko Online" },
  "fashion": { type: "Toko", subType: "Fashion & Pakaian" },
  "skincare": { type: "Toko", subType: "Kecantikan & Kosmetik" },
  "kosmetik": { type: "Toko", subType: "Kecantikan & Kosmetik" },
  "parfum": { type: "Toko", subType: "Kecantikan & Kosmetik" },
  "sparepart": { type: "Toko", subType: "Otomotif & Sparepart" },
  "bengkel": { type: "Layanan & Reservasi", subType: "Otomotif & Bengkel" },
  "laundry": { type: "Layanan & Reservasi", subType: "Laundry" },
  "gym": { type: "Layanan & Reservasi", subType: "Gym & Olahraga" },
  "fitness": { type: "Layanan & Reservasi", subType: "Gym & Olahraga" },
  "cleaning": { type: "Layanan & Reservasi", subType: "Jasa Rumah & Kebersihan" },
  "cuci ac": { type: "Layanan & Reservasi", subType: "Jasa Rumah & Kebersihan" },
  "konsultan": { type: "Kreatif & Profesional", subType: "Konsultan" },
  "fotogra": { type: "Kreatif & Profesional", subType: "Fotografer" },
  "minuman": { type: "Kuliner", subType: "Minuman & Bubble Tea" },
  "bubble": { type: "Kuliner", subType: "Minuman & Bubble Tea" },
  "video": { type: "Kreatif & Profesional", subType: "Videografer" },
  "desain": { type: "Kreatif & Profesional", subType: "Desainer" },
  "design": { type: "Kreatif & Profesional", subType: "Desainer" },
  "developer": { type: "Kreatif & Profesional", subType: "Developer & IT" },
  "software": { type: "Kreatif & Profesional", subType: "Developer & IT" },
  "programmer": { type: "Kreatif & Profesional", subType: "Developer & IT" },
  "website": { type: "Kreatif & Profesional", subType: "Developer & IT" },
  "agency": { type: "Kreatif & Profesional", subType: "Digital & Marketing Agency" },
  "musik": { type: "Kreatif & Profesional", subType: "Musisi & Entertainer" },
  "band": { type: "Kreatif & Profesional", subType: "Musisi & Entertainer" },
  "wedding organizer": { type: "Layanan & Reservasi", subType: "Event & Wedding Organizer" },
  "wo ": { type: "Layanan & Reservasi", subType: "Event & Wedding Organizer" },
  "event organizer": { type: "Layanan & Reservasi", subType: "Event & Wedding Organizer" },
  "properti": { type: "Company Profile", subType: "Properti & Real Estate" },
  "kontraktor": { type: "Company Profile", subType: "Konstruksi & Kontraktor" },
  "logistik": { type: "Company Profile", subType: "Logistik & Ekspedisi" },
  "ekspedisi": { type: "Company Profile", subType: "Logistik & Ekspedisi" },
  "sekolah": { type: "Company Profile", subType: "Institusi Pendidikan & Pesantren" },
  "pesantren": { type: "Company Profile", subType: "Institusi Pendidikan & Pesantren" },
  "yayasan": { type: "Company Profile", subType: "Yayasan & Organisasi Nonprofit" },
};
