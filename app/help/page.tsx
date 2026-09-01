"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, HelpCircle, Mail, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { getWhatsAppUrl, SUPPORT_EMAIL } from "@/lib/site-config";
import { useI18n } from "@/lib/i18n/context";

interface FAQItem {
  q: string;
  a: string;
  tags?: string[];
}

interface FAQCategory {
  id: string;
  title: string;
  icon: string;
  items: FAQItem[];
}

const FAQ_DATA: Record<string, FAQCategory[]> = {
  id: [
    {
      id: "getting-started",
      title: "Memulai",
      icon: "🚀",
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
      icon: "✨",
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
      id: "plans",
      title: "Paket & Harga",
      icon: "💰",
      items: [
        {
          q: "Paket apa saja yang tersedia?",
          a: "Kami menyediakan paket Free dan Pro. Paket Free memberikan 1 website dengan AI generate terbatas. Paket Pro memberikan lebih banyak website, AI generate unlimited, custom domain, dan fitur premium lainnya.",
        },
        {
          q: "Bagaimana cara upgrade paket?",
          a: 'Klik "Upgrade Paket" di sidebar dashboard, pilih paket yang sesuai, lalu lakukan pembayaran. Kami menerima pembayaran via Midtrans (transfer bank, e-wallet, kartu kredit) dan PayPal.',
        },
        {
          q: "Apakah ada free trial?",
          a: "Paket Free tersedia tanpa batas waktu. Anda bisa mencoba fitur dasar dan membuat 1 website. Jika ingin fitur lengkap, Anda bisa upgrade ke Pro kapan saja.",
        },
        {
          q: "Bagaimana cara menambah kuota AI generate?",
          a: "Kuota AI generate di-reset setiap awal bulan. Jika kuota Anda habis sebelum akhir bulan, Anda bisa upgrade ke paket dengan kuota lebih besar, atau menunggu reset bulanan.",
        },
      ],
    },
    {
      id: "domains",
      title: "Domain",
      icon: "🌐",
      items: [
        {
          q: "Bagaimana cara menghubungkan custom domain?",
          a: 'Buka halaman Website → pilih website → tab "Domain". Masukkan domain Anda, lalu ikuti instruksi DNS setup (tambahkan CNAME record atau A record). DNS akan terverifikasi dalam beberapa menit.',
        },
        {
          q: "Berapa lama verifikasi domain?",
          a: "Biasanya 5-30 menit tergantung provider DNS Anda. Jika lebih lama dari 1 jam, pastikan DNS record sudah benar dan tunggu propagation (bisa hingga 48 jam di kasus ekstrem).",
        },
        {
          q: "Bisakah saya membeli domain dari Webjoz?",
          a: "Ya! Kami menyediakan pencarian dan pembelian domain langsung dari dashboard. Harga domain bervariasi tergantung TLD — mulai dari Rp 100rb/tahun untuk .com.",
        },
      ],
    },
    {
      id: "billing",
      title: "Pembayaran",
      icon: "💳",
      items: [
        {
          q: "Metode pembayaran apa yang diterima?",
          a: "Kami menerima: Transfer Bank (BCA, Mandiri, BRI, BNI), E-Wallet (GoPay, OVO, DANA, ShopeePay), Kartu Kredit/Debit, dan PayPal untuk pembayaran internasional.",
        },
        {
          q: "Apakah ada refund?",
          a: "Ya, kami menyediakan refund sesuai kebijakan kami. Silakan baca halaman Kebijakan Refund untuk detail lengkap. Umumnya refund diproses dalam 3-7 hari kerja.",
        },
        {
          q: "Bagaimana cara melihat riwayat pembayaran?",
          a: 'Buka Dashboard → Upgrade Paket. Di sana Anda bisa melihat paket aktif Anda. Riwayat transaksi lengkap bisa dilihat di bagian "Billing" di pengaturan.',
        },
      ],
    },
    {
      id: "catalog-menu",
      title: "Katalog & Menu",
      icon: "🛍️",
      items: [
        {
          q: "Apa perbedaan antara Katalog dan Menu?",
          a: "Katalog cocok untuk toko produk fisik/digital — menampilkan foto, harga, fitur, dan spesifikasi. Menu cocok untuk bisnis kuliner — menampilkan hidangan per kategori lengkap dengan tags (mis. Vegetarian, Halal, Pedas) dan link order di platform delivery (GrabFood, GoFood, dll). Keduanya memiliki fitur pencarian, filter kategori, varian/add-on, dan pemesanan via WhatsApp.",
          tags: ["katalog", "menu", "produk"],
        },
        {
          q: "Bagaimana cara menambah kategori dan produk?",
          a: "Buka Dashboard → Website → tab Katalog/Menu. Klik \"+ Kategori Baru\" untuk membuat kategori (mis. Minuman, Makanan Utama). Di dalam kategori, klik \"+ Tambah Item\" untuk menambah produk/menu. Setiap item bisa diisi dengan: nama, deskripsi, harga, foto (bisa banyak), badge (mis. Best Seller), status stok, dan varian/add-on.",
          tags: ["kategori", "tambah produk", "item"],
        },
        {
          q: "Bagaimana cara kerja pencarian dan filter kategori?",
          a: "Di halaman website Anda, pengunjung bisa langsung mengetik di kotak pencarian untuk memfilter produk secara real-time — berdasarkan nama, deskripsi, tags, atau fitur. Di bawah kotak pencarian ada tombol kategori (pills) untuk menyaring per kategori. Hasil update otomatis tanpa perlu reload halaman.",
          tags: ["search", "filter", "pencarian", "kategori"],
        },
        {
          q: "Apa itu Tags pada item menu?",
          a: "Tags adalah label pendek yang mendeskripsikan karakteristik item — contoh: Vegetarian, Vegan, Halal, Pedas, Best Seller, Bebas Gluten. Tags ditampilkan sebagai chip berwarna di kartu item, dan bisa dicari oleh pengunjung. Tambahkan tags saat mengisi form item di Katalog/Menu manager.",
          tags: ["tags", "label", "vegetarian", "halal"],
        },
        {
          q: "Bagaimana cara menambahkan link GoFood, GrabFood, atau platform delivery lain?",
          a: "Di form item (saat tambah/edit item menu), ada kolom \"Platform Delivery\" — tambahkan nama platform (mis. GrabFood) dan URL link langsung ke item di platform tersebut. Hasilnya akan muncul sebagai tombol link di kartu item dengan indikator hijau online.",
          tags: ["delivery", "grabfood", "gofood", "shopee food", "platform"],
        },
        {
          q: "Apa itu Varian dan Add-On?",
          a: "Varian adalah pilihan yang mengubah harga item — misalnya ukuran (S/M/L) atau pilihan rasa. Add-on adalah tambahan opsional — misalnya topping, extra saus. Saat pengunjung klik \"Pesan\", mereka akan memilih varian/add-on dulu sebelum pesanan dikirim ke WhatsApp. Tambahkan varian lewat tombol \"+ Varian/Add-on\" di form item.",
          tags: ["varian", "add-on", "pilihan", "ukuran"],
        },
        {
          q: "Bagaimana cara menandai item sebagai habis/tidak tersedia?",
          a: "Di form edit item, aktifkan toggle \"Stok Habis\" atau atur \"Ketersediaan\" menjadi tidak tersedia. Item yang habis akan ditampilkan dengan overlay abu-abu dan badge \"Habis\" — tombol pesan otomatis dinonaktifkan sehingga pengunjung tidak bisa memesan.",
          tags: ["stok", "habis", "tidak tersedia", "availability"],
        },
        {
          q: "Bagaimana sistem pemesanan via WhatsApp bekerja?",
          a: "Pengunjung memilih produk/menu, klik \"Pesan\", pilih varian/add-on jika ada, lalu klik \"Kirim ke WhatsApp\". Pesan otomatis berisi daftar item yang dipesan (nama, varian, harga, jumlah) akan terbuka di WhatsApp dan dikirim langsung ke nomor bisnis Anda. Tidak perlu aplikasi kasir tambahan.",
          tags: ["whatsapp", "pesan", "order", "checkout"],
        },
        {
          q: "Bisakah pengunjung memesan banyak item sekaligus?",
          a: "Ya! Ada keranjang belanja (cart) yang bisa menampung banyak item dari berbagai kategori sekaligus. Pengunjung tinggal klik tombol \"+ Pesan\" di setiap item untuk menambahkan ke keranjang, lalu checkout semuanya sekaligus ke WhatsApp dalam satu pesan yang terstruktur.",
          tags: ["keranjang", "cart", "banyak item", "checkout"],
        },
        {
          q: "Berapa banyak kategori dan item yang bisa ditambahkan?",
          a: "Tidak ada batasan jumlah kategori maupun item di Webjoz. Anda bisa menambahkan sebanyak yang diperlukan. Semua varian tampilan katalog/menu (Grid, Classic, Dense, Tabs) sudah dioptimasi untuk menampilkan banyak item dengan performa yang baik.",
          tags: ["limit", "batasan", "banyak", "kapasitas"],
        },
        {
          q: "Tampilan Katalog/Menu ada berapa macam?",
          a: "Ada 10+ varian tampilan yang bisa dipilih: Cards (grid besar), Classic (grid dengan divider kategori), Grid Dense (grid padat untuk banyak item), Tabs by Category (tab per kategori), Compact List (baris horizontal), Text List (daftar teks gaya menu restoran fine dining), Split Hero, Showcase Featured, Masonry, dan lainnya. Ganti tampilan dari editor website.",
          tags: ["tampilan", "varian", "template", "layout"],
        },
      ],
    },
    {
      id: "troubleshooting",
      title: "Troubleshooting",
      icon: "🔧",
      items: [
        {
          q: "Website saya tidak muncul di Google, kenapa?",
          a: "Butuh waktu 1-7 hari bagi Google untuk mengindex website baru. Pastikan: (1) Website sudah dipublish, (2) Custom domain sudah terhubung (jika menggunakan), (3) Submit sitemap di Google Search Console.",
        },
        {
          q: "Form kontak tidak mengirim email, bagaimana?",
          a: "Leads dari form kontak tersimpan di dashboard (Website → Leads), bukan dikirim via email. Anda bisa memantau leads langsung di dashboard atau mengaktifkan notifikasi WhatsApp.",
        },
        {
          q: "Website saya lambat, bagaimana cara mengatasinya?",
          a: "Website Webjoz di-host di infrastruktur global kami. Jika lambat, kemungkinan: (1) Gambar terlalu besar — gunakan kompresi, (2) Cache browser — coba hard refresh, (3) CDN propagation — tunggu beberapa jam.",
        },
        {
          q: "Saya lupa password, bagaimana?",
          a: 'Klik "Lupa Password" di halaman login, masukkan email terdaftar, dan ikuti instruksi reset password yang dikirim ke email Anda.',
        },
      ],
    },
  ],
  en: [
    {
      id: "getting-started",
      title: "Getting Started",
      icon: "🚀",
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
        {
          q: "How long does it take to create a website?",
          a: "Usually 3-10 minutes depending on the complexity of your business. Our AI will automatically generate content, page structure, and design. You can publish immediately or make further customizations.",
        },
      ],
    },
    {
      id: "features",
      title: "Features",
      icon: "✨",
      items: [
        {
          q: "What features are available?",
          a: "Webjoz provides: AI website generator, custom domain, SEO optimization, product catalog, blog, lead capture form, analytics, testimonial collection, and WhatsApp integration. All features are included in your plan.",
        },
        {
          q: "Can I use my own domain?",
          a: "Yes! You can connect a custom domain you already own, or buy a new domain directly from the Webjoz dashboard. We support .com, .co.id, .id, and many other TLDs.",
        },
        {
          q: "Is my website SEO-friendly?",
          a: "Yes. Every website created with Webjoz is optimized for SEO — including meta tags, structured data, sitemap, and responsive design. You can also set the title, description, and keywords for each page.",
        },
        {
          q: "How does lead capture work?",
          a: "Your website will have a contact form that automatically collects name, email, phone, and message from visitors. All leads are stored in the dashboard and can be managed, replied to, or exported.",
        },
        {
          q: "Is there built-in analytics?",
          a: "Yes. The analytics dashboard shows total pageviews, daily traffic, most popular pages, and traffic sources. Data is updated in real-time.",
        },
      ],
    },
    {
      id: "plans",
      title: "Plans & Pricing",
      icon: "💰",
      items: [
        {
          q: "What plans are available?",
          a: "We offer Free and Pro plans. The Free plan gives you 1 website with limited AI generation. The Pro plan gives more websites, unlimited AI generation, custom domain, and other premium features.",
        },
        {
          q: "How do I upgrade my plan?",
          a: 'Click "Upgrade Plan" in the dashboard sidebar, choose the right plan, then make a payment. We accept payment via Midtrans (bank transfer, e-wallet, credit card) and PayPal.',
        },
        {
          q: "Is there a free trial?",
          a: "The Free plan is available indefinitely. You can try basic features and create 1 website. If you want full features, you can upgrade to Pro anytime.",
        },
        {
          q: "How do I add more AI generation quota?",
          a: "AI generation quota resets at the beginning of each month. If your quota runs out before the end of the month, you can upgrade to a plan with a larger quota, or wait for the monthly reset.",
        },
      ],
    },
    {
      id: "domains",
      title: "Domains",
      icon: "🌐",
      items: [
        {
          q: "How do I connect a custom domain?",
          a: 'Go to Website → select website → "Domain" tab. Enter your domain, then follow the DNS setup instructions (add CNAME or A record). DNS will be verified within a few minutes.',
        },
        {
          q: "How long does domain verification take?",
          a: "Usually 5-30 minutes depending on your DNS provider. If longer than 1 hour, make sure the DNS record is correct and wait for propagation (can take up to 48 hours in extreme cases).",
        },
        {
          q: "Can I buy a domain from Webjoz?",
          a: "Yes! We provide domain search and purchase directly from the dashboard. Domain prices vary by TLD — starting from around $10/year for .com.",
        },
      ],
    },
    {
      id: "billing",
      title: "Billing",
      icon: "💳",
      items: [
        {
          q: "What payment methods are accepted?",
          a: "We accept: Bank Transfer (BCA, Mandiri, BRI, BNI), E-Wallets (GoPay, OVO, DANA, ShopeePay), Credit/Debit Card, and PayPal for international payments.",
        },
        {
          q: "Is there a refund policy?",
          a: "Yes, we provide refunds according to our policy. Please read the Refund Policy page for full details. Generally, refunds are processed within 3-7 business days.",
        },
        {
          q: "How do I view my payment history?",
          a: 'Go to Dashboard → Upgrade Plan. There you can see your active plan. Full transaction history can be viewed in the "Billing" section in settings.',
        },
      ],
    },
    {
      id: "catalog-menu",
      title: "Catalog & Menu",
      icon: "🛍️",
      items: [
        {
          q: "What's the difference between Catalog and Menu?",
          a: "Catalog is suited for physical/digital product stores — displaying photos, prices, features, and specs. Menu is suited for food & beverage businesses — displaying dishes per category with tags (e.g. Vegetarian, Halal, Spicy) and order links on delivery platforms (GrabFood, GoFood, etc). Both support search, category filtering, variants/add-ons, and WhatsApp ordering.",
          tags: ["catalog", "menu", "product"],
        },
        {
          q: "How do I add categories and items?",
          a: 'Go to Dashboard → Website → Catalog/Menu tab. Click "+ New Category" to create a category (e.g. Drinks, Main Course). Inside the category, click "+ Add Item" to add a product/dish. Each item can have: name, description, price, photos (multiple), badge (e.g. Best Seller), stock status, and variants/add-ons.',
          tags: ["category", "add product", "item"],
        },
        {
          q: "How does the search and category filter work?",
          a: "On your website, visitors can type in the search box to filter products in real-time — by name, description, tags, or features. Below the search box there are category pill buttons to narrow by category. Results update instantly without reloading the page.",
          tags: ["search", "filter", "category"],
        },
        {
          q: "What are Tags on menu items?",
          a: "Tags are short labels describing item characteristics — e.g. Vegetarian, Vegan, Halal, Spicy, Best Seller, Gluten Free. Tags appear as colored chips on item cards and are searchable by visitors. Add tags when filling in the item form in the Catalog/Menu manager.",
          tags: ["tags", "label", "vegetarian", "halal"],
        },
        {
          q: "How do I add GoFood, GrabFood, or other delivery platform links?",
          a: 'In the item form (when adding/editing a menu item), there is a "Delivery Platforms" field — add the platform name (e.g. GrabFood) and the direct URL link to that item on the platform. It will appear as a link button on the item card with a green online indicator.',
          tags: ["delivery", "grabfood", "gofood", "shopee food", "platform"],
        },
        {
          q: "What are Variants and Add-Ons?",
          a: 'Variants are choices that change the item price — for example size (S/M/L) or flavor. Add-ons are optional extras — like toppings or extra sauce. When a visitor clicks "Order", they select variants/add-ons before the order is sent to WhatsApp. Add variants via the "+ Variant/Add-on" button in the item form.',
          tags: ["variant", "add-on", "options", "size"],
        },
        {
          q: "How do I mark an item as out of stock / unavailable?",
          a: 'In the item edit form, enable the "Out of Stock" toggle or set Availability to unavailable. Out-of-stock items are displayed with a grey overlay and an "Out of Stock" badge — the order button is automatically disabled so visitors cannot order.',
          tags: ["stock", "out of stock", "unavailable", "availability"],
        },
        {
          q: "How does the WhatsApp ordering system work?",
          a: 'Visitors select a product/dish, click "Order", choose variants/add-ons if any, then click "Send to WhatsApp". A pre-filled message containing the list of ordered items (name, variant, price, quantity) will open in WhatsApp and be sent directly to your business number. No additional POS app needed.',
          tags: ["whatsapp", "order", "checkout"],
        },
        {
          q: "Can visitors order multiple items at once?",
          a: 'Yes! There is a shopping cart that can hold multiple items from different categories at once. Visitors click the "+ Order" button on each item to add to the cart, then checkout everything at once to WhatsApp in a single structured message.',
          tags: ["cart", "multiple items", "checkout"],
        },
        {
          q: "How many categories and items can I add?",
          a: "There is no limit on the number of categories or items in Webjoz. You can add as many as needed. All catalog/menu layout variants (Grid, Classic, Dense, Tabs) are optimized to display many items with good performance.",
          tags: ["limit", "many", "capacity"],
        },
        {
          q: "How many Catalog/Menu display variants are there?",
          a: "There are 10+ layout variants to choose from: Cards (large grid), Classic (grid with category dividers), Grid Dense (compact grid for many items), Tabs by Category (category tabs), Compact List (horizontal rows), Text List (text-style like fine dining menus), Split Hero, Showcase Featured, Masonry, and more. Switch layouts from the website editor.",
          tags: ["display", "variant", "template", "layout"],
        },
      ],
    },
    {
      id: "troubleshooting",
      title: "Troubleshooting",
      icon: "🔧",
      items: [
        {
          q: "My website doesn't appear on Google, why?",
          a: "It takes 1-7 days for Google to index new websites. Make sure: (1) The website is published, (2) Custom domain is connected (if using one), (3) Submit sitemap in Google Search Console.",
        },
        {
          q: "The contact form is not sending emails, what should I do?",
          a: "Leads from the contact form are stored in the dashboard (Website → Leads), not sent via email. You can monitor leads directly in the dashboard or enable WhatsApp notifications.",
        },
        {
          q: "My website is slow, how do I fix it?",
          a: "Webjoz websites are hosted on our global infrastructure. If it's slow: (1) Images are too large — use compression, (2) Browser cache — try hard refresh, (3) CDN propagation — wait a few hours.",
        },
        {
          q: "I forgot my password, what should I do?",
          a: 'Click "Forgot Password" on the login page, enter your registered email, and follow the password reset instructions sent to your email.',
        },
      ],
    },
  ],
};

