"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Search, HelpCircle, Mail, ExternalLink,
  BookOpen, Sparkles, MousePointerClick, Palette,
  ShoppingBag, MessageCircle, Globe, ChevronRight,
  CheckCircle2, Lightbulb, ArrowRight, Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getWhatsAppUrl, SUPPORT_EMAIL } from "@/lib/site-config";
import { useI18n } from "@/lib/i18n/context";

// ─── Interfaces ───────────────────────────────────────────────────────────────

interface GuideStep {
  title: string;
  desc: string;
}

interface GuideItem {
  id: string;
  category: "start" | "edit" | "design" | "catalog" | "orders" | "domain";
  badge: string;
  timeEst: string;
  title: string;
  summary: string;
  illustration: "ai-create" | "inline-edit" | "brand-style" | "catalog-manage" | "wa-order" | "publish-domain";
  steps: GuideStep[];
  tip: string;
  actionUrl: string;
  actionLabel: string;
  tags: string[];
}

interface FAQItem {
  q: string;
  a: string;
  tags?: string[];
}

interface FAQCategory {
  id: string;
  title: string;
  items: FAQItem[];
}

// ─── Data: Petunjuk Penggunaan (User Guides) ──────────────────────────────────

const GUIDES_DATA: Record<"id" | "en", GuideItem[]> = {
  id: [
    {
      id: "ai-create",
      category: "start",
      badge: "Mulai Cepat",
      timeEst: "3 Menit",
      title: "Bikin Website Pertama dengan Bantuan AI",
      summary: "Cukup ceritakan nama dan bidang usahamu, biarkan AI Webjoz merancang tata letak, teks jualan, dan foto otomatis.",
      illustration: "ai-create",
      steps: [
        {
          title: "Buka Menu Buat Website",
          desc: "Dari dashboard Webjoz, klik tombol '+ Website Baru' untuk membuka asisten pembuat website otomatis.",
        },
        {
          title: "Isi Nama & Bidang Bisnis",
          desc: "Tuliskan nama usahamu (contoh: 'Kopi Kenangan Senja') dan pilih bidang usahamu (Kuliner, Jasa, Toko Produk, dll).",
        },
        {
          title: "Ceritakan Keunggulan Produk",
          desc: "Tuliskan 1-2 kalimat singkat tentang kelebihan produkmu. Jika bingung, kamu bisa klik saran otomatis yang disiapkan AI.",
        },
        {
          title: "Pilih Desain & Website Siap",
          desc: "Pilih gaya desain yang paling kamu suka, lalu klik 'Buat Sekarang'. Websitemu selesai dalam hitungan detik!",
        },
      ],
      tip: "Semakin spesifik keunggulan bisnismu (misalnya: 'makanan rumahan higienis tanpa MSG'), teks yang dibuatkan AI akan semakin pas dan menarik pelanggan.",
      actionUrl: "/dashboard",
      actionLabel: "Mulai Buat Website",
      tags: ["bikin website", "ai", "wizard", "mulai", "daftar", "langkah pertama", "buat"],
    },
    {
      id: "inline-edit",
      category: "edit",
      badge: "Editor Layar",
      timeEst: "2 Menit",
      title: "Ubah Tulisan & Foto Cukup Sekali Klik",
      summary: "Tidak perlu koding! Cukup klik tulisan atau foto mana saja di layar untuk langsung mengetik atau mengganti gambar.",
      illustration: "inline-edit",
      steps: [
        {
          title: "Buka Editor Website",
          desc: "Dari daftar websitemu di dashboard, klik tombol 'Buka Editor' pada website yang ingin kamu ubah.",
        },
        {
          title: "Klik Teks Mana Saja untuk Mengetik",
          desc: "Arahkan kursor atau sentuh teks judul, deskripsi, atau harga di layar. Kursor ketik akan muncul dan kamu bisa langsung mengeditnya.",
        },
        {
          title: "Klik Foto untuk Mengganti Gambar",
          desc: "Klik foto produk atau banner utama, lalu pilih foto baru dari galeri HP atau komputermu.",
        },
        {
          title: "Gunakan Tombol 'Kembalikan' Jika Salah",
          desc: "Jangan khawatir salah edit! Ada tombol panah 'Kembalikan' (Undo) di bagian atas untuk membatalkan perubahan sebelumnya.",
        },
      ],
      tip: "Perubahan tulisan tersimpan secara otomatis, jadi kamu tidak perlu repot mencari tombol simpan setiap selesai mengetik kalimat.",
      actionUrl: "/dashboard",
      actionLabel: "Buka Editor Sekarang",
      tags: ["edit teks", "ganti foto", "inline edit", "ubah tulisan", "undo", "editor"],
    },
    {
      id: "brand-style",
      category: "design",
      badge: "Desain & Warna",
      timeEst: "3 Menit",
      title: "Atur Warna Toko, Huruf & Bentuk Ikon",
      summary: "Sesuaikan warna toko agar cocok dengan logomu, pilih jenis huruf yang nyaman dibaca, serta pilih variasi ikon checklist.",
      illustration: "brand-style",
      steps: [
        {
          title: "Masuk ke Tab Desain",
          desc: "Di sidebar kiri editor, pilih tab 'Desain' (ikon palet warna) untuk melihat pengaturan tampilan toko.",
        },
        {
          title: "Pilih Warna Utama Brand",
          desc: "Pilih dari palet warna populer (Oranye hangat, Biru elegan, Hijau emerald, Hitam tegas) atau klik '+' untuk memilih warna kustom sesuai logomu.",
        },
        {
          title: "Pilih Bentuk Ikon Poin Produk",
          desc: "Di bagian 'Ikon Checklist Produk', pilih bentuk poin keunggulan favoritmu: Centang (✓), Sparkle (✦), Plus (+), Tameng Garansi (🛡), Berlian (◆), atau Daun (🍃).",
        },
        {
          title: "Pilih Mode Terang atau Gelap",
          desc: "Ganti tampilan website ke Mode Gelap (Dark Mode) untuk kesan mewah/malam, atau Mode Terang (Light Mode) untuk kesan segar & ramah.",
        },
      ],
      tip: "Warna dan huruf yang kamu pilih di tab Desain akan otomatis terkunci serasi di seluruh halaman websitemu tanpa belang-belang.",
      actionUrl: "/dashboard",
      actionLabel: "Atur Desain Toko",
      tags: ["warna", "font", "desain", "huruf", "ikon", "checklist", "dark mode", "mode gelap", "brand style"],
    },
    {
      id: "catalog-manage",
      category: "catalog",
      badge: "Katalog & Menu",
      timeEst: "4 Menit",
      title: "Tambah Produk, Harga Promo & Varian",
      summary: "Pajang produk atau makananmu dengan rapi, beri foto menarik, harga diskon, hingga pilihan ukuran atau rasa.",
      illustration: "catalog-manage",
      steps: [
        {
          title: "Buka Tab Katalog / Menu",
          desc: "Di sidebar editor, klik section 'Katalog' (untuk toko produk/jasa) atau 'Menu' (untuk usaha kuliner/kafe).",
        },
        {
          title: "Buat Kategori Produk",
          desc: "Klik '+ Kategori Baru' untuk mengelompokkan barang daganganmu (misal: 'Makanan Utama', 'Minuman Segar', 'Koleksi Baju').",
        },
        {
          title: "Masukkan Detail Produk & Foto",
          desc: "Klik '+ Tambah Item'. Isi nama barang, deskripsi lezat, harga normal, serta harga promo/diskon jika sedang ada promo.",
        },
        {
          title: "Beri Badge 'Best Seller' atau 'Promo'",
          desc: "Ketik badge seperti 'Best Seller' atau 'Favorit'. Item yang memiliki badge akan otomatis dipajang di barisan atas halaman utama!",
        },
      ],
      tip: "Jika produk sedang habis, kamu cukup mengaktifkan toggle 'Stok Habis' agar pembeli tahu dan tidak memesan barang tersebut.",
      actionUrl: "/dashboard",
      actionLabel: "Kelola Produk",
      tags: ["katalog", "menu", "tambah produk", "harga", "promo", "best seller", "stok", "diskon"],
    },
    {
      id: "wa-order",
      category: "orders",
      badge: "Pemesanan",
      timeEst: "2 Menit",
      title: "Terima Pesanan Otomatis Lewat WhatsApp",
      summary: "Pelanggan bisa memilih beberapa produk ke keranjang belanja dan pesanannya terkirim rapi ke WhatsApp tokomu.",
      illustration: "wa-order",
      steps: [
        {
          title: "Pastikan Nomor WhatsApp Terisi",
          desc: "Di tab 'Kontak' pada editor, masukkan nomor WhatsApp aktif tokomu lengkap dengan awalan angka 08... atau 628...",
        },
        {
          title: "Pelanggan Memilih & Klik Pesan",
          desc: "Saat pengunjung melihat katalog di websitemu, mereka cukup klik tombol '+ Pesan' untuk memasukkan barang ke keranjang belanja.",
        },
        {
          title: "Checkout dalam 1 Pesan Rapi",
          desc: "Pelanggan klik 'Kirim Pesanan'. WhatsApp akan otomatis terbuka dengan rincian nama item, jumlah, dan total harga belanjaan.",
        },
        {
          title: "Penjual Tinggal Membalas & Kirim",
          desc: "Kamu tinggal menyapa pembeli di WhatsApp, membagikan nomor rekening atau QRIS, lalu mengirimkan pesanannya. Tanpa potongan komisi!",
        },
      ],
      tip: "Gunakan WhatsApp Business agar kamu bisa mengatur pesan balasan cepat (Quick Replies) untuk menyambut pelanggan dari website.",
      actionUrl: "/dashboard",
      actionLabel: "Cek Nomor WhatsApp",
      tags: ["whatsapp", "pesanan", "order", "keranjang belanja", "cart", "checkout", "jualan"],
    },
    {
      id: "publish-domain",
      category: "domain",
      badge: "Go Online",
      timeEst: "3 Menit",
      title: "Publikasikan Website & Pasang Domain Pribadi",
      summary: "Website bisa langsung aktif dengan alamat gratis, atau sambungkan nama domain pribadi (.com / .id) agar usahamu makin terpercaya.",
      illustration: "publish-domain",
      steps: [
        {
          title: "Klik Tombol Publikasikan",
          desc: "Di pojok kanan atas editor, klik tombol hijau 'Publikasikan'. Websitemu langsung aktif dan bisa dibuka oleh siapa saja di internet.",
        },
        {
          title: "Bagikan Alamat Gratis Tokomu",
          desc: "Kamu mendapatkan alamat website gratis langsung pakai, misalnya 'namatoko.webjoz.com'. Siap dipasang di bio Instagram & TikTok!",
        },
        {
          title: "Ingin Pakai Domain Sendiri (.com/.id)?",
          desc: "Buka menu 'Domain' di dashboard. Masukkan nama domain yang sudah kamu beli (contoh: 'tokosaya.com').",
        },
        {
          title: "Sambungkan DNS CNAME Ringan",
          desc: "Cukup ikuti petunjuk 1-langkah: tambahkan CNAME di tempat kamu membeli domain. Website akan otomatis aktif dalam hitungan menit.",
        },
      ],
      tip: "Semua website Webjoz (baik subdomain gratis maupun domain kustom) sudah otomatis dilengkapi sertifikat gembok keamanan SSL gratis seumur hidup.",
      actionUrl: "/dashboard",
      actionLabel: "Publikasikan Sekarang",
      tags: ["publish", "publikasikan", "domain", "alamat website", "custom domain", "online", "live"],
    },
  ],
  en: [
    {
      id: "ai-create",
      category: "start",
      badge: "Quick Start",
      timeEst: "3 Mins",
      title: "Create Your First Website with AI",
      summary: "Simply describe your business name and industry, and let Webjoz AI automatically craft your layout, copy, and images.",
      illustration: "ai-create",
      steps: [
        {
          title: "Open New Website Wizard",
          desc: "From your Webjoz dashboard, click the '+ New Website' button to launch the automated creation wizard.",
        },
        {
          title: "Enter Business Name & Industry",
          desc: "Provide your brand name (e.g., 'Aroma Coffee Roastery') and select your industry (Food & Beverage, Services, Retail Store, etc.).",
        },
        {
          title: "Describe Your Value Proposition",
          desc: "Write 1-2 brief sentences highlighting your key products or services. You can also pick from AI suggested bullet points.",
        },
        {
          title: "Pick a Design & Website is Live",
          desc: "Select your preferred visual style, then click 'Create Now'. Your website will be generated in seconds!",
        },
      ],
      tip: "The more specific you are about what makes your business unique, the more tailored and compelling your AI-generated copy will be.",
      actionUrl: "/dashboard",
      actionLabel: "Start Creating",
      tags: ["create website", "ai", "wizard", "start", "register", "first step"],
    },
    {
      id: "inline-edit",
      category: "edit",
      badge: "Visual Editor",
      timeEst: "2 Mins",
      title: "Click & Edit Text or Photos Instantly",
      summary: "No coding needed! Just click any headline, paragraph, or photo right on the screen to type or upload new imagery.",
      illustration: "inline-edit",
      steps: [
        {
          title: "Open the Website Editor",
          desc: "From your dashboard sites list, click 'Open Editor' on the website you want to customize.",
        },
        {
          title: "Click Any Text to Type Directly",
          desc: "Point or tap any title, description, or price on screen. A cursor appears so you can edit the text naturally.",
        },
        {
          title: "Click Photos to Upload Replacements",
          desc: "Click any product picture or hero banner, then pick a new photo from your phone gallery or computer.",
        },
        {
          title: "Use Undo If You Make a Mistake",
          desc: "Never worry about mistakes! Use the 'Undo' button in the top navigation bar to revert previous edits instantly.",
        },
      ],
      tip: "Your text edits save automatically in real-time, so there is no need to manually click save after every single phrase.",
      actionUrl: "/dashboard",
      actionLabel: "Open Editor",
      tags: ["edit text", "change photo", "inline edit", "undo", "editor"],
    },
    {
      id: "brand-style",
      category: "design",
      badge: "Design & Style",
      timeEst: "3 Mins",
      title: "Customize Colors, Typography & Feature Icons",
      summary: "Match your website colors to your logo, choose legible typography pairings, and pick your product checklist icon styles.",
      illustration: "brand-style",
      steps: [
        {
          title: "Navigate to the Design Tab",
          desc: "In the editor sidebar, select the 'Design' tab (palette icon) to explore comprehensive visual customization options.",
        },
        {
          title: "Pick Your Primary Brand Color",
          desc: "Choose from popular accent colors (Warm Orange, Royal Blue, Emerald, Deep Slate) or enter your exact HEX color code.",
        },
        {
          title: "Select Product Checklist Icons",
          desc: "Under 'Product Checklist Icon', choose your preferred bullet shape: Check (✓), Sparkle (✦), Plus (+), Shield (🛡), Diamond (◆), or Leaf (🍃).",
        },
        {
          title: "Toggle Light or Dark Mode",
          desc: "Switch to Dark Mode for luxury or nightlife aesthetics, or Light Mode for clean, fresh daytime appeal.",
        },
      ],
      tip: "Colors and typography chosen in the Design tab stay harmoniously locked across every section and page automatically.",
      actionUrl: "/dashboard",
      actionLabel: "Customize Brand Style",
      tags: ["colors", "fonts", "design", "typography", "icons", "checklist", "dark mode", "brand style"],
    },
    {
      id: "catalog-manage",
      category: "catalog",
      badge: "Catalog & Menu",
      timeEst: "4 Mins",
      title: "Add Products, Promo Discounts & Variants",
      summary: "Showcase your items with high-res photos, enticing descriptions, promo prices, and option groups like size or flavor.",
      illustration: "catalog-manage",
      steps: [
        {
          title: "Open Catalog or Menu Tab",
          desc: "In the editor sidebar, select the 'Catalog' section (for retail & services) or 'Menu' section (for culinary & cafes).",
        },
        {
          title: "Create Product Categories",
          desc: "Click '+ New Category' to organize items (e.g., 'Signature Mains', 'Specialty Drinks', 'Apparel').",
        },
        {
          title: "Enter Product Details & Photos",
          desc: "Click '+ Add Item'. Fill in the item name, description, standard price, and discounted promo price if on sale.",
        },
        {
          title: "Add Badges like 'Best Seller'",
          desc: "Assign badges like 'Best Seller' or 'New'. Badged items are automatically showcased prominently in top featured grids!",
        },
      ],
      tip: "If an item is temporarily out of stock, simply toggle 'Out of Stock' so customers know without making unfulfilled orders.",
      actionUrl: "/dashboard",
      actionLabel: "Manage Catalog",
      tags: ["catalog", "menu", "add product", "pricing", "promo", "best seller", "stock", "discount"],
    },
    {
      id: "wa-order",
      category: "orders",
      badge: "Orders & Cart",
      timeEst: "2 Mins",
      title: "Receive WhatsApp Orders with Shopping Cart",
      summary: "Shoppers can add multiple products to their cart and checkout seamlessly into your business WhatsApp number.",
      illustration: "wa-order",
      steps: [
        {
          title: "Ensure WhatsApp Number is Configured",
          desc: "In the 'Contact' tab of the editor, enter your active WhatsApp business phone number.",
        },
        {
          title: "Visitors Select & Add to Cart",
          desc: "When customers browse your catalog, they simply click '+ Order' to add items with their chosen variants to the cart.",
        },
        {
          title: "Instant 1-Click Checkout",
          desc: "Customers click 'Send Order'. WhatsApp opens with a neat receipt listing item names, quantities, and total order sum.",
        },
        {
          title: "Reply & Ship with 0% Commission",
          desc: "Reply directly to the customer on WhatsApp, share your payment details or QRIS, and fulfill the order with zero platform cut!",
        },
      ],
      tip: "Use WhatsApp Business to configure Quick Replies and greeting messages for customers arriving from your website.",
      actionUrl: "/dashboard",
      actionLabel: "Check WhatsApp Number",
      tags: ["whatsapp", "orders", "shopping cart", "cart", "checkout", "sales"],
    },
    {
      id: "publish-domain",
      category: "domain",
      badge: "Go Live",
      timeEst: "3 Mins",
      title: "Publish Website & Connect Custom Domain",
      summary: "Your website goes live immediately on a free address, or you can attach your own custom domain (.com / .id) for full credibility.",
      illustration: "publish-domain",
      steps: [
        {
          title: "Click the Publish Button",
          desc: "In the top right corner of the editor, click the green 'Publish' button. Your site goes live instantly to the global web.",
        },
        {
          title: "Share Your Free Web Address",
          desc: "You get a free ready-to-share address like 'yourbrand.webjoz.com' — ready for your Instagram & TikTok bio!",
        },
        {
          title: "Connect Your Own Domain (.com/.id)",
          desc: "Go to the 'Domain' tab in your dashboard. Type your registered domain name (e.g., 'yourbrand.com').",
        },
        {
          title: "Add Simple DNS CNAME Record",
          desc: "Follow the 1-step guide: add a CNAME record at your domain registrar. Your custom domain verifies in minutes.",
        },
      ],
      tip: "Every Webjoz site (both free subdomains and custom domains) includes free, lifetime SSL security encryption automatically.",
      actionUrl: "/dashboard",
      actionLabel: "Publish Website",
      tags: ["publish", "domain", "custom domain", "live", "address", "dns"],
    },
  ],
};

