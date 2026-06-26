import type { ContentSection } from "@/components/templates/types";

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
        items: [
          { name: "Espresso Single Origin", description: "Biji kopi dari Gayo dengan body penuh.", price: "Rp 35.000", image_url: "" },
          { name: "Cappuccino Classic", description: "Espresso dengan steamed milk dan foam.", price: "Rp 42.000" },
        ],
      },
    ],
  },
  catalog: {
    title: "Produk Kami",
    categories: [
      {
        name: "Kopi Kemasan",
        items: [
          { name: "Gayo Arabica 250g", description: "Kopi bubuk roasting medium.", price: "Rp 85.000", image_url: "", badge: "Terlaris" },
        ],
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
