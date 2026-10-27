"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Search, HelpCircle, Mail, ExternalLink,
  BookOpen, Sparkles, MousePointerClick, Palette,
  ShoppingBag, MessageCircle, Globe, ChevronRight,
  Lightbulb, ArrowRight, Check, Play,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getWhatsAppUrl, SUPPORT_EMAIL } from "@/lib/site-config";
import { useI18n } from "@/lib/i18n/context";
import { Button, buttonClassName, SparkleIcon, SparkleGenAI } from "webjoz-ui";

// ─── Interfaces ───────────────────────────────────────────────────────────────

interface GuideStep {
  title: string;
  desc: string;
}

interface GuideItem {
  id: string;
  category: "start" | "edit" | "design" | "catalog" | "orders" | "domain" | "seo" | "integrations" | "blog" | "leads" | "testimonials" | "analytics" | "team" | "usage" | "settings";
  badge: string;
  timeEst: string;
  title: string;
  summary: string;
  illustration: string;
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
      title: "Membuat Website Pertama dengan AI",
      summary: "Masukkan nama dan bidang usahamu. AI akan merancang tata letak, copywriting, dan foto awal secara otomatis.",
      illustration: "ai-create",
      steps: [
        {
          title: "Buka Menu Buat Website",
          desc: "Dari dashboard, klik tombol '+ Website Baru' untuk membuka asisten pembuat website.",
        },
        {
          title: "Isi Identitas Bisnis",
          desc: "Tuliskan nama usaha dan pilih bidang bisnismu (Kuliner, Jasa, Toko Produk, dll).",
        },
        {
          title: "Tuliskan Deskripsi Singkat",
          desc: "Tuliskan 1-2 kalimat ringkas mengenai produk atau layananmu, atau gunakan saran cepat dari AI.",
        },
        {
          title: "Pilih Desain & Selesai",
          desc: "Pilih gaya visual yang diinginkan dan klik 'Buat Sekarang'. Website langsung siap dalam beberapa detik.",
        },
      ],
      tip: "Deskripsi yang spesifik menghasilkan struktur teks dan visual yang lebih relevan dengan bisnismu.",
      actionUrl: "/dashboard",
      actionLabel: "Mulai Buat Website",
      tags: ["bikin website", "ai", "wizard", "mulai", "daftar", "langkah pertama", "buat"],
    },
    {
      id: "inline-edit",
      category: "edit",
      badge: "Editor Layar",
      timeEst: "2 Menit",
      title: "Mengedit Teks & Foto Langsung di Layar",
      summary: "Tanpa koding. Klik langsung pada teks atau foto mana saja di layar preview untuk mengubah isinya seketika.",
      illustration: "inline-edit",
      steps: [
        {
          title: "Buka Editor Website",
          desc: "Di daftar website pada dashboard, klik 'Buka Editor' pada website yang ingin diubah.",
        },
        {
          title: "Klik Teks untuk Mengetik",
          desc: "Arahkan kursor ke judul, paragraf, atau harga. Kursor ketik akan aktif dan kamu bisa langsung mengedit.",
        },
        {
          title: "Klik Foto untuk Mengganti",
          desc: "Klik foto produk atau gambar banner, lalu pilih file gambar dari perangkatmu.",
        },
        {
          title: "Gunakan Tombol Undo",
          desc: "Gunakan tombol panah 'Kembalikan' (Undo) di bagian atas bilah navigasi jika ingin membatalkan perubahan.",
        },
      ],
      tip: "Perubahan teks tersimpan otomatis di editor saat kamu selesai mengetik.",
      actionUrl: "/dashboard",
      actionLabel: "Buka Editor",
      tags: ["edit teks", "ganti foto", "inline edit", "ubah tulisan", "undo", "editor"],
    },
    {
      id: "brand-style",
      category: "design",
      badge: "Desain & Gaya",
      timeEst: "3 Menit",
      title: "Menyesuaikan Warna, Huruf & Ikon Toko",
      summary: "Atur palet warna brand, tipografi yang nyaman dibaca, serta bentuk ikon checklist keunggulan produk.",
      illustration: "brand-style",
      steps: [
        {
          title: "Buka Tab Desain",
          desc: "Pada bilah menu kiri editor, pilih tab 'Desain' untuk mengakses konfigurasi visual.",
        },
        {
          title: "Pilih Warna Aksen Brand",
          desc: "Tentukan warna identitas tokomu dari palet standar atau gunakan kode HEX kustom sesuai logo.",
        },
        {
          title: "Pilih Bentuk Ikon Checklist",
          desc: "Di menu 'Ikon Checklist Produk', tentukan bentuk marker poin: Centang (✓), Titik (•), Sparkle (✦), Plus (+), Tameng (🛡), Berlian (◆), atau Daun (🍃).",
        },
        {
          title: "Pilih Mode Terang atau Gelap",
          desc: "Sesuaikan nuansa website dengan Mode Terang (Light) atau Mode Gelap (Dark).",
        },
      ],
      tip: "Pengaturan warna dan font di tab Desain berlaku konsisten di seluruh bagian website secara otomatis.",
      actionUrl: "/dashboard",
      actionLabel: "Atur Desain Toko",
      tags: ["warna", "font", "desain", "huruf", "ikon", "checklist", "dark mode", "mode gelap", "brand style"],
    },
    {
      id: "catalog-manage",
      category: "catalog",
      badge: "Katalog & Menu",
      timeEst: "4 Menit",
      title: "Mengelola Produk, Harga Promo & Varian",
      summary: "Susun daftar produk atau menu makanan dengan foto rapi, harga coret diskon, dan opsi varian.",
      illustration: "catalog-manage",
      steps: [
        {
          title: "Buka Tab Katalog / Menu",
          desc: "Pilih section 'Katalog' (untuk produk/jasa) atau 'Menu' (untuk kuliner) di editor.",
        },
        {
          title: "Buat Kategori Produk",
          desc: "Klik '+ Kategori Baru' untuk mengelompokkan barang daganganmu dengan rapi.",
        },
        {
          title: "Lengkapi Rincian Item",
          desc: "Klik '+ Tambah Item'. Masukkan nama, foto, harga dasar, serta harga promo jika sedang ada diskon.",
        },
        {
          title: "Pasang Badge Unggulan",
          desc: "Beri label seperti 'Best Seller' atau 'Promo' agar item otomatis tampil di showcase bagian atas.",
        },
      ],
      tip: "Gunakan toggle 'Stok Habis' untuk menonaktifkan pemesanan saat persediaan produk sedang kosong.",
      actionUrl: "/dashboard",
      actionLabel: "Kelola Produk",
      tags: ["katalog", "menu", "tambah produk", "harga", "promo", "best seller", "stok", "diskon"],
    },
    {
      id: "wa-order",
      category: "orders",
      badge: "Pemesanan",
      timeEst: "2 Menit",
      title: "Menerima Pesanan Langsung ke WhatsApp",
      summary: "Pelanggan dapat memasukkan beberapa item ke keranjang dan mengirimkan rincian pesanan langsung ke nomor WhatsApp tokomu.",
      illustration: "wa-order",
      steps: [
        {
          title: "Atur Nomor WhatsApp Bisnis",
          desc: "Di tab 'Kontak', masukkan nomor WhatsApp aktif yang digunakan untuk melayani pesanan.",
        },
        {
          title: "Pelanggan Memilih Item",
          desc: "Pengunjung memilih produk, menentukan varian/jumlah, lalu menambahkannya ke keranjang belanja.",
        },
        {
          title: "Pesan Masuk Terstruktur",
          desc: "Saat checkout, WhatsApp akan terbuka otomatis dengan format rekap nama item, jumlah, dan total harga.",
        },
        {
          title: "Konfirmasi & Pengiriman",
          desc: "Penjual dapat langsung membalas pelanggan, memberikan instruksi pembayaran, dan memproses pengiriman.",
        },
      ],
      tip: "Gunakan WhatsApp Business untuk menyiapkan pesan sambutan otomatis bagi pelanggan baru.",
      actionUrl: "/dashboard",
      actionLabel: "Cek Pengaturan Kontak",
      tags: ["whatsapp", "pesanan", "order", "keranjang belanja", "cart", "checkout", "jualan"],
    },
    {
      id: "publish-domain",
      category: "domain",
      badge: "Go Live",
      timeEst: "3 Menit",
      title: "Publikasi Website & Menghubungkan Domain",
      summary: "Gunakan subdomain gratis langsung pakai, atau hubungkan domain kustom sendiri (.com / .id) untuk alamat profesional.",
      illustration: "publish-domain",
      steps: [
        {
          title: "Klik Publikasikan",
          desc: "Klik tombol 'Publikasikan' di pojok kanan atas editor. Website langsung online dan dapat diakses publik.",
        },
        {
          title: "Bagikan Alamat Gratis",
          desc: "Website otomatis memiliki alamat gratis (misal: namatoko.webjoz.com) yang siap dibagikan.",
        },
        {
          title: "Hubungkan Domain Sendiri",
          desc: "Buka menu 'Domain' di dashboard untuk menambahkan domain yang telah kamu beli (contoh: tokoku.com).",
        },
        {
          title: "Atur DNS CNAME",
          desc: "Tambahkan CNAME record sesuai petunjuk di panel DNS penyedia domainmu. Verifikasi berlangsung beberapa menit.",
        },
      ],
      tip: "Setiap alamat website di Webjoz sudah terproteksi sertifikat keamanan SSL gratis secara otomatis.",
      actionUrl: "/dashboard",
      actionLabel: "Publikasikan Website",
      tags: ["publish", "publikasikan", "domain", "alamat website", "custom domain", "online", "live"],
    },
    {
      id: "seo-meta",
      category: "seo",
      badge: "SEO & Google",
      timeEst: "3 Menit",
      title: "Optimasi SEO & Tampilan Berbagi Link",
      summary: "Atur judul, deskripsi pencarian Google, kata kunci, dan gambar cuplikan agar websitemu mudah ditemukan dan tampil menarik saat link dibagikan.",
      illustration: "seo-meta",
      steps: [
        {
          title: "Buka Pengaturan SEO",
          desc: "Di bilah navigasi editor website atau dashboard, klik menu 'SEO'.",
        },
        {
          title: "Gunakan 'Generate dengan AI'",
          desc: "Klik tombol 'Generate dengan AI' di samping Meta Title dan Meta Description untuk menghasilkan teks yang ramah mesin pencari secara otomatis.",
        },
        {
          title: "Masukkan Kata Kunci (Keywords)",
          desc: "Ketik kata kunci yang sering dicari calon pelanggan (misal: 'kuliner jogja', 'catering enak') lalu tekan Enter.",
        },
        {
          title: "Simpan & Cek Hasil",
          desc: "Klik tombol 'Simpan'. Mesin pencari seperti Google akan membaca data ini saat mengindeks websitemu.",
        },
      ],
      tip: "Meta Description yang ringkas dan persuasif (140-155 karakter) meningkatkan kemungkinan link websitemu diklik di hasil pencarian Google.",
      actionUrl: "/dashboard",
      actionLabel: "Buka Pengaturan SEO",
      tags: ["seo", "google", "meta title", "meta description", "keywords", "ranking", "favicon", "pencarian"],
    },
    {
      id: "integrations",
      category: "integrations",
      badge: "Pelacakan & Iklan",
      timeEst: "2 Menit",
      title: "Memasang Google Analytics & Meta Pixel",
      summary: "Hubungkan alat analisis pengunjung dan pelacak iklan Facebook/Instagram tanpa perlu koding atau mengubah kode HTML.",
      illustration: "integrations",
      steps: [
        {
          title: "Buka Menu Integrasi",
          desc: "Dari dashboard situs atau editor, pilih tab 'Integrasi'.",
        },
        {
          title: "Masukkan ID Google Analytics 4",
          desc: "Salin Measurement ID dari Google Analytics (format: G-XXXXXXXXXX) ke kolom GA4.",
        },
        {
          title: "Masukkan ID Meta Pixel",
          desc: "Salin Pixel ID dari Meta Events Manager (format angka 15-16 digit) untuk melacak konversi iklan IG/FB.",
        },
        {
          title: "Klik Simpan",
          desc: "Klik tombol 'Simpan'. Script analitik otomatis terpasang aktif di seluruh halaman situsmu.",
        },
      ],
      tip: "Data pengunjung mulai terekam di Google Analytics dan Meta Events Manager dalam beberapa jam setelah disimpan.",
      actionUrl: "/dashboard",
      actionLabel: "Buka Tab Integrasi",
      tags: ["analytics", "pixel", "facebook ads", "google analytics", "ga4", "tracking", "meta pixel", "iklan"],
    },
    {
      id: "blog-ai",
      category: "blog",
      badge: "Blog & Artikel",
      timeEst: "5 Menit",
      title: "Buat & Kelola Artikel Blog dengan AI",
      summary: "Tambahkan halaman blog ke website bisnismu. Gunakan AI untuk menghasilkan artikel profesional berdasarkan topik yang kamu tentukan.",
      illustration: "blog-ai",
      steps: [
        {
          title: "Buka Menu Blog",
          desc: "Di editor website, klik tab 'Blog' untuk membuka manajemen artikel.",
        },
        {
          title: "Generate Artikel dengan AI",
          desc: "Ketikkan topik atau judul yang diinginkan, lalu klik 'Generate AI'. Artikel lengkap dengan paragraf rapi akan dibuat otomatis.",
        },
        {
          title: "Edit & Sempurnakan Konten",
          desc: "Buka editor artikel untuk menyesuaikan judul, isi, gambar cover, dan meta SEO sebelum dipublikasikan.",
        },
        {
          title: "Pilih Layout Tampilan Blog",
          desc: "Pilih gaya tampilan halaman blog: Grid, List, Featured, atau Minimal sesuai estetika website.",
        },
      ],
      tip: "Artikel blog membantu meningkatkan SEO organik. Targetkan kata kunci yang relevan di setiap artikel agar mudah ditemukan di Google.",
      actionUrl: "/dashboard",
      actionLabel: "Buka Blog Manager",
      tags: ["blog", "artikel", "konten", "ai generate", "seo blog", "tulisan"],
    },
    {
      id: "leads-inbox",
      category: "leads",
      badge: "Leads & Kontak",
      timeEst: "2 Menit",
      title: "Mengelola Leads & Pesan Pengunjung",
      summary: "Semua pesan yang masuk dari form kontak website tersimpan otomatis di Leads Inbox. Balas langsung via WhatsApp atau email dari sini.",
      illustration: "leads-inbox",
      steps: [
        {
          title: "Buka Menu Leads",
          desc: "Dari sidebar dashboard, klik 'Leads' untuk melihat semua pesan yang masuk dari pengunjung website.",
        },
        {
          title: "Lihat Detail Pesan",
          desc: "Klik kartu lead untuk melihat detail lengkap: nama, email, nomor telpon, dan isi pesan pengunjung.",
        },
        {
          title: "Balas via WhatsApp atau Email",
          desc: "Klik tombol WhatsApp atau Email di kartu lead untuk langsung membalas calon pelanggan dalam satu klik.",
        },
        {
          title: "Filter Berdasarkan Website",
          desc: "Gunakan dropdown filter untuk melihat leads dari website tertentu jika kamu memiliki lebih dari satu website.",
        },
      ],
      tip: "Balas leads dalam 1 jam pertama meningkatkan kemungkinan konversi hingga 7x lipat dibandingkan membalas setelah 24 jam.",
      actionUrl: "/dashboard/leads",
      actionLabel: "Buka Leads Inbox",
      tags: ["leads", "pesan masuk", "form kontak", "inbox", "calon pelanggan", "follow up"],
    },
    {
      id: "testimonials-manage",
      category: "testimonials",
      badge: "Testimoni",
      timeEst: "3 Menit",
      title: "Kumpulkan & Tampilkan Testimoni Pelanggan",
      summary: "Bagikan link khusus ke pelanggan untuk mengumpulkan ulasan bintang. Moderasi dan setujui testimoni sebelum tampil otomatis di website.",
      illustration: "testimonials-manage",
      steps: [
        {
          title: "Buka Tab Testimoni",
          desc: "Di editor website, klik tab 'Testimoni' untuk mengelola ulasan pelanggan.",
        },
        {
          title: "Bagikan Link Formulir",
          desc: "Salin link form testimoni dan kirim ke pelanggan via WhatsApp. Mereka dapat mengisi nama, ulasan, dan rating bintang.",
        },
        {
          title: "Moderasi Ulasan Masuk",
          desc: "Ulasan baru masuk dengan status 'Pending'. Klik ✓ untuk Setujui atau ✗ untuk Tolak sebelum tampil di website.",
        },
        {
          title: "Testimoni Tampil Otomatis",
          desc: "Testimoni yang disetujui langsung muncul di seksi ulasan website dalam tampilan kartu yang elegan.",
        },
      ],
      tip: "Testimoni dengan foto dan nama lengkap lebih dipercaya. Minta pelanggan mengisi form sesaat setelah transaksi selesai.",
      actionUrl: "/dashboard",
      actionLabel: "Kelola Testimoni",
      tags: ["testimoni", "review", "ulasan", "rating", "bintang", "pelanggan", "kepercayaan"],
    },
    {
      id: "analytics-dashboard",
      category: "analytics",
      badge: "Analitik",
      timeEst: "2 Menit",
      title: "Memantau Trafik & Performa Website",
      summary: "Pantau total pengunjung, halaman populer, asal trafik, dan durasi kunjungan. Filter berdasarkan periode dan per-website.",
      illustration: "analytics-dashboard",
      steps: [
        {
          title: "Buka Menu Analytics",
          desc: "Dari sidebar dashboard, klik 'Analytics' untuk melihat ringkasan performa semua website.",
        },
        {
          title: "Filter Periode & Website",
          desc: "Gunakan preset (7 hari, 30 hari, 90 hari) atau pilih rentang tanggal kustom. Filter juga berdasarkan website tertentu.",
        },
        {
          title: "Baca Statistik Kunci",
          desc: "Perhatikan 4 kartu utama: Total Tayangan, Pengunjung Unik, Rata-rata Durasi Kunjungan, dan Total Leads yang masuk.",
        },
        {
          title: "Analisis Halaman & Sumber Trafik",
          desc: "Scroll ke bawah untuk melihat halaman paling sering dikunjungi dan dari mana asal pengunjung (Google, WhatsApp, dll).",
        },
      ],
      tip: "Bandingkan performa 30 hari ini vs periode sebelumnya untuk mengukur dampak konten atau promosi yang kamu jalankan.",
      actionUrl: "/dashboard/analytics",
      actionLabel: "Buka Analytics",
      tags: ["analytics", "trafik", "pengunjung", "statistik", "pageview", "performa", "laporan"],
    },
    {
      id: "orders-tracker",
      category: "orders",
      badge: "Riwayat Pesanan",
      timeEst: "2 Menit",
      title: "Melacak & Mengelola Status Pesanan",
      summary: "Lihat semua pesanan dari keranjang WhatsApp di satu dashboard. Perbarui status pesanan dari Baru hingga Selesai.",
      illustration: "orders-tracker",
      steps: [
        {
          title: "Buka Menu Orders",
          desc: "Dari sidebar dashboard, klik 'Orders' untuk melihat semua pesanan WhatsApp yang masuk.",
        },
        {
          title: "Lihat Detail Pesanan",
          desc: "Klik baris pesanan untuk melihat rincian: daftar item, total harga, nama & nomor pelanggan.",
        },
        {
          title: "Perbarui Status Pesanan",
          desc: "Ubah status pesanan sesuai progres: Baru → Dikonfirmasi → Diproses → Dikirim → Selesai (atau Dibatalkan).",
        },
        {
          title: "Filter & Cari Pesanan",
          desc: "Gunakan kolom pencarian atau filter status dan website untuk menemukan pesanan tertentu dengan cepat.",
        },
      ],
      tip: "Update status pesanan secara berkala memudahkan kamu melacak fulfillment dan menjaga pengalaman pelanggan tetap baik.",
      actionUrl: "/dashboard/orders",
      actionLabel: "Buka Daftar Pesanan",
      tags: ["orders", "pesanan", "status", "tracking", "fulfillment", "riwayat pesanan"],
    },
    {
      id: "team-invite",
      category: "team",
      badge: "Tim & Kolaborasi",
      timeEst: "2 Menit",
      title: "Mengundang Anggota Tim ke Akun",
      summary: "Tambahkan kolega atau asisten ke akun Webjoz bisnismu. Atur peran masing-masing anggota agar aksesnya sesuai tanggung jawab.",
      illustration: "team-invite",
      steps: [
        {
          title: "Buka Menu Tim",
          desc: "Dari sidebar dashboard, klik 'Tim' untuk melihat daftar anggota dan undangan aktif.",
        },
        {
          title: "Masukkan Email & Peran",
          desc: "Ketik email kolega di kolom undangan. Pilih peran: 'Editor' (bisa edit website) atau 'Admin' (akses penuh termasuk billing).",
        },
        {
          title: "Kirim Undangan",
          desc: "Klik 'Undang'. Kolega akan menerima email berisi link untuk bergabung ke akun tim.",
        },
        {
          title: "Kelola Anggota",
          desc: "Anggota yang sudah bergabung tampil di daftar. Kamu bisa mengubah peran atau mencabut akses kapan saja.",
        },
      ],
      tip: "Fitur Tim tersedia untuk paket Pro. Anggota dengan peran Editor tidak dapat mengakses halaman Billing & Upgrade.",
      actionUrl: "/dashboard/team",
      actionLabel: "Kelola Tim",
      tags: ["tim", "team", "undang", "kolaborasi", "editor", "admin", "anggota"],
    },
    {
      id: "usage-quota",
      category: "usage",
      badge: "Penggunaan & Kuota",
      timeEst: "1 Menit",
      title: "Memantau Kuota AI & Batas Paket",
      summary: "Lihat berapa banyak generate AI yang sudah terpakai, sisa kuota website, dan detail paket aktifmu dalam satu halaman ringkas.",
      illustration: "usage-quota",
      steps: [
        {
          title: "Buka Halaman Penggunaan",
          desc: "Dari sidebar atau menu akun, klik 'Penggunaan' untuk melihat ringkasan kuota paket aktif.",
        },
        {
          title: "Pantau Kuota AI Generate",
          desc: "Lihat berapa kali kamu sudah menggunakan fitur 'Buat Website AI' dari total kuota yang tersedia di paketmu.",
        },
        {
          title: "Cek Batas Jumlah Website",
          desc: "Tampilan meter menunjukkan jumlah website aktif vs batas maksimum paketmu.",
        },
        {
          title: "Upgrade Jika Kuota Habis",
          desc: "Jika mendekati batas, klik tombol 'Upgrade Paket' untuk mendapatkan kuota lebih besar dan fitur premium.",
        },
      ],
      tip: "Kuota AI generate direset setiap bulan pada tanggal yang sama dengan tanggal berlangganan pertamamu.",
      actionUrl: "/dashboard/usage",
      actionLabel: "Lihat Penggunaan",
      tags: ["kuota", "usage", "ai generate", "batas", "paket", "upgrade", "limit"],
    },
    {
      id: "account-security",
      category: "settings",
      badge: "Pengaturan & Keamanan",
      timeEst: "2 Menit",
      title: "Keamanan Akun, Notifikasi & Sesi Perangkat",
      summary: "Ubah password, kelola preferensi notifikasi email & push, serta pantau dan cabut sesi login perangkat lain untuk menjaga keamanan akun bisnismu.",
      illustration: "account-security",
      steps: [
        {
          title: "Buka Halaman Pengaturan",
          desc: "Dari sidebar dashboard atau menu profil di kanan atas, klik 'Pengaturan'.",
        },
        {
          title: "Ubah Password Akun",
          desc: "Buka tab 'Keamanan', masukkan kata sandi saat ini dan tentukan password baru yang aman.",
        },
        {
          title: "Atur Preferensi Notifikasi",
          desc: "Buka tab 'Notifikasi' untuk memilih alert apa saja yang dikirimkan via email (pesanan baru, leads masuk, atau update sistem).",
        },
        {
          title: "Pantau & Cabut Sesi Perangkat",
          desc: "Buka tab 'Perangkat' untuk melihat daftar sesi aktif. Klik 'Cabut Sesi' jika ada perangkat mencurigakan.",
        },
      ],
      tip: "Gunakan password unik dan periksa daftar perangkat aktif secara berkala demi menjaga keamanan data bisnis.",
      actionUrl: "/dashboard/settings",
      actionLabel: "Buka Pengaturan",
      tags: ["pengaturan", "keamanan", "password", "notifikasi", "perangkat", "sesi", "settings", "profil"],
    },
  ],
  en: [
    {
      id: "ai-create",
      category: "start",
      badge: "Quick Start",
      timeEst: "3 Mins",
      title: "Creating Your First Website with AI",
      summary: "Provide your brand name and industry. AI automatically structures your layout, copywriting, and starting imagery.",
      illustration: "ai-create",
      steps: [
        {
          title: "Open Site Creation Assistant",
          desc: "From the dashboard, click '+ New Website' to launch the automated creation wizard.",
        },
        {
          title: "Enter Business Identity",
          desc: "Type your brand name and select your industry (Culinary, Services, Retail Store, etc.).",
        },
        {
          title: "Provide a Brief Description",
          desc: "Write 1-2 short sentences about your offering, or select one of the AI prompt suggestions.",
        },
        {
          title: "Choose Style & Launch",
          desc: "Select your preferred visual style and click 'Create Now'. Your site is ready in seconds.",
        },
      ],
      tip: "Specific details about your business strengths result in more accurate and tailored copy.",
      actionUrl: "/dashboard",
      actionLabel: "Start Creating",
      tags: ["create website", "ai", "wizard", "start", "register", "first step"],
    },
    {
      id: "inline-edit",
      category: "edit",
      badge: "Visual Editor",
      timeEst: "2 Mins",
      title: "Editing Text & Photos Directly on Screen",
      summary: "No coding required. Click any headline, paragraph, or image on the preview to update content on the fly.",
      illustration: "inline-edit",
      steps: [
        {
          title: "Open the Website Editor",
          desc: "From your sites list on the dashboard, click 'Open Editor' for the target website.",
        },
        {
          title: "Click Any Text to Type",
          desc: "Click on titles, body text, or pricing to open the active editing cursor.",
        },
        {
          title: "Click Photos to Replace",
          desc: "Click any product or banner image to upload a new file from your device.",
        },
        {
          title: "Revert with Undo",
          desc: "Use the 'Undo' button in the top navigation bar to revert prior actions whenever needed.",
        },
      ],
      tip: "Your text modifications are saved automatically in real-time.",
      actionUrl: "/dashboard",
      actionLabel: "Open Editor",
      tags: ["edit text", "change photo", "inline edit", "undo", "editor"],
    },
    {
      id: "brand-style",
      category: "design",
      badge: "Brand Style",
      timeEst: "3 Mins",
      title: "Customizing Colors, Typography & Icons",
      summary: "Adjust accent colors, choose legible typography pairings, and select bullet markers for product features.",
      illustration: "brand-style",
      steps: [
        {
          title: "Navigate to the Design Tab",
          desc: "In the editor sidebar, open the 'Design' tab to access visual controls.",
        },
        {
          title: "Set Brand Accent Color",
          desc: "Choose from standard color swatches or enter your custom HEX code.",
        },
        {
          title: "Select Feature Marker Icon",
          desc: "Under 'Product Checklist Icon', pick your preferred bullet style: Check (✓), Dot (•), Sparkle (✦), Plus (+), Shield (🛡), Diamond (◆), or Leaf (🍃).",
        },
        {
          title: "Toggle Light or Dark Mode",
          desc: "Switch between Light Mode and Dark Mode based on your desired brand mood.",
        },
      ],
      tip: "Typography and color settings in the Design tab apply universally across all sections.",
      actionUrl: "/dashboard",
      actionLabel: "Customize Design",
      tags: ["colors", "fonts", "design", "typography", "icons", "checklist", "dark mode", "brand style"],
    },
    {
      id: "catalog-manage",
      category: "catalog",
      badge: "Catalog & Menu",
      timeEst: "4 Mins",
      title: "Managing Products, Discounts & Variants",
      summary: "Organize items with clear photography, promotional discounted rates, and optional item variations.",
      illustration: "catalog-manage",
      steps: [
        {
          title: "Open Catalog or Menu Tab",
          desc: "Select the 'Catalog' or 'Menu' section in the sidebar editor.",
        },
        {
          title: "Create Categories",
          desc: "Click '+ New Category' to group your offerings logically.",
        },
        {
          title: "Fill Item Details",
          desc: "Click '+ Add Item'. Enter title, description, base price, and optional promo price.",
        },
        {
          title: "Assign Featured Badges",
          desc: "Set badges such as 'Best Seller' or 'Promo' to spotlight products in top showcases.",
        },
      ],
      tip: "Toggle 'Out of Stock' to disable ordering when item inventory is depleted.",
      actionUrl: "/dashboard",
      actionLabel: "Manage Catalog",
      tags: ["catalog", "menu", "add product", "pricing", "promo", "best seller", "stock", "discount"],
    },
    {
      id: "wa-order",
      category: "orders",
      badge: "Orders",
      timeEst: "2 Mins",
      title: "Receiving Direct WhatsApp Orders",
      summary: "Shoppers can add multiple products to their cart and send a structured receipt directly to your WhatsApp.",
      illustration: "wa-order",
      steps: [
        {
          title: "Configure WhatsApp Phone Number",
          desc: "In the 'Contact' tab, enter your active business WhatsApp phone number.",
        },
        {
          title: "Shoppers Select Products",
          desc: "Visitors browse the catalog, select variants, and click '+ Order' to populate the cart.",
        },
        {
          title: "Structured Receipt Checkout",
          desc: "Clicking checkout opens WhatsApp with a clean summary of items, quantities, and the order total.",
        },
        {
          title: "Direct Merchant Fulfillment",
          desc: "Confirm details directly with the customer and fulfill without intermediate platform fees.",
        },
      ],
      tip: "Pair with WhatsApp Business to set automatic greeting replies for website leads.",
      actionUrl: "/dashboard",
      actionLabel: "Check Contact Settings",
      tags: ["whatsapp", "orders", "shopping cart", "cart", "checkout", "sales"],
    },
    {
      id: "publish-domain",
      category: "domain",
      badge: "Go Live",
      timeEst: "3 Mins",
      title: "Publishing Your Site & Connecting Domains",
      summary: "Go live immediately with a free subdomain, or link your existing custom domain (.com / .id) for full ownership.",
      illustration: "publish-domain",
      steps: [
        {
          title: "Click Publish",
          desc: "Click the 'Publish' button in the top right of the editor. Your site is accessible publicly.",
        },
        {
          title: "Use Your Free Address",
          desc: "A ready-to-share address (e.g., yourbrand.webjoz.com) is created instantly.",
        },
        {
          title: "Connect a Custom Domain",
          desc: "Go to the 'Domain' tab on your dashboard to attach your registered domain (e.g., yourbrand.com).",
        },
        {
          title: "Configure DNS CNAME",
          desc: "Add a CNAME record at your domain registrar according to the 1-step guide.",
        },
      ],
      tip: "All domains on Webjoz come with automated, free lifetime SSL encryption.",
      actionUrl: "/dashboard",
      actionLabel: "Publish Website",
      tags: ["publish", "domain", "custom domain", "live", "address", "dns"],
    },
    {
      id: "seo-meta",
      category: "seo",
      badge: "SEO & Search",
      timeEst: "3 Mins",
      title: "Optimizing SEO & Link Previews",
      summary: "Configure titles, Google search snippets, keywords, and preview thumbnails so your website ranks well and looks great when shared.",
      illustration: "seo-meta",
      steps: [
        {
          title: "Open SEO Settings",
          desc: "From the editor top bar or site dashboard, click the 'SEO' tab.",
        },
        {
          title: "Use 'Generate with AI'",
          desc: "Click 'Generate dengan AI' next to Meta Title and Meta Description to create search-optimized copy automatically.",
        },
        {
          title: "Add Target Keywords",
          desc: "Enter terms prospective customers search for (e.g., 'jogja culinary', 'premium catering') and hit Enter.",
        },
        {
          title: "Save Changes",
          desc: "Click 'Simpan' to apply. Search engines will read these metadata tags when indexing your site.",
        },
      ],
      tip: "Keep Meta Descriptions between 140-155 characters for optimal display on Google search result cards.",
      actionUrl: "/dashboard",
      actionLabel: "Open SEO Settings",
      tags: ["seo", "google", "meta title", "meta description", "keywords", "ranking", "favicon", "search"],
    },
    {
      id: "integrations",
      category: "integrations",
      badge: "Analytics & Ads",
      timeEst: "2 Mins",
      title: "Connecting Google Analytics & Meta Pixel",
      summary: "Connect visitor analytics and Facebook/Instagram ad conversion tracking without writing any code or editing HTML.",
      illustration: "integrations",
      steps: [
        {
          title: "Open Integrations Tab",
          desc: "From your site dashboard or editor, select the 'Integrasi' tab.",
        },
        {
          title: "Enter Google Analytics 4 ID",
          desc: "Paste your GA4 Measurement ID (format: G-XXXXXXXXXX) into the Google Analytics field.",
        },
        {
          title: "Enter Meta Pixel ID",
          desc: "Paste your 15-16 digit Pixel ID from Meta Events Manager to track Instagram & Facebook ad conversions.",
        },
        {
          title: "Click Save",
          desc: "Click 'Simpan'. Tracking scripts will immediately activate across all pages of your website.",
        },
      ],
      tip: "Traffic metrics will start populating in your Google Analytics and Meta Events Manager dashboards within a few hours.",
      actionUrl: "/dashboard",
      actionLabel: "Open Integrations",
      tags: ["analytics", "pixel", "facebook ads", "google analytics", "ga4", "tracking", "meta pixel", "ads"],
    },
    {
      id: "blog-ai",
      category: "blog",
      badge: "Blog & Articles",
      timeEst: "5 Mins",
      title: "Create & Manage Blog Articles with AI",
      summary: "Add a blog section to your website. Use AI to generate professional articles based on topics you specify.",
      illustration: "blog-ai",
      steps: [
        {
          title: "Open the Blog Tab",
          desc: "In the site editor, click the 'Blog' tab to open the article management panel.",
        },
        {
          title: "Generate an Article with AI",
          desc: "Type in a topic or title, then click 'Generate AI'. A complete, well-structured article is created automatically.",
        },
        {
          title: "Edit & Refine Content",
          desc: "Open the article editor to adjust the title, body, cover image, and SEO meta fields before publishing.",
        },
        {
          title: "Choose Blog Layout",
          desc: "Select a blog page display style: Grid, List, Featured, or Minimal to match your site aesthetic.",
        },
      ],
      tip: "Blog articles improve organic SEO. Target relevant keywords in each post to increase Google discoverability.",
      actionUrl: "/dashboard",
      actionLabel: "Open Blog Manager",
      tags: ["blog", "articles", "content", "ai generate", "seo blog", "writing"],
    },
    {
      id: "leads-inbox",
      category: "leads",
      badge: "Leads & Contact",
      timeEst: "2 Mins",
      title: "Managing Leads & Visitor Messages",
      summary: "All messages submitted through your website's contact form are automatically saved in the Leads Inbox. Reply directly via WhatsApp or email.",
      illustration: "leads-inbox",
      steps: [
        {
          title: "Open the Leads Menu",
          desc: "From the dashboard sidebar, click 'Leads' to view all incoming messages from website visitors.",
        },
        {
          title: "View Lead Details",
          desc: "Click a lead card to see full details: name, email, phone number, and the visitor's message.",
        },
        {
          title: "Reply via WhatsApp or Email",
          desc: "Click the WhatsApp or Email button on the lead card to respond to prospective customers in one click.",
        },
        {
          title: "Filter by Website",
          desc: "Use the filter dropdown to view leads from a specific site if you manage multiple websites.",
        },
      ],
      tip: "Responding to leads within the first hour increases conversion rates by up to 7x compared to responding after 24 hours.",
      actionUrl: "/dashboard/leads",
      actionLabel: "Open Leads Inbox",
      tags: ["leads", "contact form", "inbox", "messages", "customers", "follow up"],
    },
    {
      id: "testimonials-manage",
      category: "testimonials",
      badge: "Testimonials",
      timeEst: "3 Mins",
      title: "Collect & Display Customer Testimonials",
      summary: "Share a dedicated link to collect star ratings and reviews. Moderate and approve submissions before they appear on your live website.",
      illustration: "testimonials-manage",
      steps: [
        {
          title: "Open the Testimonials Tab",
          desc: "In the site editor, click the 'Testimoni' tab to manage customer reviews.",
        },
        {
          title: "Share the Submission Link",
          desc: "Copy the testimonial form link and send it to customers via WhatsApp. They can fill in their name, review, and star rating.",
        },
        {
          title: "Moderate Incoming Reviews",
          desc: "New reviews arrive with 'Pending' status. Click ✓ to Approve or ✗ to Reject before they appear on your site.",
        },
        {
          title: "Testimonials Publish Automatically",
          desc: "Approved testimonials immediately appear in your website's review section in an elegant card layout.",
        },
      ],
      tip: "Testimonials with a full name and role tend to build more trust. Request reviews right after a successful transaction.",
      actionUrl: "/dashboard",
      actionLabel: "Manage Testimonials",
      tags: ["testimonials", "reviews", "ratings", "stars", "customer trust", "social proof"],
    },
    {
      id: "analytics-dashboard",
      category: "analytics",
      badge: "Analytics",
      timeEst: "2 Mins",
      title: "Monitoring Traffic & Website Performance",
      summary: "Track total visitors, popular pages, traffic sources, and session duration. Filter by date range and individual website.",
      illustration: "analytics-dashboard",
      steps: [
        {
          title: "Open Analytics",
          desc: "From the dashboard sidebar, click 'Analytics' to view performance summaries across all your websites.",
        },
        {
          title: "Filter by Period & Website",
          desc: "Use presets (7 days, 30 days, 90 days) or a custom date range. Filter further by a specific website.",
        },
        {
          title: "Read Key Metrics",
          desc: "Review the 4 main cards: Total Pageviews, Unique Visitors, Average Session Duration, and Total Leads.",
        },
        {
          title: "Analyze Pages & Traffic Sources",
          desc: "Scroll down to see your most visited pages and where visitors arrived from (Google, WhatsApp, direct, etc.).",
        },
      ],
      tip: "Compare the last 30 days vs the previous period to measure the impact of any content updates or promotions you ran.",
      actionUrl: "/dashboard/analytics",
      actionLabel: "Open Analytics",
      tags: ["analytics", "traffic", "visitors", "statistics", "pageviews", "performance", "reports"],
    },
    {
      id: "orders-tracker",
      category: "orders",
      badge: "Order Tracking",
      timeEst: "2 Mins",
      title: "Tracking & Managing Order Status",
      summary: "View all WhatsApp cart orders in one dashboard. Update order status from New through to Completed.",
      illustration: "orders-tracker",
      steps: [
        {
          title: "Open Orders Menu",
          desc: "From the dashboard sidebar, click 'Orders' to view all incoming WhatsApp orders.",
        },
        {
          title: "View Order Details",
          desc: "Click an order row to see full details: item list, total price, customer name and phone number.",
        },
        {
          title: "Update Order Status",
          desc: "Change the status to reflect fulfillment progress: New → Confirmed → Processing → Shipped → Done (or Cancelled).",
        },
        {
          title: "Filter & Search Orders",
          desc: "Use the search field or filter by status and website to quickly locate a specific order.",
        },
      ],
      tip: "Keeping order statuses up to date makes it easy to track fulfillment and maintain a good customer experience.",
      actionUrl: "/dashboard/orders",
      actionLabel: "View Orders",
      tags: ["orders", "status", "tracking", "fulfillment", "order history"],
    },
    {
      id: "team-invite",
      category: "team",
      badge: "Team & Collaboration",
      timeEst: "2 Mins",
      title: "Inviting Team Members to Your Account",
      summary: "Add colleagues or assistants to your Webjoz business account. Assign roles so each member gets appropriate access.",
      illustration: "team-invite",
      steps: [
        {
          title: "Open Team Settings",
          desc: "From the dashboard sidebar, click 'Team' to see current members and active invitations.",
        },
        {
          title: "Enter Email & Role",
          desc: "Type your colleague's email. Select a role: 'Editor' (can edit websites) or 'Admin' (full access including billing).",
        },
        {
          title: "Send Invitation",
          desc: "Click 'Invite'. Your colleague will receive an email with a link to join your team account.",
        },
        {
          title: "Manage Members",
          desc: "Joined members appear in the list. You can change roles or revoke access at any time.",
        },
      ],
      tip: "Team features are available on the Pro plan. Editor-role members cannot access the Billing & Upgrade section.",
      actionUrl: "/dashboard/team",
      actionLabel: "Manage Team",
      tags: ["team", "invite", "collaboration", "editor", "admin", "members"],
    },
    {
      id: "usage-quota",
      category: "usage",
      badge: "Usage & Quota",
      timeEst: "1 Min",
      title: "Monitoring AI Quota & Plan Limits",
      summary: "See how many AI generations you've used, remaining website slots, and your active plan details — all in one concise view.",
      illustration: "usage-quota",
      steps: [
        {
          title: "Open Usage Page",
          desc: "From the sidebar or account menu, click 'Usage' to view a summary of your active plan quota.",
        },
        {
          title: "Check AI Generate Quota",
          desc: "See how many times you've used 'AI Create Website' from your plan's total quota.",
        },
        {
          title: "Check Website Slot Usage",
          desc: "A usage meter shows your current active website count vs your plan's maximum.",
        },
        {
          title: "Upgrade When Nearing the Limit",
          desc: "When approaching your quota ceiling, click 'Upgrade Plan' to unlock a larger quota and premium features.",
        },
      ],
      tip: "AI generate quota resets monthly on the same date as your original subscription date.",
      actionUrl: "/dashboard/usage",
      actionLabel: "View Usage",
      tags: ["quota", "usage", "ai generate", "limit", "plan", "upgrade"],
    },
    {
      id: "account-security",
      category: "settings",
      badge: "Account & Security",
      timeEst: "2 Mins",
      title: "Account Security, Notifications & Active Sessions",
      summary: "Change your password, manage email & push alert preferences, and inspect or revoke active login sessions across devices.",
      illustration: "account-security",
      steps: [
        {
          title: "Open Settings",
          desc: "From the dashboard sidebar or your user menu at top right, click 'Settings'.",
        },
        {
          title: "Change Account Password",
          desc: "Under the 'Security' tab, provide your current password and set a new secure password.",
        },
        {
          title: "Set Notification Preferences",
          desc: "In the 'Notifications' tab, choose which alerts you receive by email (new orders, leads, or system updates).",
        },
        {
          title: "Inspect & Revoke Device Sessions",
          desc: "Under the 'Devices' tab, review currently active sessions and revoke any unfamiliar device immediately.",
        },
      ],
      tip: "Keep your password unique and periodically review active sessions to safeguard your business account.",
      actionUrl: "/dashboard/settings",
      actionLabel: "Open Settings",
      tags: ["settings", "security", "password", "notifications", "devices", "sessions", "profile"],
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
          a: "Webjoz adalah platform AI website builder yang membantu Anda membuat website bisnis profesional dalam hitungan menit tanpa perlu coding.",
        },
        {
          q: "Bagaimana cara membuat website pertama?",
          a: 'Klik "+ Website Baru" di dashboard, ikuti wizard percakapan untuk memasukkan detail bisnis, lalu pilih template yang sesuai.',
        },
        {
          q: "Apakah saya perlu bisa coding?",
          a: "Tidak sama sekali. Semua proses pembuatan dan penyesuaian website dilakukan melalui antarmuka visual dan bantuan AI.",
        },
        {
          q: "Berapa lama waktu pembuatan website?",
          a: "Umumnya 3-5 menit. AI akan menyusun konten, struktur halaman, dan visual yang dapat langsung dipublikasikan atau disesuaikan.",
        },
      ],
    },
    {
      id: "features",
      title: "Fitur & Desain",
      items: [
        {
          q: "Fitur apa saja yang tersedia di Webjoz?",
          a: "AI website generator, custom domain, inline editor, katalog & menu produk, keranjang belanja WhatsApp, form kontak, dan analitik performa.",
        },
        {
          q: "Bisakah saya menggunakan domain sendiri?",
          a: "Ya. Anda dapat menghubungkan domain kustom (.com, .id, .co.id, dll) yang sudah Anda miliki melalui tab Domain di dashboard.",
        },
        {
          q: "Apakah website sudah SEO-friendly?",
          a: "Ya. Setiap halaman otomatis dilengkapi struktur meta tag, sitemap XML, dan markup responsif untuk mesin pencari.",
        },
      ],
    },
    {
      id: "catalog-menu",
      title: "Katalog & Pemesanan",
      items: [
        {
          q: "Bagaimana sistem pemesanan via WhatsApp bekerja?",
          a: "Pengunjung memilih produk, memilih varian jika ada, lalu checkout ke WhatsApp. Pesan otomatis terformat rapi terkirim langsung ke nomor bisnis Anda.",
        },
        {
          q: "Bisakah pengunjung memesan beberapa item sekaligus?",
          a: "Ya. Fitur keranjang belanja (cart) menampung banyak produk sekaligus sebelum checkout dalam satu pesan rekap terstruktur.",
        },
      ],
    },
    {
      id: "domains-billing",
      title: "Domain & Akun",
      items: [
        {
          q: "Berapa lama verifikasi domain kustom?",
          a: "Umumnya 5-30 menit setelah pengaturan CNAME record selesai di penyedia domain Anda.",
        },
        {
          q: "Metode pembayaran apa yang didukung?",
          a: "Transfer Bank (BCA, Mandiri, BRI, BNI), E-Wallet (GoPay, OVO, DANA, ShopeePay), Kartu Debit/Kredit, dan PayPal.",
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
          a: "Webjoz is an AI website builder designed to help businesses launch professional websites in minutes with no coding required.",
        },
        {
          q: "How do I create my first website?",
          a: "Click '+ New Website' in the dashboard, provide your business details in the wizard, and select your preferred template.",
        },
        {
          q: "Do I need technical skills?",
          a: "None at all. All website generation and content modifications are handled through a straightforward visual interface.",
        },
      ],
    },
    {
      id: "features",
      title: "Features & Design",
      items: [
        {
          q: "What features are included?",
          a: "AI website generation, custom domain support, inline visual editing, product catalogs, WhatsApp shopping carts, and analytics.",
        },
        {
          q: "Can I connect my own domain?",
          a: "Yes. Connect any custom domain (.com, .id, etc.) easily via the Domain settings in the dashboard.",
        },
      ],
    },
    {
      id: "catalog-menu",
      title: "Catalog & Orders",
      items: [
        {
          q: "How does WhatsApp ordering work?",
          a: "Customers browse products, add items to their cart, and checkout directly into your WhatsApp number with a structured order summary.",
        },
      ],
    },
    {
      id: "domains-billing",
      title: "Domains & Billing",
      items: [
        {
          q: "How long does custom domain verification take?",
          a: "Usually between 5 to 30 minutes once your CNAME DNS records are saved.",
        },
      ],
    },
  ],
};

