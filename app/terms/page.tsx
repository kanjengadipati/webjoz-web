import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Syarat & Ketentuan | Webjoz",
  description: "Syarat dan Ketentuan penggunaan layanan Webjoz — platform AI website builder untuk bisnis Indonesia.",
  keywords: ["syarat ketentuan webjoz", "terms of service", "aturan penggunaan webjoz"],
  alternates: {
    canonical: "https://www.webjoz.com/terms",
  },
  openGraph: {
    title: "Syarat & Ketentuan | Webjoz",
    description: "Syarat dan Ketentuan penggunaan layanan Webjoz — platform AI website builder untuk bisnis Indonesia.",
    url: "https://www.webjoz.com/terms",
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
        <Link href="/" className="text-xs text-muted-foreground hover:text-foreground transition mb-8 inline-block">← Kembali ke Beranda</Link>

        <h1 className="text-3xl font-bold mb-2">Syarat &amp; Ketentuan</h1>
        <p className="text-sm text-muted-foreground mb-10">Terakhir diperbarui: Juli 2025 · Berlaku untuk layanan Webjoz</p>

        <div className="prose prose-invert max-w-none space-y-8 text-sm leading-relaxed text-foreground/80">

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">1. Penerimaan Syarat</h2>
            <p>
              Dengan mendaftar dan menggunakan Webjoz, Anda menyetujui Syarat & Ketentuan ini secara penuh. Jika Anda tidak menyetujui ketentuan ini, harap hentikan penggunaan layanan. Layanan Webjoz dioperasikan oleh <strong>Giwangan Studio</strong>.
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
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">5. Penggunaan yang Dilarang</h2>
            <p>Anda dilarang menggunakan Webjoz untuk:</p>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li>Konten ilegal, penipuan, atau melanggar hukum yang berlaku di Indonesia.</li>
              <li>Penyebaran malware, phishing, atau aktivitas berbahaya lainnya.</li>
              <li>Pelanggaran hak kekayaan intelektual pihak ketiga.</li>
              <li>Spam atau pengiriman pesan massal yang tidak diminta.</li>
              <li>Aktivitas yang membebani infrastruktur platform secara berlebihan.</li>
            </ul>
            <p className="mt-2">Pelanggaran dapat mengakibatkan penangguhan atau penghapusan akun tanpa pengembalian dana.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">6. Hak Kekayaan Intelektual</h2>
            <p>
              Konten yang dihasilkan oleh AI untuk website Anda menjadi milik Anda setelah di-publish. Kode, desain, merek, dan teknologi platform Webjoz adalah milik eksklusif Giwangan Studio dan dilindungi hak cipta. Anda tidak diizinkan menyalin, mendistribusikan, atau membuat karya turunan dari platform tanpa izin tertulis.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">7. Penolakan Jaminan</h2>
            <p>
              Webjoz disediakan "sebagaimana adanya" (<em>as-is</em>). Kami tidak menjamin bahwa layanan akan selalu tersedia tanpa gangguan atau bebas dari kesalahan. Kami tidak bertanggung jawab atas kerugian bisnis yang timbul akibat gangguan layanan.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">8. Batasan Tanggung Jawab</h2>
            <p>
              Dalam kondisi apapun, tanggung jawab maksimal Giwangan Studio kepada Anda tidak akan melebihi jumlah yang Anda bayarkan kepada kami dalam 3 (tiga) bulan terakhir sebelum klaim.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">9. Penghentian Layanan</h2>
            <p>
              Kami berhak menghentikan atau menangguhkan akun Anda jika melanggar ketentuan ini, tanpa pemberitahuan sebelumnya dalam kasus pelanggaran serius. Anda dapat menghapus akun kapan saja melalui dashboard.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">10. Hukum yang Berlaku</h2>
            <p>
              Syarat dan ketentuan ini tunduk pada hukum Republik Indonesia. Segala sengketa diselesaikan melalui musyawarah mufakat. Jika tidak tercapai kesepakatan, sengketa diselesaikan melalui pengadilan yang berwenang di Yogyakarta.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">11. Kontak</h2>
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
