// Sample generated content for landing page template showcase
// Mimics real AI output for different business types

export const TEMPLATE_PREFILL_MAP: Record<string, { businessType: string; businessSubType: string }> = {
  TEMPLATE_KULINER01: { businessType: "Kuliner", businessSubType: "Kafe" },
  TEMPLATE_JASA02:    { businessType: "Jasa", businessSubType: "Konsultan" },
  TEMPLATE_PRODUK03:  { businessType: "Toko & UMKM", businessSubType: "Fashion & Pakaian" },
  TEMPLATE_COLORFUL:  { businessType: "Kuliner", businessSubType: "Minuman & Bubble Tea" },
  TEMPLATE_ELEGANT:   { businessType: "Jasa", businessSubType: "Salon & Kecantikan" },
  TEMPLATE_NATURAL:   { businessType: "Toko & UMKM", businessSubType: "Produk Lokal Handmade" },
  TEMPLATE_MINIMALIST:{ businessType: "Jasa", businessSubType: "Konsultan" },
  TEMPLATE_BOLD:      { businessType: "Jasa", businessSubType: "Otomotif & Bengkel" },
  TEMPLATE_FUTURISTIC:{ businessType: "Toko & UMKM", businessSubType: "Elektronik" },
  TEMPLATE_DYNAMIC:   { businessType: "Jasa", businessSubType: "Klinik & Kesehatan" },
};

type ShowcaseItem = (typeof SHOWCASE_ITEMS)[number];

/**
 * Cocokkan business_type dari Template Library dengan contoh konten showcase
 * yang relevan. Karena banyak token dari library berbagi business_type generik
 * ("Kafe", "jasa", "kuliner"), setiap aturan punya beberapa kandidat sampel dan
 * dipilih deterministik berdasarkan `seed` (id/slug token) supaya galeri tidak
 * menampilkan sampel yang sama berulang-ulang.
 */
function hashCodeSeed(seed: string): number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function findShowcaseSample(businessType: string, seed?: string | number): ShowcaseItem {
  const lower = (businessType || "").toLowerCase();
  const rules: Array<{ pattern: RegExp; indices: number[] }> = [
    { pattern: /fashion|pakaian|clothing|apparel|baju|busana/, indices: [8] },
    { pattern: /elektronik|gadget|komputer|laptop|smartphone|handphone|hp|teknologi/, indices: [9] },
    { pattern: /properti|real estate|rumah|tanah|apartemen|developer|perumahan/, indices: [10] },
    { pattern: /travel|wisata|tour|pariwisata|liburan|outbond|agen perjalanan/, indices: [11] },
    { pattern: /pendidikan|kursus|sekolah|les|bimbel|pelatihan|training|akademi|kampus/, indices: [12] },
    { pattern: /hotel|penginapan|homestay|resort|villa|guesthouse|inn/, indices: [13] },
    { pattern: /barbershop|barber|cukur|pangkas/, indices: [14] },
    { pattern: /laundry|cuci|setrika|binatu/, indices: [15] },
    { pattern: /fotografer|fotografi|foto|kamera|photography/, indices: [16] },
    { pattern: /gym|fitness|fitnes|olahraga|kebugaran|sport/, indices: [17] },
    { pattern: /salon|kecantikan|beauty|spa|wellness|facial|grooming/, indices: [3, 8] },
    { pattern: /boba|bubble|minuman|jus|smoothie/, indices: [2, 0] },
    { pattern: /produk|handmade|herbal|jamu|organik|pertanian|skincare|tani|kebun|olahan/, indices: [4, 0] },
    { pattern: /desain|arsitek|interior|studio|portfolio/, indices: [5, 16] },
    { pattern: /bengkel|otomotif|motor|mobil|servis|garasi|tuning/, indices: [6, 17] },
    { pattern: /klinik|kesehatan|gigi|dokter|medis/, indices: [7] },
    { pattern: /kafe|kopi|coffee|cafe|kuliner|restoran|makanan|bakery|kue|pastry|warung|snack|roti|teh/, indices: [0, 2, 4] },
    { pattern: /konsultan|hukum|legal|akuntan|pajak|agency|jasa|kontraktor|marketing|notaris/, indices: [1, 3, 5, 6, 7] },
  ];
  for (const rule of rules) {
    if (rule.pattern.test(lower)) {
      const hash = seed === undefined || seed === null ? 0 : hashCodeSeed(String(seed));
      return SHOWCASE_ITEMS[rule.indices[hash % rule.indices.length]];
    }
  }
  return SHOWCASE_ITEMS[1];
}