// ─── Data: Tanya Jawab (FAQ) ──────────────────────────────────────────────────

const FAQ_DATA: Record<"id" | "en", FAQCategory[]> = {
  id: [
    {
      id: "getting-started",
      title: "Memulai",
      items: [
        {
          q: "Apa itu Webjoz?",
          a: "Webjoz adalah platform AI website builder yang membantu Anda membuat website bisnis profesional dalam hitungan menit. Cukup deskripsikan bisnis Anda, pilih template, dan AI kami akan membuatkan website lengkap untuk Anda — tanpa perlu coding.",
        },
        {
          q: "Bagaimana cara membuat website pertama?",
          a: 'Klik "+ Website Baru" di dashboard, lalu ikuti wizard percakapan. Deskripsikan bisnis Anda (jenis usaha, produk/jasa, target pelanggan), pilih template yang sesuai, dan AI akan menggenerate website Anda. Anda bisa langsung publish atau edit terlebih dahulu.',
        },
        {
          q: "Apakah saya perlu bisa coding?",
          a: "Tidak sama sekali. Webjoz dirancang untuk non-technical users. Semua proses pembuatan website dilakukan melalui wizard visual dan AI. Anda cukup menyediakan informasi bisnis Anda.",
        },
        {
          q: "Berapa lama waktu yang dibutuhkan untuk membuat website?",
          a: "Biasanya 3-10 menit tergantung kompleksitas bisnis Anda. AI kami akan generate konten, struktur halaman, dan desain secara otomatis. Anda bisa langsung publish atau melakukan customisasi lebih lanjut.",
        },
      ],
    },
    {
      id: "features",
      title: "Fitur",
      items: [
        {
          q: "Fitur apa saja yang tersedia?",
          a: "Webjoz menyediakan: AI website generator, custom domain, SEO optimization, product catalog, blog, lead capture form, analytics, testimonial collection, dan integrasi WhatsApp. Semua fitur ini sudah termasuk dalam paket Anda.",
        },
        {
          q: "Bisakah saya menggunakan domain sendiri?",
          a: "Ya! Anda bisa menghubungkan custom domain yang sudah Anda miliki, atau membeli domain baru langsung dari dashboard Webjoz. Kami mendukung domain .com, .co.id, .id, dan banyak TLD lainnya.",
        },
        {
          q: "Apakah website saya SEO-friendly?",
          a: "Ya. Setiap website yang dibuat dengan Webjoz sudah dioptimasi untuk SEO — termasuk meta tags, structured data, sitemap, dan responsive design. Anda juga bisa mengatur title, description, dan keywords untuk setiap halaman.",
        },
        {
          q: "Bagaimana cara kerja lead capture?",
          a: "Website Anda akan memiliki form kontak yang otomatis mengumpulkan nama, email, telepon, dan pesan dari pengunjung. Semua leads tersimpan di dashboard dan bisa Anda kelola, balas, atau export.",
        },
        {
          q: "Apakah ada analytics bawaan?",
          a: "Ya. Dashboard analytics menunjukkan total pageviews, traffic per hari, halaman terpopuler, dan sumber traffic. Data ini di-update secara real-time.",
        },
      ],
    },
    {
      id: "catalog-menu",
      title: "Katalog & Menu",
      items: [
        {
          q: "Apa perbedaan antara Katalog dan Menu?",
          a: "Katalog cocok untuk toko produk fisik/digital — menampilkan foto, harga, fitur, dan spesifikasi. Menu cocok untuk bisnis kuliner — menampilkan hidangan per kategori lengkap dengan tags (mis. Vegetarian, Halal, Pedas) dan link order di platform delivery (GrabFood, GoFood, dll). Keduanya memiliki fitur pencarian, filter kategori, varian/add-on, dan pemesanan via WhatsApp.",
          tags: ["katalog", "menu", "produk"],
        },
        {
          q: "Bagaimana cara menambah kategori dan produk?",
          a: "Buka Dashboard → Website → tab Katalog/Menu. Klik '+ Kategori Baru' untuk membuat kategori (mis. Minuman, Makanan Utama). Di dalam kategori, klik '+ Tambah Item' untuk menambah produk/menu. Setiap item bisa diisi dengan: nama, deskripsi, harga, foto (bisa banyak), badge (mis. Best Seller), status stok, dan varian/add-on.",
          tags: ["kategori", "tambah produk", "item"],
        },
        {
          q: "Bagaimana sistem pemesanan via WhatsApp bekerja?",
          a: "Pengunjung memilih produk/menu, klik 'Pesan', pilih varian/add-on jika ada, lalu klik 'Kirim ke WhatsApp'. Pesan otomatis berisi daftar item yang dipesan (nama, varian, harga, jumlah) akan terbuka di WhatsApp dan dikirim langsung ke nomor bisnis Anda. Tidak perlu aplikasi kasir tambahan.",
          tags: ["whatsapp", "pesan", "order", "checkout"],
        },
        {
          q: "Bisakah pengunjung memesan banyak item sekaligus?",
          a: "Ya! Ada keranjang belanja (cart) yang bisa menampung banyak item dari berbagai kategori sekaligus. Pengunjung tinggal klik tombol '+ Pesan' di setiap item untuk menambahkan ke keranjang, lalu checkout semuanya sekaligus ke WhatsApp dalam satu pesan yang terstruktur.",
          tags: ["keranjang", "cart", "banyak item", "checkout"],
        },
      ],
    },
    {
      id: "domains",
      title: "Domain",
      items: [
        {
          q: "Bagaimana cara menghubungkan custom domain?",
          a: 'Buka halaman Website → pilih website → tab "Domain". Masukkan domain Anda, lalu ikuti instruksi DNS setup (tambahkan CNAME record atau A record). DNS akan terverifikasi dalam beberapa menit.',
        },
        {
          q: "Berapa lama verifikasi domain?",
          a: "Biasanya 5-30 menit tergantung provider DNS Anda. Jika lebih lama dari 1 jam, pastikan DNS record sudah benar dan tunggu propagation (bisa hingga 48 jam di kasus ekstrem).",
        },
      ],
    },
    {
      id: "billing",
      title: "Pembayaran & Paket",
      items: [
        {
          q: "Metode pembayaran apa yang diterima?",
          a: "Kami menerima: Transfer Bank (BCA, Mandiri, BRI, BNI), E-Wallet (GoPay, OVO, DANA, ShopeePay), Kartu Kredit/Debit, dan PayPal untuk pembayaran internasional.",
        },
        {
          q: "Apakah ada free trial?",
          a: "Paket Free tersedia tanpa batas waktu. Anda bisa mencoba fitur dasar dan membuat 1 website. Jika ingin fitur lengkap, Anda bisa upgrade ke Pro kapan saja.",
        },
      ],
    },
  ],
  en: [
    {
      id: "getting-started",
      title: "Getting Started",
      items: [
        {
          q: "What is Webjoz?",
          a: "Webjoz is an AI website builder platform that helps you create a professional business website in minutes. Simply describe your business, choose a template, and our AI will build a complete website for you — no coding required.",
        },
        {
          q: "How do I create my first website?",
          a: 'Click "+ New Website" in the dashboard, then follow the conversation wizard. Describe your business (type, products/services, target customers), choose a suitable template, and AI will generate your website. You can publish immediately or edit first.',
        },
        {
          q: "Do I need to know how to code?",
          a: "Not at all. Webjoz is designed for non-technical users. The entire website creation process is done through a visual wizard and AI. You just need to provide your business information.",
        },
      ],
    },
    {
      id: "features",
      title: "Features",
      items: [
        {
          q: "What features are available?",
          a: "Webjoz provides: AI website generator, custom domain, SEO optimization, product catalog, blog, lead capture form, analytics, testimonial collection, and WhatsApp integration. All features are included in your plan.",
        },
        {
          q: "Can I use my own domain?",
          a: "Yes! You can connect a custom domain you already own, or buy a new domain directly from the Webjoz dashboard. We support .com, .co.id, .id, and many other TLDs.",
        },
      ],
    },
    {
      id: "catalog-menu",
      title: "Catalog & Menu",
      items: [
        {
          q: "How does ordering via WhatsApp work?",
          a: "Visitors browse products, click 'Order', choose variants if any, and click 'Send to WhatsApp'. A structured message with item list, variants, and total price opens automatically in WhatsApp directly to your phone.",
        },
        {
          q: "Can customers order multiple items at once?",
          a: "Yes! The built-in shopping cart holds multiple items across different categories. Customers simply add items to cart and checkout in one comprehensive WhatsApp message.",
        },
      ],
    },
    {
      id: "domains",
      title: "Domains",
      items: [
        {
          q: "How do I connect a custom domain?",
          a: 'Go to Website → select website → "Domain" tab. Enter your domain, then follow the DNS setup instructions (add CNAME or A record). DNS will be verified within a few minutes.',
        },
      ],
    },
  ],
};

