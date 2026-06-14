import React from "react";
import { Plus, Trash2, ChevronDown, ChevronUp, GripVertical } from "lucide-react";
import FileUpload from "@/components/file-upload";
import { isPlaceholderValue } from "./editor-utils";

export interface SectionFormsProps {
  activeTab: string;
  content: any;
  updateField: (section: string, key: string, val: any) => void;
  needsAttention: (path: string) => boolean;
  fieldClass: (path: string, base: string) => string;
}

interface LinkTypeInputProps {
  urlValue: string;
  updateUrl: (val: string) => void;
  needsAttention: boolean;
  fieldClass: (path: string, base: string) => string;
  path: string;
  label: string;
  defaultWaNumber?: string;
}

function LinkTypeInput({
  urlValue,
  updateUrl,
  needsAttention,
  fieldClass,
  path,
  label,
  defaultWaNumber,
}: LinkTypeInputProps) {
  const isWa = /wa\.me|whatsapp\.com|whatsapp:\/\//i.test(urlValue);
  const [linkType, setLinkType] = React.useState<"whatsapp" | "custom">(isWa ? "whatsapp" : "custom");

  // Keep state in sync with external value
  React.useEffect(() => {
    const isCurrentlyWa = /wa\.me|whatsapp\.com|whatsapp:\/\//i.test(urlValue);
    if (isCurrentlyWa && linkType !== "whatsapp") {
      setLinkType("whatsapp");
    } else if (!isCurrentlyWa && linkType === "whatsapp" && urlValue !== "") {
      setLinkType("custom");
    }
  }, [urlValue]);

  // Extract WA number
  const getWaNumber = (url: string): string => {
    if (!url) return "";
    const cleaned = url.replace(/\s+/g, "");
    const match = cleaned.match(/(?:wa\.me\/|phone=)([0-9]+)/i);
    return match ? match[1] : "";
  };

  const [waInput, setWaInput] = React.useState(() => {
    if (isWa) {
      return getWaNumber(urlValue);
    }
    if (defaultWaNumber) {
      return defaultWaNumber.replace(/\D/g, "");
    }
    return "";
  });

  React.useEffect(() => {
    if (isWa) {
      setWaInput(getWaNumber(urlValue));
    } else if (defaultWaNumber && !urlValue) {
      setWaInput(defaultWaNumber.replace(/\D/g, ""));
    }
  }, [urlValue, isWa, defaultWaNumber]);

  const handleWaChange = (val: string) => {
    const digitsOnly = val.replace(/\D/g, "");
    setWaInput(digitsOnly);
    
    let formattedDigits = digitsOnly;
    if (formattedDigits.startsWith("0")) {
      formattedDigits = "62" + formattedDigits.slice(1);
    }
    
    if (formattedDigits) {
      updateUrl(`https://wa.me/${formattedDigits}`);
    } else {
      updateUrl("");
    }
  };

  const handleTypeChange = (type: "whatsapp" | "custom") => {
    setLinkType(type);
    if (type === "whatsapp") {
      let digits = waInput;
      if (!digits && defaultWaNumber) {
        digits = defaultWaNumber.replace(/\D/g, "");
        setWaInput(digits);
      }
      
      let formattedDigits = digits;
      if (formattedDigits.startsWith("0")) {
        formattedDigits = "62" + formattedDigits.slice(1);
      }
      updateUrl(formattedDigits ? `https://wa.me/${formattedDigits}` : "https://wa.me/");
    } else {
      updateUrl("#contact");
    }
  };

  return (
    <div className="space-y-2 pt-2 border-t border-white/5 mt-2">
      <div className="flex items-center justify-between">
        <label className="text-[11px] uppercase tracking-wide font-semibold text-slate-400">
          Tipe Aksi Tombol
        </label>
        <div className="flex p-0.5 rounded bg-white/[0.04] border border-white/5">
          <button
            type="button"
            onClick={() => handleTypeChange("whatsapp")}
            className={`px-2 py-0.5 text-[10px] font-medium rounded transition cursor-pointer ${
              linkType === "whatsapp"
                ? "bg-violet-600 text-white font-bold"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            WhatsApp
          </button>
          <button
            type="button"
            onClick={() => handleTypeChange("custom")}
            className={`px-2 py-0.5 text-[10px] font-medium rounded transition cursor-pointer ${
              linkType === "custom"
                ? "bg-violet-600 text-white font-bold"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Link Kustom
          </button>
        </div>
      </div>

      {linkType === "whatsapp" ? (
        <div className="space-y-1">
          <label className="flex items-center gap-1 text-[11px] uppercase tracking-wide font-semibold text-slate-400">
            Nomor WhatsApp {needsAttention && <span className="text-amber-300">⚠️</span>}
          </label>
          <div className="relative flex items-center">
            <span className="absolute left-2.5 text-xs text-slate-500 font-semibold select-none">+</span>
            <input
              id={`field-${path}`}
              type="text"
              inputMode="tel"
              value={waInput}
              onChange={(e) => handleWaChange(e.target.value)}
              placeholder="628123456789"
              className={fieldClass(path, "w-full pl-6 pr-2.5 py-1.5 border rounded-md text-[13px] outline-none focus:border-violet-400 bg-transparent")}
            />
          </div>
          <p className="text-[10px] text-slate-500 leading-normal">
            Masukkan nomor dengan kode negara (cth. 628123456789 atau 08123456789).
          </p>
        </div>
      ) : (
        <div className="space-y-1">
          <label className="flex items-center gap-1 text-[11px] uppercase tracking-wide font-semibold text-slate-400">
            {label} {needsAttention && <span className="text-amber-300">⚠️</span>}
          </label>
          <input
            id={`field-${path}`}
            type="text"
            value={urlValue}
            onChange={(e) => updateUrl(e.target.value)}
            className={fieldClass(path, "w-full px-2.5 py-1.5 border rounded-md text-[13px] outline-none focus:border-violet-400 bg-transparent")}
            placeholder="#contact atau https://..."
          />
        </div>
      )}
    </div>
  );
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
              id="field-header.brand_name"
              type="text" 
              value={content.header?.brand_name || ""} 
              onChange={(e) => updateField("header", "brand_name", e.target.value)} 
              className={fieldClass("header.brand_name", "w-full px-2.5 py-1.5 border rounded-md text-[13px] outline-none focus:border-violet-400 bg-transparent")} 
            />
          </div>
          <div className="space-y-1">
            <label className="flex items-center gap-1 text-[11px] uppercase tracking-wide font-semibold text-slate-400">
              Teks Tombol Nav {needsAttention("header.nav_cta_text") && <span className="text-amber-300">⚠️</span>}
            </label>
            <input 
              id="field-header.nav_cta_text"
              type="text" 
              value={content.header?.nav_cta_text || ""} 
              onChange={(e) => updateField("header", "nav_cta_text", e.target.value)} 
              className={fieldClass("header.nav_cta_text", "w-full px-2.5 py-1.5 border rounded-md text-[13px] outline-none focus:border-violet-400 bg-transparent")} 
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
            <input id="field-header.icon" type="text" value={content.header?.icon || ""} onChange={(e) => updateField("header", "icon", e.target.value)} className="w-full px-2.5 py-1.5 border rounded-md text-[13px] outline-none focus:border-violet-400 bg-transparent" placeholder="cth. Utensils" />
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
              id="field-hero.headline"
              type="text" 
              value={content.hero.headline || ""} 
              onChange={(e) => updateField("hero", "headline", e.target.value)} 
              className={fieldClass("hero.headline", "w-full px-2.5 py-1.5 border rounded-md text-[13px] outline-none focus:border-violet-400 bg-transparent")} 
            />
          </div>
          <div className="space-y-1">
            <label className="flex items-center gap-1 text-[11px] uppercase tracking-wide font-semibold text-slate-400">
              Subheadline {needsAttention("hero.subheadline") && <span className="text-amber-300">⚠️</span>}
            </label>
            <textarea 
              id="field-hero.subheadline"
              rows={2} 
              value={content.hero.subheadline || ""} 
              onChange={(e) => updateField("hero", "subheadline", e.target.value)} 
              className={fieldClass("hero.subheadline", "w-full px-2.5 py-1.5 border rounded-md text-[13px] outline-none focus:border-violet-400 resize-none bg-transparent")} 
            />
          </div>
          <div className="space-y-1">
            <label className="flex items-center gap-1 text-[11px] uppercase tracking-wide font-semibold text-slate-400">
              Teks Tombol CTA {needsAttention("hero.cta_text") && <span className="text-amber-300">⚠️</span>}
            </label>
            <input 
              id="field-hero.cta_text"
              type="text" 
              value={content.hero.cta_text || ""} 
              onChange={(e) => updateField("hero", "cta_text", e.target.value)} 
              className={fieldClass("hero.cta_text", "w-full px-2.5 py-1.5 border rounded-md text-[13px] outline-none focus:border-violet-400 bg-transparent")} 
            />
          </div>
          <LinkTypeInput 
            urlValue={content.hero.cta_url || ""}
            updateUrl={(val) => {
              updateField("hero", "cta_url", val);
              const waNumber = val.replace(/\s+/g, "").match(/(?:wa\.me\/|phone=)([0-9]+)/i)?.[1] || "";
              if (waNumber && (!content.contact?.phone || isPlaceholderValue(content.contact.phone, "phone"))) {
                updateField("contact", "phone", "0" + waNumber.slice(2));
              }
            }}
            needsAttention={needsAttention("hero.cta_url")}
            fieldClass={fieldClass}
            path="hero.cta_url"
            label="Link Tombol CTA"
            defaultWaNumber={content.contact?.phone}
          />
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
              id="field-about.title"
              type="text" 
              value={content.about.title || ""} 
              onChange={(e) => updateField("about", "title", e.target.value)} 
              className={fieldClass("about.title", "w-full px-2.5 py-1.5 border rounded-md text-[13px] outline-none focus:border-violet-400 bg-transparent")} 
            />
          </div>
          <div className="space-y-1">
            <label className="flex items-center gap-1 text-[11px] uppercase tracking-wide font-semibold text-slate-400">
              Deskripsi {needsAttention("about.body") && <span className="text-amber-300">⚠️</span>}
            </label>
            <textarea 
              id="field-about.body"
              rows={3} 
              value={content.about.body || ""} 
              onChange={(e) => updateField("about", "body", e.target.value)} 
              className={fieldClass("about.body", "w-full px-2.5 py-1.5 border rounded-md text-[13px] outline-none focus:border-violet-400 resize-none bg-transparent")} 
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
              id="field-benefits.title"
              type="text" 
              value={content.benefits.title || ""} 
              onChange={(e) => updateField("benefits", "title", e.target.value)} 
              className={fieldClass("benefits.title", "w-full px-2.5 py-1.5 border rounded-md text-[13px] outline-none focus:border-violet-400 bg-transparent")} 
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
              id="field-cta.headline"
              type="text" 
              value={content.cta.headline || ""} 
              onChange={(e) => updateField("cta", "headline", e.target.value)} 
              className={fieldClass("cta.headline", "w-full px-2.5 py-1.5 border rounded-md text-[13px] outline-none focus:border-violet-400 bg-transparent")} 
            />
          </div>
          <div className="space-y-1">
            <label className="flex items-center gap-1 text-[11px] uppercase tracking-wide font-semibold text-slate-400">
              Teks Tombol {needsAttention("cta.button_text") && <span className="text-amber-300">⚠️</span>}
            </label>
            <input 
              id="field-cta.button_text"
              type="text" 
              value={content.cta.button_text || ""} 
              onChange={(e) => updateField("cta", "button_text", e.target.value)} 
              className={fieldClass("cta.button_text", "w-full px-2.5 py-1.5 border rounded-md text-[13px] outline-none focus:border-violet-400 bg-transparent")} 
            />
          </div>
          <LinkTypeInput 
            urlValue={content.cta.button_url || ""}
            updateUrl={(val) => {
              updateField("cta", "button_url", val);
              const waNumber = val.replace(/\s+/g, "").match(/(?:wa\.me\/|phone=)([0-9]+)/i)?.[1] || "";
              if (waNumber && (!content.contact?.phone || isPlaceholderValue(content.contact.phone, "phone"))) {
                updateField("contact", "phone", "0" + waNumber.slice(2));
              }
            }}
            needsAttention={needsAttention("cta.button_url")}
            fieldClass={fieldClass}
            path="cta.button_url"
            label="Link Tombol"
            defaultWaNumber={content.contact?.phone}
          />
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
              id="field-contact.title"
              type="text" 
              value={content.contact.title || ""} 
              onChange={(e) => updateField("contact", "title", e.target.value)} 
              className={fieldClass("contact.title", "w-full px-2.5 py-1.5 border rounded-md text-[13px] outline-none focus:border-violet-400 bg-transparent")} 
            />
          </div>
          <div className="space-y-1">
            <label className="flex items-center gap-1 text-[11px] uppercase tracking-wide font-semibold text-slate-400">
              Alamat {needsAttention("contact.address") && <span className="text-amber-300">⚠️</span>}
            </label>
            <input 
              id="field-contact.address"
              type="text" 
              value={content.contact.address || ""} 
              onChange={(e) => updateField("contact", "address", e.target.value)} 
              className={fieldClass("contact.address", "w-full px-2.5 py-1.5 border rounded-md text-[13px] outline-none focus:border-violet-400 bg-transparent")} 
            />
          </div>
          <div className="space-y-1">
            <label className="flex items-center gap-1 text-[11px] uppercase tracking-wide font-semibold text-slate-400">
              Nomor WhatsApp {needsAttention("contact.phone") && <span className="text-amber-300">⚠️</span>}
            </label>
            <input 
              id="field-contact.phone"
              type="text" 
              value={content.contact.phone || ""} 
              onChange={(e) => {
                const val = e.target.value;
                updateField("contact", "phone", val);
                
                // Keep Hero/CTA buttons in sync if they are currently set as WhatsApp links
                const digits = val.replace(/\D/g, "");
                if (digits) {
                  let formattedDigits = digits;
                  if (formattedDigits.startsWith("0")) {
                    formattedDigits = "62" + formattedDigits.slice(1);
                  }
                  
                  if (/wa\.me|whatsapp\.com/i.test(content.hero?.cta_url || "")) {
                    updateField("hero", "cta_url", `https://wa.me/${formattedDigits}`);
                  }
                  if (/wa\.me|whatsapp\.com/i.test(content.cta?.button_url || "")) {
                    updateField("cta", "button_url", `https://wa.me/${formattedDigits}`);
                  }
                }
              }} 
              className={fieldClass("contact.phone", "w-full px-2.5 py-1.5 border rounded-md text-[13px] outline-none focus:border-violet-400 bg-transparent")} 
            />
          </div>
          <div className="space-y-1">
            <label className="flex items-center gap-1 text-[11px] uppercase tracking-wide font-semibold text-slate-400">
              Email {needsAttention("contact.email") && <span className="text-amber-300">⚠️</span>}
            </label>
            <input 
              id="field-contact.email"
              type="email" 
              value={content.contact.email || ""} 
              onChange={(e) => updateField("contact", "email", e.target.value)} 
              className={fieldClass("contact.email", "w-full px-2.5 py-1.5 border rounded-md text-[13px] outline-none focus:border-violet-400 bg-transparent")} 
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
              id="field-footer.brand_name"
              type="text" 
              value={content.footer?.brand_name || ""} 
              onChange={(e) => updateField("footer", "brand_name", e.target.value)} 
              className="w-full px-2.5 py-1.5 border rounded-md text-[13px] outline-none focus:border-violet-400 bg-transparent" 
            />
          </div>
          <div className="space-y-1">
            <label className="text-[11px] uppercase tracking-wide font-semibold text-slate-400">Tagline</label>
            <input 
              id="field-footer.tagline"
              type="text" 
              value={content.footer?.tagline || ""} 
              onChange={(e) => updateField("footer", "tagline", e.target.value)} 
              className="w-full px-2.5 py-1.5 border rounded-md text-[13px] outline-none focus:border-violet-400 bg-transparent" 
            />
          </div>
          <div className="space-y-1">
            <label className="text-[11px] uppercase tracking-wide font-semibold text-slate-400">Copyright</label>
            <input 
              id="field-footer.copyright_text"
              type="text" 
              value={content.footer?.copyright_text || ""} 
              onChange={(e) => updateField("footer", "copyright_text", e.target.value)} 
              className="w-full px-2.5 py-1.5 border rounded-md text-[13px] outline-none focus:border-violet-400 bg-transparent" 
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
              id="field-seo.title"
              type="text" 
              value={content.seo?.title || ""} 
              onChange={(e) => updateField("seo", "title", e.target.value)} 
              className={fieldClass("seo.title", "w-full px-2.5 py-1.5 border rounded-md text-[13px] outline-none focus:border-violet-400 bg-transparent")} 
            />
          </div>
          <div className="space-y-1">
            <label className="flex items-center gap-1 text-[11px] uppercase tracking-wide font-semibold text-slate-400">
              Meta Description {needsAttention("seo.description") && <span className="text-amber-300">⚠️</span>}
            </label>
            <textarea 
              id="field-seo.description"
              rows={3} 
              value={content.seo?.description || ""} 
              onChange={(e) => updateField("seo", "description", e.target.value)} 
              className={fieldClass("seo.description", "w-full px-2.5 py-1.5 border rounded-md text-[13px] outline-none focus:border-violet-400 resize-none bg-transparent")} 
            />
          </div>
          <FileUpload label="Favicon" value={content.seo?.favicon_url || ""} onChange={(val) => updateField("seo", "favicon_url", val)} placeholder="https://..." accept=".ico,.png,.jpg,.jpeg" maxWidth={128} maxHeight={128} quality={0.9} />
          <FileUpload label="OG Image" value={content.seo?.og_image_url || ""} onChange={(val) => updateField("seo", "og_image_url", val)} placeholder="https://..." maxWidth={1200} maxHeight={630} quality={0.85} />
        </div>
      )}

      {/* MENU FORM */}
      {activeTab === "menu" && (
        <MenuCatalogForm
          sectionKey="menu"
          sectionTitle="Menu"
          itemLabel="item menu"
          hasPrice
          hasBadge={false}
          data={content.menu}
          updateField={updateField}
        />
      )}

      {/* CATALOG FORM */}
      {activeTab === "catalog" && (
        <MenuCatalogForm
          sectionKey="catalog"
          sectionTitle="Katalog Produk"
          itemLabel="produk"
          hasPrice
          hasBadge
          data={content.catalog}
          updateField={updateField}
        />
      )}
    </>
  );
}