const TEXT = {
  id: {
    back: "← Kembali ke Beranda",
    badge: "Pusat Bantuan",
    title: "Ada yang bisa kami bantu?",
    subtitle: "Cari jawaban atas pertanyaan umum atau jelajahi kategori di bawah.",
    searchPlaceholder: "Cari pertanyaan... (contoh: custom domain, pembayaran, SEO)",
    clear: "Hapus",
    allCategories: "Semua",
    noResults: (q: string) => `Tidak ada hasil untuk "${q}"`,
    noResultsSub: "Coba kata kunci lain atau hubungi kami langsung.",
    ctaTitle: "Masih belum ketemu jawabannya?",
    ctaDesc: "Hubungi CS Webjoz langsung via WhatsApp — kami siap membantu!",
    ctaHours: "📞 +62 851-1122-1044 · Senin–Sabtu 08.00–21.00 WIB",
    ctaWa: "Chat via WhatsApp",
    ctaEmail: "Kirim Email",
    waMsg: "Halo CS Webjoz, saya butuh bantuan",
  },
  en: {
    back: "← Back to Home",
    badge: "Help Center",
    title: "How can we help you?",
    subtitle: "Search for answers to common questions or browse the categories below.",
    searchPlaceholder: "Search questions... (e.g. custom domain, payment, SEO)",
    clear: "Clear",
    allCategories: "All",
    noResults: (q: string) => `No results for "${q}"`,
    noResultsSub: "Try a different keyword or contact us directly.",
    ctaTitle: "Still can't find an answer?",
    ctaDesc: "Contact Webjoz CS directly via WhatsApp — we're ready to help!",
    ctaHours: "📞 +62 851-1122-1044 · Mon–Sat 08.00–21.00 WIB",
    ctaWa: "Chat on WhatsApp",
    ctaEmail: "Send Email",
    waMsg: "Hi Webjoz CS, I need some help",
  },
};