// ─── Localized Text Strings ───────────────────────────────────────────────────

const TEXT = {
  id: {
    back: "← Kembali ke Beranda",
    badge: "Pusat Bantuan",
    title: "Pusat Bantuan & Panduan",
    subtitle: "Temukan petunjuk langkah demi langkah dan jawaban atas pertanyaan umum seputar Webjoz.",
    searchPlaceholder: "Cari panduan atau pertanyaan... (contoh: bikin website, ganti foto, domain)",
    clear: "Hapus",
    tabGuides: "Petunjuk Penggunaan",
    tabFaq: "Tanya Jawab (FAQ)",
    allGuides: "Semua",
    allCategories: "Semua Kategori",
    stepsTitle: "Langkah-Langkah:",
    proTipBadge: "CATATAN",
    hideDetails: "Tutup",
    viewDetails: "Lihat Panduan",
    noResults: (q: string) => `Tidak ada hasil untuk "${q}"`,
    noResultsSub: "Coba kata kunci lain atau hubungi customer service kami.",
    ctaTitle: "Butuh bantuan lebih lanjut?",
    ctaDesc: "Tim Customer Service Webjoz siap membantu pertanyaanmu via WhatsApp.",
    ctaHours: "Senin–Sabtu 08.00–21.00 WIB",
    ctaWa: "Hubungi via WhatsApp",
    ctaEmail: "Kirim Email",
    waMsg: "Halo CS Webjoz, saya butuh panduan penggunaan",
    matchingGuides: "Petunjuk Penggunaan",
    matchingFaq: "Tanya Jawab",
    videoBadge: "Video Tutorial",
    videoDuration: "2:20 Menit",
    videoTitle: "Membuat Website Pertama dengan AI (Walkthrough)",
    videoDesc: "Tonton langkah demi langkah dari mengisi nama usaha, proses rancang otomatis AI, hingga website siap dipublikasikan.",
  },
  en: {
    back: "← Back to Home",
    badge: "Help Center",
    title: "Help Center & Guides",
    subtitle: "Find step-by-step instructions and answers to frequently asked questions about Webjoz.",
    searchPlaceholder: "Search guides or questions... (e.g. create site, change photo, domain)",
    clear: "Clear",
    tabGuides: "User Guides",
    tabFaq: "FAQ",
    allGuides: "All",
    allCategories: "All Categories",
    stepsTitle: "Instructions:",
    proTipBadge: "NOTE",
    hideDetails: "Close",
    viewDetails: "View Guide",
    noResults: (q: string) => `No results for "${q}"`,
    noResultsSub: "Try a different keyword or contact our support team.",
    ctaTitle: "Need further assistance?",
    ctaDesc: "Webjoz Customer Support is ready to assist your queries via WhatsApp.",
    ctaHours: "Mon–Sat 08.00–21.00 WIB",
    ctaWa: "Contact via WhatsApp",
    ctaEmail: "Send Email",
    waMsg: "Hi Webjoz Support, I need some guidance",
    matchingGuides: "User Guides",
    matchingFaq: "FAQ Items",
    videoBadge: "Video Tutorial",
    videoDuration: "2:20 Min",
    videoTitle: "Building Your First Website with AI (Walkthrough)",
    videoDesc: "Watch step-by-step from entering your business name, AI generation, to publishing your ready website.",
  },
};

