import React from "react";
import { Plus } from "lucide-react";
import FileUpload from "@/components/file-upload";

export interface SectionFormsProps {
  activeTab: string;
  content: any;
  updateField: (section: string, key: string, val: any) => void;
  needsAttention: (path: string) => boolean;
  fieldClass: (path: string, base: string) => string;
}

export default function SectionForms({
  activeTab,
  content,
  updateField,
  needsAttention,
  fieldClass,
}: SectionFormsProps) {
  return (
    <>
      {/* HEADER FORM */}
      {activeTab === "header" && (
        <div className="space-y-3">
          <div className="space-y-1">
            <label className="flex items-center gap-1 text-[11px] uppercase tracking-wide font-semibold text-slate-400">
              Nama Brand {needsAttention("header.brand_name") && <span className="text-amber-300">⚠️</span>}
            </label>
            <input 
              type="text" 
              value={content.header?.brand_name || ""} 
              onChange={(e) => updateField("header", "brand_name", e.target.value)} 
              className={fieldClass("header.brand_name", "w-full px-2.5 py-1.5 border rounded-md text-[13px] outline-none focus:border-violet-400")} 
            />
          </div>
          <div className="space-y-1">
            <label className="flex items-center gap-1 text-[11px] uppercase tracking-wide font-semibold text-slate-400">
              Teks Tombol Nav {needsAttention("header.nav_cta_text") && <span className="text-amber-300">⚠️</span>}
            </label>
            <input 
              type="text" 
              value={content.header?.nav_cta_text || ""} 
              onChange={(e) => updateField("header", "nav_cta_text", e.target.value)} 
              className={fieldClass("header.nav_cta_text", "w-full px-2.5 py-1.5 border rounded-md text-[13px] outline-none focus:border-violet-400")} 
            />
          </div>
          <div className="space-y-1">
            <label className="text-[11px] uppercase tracking-wide font-semibold text-slate-400">Logo URL</label>
            <FileUpload label="" value={content.header?.logo_url || ""} onChange={(val) => updateField("header", "logo_url", val)} placeholder="https://..." maxWidth={400} maxHeight={400} quality={0.85} />
          </div>
          <div className="space-y-1">
            <label className="text-[11px] uppercase tracking-wide font-semibold text-slate-400">Favicon</label>
            <FileUpload label="" value={content.seo?.favicon_url || ""} onChange={(val) => updateField("seo", "favicon_url", val)} placeholder="https://..." accept=".ico,.png,.jpg,.jpeg" maxWidth={128} maxHeight={128} quality={0.9} />
          </div>
          <div className="space-y-1">
            <label className="text-[11px] uppercase tracking-wide font-semibold text-slate-400">Nama Ikon</label>
            <input type="text" value={content.header?.icon || ""} onChange={(e) => updateField("header", "icon", e.target.value)} className="w-full px-2.5 py-1.5 border rounded-md text-[13px] outline-none focus:border-violet-400" placeholder="cth. Utensils" />
          </div>
        </div>
      )}

      {/* HERO FORM */}
      {activeTab === "hero" && (
        <div className="space-y-3">
          <FileUpload label="Gambar Hero" value={content.hero.image_url || ""} onChange={(val) => updateField("hero", "image_url", val)} placeholder="https://..." maxWidth={1600} maxHeight={1200} quality={0.8} />
          <div className="space-y-1">
            <label className="flex items-center gap-1 text-[11px] uppercase tracking-wide font-semibold text-slate-400">
              Headline {needsAttention("hero.headline") && <span className="text-amber-300">⚠️</span>}
            </label>
            <input 
              type="text" 
              value={content.hero.headline || ""} 
              onChange={(e) => updateField("hero", "headline", e.target.value)} 
              className={fieldClass("hero.headline", "w-full px-2.5 py-1.5 border rounded-md text-[13px] outline-none focus:border-violet-400")} 
            />
          </div>
          <div className="space-y-1">
            <label className="flex items-center gap-1 text-[11px] uppercase tracking-wide font-semibold text-slate-400">
              Subheadline {needsAttention("hero.subheadline") && <span className="text-amber-300">⚠️</span>}
            </label>
            <textarea 
              rows={2} 
              value={content.hero.subheadline || ""} 
              onChange={(e) => updateField("hero", "subheadline", e.target.value)} 
              className={fieldClass("hero.subheadline", "w-full px-2.5 py-1.5 border rounded-md text-[13px] outline-none focus:border-violet-400 resize-none")} 
            />
          </div>
          <div className="space-y-1">
            <label className="flex items-center gap-1 text-[11px] uppercase tracking-wide font-semibold text-slate-400">
              Teks Tombol CTA {needsAttention("hero.cta_text") && <span className="text-amber-300">⚠️</span>}
            </label>
            <input 
              type="text" 
              value={content.hero.cta_text || ""} 
              onChange={(e) => updateField("hero", "cta_text", e.target.value)} 
              className={fieldClass("hero.cta_text", "w-full px-2.5 py-1.5 border rounded-md text-[13px] outline-none focus:border-violet-400")} 
            />
          </div>
          <div className="space-y-1">
            <label className="flex items-center gap-1 text-[11px] uppercase tracking-wide font-semibold text-slate-400">
              Link Tombol CTA {needsAttention("hero.cta_url") && <span className="text-amber-300">⚠️</span>}
            </label>
            <input 
              type="text" 
              value={content.hero.cta_url || ""} 
              onChange={(e) => updateField("hero", "cta_url", e.target.value)} 
              className={fieldClass("hero.cta_url", "w-full px-2.5 py-1.5 border rounded-md text-[13px] outline-none focus:border-violet-400")} 
            />
          </div>
        </div>
      )}

      {/* ABOUT FORM */}
      {activeTab === "about" && (
        <div className="space-y-3">
          <FileUpload label="Gambar Tentang" value={content.about.image_url || ""} onChange={(val) => updateField("about", "image_url", val)} placeholder="https://..." maxWidth={1000} maxHeight={1000} quality={0.8} />
          <div className="space-y-1">
            <label className="flex items-center gap-1 text-[11px] uppercase tracking-wide font-semibold text-slate-400">
              Judul {needsAttention("about.title") && <span className="text-amber-300">⚠️</span>}
            </label>
            <input 
              type="text" 
              value={content.about.title || ""} 
              onChange={(e) => updateField("about", "title", e.target.value)} 
              className={fieldClass("about.title", "w-full px-2.5 py-1.5 border rounded-md text-[13px] outline-none focus:border-violet-400")} 
            />
          </div>
          <div className="space-y-1">
            <label className="flex items-center gap-1 text-[11px] uppercase tracking-wide font-semibold text-slate-400">
              Deskripsi {needsAttention("about.body") && <span className="text-amber-300">⚠️</span>}
            </label>
            <textarea 
              rows={3} 
              value={content.about.body || ""} 
              onChange={(e) => updateField("about", "body", e.target.value)} 
              className={fieldClass("about.body", "w-full px-2.5 py-1.5 border rounded-md text-[13px] outline-none focus:border-violet-400 resize-none")} 
            />
          </div>
        </div>
      )}

      {/* BENEFITS FORM */}
      {activeTab === "benefits" && (
        <div className="space-y-3">
          <div className="space-y-1">
            <label className="flex items-center gap-1 text-[11px] uppercase tracking-wide font-semibold text-slate-400">
              Judul Section {needsAttention("benefits.title") && <span className="text-amber-300">⚠️</span>}
            </label>
            <input 
              type="text" 
              value={content.benefits.title || ""} 
              onChange={(e) => updateField("benefits", "title", e.target.value)} 
              className={fieldClass("benefits.title", "w-full px-2.5 py-1.5 border rounded-md text-[13px] outline-none focus:border-violet-400")} 
            />
          </div>
          {content.benefits.items?.map((item: any, idx: number) => (
            <div key={idx} className="border border-white/10 p-2.5 rounded-lg space-y-2 bg-white/[0.03]">
              <div className="flex justify-between items-center">
                <span className="text-[10px] uppercase font-bold text-slate-400">#{idx + 1}</span>
                <button 
                  type="button"
                  onClick={() => { 
                    const n = content.benefits.items.filter((_: any, i: number) => i !== idx); 
                    updateField("benefits", "items", n); 
                  }} 
                  className="text-red-400 text-[11px]"
                >
                  Hapus
                </button>
              </div>
              <input 
                type="text" 
                value={item.title || ""} 
                onChange={(e) => { 
                  const n = [...content.benefits.items]; 
                  n[idx].title = e.target.value; 
                  updateField("benefits", "items", n); 
                }} 
                placeholder="Judul" 
                className={fieldClass(`benefits.items.${idx}.title`, "w-full px-2 py-1 bg-white border rounded text-[12px] outline-none focus:border-violet-400")} 
              />
              <textarea 
                rows={2} 
                value={item.description || ""} 
                onChange={(e) => { 
                  const n = [...content.benefits.items]; 
                  n[idx].description = e.target.value; 
                  updateField("benefits", "items", n); 
                }} 
                placeholder="Deskripsi" 
                className={fieldClass(`benefits.items.${idx}.description`, "w-full px-2 py-1 bg-white border rounded text-[12px] outline-none focus:border-violet-400 resize-none")} 
              />
            </div>
          ))}
          <button 
            type="button"
            onClick={() => { 
              const n = [...(content.benefits.items || []), { title: "", description: "" }]; 
              updateField("benefits", "items", n); 
            }} 
            className="w-full text-[12px] py-1.5 border border-white/10 rounded-lg text-slate-400 hover:bg-white/5 flex items-center justify-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" /> Tambah
          </button>
        </div>
      )}

      {/* FAQ FORM */}
      {activeTab === "faq" && (
        <div className="space-y-3">
          <div className="space-y-1">
            <label className="flex items-center gap-1 text-[11px] uppercase tracking-wide font-semibold text-slate-400">
              Judul Section {needsAttention("faq.title") && <span className="text-amber-300">⚠️</span>}
            </label>
            <input 
              type="text" 
              value={content.faq.title || ""} 
              onChange={(e) => updateField("faq", "title", e.target.value)} 
              className={fieldClass("faq.title", "w-full px-2.5 py-1.5 border rounded-md text-[13px] outline-none focus:border-violet-400")} 
            />
          </div>
          {content.faq.items?.map((item: any, idx: number) => (
            <div key={idx} className="border border-white/10 p-2.5 rounded-lg space-y-2 bg-white/[0.03]">
              <div className="flex justify-between items-center">
                <span className="text-[10px] uppercase font-bold text-slate-400">FAQ #{idx + 1}</span>
                <button 
                  type="button"
                  onClick={() => { 
                    const n = content.faq.items.filter((_: any, i: number) => i !== idx); 
                    updateField("faq", "items", n); 
                  }} 
                  className="text-red-400 text-[11px]"
                >
                  Hapus
                </button>
              </div>
              <input 
                type="text" 
                value={item.question || ""} 
                onChange={(e) => { 
                  const n = [...content.faq.items]; 
                  n[idx].question = e.target.value; 
                  updateField("faq", "items", n); 
                }} 
                placeholder="Pertanyaan" 
                className={fieldClass(`faq.items.${idx}.question`, "w-full px-2 py-1 bg-white border rounded text-[12px] outline-none focus:border-violet-400")} 
              />
              <textarea 
                rows={2} 
                value={item.answer || ""} 
                onChange={(e) => { 
                  const n = [...content.faq.items]; 
                  n[idx].answer = e.target.value; 
                  updateField("faq", "items", n); 
                }} 
                placeholder="Jawaban" 
                className={fieldClass(`faq.items.${idx}.answer`, "w-full px-2 py-1 bg-white border rounded text-[12px] outline-none focus:border-violet-400 resize-none")} 
              />
            </div>
          ))}
          <button 
            type="button"
            onClick={() => { 
              const n = [...(content.faq.items || []), { question: "", answer: "" }]; 
              updateField("faq", "items", n); 
            }} 
            className="w-full text-[12px] py-1.5 border border-white/10 rounded-lg text-slate-400 hover:bg-white/5 flex items-center justify-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" /> Tambah FAQ
          </button>
        </div>
      )}

      {/* CTA FORM */}
      {activeTab === "cta" && (
        <div className="space-y-3">
          <div className="space-y-1">
            <label className="flex items-center gap-1 text-[11px] uppercase tracking-wide font-semibold text-slate-400">
              Headline CTA {needsAttention("cta.headline") && <span className="text-amber-300">⚠️</span>}
            </label>
            <input 
              type="text" 
              value={content.cta.headline || ""} 
              onChange={(e) => updateField("cta", "headline", e.target.value)} 
              className={fieldClass("cta.headline", "w-full px-2.5 py-1.5 border rounded-md text-[13px] outline-none focus:border-violet-400")} 
            />
          </div>
          <div className="space-y-1">
            <label className="flex items-center gap-1 text-[11px] uppercase tracking-wide font-semibold text-slate-400">
              Teks Tombol {needsAttention("cta.button_text") && <span className="text-amber-300">⚠️</span>}
            </label>
            <input 
              type="text" 
              value={content.cta.button_text || ""} 
              onChange={(e) => updateField("cta", "button_text", e.target.value)} 
              className={fieldClass("cta.button_text", "w-full px-2.5 py-1.5 border rounded-md text-[13px] outline-none focus:border-violet-400")} 
            />
          </div>
          <div className="space-y-1">
            <label className="flex items-center gap-1 text-[11px] uppercase tracking-wide font-semibold text-slate-400">
              Link Tombol {needsAttention("cta.button_url") && <span className="text-amber-300">⚠️</span>}
            </label>
            <input 
              type="text" 
              value={content.cta.button_url || ""} 
              onChange={(e) => updateField("cta", "button_url", e.target.value)} 
              className={fieldClass("cta.button_url", "w-full px-2.5 py-1.5 border rounded-md text-[13px] outline-none focus:border-violet-400")} 
            />
          </div>
        </div>
      )}

      {/* CONTACT FORM */}
      {activeTab === "contact" && (
        <div className="space-y-3">
          <div className="space-y-1">
            <label className="flex items-center gap-1 text-[11px] uppercase tracking-wide font-semibold text-slate-400">
              Judul {needsAttention("contact.title") && <span className="text-amber-300">⚠️</span>}
            </label>
            <input 
              type="text" 
              value={content.contact.title || ""} 
              onChange={(e) => updateField("contact", "title", e.target.value)} 
              className={fieldClass("contact.title", "w-full px-2.5 py-1.5 border rounded-md text-[13px] outline-none focus:border-violet-400")} 
            />
          </div>
          <div className="space-y-1">
            <label className="flex items-center gap-1 text-[11px] uppercase tracking-wide font-semibold text-slate-400">
              Alamat {needsAttention("contact.address") && <span className="text-amber-300">⚠️</span>}
            </label>
            <input 
              type="text" 
              value={content.contact.address || ""} 
              onChange={(e) => updateField("contact", "address", e.target.value)} 
              className={fieldClass("contact.address", "w-full px-2.5 py-1.5 border rounded-md text-[13px] outline-none focus:border-violet-400")} 
            />
          </div>
          <div className="space-y-1">
            <label className="flex items-center gap-1 text-[11px] uppercase tracking-wide font-semibold text-slate-400">
              Nomor WhatsApp {needsAttention("contact.phone") && <span className="text-amber-300">⚠️</span>}
            </label>
            <input 
              type="text" 
              value={content.contact.phone || ""} 
              onChange={(e) => updateField("contact", "phone", e.target.value)} 
              className={fieldClass("contact.phone", "w-full px-2.5 py-1.5 border rounded-md text-[13px] outline-none focus:border-violet-400")} 
            />
          </div>
          <div className="space-y-1">
            <label className="flex items-center gap-1 text-[11px] uppercase tracking-wide font-semibold text-slate-400">
              Email {needsAttention("contact.email") && <span className="text-amber-300">⚠️</span>}
            </label>
            <input 
              type="email" 
              value={content.contact.email || ""} 
              onChange={(e) => updateField("contact", "email", e.target.value)} 
              className={fieldClass("contact.email", "w-full px-2.5 py-1.5 border rounded-md text-[13px] outline-none focus:border-violet-400")} 
            />
          </div>
          <div className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.03] p-2.5">
            <span className="text-[12px] font-medium text-slate-200">Formulir Kontak</span>
            <input 
              type="checkbox" 
              checked={content.contact.show_lead_form !== false} 
              onChange={(e) => updateField("contact", "show_lead_form", e.target.checked)} 
              className="w-4 h-4 accent-violet-600 cursor-pointer" 
            />
          </div>
        </div>
      )}

      {/* FOOTER FORM */}
      {activeTab === "footer" && (
        <div className="space-y-3">
          <div className="space-y-1">
            <label className="text-[11px] uppercase tracking-wide font-semibold text-slate-400">Nama Brand</label>
            <input 
              type="text" 
              value={content.footer?.brand_name || ""} 
              onChange={(e) => updateField("footer", "brand_name", e.target.value)} 
              className="w-full px-2.5 py-1.5 border rounded-md text-[13px] outline-none focus:border-violet-400" 
            />
          </div>
          <div className="space-y-1">
            <label className="text-[11px] uppercase tracking-wide font-semibold text-slate-400">Tagline</label>
            <input 
              type="text" 
              value={content.footer?.tagline || ""} 
              onChange={(e) => updateField("footer", "tagline", e.target.value)} 
              className="w-full px-2.5 py-1.5 border rounded-md text-[13px] outline-none focus:border-violet-400" 
            />
          </div>
          <div className="space-y-1">
            <label className="text-[11px] uppercase tracking-wide font-semibold text-slate-400">Copyright</label>
            <input 
              type="text" 
              value={content.footer?.copyright_text || ""} 
              onChange={(e) => updateField("footer", "copyright_text", e.target.value)} 
              className="w-full px-2.5 py-1.5 border rounded-md text-[13px] outline-none focus:border-violet-400" 
            />
          </div>
        </div>
      )}

      {/* SEO FORM */}
      {activeTab === "seo" && (
        <div className="space-y-3">
          <div className="rounded-lg border border-cyan-400/20 bg-cyan-400/10 px-3 py-2.5 text-[12px] leading-relaxed text-cyan-100">
            <p className="font-semibold text-cyan-50">SEO tidak tampil sebagai section di halaman publik.</p>
            <p className="mt-1 text-cyan-100/80">
              Data ini dipakai mesin pencari dan preview saat link dibagikan, seperti judul Google, deskripsi, favicon, dan gambar share.
            </p>
          </div>
          <div className="space-y-1">
            <label className="flex items-center gap-1 text-[11px] uppercase tracking-wide font-semibold text-slate-400">
              Meta Title {needsAttention("seo.title") && <span className="text-amber-300">⚠️</span>}
            </label>
            <input 
              type="text" 
              value={content.seo?.title || ""} 
              onChange={(e) => updateField("seo", "title", e.target.value)} 
              className={fieldClass("seo.title", "w-full px-2.5 py-1.5 border rounded-md text-[13px] outline-none focus:border-violet-400")} 
            />
          </div>
          <div className="space-y-1">
            <label className="flex items-center gap-1 text-[11px] uppercase tracking-wide font-semibold text-slate-400">
              Meta Description {needsAttention("seo.description") && <span className="text-amber-300">⚠️</span>}
            </label>
            <textarea 
              rows={3} 
              value={content.seo?.description || ""} 
              onChange={(e) => updateField("seo", "description", e.target.value)} 
              className={fieldClass("seo.description", "w-full px-2.5 py-1.5 border rounded-md text-[13px] outline-none focus:border-violet-400 resize-none")} 
            />
          </div>
          <FileUpload label="Favicon" value={content.seo?.favicon_url || ""} onChange={(val) => updateField("seo", "favicon_url", val)} placeholder="https://..." accept=".ico,.png,.jpg,.jpeg" maxWidth={128} maxHeight={128} quality={0.9} />
          <FileUpload label="OG Image" value={content.seo?.og_image_url || ""} onChange={(val) => updateField("seo", "og_image_url", val)} placeholder="https://..." maxWidth={1200} maxHeight={630} quality={0.85} />
        </div>
      )}
    </>
  );
}