// ─── Shared Menu / Catalog Editor ───────────────────────────────────────────
interface MenuCatalogFormProps {
  sectionKey: "menu" | "catalog";
  sectionTitle: string;
  itemLabel: string;
  hasPrice: boolean;
  hasBadge: boolean;
  data: any;
  updateField: (section: string, key: string, val: any) => void;
}

function MenuCatalogForm({ sectionKey, sectionTitle, itemLabel, hasPrice, hasBadge, data, updateField }: MenuCatalogFormProps) {
  const [expandedCat, setExpandedCat] = React.useState<number | null>(0);

  const categories: any[] = data?.categories ?? [];

  const updateCategories = (next: any[]) => updateField(sectionKey, "categories", next);

  const addCategory = () => {
    const next = [...categories, { name: `Kategori ${categories.length + 1}`, items: [] }];
    updateCategories(next);
    setExpandedCat(next.length - 1);
  };

  const removeCategory = (catIdx: number) => {
    updateCategories(categories.filter((_, i) => i !== catIdx));
    setExpandedCat(null);
  };

  const updateCategoryName = (catIdx: number, name: string) => {
    const next = [...categories];
    next[catIdx] = { ...next[catIdx], name };
    updateCategories(next);
  };

  const addItem = (catIdx: number) => {
    const next = [...categories];
    const newItem: any = { name: "", description: "", price: "", image_url: null };
    if (hasBadge) newItem.badge = null;
    next[catIdx] = { ...next[catIdx], items: [...(next[catIdx].items ?? []), newItem] };
    updateCategories(next);
  };

  const removeItem = (catIdx: number, itemIdx: number) => {
    const next = [...categories];
    next[catIdx] = { ...next[catIdx], items: next[catIdx].items.filter((_: any, i: number) => i !== itemIdx) };
    updateCategories(next);
  };

  const updateItem = (catIdx: number, itemIdx: number, field: string, value: any) => {
    const next = [...categories];
    const items = [...(next[catIdx].items ?? [])];
    items[itemIdx] = { ...items[itemIdx], [field]: value };
    next[catIdx] = { ...next[catIdx], items };
    updateCategories(next);
  };

  const inputBase = "w-full px-2.5 py-1.5 border border-white/10 rounded-md text-[13px] outline-none focus:border-violet-400 bg-transparent text-slate-200 placeholder-slate-600";

  return (
    <div className="space-y-4">
      {/* Section title */}
      <div className="space-y-1">
        <label className="text-[11px] uppercase tracking-wide font-semibold text-slate-400">Judul Section</label>
        <input
          type="text"
          value={data?.title ?? ""}
          onChange={(e) => updateField(sectionKey, "title", e.target.value)}
          placeholder={`cth. Menu ${sectionTitle}`}
          className={inputBase}
        />
      </div>

      {/* Categories */}
      {categories.map((cat: any, catIdx: number) => (
        <div key={catIdx} className="border border-white/10 rounded-xl overflow-hidden bg-white/[0.02]">
          {/* Category header */}
          <div className="flex items-center gap-2 px-3 py-2 bg-white/[0.03]">
            <GripVertical className="w-3.5 h-3.5 text-slate-600 flex-shrink-0" />
            <input
              type="text"
              value={cat.name ?? ""}
              onChange={(e) => updateCategoryName(catIdx, e.target.value)}
              placeholder="Nama kategori"
              className="flex-1 bg-transparent text-[13px] font-semibold text-slate-200 outline-none border-none placeholder-slate-600"
            />
            <span className="text-[10px] text-slate-600 flex-shrink-0">{cat.items?.length ?? 0} item</span>
            <button
              type="button"
              onClick={() => setExpandedCat(expandedCat === catIdx ? null : catIdx)}
              className="text-slate-500 hover:text-slate-300 p-0.5 cursor-pointer"
            >
              {expandedCat === catIdx ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
            <button
              type="button"
              onClick={() => removeCategory(catIdx)}
              className="text-red-500/60 hover:text-red-400 p-0.5 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Items */}
          {expandedCat === catIdx && (
            <div className="p-3 space-y-3">
              {(cat.items ?? []).map((item: any, itemIdx: number) => (
                <div key={itemIdx} className="border border-white/8 rounded-lg p-3 space-y-2.5 bg-white/[0.02]">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold text-slate-500">{itemLabel} #{itemIdx + 1}</span>
                    <button type="button" onClick={() => removeItem(catIdx, itemIdx)} className="text-red-500/60 hover:text-red-400 cursor-pointer">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Item image */}
                  <FileUpload
                    label="Foto"
                    value={item.image_url ?? ""}
                    onChange={(val) => updateItem(catIdx, itemIdx, "image_url", val || null)}
                    placeholder="https://..."
                    maxWidth={800}
                    maxHeight={600}
                    quality={0.8}
                  />

                  {/* Name */}
                  <div>
                    <label className="text-[10px] uppercase tracking-wide font-semibold text-slate-500 block mb-1">Nama</label>
                    <input
                      type="text"
                      value={item.name ?? ""}
                      onChange={(e) => updateItem(catIdx, itemIdx, "name", e.target.value)}
                      placeholder={`Nama ${itemLabel}`}
                      className={inputBase}
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="text-[10px] uppercase tracking-wide font-semibold text-slate-500 block mb-1">Deskripsi</label>
                    <textarea
                      rows={2}
                      value={item.description ?? ""}
                      onChange={(e) => updateItem(catIdx, itemIdx, "description", e.target.value)}
                      placeholder="Deskripsi singkat..."
                      className={`${inputBase} resize-none`}
                    />
                  </div>

                  {/* Price + Badge row */}
                  <div className={`grid gap-2 ${hasBadge ? "grid-cols-2" : "grid-cols-1"}`}>
                    {hasPrice && (
                      <div>
                        <label className="text-[10px] uppercase tracking-wide font-semibold text-slate-500 block mb-1">Harga</label>
                        <input
                          type="text"
                          value={item.price ?? ""}
                          onChange={(e) => updateItem(catIdx, itemIdx, "price", e.target.value)}
                          placeholder="cth. Rp 25.000"
                          className={inputBase}
                        />
                      </div>
                    )}
                    {hasBadge && (
                      <div>
                        <label className="text-[10px] uppercase tracking-wide font-semibold text-slate-500 block mb-1">Badge</label>
                        <input
                          type="text"
                          value={item.badge ?? ""}
                          onChange={(e) => updateItem(catIdx, itemIdx, "badge", e.target.value || null)}
                          placeholder="cth. Best Seller"
                          className={inputBase}
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={() => addItem(catIdx)}
                className="w-full text-[12px] py-1.5 border border-dashed border-white/10 rounded-lg text-slate-500 hover:bg-white/5 hover:text-slate-300 flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
              >
                <Plus className="w-3.5 h-3.5" /> Tambah {itemLabel}
              </button>
            </div>
          )}
        </div>
      ))}

      <button
        type="button"
        onClick={addCategory}
        className="w-full text-[12px] py-2 border border-white/10 rounded-xl text-slate-400 hover:bg-white/5 hover:text-slate-200 flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
      >
        <Plus className="w-3.5 h-3.5" /> Tambah Kategori
      </button>
    </div>
  );
}
