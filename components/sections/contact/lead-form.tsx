"use client";
import React, { useState } from "react";
import { Check, Send } from "lucide-react";

export default function DynamicLeadForm({ onSubmit, submitting, success, error }: { onSubmit?: (data: { name: string; email: string; phone: string; message: string }) => Promise<void>; submitting?: boolean; success?: boolean; error?: string | null; }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "0.625rem 1rem", border: "1px solid color-mix(in srgb, var(--dt-primary) 25%, #e2e8f0)",
    borderRadius: "var(--dt-radius)", outline: "none", fontSize: "0.875rem",
    background: "color-mix(in srgb, var(--dt-primary) 3%, var(--dt-surface))",
    color: "var(--dt-text)", fontFamily: "var(--dt-body-font)"
  };

  if (success) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "2rem", textAlign: "center", background: "color-mix(in srgb, var(--dt-primary) 5%, var(--dt-surface))", borderRadius: "var(--dt-radius-lg)", border: "1px solid color-mix(in srgb, var(--dt-primary) 20%, transparent)" }}>
        <div style={{ width: 48, height: 48, background: "color-mix(in srgb, var(--dt-primary) 15%, transparent)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1rem" }}>
          <Check style={{ width: 24, height: 24, color: "var(--dt-primary)" }} />
        </div>
        <h3 style={{ fontFamily: "var(--dt-heading-font)", fontWeight: "var(--dt-heading-weight)" as any, color: "var(--dt-text)", marginBottom: "0.5rem" }}>Pesan Terkirim!</h3>
        <p style={{ fontSize: "0.875rem", color: "var(--dt-text-muted)" }}>Terima kasih. Tim kami akan segera merespons.</p>
      </div>
    );
  }

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit && onSubmit({ name, email, phone, message }); }} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      {error && <div style={{ padding: "0.75rem 1rem", background: "#fee2e2", borderRadius: "var(--dt-radius)", color: "#991b1b", fontSize: "0.875rem" }}>{error}</div>}
      <div>
        <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--dt-text-muted)", marginBottom: "0.375rem" }}>Nama Lengkap</label>
        <input type="text" required value={name} onChange={(e) => setName(e.target.value)} style={inputStyle} placeholder="cth. Budi Santoso" />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
        <div>
          <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--dt-text-muted)", marginBottom: "0.375rem" }}>Email</label>
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} placeholder="email@domain.com" />
        </div>
        <div>
          <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--dt-text-muted)", marginBottom: "0.375rem" }}>Nomor WA</label>
          <input type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} style={inputStyle} placeholder="08xx" />
        </div>
      </div>
      <div>
        <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--dt-text-muted)", marginBottom: "0.375rem" }}>Pesan</label>
        <textarea required rows={4} value={message} onChange={(e) => setMessage(e.target.value)} style={{ ...inputStyle, resize: "none" }} placeholder="Tulis pesan atau pertanyaan Anda..." />
      </div>
      <button
        type="submit"
        disabled={submitting}
        style={{ padding: "0.75rem 1.5rem", background: "var(--dt-primary)", color: "var(--dt-primary-foreground)", borderRadius: "var(--dt-radius)", fontWeight: 700, fontFamily: "var(--dt-body-font)", cursor: submitting ? "not-allowed" : "pointer", opacity: submitting ? 0.6 : 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", transition: "opacity 0.2s", border: "none" }}
      >
        {submitting ? "Mengirim..." : <><Send style={{ width: 16, height: 16 }} /> Kirim Pesan</>}
      </button>
    </form>
  );
}