// ─── Localized Text Strings ───────────────────────────────────────────────────

const TEXT = {
  id: {
    back: "← Kembali ke Beranda",
    badge: "Pusat Bantuan & Panduan",
    title: "Ada yang bisa kami bantu?",
    subtitle: "Pelajari petunjuk penggunaan langkah demi langkah atau cari jawaban atas pertanyaan umum di bawah.",
    searchPlaceholder: "Cari panduan atau pertanyaan... (contoh: bikin website, ganti foto, whatsapp, domain)",
    clear: "Hapus",
    tabGuides: "📖 Petunjuk Penggunaan",
    tabFaq: "❓ Tanya Jawab (FAQ)",
    allGuides: "Semua Panduan",
    allCategories: "Semua Kategori",
    stepsTitle: "Langkah-Langkah Praktis:",
    proTipBadge: "TIPS SUKSES",
    hideDetails: "Tutup Panduan",
    viewDetails: "Lihat Langkah Lengkap",
    noResults: (q: string) => `Tidak ada hasil untuk "${q}"`,
    noResultsSub: "Coba kata kunci lain atau hubungi Customer Service kami langsung.",
    ctaTitle: "Masih butuh bantuan langsung?",
    ctaDesc: "Tim Customer Service Webjoz siap memandu Anda langsung via WhatsApp!",
    ctaHours: "📞 +62 851-1122-1044 · Senin–Sabtu 08.00–21.00 WIB",
    ctaWa: "Chat via WhatsApp",
    ctaEmail: "Kirim Email",
    waMsg: "Halo CS Webjoz, saya butuh panduan menggunakan website",
    matchingGuides: "Petunjuk Penggunaan Terkait",
    matchingFaq: "Tanya Jawab Terkait",
  },
  en: {
    back: "← Back to Home",
    badge: "Help & User Guide Center",
    title: "How can we help you?",
    subtitle: "Explore step-by-step user guides or search answers to frequently asked questions.",
    searchPlaceholder: "Search guides or questions... (e.g. create site, change photo, whatsapp, domain)",
    clear: "Clear",
    tabGuides: "📖 User Guides",
    tabFaq: "❓ FAQ",
    allGuides: "All Guides",
    allCategories: "All Categories",
    stepsTitle: "Step-by-Step Instructions:",
    proTipBadge: "PRO TIP",
    hideDetails: "Close Guide",
    viewDetails: "View Full Steps",
    noResults: (q: string) => `No results for "${q}"`,
    noResultsSub: "Try a different keyword or contact our support team directly.",
    ctaTitle: "Still need direct assistance?",
    ctaDesc: "Webjoz Customer Support is ready to assist you directly via WhatsApp!",
    ctaHours: "📞 +62 851-1122-1044 · Mon–Sat 08.00–21.00 WIB",
    ctaWa: "Chat on WhatsApp",
    ctaEmail: "Send Email",
    waMsg: "Hi Webjoz Support, I need some guidance using the platform",
    matchingGuides: "Matching User Guides",
    matchingFaq: "Matching FAQ Items",
  },
};

