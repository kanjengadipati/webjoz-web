import type { Metadata } from "next";
import Link from "next/link";
import { siteUrl } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Privacy Policy | Webjoz",
  description: "Kebijakan Privasi Webjoz — bagaimana kami mengumpulkan, menggunakan, dan melindungi data pengguna platform AI website builder.",
  keywords: ["privacy policy webjoz", "kebijakan privasi", "perlindungan data"],
  alternates: {
    canonical: siteUrl("/privacy-policy"),
    languages: {
      id: siteUrl("/privacy-policy"),
      en: siteUrl("/en/privacy-policy"),
    },
  },
  openGraph: {
    title: "Privacy Policy | Webjoz",
    description: "Kebijakan Privasi Webjoz — bagaimana kami mengumpulkan, menggunakan, dan melindungi data pengguna.",
    url: siteUrl("/privacy-policy"),
    siteName: "Webjoz",
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Privacy Policy | Webjoz",
    description: "Kebijakan Privasi Webjoz — perlindungan data pengguna.",
  },
};

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <div className="mb-8 flex items-center justify-between gap-4">
          <Link href="/" className="text-xs text-muted-foreground hover:text-foreground transition inline-block">← Kembali ke Beranda</Link>
          <Link href="/en/privacy-policy" className="text-xs text-primary hover:underline inline-block">Read in English →</Link>
        </div>

        <h1 className="text-3xl font-bold mb-2">Kebijakan Privasi</h1>
        <p className="text-sm text-muted-foreground mb-10">Terakhir diperbarui: 16 Agustus 2026 · Berlaku untuk layanan Webjoz</p>

        <div className="prose prose-invert max-w-none space-y-8 text-sm leading-relaxed text-foreground/80">

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">1. Pengantar</h2>
            <p>
              Giwangan Studio (&quot;kami&quot;, &quot;kita&quot;) mengoperasikan platform Webjoz yang dapat diakses melalui <strong>webjoz.com</strong>. Kebijakan Privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan, menyimpan, dan melindungi informasi pribadi Anda ketika menggunakan layanan kami.
            </p>
            <p className="mt-2">
              Kami bertindak sebagai <strong>pengendali data pribadi</strong> dan memproses data pribadi Anda sesuai dengan <strong>Undang-Undang Nomor 27 Tahun 2022 tentang Pelindungan Data Pribadi</strong> (&quot;UU PDP&quot;) beserta peraturan pelaksanaannya.
            </p>
            <p className="mt-2">
              Dengan menggunakan Webjoz, Anda menyetujui praktik yang dijelaskan dalam kebijakan ini.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">2. Data yang Kami Kumpulkan</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Data Akun:</strong> Nama, nomor WhatsApp, dan/atau alamat email yang Anda daftarkan.</li>
              <li><strong>Data Bisnis:</strong> Informasi bisnis yang Anda masukkan untuk menghasilkan website (nama bisnis, deskripsi, kontak, dll).</li>
              <li><strong>Data Pembayaran:</strong> Informasi transaksi diproses melalui Midtrans. Kami tidak menyimpan data kartu kredit/debit Anda secara langsung.</li>
              <li><strong>Data Penggunaan:</strong> Log aktivitas, IP address, jenis perangkat, dan browser untuk keperluan keamanan dan analitik.</li>
              <li><strong>Cookie:</strong> Cookie sesi untuk autentikasi dan preferensi pengguna.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">3. Penggunaan Data</h2>
            <p>Data Anda kami gunakan untuk:</p>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li>Menyediakan dan meningkatkan layanan Webjoz.</li>
              <li>Memproses pembayaran langganan.</li>
              <li>Mengirimkan notifikasi penting terkait akun dan layanan.</li>
              <li>Menganalisis penggunaan platform untuk peningkatan produk.</li>
              <li>Mematuhi kewajiban hukum yang berlaku.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">4. Dasar Hukum Pemrosesan</h2>
            <p>Pemrosesan data pribadi Anda dilakukan atas dasar hukum sebagai berikut:</p>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li><strong>Pelaksanaan perjanjian</strong> — untuk menyediakan layanan yang Anda kontrak (UU PDP Pasal 20).</li>
              <li><strong>Persetujuan Anda</strong> — misalnya untuk notifikasi pemasaran yang dikirim secara terpisah (UU PDP Pasal 20).</li>
              <li><strong>Pemenuhan kewajiban hukum</strong> — misalnya catatan transaksi dan perpajakan (UU PDP Pasal 21).</li>
            </ul>
            <p className="mt-2">Kami tidak memproses data pribadi yang bersifat spesifik (seperti data kesehatan atau biometrik) tanpa persetujuan eksplisit Anda, kecuali diwajibkan hukum.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">5. Berbagi Data</h2>
            <p>Kami <strong>tidak menjual</strong> data pribadi Anda kepada pihak ketiga. Data dapat dibagikan kepada:</p>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li><strong>Midtrans</strong> — untuk pemrosesan pembayaran.</li>
              <li><strong>Google</strong> — untuk autentikasi Google OAuth.</li>
              <li><strong>Cloudinary</strong> — untuk penyimpanan gambar yang Anda unggah.</li>
              <li>Otoritas hukum jika diwajibkan oleh peraturan perundang-undangan.</li>
            </ul>
            <p className="mt-2">
              Pihak-pihak di atas bertindak sebagai <strong>pemroses data (subprosesor)</strong> yang terikat kontrak dan kewajiban kerahasiaan. Apabila data pribadi Anda ditransfer ke luar wilayah Indonesia, kami memastikan tersedia jaminan perlindungan data yang setara sesuai ketentuan UU PDP (Pasal 56–57).
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">6. Keamanan Data</h2>
            <p>
              Kami menerapkan langkah-langkah keamanan teknis dan organisasi yang wajar, termasuk enkripsi HTTPS, token JWT berumur pendek, dan pembatasan akses ke database. Namun, tidak ada sistem yang 100% aman.
            </p>
            <p className="mt-2">
              Apabila terjadi pelanggaran pelindungan data pribadi yang berpotensi merugikan Anda, kami akan memberitahukannya kepada Anda dan otoritas terkait <strong>paling lambat 3×24 jam</strong> sejak kami mengetahui pelanggaran tersebut (UU PDP Pasal 46).
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">7. Hak Anda</h2>
            <p>Sesuai UU PDP, Anda berhak untuk:</p>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li>Mengakses dan mengunduh data pribadi Anda.</li>
              <li>Meminta perbaikan data yang tidak akurat.</li>
              <li>Meminta <strong>pembatasan pemrosesan</strong> data pribadi Anda.</li>
              <li>Meminta <strong>penghapusan</strong> data pribadi Anda.</li>
              <li>Meminta <strong>portabilitas</strong> (menerima atau memindahkan data dalam format yang dapat dibaca).</li>
              <li>Mengajukan <strong>keberatan</strong> atas pemrosesan data.</li>
              <li>Menarik persetujuan penggunaan data (dapat mengakibatkan penutupan akun).</li>
              <li>Mengajukan gugatan atau pengaduan atas pelanggaran pelindungan data pribadi.</li>
            </ul>
            <p className="mt-2">
              Untuk mengajukan permintaan tersebut, hubungi kami di <strong>giwanganstudio@gmail.com</strong>. Kami menanggapi setiap permintaan <strong>paling lambat 30 (tiga puluh) hari</strong> sejak permintaan diterima.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">8. Retensi Data</h2>
            <p>
              Kami menyimpan data akun Anda selama akun aktif. Setelah penghapusan akun, data akan dihapus dalam 30 hari kerja, kecuali jika retensi lebih lama diwajibkan oleh hukum. Catatan transaksi keuangan dan pembukuan disimpan sesuai ketentuan perpajakan yang berlaku (umumnya 10 tahun).
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">9. Cookie</h2>
            <p>
              Webjoz menggunakan cookie esensial untuk autentikasi sesi. Kami tidak menggunakan cookie pelacakan pihak ketiga untuk keperluan iklan. Anda dapat menonaktifkan cookie melalui pengaturan browser, namun beberapa fitur layanan mungkin tidak berfungsi dengan baik.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">10. Data Anak</h2>
            <p>
              Layanan Webjoz ditujukan untuk pengguna berusia minimal 18 tahun. Kami tidak dengan sengaja mengumpulkan data pribadi anak di bawah 18 tahun tanpa persetujuan orang tua atau wali. Apabila Anda mengetahui kami mengumpulkan data anak tanpa persetujuan tersebut, harap hubungi kami agar data dapat segera dihapus.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">11. Perubahan Kebijakan</h2>
            <p>
              Kami dapat memperbarui kebijakan ini sewaktu-waktu. Perubahan signifikan akan kami beritahukan melalui email atau notifikasi di platform. Tanggal pembaruan akan dicantumkan di bagian atas halaman ini.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">12. Kontak</h2>
            <p>Jika Anda memiliki pertanyaan, permintaan hak atas data pribadi, atau pengaduan terkait kebijakan privasi ini, silakan hubungi:</p>
            <address className="not-italic mt-2 space-y-1">
              <p><strong>Giwangan Studio</strong></p>
              <p>Jl. Malang Wijoyo, Malangan, Giwangan, Umbulharjo, Yogyakarta</p>
              <p>Email: <a href="mailto:giwanganstudio@gmail.com" className="text-primary hover:underline">giwanganstudio@gmail.com</a></p>
            </address>
          </section>

        </div>
      </div>
    </main>
  );
}