export const SHOWCASE_ITEMS = [
  {
    templateId: "TEMPLATE_KULINER01",
    label: "Kuliner & Kafe",
    businessName: "Kopi Rempah Nusantara",
    businessType: "kuliner",
    description: "Kopi rempah khas Indonesia",
    whatsapp: "6281234567890",
    content: {
      header: {
        brand_name: "Kopi Rempah Nusantara",
        nav_cta_text: "Reservasi",
        tagline: "Authentic Indonesian Coffee",
        logo_url: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNTYiIGhlaWdodD0iMjU2IiB2aWV3Qm94PSIwIDAgMjU2IDI1NiI+PHJlY3Qgd2lkdGg9IjI1NiIgaGVpZ2h0PSIyNTYiIHJ4PSI1MiIgZmlsbD0iIzc4MzUwRiIvPjx0ZXh0IHg9IjEyOCIgeT0iMTY0IiBmb250LWZhbWlseT0ic3lzdGVtLXVpLC1hcHBsZS1zeXN0ZW0sc2Fucy1zZXJpZiIgZm9udC1zaXplPSI4MCIgZm9udC13ZWlnaHQ9IjcwMCIgZmlsbD0iI2ZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+S1JOPC90ZXh0Pjwvc3ZnPg==",
      },
      hero: {
        headline: "Cita Rasa Rempah yang Tak Terlupakan",
        subheadline: "Nikmati kopi pilihan petani lokal yang diseduh dengan rempah-rempah autentik khas Nusantara. Pengalaman rasa yang berbeda di setiap tegukan.",
        cta_text: "Kunjungi Kami",
        cta_url: "https://wa.me/6281234567890",
        image_url: "https://images.unsplash.com/photo-1511920170033-f8396924c348?w=800&q=80",
        badge_text: "Dibuka Tiap Hari",
        opening_hours: "Buka 08.00–22.00",
      },
      about: {
        title: "Cerita di Balik Kopi Kami",
        body: "Kopi Rempah Nusantara dimulai dari kecintaan terhadap kopi lokal dan tradisi meracik rempah leluhur. Setiap cangkir kami adalah perpaduan biji kopi pilihan dengan rempah-rempah yang dipilih langsung dari petani.",
        image_url: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80",
        eyebrow: "MENGENAL KAMI",
        highlight_stat_1: { value: "500+", label: "Pelanggan Setia" },
        highlight_stat_2: { value: "5 thn", label: "Melayani" },
        highlight_stat_3: { value: "Jakarta", label: "Berbasis Di" },
      },
      benefits: {
        title: "Kenapa Kopi Rempah Beda?",
        eyebrow: "KEUNGGULAN",
        subtitle: "Bukan klaim — ini yang bisa Anda rasakan sendiri.",
        items: [
          { title: "Biji Kopi Lokal Pilihan", description: "Langsung dari petani Aceh, Toraja, dan Flores. Segar setiap hari." },
          { title: "Rempah Autentik", description: "Kayu manis, kapulaga, dan jahe pilihan tanpa campuran artifisial." },
          { title: "Suasana Nyaman", description: "Tempat duduk indoor & outdoor, cocok untuk kerja atau bersantai." },
        ],
      },
      menu: {
        title: "Menu Pilihan Kami",
        categories: [
          {
            name: "Kopi Signature",
            items: [
              { name: "Kopi Rempah Special", price: "Rp 35.000", description: "Espresso dengan kayu manis, kapulaga, dan susu oat", image_url: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&q=80" },
              { name: "Es Kopi Jahe", price: "Rp 28.000", description: "Cold brew dengan jahe segar dan gula aren", image_url: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&q=80" },
            ],
          },
          {
            name: "Non-Kopi",
            items: [
              { name: "Teh Rempah Panas", price: "Rp 22.000", description: "Teh hitam dengan rempah-rempah pilihan", image_url: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&q=80" },
            ],
          },
        ],
      },
      testimonials: {
        items: [
          { name: "Rina S.", role: "Pelanggan Setia", text: "Kopi paling enak yang pernah saya coba! Rempahnya terasa sekali tapi tidak berlebihan.", rating: 5 },
          { name: "Budi P.", role: "Food Blogger", text: "Tempatnya cozy banget, cocok buat kerja sambil menikmati kopi yang beda dari yang lain.", rating: 5 },
          { name: "Dewi A.", role: "Barista", text: "Kualitas biji kopinya luar biasa. Satu-satunya tempat yang pakai single origin Flores.", rating: 5 },
        ],
      },
      faq: {
        title: "Pertanyaan Umum",
        items: [
          { question: "Apakah bisa reservasi tempat?", answer: "Bisa, hubungi kami via WhatsApp untuk reservasi kelompok lebih dari 5 orang." },
          { question: "Apakah tersedia paket catering?", answer: "Ya, kami menyediakan paket kopi untuk acara kantor dan event. Hubungi kami untuk penawaran." },
        ],
      },
      cta: {
        headline: "Siap Merasakan Kopi Rempah Terbaik?",
        button_text: "WhatsApp Kami",
        button_url: "https://wa.me/6281234567890",
        subheadline: "Reservasi meja atau tanya menu spesial hari ini.",
        trust_signal: "Buka setiap hari, tidak perlu booking untuk 1-4 orang.",
      },
      contact: {
        title: "Temukan Kami",
        address: "Jl. Kemang Raya No. 45, Jakarta Selatan",
        phone: "6281234567890",
        email: "",
        maps_url: "",
        show_lead_form: false,
      },
      footer: {
        brand_name: "Kopi Rempah Nusantara",
        tagline: "Kopi rempah khas Indonesia",
        copyright_text: "© 2025 Kopi Rempah Nusantara. All rights reserved.",
      },
      seo: { title: "Kopi Rempah Nusantara", description: "", og_image_url: "" },
    },
  },
  {
    templateId: "TEMPLATE_JASA02",
    label: "Jasa & Konsultan",
    businessName: "Artha Legal Consulting",
    businessType: "jasa",
    description: "Konsultan hukum bisnis dan perizinan usaha",
    whatsapp: "6282345678901",
    content: {
      header: {
        brand_name: "Artha Legal",
        nav_cta_text: "Konsultasi Gratis",
        tagline: "Business Legal Consulting",
        logo_url: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNTYiIGhlaWdodD0iMjU2IiB2aWV3Qm94PSIwIDAgMjU2IDI1NiI+PHJlY3Qgd2lkdGg9IjI1NiIgaGVpZ2h0PSIyNTYiIHJ4PSI1MiIgZmlsbD0iIzRGNDZFNSIvPjx0ZXh0IHg9IjEyOCIgeT0iMTY0IiBmb250LWZhbWlseT0iR2VvcmdpYSwmcXVvdDtUaW1lcyBOZXcgUm9tYW4mcXVvdDssc2VyaWYiIGZvbnQtc2l6ZT0iMTAwIiBmb250LXdlaWdodD0iNzAwIiBmaWxsPSIjZmZmIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5BTDwvdGV4dD48L3N2Zz4=",
      },
      hero: {
        headline: "Bisnis Anda Aman Secara Hukum, Dari Awal",
        subheadline: "Konsultasi hukum bisnis dan perizinan usaha yang praktis. Kami bantu dari pendirian PT hingga kontrak komersial — tanpa proses yang berbelit.",
        cta_text: "Konsultasi Gratis",
        cta_url: "https://wa.me/6282345678901",
        image_url: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&q=80",
      },
      about: {
        title: "Tentang Artha Legal",
        body: "Artha Legal Consulting berdiri sejak 2017 dengan fokus pada kebutuhan hukum UMKM dan startup Indonesia. Tim kami terdiri dari praktisi hukum berpengalaman yang memahami tantangan bisnis nyata.",
        image_url: "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800&q=80",
        eyebrow: "MENGENAL KAMI",
        highlight_stat_1: { value: "300+", label: "Klien Ditangani" },
        highlight_stat_2: { value: "8 thn", label: "Pengalaman" },
        highlight_stat_3: { value: "Jakarta", label: "Berbasis Di" },
      },
      benefits: {
        title: "Kenapa Pilih Artha Legal?",
        eyebrow: "KEUNGGULAN",
        subtitle: "Solusi hukum yang praktis, bukan yang mempersulit.",
        items: [
          { title: "Respons Cepat 1×24 Jam", description: "Setiap pertanyaan dijawab dalam satu hari kerja. Kami tahu waktu Anda berharga.", stat: "1×24 jam", stat_label: "Respons" },
          { title: "Transparan & No Hidden Cost", description: "Biaya jelas di awal, tidak ada tagihan kejutan di tengah proses.", stat: "100%", stat_label: "Transparan" },
          { title: "Spesialis UMKM & Startup", description: "Kami mengerti kebutuhan dan budget bisnis yang sedang berkembang.", stat: "300+", stat_label: "Klien" },
        ],
      },
      testimonials: {
        items: [
          { name: "Hendra W.", role: "Founder, TechStartup ID", text: "Proses pendirian PT kami selesai dalam 2 minggu. Cepat, transparan, dan timnya responsif banget.", rating: 5 },
          { name: "Sari M.", role: "Owner, Butik Sari", text: "Akhirnya ada konsultan hukum yang bisa menjelaskan dengan bahasa yang saya mengerti. Sangat membantu!", rating: 5 },
          { name: "Agus R.", role: "Direktur, CV Maju Jaya", text: "Urusan perizinan yang tadinya saya takuti jadi mudah berkat bantuan tim Artha Legal.", rating: 5 },
        ],
      },
      faq: {
        title: "Pertanyaan Umum",
        items: [
          { question: "Berapa biaya konsultasi awal?", answer: "Konsultasi awal 30 menit gratis. Biaya selanjutnya transparan sesuai scope pekerjaan yang disepakati." },
          { question: "Apa saja layanan yang tersedia?", answer: "Pendirian PT/CV, perizinan usaha (NIB, SIUP), kontrak bisnis, dan konsultasi hukum umum." },
        ],
      },
      cta: {
        headline: "Mulai dengan Konsultasi Gratis Hari Ini",
        button_text: "Hubungi Sekarang",
        button_url: "https://wa.me/6282345678901",
        subheadline: "Ceritakan kebutuhan hukum bisnis Anda — kami akan bantu temukan solusinya.",
        trust_signal: "Konsultasi awal gratis. Tanpa komitmen.",
      },
      contact: {
        title: "Hubungi Kami",
        address: "Jl. Sudirman No. 28, Jakarta Pusat",
        phone: "6282345678901",
        email: "hello@arthalegal.id",
        maps_url: "",
        show_lead_form: true,
      },
      footer: {
        brand_name: "Artha Legal",
        tagline: "Konsultan hukum bisnis terpercaya",
        copyright_text: "© 2025 Artha Legal Consulting. All rights reserved.",
      },
      seo: { title: "Artha Legal Consulting", description: "", og_image_url: "" },
    },
  },
  {
    templateId: "TEMPLATE_COLORFUL",
    label: "Produk & Brand",
    businessName: "Boba Rasa",
    businessType: "kuliner",
    description: "Bubble tea kekinian dengan topping premium",
    whatsapp: "6283456789012",
    content: {
      header: {
        brand_name: "Boba Rasa",
        nav_cta_text: "Order Sekarang",
        tagline: "Bubble Tea Premium",
        logo_url: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNTYiIGhlaWdodD0iMjU2IiB2aWV3Qm94PSIwIDAgMjU2IDI1NiI+PHJlY3Qgd2lkdGg9IjI1NiIgaGVpZ2h0PSIyNTYiIHJ4PSI1MiIgZmlsbD0iI0ZGM0NBQyIvPjx0ZXh0IHg9IjEyOCIgeT0iMTY0IiBmb250LWZhbWlseT0ic3lzdGVtLXVpLC1hcHBsZS1zeXN0ZW0sc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxMDAiIGZvbnQtd2VpZ2h0PSI3MDAiIGZpbGw9IiNmZmYiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkJSPC90ZXh0Pjwvc3ZnPg==",
      },
      hero: {
        headline: "Boba Paling Hits di Kotamu!",
        subheadline: "Bubble tea premium dengan 30+ pilihan rasa dan topping. Fresh, kenyal, dan bikin nagih — pesan sekarang dan nikmati dalam 15 menit!",
        cta_text: "Order via WhatsApp",
        cta_url: "https://wa.me/6283456789012",
        image_url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
      },
      about: {
        title: "Cerita Boba Rasa",
        body: "Lahir dari obsesi terhadap bubble tea yang benar-benar enak, Boba Rasa hadir dengan bahan-bahan pilihan. Mutiara dibuat fresh setiap hari, teh dari kebun terbaik, dan susu tanpa campuran.",
        image_url: "https://images.unsplash.com/photo-1545032996-35c8c9b5b6f6?w=800&q=80",
        eyebrow: "MENGENAL KAMI",
        highlight_stat_1: { value: "30+", label: "Pilihan Rasa" },
        highlight_stat_2: { value: "1000+", label: "Order/Bulan" },
        highlight_stat_3: { value: "Bandung", label: "Berbasis Di" },
      },
      benefits: {
        title: "Kenapa Boba Rasa Beda?",
        eyebrow: "KEUNGGULAN",
        subtitle: "Lebih dari sekadar boba biasa.",
        items: [
          { title: "Mutiara Fresh Tiap Hari", description: "Tidak pakai mutiara yang dihangatkan berulang. Fresh batch setiap pagi." },
          { title: "30+ Pilihan Rasa", description: "Dari klasik brown sugar hingga taro matcha fusion. Selalu ada yang baru." },
          { title: "Ready Pickup & Delivery", description: "Bisa pickup langsung atau delivery ke alamat Anda dalam 15-30 menit." },
        ],
      },
      catalog: {
        title: "Menu Pilihan",
        categories: [
          {
            name: "Signature Series",
            items: [
              { name: "Brown Sugar Boba", price: "Rp 28.000", description: "Teh susu dengan brown sugar pearl premium", image_url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80" },
              { name: "Taro Purple Rain", price: "Rp 30.000", description: "Taro creamy dengan popping boba lychee", image_url: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&q=80" },
            ],
          },
        ],
      },
      testimonials: {
        items: [
          { name: "Citra D.", role: "Pelanggan", text: "Ini boba terenak yang pernah aku coba! Mutiaranya kenyal banget, minumannya gak terlalu manis.", rating: 5 },
          { name: "Reza F.", role: "Food Vlogger", text: "Udah coba boba di mana-mana, Boba Rasa masih juara dari segi rasa dan konsistensi.", rating: 5 },
          { name: "Nisa K.", role: "Pelanggan Setia", text: "Delivery-nya cepet dan minumannya masih seger. Langganan tiap minggu!", rating: 5 },
        ],
      },
      faq: {
        title: "Pertanyaan Umum",
        items: [
          { question: "Berapa lama delivery?", answer: "Estimasi 15-30 menit untuk area dalam kota. Tergantung jarak dan kondisi jalan." },
          { question: "Apakah bisa custom level gula & es?", answer: "Tentu! Anda bisa pilih level gula (0%, 30%, 50%, 70%, 100%) dan es (less ice, normal, extra ice)." },
        ],
      },
      cta: {
        headline: "Pengen Boba Sekarang? Yuk Order!",
        button_text: "Order via WhatsApp",
        button_url: "https://wa.me/6283456789012",
        subheadline: "Ready untuk pickup atau delivery. Minimal order Rp 25.000.",
        trust_signal: "Bayar di tempat. Gak perlu DP.",
      },
      contact: {
        title: "Hubungi Kami",
        address: "Jl. Dago No. 88, Bandung",
        phone: "6283456789012",
        email: "",
        maps_url: "",
        show_lead_form: false,
      },
      footer: {
        brand_name: "Boba Rasa",
        tagline: "Bubble tea premium, dibuat dengan cinta",
        copyright_text: "© 2025 Boba Rasa. All rights reserved.",
      },
      seo: { title: "Boba Rasa Bandung", description: "", og_image_url: "" },
    },
  },
  // ── TEMPLATE_ELEGANT ──────────────────────────────────────────────────────
  {
    templateId: "TEMPLATE_ELEGANT",
    label: "Premium & Eksklusif",
    businessName: "Noir Spa & Wellness",
    businessType: "jasa",
    description: "Spa & wellness premium untuk relaksasi total",
    whatsapp: "6284567890123",
    content: {
      header: {
        brand_name: "Noir Spa",
        nav_cta_text: "Book Sekarang",
        tagline: "Luxury Wellness Experience",
        logo_url: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNTYiIGhlaWdodD0iMjU2IiB2aWV3Qm94PSIwIDAgMjU2IDI1NiI+PHJlY3Qgd2lkdGg9IjI1NiIgaGVpZ2h0PSIyNTYiIHJ4PSI1MiIgZmlsbD0iI0M5QTg0QyIvPjx0ZXh0IHg9IjEyOCIgeT0iMTY0IiBmb250LWZhbWlseT0iR2VvcmdpYSwmcXVvdDtUaW1lcyBOZXcgUm9tYW4mcXVvdDssc2VyaWYiIGZvbnQtc2l6ZT0iMTAwIiBmb250LXdlaWdodD0iNzAwIiBmaWxsPSIjZmZmIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5OUzwvdGV4dD48L3N2Zz4=",
      },
      hero: {
        headline: "Kemewahan yang Anda Layak Dapatkan",
        subheadline: "Nikmati pengalaman spa premium dengan terapis bersertifikat dan produk perawatan eksklusif. Reservasi sekarang — slot terbatas.",
        cta_text: "Reservasi Sekarang",
        cta_url: "https://wa.me/6284567890123",
        image_url: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=80",
      },
      about: {
        title: "Tentang Noir Spa",
        body: "Noir Spa hadir untuk mereka yang menghargai ketenangan dan kemewahan sejati. Setiap treatment kami dirancang untuk memulihkan energi dan meremajakan pikiran.",
        image_url: "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=800&q=80",
        eyebrow: "TENTANG KAMI",
        highlight_stat_1: { value: "200+", label: "Klien VIP" },
        highlight_stat_2: { value: "5★", label: "Rating" },
        highlight_stat_3: { value: "Jakarta", label: "Lokasi" },
      },
      benefits: {
        title: "Pengalaman yang Tak Tertandingi",
        eyebrow: "KEUNGGULAN",
        subtitle: "Standar internasional, sentuhan lokal.",
        items: [
          { title: "Terapis Bersertifikat CIBTAC", description: "Setiap terapis kami tersertifikasi internasional dengan minimal 5 tahun pengalaman.", stat: "100%", stat_label: "Tersertifikasi" },
          { title: "Produk Eksklusif Pilihan", description: "Menggunakan produk premium dari L'Occitane, Elemis, dan brand spa kelas dunia.", stat: "Premium", stat_label: "Brand" },
          { title: "Privasi Total Terjamin", description: "Suite pribadi dengan pintu tertutup. Pengalaman Anda sepenuhnya rahasia.", stat: "100%", stat_label: "Privat" },
        ],
      },
      testimonials: {
        items: [
          { name: "Anastasia L.", role: "CEO, Fashion House", text: "Satu-satunya spa di Jakarta yang benar-benar membuat saya bisa disconnect dari dunia. Luar biasa.", rating: 5 },
          { name: "Michael T.", role: "Direktur Bank", text: "Deep tissue massage di sini adalah yang terbaik. Profesional dan efektif.", rating: 5 },
          { name: "Vanessa P.", role: "Influencer", text: "Facial treatment di Noir Spa benar-benar mengubah kulit saya. Recommended banget!", rating: 5 },
        ],
      },
      faq: {
        title: "Pertanyaan Umum",
        items: [
          { question: "Berapa lama sesi treatment?", answer: "Sesi standar 60-90 menit. Kami juga menyediakan paket half-day dan full-day retreat." },
          { question: "Apakah perlu reservasi?", answer: "Ya, reservasi wajib minimal H-1 untuk memastikan ketersediaan suite pribadi Anda." },
        ],
      },
      cta: {
        headline: "Hadiah Terbaik untuk Diri Sendiri",
        button_text: "Book via WhatsApp",
        button_url: "https://wa.me/6284567890123",
        subheadline: "Tersedia gift voucher untuk orang-orang terkasih Anda.",
        trust_signal: "Slot weekend terbatas — reservasi sekarang.",
      },
      contact: {
        title: "Temukan Kami",
        address: "Jl. SCBD Lot 18, Jakarta Selatan",
        phone: "6284567890123",
        email: "hello@noirspa.id",
        maps_url: "",
        show_lead_form: true,
      },
      footer: {
        brand_name: "Noir Spa",
        tagline: "Luxury wellness experience",
        copyright_text: "© 2025 Noir Spa & Wellness. All rights reserved.",
      },
      seo: { title: "Noir Spa & Wellness Jakarta", description: "", og_image_url: "" },
    },
  },

  // ── TEMPLATE_NATURAL ──────────────────────────────────────────────────────
  {
    templateId: "TEMPLATE_NATURAL",
    label: "Organik & Natural",
    businessName: "Dapur Herbal Ibu Sari",
    businessType: "produk",
    description: "Produk herbal dan jamu tradisional organik",
    whatsapp: "6285678901234",
    content: {
      header: {
        brand_name: "Dapur Herbal",
        nav_cta_text: "Pesan Sekarang",
        tagline: "Jamu & Herbal Organik",
        logo_url: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNTYiIGhlaWdodD0iMjU2IiB2aWV3Qm94PSIwIDAgMjU2IDI1NiI+PHJlY3Qgd2lkdGg9IjI1NiIgaGVpZ2h0PSIyNTYiIHJ4PSI1MiIgZmlsbD0iIzNENUE0NSIvPjx0ZXh0IHg9IjEyOCIgeT0iMTY0IiBmb250LWZhbWlseT0iJnF1b3Q7U0YgUHJvIERpc3BsYXkmcXVvdDssJnF1b3Q7SGVsdmV0aWNhIE5ldWUmcXVvdDssSGVsdmV0aWNhLEFyaWFsLHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTAwIiBmb250LXdlaWdodD0iNzAwIiBmaWxsPSIjZmZmIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5ESDwvdGV4dD48L3N2Zz4=",
      },
      hero: {
        headline: "Kesehatan dari Alam, Langsung ke Pintu Anda",
        subheadline: "Jamu dan herbal organik tanpa bahan kimia. Dibuat dari tanaman segar kebun sendiri, diformulasikan turun-temurun selama 3 generasi.",
        cta_text: "Pesan Sekarang",
        cta_url: "https://wa.me/6285678901234",
        image_url: "https://images.unsplash.com/photo-1611080626919-7cf5a9dbab12?w=800&q=80",
      },
      about: {
        title: "Tiga Generasi Kearifan Lokal",
        body: "Resep kami diwariskan dari nenek ke ibu ke anak — selama 60 tahun. Setiap produk dibuat dengan bahan segar dari kebun organik di Jawa Tengah, tanpa pengawet dan tanpa pewarna buatan.",
        image_url: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=800&q=80",
        eyebrow: "KISAH KAMI",
        highlight_stat_1: { value: "60 thn", label: "Resep Warisan" },
        highlight_stat_2: { value: "100%", label: "Organik" },
        highlight_stat_3: { value: "Jawa Tengah", label: "Berbasis Di" },
      },
      benefits: {
        title: "Mengapa Pilih Produk Kami?",
        eyebrow: "KEUNGGULAN",
        subtitle: "Alami, terpercaya, dan teruji secara turun-temurun.",
        items: [
          { title: "100% Bahan Organik", description: "Ditanam sendiri di kebun organik bersertifikat. Bebas pestisida dan pupuk kimia." },
          { title: "Tanpa Pengawet Buatan", description: "Diproses dengan metode tradisional, aman untuk seluruh keluarga termasuk anak-anak." },
          { title: "Resep 3 Generasi", description: "Khasiat yang sudah terbukti selama puluhan tahun oleh ribuan pelanggan setia." },
        ],
      },
      catalog: {
        title: "Produk Pilihan",
        categories: [
          {
            name: "Jamu Kesehatan",
            items: [
              { name: "Kunyit Asam Segar", price: "Rp 18.000", description: "Minuman segar kunyit dan asam jawa untuk imunitas", image_url: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=400&q=80" },
              { name: "Temulawak Madu", price: "Rp 22.000", description: "Temulawak pilihan dengan madu hutan asli", image_url: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&q=80" },
            ],
          },
        ],
      },
      testimonials: {
        items: [
          { name: "Ibu Hartati", role: "Pelanggan Setia 5 Tahun", text: "Sudah 5 tahun pakai jamu dari Dapur Herbal. Badan segar, jarang sakit. Terima kasih Bu Sari!", rating: 5 },
          { name: "Pak Bambang", role: "Pensiunan Guru", text: "Kolesterol saya turun sejak rutin minum temulawak madunya. Alhamdulillah.", rating: 5 },
          { name: "Ning R.", role: "Ibu Rumah Tangga", text: "Anakku doyan banget kunyit asamnya. Seneng karena sehat dan alami.", rating: 5 },
        ],
      },
      faq: {
        title: "Pertanyaan Umum",
        items: [
          { question: "Apakah aman untuk ibu hamil?", answer: "Beberapa produk aman untuk ibu hamil, namun kami sarankan konsultasi ke dokter terlebih dahulu. Hubungi kami untuk rekomendasi produk yang tepat." },
          { question: "Berapa lama masa simpan produk?", answer: "Produk segar 3-5 hari di kulkas. Produk kering dan serbuk bisa disimpan 3-6 bulan di tempat kering." },
        ],
      },
      cta: {
        headline: "Mulai Hidup Sehat Hari Ini",
        button_text: "Pesan via WhatsApp",
        button_url: "https://wa.me/6285678901234",
        subheadline: "Pengiriman ke seluruh Indonesia. Minimum order Rp 50.000.",
        trust_signal: "Gratis ongkir area Jawa Tengah.",
      },
      contact: {
        title: "Hubungi Kami",
        address: "Desa Ngawen, Klaten, Jawa Tengah",
        phone: "6285678901234",
        email: "",
        maps_url: "",
        show_lead_form: false,
      },
      footer: {
        brand_name: "Dapur Herbal",
        tagline: "Jamu & herbal organik 3 generasi",
        copyright_text: "© 2025 Dapur Herbal Ibu Sari. All rights reserved.",
      },
      seo: { title: "Dapur Herbal Ibu Sari", description: "", og_image_url: "" },
    },
  },

  // ── TEMPLATE_MINIMALIST ───────────────────────────────────────────────────
  {
    templateId: "TEMPLATE_MINIMALIST",
    label: "Minimalis & Editorial",
    businessName: "Studio Forma",
    businessType: "jasa",
    description: "Studio desain interior dan arsitektur",
    whatsapp: "6286789012345",
    content: {
      header: {
        brand_name: "Studio Forma",
        nav_cta_text: "Konsultasi",
        tagline: "Interior & Architecture Studio",
        logo_url: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNTYiIGhlaWdodD0iMjU2IiB2aWV3Qm94PSIwIDAgMjU2IDI1NiI+PHJlY3Qgd2lkdGg9IjI1NiIgaGVpZ2h0PSIyNTYiIHJ4PSI1MiIgZmlsbD0iIzE4MTgxQiIvPjx0ZXh0IHg9IjEyOCIgeT0iMTY0IiBmb250LWZhbWlseT0iR2VvcmdpYSwmcXVvdDtUaW1lcyBOZXcgUm9tYW4mcXVvdDssc2VyaWYiIGZvbnQtc2l6ZT0iMTAwIiBmb250LXdlaWdodD0iNzAwIiBmaWxsPSIjZmZmIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5TRjwvdGV4dD48L3N2Zz4=",
      },
      hero: {
        headline: "Ruang yang Berbicara Tanpa Kata",
        subheadline: "Desain interior dan arsitektur yang lahir dari riset mendalam, bukan tren sesaat. Kami merancang ruang yang bertahan melampaui zamannya.",
        cta_text: "Mulai Konsultasi",
        cta_url: "https://wa.me/6286789012345",
        image_url: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&q=80",
      },
      about: {
        title: "Filosofi Studio Forma",
        body: "Kami percaya desain yang baik adalah yang tak terlihat — ia bekerja dalam diam, membuat penghuninya merasa nyaman tanpa tahu mengapa. Studio Forma berdiri 2019 di Jakarta dengan fokus pada residential dan commercial space.",
        image_url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80",
        eyebrow: "TENTANG KAMI",
        highlight_stat_1: { value: "45+", label: "Proyek Selesai" },
        highlight_stat_2: { value: "5 thn", label: "Pengalaman" },
        highlight_stat_3: { value: "Jakarta", label: "Berbasis Di" },
      },
      benefits: {
        title: "Pendekatan Kami",
        eyebrow: "PROSES KERJA",
        subtitle: "Dari brief hingga selesai — terstruktur dan transparan.",
        items: [
          { title: "Research-First Design", description: "Setiap proyek dimulai dengan riset gaya hidup klien. Kami merancang untuk Anda, bukan untuk portofolio." },
          { title: "Estimasi Biaya Transparan", description: "RAB detail diberikan sebelum kontrak. Tidak ada biaya tersembunyi." },
          { title: "Project Management Penuh", description: "Kami mengawasi kontraktor dan vendor. Anda cukup pantau progres via laporan mingguan." },
        ],
      },
      testimonials: {
        items: [
          { name: "Kevin & Melissa", role: "Klien Residensial", text: "Rumah kami sekarang terasa seperti majalah arsitektur — tapi nyaman banget untuk ditinggali. Luar biasa.", rating: 5 },
          { name: "PT. Harmoni Group", role: "Klien Komersial", text: "Office baru kami meningkatkan produktivitas tim secara signifikan. Desain yang fungsional sekaligus estetis.", rating: 5 },
          { name: "Andika S.", role: "Arsitek", text: "Kolaborasi yang sangat profesional. Detail teknis sempurna, komunikasi lancar.", rating: 5 },
        ],
      },
      faq: {
        title: "Pertanyaan Umum",
        items: [
          { question: "Berapa budget minimum untuk project?", answer: "Untuk residential, minimum Rp 200 juta. Untuk konsultasi desain tanpa eksekusi, mulai Rp 5 juta." },
          { question: "Berapa lama durasi project?", answer: "Desain interior 3-6 bulan tergantung skala. Renovasi besar bisa 6-12 bulan." },
        ],
      },
      cta: {
        headline: "Wujudkan Ruang Impian Anda",
        button_text: "Jadwalkan Konsultasi",
        button_url: "https://wa.me/6286789012345",
        subheadline: "Konsultasi awal gratis 60 menit. Kami kunjungi lokasi Anda.",
        trust_signal: "Tanpa komitmen. Tanpa biaya di awal.",
      },
      contact: {
        title: "Mari Berdiskusi",
        address: "Jl. Kemang Selatan No. 12, Jakarta",
        phone: "6286789012345",
        email: "hello@studioforma.id",
        maps_url: "",
        show_lead_form: true,
      },
      footer: {
        brand_name: "Studio Forma",
        tagline: "Interior & architecture studio",
        copyright_text: "© 2025 Studio Forma. All rights reserved.",
      },
      seo: { title: "Studio Forma — Desain Interior Jakarta", description: "", og_image_url: "" },
    },
  },

  // ── TEMPLATE_BOLD ─────────────────────────────────────────────────────────
  {
    templateId: "TEMPLATE_BOLD",
    label: "Bold & Tegas",
    businessName: "Garuda Motor Sport",
    businessType: "jasa",
    description: "Bengkel modifikasi dan servis motor sport",
    whatsapp: "6287890123456",
    content: {
      header: {
        brand_name: "Garuda Motor",
        nav_cta_text: "Booking Servis",
        tagline: "Motor Sport Specialist",
        logo_url: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNTYiIGhlaWdodD0iMjU2IiB2aWV3Qm94PSIwIDAgMjU2IDI1NiI+PHJlY3Qgd2lkdGg9IjI1NiIgaGVpZ2h0PSIyNTYiIHJ4PSI1MiIgZmlsbD0iI0RDMjYyNiIvPjx0ZXh0IHg9IjEyOCIgeT0iMTY0IiBmb250LWZhbWlseT0iJnF1b3Q7U0YgTW9ubyZxdW90OyxNb25hY28sJnF1b3Q7Q291cmllciBOZXcmcXVvdDssbW9ub3NwYWNlIiBmb250LXNpemU9IjEwMCIgZm9udC13ZWlnaHQ9IjcwMCIgZmlsbD0iI2ZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+R008L3RleHQ+PC9zdmc+",
      },
      hero: {
        headline: "Bengkel Motor Sport Terpercaya di Kota",
        subheadline: "Servis, modifikasi, dan tuning motor sport dengan teknisi berpengalaman dan spare part original. Performa maksimal, harga transparan.",
        cta_text: "Booking Sekarang",
        cta_url: "https://wa.me/6287890123456",
        image_url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
      },
      about: {
        title: "Tentang Garuda Motor",
        body: "Berdiri sejak 2015, Garuda Motor Sport telah menangani lebih dari 2000 unit motor sport dari berbagai merek. Teknisi kami tersertifikasi dengan pengalaman di sirkuit lokal.",
        image_url: "https://images.unsplash.com/photo-1449130083501-b8791b7d07a5?w=800&q=80",
        eyebrow: "TENTANG KAMI",
        highlight_stat_1: { value: "2000+", label: "Unit Ditangani" },
        highlight_stat_2: { value: "9 thn", label: "Pengalaman" },
        highlight_stat_3: { value: "Surabaya", label: "Lokasi" },
      },
      benefits: {
        title: "Kenapa Garuda Motor?",
        eyebrow: "KEUNGGULAN",
        subtitle: "Bukan sekadar bengkel — ini adalah rumah motor Anda.",
        items: [
          { title: "Teknisi Tersertifikasi", description: "Semua teknisi lulus training resmi dan berpengalaman di motor sport minimal 5 tahun.", stat: "100%", stat_label: "Bersertifikat" },
          { title: "Spare Part Original", description: "Hanya pakai spare part original atau aftermarket berkualitas. Tidak ada barang KW.", stat: "ORI", stat_label: "Spare Part" },
          { title: "Garansi Servis 30 Hari", description: "Setiap pekerjaan bergaransi 30 hari. Kalau bermasalah, kami tangani tanpa biaya tambahan.", stat: "30 hr", stat_label: "Garansi" },
        ],
      },
      testimonials: {
        items: [
          { name: "Rizky A.", role: "Pengguna CBR 250RR", text: "Tuning di Garuda Motor hasilnya beda banget. Motor lebih responsif dan tarikannya smooth. Recommended!", rating: 5 },
          { name: "Doni S.", role: "Pemilik Ninja ZX", text: "Servis rutin di sini udah 3 tahun. Teknisinya jujur, harga transparan, dan hasilnya selalu memuaskan.", rating: 5 },
          { name: "Fajar M.", role: "Racing Enthusiast", text: "Modif fairing dan exhaust di sini top markotop. Kerjaan rapih dan sesuai ekspektasi.", rating: 5 },
        ],
      },
      faq: {
        title: "Pertanyaan Umum",
        items: [
          { question: "Apakah bisa booking online?", answer: "Bisa! WhatsApp kami untuk booking. Sebutkan jenis motor dan keluhan, kami siapkan teknisi yang tepat." },
          { question: "Berapa lama estimasi servis?", answer: "Servis ringan 1-2 jam. Overhaul besar 1-3 hari. Modifikasi custom sesuai scope pekerjaan." },
        ],
      },
      cta: {
        headline: "Motor Anda Pantas yang Terbaik",
        button_text: "Booking via WhatsApp",
        button_url: "https://wa.me/6287890123456",
        subheadline: "Booking sekarang, slot hari ini masih tersedia.",
        trust_signal: "Garansi 30 hari setiap pekerjaan.",
      },
      contact: {
        title: "Temukan Kami",
        address: "Jl. Raya Darmo No. 55, Surabaya",
        phone: "6287890123456",
        email: "",
        maps_url: "",
        show_lead_form: false,
      },
      footer: {
        brand_name: "Garuda Motor",
        tagline: "Motor sport specialist",
        copyright_text: "© 2025 Garuda Motor Sport. All rights reserved.",
      },
      seo: { title: "Garuda Motor Sport Surabaya", description: "", og_image_url: "" },
    },
  },

  // ── TEMPLATE_DYNAMIC ─────────────────────────────────────────────────────
  {
    templateId: "TEMPLATE_DYNAMIC",
    label: "AI Design Engine",
    businessName: "Klinik Gigi Smile Care",
    businessType: "jasa",
    description: "Klinik gigi modern dengan layanan estetik dan ortodontik",
    whatsapp: "6288901234567",
    content: {
      header: {
        brand_name: "Smile Care",
        nav_cta_text: "Booking Konsultasi",
        tagline: "Klinik Gigi Modern",
        logo_url: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNTYiIGhlaWdodD0iMjU2IiB2aWV3Qm94PSIwIDAgMjU2IDI1NiI+PHJlY3Qgd2lkdGg9IjI1NiIgaGVpZ2h0PSIyNTYiIHJ4PSI1MiIgZmlsbD0iIzdDM0FFRCIvPjx0ZXh0IHg9IjEyOCIgeT0iMTY0IiBmb250LWZhbWlseT0iJnF1b3Q7U0YgTW9ubyZxdW90OyxNb25hY28sJnF1b3Q7Q291cmllciBOZXcmcXVvdDssbW9ub3NwYWNlIiBmb250LXNpemU9IjEwMCIgZm9udC13ZWlnaHQ9IjcwMCIgZmlsbD0iI2ZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+U0M8L3RleHQ+PC9zdmc+",
      },
      hero: {
        headline: "Senyum Sempurna Dimulai di Sini",
        subheadline: "Klinik gigi modern dengan dokter spesialis berpengalaman. Dari pembersihan rutin hingga veneer estetik — semua dalam satu tempat yang nyaman.",
        cta_text: "Booking Konsultasi",
        cta_url: "https://wa.me/6288901234567",
        image_url: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800&q=80",
      },
      about: {
        title: "Tentang Smile Care",
        body: "Smile Care berdiri sejak 2018 dengan visi menghadirkan perawatan gigi berkualitas internasional yang terjangkau. Tim kami terdiri dari dokter gigi spesialis lulusan universitas ternama.",
        image_url: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=800&q=80",
        eyebrow: "TENTANG KAMI",
        highlight_stat_1: { value: "3000+", label: "Pasien Puas" },
        highlight_stat_2: { value: "7 thn", label: "Berpengalaman" },
        highlight_stat_3: { value: "Jakarta", label: "Lokasi" },
      },
      benefits: {
        title: "Mengapa Pilih Smile Care?",
        eyebrow: "KEUNGGULAN",
        subtitle: "Perawatan gigi yang Anda tidak akan takuti lagi.",
        items: [
          { title: "Dokter Spesialis Berpengalaman", description: "Semua dokter kami spesialis dengan pengalaman minimal 8 tahun. Penanganan tepat dari awal." },
          { title: "Teknologi Peralatan Modern", description: "Digital X-ray, scanner 3D, dan CAD/CAM untuk mahkota gigi. Hasil lebih akurat, proses lebih cepat." },
          { title: "Harga Transparan & Terjangkau", description: "Estimasi biaya diberikan sebelum tindakan. Tersedia cicilan 0% untuk perawatan tertentu." },
        ],
      },
      testimonials: {
        items: [
          { name: "Tania W.", role: "Pasien Ortodontik", text: "Behel di Smile Care prosesnya cepat dan hasilnya memuaskan. Dokternya sabar dan menjelaskan dengan detail.", rating: 5 },
          { name: "Budi H.", role: "Pasien Veneer", text: "Veneer gigi depan saya hasilnya natural banget. Orang-orang nggak percaya kalau itu bukan gigi asli!", rating: 5 },
          { name: "Rina M.", role: "Pasien Rutin", text: "Klinik paling nyaman yang pernah saya datangi. Tidak menunggu lama dan dokternya ramah.", rating: 5 },
        ],
      },
      faq: {
        title: "Pertanyaan Umum",
        items: [
          { question: "Apakah pemasangan behel menyakitkan?", answer: "Ada sedikit ketidaknyamanan di 2-3 hari pertama, tapi tidak menyakitkan. Tim kami akan memandu Anda dengan lengkap." },
          { question: "Berapa lama perawatan veneer?", answer: "Veneer selesai dalam 2-3 kunjungan. Total waktu sekitar 2 minggu." },
        ],
      },
      cta: {
        headline: "Investasi Terbaik: Senyum yang Percaya Diri",
        button_text: "Booking Sekarang",
        button_url: "https://wa.me/6288901234567",
        subheadline: "Konsultasi pertama gratis. Booking slot Anda sekarang.",
        trust_signal: "Bisa cicil 0% hingga 12 bulan.",
      },
      contact: {
        title: "Hubungi Kami",
        address: "Jl. Pluit Raya No. 88, Jakarta Utara",
        phone: "6288901234567",
        email: "info@smilecare.id",
        maps_url: "",
        show_lead_form: true,
      },
      footer: {
        brand_name: "Smile Care",
        tagline: "Klinik gigi modern",
        copyright_text: "© 2025 Smile Care Dental Clinic. All rights reserved.",
      },
      seo: { title: "Smile Care Klinik Gigi Jakarta", description: "", og_image_url: "" },
    },
  },

  // ── Fashion & Pakaian ────────────────────────────────────────────────────
  {
    templateId: "TEMPLATE_PRODUK03",
    label: "Fashion & Pakaian",
    businessName: "Atelier Nia",
    businessType: "fashion",
    description: "Toko pakaian wanita dan pria",
    whatsapp: "6280123456789",
    content: {
      header: {
        brand_name: "Atelier Nia",
        nav_cta_text: "Belanja Sekarang",
        tagline: "Fashion Lokal Premium",
        logo_url: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNTYiIGhlaWdodD0iMjU2IiB2aWV3Qm94PSIwIDAgMjU2IDI1NiI+PHJlY3Qgd2lkdGg9IjI1NiIgaGVpZ2h0PSIyNTYiIHJ4PSI1MiIgZmlsbD0iIzBFNzQ4OCIvPjx0ZXh0IHg9IjEyOCIgeT0iMTY0IiBmb250LWZhbWlseT0ic3lzdGVtLXVpLC1hcHBsZS1zeXN0ZW0sc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxMDAiIGZvbnQtd2VpZ2h0PSI3MDAiIGZpbGw9IiNmZmYiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkFOPC90ZXh0Pjwvc3ZnPg==",
      },
      hero: {
        headline: "Pakaian Berkualitas, Desain Kekinian",
        subheadline: "Koleksi fashion lokal yang nyaman dipakai sehari-hari dan tetap stylish di setiap momen. Tersedia untuk pria dan wanita.",
        cta_text: "Lihat Koleksi",
        cta_url: "https://wa.me/6280123456789",
        image_url: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&q=80",
      },
      about: {
        title: "Cerita Atelier Nia",
        body: "Berdiri 2020, Atelier Nia hadir untuk membuktikan bahwa fashion lokal bisa tampil premium. Setiap produk dikerjakan oleh penjahit berpengalaman dengan bahan pilihan.",
        image_url: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80",
        eyebrow: "TENTANG KAMI",
        highlight_stat_1: { value: "10rb+", label: "Produk Terjual" },
        highlight_stat_2: { value: "4 thn", label: "Beroperasi" },
        highlight_stat_3: { value: "Jakarta", label: "Berbasis Di" },
      },
      benefits: {
        title: "Kenapa Belanja di Atelier Nia?",
        eyebrow: "KEUNGGULAN",
        subtitle: "Kualitas yang bisa Anda rasakan langsung.",
        items: [
          { title: "Bahan Berkualitas", description: "Katun premium yang adem dan tidak mudah kusut. Nyaman sepanjang hari." },
          { title: "Desain Eksklusif", description: "Setiap koleksi terbatas dan tidak massal. Anda tidak akan ketemu di tempat lain." },
          { title: "Pengiriman Cepat", description: "Siap kirim ke seluruh Indonesia dengan packing rapi dan aman." },
        ],
      },
      catalog: {
        title: "Koleksi Pilihan",
        categories: [
          {
            name: "Atasan",
            items: [
              { name: "Blouse Katun Premium", price: "Rp 199.000", description: "Katun Jepang, potongan flowy, warna natural", image_url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&q=80" },
              { name: "Kemeja Linen Pria", price: "Rp 249.000", description: "Linen imported, ringan dan adem", image_url: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&q=80" },
            ],
          },
          {
            name: "Bawahan",
            items: [
              { name: "Culottes Highwaist", price: "Rp 179.000", description: "Potongan highwaist, cocok untuk semua bentuk tubuh", image_url: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=400&q=80" },
            ],
          },
        ],
      },
      testimonials: {
        items: [
          { name: "Maya S.", role: "Pelanggan", text: "Bahan blousenya lembut banget dan modelnya elegan. Sudah langganan tiap kali ada koleksi baru!", rating: 5 },
          { name: "Rizky A.", role: "Pelanggan", text: "Kemeja linannya adem dan fit-nya pas. Pengiriman juga cepet, recommended!", rating: 5 },
          { name: "Putri D.", role: "Influencer", text: "Desainnya beda dari yang lain. Kualitas jahitan rapi, worth it banget.", rating: 5 },
        ],
      },
      faq: {
        title: "Pertanyaan Umum",
        items: [
          { question: "Berapa lama proses pengiriman?", answer: "Jakarta 1-2 hari, luar kota 3-5 hari kerja tergantung kurir yang dipilih." },
          { question: "Apakah bisa tukar ukuran?", answer: "Bisa, gratis penukaran ukuran selama 7 hari dengan syarat belum dipakai." },
        ],
      },
      cta: {
        headline: "Temukan Gaya Baru Anda Hari Ini",
        button_text: "Chat WhatsApp",
        button_url: "https://wa.me/6280123456789",
        subheadline: "Konsultasikan ukuran dan gaya favorit Anda — tim kami siap membantu.",
        trust_signal: "Gratis ongkir area Jabodetabek untuk pembelian di atas Rp 300.000.",
      },
      contact: {
        title: "Hubungi Kami",
        address: "Jl. Panglima Polim No. 12, Jakarta Selatan",
        phone: "6280123456789",
        email: "hello@ateliernia.id",
        maps_url: "",
        show_lead_form: true,
      },
      footer: {
        brand_name: "Atelier Nia",
        tagline: "Fashion lokal premium",
        copyright_text: "© 2025 Atelier Nia. All rights reserved.",
      },
      seo: { title: "Atelier Nia — Fashion Lokal Premium", description: "", og_image_url: "" },
    },
  },

  // ── Elektronik & Gadget ──────────────────────────────────────────────────
  {
    templateId: "TEMPLATE_FUTURISTIC",
    label: "Elektronik & Gadget",
    businessName: "Nexbyte Store",
    businessType: "elektronik",
    description: "Toko elektronik, gadget, dan aksesori",
    whatsapp: "6281230987654",
    content: {
      header: {
        brand_name: "Nexbyte",
        nav_cta_text: "Order",
        tagline: "Gadget & Elektronik Store",
        logo_url: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNTYiIGhlaWdodD0iMjU2IiB2aWV3Qm94PSIwIDAgMjU2IDI1NiI+PHJlY3Qgd2lkdGg9IjI1NiIgaGVpZ2h0PSIyNTYiIHJ4PSI1MiIgZmlsbD0iIzAwQkZEMyIvPjx0ZXh0IHg9IjEyOCIgeT0iMTY0IiBmb250LWZhbWlseT0iU3BhY2UgR3JvdGVzayxzYW5zLXNlcmlmIiBmb250LXNpemU9IjEwMCIgZm9udC13ZWlnaHQ9IjcwMCIgZmlsbD0iIzA1MTUyNSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+Tng8L3RleHQ+PC9zdmc+",
      },
      hero: {
        headline: "Teknologi Terbaru, Harga Terbaik",
        subheadline: "Gadget, laptop, dan aksesori original dengan garansi resmi. Stok lengkap, harga bersaing, dan bisa diangsur.",
        cta_text: "Lihat Katalog",
        cta_url: "https://wa.me/6281230987654",
        image_url: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&q=80",
      },
      about: {
        title: "Tentang Nexbyte",
        body: "Nexbyte berdiri 2018 sebagai toko gadget terpercaya di Bandung. Kami menjual produk original dengan garansi resmi dan dukungan purna jual yang responsif.",
        image_url: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80",
        eyebrow: "TENTANG KAMI",
        highlight_stat_1: { value: "25rb+", label: "Transaksi" },
        highlight_stat_2: { value: "7 thn", label: "Berpengalaman" },
        highlight_stat_3: { value: "Bandung", label: "Lokasi" },
      },
      benefits: {
        title: "Mengapa Nexbyte?",
        eyebrow: "KEUNGGULAN",
        subtitle: "Belanja gadget tanpa khawatir.",
        items: [
          { title: "100% Original & Bergaransi", description: "Semua produk resmi dengan garansi distributor dan bisa dicek keasliannya." },
          { title: "Cicilan Tanpa Bunga", description: "Bisa diangsur hingga 12 bulan untuk produk di atas Rp 2 juta." },
          { title: "Tukar Tambah", description: "Serahkan gadget lama Anda dan dapatkan harga upgrade terbaik." },
        ],
      },
      catalog: {
        title: "Produk Unggulan",
        categories: [
          {
            name: "Smartphone",
            items: [
              { name: "Neo X5 Pro 256GB", price: "Rp 5.999.000", description: "AMOLED 120Hz, kamera 108MP, baterai 5000mAh", image_url: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&q=80" },
              { name: "Neo Y3 128GB", price: "Rp 3.299.000", description: "Layar 90Hz, kamera 50MP, fast charging 33W", image_url: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&q=80" },
            ],
          },
          {
            name: "Laptop & Aksesori",
            items: [
              { name: "Laptop Kreator 14\"", price: "Rp 12.499.000", description: "AMD Ryzen 7, RAM 16GB, SSD 512GB", image_url: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&q=80" },
            ],
          },
        ],
      },
      testimonials: {
        items: [
          { name: "Andre W.", role: "Pelanggan", text: "Harga paling kompetitif se-Bandung dan semua original. Garansi resmi benar-benar diproses.", rating: 5 },
          { name: "Lina M.", role: "Pelanggan", text: "Cicilannya mudah dan tanpa bunga. Proses cepat, barang dijelaskan dengan lengkap.", rating: 5 },
          { name: "Fajar K.", role: "Pelanggan", text: "Tukar tambah HP lama saya dapat harga bagus. Pelayanannya ramah dan jujur.", rating: 5 },
        ],
      },
      faq: {
        title: "Pertanyaan Umum",
        items: [
          { question: "Apakah produk bergaransi resmi?", answer: "Ya, semua produk memiliki garansi resmi distributor. Simpan struk untuk klaim garansi." },
          { question: "Bisa cicil dengan kartu apa saja?", answer: "Bisa dengan semua kartu kredit dan layanan paylater. Cicilan 0% tersedia hingga 12 bulan." },
        ],
      },
      cta: {
        headline: "Gadget Impian Anda Ada di Sini",
        button_text: "Chat WhatsApp",
        button_url: "https://wa.me/6281230987654",
        subheadline: "Tanyakan stok dan dapatkan penawaran terbaik hari ini.",
        trust_signal: "Garansi resmi + gratis pengiriman se-Indonesia.",
      },
      contact: {
        title: "Kunjungi Toko Kami",
        address: "Jl. Braga No. 101, Bandung",
        phone: "6281230987654",
        email: "cs@nexbyte.id",
        maps_url: "",
        show_lead_form: true,
      },
      footer: {
        brand_name: "Nexbyte",
        tagline: "Gadget & elektronik terpercaya",
        copyright_text: "© 2025 Nexbyte Store. All rights reserved.",
      },
      seo: { title: "Nexbyte — Toko Gadget & Elektronik Bandung", description: "", og_image_url: "" },
    },
  },

  // ── Properti & Real Estate ───────────────────────────────────────────────
  {
    templateId: "TEMPLATE_JASA02",
    label: "Properti & Real Estate",
    businessName: "Graha Vista Properti",
    businessType: "properti",
    description: "Agen properti rumah, apartemen, dan tanah",
    whatsapp: "6282340987651",
    content: {
      header: {
        brand_name: "Graha Vista",
        nav_cta_text: "Konsultasi",
        tagline: "Real Estate Consulting",
        logo_url: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNTYiIGhlaWdodD0iMjU2IiB2aWV3Qm94PSIwIDAgMjU2IDI1NiI+PHJlY3Qgd2lkdGg9IjI1NiIgaGVpZ2h0PSIyNTYiIHJ4PSI1MiIgZmlsbD0iIzBGNTRGMiIvPjx0ZXh0IHg9IjEyOCIgeT0iMTY0IiBmb250LWZhbWlseT0iSW50ZXIsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTAwIiBmb250LXdlaWdodD0iNzAwIiBmaWxsPSIjZmZmIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5HVjwvdGV4dD48L3N2Zz4=",
      },
      hero: {
        headline: "Rumah Impian Tanpa Ribet",
        subheadline: "Kami membantu Anda menemukan properti yang tepat — rumah, apartemen, atau tanah. Proses transparan, legalitas terjamin.",
        cta_text: "Konsultasi Gratis",
        cta_url: "https://wa.me/6282340987651",
        image_url: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80",
      },
      about: {
        title: "Tentang Graha Vista",
        body: "Graha Vista Properti telah membantu ribuan keluarga menemukan rumah mereka sejak 2015. Tim kami terdiri dari broker bersertifikat yang memahami pasar properti Jabodetabek.",
        image_url: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&q=80",
        eyebrow: "TENTANG KAMI",
        highlight_stat_1: { value: "1200+", label: "Properti Terjual" },
        highlight_stat_2: { value: "9 thn", label: "Pengalaman" },
        highlight_stat_3: { value: "Jakarta", label: "Berbasis Di" },
      },
      benefits: {
        title: "Kenapa Pilih Graha Vista?",
        eyebrow: "KEUNGGULAN",
        subtitle: "Mitra properti yang transparan dan tepercaya.",
        items: [
          { title: "Legalitas Terjamin", description: "Semua properti kami cek keaslian dan kelengkapan dokumennya sebelum dipasarkan.", stat: "100%", stat_label: "Terjamin" },
          { title: "Proses Tanpa Ribet", description: "Dari survey hingga akad, kami dampingi penuh. Anda tidak perlu bingung soal prosedur.", stat: "1 Stop", stat_label: "Service" },
          { title: "Pilihan Terkurasi", description: "Hanya properti dengan harga wajar dan lokasi strategis yang kami rekomendasikan.", stat: "150+", stat_label: "Listing" },
        ],
      },
      testimonials: {
        items: [
          { name: "Keluarga Hartono", role: "Pembeli Rumah", text: "Dari pencarian sampai akad, semua diurus dengan profesional. Kami dapat rumah dengan harga terbaik.", rating: 5 },
          { name: "Dina R.", role: "Investor", text: "Analisis pasar dari Graha Vista akurat. Investasi apartemen saya naik 15% dalam setahun.", rating: 5 },
          { name: "Pak Sugiarto", role: "Penjual Tanah", text: "Tanah saya terjual dalam 2 minggu dengan harga sesuai harapan. Terima kasih tim Graha Vista!", rating: 5 },
        ],
      },
      faq: {
        title: "Pertanyaan Umum",
        items: [
          { question: "Apakah ada biaya konsultasi?", answer: "Konsultasi awal gratis. Biaya komisi hanya dikenakan saat transaksi berhasil." },
          { question: "Apakah bisa dibantu pengurusan KPR?", answer: "Bisa. Kami bekerja sama dengan beberapa bank dan membantu proses pengajuan KPR Anda." },
        ],
      },
      cta: {
        headline: "Wujudkan Hunian Impian Anda",
        button_text: "Hubungi Sekarang",
        button_url: "https://wa.me/6282340987651",
        subheadline: "Ceritakan kebutuhan Anda — kami carikan properti yang paling cocok.",
        trust_signal: "Konsultasi gratis, tanpa komitmen.",
      },
      contact: {
        title: "Hubungi Kami",
        address: "Jl. TB Simatupang No. 33, Jakarta Selatan",
        phone: "6282340987651",
        email: "info@grahavista.id",
        maps_url: "",
        show_lead_form: true,
      },
      footer: {
        brand_name: "Graha Vista",
        tagline: "Mitra properti tepercaya",
        copyright_text: "© 2025 Graha Vista Properti. All rights reserved.",
      },
      seo: { title: "Graha Vista — Agen Properti Jakarta", description: "", og_image_url: "" },
    },
  },

  // ── Travel & Wisata ──────────────────────────────────────────────────────
  {
    templateId: "TEMPLATE_NATURAL",
    label: "Travel & Wisata",
    businessName: "Pesona Nusantara",
    businessType: "travel",
    description: "Paket wisata domestik dan internasional",
    whatsapp: "6283450987612",
    content: {
      header: {
        brand_name: "Pesona Nusantara",
        nav_cta_text: "Pesan Sekarang",
        tagline: "Explore Indonesia",
        logo_url: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNTYiIGhlaWdodD0iMjU2IiB2aWV3Qm94PSIwIDAgMjU2IDI1NiI+PHJlY3Qgd2lkdGg9IjI1NiIgaGVpZ2h0PSIyNTYiIHJ4PSI1MiIgZmlsbD0iIzI3NkUzMCIvPjx0ZXh0IHg9IjEyOCIgeT0iMTY0IiBmb250LWZhbWlseT0iUGxheWZhaXIgRGlzcGxheSxzZXJpZiIgZm9udC1zaXplPSI4MCIgZm9udC13ZWlnaHQ9IjcwMCIgZmlsbD0iI2ZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+UE48L3RleHQ+PC9zdmc+",
      },
      hero: {
        headline: "Jelajahi Keindahan Nusantara",
        subheadline: "Paket wisata lokal dengan pengalaman autentik. Dari pantai hingga pegunungan — perjalanan yang dirancang khusus untuk Anda.",
        cta_text: "Lihat Paket",
        cta_url: "https://wa.me/6283450987612",
        image_url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
      },
      about: {
        title: "Kisah Kami",
        body: "Pesona Nusantara lahir dari kecintaan terhadap Indonesia. Sejak 2016, kami menyusun perjalanan yang menghubungkan traveler dengan budaya dan alam lokal secara bertanggung jawab.",
        image_url: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=80",
        eyebrow: "KISAH KAMI",
        highlight_stat_1: { value: "8.000+", label: "Traveler" },
        highlight_stat_2: { value: "120+", label: "Destinasi" },
        highlight_stat_3: { value: "Yogyakarta", label: "Berbasis Di" },
      },
      benefits: {
        title: "Kenapa Travel Bareng Kami?",
        eyebrow: "KEUNGGULAN",
        subtitle: "Bukan sekadar liburan — ini pengalaman.",
        items: [
          { title: "Destinasi Tersembunyi", description: "Kami membawa Anda ke spot yang belum banyak dikunjungi turis." },
          { title: "Tur Lokal Berpengalaman", description: "Pemandu lokal yang cerita dan paham betul seluk-beluk daerahnya." },
          { title: "Travel Berkelanjutan", description: "Mendukung UMKM lokal dan destinasi yang menjaga kelestarian alam." },
        ],
      },
      catalog: {
        title: "Paket Populer",
        categories: [
          {
            name: "Domestik",
            items: [
              { name: "Trip Bromo 3D2N", price: "Rp 1.850.000", description: "Trekking sunrise, offroad, termasuk penginapan", image_url: "https://images.unsplash.com/photo-1580039650518-f0ba74b6f231?w=400&q=80" },
              { name: "Gili Trawangan 4D3N", price: "Rp 2.400.000", description: "Snorkeling, island hopping, include transport", image_url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&q=80" },
            ],
          },
          {
            name: "Paket Group",
            items: [
              { name: "Office Gathering", price: "Custom", description: "Paket outing kantor minimal 15 orang", image_url: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=400&q=80" },
            ],
          },
        ],
      },
      testimonials: {
        items: [
          { name: "Sari P.", role: "Traveler", text: "Bromo sunrise-nya unforgettable! Pemandunya sabar dan fotogenik banget. Recommended!", rating: 5 },
          { name: "Kevin T.", role: "Traveler", text: "Pertama kali ke Gili, semua diurus rapi. Tidak perlu pusing mikirin transport dan penginapan.", rating: 5 },
          { name: "Ibu Ratna", role: "Corporate Client", text: "Outing kantor kami jadi makin kompak berkat paket team building-nya. Profesional!", rating: 5 },
        ],
      },
      faq: {
        title: "Pertanyaan Umum",
        items: [
          { question: "Berapa minimal orang untuk private trip?", answer: "Private trip bisa mulai dari 2 orang. Harga menyesuaikan jumlah peserta." },
          { question: "Apakah sudah termasuk tiket masuk?", answer: "Ya, semua tiket masuk destinasi sudah termasuk dalam harga paket kecuali disebutkan lain." },
        ],
      },
      cta: {
        headline: "Rencanakan Liburan Anda Bersama Kami",
        button_text: "Pesan via WhatsApp",
        button_url: "https://wa.me/6283450987612",
        subheadline: "Beri tahu destinasi dan budget Anda — kami susun itinerary-nya.",
        trust_signal: "Booking flexible, bisa reschedule H-7.",
      },
      contact: {
        title: "Hubungi Kami",
        address: "Jl. Malioboro No. 50, Yogyakarta",
        phone: "6283450987612",
        email: "halo@pesonanusantara.id",
        maps_url: "",
        show_lead_form: true,
      },
      footer: {
        brand_name: "Pesona Nusantara",
        tagline: "Jelajah Indonesia lebih dekat",
        copyright_text: "© 2025 Pesona Nusantara Tours. All rights reserved.",
      },
      seo: { title: "Pesona Nusantara — Paket Wisata Indonesia", description: "", og_image_url: "" },
    },
  },

  // ── Pendidikan & Kursus ──────────────────────────────────────────────────
  {
    templateId: "TEMPLATE_MINIMALIST",
    label: "Pendidikan & Kursus",
    businessName: "Lingua Academy",
    businessType: "pendidikan",
    description: "Kursus bahasa asing dan keterampilan",
    whatsapp: "6284560987312",
    content: {
      header: {
        brand_name: "Lingua Academy",
        nav_cta_text: "Daftar Sekarang",
        tagline: "Language & Skill School",
        logo_url: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNTYiIGhlaWdodD0iMjU2IiB2aWV3Qm94PSIwIDAgMjU2IDI1NiI+PHJlY3Qgd2lkdGg9IjI1NiIgaGVpZ2h0PSIyNTYiIHJ4PSI1MiIgZmlsbD0iIzIyMjIyOCIvPjx0ZXh0IHg9IjEyOCIgeT0iMTY0IiBmb250LWZhbWlseT0iSW50ZXIsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTAwIiBmb250LXdlaWdodD0iNzAwIiBmaWxsPSIjZmZmIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5MQTwvdGV4dD48L3N2Zz4=",
      },
      hero: {
        headline: "Belajar Bahasa, Buka Dunia Baru",
        subheadline: "Kursus bahasa Inggris, Jepang, dan Mandarin dengan metode praktis. Kelas kecil, tutor berpengalaman, hasil nyata.",
        cta_text: "Mulai Belajar",
        cta_url: "https://wa.me/6284560987312",
        image_url: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80",
      },
      about: {
        title: "Tentang Lingua Academy",
        body: "Sejak 2017, Lingua Academy telah membantu lebih dari 3.000 siswa mencapai target bahasa mereka — dari persiapan TOEFL hingga lancar bicara di depan umum.",
        image_url: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80",
        eyebrow: "TENTANG KAMI",
        highlight_stat_1: { value: "3.000+", label: "Siswa" },
        highlight_stat_2: { value: "30+", label: "Pengajar" },
        highlight_stat_3: { value: "Jakarta", label: "Berbasis Di" },
      },
      benefits: {
        title: "Mengapa Lingua?",
        eyebrow: "KEUNGGULAN",
        subtitle: "Metode belajar yang benar-benar membuat Anda mahir.",
        items: [
          { title: "Kelas Kecil Maks. 10 Orang", description: "Fokus dan personal. Setiap siswa dapat perhatian penuh dari tutor." },
          { title: "Tutor Tersertifikasi", description: "Pengajar lulusan sastra dan bersertifikat CELTA/TESOL." },
          { title: "Jadwal Fleksibel", description: "Offline di lokasi atau online dari rumah, sesuaikan dengan aktivitas Anda." },
        ],
      },
      catalog: {
        title: "Program Kami",
        categories: [
          {
            name: "Bahasa Asing",
            items: [
              { name: "English Daily Conversation", price: "Rp 900.000/bln", description: "12 sesi, fokus percakapan sehari-hari", image_url: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=400&q=80" },
              { name: "TOEFL/IELTS Preparation", price: "Rp 1.500.000/bln", description: "16 sesi + 2 simulasi test", image_url: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&q=80" },
            ],
          },
          {
            name: "Soft Skill",
            items: [
              { name: "Public Speaking", price: "Rp 1.200.000", description: "6 sesi intensif 2 minggu", image_url: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=400&q=80" },
            ],
          },
        ],
      },
      testimonials: {
        items: [
          { name: "Rena F.", role: "Alumni English", text: "Baru 3 bulan sudah berani ngobrol bahasa Inggris di kantor. Tutornya sabar banget!", rating: 5 },
          { name: "Dimas A.", role: "Alumni TOEFL", text: "Skor TOEFL saya naik dari 450 ke 610. Metodenya terstruktur dan simulasinya mirip aslinya.", rating: 5 },
          { name: "Mbak Ayu", role: "Alumni Jepang", text: "Belajar Jepang di sini seru, tidak kaku. Bisa langsung praktik dari sesi pertama.", rating: 5 },
        ],
      },
      faq: {
        title: "Pertanyaan Umum",
        items: [
          { question: "Berapa lama satu level kursus?", answer: "Satu level umumnya 2-3 bulan tergantung program dan frekuensi pertemuan." },
          { question: "Apakah ada kelas online?", answer: "Ada. Semua program tersedia dalam format online dengan materi yang sama." },
        ],
      },
      cta: {
        headline: "Mulai Perjalanan Belajar Anda",
        button_text: "Daftar via WhatsApp",
        button_url: "https://wa.me/6284560987312",
        subheadline: "Konsultasi gratis untuk menentukan program yang tepat.",
        trust_signal: "Free placement test untuk siswa baru.",
      },
      contact: {
        title: "Hubungi Kami",
        address: "Jl. Gatot Subroto No. 77, Jakarta",
        phone: "6284560987312",
        email: "hello@linguaacademy.id",
        maps_url: "",
        show_lead_form: true,
      },
      footer: {
        brand_name: "Lingua Academy",
        tagline: "Language & skill school",
        copyright_text: "© 2025 Lingua Academy. All rights reserved.",
      },
      seo: { title: "Lingua Academy — Kursus Bahasa Jakarta", description: "", og_image_url: "" },
    },
  },

  // ── Hotel & Penginapan ───────────────────────────────────────────────────
  {
    templateId: "TEMPLATE_ELEGANT",
    label: "Hotel & Penginapan",
    businessName: "The Arva Hotel",
    businessType: "hotel",
    description: "Hotel butik bintang empat di pusat kota",
    whatsapp: "6285670987421",
    content: {
      header: {
        brand_name: "The Arva",
        nav_cta_text: "Reservasi",
        tagline: "Boutique Hotel",
        logo_url: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNTYiIGhlaWdodD0iMjU2IiB2aWV3Qm94PSIwIDAgMjU2IDI1NiI+PHJlY3Qgd2lkdGg9IjI1NiIgaGVpZ2h0PSIyNTYiIHJ4PSI1MiIgZmlsbD0iI0I1OUQ3NiIvPjx0ZXh0IHg9IjEyOCIgeT0iMTY0IiBmb250LWZhbWlseT0iQ29ybW9yYW50IEdhcmFtb25kLHNlcmlmIiBmb250LXNpemU9IjEwMCIgZm9udC1zdHlsZT0iaXRhbGljIiBmb250LXdlaWdodD0iNzAwIiBmaWxsPSIjZmZmIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5BUjwvdGV4dD48L3N2Zz4=",
      },
      hero: {
        headline: "Kenyamanan di Jantung Kota",
        subheadline: "Hotel butik dengan 85 kamar yang didesain penuh detail. Lokasi strategis, layanan personal, dan pengalaman menginap yang tak terlupakan.",
        cta_text: "Reservasi Sekarang",
        cta_url: "https://wa.me/6285670987421",
        image_url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
      },
      about: {
        title: "Tentang The Arva",
        body: "The Arva memadukan keramahtamahan lokal dengan standar internasional. Setiap kamar kami rawat dengan detail — linen premium, kasur hotel-grade, dan pemandangan kota.",
        image_url: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80",
        eyebrow: "TENTANG KAMI",
        highlight_stat_1: { value: "85", label: "Kamar" },
        highlight_stat_2: { value: "4.5★", label: "Rating Tamu" },
        highlight_stat_3: { value: "Surabaya", label: "Lokasi" },
      },
      benefits: {
        title: "Fasilitas & Layanan",
        eyebrow: "FASILITAS",
        subtitle: "Semua kebutuhan Anda tersedia dalam satu tempat.",
        items: [
          { title: "Rooftop Pool & Gym", description: "Kolam renang di lantai 8 dengan city view dan gym 24 jam." },
          { title: "Restoran & Room Service", description: "Sajian lokal dan internasional, tersedia 24 jam di kamar." },
          { title: "Meeting & Event Space", description: "Lima ruang meeting dengan kapasitas hingga 200 orang." },
        ],
      },
      catalog: {
        title: "Kamar & Tarif",
        categories: [
          {
            name: "Kamar",
            items: [
              { name: "Deluxe City View", price: "Rp 850.000/malam", description: "28m², king bed, sarapan untuk 2 orang", image_url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=80" },
              { name: "Executive Suite", price: "Rp 1.750.000/malam", description: "48m², living room, access lounge", image_url: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&q=80" },
            ],
          },
        ],
      },
      testimonials: {
        items: [
          { name: "Rachel T.", role: "Business Traveler", text: "Lokasi strategis dan kamarnya bersih banget. Sarapannya luar biasa untuk ukuran hotel butik.", rating: 5 },
          { name: "Jonathan K.", role: "Traveler", text: "Staff-nya hangat dan sigap. Rooftop pool-nya jadi spot favorit saya.", rating: 5 },
          { name: "Mei L.", role: "Wedding Guest", text: "Event space-nya cantik dan makanan prasmanannya enak-enak. Recommended untuk acara.", rating: 5 },
        ],
      },
      faq: {
        title: "Pertanyaan Umum",
        items: [
          { question: "Apakah tersedia airport pickup?", answer: "Ya, tersedia shuttle ke bandara dengan biaya terjangkau. Pesan minimal H-1." },
          { question: "Jam check-in dan check-out?", answer: "Check-in mulai pukul 14.00 dan check-out pukul 12.00. Early check-in tergantung ketersediaan." },
        ],
      },
      cta: {
        headline: "Rasakan Kenyamanan The Arva",
        button_text: "Book via WhatsApp",
        button_url: "https://wa.me/6285670987421",
        subheadline: "Reservasi langsung untuk harga terbaik dan gratis upgrade saat tersedia.",
        trust_signal: "Best rate guaranteed untuk reservasi langsung.",
      },
      contact: {
        title: "Temukan Kami",
        address: "Jl. Tunjungan No. 88, Surabaya",
        phone: "6285670987421",
        email: "reservasi@thearva.id",
        maps_url: "",
        show_lead_form: true,
      },
      footer: {
        brand_name: "The Arva",
        tagline: "Boutique hotel in the heart of the city",
        copyright_text: "© 2025 The Arva Hotel. All rights reserved.",
      },
      seo: { title: "The Arva Hotel — Hotel Butik Surabaya", description: "", og_image_url: "" },
    },
  },

  // ── Barbershop ───────────────────────────────────────────────────────────
  {
    templateId: "TEMPLATE_BOLD",
    label: "Barbershop",
    businessName: "Razor & Blade",
    businessType: "barbershop",
    description: "Barbershop untuk pria modern",
    whatsapp: "6286780987530",
    content: {
      header: {
        brand_name: "Razor & Blade",
        nav_cta_text: "Booking",
        tagline: "Gentlemen's Barbershop",
        logo_url: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNTYiIGhlaWdodD0iMjU2IiB2aWV3Qm94PSIwIDAgMjU2IDI1NiI+PHJlY3Qgd2lkdGg9IjI1NiIgaGVpZ2h0PSIyNTYiIHJ4PSI1MiIgZmlsbD0iI0M4MjcyNiIvPjx0ZXh0IHg9IjEyOCIgeT0iMTY0IiBmb250LWZhbWlseT0iT3V0Zml0LCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjcwIiBmb250LXdlaWdodD0iOTAwIiBmaWxsPSIjZmZmIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5SJmI8L3RleHQ+PC9zdmc+",
      },
      hero: {
        headline: "Gaya Pria Terbaik di Kota",
        subheadline: "Barber bersertifikat, alat steril, dan suasana maskulin yang nyaman. Dari fade rapi hingga full grooming.",
        cta_text: "Booking Slot",
        cta_url: "https://wa.me/6286780987530",
        image_url: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800&q=80",
      },
      about: {
        title: "Tentang Kami",
        body: "Razor & Blade berdiri 2019 dengan misi sederhana: memberi pria tempat nyaman untuk tampil maksimal. Tim barber kami terlatih di Jakarta dan Singapore.",
        image_url: "https://images.unsplash.com/photo-1517832606299-7ae9b720a186?w=800&q=80",
        eyebrow: "TENTANG KAMI",
        highlight_stat_1: { value: "15rb+", label: "Pelanggan" },
        highlight_stat_2: { value: "5★", label: "Rating" },
        highlight_stat_3: { value: "Medan", label: "Lokasi" },
      },
      benefits: {
        title: "Kenapa Razor & Blade?",
        eyebrow: "KEUNGGULAN",
        subtitle: "Bukan sekadar potong rambut — ini ritual.",
        items: [
          { title: "Barber Tersertifikasi", description: "Semua barber lulus training resmi dengan sertifikat nasional." },
          { title: "Alat Steril Setiap Saat", description: "Setiap alat disterilkan dengan UV sterilizer sebelum digunakan." },
          { title: "Tanpa Antre Lama", description: "Booking online, datang langsung dilayani sesuai slot Anda." },
        ],
      },
      catalog: {
        title: "Daftar Layanan",
        categories: [
          {
            name: "Hair Service",
            items: [
              { name: "Classic Haircut", price: "Rp 85.000", description: "Cuci + potong + styling + konsultasi gaya", image_url: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=400&q=80" },
              { name: "Fade & Design", price: "Rp 120.000", description: "Fade presisi dengan desain garis custom", image_url: "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=400&q=80" },
            ],
          },
          {
            name: "Grooming",
            items: [
              { name: "Full Beard Grooming", price: "Rp 95.000", description: "Shape, trim, dan hot towel treatment", image_url: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400&q=80" },
            ],
          },
        ],
      },
      testimonials: {
        items: [
          { name: "Rendra H.", role: "Pelanggan", text: "Fade-nya rapi banget dan bartender-nya tahu persis gaya yang cocok. Langganan tiap 2 minggu!", rating: 5 },
          { name: "Fikri N.", role: "Pelanggan", text: "Suasananya asik, tidak canggung. Hasil potongannya konsisten selalu bagus.", rating: 5 },
          { name: "Andi B.", role: "Pelanggan", text: "Beard grooming terbaik yang pernah saya coba. Hot towel-nya bikin rileks.", rating: 5 },
        ],
      },
      faq: {
        title: "Pertanyaan Umum",
        items: [
          { question: "Apakah harus booking dulu?", answer: "Disarankan booking untuk menghindari antrean, tapi walk-in tetap diterima jika slot tersedia." },
          { question: "Berapa lama satu sesi?", answer: "Haircut 30-45 menit, grooming lengkap sekitar 60-75 menit." },
        ],
      },
      cta: {
        headline: "Beri Gaya Terbaik untuk Dirimu",
        button_text: "Booking via WhatsApp",
        button_url: "https://wa.me/6286780987530",
        subheadline: "Amankan slot kamu sekarang, langsung dilayani saat datang.",
        trust_signal: "Gratis styling ulang jika kurang puas dalam 7 hari.",
      },
      contact: {
        title: "Temukan Kami",
        address: "Jl. Diponegoro No. 21, Medan",
        phone: "6286780987530",
        email: "",
        maps_url: "",
        show_lead_form: false,
      },
      footer: {
        brand_name: "Razor & Blade",
        tagline: "Gentlemen's barbershop",
        copyright_text: "© 2025 Razor & Blade Barbershop. All rights reserved.",
      },
      seo: { title: "Razor & Blade — Barbershop Medan", description: "", og_image_url: "" },
    },
  },

  // ── Laundry ──────────────────────────────────────────────────────────────
  {
    templateId: "TEMPLATE_PRODUK03",
    label: "Laundry & Binatu",
    businessName: "FreshClean Laundry",
    businessType: "laundry",
    description: "Laundry kiloan dan satuan dengan layanan antar jemput",
    whatsapp: "6287890987641",
    content: {
      header: {
        brand_name: "FreshClean",
        nav_cta_text: "Antar Jemput",
        tagline: "Laundry & Dry Cleaning",
        logo_url: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNTYiIGhlaWdodD0iMjU2IiB2aWV3Qm94PSIwIDAgMjU2IDI1NiI+PHJlY3Qgd2lkdGg9IjI1NiIgaGVpZ2h0PSIyNTYiIHJ4PSI1MiIgZmlsbD0iIzBBQTc5RiIvPjx0ZXh0IHg9IjEyOCIgeT0iMTY0IiBmb250LWZhbWlseT0ic3lzdGVtLXVpLC1hcHBsZS1zeXN0ZW0sc2Fucy1zZXJpZiIgZm9udC1zaXplPSI3MCIgZm9udC13ZWlnaHQ9IjcwMCIgZmlsbD0iI2ZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+RkM8L3RleHQ+PC9zdmc+",
      },
      hero: {
        headline: "Laundry Bersih, Harum, Tepat Waktu",
        subheadline: "Layanan cuci kiloan, satuan, dan dry cleaning dengan gratis antar jemput. Selesai 24 jam — garansi cuci ulang jika kurang bersih.",
        cta_text: "Pesan Antar Jemput",
        cta_url: "https://wa.me/6287890987641",
        image_url: "https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=800&q=80",
      },
      about: {
        title: "Tentang FreshClean",
        body: "FreshClean Laundry hadir untuk mempermudah hidup Anda. Dengan mesin modern dan deterjen ramah lingkungan, baju Anda bersih maksimal tanpa merusak serat kain.",
        image_url: "https://images.unsplash.com/photo-1520175480921-4edfa2983e0f?w=800&q=80",
        eyebrow: "TENTANG KAMI",
        highlight_stat_1: { value: "50rb+", label: "Order" },
        highlight_stat_2: { value: "6 thn", label: "Beroperasi" },
        highlight_stat_3: { value: "Bekasi", label: "Berbasis Di" },
      },
      benefits: {
        title: "Kenapa FreshClean?",
        eyebrow: "KEUNGGULAN",
        subtitle: "Ribet mencuci? Biar kami yang urus.",
        items: [
          { title: "Gratis Antar Jemput", description: "Jemput di rumah atau kantor Anda, gratis untuk area layanan." },
          { title: "Selesai 24 Jam", description: "Standar 24 jam. Express 6 jam tersedia untuk kebutuhan mendesak." },
          { title: "Garansi Cuci Ulang", description: "Jika ada noda tersisa, kami cuci ulang gratis tanpa syarat." },
        ],
      },
      catalog: {
        title: "Harga Layanan",
        categories: [
          {
            name: "Kiloan & Satuan",
            items: [
              { name: "Cuci Setrika Kiloan", price: "Rp 7.000/kg", description: "Cuci, setrika, dan lipat rapi", image_url: "https://images.unsplash.com/photo-1545173168-9fcf7c0e6e5d?w=400&q=80" },
              { name: "Dry Cleaning Jas", price: "Rp 35.000/pcs", description: "Perawatan khusus bahan premium", image_url: "https://images.unsplash.com/photo-1520975661595-6453be3f7070?w=400&q=80" },
            ],
          },
          {
            name: "Spesial",
            items: [
              { name: "Cuci Boneka & Karpet", price: "Rp 25.000", description: "Pembersihan khusus tanpa merusak tekstur", image_url: "https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=400&q=80" },
            ],
          },
        ],
      },
      testimonials: {
        items: [
          { name: "Tika R.", role: "Pelanggan", text: "Antar jemputnya on time dan cuciannya wangi banget. Sudah langganan 2 tahun!", rating: 5 },
          { name: "Robby S.", role: "Karyawan Kantor", text: "Jas untuk meeting selalu dikerjakan cepat dan hasilnya rapi. Recommended.", rating: 5 },
          { name: "Ibu Yuni", role: "Ibu Rumah Tangga", text: "Harga bersahabat dan hasilnya bersih. Cocok untuk keluarga besar seperti kami.", rating: 5 },
        ],
      },
      faq: {
        title: "Pertanyaan Umum",
        items: [
          { question: "Bagaimana cara pesan antar jemput?", answer: "Cukup WhatsApp, sebutkan alamat dan jumlah kiloan. Driver kami menjemput dalam 30-60 menit." },
          { question: "Apakah menangani pakaian bayi?", answer: "Ya, tersedia layanan khusus deterjen anti bakteri yang aman untuk bayi dan kulit sensitif." },
        ],
      },
      cta: {
        headline: "Tinggal Jemputan, Sisanya Kami Urus",
        button_text: "Pesan via WhatsApp",
        button_url: "https://wa.me/6287890987641",
        subheadline: "Order sebelum pukul 20.00 untuk pengambilan di hari yang sama.",
        trust_signal: "Minimal order antar jemput Rp 20.000.",
      },
      contact: {
        title: "Hubungi Kami",
        address: "Ruko Sentra Niaga No. 9, Bekasi",
        phone: "6287890987641",
        email: "",
        maps_url: "",
        show_lead_form: false,
      },
      footer: {
        brand_name: "FreshClean",
        tagline: "Laundry & dry cleaning terpercaya",
        copyright_text: "© 2025 FreshClean Laundry. All rights reserved.",
      },
      seo: { title: "FreshClean Laundry — Laundry Antar Jemput Bekasi", description: "", og_image_url: "" },
    },
  },

  // ── Fotografer ───────────────────────────────────────────────────────────
  {
    templateId: "TEMPLATE_MINIMALIST",
    label: "Fotografer & Studio",
    businessName: "Lensa Muda Studio",
    businessType: "fotografer",
    description: "Studio fotografi pernikahan, prewedding, dan produk",
    whatsapp: "6288900987752",
    content: {
      header: {
        brand_name: "Lensa Muda",
        nav_cta_text: "Booking",
        tagline: "Photography Studio",
        logo_url: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNTYiIGhlaWdodD0iMjU2IiB2aWV3Qm94PSIwIDAgMjU2IDI1NiI+PHJlY3Qgd2lkdGg9IjI1NiIgaGVpZ2h0PSIyNTYiIHJ4PSI1MiIgZmlsbD0iIzE4MTgxQiIvPjx0ZXh0IHg9IjEyOCIgeT0iMTY0IiBmb250LWZhbWlseT0iSW50ZXIsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iNzAiIGZvbnQtd2VpZ2h0PSI3MDAiIGZpbGw9IiNmZmYiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkxNPC90ZXh0Pjwvc3ZnPg==",
      },
      hero: {
        headline: "Momen Berharga, Terabadikan Sempurna",
        subheadline: "Studio fotografi untuk pernikahan, prewedding, dan produk. Tim berpengalaman dengan hasil yang natural dan penuh emosi.",
        cta_text: "Lihat Portfolio",
        cta_url: "https://wa.me/6288900987752",
        image_url: "https://images.unsplash.com/photo-1493863641943-9b68992a8d07?w=800&q=80",
      },
      about: {
        title: "Tentang Lensa Muda",
        body: "Berdiri 2018, Lensa Muda adalah tim fotografer muda yang percaya setiap momen layak diabadikan dengan jujur dan indah. Kami spesialis wedding, prewedding, dan product photography.",
        image_url: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80",
        eyebrow: "TENTANG KAMI",
        highlight_stat_1: { value: "400+", label: "Proyek" },
        highlight_stat_2: { value: "7 thn", label: "Pengalaman" },
        highlight_stat_3: { value: "Denpasar", label: "Berbasis Di" },
      },
      benefits: {
        title: "Kenapa Memilih Kami?",
        eyebrow: "KEUNGGULAN",
        subtitle: "Hasil yang bercerita, bukan sekadar jepretan.",
        items: [
          { title: "Gaya Natural & Emosional", description: "Kami menangkap momen asli, bukan pose yang dipaksakan." },
          { title: "Peralatan Profesional", description: "Kamera full-frame, lensa premium, dan editing yang konsisten." },
          { title: "Kepastian Jadwal", description: "Booking terbatas per bulan agar setiap klien mendapat perhatian penuh." },
        ],
      },
      catalog: {
        title: "Paket & Harga",
        categories: [
          {
            name: "Wedding",
            items: [
              { name: "Paket Intimate Wedding", price: "Rp 4.500.000", description: "6 jam liputan + 200 foto edited + album", image_url: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=400&q=80" },
              { name: "Paket Prewedding", price: "Rp 3.000.000", description: "1 sesi lokasi + 50 foto edited + 1 print", image_url: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=400&q=80" },
            ],
          },
          {
            name: "Produk & Bisnis",
            items: [
              { name: "Product Shoot 10 Produk", price: "Rp 1.200.000", description: "Foto produk untuk katalog & online store", image_url: "https://images.unsplash.com/photo-1471341971476-ae15ff5dd4ea?w=400&q=80" },
            ],
          },
        ],
      },
      testimonials: {
        items: [
          { name: "Rani & Bagus", role: "Klien Wedding", text: "Hasil fotonya bikin kami nangis haru. Setiap momen penting tertangkap dengan sempurna!", rating: 5 },
          { name: "PT. Toko Online", role: "Corporate Client", text: "Foto produknya meningkatkan penjualan kami. Editing rapi dan cepat.", rating: 5 },
          { name: "Devi M.", role: "Klien Prewedding", text: "Timnya fun dan bikin kami nyaman. Hasilnya natural dan elegan.", rating: 5 },
        ],
      },
      faq: {
        title: "Pertanyaan Umum",
        items: [
          { question: "Kapan hasil foto selesai?", answer: "Preview dalam 7 hari kerja, full edited dalam 3-4 minggu tergantung paket." },
          { question: "Apakah bisa request lokasi outdoor?", answer: "Bisa. Kami membantu merekomendasikan lokasi dan mengurus izin jika diperlukan." },
        ],
      },
      cta: {
        headline: "Abadikan Momen Berharga Anda",
        button_text: "Booking via WhatsApp",
        button_url: "https://wa.me/6288900987752",
        subheadline: "Konsultasi kebutuhan Anda dan dapatkan paket yang sesuai.",
        trust_signal: "Free konsultasi & revisi hingga 3x.",
      },
      contact: {
        title: "Hubungi Kami",
        address: "Jl. Sunset Road No. 120, Denpasar",
        phone: "6288900987752",
        email: "halo@lensamuda.id",
        maps_url: "",
        show_lead_form: true,
      },
      footer: {
        brand_name: "Lensa Muda",
        tagline: "Photography studio",
        copyright_text: "© 2025 Lensa Muda Studio. All rights reserved.",
      },
      seo: { title: "Lensa Muda — Jasa Fotografi Denpasar", description: "", og_image_url: "" },
    },
  },

  // ── Gym & Fitness ────────────────────────────────────────────────────────
  {
    templateId: "TEMPLATE_BOLD",
    label: "Gym & Fitness",
    businessName: "Forge Fit",
    businessType: "gym",
    description: "Gym & fitness center dengan personal trainer",
    whatsapp: "6289010987863",
    content: {
      header: {
        brand_name: "Forge Fit",
        nav_cta_text: "Daftar Member",
        tagline: "Fitness & Training Center",
        logo_url: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNTYiIGhlaWdodD0iMjU2IiB2aWV3Qm94PSIwIDAgMjU2IDI1NiI+PHJlY3Qgd2lkdGg9IjI1NiIgaGVpZ2h0PSIyNTYiIHJ4PSI1MiIgZmlsbD0iI0QzMjYyNiIvPjx0ZXh0IHg9IjEyOCIgeT0iMTY0IiBmb250LWZhbWlseT0iT3V0Zml0LCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjcwIiBmb250LXdlaWdodD0iOTAwIiBmaWxsPSIjZmZmIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5GRjwvdGV4dD48L3N2Zz4=",
      },
      hero: {
        headline: "Tempa Tubuhmu, Taklukkan Batasmu",
        subheadline: "Gym lengkap dengan alat modern dan personal trainer bersertifikat. Dari beginner hingga atlet — semua didukung untuk mencapai target.",
        cta_text: "Free Trial Class",
        cta_url: "https://wa.me/6289010987863",
        image_url: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80",
      },
      about: {
        title: "Tentang Forge Fit",
        body: "Forge Fit dibuka 2021 oleh tim atlet dan pelatih berpengalaman. Kami membangun komunitas fitness yang suportif dengan fasilitas kelas dunia.",
        image_url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80",
        eyebrow: "TENTANG KAMI",
        highlight_stat_1: { value: "2.000+", label: "Member" },
        highlight_stat_2: { value: "15+", label: "Trainer" },
        highlight_stat_3: { value: "Tangerang", label: "Lokasi" },
      },
      benefits: {
        title: "Fasilitas & Program",
        eyebrow: "KEUNGGULAN",
        subtitle: "Semua yang Anda butuhkan untuk transformasi.",
        items: [
          { title: "Free Weights & Machines", description: "Zona barbell, dumbbell hingga 50kg, dan mesin lifecenter terlengkap." },
          { title: "Kelas Grup Beragam", description: "HIIT, Yoga, Boxing, hingga Zumba — tersedia 20+ kelas per minggu." },
          { title: "Personal Training", description: "Program custom dari trainer bersertifikat yang memantau progres Anda." },
        ],
      },
      catalog: {
        title: "Keanggotaan",
        categories: [
          {
            name: "Monthly",
            items: [
              { name: "Member Basic", price: "Rp 350.000/bln", description: "Akses semua alat + 1 kelas grup", image_url: "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=400&q=80" },
              { name: "Member Plus", price: "Rp 500.000/bln", description: "Semua alat + unlimited kelas grup", image_url: "https://images.unsplash.com/photo-1517963879433-6ad2b056d712?w=400&q=80" },
            ],
          },
          {
            name: "Training",
            items: [
              { name: "Personal Training 12 Sesi", price: "Rp 3.600.000", description: "Program custom 1-on-1 dengan trainer", image_url: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=400&q=80" },
            ],
          },
        ],
      },
      testimonials: {
        items: [
          { name: "Aldi P.", role: "Member", text: "3 bulan di Forge Fit turun 12kg. Trainernya bikin program sesuai kondisi saya. Keren!", rating: 5 },
          { name: "Sinta W.", role: "Member", text: "Kelas HITT-nya seru dan energik. Fasilitasnya bersih dan lengkap.", rating: 5 },
          { name: "Bima R.", role: "Member", text: "Komunitasnya supportif banget, nggak ada yang ngejudge. Banyak teman baru.", rating: 5 },
        ],
      },
      faq: {
        title: "Pertanyaan Umum",
        items: [
          { question: "Apakah ada free trial?", answer: "Ya, free trial class untuk 1 sesi. Daftar via WhatsApp untuk jadwal." },
          { question: "Jam buka gym?", answer: "Senin-Minggu pukul 06.00-23.00. Di hari libur nasional tetap buka." },
        ],
      },
      cta: {
        headline: "Mulai Transformasimu Hari Ini",
        button_text: "Daftar via WhatsApp",
        button_url: "https://wa.me/6289010987863",
        subheadline: "Konsultasi fitness gratis dan dapatkan trial class pertama Anda.",
        trust_signal: "Tanpa biaya pendaftaran di bulan pertama.",
      },
      contact: {
        title: "Temukan Kami",
        address: "Jl. BSD Raya Utama No. 18, Tangerang Selatan",
        phone: "6289010987863",
        email: "info@forgefit.id",
        maps_url: "",
        show_lead_form: true,
      },
      footer: {
        brand_name: "Forge Fit",
        tagline: "Fitness & training center",
        copyright_text: "© 2025 Forge Fit. All rights reserved.",
      },
      seo: { title: "Forge Fit — Gym & Fitness Tangerang", description: "", og_image_url: "" },
    },
  },
];