// ─── Screenshot Map ──────────────────────────────────────────────────────────

const GUIDE_SCREENSHOTS: Record<string, string> = {
  "ai-create": "/guide/step-ai-generate.png",
  "inline-edit": "/guide/step-editor-overview.png",
  "brand-style": "/guide/step-editor-design.png",
  "catalog-manage": "/guide/step-catalog.png",
  "wa-order": "/guide/step-wa-order.png",
  "publish-domain": "/guide/step-publish-preview.png",
  "seo-meta": "/guide/step-seo.png",
  "integrations": "/guide/step-integrations.png",
  "blog-ai": "/guide/step-editor-panel.png",
  "leads-inbox": "/guide/step-dashboard-sites.png",
  "testimonials-manage": "/guide/step-dashboard-sites.png",
  "analytics-dashboard": "/guide/step-dashboard-sites.png",
  "orders-tracker": "/guide/step-dashboard-sites.png",
  "team-invite": "/guide/step-dashboard-sites.png",
  "usage-quota": "/guide/step-dashboard-sites.png",
  "account-security": "/guide/step-dashboard-sites.png",
};

// ─── Guide Illustration (Real UI Screenshot) ─────────────────────────────────

function GuideIllustration({ type }: { type: string }) {
  const src = GUIDE_SCREENSHOTS[type];
  if (!src) return null;
  return (
    <div className="w-full overflow-hidden rounded-xl border border-border/70 bg-muted/20">
      <Image
        src={src}
        alt={type}
        width={1200}
        height={700}
        className="w-full h-auto object-cover object-top"
        style={{ maxHeight: "220px", objectPosition: type === "publish-domain" || type === "ai-create" || type === "wa-order" ? "top center" : "top left" }}
      />
    </div>
  );
}

