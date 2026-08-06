import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | Webjoz",
  description: "Kebijakan Privasi Webjoz — bagaimana kami mengumpulkan, menggunakan, dan melindungi data pengguna platform AI website builder.",
  keywords: ["privacy policy webjoz", "kebijakan privasi", "perlindungan data"],
  alternates: {
    canonical: "https://webjoz.com/privacy-policy",
  },
  openGraph: {
    title: "Privacy Policy | Webjoz",
    description: "Kebijakan Privasi Webjoz — bagaimana kami mengumpulkan, menggunakan, dan melindungi data pengguna.",
    url: "https://webjoz.com/privacy-policy",
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
        <Link href="/" className="text-xs text-muted-foreground hover:text-foreground transition mb-8 inline-block">← Kembali ke Beranda</Link>

        <h1 className="text-3xl font-bold mb-2">Kebijakan Privasi</h1>
        <p className="text-sm text-muted-foreground mb-10">Terakhir diperbarui: Juli 2025 · Berlaku untuk layanan Webjoz</p>

        <div className="prose prose-invert max-w-none space-y-8 text-sm leading-relaxed text-foreground/80">

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">1. Pengantar</h2>
            <p>
              Giwangan Studio ("kami", "kita") mengoperasikan platform Webjoz yang dapat diakses melalui <strong>webjoz.com</strong>. Kebijakan Privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan, menyimpan, dan melindungi informasi pribadi Anda ketika menggunakan layanan kami.
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
            <h2 className="text-lg font-semibold text-foreground mb-3">4. Berbagi Data</h2>
            <p>Kami <strong>tidak menjual</strong> data pribadi Anda kepada pihak ketiga. Data dapat dibagikan kepada:</p>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li><strong>Midtrans</strong> — untuk pemrosesan pembayaran.</li>
              <li><strong>Google</strong> — untuk autentikasi Google OAuth.</li>
              <li><strong>Cloudinary</strong> — untuk penyimpanan gambar yang Anda unggah.</li>
              <li>Otoritas hukum jika diwajibkan oleh peraturan perundang-undangan.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">5. Keamanan Data</h2>
            <p>
              Kami menerapkan langkah-langkah keamanan teknis dan organisasi yang wajar, termasuk enkripsi HTTPS, token JWT berumur pendek, dan pembatasan akses ke database. Namun, tidak ada sistem yang 100% aman. Jika terjadi pelanggaran data yang berdampak signifikan, kami akan memberitahu Anda sesuai ketentuan yang berlaku.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">6. Hak Anda</h2>
            <p>Anda berhak untuk:</p>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li>Mengakses dan mengunduh data pribadi Anda.</li>
              <li>Meminta penghapusan akun dan data Anda.</li>
              <li>Memperbarui informasi akun kapan saja melalui dashboard.</li>
              <li>Menarik persetujuan penggunaan data (dapat mengakibatkan penutupan akun).</li>
            </ul>
            <p className="mt-2">Untuk mengajukan permintaan tersebut, hubungi kami di <strong>giwanganstudio@gmail.com</strong>.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">7. Retensi Data</h2>
            <p>
              Kami menyimpan data akun Anda selama akun aktif. Setelah penghapusan akun, data akan dihapus dalam 30 hari kerja, kecuali jika retensi lebih lama diwajibkan oleh hukum (misalnya catatan transaksi keuangan).
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">8. Cookie</h2>
            <p>
              Webjoz menggunakan cookie esensial untuk autentikasi sesi. Kami tidak menggunakan cookie pelacakan pihak ketiga untuk keperluan iklan. Anda dapat menonaktifkan cookie melalui pengaturan browser, namun beberapa fitur layanan mungkin tidak berfungsi dengan baik.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">9. Perubahan Kebijakan</h2>
            <p>
              Kami dapat memperbarui kebijakan ini sewaktu-waktu. Perubahan signifikan akan kami beritahukan melalui email atau notifikasi di platform. Tanggal pembaruan akan dicantumkan di bagian atas halaman ini.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">10. Kontak</h2>
            <p>Jika Anda memiliki pertanyaan tentang kebijakan privasi ini, silakan hubungi:</p>
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
