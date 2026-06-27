import type { ContentSection, MenuItem, CatalogItem, GalleryItem } from "@/components/templates/types";

const SZ = "w=400&q=80";

const UNSPLASH_ITEM_POOLS: Record<string, string[]> = {
  coffee: [
    `https://images.unsplash.com/photo-1509042239860-f550ce710b93?${SZ}`,
    `https://images.unsplash.com/photo-1461023058943-07fcbe16d735?${SZ}`,
    `https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?${SZ}`,
    `https://images.unsplash.com/photo-1504630083234-14187a9df0f5?${SZ}`,
  ],
  tea: [
    `https://images.unsplash.com/photo-1556679343-c7306c1976bc?${SZ}`,
    `https://images.unsplash.com/photo-1563822249366-3efb23b8e0c9?${SZ}`,
    `https://images.unsplash.com/photo-1571934811356-5cc061b6821f?${SZ}`,
  ],
  food: [
    `https://images.unsplash.com/photo-1504674900247-0877df9cc836?${SZ}`,
    `https://images.unsplash.com/photo-1546069901-ba9599a7e63c?${SZ}`,
    `https://images.unsplash.com/photo-1555939594-58d7cb561ad1?${SZ}`,
    `https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?${SZ}`,
    `https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?${SZ}`,
  ],
  pastry: [
    `https://images.unsplash.com/photo-1555507036-ab1f4038028a?${SZ}`,
    `https://images.unsplash.com/photo-1509365465985-25d11c17e812?${SZ}`,
    `https://images.unsplash.com/photo-1488477181946-6428a0291777?${SZ}`,
  ],
  drink: [
    `https://images.unsplash.com/photo-1622597467836-f3285f2131b8?${SZ}`,
    `https://images.unsplash.com/photo-1544252890-c3e95e867389?${SZ}`,
    `https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?${SZ}`,
  ],
  product: [
    `https://images.unsplash.com/photo-1546868871-af0de0ae72c1?${SZ}`,
    `https://images.unsplash.com/photo-1523275335684-37898b6baf30?${SZ}`,
    `https://images.unsplash.com/photo-1610824357608-8b7f0a2d7bfc?${SZ}`,
    `https://images.unsplash.com/photo-1587049352846-4a222e784d38?${SZ}`,
  ],
  healthy: [
    `https://images.unsplash.com/photo-1512621776951-a57141f2eefd?${SZ}`,
    `https://images.unsplash.com/photo-1615485290382-441e4d049cb5?${SZ}`,
    `https://images.unsplash.com/photo-1490645935967-10de6ba17061?${SZ}`,
  ],
  snack: [
    `https://images.unsplash.com/photo-1600026453310-76b67c5ea58d?${SZ}`,
    `https://images.unsplash.com/photo-1621939514649-280e2ee25f60?${SZ}`,
  ],
};

const FOOD_KEYWORDS: [RegExp, string][] = [
  [/(kopi|coffee|espresso|cappuccino|latte|mocha|brew|cold brew|americano|robusta|arabika|gayo)/i, "coffee"],
  [/(teh|tea|chai|infused|earl grey|green tea|oolong)/i, "tea"],
  [/(kue|cake|pastry|roti|bread|croissant|donat|doughnut|muffin|brownies)/i, "pastry"],
  [/(nasi|rice|ayam|chicken|sate|soto|mie|noodle|goreng|rendang|daging|steak|seafood|ikan|tumis|sayur)/i, "food"],
  [/(jus|juice|smoothie|soda|minuman|drink|es|shake|float|lemonade|mocktail)/i, "drink"],
  [/(kemasan|packaging|botol|bottle|jar|box|paket|bundling|ekonomis|premium)/i, "product"],
  [/(sehat|organic|organik|salad|fit|diet|vegan|gluten|sugar free|low fat)/i, "healthy"],
  [/(snack|ringan|keripik|chips|cracker|nibble|appetizer)/i, "snack"],
];

