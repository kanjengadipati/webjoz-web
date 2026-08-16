import type { Metadata } from "next";
import Link from "next/link";
import { siteUrl } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Kebijakan Pengembalian Dana | Webjoz",
  description: "Kebijakan pembatalan dan pengembalian dana layanan Webjoz — garansi uang kembali 7 hari untuk paket berbayar.",
  keywords: ["refund webjoz", "kebijakan pengembalian dana", "pembatalan langganan webjoz"],
  alternates: {
    canonical: siteUrl("/refund-policy"),
    languages: {
      id: siteUrl("/refund-policy"),
      en: siteUrl("/en/refund-policy"),
    },
  },
  openGraph: {
    title: "Kebijakan Pengembalian Dana | Webjoz",
    description: "Kebijakan pembatalan dan pengembalian dana layanan Webjoz — garansi uang kembali 7 hari.",
    url: siteUrl("/refund-policy"),
    siteName: "Webjoz",
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Kebijakan Pengembalian Dana | Webjoz",
    description: "Kebijakan pengembalian dana dan pembatalan langganan Webjoz.",
  },
};

export default function RefundPolicyPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <div className="mb-8 flex items-center justify-between gap-4">
          <Link href="/" className="text-xs text-muted-foreground hover:text-foreground transition inline-block">← Kembali ke Beranda</Link>
          <Link href="/en/refund-policy" className="text-xs text-primary hover:underline inline-block">Read in English →</Link>
        </div>

        <h1 className="text-3xl font-bold mb-2">Kebijakan Pengembalian Dana</h1>
        <p className="text-sm text-muted-foreground mb-10">Terakhir diperbarui: Juli 2025 · Berlaku untuk layanan Webjoz</p>

        <div className="prose prose-invert max-w-none space-y-8 text-sm leading-relaxed text-foreground/80">

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">1. Gambaran Umum</h2>
            <p>
              Giwangan Studio berkomitmen memberikan layanan Webjoz yang berkualitas. Kami memahami bahwa terkadang layanan mungkin tidak sesuai dengan harapan. Kebijakan ini menjelaskan kondisi di mana pengembalian dana (<em>refund</em>) dapat dilakukan.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">2. Periode Garansi Uang Kembali</h2>
            <p>
              Kami memberikan <strong>garansi uang kembali 7 hari</strong> setelah pembelian paket berbayar pertama Anda, dengan syarat:
            </p>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li>Permintaan diajukan dalam 7 hari kalender setelah tanggal pembayaran.</li>
              <li>Anda belum mempublikasikan lebih dari 1 website menggunakan paket tersebut.</li>
              <li>Permintaan disampaikan melalui email ke <strong>giwanganstudio@gmail.com</strong>.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">3. Kondisi yang Memenuhi Syarat Refund</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Duplikasi pembayaran (ditagih dua kali untuk transaksi yang sama).</li>
              <li>Layanan tidak berfungsi selama lebih dari 72 jam berturut-turut dan kami gagal memperbaikinya.</li>
              <li>Pembatalan dalam 7 hari pertama sesuai garansi uang kembali di atas.</li>
              <li>Kesalahan teknis pada sistem pembayaran yang menyebabkan tagihan tidak sesuai.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">4. Kondisi yang Tidak Memenuhi Syarat Refund</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Permintaan setelah melewati periode 7 hari garansi.</li>
              <li>Ketidakpuasan terhadap hasil konten AI (kami menyediakan fitur edit dan regenerasi).</li>
              <li>Akun yang ditangguhkan karena melanggar Syarat & Ketentuan.</li>
              <li>Perubahan keputusan bisnis atau tidak lagi membutuhkan layanan.</li>
              <li>Pembatalan langganan perpanjangan (tidak termasuk garansi).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">5. Cara Mengajukan Refund</h2>
            <p>Untuk mengajukan pengembalian dana:</p>
            <ol className="list-decimal pl-5 space-y-2 mt-2">
              <li>Kirim email ke <a href="mailto:giwanganstudio@gmail.com" className="text-primary hover:underline">giwanganstudio@gmail.com</a> dengan subjek: <strong>&quot;Permintaan Refund - [Nama Akun]&quot;</strong>.</li>
              <li>Sertakan: nomor transaksi, tanggal pembayaran, dan alasan permintaan refund.</li>
              <li>Tim kami akan merespons dalam 2 hari kerja.</li>
              <li>Jika disetujui, dana akan dikembalikan ke metode pembayaran asal dalam 5–14 hari kerja tergantung kebijakan bank/provider.</li>
            </ol>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">6. Pembatalan Langganan</h2>
            <p>
              Anda dapat membatalkan langganan kapan saja melalui dashboard → Pengaturan → Langganan. Pembatalan berlaku pada akhir periode billing yang berjalan. Tidak ada refund prorata untuk sisa masa berlangganan yang belum digunakan.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">7. Prosesor Pembayaran</h2>
            <p>
              Semua transaksi diproses oleh <strong>Midtrans</strong> (PT Midtrans). Untuk pertanyaan terkait status pembayaran atau dispute transaksi, Anda juga dapat menghubungi Midtrans secara langsung melalui layanan pelanggan mereka.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">8. Kontak</h2>
            <address className="not-italic space-y-1">
              <p><strong>Giwangan Studio</strong></p>
              <p>Jl. Malang Wijoyo, Malangan, Giwangan, Umbulharjo, Yogyakarta</p>
              <p>Email: <a href="mailto:giwanganstudio@gmail.com" className="text-primary hover:underline">giwanganstudio@gmail.com</a></p>
              <p>Jam Operasional: Senin – Jumat, 09.00 – 17.00 WIB</p>
            </address>
          </section>

        </div>
      </div>
    </main>
  );
}