// ─── (Legacy switch kept as reference — replaced by image above) ─────────────
function _LegacyGuideIllustration({ type }: { type: string }) {
  switch (type) {
    case "ai-create":
      return (
        <div className="w-full rounded-xl p-3 bg-muted/30 border border-border/70 space-y-2">
          <div className="flex items-center justify-between text-[11px] font-medium text-foreground">
            <span className="flex items-center gap-1.5">
              <SparkleGenAI className="w-3.5 h-3.5 text-foreground inline-block" />
              Asisten Pembuat AI
            </span>
            <span className="text-[10px] font-mono text-muted-foreground">Langkah 1/3</span>
          </div>
          <div className="p-2 rounded-lg bg-card border border-border/80 text-xs text-muted-foreground flex items-center justify-between">
            <span className="truncate pr-2">Nama bisnis & jenis usaha...</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-muted border border-border text-foreground font-medium shrink-0">
              Generate
            </span>
          </div>
          <div className="flex gap-2 pt-0.5">
            <div className="flex-1 p-2 rounded-lg bg-card border border-border/70 space-y-1.5">
              <div className="w-16 h-1.5 rounded bg-foreground/40" />
              <div className="w-full h-1 rounded bg-muted-foreground/30" />
              <div className="w-2/3 h-1 rounded bg-muted-foreground/20" />
            </div>
            <div className="w-16 h-10 rounded-lg bg-muted border border-border/80 flex items-center justify-center text-[10px] text-muted-foreground font-medium shrink-0">
              Preview
            </div>
          </div>
        </div>
      );

    case "inline-edit":
      return (
        <div className="w-full rounded-xl p-3 bg-muted/30 border border-border/70 space-y-2">
          <div className="flex items-center justify-between text-[11px] font-medium text-foreground">
            <span className="flex items-center gap-1.5">
              <MousePointerClick className="w-3.5 h-3.5 text-muted-foreground" />
              Klik & Ketik Langsung
            </span>
            <span className="text-[10px] text-muted-foreground font-mono">Editor</span>
          </div>
          <div className="p-2 rounded-lg bg-card border border-foreground/30 relative">
            <span className="text-xs font-medium text-foreground">Kopi Spesial Tubruk Nusantara</span>
            <span className="inline-block w-1.5 h-3 bg-foreground ml-1 animate-pulse align-middle" />
          </div>
          <p className="text-[10px] text-muted-foreground">
            Arahkan kursor ke tulisan atau foto di preview untuk mengubah isinya.
          </p>
        </div>
      );

    case "brand-style":
      return (
        <div className="w-full rounded-xl p-3 bg-muted/30 border border-border/70 space-y-2">
          <div className="flex items-center justify-between text-[11px] font-medium text-foreground">
            <span className="flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-muted-foreground" />
              Palet & Ikon Checklist
            </span>
            <span className="text-[10px] text-muted-foreground font-mono">Desain</span>
          </div>
          {/* Neutral Swatches */}
          <div className="flex items-center gap-1.5">
            {["#18181b", "#3f3f46", "#71717a", "#a1a1aa", "#e4e4e7"].map((hex, i) => (
              <div key={i} className="flex-1 flex flex-col items-center">
                <div
                  className={cn(
                    "w-6 h-6 rounded-md border border-border flex items-center justify-center",
                    i === 0 && "ring-1 ring-foreground ring-offset-1",
                  )}
                  style={{ backgroundColor: hex }}
                >
                  {i === 0 && <Check className="w-3 h-3 text-white stroke-[2.5]" />}
                </div>
              </div>
            ))}
          </div>
          {/* Neutral Checklist Markers */}
          <div className="pt-1 border-t border-border/60 flex items-center justify-between text-[10px] text-muted-foreground">
            <span>Ikon Poin:</span>
            <div className="flex items-center gap-1 font-mono text-foreground">
              <span className="px-1.5 py-0.5 rounded bg-card border border-border">✓</span>
              <span className="px-1.5 py-0.5 rounded bg-card border border-border">•</span>
              <span className="px-1.5 py-0.5 rounded bg-card border border-border">✦</span>
              <span className="px-1.5 py-0.5 rounded bg-card border border-border">+</span>
              <span className="px-1.5 py-0.5 rounded bg-card border border-border">🛡</span>
              <span className="px-1.5 py-0.5 rounded bg-card border border-border">◆</span>
            </div>
          </div>
        </div>
      );

    case "catalog-manage":
      return (
        <div className="w-full rounded-xl p-3 bg-muted/30 border border-border/70 space-y-2">
          <div className="flex items-center justify-between text-[11px] font-medium text-foreground">
            <span className="flex items-center gap-1.5">
              <ShoppingBag className="w-3.5 h-3.5 text-muted-foreground" />
              Item & Kategori Produk
            </span>
            <span className="text-[10px] text-muted-foreground font-mono">Katalog</span>
          </div>
          <div className="p-2 rounded-lg bg-card border border-border flex items-center gap-2.5">
            <div className="w-10 h-10 rounded bg-muted border border-border flex items-center justify-center text-[10px] text-muted-foreground shrink-0">
              Foto
            </div>
            <div className="flex-1 min-w-0 space-y-0.5">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold text-foreground truncate">Nama Produk Utama</span>
                <span className="text-[9px] font-medium px-1.5 py-0.2 rounded bg-muted border border-border text-foreground shrink-0">Unggulan</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="font-semibold text-foreground">Rp 25.000</span>
                <span className="text-[10px] line-through text-muted-foreground">Rp 30.000</span>
              </div>
            </div>
          </div>
        </div>
      );

    case "wa-order":
      return (
        <div className="w-full rounded-xl p-3 bg-muted/30 border border-border/70 space-y-2">
          <div className="flex items-center justify-between text-[11px] font-medium text-foreground">
            <span className="flex items-center gap-1.5">
              <MessageCircle className="w-3.5 h-3.5 text-muted-foreground" />
              Pemesanan WhatsApp
            </span>
            <span className="text-[10px] text-muted-foreground font-mono">Cart</span>
          </div>
          <div className="p-2 rounded-lg bg-card border border-border text-[11px] text-muted-foreground leading-relaxed space-y-0.5">
            <p className="font-semibold text-foreground">Rekap Pesanan Baru:</p>
            <p>1x Produk Utama — Rp 25.000</p>
            <p className="font-semibold text-foreground pt-0.5">Total: Rp 25.000</p>
          </div>
        </div>
      );

    case "publish-domain":
      return (
        <div className="w-full rounded-xl p-3 bg-muted/30 border border-border/70 space-y-2">
          <div className="flex items-center justify-between text-[11px] font-medium text-foreground">
            <span className="flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-muted-foreground" />
              Alamat Website
            </span>
            <span className="text-[10px] text-muted-foreground font-mono">Domain</span>
          </div>
          <div className="p-2 rounded-lg bg-card border border-border flex items-center justify-between text-xs">
            <span className="font-mono text-foreground truncate">https://tokosaya.com</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-muted border border-border text-foreground font-medium shrink-0 ml-2">
              Aktif
            </span>
          </div>
        </div>
      );

    default:
      return null;
  }
}
// ─────────────────────────────────────────────────────────────────────────────

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
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <Link href="/" className="text-xs text-muted-foreground hover:text-foreground transition mb-6 inline-block">
          {text.back}
        </Link>

        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-muted text-muted-foreground text-xs font-medium mb-3">
            <HelpCircle className="size-3.5" />
            {text.badge}
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">{text.title}</h1>
          <p className="text-sm text-muted-foreground max-w-xl leading-relaxed">{text.subtitle}</p>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <input
            type="text"
            placeholder={text.searchPlaceholder}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActiveFaqCategory(null);
              setActiveGuideCategory(null);
            }}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-card text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-foreground focus:border-foreground transition"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
            >
              {text.clear}
            </button>
          )}
        </div>

        {/* Main Tabs (Guides vs FAQ) - Minimalist Underline Style */}
        {!isSearching && (
          <div className="flex border-b border-border mb-6">
            <button
              type="button"
              onClick={() => setMainTab("guides")}
              className={cn(
                "px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors cursor-pointer",
                mainTab === "guides"
                  ? "border-foreground text-foreground font-semibold"
                  : "border-transparent text-muted-foreground hover:text-foreground",
              )}
            >
              {text.tabGuides}
            </button>
            <button
              type="button"
              onClick={() => setMainTab("faq")}
              className={cn(
                "px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors cursor-pointer",
                mainTab === "faq"
                  ? "border-foreground text-foreground font-semibold"
                  : "border-transparent text-muted-foreground hover:text-foreground",
              )}
            >
              {text.tabFaq}
            </button>
          </div>
        )}

        {/* ─── TAB 1: PETUNJUK PENGGUNAAN (USER GUIDES) ─────────────────────────── */}
        {(!isSearching && mainTab === "guides") && (
          <section className="space-y-6">
            {/* Guide Category Filter */}
            <div className="flex flex-wrap gap-1.5 mb-2">
              <button
                onClick={() => setActiveGuideCategory(null)}
                className={cn(
                  "px-3 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer",
                  !activeGuideCategory
                    ? "bg-foreground text-background font-semibold"
                    : "bg-muted/50 text-muted-foreground hover:text-foreground hover:bg-muted",
                )}
              >
                {text.allGuides}
              </button>
              {[
                { id: "start", label: lang === "id" ? "Mulai Cepat" : "Quick Start" },
                { id: "edit", label: lang === "id" ? "Edit Layar" : "Inline Edit" },
                { id: "design", label: lang === "id" ? "Desain & Gaya" : "Brand Style" },
                { id: "catalog", label: lang === "id" ? "Katalog & Menu" : "Catalog" },
                { id: "orders", label: lang === "id" ? "Pesanan & WA" : "Orders & WA" },
                { id: "domain", label: lang === "id" ? "Publikasi & Domain" : "Domain" },
                { id: "seo", label: "SEO & Google" },
                { id: "integrations", label: lang === "id" ? "Integrasi Pixel" : "Integrations" },
                { id: "blog", label: "Blog & Artikel" },
                { id: "leads", label: lang === "id" ? "Leads & Kontak" : "Leads" },
                { id: "testimonials", label: lang === "id" ? "Testimoni" : "Testimonials" },
                { id: "analytics", label: lang === "id" ? "Analitik" : "Analytics" },
                { id: "team", label: lang === "id" ? "Tim" : "Team" },
                { id: "usage", label: lang === "id" ? "Kuota & Paket" : "Usage" },
                { id: "settings", label: lang === "id" ? "Pengaturan & Keamanan" : "Settings" },
              ].map((c) => (
                <button
                  key={c.id}
                  onClick={() => setActiveGuideCategory(activeGuideCategory === c.id ? null : c.id)}
                  className={cn(
                    "px-3 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer",
                    activeGuideCategory === c.id
                      ? "bg-foreground text-background font-semibold"
                      : "bg-muted/50 text-muted-foreground hover:text-foreground hover:bg-muted",
                  )}
                >
                  {c.label}
                </button>
              ))}
            </div>

            {/* Featured Video Tutorial */}
            {(!activeGuideCategory || activeGuideCategory === "start") && (
              <div className="rounded-xl border border-border bg-card overflow-hidden shadow-xs">
                <div className="p-4 sm:p-5 flex items-center justify-between flex-wrap gap-3 border-b border-border/70">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-foreground/10 text-foreground flex items-center justify-center shrink-0">
                      <Play className="w-4 h-4 fill-current ml-0.5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-foreground/10 text-foreground">
                          {text.videoBadge}
                        </span>
                        <span className="text-[11px] font-mono text-muted-foreground">
                          {text.videoDuration}
                        </span>
                      </div>
                      <h3 className="text-sm font-semibold text-foreground">
                        {text.videoTitle}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {text.videoDesc}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="relative aspect-video w-full bg-black/90">
                  <video
                    controls
                    preload="metadata"
                    playsInline
                    poster="/guide/video-poster.png"
                    className="w-full h-full object-contain"
                  >
                    <source src="https://res.cloudinary.com/dckbihkyp/video/upload/v1793092413/guide-webjoz-gabung.mp4" type="video/mp4" />
                    <p className="text-xs text-muted-foreground p-4 text-center">
                      {lang === "id"
                        ? "Browser Anda tidak mendukung pemutaran video secara langsung."
                        : "Your browser does not support inline video playback."}
                    </p>
                  </video>
                </div>
              </div>
            )}

            {/* Guides Grid */}
            <div className="grid gap-4 md:grid-cols-2">
              {filteredGuides.map((guide) => {
                const isExpanded = expandedGuideId === guide.id;
                return (
                  <div
                    key={guide.id}
                    className={cn(
                      "rounded-xl border border-border bg-card p-5 transition-all flex flex-col space-y-3.5",
                      isExpanded ? "md:col-span-2 ring-1 ring-border shadow-xs" : "hover:border-foreground/30",
                    )}
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-muted text-muted-foreground">
                        {guide.badge}
                      </span>
                      <span className="text-[11px] text-muted-foreground font-mono">
                        {guide.timeEst}
                      </span>
                    </div>

                    {/* Title & Summary */}
                    <div className="space-y-1">
                      <h3 className="text-base font-semibold text-foreground leading-snug">{guide.title}</h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">{guide.summary}</p>
                    </div>

                    {/* Clean Monochrome Illustration */}
                    <div className="pt-0.5">
                      <GuideIllustration type={guide.illustration} />
                    </div>

                    {/* Expanded Steps */}
                    {isExpanded && (
                      <div className="pt-3 border-t border-border space-y-4">
                        <h4 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                          {text.stepsTitle}
                        </h4>

                        <div className="space-y-3">
                          {guide.steps.map((st, sIdx) => (
                            <div key={sIdx} className="flex items-start gap-2.5 text-xs">
                              <span className="w-5 h-5 rounded-full bg-muted border border-border text-[11px] font-semibold text-foreground flex items-center justify-center shrink-0 mt-0.5">
                                {sIdx + 1}
                              </span>
                              <div className="space-y-0.5">
                                <strong className="text-foreground font-semibold block">{st.title}</strong>
                                <span className="text-muted-foreground leading-relaxed block">{st.desc}</span>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Note Box */}
                        <div className="p-3 rounded-lg bg-muted/40 border border-border flex items-start gap-2.5 text-xs text-muted-foreground">
                          <Lightbulb className="w-3.5 h-3.5 text-foreground shrink-0 mt-0.5" />
                          <div>
                            <strong className="text-foreground font-semibold block mb-0.5">
                              {text.proTipBadge}
                            </strong>
                            <span>{guide.tip}</span>
                          </div>
                        </div>

                        {/* Action Link */}
                        <div className="pt-1">
                          <Link
                            href={guide.actionUrl}
                            className={buttonClassName({ variant: "default", size: "sm" })}
                          >
                            <span>{guide.actionLabel}</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </div>
                    )}

                    {/* Expand Button */}
                    <div className="pt-1 mt-auto">
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={() => setExpandedGuideId(isExpanded ? null : guide.id)}
                        className="w-full flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <span>{isExpanded ? text.hideDetails : text.viewDetails}</span>
                        <ChevronRight className={cn("w-3.5 h-3.5 transition-transform", isExpanded && "rotate-90")} />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* ─── TAB 2: TANYA JAWAB (FAQ) ────────────────────────────────────────── */}
        {(!isSearching && mainTab === "faq") && (
          <section className="space-y-6">
            {/* Category Filter */}
            <div className="flex flex-wrap gap-1.5 mb-6">
              <button
                onClick={() => setActiveFaqCategory(null)}
                className={cn(
                  "px-3 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer",
                  !activeFaqCategory
                    ? "bg-foreground text-background font-semibold"
                    : "bg-muted/50 text-muted-foreground hover:text-foreground hover:bg-muted",
                )}
              >
                {text.allCategories}
              </button>
              {faqData.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveFaqCategory(activeFaqCategory === cat.id ? null : cat.id)}
                  className={cn(
                    "px-3 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer",
                    activeFaqCategory === cat.id
                      ? "bg-foreground text-background font-semibold"
                      : "bg-muted/50 text-muted-foreground hover:text-foreground hover:bg-muted",
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
                  <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2.5">{cat.title}</h2>
                  <div className="space-y-1.5">
                    {cat.items.map((item, idx) => {
                      const id = `${cat.id}-${idx}`;
                      const isOpen = openFaqId === id;
                      return (
                        <div
                          key={id}
                          className="rounded-xl border border-border bg-card overflow-hidden transition-colors"
                        >
                          <button
                            onClick={() => setOpenFaqId(isOpen ? null : id)}
                            className="w-full flex items-center justify-between gap-4 px-4 py-3 text-left text-sm font-medium cursor-pointer"
                          >
                            <span>{item.q}</span>
                            <span className={cn("shrink-0 text-muted-foreground transition-transform duration-200 text-xs", isOpen && "rotate-180")}>
                              ▾
                            </span>
                          </button>
                          {isOpen && (
                            <div className="px-4 pb-3.5 text-xs text-muted-foreground leading-relaxed border-t border-border/60 pt-2.5">
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

        {/* ─── SEARCH RESULTS ─────────────────────────────────────────────────── */}
        {isSearching && (
          <section className="space-y-6">
            <p className="text-xs text-muted-foreground">
              {filteredGuides.length + totalFaqResults} {lang === "id" ? "hasil untuk" : "results for"} "{query}"
            </p>

            {filteredGuides.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {text.matchingGuides} ({filteredGuides.length})
                </h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  {filteredGuides.map((guide) => (
                    <div
                      key={guide.id}
                      onClick={() => {
                        setMainTab("guides");
                        setExpandedGuideId(guide.id);
                        setQuery("");
                      }}
                      className="p-3.5 rounded-xl border border-border bg-card hover:border-foreground/30 transition cursor-pointer space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-medium px-1.5 py-0.2 rounded bg-muted text-muted-foreground">
                          {guide.badge}
                        </span>
                        <span className="text-[10px] text-muted-foreground font-mono">{guide.timeEst}</span>
                      </div>
                      <h4 className="text-sm font-medium text-foreground">{guide.title}</h4>
                      <p className="text-xs text-muted-foreground line-clamp-2">{guide.summary}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {filteredFaqCategories.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {text.matchingFaq} ({totalFaqResults})
                </h3>
                <div className="space-y-1.5">
                  {filteredFaqCategories.flatMap((cat) => cat.items).map((item, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl border border-border bg-card space-y-1">
                      <strong className="text-xs font-semibold block text-foreground">{item.q}</strong>
                      <p className="text-xs text-muted-foreground leading-relaxed">{item.a}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {filteredGuides.length === 0 && totalFaqResults === 0 && (
              <div className="text-center py-12">
                <Search className="size-8 text-muted-foreground/30 mx-auto mb-2" />
                <p className="text-xs text-muted-foreground font-medium">{text.noResults(query)}</p>
                <p className="text-[11px] text-muted-foreground/60 mt-0.5">{text.noResultsSub}</p>
              </div>
            )}
          </section>
        )}

        {/* ─── CONTACT CS CTA (Monochrome) ────────────────────────────────────── */}
        <div className="mt-12 rounded-xl border border-border bg-card p-6 text-center">
          <h3 className="text-base font-semibold mb-1 text-foreground">{text.ctaTitle}</h3>
          <p className="text-xs text-muted-foreground mb-1">{text.ctaDesc}</p>
          <p className="text-[11px] text-muted-foreground font-mono mb-4">{text.ctaHours}</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5">
            <a
              href={getWhatsAppUrl(text.waMsg)}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonClassName({ variant: "default" })}
            >
              <span>{text.ctaWa}</span>
              <ExternalLink className="size-3.5 opacity-70" />
            </a>
            <a
              href={`mailto:${SUPPORT_EMAIL}`}
              className={buttonClassName({ variant: "secondary" })}
            >
              <Mail className="size-3.5" />
              <span>{text.ctaEmail}</span>
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