function pickItemImage(name: string, description?: string): string {
  const text = `${name} ${description ?? ""}`;
  for (const [regex, poolKey] of FOOD_KEYWORDS) {
    if (regex.test(text)) {
      const pool = UNSPLASH_ITEM_POOLS[poolKey];
      let hash = 0;
      for (let i = 0; i < name.length; i++) {
        hash = ((hash << 5) - hash) + name.charCodeAt(i);
        hash |= 0;
      }
      return pool[Math.abs(hash) % pool.length];
    }
  }
  const fallback = UNSPLASH_ITEM_POOLS.food;
  return fallback[Math.abs(name.split("").reduce((h, c) => ((h << 5) - h) + c.charCodeAt(0), 0)) % fallback.length];
}

function assignItemImages<T extends MenuItem | CatalogItem>(items: T[]): T[] {
  return items.map((item) => ({
    ...item,
    image_url: item.image_url || pickItemImage(item.name, item.description),
  }));
}

export const MOCK_CONTENT: Record<string, ContentSection["data"]> = {
  header: {
    brand_name: "Kopi Nusantara",
    tagline: "Dikerjakan dengan Standar Tinggi",
    nav_cta_text: "Hubungi Kami",
    logo_url: "",
  },
  hero: {
    headline: "Secangkir Kopi, Ide Baru Setiap Hari",
    subheadline: "Kopi single-origin dan roti buatan rumah, tempat favorit untuk kerja dan ngobrol santai di Jakarta.",
    cta_text: "Pesan Sekarang",
    cta_url: "#contact",
    cta_secondary_text: "Lihat Menu",
    image_url: "https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=1200&auto=format&fit=crop&q=80",
    badge_text: "Edisi Terbatas",
    eyebrow: "KOPI NUSANTARA",
  },
  about: {
    title: "Cerita di Balik Kopi Nusantara",
    body: "Dimulai dari satu keyakinan: kopi berkualitas seharusnya bisa dinikmati semua orang. Kami menyajikan biji kopi pilihan dari seluruh nusantara yang dipanggang secara presisi.",
    eyebrow: "MENGENAL KAMI",
    image_url: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&auto=format&fit=crop&q=80",
    highlight_stat_1: { value: "500+", label: "Pelanggan Puas" },
    highlight_stat_2: { value: "3+", label: "Tahun Melayani" },
    highlight_stat_3: { value: "15", label: "Varian Kopi" },
  },
  benefits: {
    title: "Apa yang Membuat Kami Berbeda?",
    subtitle: "Bukan klaim — ini yang bisa Anda rasakan sendiri.",
    eyebrow: "KEUNGGULAN",
    items: [
      {
        title: "Biji Kopi Pilihan",
        description: "Kami hanya menggunakan biji kopi arabika terbaik dari petani lokal yang dipanggang segar setiap minggu.",
        icon: "Coffee",
        stat: "15+",
        stat_label: "Varian",
      },
      {
        title: "Suasana Nyaman",
        description: "Ruang didesain khusus untuk mendukung produktivitas — WiFi kencang, colokan di setiap meja.",
        icon: "Home",
      },
      {
        title: "Konsistensi Rasa",
        description: "Setiap cangkir diracik dengan resep dan takaran yang presisi dari barista pertama hingga terakhir.",
        icon: "Award",
        stat: "98%",
        stat_label: "Konsisten",
      },
    ],
  },
  testimonials: {
    title: "Cerita dari Pelanggan Kami",
    eyebrow: "KATA MEREKA",
    items: [
      { quote: "Saya kerja dari sini hampir setiap hari. WiFi kencang, kopinya enak, dan pelayannya ramah.", name: "Dimas Prasetyo", role: "Freelance Desainer", avatar_initials: "DP", avatar_color: "#6F4E37" },
      { quote: "Cappuccino-nya konsisten dari kunjungan pertama sampai sekarang.", name: "Sari Melati", role: "Content Creator", avatar_initials: "SM", avatar_color: "#92400E" },
      { quote: "Tempat nyaman untuk kerja dan bertemu klien.", name: "Reza Firmansyah", role: "Software Engineer", avatar_initials: "RF", avatar_color: "#78350F" },
    ],
  },
  menu: {
    title: "Menu Kami",
    categories: [
      {
        name: "Kopi Spesial",
        items: assignItemImages([
          { name: "Espresso Single Origin", description: "Biji kopi dari Gayo dengan body penuh.", price: "Rp 35.000", image_url: "" },
          { name: "Cappuccino Classic", description: "Espresso dengan steamed milk dan foam.", price: "Rp 42.000" },
        ]),
      },
      {
        name: "Makanan Ringan",
        items: assignItemImages([
          { name: "Croissant Isi Coklat", description: "Croissant homemade dengan filling coklat Belgia.", price: "Rp 28.000" },
          { name: "Banana Bread", description: "Roti pisang panggang dengan walnut.", price: "Rp 22.000" },
          { name: "Chicken Wrap", description: "Wrap ayam panggang dengan sayuran segar.", price: "Rp 35.000" },
        ]),
      },
    ],
  },
  gallery: {
    title: "Galeri Kami",
    eyebrow: "DOKUMENTASI",
    layout: "grid",
    items: [
      { image_url: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&q=80", caption: "Suasana hangat di dalam kafe", alt_text: "Interior kafe" },
      { image_url: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&q=80", caption: "Barista menyajikan kopi pilihan", alt_text: "Barista" },
      { image_url: "https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=600&q=80", caption: "Area outdoor yang nyaman", alt_text: "Area outdoor" },
      { image_url: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=600&q=80", caption: "Menu spesial andalan", alt_text: "Menu spesial" },
      { image_url: "https://images.unsplash.com/photo-1504630083234-14187a9df0f5?w=600&q=80", caption: "Sudut baca dan coworking", alt_text: "Sudut baca" },
      { image_url: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600&q=80", caption: "Tampilan dari luar kafe", alt_text: "Tampilan luar" },
    ],
  },
  catalog: {
    title: "Produk Kami",
    categories: [
      {
        name: "Kopi Kemasan",
        items: assignItemImages([
          { name: "Gayo Arabica 250g", description: "Kopi bubuk roasting medium.", price: "Rp 85.000", image_url: "", badge: "Terlaris" },
          { name: "Biji Kopi Robusta 500g", description: "Biji kopi robusta pilihan dari Lampung.", price: "Rp 110.000", badge: "Premium" },
          { name: "Cold Brew Pack 1L", description: "Cold brew siap minum dalam kemasan botol.", price: "Rp 55.000" },
        ]),
      },
    ],
  },
  faq: {
    title: "Pertanyaan Umum",
    items: [
      { question: "Di mana lokasi Kopi Nusantara?", answer: "Kami berlokasi di pusat kota. Hubungi kami via WhatsApp untuk arah detail." },
      { question: "Apakah ada tempat parkir?", answer: "Ya, tersedia area parkir yang luas untuk motor dan mobil." },
      { question: "Apakah tersedia WiFi?", answer: "WiFi gratis dengan kecepatan tinggi tersedia untuk semua pengunjung." },
    ],
  },
  cta: {
    headline: "Tempat Duduk Favorit Menunggu Anda",
    subheadline: "Isi form di bawah atau langsung WhatsApp — kami akan merespons di hari yang sama.",
    button_text: "Pesan Sekarang",
    button_url: "#contact",
    eyebrow: "MULAI SEKARANG",
    trust_signal: "Tanpa biaya awal. Tanpa komitmen.",
  },
  contact: {
    title: "Hubungi Kami",
    address: "Jl. Kopi Nusantara No. 123, Jakarta",
    phone: "+6281234567890",
    email: "hello@kopinusantara.com",
    maps_url: "https://maps.google.com",
    show_lead_form: true,
  },
  footer: {
    copyright_text: "© 2026 Kopi Nusantara. All rights reserved.",
    social_links: [],
  },
  seo: {
    title: "Kopi Nusantara",
    description: "Kopi single origin dan roti buatan rumah.",
    og_image_url: "",
  },
};
