// Sample generated content for landing page template showcase
// Mimics real AI output for different business types

export const TEMPLATE_PREFILL_MAP: Record<string, { businessType: string; businessSubType: string }> = {
  TEMPLATE_KULINER01: { businessType: "Kuliner", businessSubType: "Kafe" },
  TEMPLATE_JASA02:    { businessType: "Jasa", businessSubType: "Konsultan" },
  TEMPLATE_COLORFUL:  { businessType: "Kuliner", businessSubType: "Minuman & Bubble Tea" },
  TEMPLATE_ELEGANT:   { businessType: "Jasa", businessSubType: "Salon & Kecantikan" },
  TEMPLATE_NATURAL:   { businessType: "Toko & UMKM", businessSubType: "Produk Lokal Handmade" },
  TEMPLATE_MINIMALIST:{ businessType: "Jasa", businessSubType: "Konsultan" },
  TEMPLATE_BOLD:      { businessType: "Jasa", businessSubType: "Otomotif & Bengkel" },
  TEMPLATE_DYNAMIC:   { businessType: "Jasa", businessSubType: "Klinik & Kesehatan" },
};

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
];
