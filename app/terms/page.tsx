import type { Metadata } from "next";
import Link from "next/link";
import { siteUrl } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Syarat & Ketentuan | Webjoz",
  description: "Syarat dan Ketentuan penggunaan layanan Webjoz — platform AI website builder untuk bisnis Indonesia.",
  keywords: ["syarat ketentuan webjoz", "terms of service", "aturan penggunaan webjoz"],
  alternates: {
    canonical: siteUrl("/terms"),
    languages: {
      id: siteUrl("/terms"),
      en: siteUrl("/en/terms"),
    },
  },
  openGraph: {
    title: "Syarat & Ketentuan | Webjoz",
    description: "Syarat dan Ketentuan penggunaan layanan Webjoz — platform AI website builder untuk bisnis Indonesia.",
    url: siteUrl("/terms"),
    siteName: "Webjoz",
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Syarat & Ketentuan | Webjoz",
    description: "Syarat dan Ketentuan penggunaan layanan Webjoz.",
  },
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <div className="mb-8 flex items-center justify-between gap-4">
          <Link href="/" className="text-xs text-muted-foreground hover:text-foreground transition inline-block">← Kembali ke Beranda</Link>
          <Link href="/en/terms" className="text-xs text-primary hover:underline inline-block">Read in English →</Link>
        </div>

        <h1 className="text-3xl font-bold mb-2">Syarat &amp; Ketentuan</h1>
        <p className="text-sm text-muted-foreground mb-10">Terakhir diperbarui: 16 Agustus 2026 · Berlaku untuk layanan Webjoz</p>

        <div className="prose prose-invert max-w-none space-y-8 text-sm leading-relaxed text-foreground/80">

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">1. Penerimaan Syarat</h2>
            <p>
              Dengan mendaftar dan menggunakan Webjoz, Anda menyetujui Syarat & Ketentuan ini secara penuh. Jika Anda tidak menyetujui ketentuan ini, harap hentikan penggunaan layanan. Layanan Webjoz dioperasikan oleh <strong>Giwangan Studio</strong>.
            </p>
            <p className="mt-2">
              <strong>Kebijakan Privasi</strong> dan <strong>Kebijakan Pengembalian Dana</strong> beserta dokumen lain yang diumumkan di webjoz.com merupakan bagian yang tidak terpisahkan dari Syarat & Ketentuan ini.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">2. Deskripsi Layanan</h2>
            <p>
              Webjoz adalah platform Software as a Service (SaaS) yang memungkinkan pengguna membuat, mengelola, dan mempublikasikan website bisnis menggunakan teknologi kecerdasan buatan (AI). Layanan meliputi:
            </p>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li>Pembuatan konten website otomatis berbasis AI.</li>
              <li>Hosting website di subdomain <strong>webjoz.com</strong>.</li>
              <li>Pengelolaan konten, SEO, leads, dan analitik melalui dashboard.</li>
              <li>Fitur tambahan premium sesuai paket langganan.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">3. Akun Pengguna</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Anda bertanggung jawab menjaga kerahasiaan kredensial akun Anda.</li>
              <li>Setiap aktivitas yang terjadi di bawah akun Anda menjadi tanggung jawab Anda.</li>
              <li>Anda wajib segera memberitahu kami jika mendeteksi akses tidak sah ke akun Anda.</li>
              <li>Akun hanya boleh digunakan oleh satu individu atau entitas bisnis.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">4. Paket & Pembayaran</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Webjoz menawarkan paket gratis dengan fitur terbatas dan paket berbayar (Pro/Enterprise) dengan fitur lebih lengkap.</li>
              <li>Pembayaran diproses melalui <strong>Midtrans</strong> dan tunduk pada ketentuan pembayaran Midtrans.</li>
              <li>Harga paket dapat berubah sewaktu-waktu dengan pemberitahuan minimal 14 hari sebelumnya.</li>
              <li>Langganan bersifat berulang (recurring) kecuali Anda membatalkan sebelum tanggal pembaruan.</li>
              <li>Ketentuan pengembalian dana diatur dalam <strong>Kebijakan Pengembalian Dana</strong>.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">5. Penggunaan yang Dilarang</h2>
            <p>Anda dilarang menggunakan Webjoz untuk:</p>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li>Konten ilegal, penipuan, atau melanggar hukum yang berlaku di Indonesia.</li>
              <li><strong>Layanan pinjaman online (pinjol)</strong>, pemberian pinjaman, atau aktivitas keuangan yang tidak sesuai peraturan perundang-undangan.</li>
              <li><strong>Perjudian dalam bentuk apa pun</strong>, termasuk judi online dan taruhan.</li>
              <li>Penyebaran malware, phishing, atau aktivitas berbahaya lainnya.</li>
              <li>Pelanggaran hak kekayaan intelektual pihak ketiga.</li>
              <li>Spam atau pengiriman pesan massal yang tidak diminta.</li>
              <li>Aktivitas yang membebani infrastruktur platform secara berlebihan.</li>
            </ul>
            <p className="mt-2">Pelanggaran dapat mengakibatkan penangguhan atau penghapusan akun tanpa pengembalian dana.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">6. Konten & Tanggung Jawab Pengguna</h2>
            <p>
              Anda bertanggung jawab penuh atas keakuratan, legalitas, dan isi website yang Anda publikasikan melalui Webjoz. Anda menjamin bahwa seluruh konten yang dipublikasikan:
            </p>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li>Tidak melanggar hukum, termasuk larangan aktivitas pinjol, perjudian, atau penipuan.</li>
              <li>Tidak melanggar hak kekayaan intelektual atau hak pihak ketiga lainnya.</li>
              <li>Tidak mengandung informasi yang menyesatkan atau melanggar ketentuan peraturan perundang-undangan.</li>
            </ul>
            <p className="mt-2">
              Konten yang dihasilkan oleh AI bersifat otomatis dan dapat mengandung kekeliruan; Anda wajib memeriksa dan mengoreksi konten tersebut sebelum mempublikasikannya.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">7. Hak Kekayaan Intelektual</h2>
            <p>
              Konten yang dihasilkan oleh AI untuk website Anda menjadi milik Anda setelah di-publish. Kode, desain, merek, dan teknologi platform Webjoz adalah milik eksklusif Giwangan Studio dan dilindungi hak cipta. Anda tidak diizinkan menyalin, mendistribusikan, atau membuat karya turunan dari platform tanpa izin tertulis.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">8. Penolakan Jaminan</h2>
            <p>
              Webjoz disediakan &quot;sebagaimana adanya&quot; (<em>as-is</em>). Kami tidak menjamin bahwa layanan akan selalu tersedia tanpa gangguan atau bebas dari kesalahan. Namun, ketentuan ini tidak membatasi tanggung jawab yang secara memaksa diatur dalam peraturan perundang-undangan, termasuk Undang-Undang Perlindungan Konsumen.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">9. Batasan Tanggung Jawab</h2>
            <p>
              Sejauh diizinkan oleh hukum, tanggung jawab Giwangan Studio terbatas pada kerugian langsung yang nyata-nyata diderita akibat kelalaian kami. Ketentuan ini tidak berlaku apabila kami terbukti melakukan penipuan, kelalaian berat, atau melanggar ketentuan peraturan perundang-undangan yang bersifat memaksa.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">10. Keadaan Kahar</h2>
            <p>
              Kami tidak bertanggung jawab atas keterlambatan atau kegagalan pemenuhan layanan akibat peristiwa di luar kendali kami, termasuk bencana alam, gangguan infrastruktur atau jaringan pihak ketiga, pemadaman listrik, serta kebijakan atau regulasi pemerintah.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">11. Penghentian Layanan</h2>
            <p>
              Kami berhak menghentikan atau menangguhkan akun Anda jika melanggar ketentuan ini, tanpa pemberitahuan sebelumnya dalam kasus pelanggaran serius. Anda dapat menghapus akun kapan saja melalui dashboard.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">12. Perubahan Ketentuan</h2>
            <p>
              Kami dapat memperbarui Syarat & Ketentuan ini sewaktu-waktu. Perubahan signifikan akan diumumkan melalui email atau notifikasi di platform <strong>minimal 14 hari</strong> sebelum berlaku. Dengan tetap menggunakan layanan setelah pemberitahuan, Anda dianggap menyetujui perubahan tersebut. Anda berhak mengakhiri penggunaan layanan tanpa penalti jika tidak menyetujui perubahan.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">13. Hukum yang Berlaku</h2>
            <p>
              Syarat dan ketentuan ini tunduk pada hukum Republik Indonesia. Segala sengketa diselesaikan melalui musyawarah mufakat. Jika tidak tercapai kesepakatan, sengketa diselesaikan melalui pengadilan yang berwenang di Yogyakarta.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">14. Kontak</h2>
            <address className="not-italic space-y-1">
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
