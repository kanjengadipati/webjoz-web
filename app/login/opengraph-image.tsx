import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "Masuk ke Webjoz";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const geist = await readFile(
    join(
      process.cwd(),
      "node_modules/next/dist/compiled/@vercel/og/Geist-Regular.ttf"
    )
  );

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#ffffff",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          fontFamily: "Geist",
        }}
      >
        {/* Top row: wordmark */}
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          {/* Logo square */}
          <div
            style={{
              width: 44,
              height: 44,
              background: "#111111",
              borderRadius: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#ffffff"
              stroke-width="2.2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <span
            style={{
              fontSize: 28,
              fontWeight: 700,
              color: "#111111",
              letterSpacing: "-0.5px",
            }}
          >
            Webjoz
          </span>
        </div>

        {/* Middle: headline block */}
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div
            style={{
              fontSize: 15,
              fontWeight: 500,
              color: "#888888",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            Link Masuk
          </div>
          <div
            style={{
              fontSize: 80,
              fontWeight: 800,
              color: "#111111",
              lineHeight: 1.05,
              letterSpacing: "-3px",
            }}
          >
            Masuk ke
            <br />
            Dashboard
          </div>
          <div
            style={{
              fontSize: 24,
              color: "#666666",
              lineHeight: 1.5,
              maxWidth: 640,
              marginTop: 4,
            }}
          >
            Klik link ini untuk langsung masuk ke akun Webjoz
            kamu — tanpa kata sandi.
          </div>
        </div>

        {/* Bottom row: domain + expiry */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1.5px solid #e5e5e5",
            paddingTop: 28,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontSize: 18,
              color: "#111111",
              fontWeight: 600,
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#111111"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            webjoz.com
          </div>
          <div
            style={{
              fontSize: 16,
              color: "#aaaaaa",
              letterSpacing: "0.01em",
            }}
          >
            Berlaku 15 menit · Sekali pakai · Jangan dibagikan
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: "Geist", data: geist, style: "normal", weight: 400 }],
    }
  );
}