// ─── Visual Mini-Mockup Illustration Component ────────────────────────────────

function GuideIllustration({ type }: { type: GuideItem["illustration"] }) {
  switch (type) {
    case "ai-create":
      return (
        <div className="w-full rounded-xl p-3.5 bg-gradient-to-br from-primary/10 via-background to-primary/5 border border-primary/20 space-y-2.5">
          <div className="flex items-center justify-between text-[11px] font-semibold text-primary">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Asisten AI Webjoz
            </span>
            <span className="px-2 py-0.5 rounded-full bg-primary/15 text-[10px]">Otomatis</span>
          </div>
          <div className="p-2 rounded-lg bg-card/80 border border-border/60 text-xs text-muted-foreground flex items-center justify-between">
            <span className="italic">"Kopi susu gula aren, suasana tenang & working space..."</span>
            <span className="text-[10px] bg-primary text-primary-foreground font-bold px-2 py-0.5 rounded-md shrink-0">AI Generate</span>
          </div>
          <div className="flex gap-2">
            <div className="flex-1 p-2 rounded-lg bg-card border border-border text-[10px] space-y-1">
              <div className="w-12 h-2 rounded bg-primary/40" />
              <div className="w-full h-1.5 rounded bg-muted-foreground/30" />
              <div className="w-3/4 h-1.5 rounded bg-muted-foreground/20" />
            </div>
            <div className="w-16 h-12 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center text-primary font-bold text-[9px] shrink-0">
              Preview
            </div>
          </div>
        </div>
      );

    case "inline-edit":
      return (
        <div className="w-full rounded-xl p-3.5 bg-gradient-to-br from-blue-500/10 via-background to-blue-500/5 border border-blue-500/20 space-y-2.5">
          <div className="flex items-center justify-between text-[11px] font-semibold text-blue-500">
            <span className="flex items-center gap-1.5">
              <MousePointerClick className="w-3.5 h-3.5" />
              Klik & Ketik Langsung
            </span>
            <span className="px-2 py-0.5 rounded-full bg-blue-500/15 text-[10px]">Inline Edit</span>
          </div>
          <div className="p-2.5 rounded-lg bg-card border-2 border-dashed border-blue-500/60 relative">
            <span className="text-xs font-bold text-foreground">Kopi Spesial Tubruk Nusantara</span>
            <span className="inline-block w-1.5 h-3 bg-blue-500 ml-1 animate-pulse align-middle" />
            <span className="absolute -top-2.5 right-2 text-[9px] font-bold px-1.5 py-0.5 rounded bg-blue-500 text-white shadow-xs">
              Sedang Diedit
            </span>
          </div>
          <p className="text-[10px] text-muted-foreground text-center">
            Klik foto atau teks mana pun di layar $\rightarrow$ langsung ganti seketika!
          </p>
        </div>
      );

    case "brand-style":
      return (
        <div className="w-full rounded-xl p-3.5 bg-gradient-to-br from-amber-500/10 via-background to-amber-500/5 border border-amber-500/20 space-y-2.5">
          <div className="flex items-center justify-between text-[11px] font-semibold text-amber-500">
            <span className="flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5" />
              Warna & Ikon Brand
            </span>
            <span className="px-2 py-0.5 rounded-full bg-amber-500/15 text-[10px]">Brand Style</span>
          </div>
          {/* Swatches */}
          <div className="flex items-center justify-between gap-1.5">
            {[
              { hex: "#E85D2A", name: "Warm" },
              { hex: "#2563EB", name: "Blue" },
              { hex: "#059669", name: "Emerald" },
              { hex: "#7C3AED", name: "Purple" },
              { hex: "#18181B", name: "Slate" },
            ].map((c, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div className={cn("w-6 h-6 rounded-lg shadow-xs flex items-center justify-center text-white", i === 0 && "ring-2 ring-primary ring-offset-2")} style={{ backgroundColor: c.hex }}>
                  {i === 0 && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
                <span className="text-[9px] text-muted-foreground">{c.name}</span>
              </div>
            ))}
          </div>
          {/* Icons Preview */}
          <div className="pt-1 border-t border-border/60 flex items-center justify-between text-[11px] text-muted-foreground">
            <span>Pilihan Ikon:</span>
            <div className="flex items-center gap-1 font-bold text-foreground">
              <span className="px-1.5 py-0.5 rounded bg-card border border-border">✓</span>
              <span className="px-1.5 py-0.5 rounded bg-card border border-border">•</span>
              <span className="px-1.5 py-0.5 rounded bg-card border border-border">✦</span>
              <span className="px-1.5 py-0.5 rounded bg-card border border-border">+</span>
              <span className="px-1.5 py-0.5 rounded bg-card border border-border">🛡</span>
              <span className="px-1.5 py-0.5 rounded bg-card border border-border">◆</span>
              <span className="px-1.5 py-0.5 rounded bg-card border border-border">🍃</span>
            </div>
          </div>
        </div>
      );

    case "catalog-manage":
      return (
        <div className="w-full rounded-xl p-3.5 bg-gradient-to-br from-emerald-500/10 via-background to-emerald-500/5 border border-emerald-500/20 space-y-2.5">
          <div className="flex items-center justify-between text-[11px] font-semibold text-emerald-500">
            <span className="flex items-center gap-1.5">
              <ShoppingBag className="w-3.5 h-3.5" />
              Katalog & Menu Jualan
            </span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-[10px]">Produk & Harga</span>
          </div>
          <div className="p-2.5 rounded-xl bg-card border border-border flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-600 font-bold text-xs shrink-0">
              ☕ Foto
            </div>
            <div className="flex-1 min-w-0 space-y-0.5">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-foreground truncate">Kopi Latte Creamy</span>
                <span className="text-[9px] font-black uppercase px-1.5 py-0.2 rounded-full bg-amber-500 text-white shrink-0">Best Seller</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="font-bold text-primary">Rp 22.000</span>
                <span className="text-[10px] line-through text-muted-foreground/60">Rp 28.000</span>
              </div>
            </div>
            <button type="button" className="text-[10px] font-bold px-2.5 py-1.5 rounded-lg bg-primary text-primary-foreground shrink-0 shadow-xs">
              + Pesan
            </button>
          </div>
        </div>
      );

    case "wa-order":
      return (
        <div className="w-full rounded-xl p-3.5 bg-gradient-to-br from-green-600/10 via-background to-green-600/5 border border-green-600/20 space-y-2.5">
          <div className="flex items-center justify-between text-[11px] font-semibold text-green-600">
            <span className="flex items-center gap-1.5">
              <MessageCircle className="w-3.5 h-3.5" />
              Notifikasi Pesanan WhatsApp
            </span>
            <span className="px-2 py-0.5 rounded-full bg-green-600/15 text-[10px]">Otomatis</span>
          </div>
          <div className="p-2.5 rounded-xl bg-[#DCF8C6]/80 dark:bg-emerald-950/40 border border-green-600/30 text-[11px] text-foreground leading-relaxed space-y-1">
            <p className="font-bold text-green-700 dark:text-green-400">🛍️ Pesanan Baru via Website:</p>
            <p>1x Kopi Latte Creamy (Large) — Rp 25.000</p>
            <p>1x Croissant Cokelat — Rp 18.000</p>
            <p className="font-bold pt-1 border-t border-green-600/20">Total: Rp 43.000</p>
          </div>
          <p className="text-[10px] text-muted-foreground text-center">
            Pesanan langsung masuk ke nomor WhatsApp penjual tanpa perantara.
          </p>
        </div>
      );

    case "publish-domain":
      return (
        <div className="w-full rounded-xl p-3.5 bg-gradient-to-br from-indigo-500/10 via-background to-indigo-500/5 border border-indigo-500/20 space-y-2.5">
          <div className="flex items-center justify-between text-[11px] font-semibold text-indigo-500">
            <span className="flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5" />
              Publikasi & Alamat Toko
            </span>
            <span className="px-2 py-0.5 rounded-full bg-indigo-500/15 text-[10px]">Online</span>
          </div>
          {/* Mock Browser URL Bar */}
          <div className="p-2 rounded-xl bg-card border border-border flex items-center gap-2 text-xs">
            <span className="text-emerald-500 text-xs">🔒</span>
            <span className="font-mono text-foreground font-semibold">https://tokosaya.com</span>
            <span className="ml-auto text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600">
              ● Aktif
            </span>
          </div>
          <div className="flex items-center justify-between text-[10px] text-muted-foreground px-1">
            <span>Alamat gratis instan:</span>
            <span className="font-mono text-primary font-medium">namatoko.webjoz.com</span>
          </div>
        </div>
      );

    default:
      return null;
  }
}

// ─── Main Help Center Page ────────────────────────────────────────────────────

export default function HelpCenterPage() {
  const { locale } = useI18n();
  const lang = (locale === "en" ? "en" : "id") as "id" | "en";
  const text = TEXT[lang];
  const faqData = FAQ_DATA[lang];
  const guidesData = GUIDES_DATA[lang];

  // States
  const [mainTab, setMainTab] = useState<"guides" | "faq">("guides");
  const [query, setQuery] = useState("");
  const [openFaqId, setOpenFaqId] = useState<string | null>(null);
  const [activeFaqCategory, setActiveFaqCategory] = useState<string | null>(null);
  const [activeGuideCategory, setActiveGuideCategory] = useState<string | null>(null);
  const [expandedGuideId, setExpandedGuideId] = useState<string | null>(null);

  // Filtered Guides
  const filteredGuides = useMemo(() => {
    const q = query.toLowerCase().trim();
    return guidesData.filter((g) => {
      if (activeGuideCategory && g.category !== activeGuideCategory) return false;
      if (!q) return true;
      return (
        g.title.toLowerCase().includes(q) ||
        g.summary.toLowerCase().includes(q) ||
        g.tags.some((t) => t.toLowerCase().includes(q)) ||
        g.steps.some((s) => s.title.toLowerCase().includes(q) || s.desc.toLowerCase().includes(q))
      );
    });
  }, [query, activeGuideCategory, guidesData]);

  // Filtered FAQs
  const filteredFaqCategories = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q && !activeFaqCategory) return faqData;
    return faqData.filter((cat) => {
      if (activeFaqCategory && cat.id !== activeFaqCategory) return false;
      if (!q) return true;
      return cat.items.some(
        (item) =>
          item.q.toLowerCase().includes(q) ||
          item.a.toLowerCase().includes(q) ||
          item.tags?.some((t) => t.toLowerCase().includes(q)),
      );
    });
  }, [query, activeFaqCategory, faqData]);

  const isSearching = query.trim().length > 0;
  const totalFaqResults = filteredFaqCategories.reduce((acc, cat) => acc + cat.items.length, 0);

  return (
    <main className="min-h-screen bg-background text-foreground pb-16">
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        <Link href="/" className="text-xs text-muted-foreground hover:text-foreground transition mb-8 inline-block">
          {text.back}
        </Link>

        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-4">
            <HelpCircle className="size-3.5" />
            {text.badge}
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-2.5">{text.title}</h1>
          <p className="text-sm text-muted-foreground max-w-lg mx-auto leading-relaxed">{text.subtitle}</p>
        </div>

        {/* Search Bar */}
        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4.5 text-muted-foreground" />
          <input
            type="text"
            placeholder={text.searchPlaceholder}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActiveFaqCategory(null);
              setActiveGuideCategory(null);
            }}
            className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-border/60 bg-card/40 text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40 transition shadow-xs"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted-foreground hover:text-foreground cursor-pointer"
            >
              {text.clear}
            </button>
          )}
        </div>

        {/* Main Tabs (Guides vs FAQ) - Hidden when actively searching to show both results */}
        {!isSearching && (
          <div className="flex p-1 rounded-2xl border border-border bg-muted/50 mb-8 max-w-md mx-auto">
            <button
              type="button"
              onClick={() => setMainTab("guides")}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer",
                mainTab === "guides"
                  ? "bg-card text-foreground shadow-sm border border-border/60"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <BookOpen className="w-4 h-4 text-primary" />
              {text.tabGuides}
            </button>
            <button
              type="button"
              onClick={() => setMainTab("faq")}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer",
                mainTab === "faq"
                  ? "bg-card text-foreground shadow-sm border border-border/60"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <HelpCircle className="w-4 h-4 text-muted-foreground" />
              {text.tabFaq}
            </button>
          </div>
        )}

        {/* ─── TAB 1: PETUNJUK PENGGUNAAN (USER GUIDES) ─────────────────────────── */}
        {(!isSearching && mainTab === "guides") && (
          <section className="space-y-6 animate-in fade-in duration-300">
            {/* Guide Category Filter */}
            <div className="flex flex-wrap gap-2 mb-2">
              <button
                onClick={() => setActiveGuideCategory(null)}
                className={cn(
                  "px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer",
                  !activeGuideCategory
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-muted text-muted-foreground hover:text-foreground",
                )}
              >
                {text.allGuides}
              </button>
              {[
                { id: "start", label: lang === "id" ? "🚀 Mulai Cepat" : "🚀 Quick Start" },
                { id: "edit", label: lang === "id" ? "✍️ Edit Layar" : "✍️ Inline Edit" },
                { id: "design", label: lang === "id" ? "🎨 Desain & Warna" : "🎨 Brand Style" },
                { id: "catalog", label: lang === "id" ? "🛍️ Produk & Menu" : "🛍️ Catalog" },
                { id: "orders", label: lang === "id" ? "📲 Pesanan WA" : "📲 Orders" },
                { id: "domain", label: lang === "id" ? "🌐 Publikasi & Domain" : "🌐 Domain" },
              ].map((c) => (
                <button
                  key={c.id}
                  onClick={() => setActiveGuideCategory(activeGuideCategory === c.id ? null : c.id)}
                  className={cn(
                    "px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer",
                    activeGuideCategory === c.id
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "bg-muted text-muted-foreground hover:text-foreground",
                  )}
                >
                  {c.label}
                </button>
              ))}
            </div>

            {/* Guides Grid */}
            <div className="grid gap-5 md:grid-cols-2">
              {filteredGuides.map((guide) => {
                const isExpanded = expandedGuideId === guide.id;
                return (
                  <div
                    key={guide.id}
                    className={cn(
                      "rounded-3xl border transition-all overflow-hidden flex flex-col bg-card/60 hover:border-primary/40",
                      isExpanded ? "md:col-span-2 border-primary/50 shadow-lg bg-card" : "border-border/70",
                    )}
                  >
                    <div className="p-5 sm:p-6 flex flex-col flex-1 space-y-4">
                      {/* Top Header */}
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-primary/10 text-primary">
                          {guide.badge}
                        </span>
                        <span className="text-[11px] text-muted-foreground font-medium">
                          ⏱️ {guide.timeEst}
                        </span>
                      </div>

                      {/* Title & Summary */}
                      <div className="space-y-1.5">
                        <h3 className="text-base sm:text-lg font-bold leading-snug">{guide.title}</h3>
                        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{guide.summary}</p>
                      </div>

                      {/* Visual Mini Mockup */}
                      <div className="pt-1">
                        <GuideIllustration type={guide.illustration} />
                      </div>

                      {/* Expandable Step Details */}
                      {isExpanded && (
                        <div className="pt-4 border-t border-border/80 space-y-5 animate-in fade-in duration-200">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                            {text.stepsTitle}
                          </h4>

                          <div className="space-y-3.5">
                            {guide.steps.map((st, sIdx) => (
                              <div key={sIdx} className="flex items-start gap-3 text-xs sm:text-sm">
                                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center text-xs mt-0.5 shadow-xs">
                                  {sIdx + 1}
                                </span>
                                <div className="space-y-0.5">
                                  <strong className="text-foreground font-semibold block">{st.title}</strong>
                                  <span className="text-muted-foreground leading-relaxed block">{st.desc}</span>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Pro Tip Box */}
                          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-start gap-3 text-xs text-amber-900 dark:text-amber-200 leading-relaxed">
                            <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                            <div>
                              <strong className="font-bold block mb-0.5 text-amber-600 dark:text-amber-400">
                                {text.proTipBadge}
                              </strong>
                              <span>{guide.tip}</span>
                            </div>
                          </div>

                          {/* Action Link */}
                          <div className="pt-2">
                            <Link
                              href={guide.actionUrl}
                              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs shadow-sm hover:brightness-110 transition"
                            >
                              <span>{guide.actionLabel}</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                          </div>
                        </div>
                      )}

                      {/* Toggle Button */}
                      <div className="pt-2 mt-auto">
                        <button
                          type="button"
                          onClick={() => setExpandedGuideId(isExpanded ? null : guide.id)}
                          className="w-full py-2.5 px-4 rounded-xl border border-border/80 bg-muted/40 hover:bg-muted text-xs font-bold text-foreground transition flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <span>{isExpanded ? text.hideDetails : text.viewDetails}</span>
                          <ChevronRight className={cn("w-3.5 h-3.5 transition-transform", isExpanded && "rotate-90")} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* ─── TAB 2: TANYA JAWAB (FAQ) ────────────────────────────────────────── */}
        {(!isSearching && mainTab === "faq") && (
          <section className="space-y-6 animate-in fade-in duration-300">
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 mb-6">
              <button
                onClick={() => setActiveFaqCategory(null)}
                className={cn(
                  "px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer",
                  !activeFaqCategory
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-muted text-muted-foreground hover:text-foreground",
                )}
              >
                {text.allCategories}
              </button>
              {faqData.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveFaqCategory(activeFaqCategory === cat.id ? null : cat.id)}
                  className={cn(
                    "px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer",
                    activeFaqCategory === cat.id
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "bg-muted text-muted-foreground hover:text-foreground",
                  )}
                >
                  {cat.title}
                </button>
              ))}
            </div>

            {/* Accordion List */}
            <div className="space-y-6">
              {filteredFaqCategories.map((cat) => (
                <div key={cat.id}>
                  <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">{cat.title}</h2>
                  <div className="space-y-2">
                    {cat.items.map((item, idx) => {
                      const id = `${cat.id}-${idx}`;
                      const isOpen = openFaqId === id;
                      return (
                        <div
                          key={id}
                          className={cn(
                            "rounded-2xl border transition-all overflow-hidden",
                            isOpen ? "border-primary/40 bg-primary/5 shadow-xs" : "border-border/60 bg-card/40 hover:border-border",
                          )}
                        >
                          <button
                            onClick={() => setOpenFaqId(isOpen ? null : id)}
                            className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left text-sm font-semibold cursor-pointer"
                          >
                            <span>{item.q}</span>
                            <span className={cn("shrink-0 text-muted-foreground transition-transform duration-200", isOpen && "rotate-180")}>
                              ▾
                            </span>
                          </button>
                          {isOpen && (
                            <div className="px-5 pb-4 text-sm text-muted-foreground leading-relaxed border-t border-border/40 pt-3">
                              {item.a}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ─── SEARCH RESULTS (SHOWS BOTH GUIDES & FAQS) ───────────────────────── */}
        {isSearching && (
          <section className="space-y-8 animate-in fade-in duration-200">
            <p className="text-xs text-muted-foreground">
              {filteredGuides.length + totalFaqResults} {lang === "id" ? "hasil ditemukan untuk" : "results found for"} "{query}"
            </p>

            {/* Matching Guides */}
            {filteredGuides.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-primary" />
                  {text.matchingGuides} ({filteredGuides.length})
                </h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  {filteredGuides.map((guide) => (
                    <div
                      key={guide.id}
                      onClick={() => {
                        setMainTab("guides");
                        setExpandedGuideId(guide.id);
                        setQuery("");
                      }}
                      className="p-4 rounded-2xl border border-border bg-card/70 hover:border-primary/50 transition cursor-pointer space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-primary/10 text-primary">
                          {guide.badge}
                        </span>
                        <span className="text-[10px] text-muted-foreground">{guide.timeEst}</span>
                      </div>
                      <h4 className="text-sm font-bold text-foreground">{guide.title}</h4>
                      <p className="text-xs text-muted-foreground line-clamp-2">{guide.summary}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Matching FAQ Items */}
            {filteredFaqCategories.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-muted-foreground" />
                  {text.matchingFaq} ({totalFaqResults})
                </h3>
                <div className="space-y-2">
                  {filteredFaqCategories.flatMap((cat) => cat.items).map((item, idx) => (
                    <div key={idx} className="p-4 rounded-2xl border border-border bg-card/40 space-y-1.5">
                      <strong className="text-sm font-bold block text-foreground">{item.q}</strong>
                      <p className="text-xs text-muted-foreground leading-relaxed">{item.a}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {filteredGuides.length === 0 && totalFaqResults === 0 && (
              <div className="text-center py-16">
                <Search className="size-10 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-sm text-muted-foreground font-semibold">{text.noResults(query)}</p>
                <p className="text-xs text-muted-foreground/60 mt-1">{text.noResultsSub}</p>
              </div>
            )}
          </section>
        )}

        {/* ─── CONTACT CS CTA ─────────────────────────────────────────────────── */}
        <div className="mt-14 rounded-3xl border border-border bg-muted/40 p-8 text-center shadow-xs">
          <div className="flex items-center justify-center mb-4">
            <div className="flex items-center justify-center size-14 rounded-full bg-card border border-border shadow-xs">
              <svg className="size-7 fill-green-600" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
              </svg>
            </div>
          </div>
          <h3 className="text-lg font-bold mb-1 text-foreground">{text.ctaTitle}</h3>
          <p className="text-sm text-muted-foreground mb-1">{text.ctaDesc}</p>
          <p className="text-xs text-muted-foreground font-semibold mb-5">{text.ctaHours}</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href={getWhatsAppUrl(text.waMsg)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold transition-opacity hover:opacity-85 active:opacity-70 bg-emerald-600 text-white shadow-sm"
            >
              <svg className="size-4 fill-white" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
              </svg>
              <span>{text.ctaWa}</span>
              <ExternalLink className="size-3.5 opacity-80" />
            </a>
            <a
              href={`mailto:${SUPPORT_EMAIL}`}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl border border-border bg-card text-sm font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-all shadow-xs"
            >
              <Mail className="size-4" />
              <span>{text.ctaEmail}</span>
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