export default function HelpCenterPage() {
  const { locale } = useI18n();
  const lang = (locale === "en" ? "en" : "id") as "id" | "en";
  const text = TEXT[lang];
  const faqData = FAQ_DATA[lang];

  const [query, setQuery] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filteredCategories = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q && !activeCategory) return faqData;
    return faqData.filter((cat) => {
      if (activeCategory && cat.id !== activeCategory) return false;
      if (!q) return true;
      return cat.items.some(
        (item) =>
          item.q.toLowerCase().includes(q) ||
          item.a.toLowerCase().includes(q) ||
          item.tags?.some((t) => t.toLowerCase().includes(q)),
      );
    });
  }, [query, activeCategory, faqData]);

  const totalResults = filteredCategories.reduce((acc, cat) => acc + cat.items.length, 0);

  return (
    <main className="min-h-screen bg-background text-foreground">
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
          <h1 className="text-3xl font-bold mb-2">{text.title}</h1>
          <p className="text-sm text-muted-foreground max-w-lg mx-auto">{text.subtitle}</p>
        </div>

        {/* Search */}
        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4.5 text-muted-foreground" />
          <input
            type="text"
            placeholder={text.searchPlaceholder}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActiveCategory(null);
            }}
            className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-border/60 bg-card/40 text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40 transition"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground"
            >
              {text.clear}
            </button>
          )}
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setActiveCategory(null)}
            className={cn(
              "px-3 py-1.5 rounded-full text-xs font-semibold transition-all",
              !activeCategory
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-muted text-muted-foreground hover:text-foreground",
            )}
          >
            {text.allCategories}
          </button>
          {faqData.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(activeCategory === cat.id ? null : cat.id)}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-semibold transition-all",
                activeCategory === cat.id
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-muted text-muted-foreground hover:text-foreground",
              )}
            >
              {cat.icon} {cat.title}
            </button>
          ))}
        </div>

        {/* Result count */}
        {query && (
          <p className="text-xs text-muted-foreground mb-4">
            {totalResults} {lang === "id" ? "hasil ditemukan" : "results found"}
          </p>
        )}

        {/* FAQ Items */}
        <div className="space-y-6">
          {filteredCategories.map((cat) => (
            <div key={cat.id}>
              <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <span>{cat.icon}</span> {cat.title}
              </h2>
              <div className="space-y-2">
                {cat.items.map((item, idx) => {
                  const id = `${cat.id}-${idx}`;
                  const isOpen = openId === id;
                  return (
                    <div
                      key={id}
                      className={cn(
                        "rounded-2xl border transition-all overflow-hidden",
                        isOpen ? "border-primary/30 bg-primary/5" : "border-border/60 bg-card/40 hover:border-border",
                      )}
                    >
                      <button
                        onClick={() => setOpenId(isOpen ? null : id)}
                        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left text-sm font-semibold cursor-pointer"
                      >
                        <span>{item.q}</span>
                        <span className={cn("shrink-0 text-muted-foreground transition-transform duration-200", isOpen && "rotate-180")}>
                          ▾
                        </span>
                      </button>
                      {isOpen && (
                        <div className="px-5 pb-4 text-sm text-muted-foreground leading-relaxed">
                          {item.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {filteredCategories.length === 0 && (
            <div className="text-center py-16">
              <Search className="size-10 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">{text.noResults(query)}</p>
              <p className="text-xs text-muted-foreground/60 mt-1">{text.noResultsSub}</p>
            </div>
          )}
        </div>

        {/* Contact CTA */}
        <div className="mt-12 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping" />
              <div className="relative flex items-center justify-center size-14 rounded-full bg-emerald-500/20 border border-emerald-500/30">
                <svg className="size-7 fill-emerald-400" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                </svg>
              </div>
            </div>
          </div>
          <h3 className="text-lg font-bold mb-1">{text.ctaTitle}</h3>
          <p className="text-sm text-muted-foreground mb-1">{text.ctaDesc}</p>
          <p className="text-xs text-emerald-400 font-semibold mb-5">{text.ctaHours}</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href={getWhatsAppUrl(text.waMsg)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-bold transition-all shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-[1.02] active:scale-[0.98]"
            >
              <svg className="size-4 fill-current" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
              </svg>
              {text.ctaWa}
              <ExternalLink className="size-3.5 opacity-70" />
            </a>
            <a
              href={`mailto:${SUPPORT_EMAIL}`}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl border border-border/60 bg-card/60 text-sm font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
            >
              <Mail className="size-4" />
              {text.ctaEmail}
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
