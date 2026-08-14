export interface BlogSection {
  heading: string;
  body: string[];
}

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  keywords: string[];
  category: string;
  date: string;
  readingTime: string;
  sections: BlogSection[];
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "cara-membuat-website-bisnis-gratis-untuk-umkm",
    title: "Cara Membuat Website Bisnis Gratis untuk UMKM dalam 5 Menit",
    description:
      "Panduan lengkap cara membuat website bisnis gratis untuk UMKM Indonesia. Tanpa coding, tanpa biaya mahal — hanya dengan AI dalam 5 menit.",
    keywords: ["cara membuat website gratis", "website umkm", "buat website tanpa coding", "website bisnis gratis", "umkm indonesia"],
    category: "Panduan",
    date: "2026-08-10",
    readingTime: "5 menit",
    sections: [
      {
        heading: "Kenapa UMKM harus punya website?",
        body: [
          "Di tahun 2026, calon pelanggan Anda mencari produk atau jasa lewat Google sebelum memutuskan membeli. Jika bisnis Anda tidak muncul di pencarian, Anda kehilangan peluang penjualan yang bisa saja sudah direbut kompetitor. Website adalah etalase 24 jam yang bekerja meski Anda sedang tidur.",
          "Medsos memang penting, tetapi website memberi Anda kredibilitas dan kontrol penuh: alamat email sendiri, halaman lengkap tentang produk, katalog harga, testimoni pelanggan, hingga nomor WhatsApp yang mudah dijangkau.",
        ],
      },
      {
        heading: "Berapa biaya membuat website bisnis?",
        body: [
          "Membuat website lewat jasa pembuatan bisa menghabiskan 3–15 juta rupiah untuk website sederhana, belum termasuk biaya perawatan. Untuk UMKM yang baru mulai, biaya itu bisa menjadi penghalang besar.",
          "Kabar baiknya, teknologi AI kini memungkinkan website profesional dibuat tanpa coding dan tanpa biaya pembuatan. Anda cukup mengisi nama bisnis, memilih gaya tampilan, dan AI menyusun konten, struktur, hingga desain secara otomatis.",
        ],
      },
      {
        heading: "Langkah membuat website gratis dalam 5 menit",
        body: [
          "Pertama, buka Webjoz dan pilih opsi buat website baru. Anda tidak perlu memasukkan kartu kredit untuk memulai.",
          "Kedua, isi profil singkat bisnis Anda: nama bisnis, jenis usaha, dan lokasi. Semakin jelas Anda menjelaskan bisnis, semakin baik konten yang dihasilkan AI.",
          "Ketiga, pilih gaya visual yang sesuai dengan karakter bisnis — misalnya hangat dan earthy untuk kafe, profesional untuk konsultan, atau bold untuk bengkel. Webjoz akan menyesuaikan warna, tipografi, dan tata letak.",
          "Terakhir, publikasikan. Website Anda langsung aktif di subdomain Webjoz dan bisa dihubungkan ke domain sendiri kapan saja.",
        ],
      },
      {
        heading: "Apa saja yang harus ada di website UMKM?",
        body: [
          "Setidaknya lima elemen ini wajib ada: nama bisnis dan logo, deskripsi singkat yang menjelaskan keunggulan, daftar produk atau layanan dengan harga, testimoni atau bukti sosial, serta kontak yang mudah diakses seperti WhatsApp.",
          "Dengan Webjoz, semua bagian ini dibuat otomatis oleh AI berdasarkan profil bisnis Anda, lalu bisa Anda edit ulang kapan saja tanpa perlu ahli teknologi.",
        ],
      },
      {
        heading: "Mulai sekarang, gratis",
        body: [
          "Jangan tunggu sampai bisnis Anda besar untuk punya website. Buat sekarang, publikasikan hari ini, dan biarkan AI bekerja untuk Anda. Setiap hari tanpa website adalah peluang penjualan yang hilang.",
        ],
      },
    ],
  },
  {
    slug: "template-website-kafe-atau-restoran",
    title: "5 Hal Penting dalam Template Website Kafe dan Restoran",
    description:
      "Website kafe atau restoran yang efektif harus menampilkan menu, jam buka, lokasi, dan foto yang menggugah selera. Ini panduannya untuk usaha kuliner Anda.",
    keywords: ["template website kafe", "website restoran", "website kafe", "website kuliner", "template website restoran"],
    category: "Kuliner",
    date: "2026-08-03",
    readingTime: "4 menit",
    sections: [
      {
        heading: "Website adalah menu digital Anda",
        body: [
          "Pelanggan kafe atau restoran biasanya memutuskan berkunjung setelah melihat foto makanan, menu, dan suasana tempat. Website yang menampilkan hal ini dengan jelas akan mengubah pengunjung menjadi pelanggan.",
          "Template kuliner yang baik tidak perlu rumit — justru fokus pada satu hal: membangun selera dan rasa percaya.",
        ],
      },
      {
        heading: "1. Menu dan harga yang mudah ditemukan",
        body: [
          "Letakkan menu di bagian yang terlihat tanpa perlu banyak klik. Pelanggan yang tidak menemukan harga biasanya langsung meninggalkan website.",
        ],
      },
      {
        heading: "2. Jam buka dan alamat",
        body: [
          "Tampilkan jam operasional dan alamat dengan jelas, termasuk status buka atau tutup. Jika memungkinkan, tautkan langsung ke Google Maps agar pelanggan bisa navigasi.",
        ],
      },
      {
        heading: "3. Foto makanan berkualitas",
        body: [
          "Foto adalah cara tercepat membangun keinginan mencoba. Gunakan foto asli yang terang dan menggugah selera, bukan stok foto generik.",
        ],
      },
      {
        heading: "4. Testimoni pelanggan",
        body: [
          "Ulasan pelanggan adalah bukti sosial paling kuat untuk usaha kuliner. Tampilkan beberapa testimoni singkat beserta nama atau foto pelanggan.",
        ],
      },
      {
        heading: "5. Tombol pesan dan reservasi",
        body: [
          "Sediakan tombol WhatsApp yang mudah dilihat untuk pemesanan atau reservasi meja. Semakin sedikit langkah, semakin besar peluang konversi.",
        ],
      },
      {
        heading: "Buat website kafe Anda sekarang",
        body: [
          "Webjoz menyediakan template kuliner yang menampilkan menu, galeri, testimoni, dan kontak sekaligus. Isi profil bisnis Anda dan AI menyusun sisanya — gratis untuk memulai.",
        ],
      },
    ],
  },
  {
    slug: "website-atau-medsos-mana-yang-lebih-penting",
    title: "Website atau Medsos? Kenapa Bisnis Anda Butuh Keduanya",
    description:
      "Banyak UMKM hanya mengandalkan Instagram atau Facebook. Inilah alasan kenapa website tetap penting dan bagaimana keduanya saling melengkapi.",
    keywords: ["website vs medsos", "bisnis online umkm", "website instagram", "pemasaran digital umkm", "website bisnis"],
    category: "Strategi",
    date: "2026-07-27",
    readingTime: "5 menit",
    sections: [
      {
        heading: "Medsos itu menyewa, website itu memiliki",
        body: [
          "Instagram, Facebook, dan TikTok adalah platform sewaan: aturan, algoritma, dan jangkauannya bisa berubah kapan saja. Suatu hari postingan Anda tampil, hari berikutnya jangkauan turun drastis.",
          "Website adalah aset yang Anda miliki sepenuhnya. Konten di dalamnya selalu bisa diakses, tidak dibatasi algoritma, dan bisa dioptimalkan agar muncul di Google.",
        ],
      },
      {
        heading: "Pelanggan mencari di Google, bukan hanya di medsos",
        body: [
          "Ketika seseorang butuh jasa tukang las, catering, atau klinik gigi, mereka membuka Google dan mengetik kata kunci. Website bisnis Anda yang muncul di hasil pencarian itulah yang menang.",
          "Medsos tidak bisa diandalkan untuk dicari orang yang belum mengikuti Anda. Website bisa.",
        ],
      },
      {
        heading: "Cara keduanya saling melengkapi",
        body: [
          "Gunakan medsos untuk membangun kedekatan dan jangkauan harian, lalu arahkan semua trafik ke website sebagai pusat informasi lengkap. Bio Instagram bisa berisi tautan website, begitu juga iklan berbayar.",
          "Dengan begitu, konten medsos yang viral tetap mengarahkan pelanggan ke satu tempat yang bisa Anda kendalikan: website Anda.",
        ],
      },
      {
        heading: "Mulai dengan website yang terjangkau",
        body: [
          "Anda tidak perlu website mahal untuk mulai. Buat website profesional dengan AI dalam 5 menit, pasang di medsos Anda, dan mulai kembangkan dari sana.",
        ],
      },
    ],
  },
  {
    slug: "cara-membuat-toko-online-gratis",
    title: "Cara Membuat Toko Online Gratis tanpa Coding untuk Pemula",
    description:
      "Panduan langkah demi langkah membuat toko online gratis: tampilkan produk, kategori, harga, dan cara pemesanan tanpa perlu jasa programmer.",
    keywords: ["cara membuat toko online", "toko online gratis", "website toko online", "jualan online pemula", "cara jualan online"],
    category: "Jualan Online",
    date: "2026-07-20",
    readingTime: "6 menit",
    sections: [
      {
        heading: "Toko online tidak harus ribet",
        body: [
          "Banyak pemula mengira membuat toko online harus menggunakan platform kompleks atau jasa developer. Padahal, untuk memulai, cukup website sederhana yang menampilkan produk dengan rapi dan cara pemesanan yang jelas.",
        ],
      },
      {
        heading: "Langkah 1: Pilih produk dan struktur kategori",
        body: [
          "Tentukan produk utama Anda dan bagi ke dalam beberapa kategori agar pelanggan mudah mencari. Contoh: untuk toko pakaian, kategorinya bisa atasan, bawahan, dan aksesori.",
        ],
      },
      {
        heading: "Langkah 2: Siapkan deskripsi dan harga",
        body: [
          "Tulis deskripsi singkat yang menjelaskan manfaat produk, bukan hanya spesifikasi. Sertakan harga yang jelas. Jujur dan transparan membangun kepercayaan.",
        ],
      },
      {
        heading: "Langkah 3: Bangun website dengan AI",
        body: [
          "Gunakan Webjoz untuk membuat website toko online. Pilih template produk, masukkan nama toko dan kategori, lalu AI akan menyusun halaman katalog, testimoni, dan kontak secara otomatis.",
        ],
      },
      {
        heading: "Langkah 4: Tentukan cara pemesanan",
        body: [
          "Untuk pemula, pemesanan lewat WhatsApp adalah pilihan paling praktis. Pelanggan memilih produk di website, lalu konfirmasi lewat tombol WhatsApp yang sudah tersedia.",
        ],
      },
      {
        heading: "Mulai jualan hari ini",
        body: [
          "Jangan menunggu sempurna. Publikasikan toko online Anda hari ini, perbarui produk secara berkala, dan tingkatkan kualitas seiring waktu.",
        ],
      },
    ],
  },
  {
    slug: "pentingnya-website-untuk-bisnis-jasa",
    title: "Kenapa Website Penting untuk Bisnis Jasa Profesional",
    description:
      "Konsultan, agensi, tukang, dan penyedia jasa lain sering kehilangan klien karena tidak punya website. Ini alasan dan cara membuat portofolio online.",
    keywords: ["website bisnis jasa", "website konsultan", "portofolio online", "website profesional", "website jasa service"],
    category: "Bisnis Jasa",
    date: "2026-07-13",
    readingTime: "4 menit",
    sections: [
      {
        heading: "Klien menilai Anda dari kredibilitas online",
        body: [
          "Untuk bisnis jasa, kepercayaan adalah segalanya. Sebelum menghubungi Anda, calon klien hampir selalu mencari nama atau perusahaan Anda di Google. Jika yang muncul kosong atau tidak profesional, Anda bisa kehilangan klien bahkan sebelum bertemu.",
        ],
      },
      {
        heading: "Portofolio yang menjual",
        body: [
          "Website jasa yang efektif menampilkan: layanan apa yang Anda tawarkan, portofolio atau studi kasus, testimoni klien, dan cara menghubungi Anda. Semua ini membangun kepercayaan yang sulit dicapai lewat medsos.",
        ],
      },
      {
        heading: "Tampil lebih dulu di pencarian lokal",
        body: [
          "Saat orang mencari \u201cjasa arsitek dekat saya\u201d atau \u201ckonsultan pajak jakarta\u201d, website yang teroptimasi berpeluang besar tampil. Setiap pencarian itu adalah calon klien yang siap membayar.",
        ],
      },
      {
        heading: "Buat website jasa Anda dalam 5 menit",
        body: [
          "Dengan Webjoz, Anda cukup memilih template profesional, mengisi profil bisnis, dan AI menyusun layanan, keunggulan, serta kontak secara otomatis. Publikasikan hari ini dan mulailah memenangkan klien baru.",
        ],
      },
    ],
  },
  {
    slug: "tips-website-cepat-terindex-google",
    title: "5 Langkah agar Website Bisnis Cepat Terindeks di Google",
    description:
      "Baru membuat website dan tidak muncul di Google? Ini langkah praktis agar halaman Anda cepat terindeks dan mulai mendatangkan pengunjung.",
    keywords: ["website terindeks google", "seo pemula", "website muncul di google", "tips seo", "seo website umkm"],
    category: "SEO",
    date: "2026-07-06",
    readingTime: "5 menit",
    sections: [
      {
        heading: "Google perlu tahu website Anda ada",
        body: [
          "Website yang baru dibuat tidak otomatis muncul di Google. Mesin pencari perlu menemukan, merayapi, lalu mengindeks halaman Anda. Proses ini bisa dipercepat dengan beberapa langkah sederhana.",
        ],
      },
      {
        heading: "1. Daftarkan di Google Search Console",
        body: [
          "Search Console adalah alat gratis dari Google untuk memantau performa website. Daftarkan situs Anda, lalu kirimkan sitemap. Webjoz sudah menyediakan sitemap otomatis untuk setiap website.",
        ],
      },
      {
        heading: "2. Pastikan judul dan deskripsi jelas",
        body: [
          "Setiap halaman wajib memiliki judul (title) dan deskripsi (meta description) yang menjelaskan isi halaman. Webjoz membuat ini otomatis berdasarkan konten bisnis Anda.",
        ],
      },
      {
        heading: "3. Buat konten yang menjawab pertanyaan",
        body: [
          "Google menyukai konten yang bermanfaat. Tulis deskripsi layanan yang jelas, jawab pertanyaan umum pelanggan, dan tambahkan blog jika memungkinkan.",
        ],
      },
      {
        heading: "4. Minta Google merayapi halaman",
        body: [
          "Gunakan fitur \u201cURL Inspection\u201d di Search Console untuk meminta Google merayapi halaman utama website Anda secara manual. Biasanya terindeks dalam beberapa hari.",
        ],
      },
      {
        heading: "5. Bersabar dan konsisten",
        body: [
          "SEO adalah investasi jangka panjang. Website yang bagus, konten yang konsisten, dan tautan yang masuk akan membuahkan hasil dalam beberapa bulan. Mulai sekarang, lebih cepat lebih baik.",
        ],
      },
    ],
  },
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((post) => post.slug === slug);
}
