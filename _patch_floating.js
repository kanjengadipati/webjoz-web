const fs = require('fs');
const p = '/Users/meilanasapta/Code/giwangan-web-gen/web/app/dashboard/sites/[id]/SectionForms.tsx';
let src = fs.readFileSync(p, 'utf8');

// Find the closing of the SectionForms return and insert floating form before it
// Target: the last '    </>\n  );\n}' pattern before MenuCatalogFormProps
const closeTag = '    </>\n  );\n}\n// ─── Shared Menu';
const idx = src.indexOf(closeTag);
if (idx === -1) {
  // try variation
  const lines = src.split('\n');
  const li = lines.findIndex((l, i) => l.trim() === '</>' && lines[i+1]?.trim() === ');' && lines[i+2]?.trim() === '}');
  console.log('fallback line search:', li);
  process.exit(1);
}

const floatingForm = `
      {/* ── FLOATING BUTTON FORM ── */}
      {activeTab === "floating" && (
        <div className="space-y-4">
          <div className="rounded-lg border border-primary/20 bg-primary/10 px-3 py-2.5 text-[12px] leading-relaxed text-primary">
            <p className="font-semibold text-primary">💬 Tombol Aksi Mengambang</p>
            <p className="mt-1 text-primary/80">Tombol yang selalu terlihat di pojok kanan bawah halaman website.</p>
          </div>

          {/* Type selector */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Tipe Tombol</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { value: "none",         label: "Tidak Ada",   icon: "🚫", desc: "Tidak tampil tombol" },
                { value: "whatsapp",     label: "WhatsApp",    icon: "💬", desc: "Tombol WA sederhana" },
                { value: "chat_bubble",  label: "Chat Bubble", icon: "✨", desc: "Widget chat interaktif" },
                { value: "contact_link", label: "Link Kontak", icon: "📋", desc: "Scroll ke section Kontak" },
              ].map((opt) => {
                const current = designToken?.layout?.floating_button ?? "whatsapp";
                const isActive = current === opt.value;
                const isLocked = opt.value === "chat_bubble" && !isPremium;
                return (
                  <button key={opt.value} type="button" disabled={isLocked}
                    onClick={() => updateDesignTokenLayout?.("floating_button", opt.value)}
                    className={\`relative p-3 rounded-xl border text-left transition-all cursor-pointer disabled:cursor-not-allowed \${isActive ? "border-primary bg-primary/15 ring-1 ring-primary" : "border-white/10 bg-white/[0.03] hover:border-white/25"} \${isLocked ? "opacity-50" : ""}\`}
                  >
                    <span className="text-lg block mb-1">{opt.icon}</span>
                    <p className="text-[11px] font-bold text-slate-200 leading-tight">{opt.label}</p>
                    <p className="text-[10px] text-slate-500 mt-0.5 leading-tight">{opt.desc}</p>
                    {opt.value === "chat_bubble" && <span className="absolute top-1.5 right-1.5 text-[8px] font-bold px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">PRO</span>}
                    {isActive && <span className="absolute bottom-1.5 right-1.5 w-2 h-2 rounded-full bg-primary" />}
                  </button>
                );
              })}
            </div>
            {!isPremium && (
              <p className="text-[10px] text-amber-400/80 leading-relaxed">✨ Chat Bubble tersedia untuk plan <strong className="text-amber-400">Pro</strong>.</p>
            )}
          </div>

          {/* WA number — required for whatsapp & chat_bubble */}
          {(designToken?.layout?.floating_button === "whatsapp" || designToken?.layout?.floating_button === "chat_bubble" || !designToken?.layout?.floating_button) && (
            <div className="space-y-2 pt-2 border-t border-white/10">
              <label className="flex items-center gap-1 text-[11px] uppercase tracking-wide font-semibold text-slate-400">
                Nomor WhatsApp <span className="text-red-400">*</span>
              </label>
              <input type="text" inputMode="tel" value={content?.contact?.phone || ""}
                onChange={(e) => {
                  const val = e.target.value;
                  updateField("contact", "phone", val);
                  const digits = val.replace(/\\D/g, "");
                  if (digits) {
                    const fmt = digits.startsWith("0") ? "62" + digits.slice(1) : digits;
                    if (/wa\\.me|whatsapp\\.com/i.test(content?.hero?.cta_url || "")) updateField("hero", "cta_url", \`https://wa.me/\${fmt}\`);
                    if (/wa\\.me|whatsapp\\.com/i.test(content?.cta?.button_url || "")) updateField("cta", "button_url", \`https://wa.me/\${fmt}\`);
                  }
                }}
                placeholder="cth. 628123456789"
                className="w-full px-2.5 py-1.5 border border-white/10 rounded-md text-[13px] outline-none focus:border-primary/60 bg-transparent text-slate-200 placeholder-slate-600"
              />
              {!content?.contact?.phone && <p className="text-[10px] text-red-400/80 mt-1">Nomor WA wajib diisi agar tombol berfungsi.</p>}
              <p className="text-[10px] text-slate-600">Nomor ini juga dipakai di tombol WA lain di seluruh halaman.</p>
            </div>
          )}

          {/* Hint */}
          {designToken?.layout?.floating_button !== "none" && (
            <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3 text-[11px] text-slate-400 leading-relaxed">
              {(designToken?.layout?.floating_button === "whatsapp" || !designToken?.layout?.floating_button) && "Tombol hijau WhatsApp tampil di pojok kanan bawah. Klik langsung membuka WA."}
              {designToken?.layout?.floating_button === "chat_bubble" && (isPremium ? "Widget chat WA interaktif. Pengunjung bisa ketik pesan sebelum diarahkan ke WA." : "Aktifkan plan Pro untuk Chat Bubble.")}
              {designToken?.layout?.floating_button === "contact_link" && "Tombol scroll ke section Kontak. Tidak membutuhkan nomor WA."}
            </div>
          )}
        </div>
      )}`;

src = src.slice(0, idx) + floatingForm + '\n' + src.slice(idx);
fs.writeFileSync(p, src, 'utf8');
console.log('Done. Lines:', src.split('\n').length);
