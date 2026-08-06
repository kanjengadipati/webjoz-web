import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Hubungi Kami | Webjoz",
  description: "Hubungi tim Webjoz — Giwangan Studio. Kami siap membantu Anda dengan pertanyaan seputar platform AI website builder.",
  keywords: ["hubungi webjoz", "kontak webjoz", "customer support", "bantuan website", "giwangan studio"],
  alternates: {
    canonical: "https://webjoz.com/contact",
  },
  openGraph: {
    title: "Hubungi Kami | Webjoz",
    description: "Hubungi tim Webjoz untuk bantuan dan pertanyaan seputar platform AI website builder.",
    url: "https://webjoz.com/contact",
    siteName: "Webjoz",
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Hubungi Kami | Webjoz",
    description: "Hubungi tim Webjoz untuk bantuan dan pertanyaan.",
  },
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <Link href="/" className="text-xs text-muted-foreground hover:text-foreground transition mb-8 inline-block">← Kembali ke Beranda</Link>

        <h1 className="text-3xl font-bold mb-2">Hubungi Kami</h1>
        <p className="text-sm text-muted-foreground mb-10">Tim kami siap membantu Anda — Senin sampai Jumat, 09.00–17.00 WIB.</p>

        <div className="grid gap-6 sm:grid-cols-2 mb-12">
          {/* Email */}
          <a
            href="mailto:giwanganstudio@gmail.com"
            className="flex flex-col gap-2 rounded-2xl border border-border/60 bg-card/40 p-6 hover:border-border transition-colors group"
          >
            <div className="text-2xl">✉️</div>
            <h2 className="font-semibold text-foreground">Email</h2>
            <p className="text-sm text-muted-foreground">giwanganstudio@gmail.com</p>
            <span className="text-xs text-primary group-hover:underline mt-1">Kirim email →</span>
          </a>

          {/* WhatsApp */}
          <a
            href="https://wa.me/6285111221044"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col gap-2 rounded-2xl border border-border/60 bg-card/40 p-6 hover:border-border transition-colors group"
          >
            <div className="text-2xl">💬</div>
            <h2 className="font-semibold text-foreground">WhatsApp</h2>
            <p className="text-sm text-muted-foreground">+62 851-1122-1044</p>
            <span className="text-xs text-primary group-hover:underline mt-1">Chat sekarang →</span>
          </a>

          {/* Alamat */}
          <div className="flex flex-col gap-2 rounded-2xl border border-border/60 bg-card/40 p-6">
            <div className="text-2xl">📍</div>
            <h2 className="font-semibold text-foreground">Alamat</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Jl. Malang Wijoyo, Malangan,<br />
              Giwangan, Umbulharjo, Yogyakarta,<br />
              Indonesia
            </p>
          </div>

          {/* Jam Operasional */}
          <div className="flex flex-col gap-2 rounded-2xl border border-border/60 bg-card/40 p-6">
            <div className="text-2xl">🕐</div>
            <h2 className="font-semibold text-foreground">Jam Operasional</h2>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>Senin – Jumat: 09.00 – 17.00 WIB</p>
              <p>Sabtu – Minggu: Tutup</p>
            </div>
          </div>
        </div>

        {/* About company */}
        <div className="rounded-2xl border border-border/60 bg-card/40 p-6">
          <h2 className="font-semibold text-foreground mb-3">Tentang Giwangan Studio</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            <strong className="text-foreground">Giwangan Studio</strong> adalah perusahaan teknologi asal Yogyakarta yang mengembangkan <strong className="text-foreground">Webjoz</strong> — platform AI website builder yang membantu pelaku UMKM dan bisnis Indonesia memiliki website profesional dengan mudah dan cepat. Kami percaya bahwa setiap bisnis berhak memiliki kehadiran digital yang layak, tanpa perlu keahlian teknis.
          </p>
        </div>

        {/* Links to legal pages */}
        <div className="mt-8 flex flex-wrap gap-4 text-xs text-muted-foreground">
          <Link href="/privacy-policy" className="hover:text-foreground transition">Kebijakan Privasi</Link>
          <Link href="/terms" className="hover:text-foreground transition">Syarat &amp; Ketentuan</Link>
          <Link href="/refund-policy" className="hover:text-foreground transition">Kebijakan Refund</Link>
        </div>
      </div>
    </main>
  );
}
