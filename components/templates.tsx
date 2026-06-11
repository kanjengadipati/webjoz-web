"use client";

import React, { useState } from "react";
import { 
  Utensils, Calendar, Clock, MapPin, Phone, Mail, Check, 
  ArrowRight, Sparkles, Award, Shield, Zap, ChevronDown, 
  ChevronUp, Star, HelpCircle, Send, Globe, MessageSquare,
  Image as ImageIcon
} from "lucide-react";
import * as LucideIcons from "lucide-react";
interface BenefitItem {
  title: string;
  description: string;
  icon?: string;
  stat?: string;
  stat_label?: string;
}

interface FaqItem {
  question: string;
  answer: string;
}

export interface TemplateProps {
  content: {
    header: {
      brand_name: string;
      nav_cta_text: string;
      icon?: string;
      logo_url?: string;
    };
    hero: {
      headline: string;
      subheadline: string;
      cta_text: string;
      cta_url: string;
      image_url?: string;
      badge_text?: string;
      opening_hours?: string;
      launch_label?: string;
    };
    about: {
      title: string;
      body: string;
      image_url?: string | null;
      icon?: string;
    };
    benefits: {
      title: string;
      items: BenefitItem[];
    };
    faq: {
      title: string;
      items: FaqItem[];
    };
    cta: {
      headline: string;
      button_text: string;
      button_url: string;
    };
    contact: {
      title: string;
      address: string;
      phone: string;
      email: string;
      maps_url?: string | null;
      show_lead_form?: boolean;
    };
    footer?: {
      brand_name?: string;
      tagline?: string;
      copyright_text?: string;
    };
    seo?: {
      title?: string;
      description?: string;
      favicon_url?: string;
      og_image_url?: string;
    };
  };
  onSubmitLead?: (data: { name: string; email: string; phone: string; message: string }) => Promise<void>;
  leadSubmitting?: boolean;
  leadSuccess?: boolean;
  leadError?: string | null;
  activeSection?: string;
  onSelectSection?: (section: string) => void;
  onRegenSection?: (section: string) => void;
  isEditorMode?: boolean;
}

// ==========================================
// Preview Section Wrapper (Editor Mode)
// ==========================================
export const PreviewSectionWrapper: React.FC<{
  section: string;
  activeSection?: string;
  onSelectSection?: (section: string) => void;
  onRegenSection?: (section: string) => void;
  isEditorMode?: boolean;
  children: React.ReactNode;
  label: string;
}> = ({ 
  section, 
  activeSection, 
  onSelectSection, 
  onRegenSection, 
  isEditorMode = false, 
  children,
  label 
}) => {
  if (!isEditorMode) {
    return <>{children}</>;
  }

  const isSelected = activeSection === section;

  return (
    <div 
      id={`section-preview-${section}`}
      onClick={() => onSelectSection?.(section)}
      className={`group relative transition-all duration-200 border ${
        isSelected 
          ? "border-violet-600 bg-violet-500/[0.02] ring-2 ring-violet-500/10 shadow-md" 
          : "border-transparent hover:border-slate-300 hover:bg-slate-500/5"
      }`}
    >
      {/* Label Badge */}
      <div className="absolute top-5 left-5 z-[80] bg-slate-900/80 text-white text-[9px] font-bold tracking-widest px-2.5 py-0.5 rounded-full uppercase select-none pointer-events-none">
        {label}
      </div>

      {/* AI Regen button */}
      <button 
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onRegenSection?.(section);
        }}
        className={`absolute top-5 right-5 z-[80] bg-violet-600 text-white hover:bg-violet-700 text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-md cursor-pointer transition-all active:scale-95 duration-150 ${
          isSelected ? "opacity-100 visible" : "opacity-0 invisible group-hover:opacity-100 group-hover:visible"
        }`}
      >
        <Sparkles className="w-3 h-3 text-white" />
        AI Regen
      </button>

      <div>
        {children}
      </div>
    </div>
  );
};


// ==========================================
// Dynamic Icon Helper
// ==========================================
export const DynamicIcon = ({ name, defaultIcon, className }: { name?: string; defaultIcon: any; className?: string }) => {
  if (name) {
    const IconComponent = (LucideIcons as any)[name];
    if (IconComponent) return <IconComponent className={className} />;
  }
  const Default = defaultIcon;
  return <Default className={className} />;
};

const SeoEditorPreview = ({ seo }: { seo?: TemplateProps["content"]["seo"] }) => (
  <section className="bg-white text-slate-700 px-6 py-10 border-t border-slate-200">
    <div className="max-w-5xl mx-auto space-y-3 text-xs leading-relaxed">
      <div className="rounded-lg border border-cyan-200 bg-cyan-50 px-4 py-3 text-cyan-950">
        <p className="font-bold">SEO tidak muncul sebagai section di website publik.</p>
        <p className="mt-1 text-cyan-900/80">
          Ini adalah metadata untuk mesin pencari dan preview saat link dibagikan, bukan konten visual halaman.
        </p>
      </div>
      <p><span className="font-semibold text-slate-950">Title:</span> {seo?.title || "Belum ada SEO title"}</p>
      <p><span className="font-semibold text-slate-950">Desc:</span> {seo?.description || "Belum ada meta description"}</p>
    </div>
  </section>
);

// ==========================================
// Logo Image with Fallback
// ==========================================
const LogoImage = ({ url, icon, defaultIcon, iconClass, imgClass }: {
  url?: string;
  icon?: string;
  defaultIcon: any;
  iconClass: string;
  imgClass: string;
}) => {
  const [imgError, setImgError] = useState(false);
  if (url && !imgError) {
    return (
      <img
        src={url}
        className={imgClass}
        alt="Logo"
        onError={() => setImgError(true)}
      />
    );
  }
  return <DynamicIcon name={icon} defaultIcon={defaultIcon} className={iconClass} />;
};

// ==========================================
// lead Form Component (Reusable)
// ==========================================
const LeadForm: React.FC<{
  onSubmit: NonNullable<TemplateProps["onSubmitLead"]>;
  submitting: boolean;
  success: boolean;
  error: string | null;
  buttonClass: string;
  inputClass: string;
}> = ({ onSubmit, submitting, success, error, buttonClass, inputClass }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name, email, phone, message });
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-green-50/50 border border-green-200/50 rounded-2xl text-center backdrop-blur-sm animate-fade-in">
        <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4 shadow-sm">
          <Check className="w-6 h-6 animate-bounce" />
        </div>
        <h3 className="text-xl font-bold text-green-900 mb-2">Pesan Terkirim!</h3>
        <p className="text-green-700 text-sm max-w-sm">
          Terima kasih telah menghubungi kami. Tim kami akan segera merespons pesan Anda.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
          {error}
        </div>
      )}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Nama Lengkap</label>
        <input 
          type="text" 
          required 
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="cth. Budi Santoso"
          className={inputClass}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Email</label>
          <input 
            type="email" 
            required 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="cth. budi@email.com"
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Nomor WA</label>
          <input 
            type="tel" 
            required 
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="cth. 08123456789"
            className={inputClass}
          />
        </div>
      </div>
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Pesan Anda</label>
        <textarea 
          required 
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Tulis pesan atau pertanyaan Anda di sini..."
          className={inputClass}
        ></textarea>
      </div>
      <button 
        type="submit" 
        disabled={submitting}
        className={`${buttonClass} w-full py-3 flex items-center justify-center gap-2 cursor-pointer transition-all duration-300 font-medium disabled:opacity-50`}
      >
        {submitting ? "Mengirim..." : (
          <>
            Kirim Pesan
            <Send className="w-4 h-4" />
          </>
        )}
      </button>
    </form>
  );
};

// ==========================================
// 1. TEMPLATE_KULINER01 (Cafe / Restaurant)
// ==========================================
export const TemplateKuliner: React.FC<TemplateProps> = ({ 
  content, onSubmitLead, leadSubmitting = false, leadSuccess = false, leadError = null,
  activeSection, onSelectSection, onRegenSection, isEditorMode = false
}) => {
  const { header, hero, about, benefits, faq, cta, contact, footer, seo } = content;

  return (
    <div className="bg-[#FAF7F2] text-[#2C2620] font-sans selection:bg-amber-100 selection:text-amber-900 overflow-x-hidden min-h-screen">
      {/* Navbar mock */}
      <PreviewSectionWrapper section="header" label="Header" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
        <header className="sticky top-0 z-50 backdrop-blur-md bg-[#FAF7F2]/80 border-b border-[#EADFCB] px-6 py-4 flex items-center justify-between">
          <span className="text-xl font-bold font-serif text-amber-900 tracking-wide flex items-center gap-2">
            <LogoImage
              url={header?.logo_url}
              icon={header?.icon}
              defaultIcon={Utensils}
              iconClass="w-5 h-5 text-amber-700"
              imgClass="h-8 w-auto object-contain"
            />
            {header?.brand_name || "Brand Kami"}
          </span>
          <a href="#contact" className="px-4 py-2 bg-amber-800 text-white rounded-full text-sm font-medium hover:bg-amber-900 transition-all shadow-sm">
            {header?.nav_cta_text || "Hubungi Kami"}
          </a>
        </header>
      </PreviewSectionWrapper>

      {/* Hero Section */}
      <PreviewSectionWrapper section="hero" label="Hero" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
        <section className="relative min-h-[85vh] flex items-center justify-center text-center px-6 py-20 bg-gradient-to-b from-amber-50/50 to-[#FAF7F2] overflow-hidden">
          {hero.image_url && <img src={hero.image_url} className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-multiply" alt="Hero" />}
          <div className="absolute inset-0 bg-[radial-gradient(#E5D5BC_1px,transparent_1px)] [background-size:16px_16px] opacity-40"></div>
          <div className="max-w-4xl relative z-10 space-y-6">
            <span className="px-4 py-1.5 bg-amber-100/80 text-amber-800 rounded-full text-xs font-semibold uppercase tracking-wider inline-flex items-center gap-1.5 shadow-sm border border-amber-200/50">
              <Sparkles className="w-3.5 h-3.5" />
              {hero.badge_text || "Cita Rasa Autentik"}
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold font-serif text-amber-950 leading-tight">
              {hero.headline}
            </h1>
            <p className="text-lg md:text-xl text-[#6D5D50] max-w-2xl mx-auto leading-relaxed">
              {hero.subheadline}
            </p>
            {hero.opening_hours && (
              <p className="inline-flex items-center gap-2 rounded-full border border-amber-200/70 bg-white/70 px-4 py-2 text-sm font-semibold text-amber-900 shadow-sm">
                <Clock className="w-4 h-4 text-amber-700" />
                {hero.opening_hours}
              </p>
            )}
            <div className="pt-4">
              <a 
                href={hero.cta_url} 
                className="px-8 py-4 bg-amber-850 hover:bg-amber-900 text-white rounded-full font-bold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all inline-flex items-center gap-2"
              >
                {hero.cta_text}
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </div>
        </section>
      </PreviewSectionWrapper>

      {/* About Section */}
      <PreviewSectionWrapper section="about" label="Tentang" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
        <section className="px-6 py-20 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center" id="about">
          <div className="space-y-6">
            <span className="text-amber-800 font-bold tracking-wider uppercase text-xs block">Mengenal Kami</span>
            <h2 className="text-3xl md:text-4xl font-bold font-serif text-amber-950">{about.title}</h2>
            <p className="text-[#6D5D50] leading-relaxed whitespace-pre-line text-justify">{about.body}</p>
          </div>
          <div className="relative">
            <div className="absolute -inset-2 bg-gradient-to-tr from-amber-200 to-amber-100 rounded-3xl -rotate-2 opacity-50 shadow-inner"></div>
            <div className="w-full h-80 md:h-[400px] bg-amber-100/80 border-2 border-amber-200/50 rounded-3xl shadow-lg relative z-10 overflow-hidden">
              {about.image_url ? (
                <img src={about.image_url} className="w-full h-full object-cover" alt="About" />
              ) : (
                <div className="w-full h-full flex items-center justify-center p-6 text-center">
                  <div className="space-y-2">
                    <DynamicIcon name={about.icon} defaultIcon={Utensils} className="w-12 h-12 text-amber-700 mx-auto" />
                    <p className="font-serif italic text-amber-900 font-semibold text-lg">Indonesian Gastronomy</p>
                    <p className="text-amber-700/85 text-sm max-w-xs">Menyajikan makanan dengan sentuhan rasa tradisional yang disiapkan sepenuh hati.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </PreviewSectionWrapper>

      {/* Benefits Section */}
      <PreviewSectionWrapper section="benefits" label="Keunggulan" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
        <section className="bg-amber-900/5 px-6 py-20 border-y border-[#EADFCB]">
          <div className="max-w-6xl mx-auto space-y-12">
            <div className="text-center space-y-3">
              <span className="text-amber-800 font-bold tracking-wider uppercase text-xs">Keunggulan</span>
              <h2 className="text-3xl md:text-4xl font-bold font-serif text-amber-950">{benefits.title}</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {benefits.items?.map((item, idx) => (
                <div key={idx} className="bg-white border border-[#EADFCB] hover:border-amber-400 p-8 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 group">
                  <div className="w-12 h-12 bg-amber-100 text-amber-800 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <DynamicIcon name={item.icon} defaultIcon={Star} className="w-5 h-5 fill-amber-500 stroke-amber-600" />
                  </div>
                  <h3 className="text-xl font-bold text-amber-950 mb-3">{item.title}</h3>
                  <p className="text-[#6D5D50] text-sm leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </PreviewSectionWrapper>

      {/* FAQ Section */}
      <PreviewSectionWrapper section="faq" label="FAQ" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
        <section className="px-6 py-20 max-w-4xl mx-auto space-y-12">
          <div className="text-center space-y-2">
            <span className="text-amber-800 font-bold tracking-wider uppercase text-xs">Pertanyaan</span>
            <h2 className="text-3xl font-bold font-serif text-amber-950">{faq.title}</h2>
          </div>
          <div className="space-y-4">
            {faq.items?.map((item, idx) => (
              <FaqAccordion key={idx} item={item} />
            ))}
          </div>
        </section>
      </PreviewSectionWrapper>

      {/* CTA Section */}
      <PreviewSectionWrapper section="cta" label="CTA" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
        <section className="px-6 py-16 max-w-6xl mx-auto">
          <div className="bg-[#FAF7F2] border border-[#EADFCB] p-8 md:p-16 rounded-3xl text-center space-y-6 relative overflow-hidden shadow-sm">
            <div className="absolute inset-0 bg-gradient-to-tr from-amber-50 to-orange-50 opacity-40"></div>
            <div className="relative z-10 max-w-2xl mx-auto space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold font-serif text-amber-950">{cta.headline}</h2>
              <div className="pt-4">
                <a 
                  href={cta.button_url} 
                  className="px-8 py-4 bg-amber-800 hover:bg-amber-900 text-white rounded-full font-bold shadow-md transition-all inline-flex items-center gap-2"
                >
                  {cta.button_text}
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </section>
      </PreviewSectionWrapper>

      {/* Contact Section */}
      <PreviewSectionWrapper section="contact" label="Kontak" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
        <section className="px-6 py-20 bg-[#F4EEE0] border-t border-[#EADFCB]" id="contact">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold font-serif text-amber-950">{contact.title}</h2>
              <div className="space-y-4 text-amber-900">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-amber-700 mt-0.5 flex-shrink-0" />
                  <p>{contact.address}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-amber-700 flex-shrink-0" />
                  <p>{contact.phone}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-amber-700 flex-shrink-0" />
                  <p>{contact.email}</p>
                </div>
              </div>
              {contact.maps_url && (
                <div className="pt-4">
                  <a 
                    href={contact.maps_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-amber-800 underline hover:text-amber-950 inline-flex items-center gap-1.5 font-medium"
                  >
                    <Globe className="w-4 h-4" />
                    Buka Google Maps
                  </a>
                </div>
              )}
            </div>
            {contact.show_lead_form && onSubmitLead && (
              <div className="bg-white p-8 rounded-3xl border border-[#EADFCB] shadow-sm">
                <h3 className="text-lg font-bold font-serif text-amber-950 mb-6">Hubungi Kami / Reservasi</h3>
                <LeadForm 
                  onSubmit={onSubmitLead}
                  submitting={leadSubmitting}
                  success={leadSuccess}
                  error={leadError}
                  buttonClass="bg-amber-800 hover:bg-amber-900 text-white rounded-xl shadow-sm hover:shadow"
                  inputClass="w-full px-4 py-2.5 bg-amber-50/50 border border-[#EADFCB] focus:border-amber-600 focus:ring-1 focus:ring-amber-600 rounded-xl outline-none text-sm transition-all"
                />
              </div>
            )}
          </div>
        </section>
      </PreviewSectionWrapper>

      {/* Footer */}
      <PreviewSectionWrapper section="footer" label="Footer" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
        <footer className="bg-amber-950 text-amber-100/70 text-center py-10 text-xs border-t border-amber-900/30 space-y-1">
          {footer?.brand_name && <p className="text-sm font-bold text-amber-100">{footer.brand_name}</p>}
          {footer?.tagline && <p className="text-amber-100/50">{footer.tagline}</p>}
          <p>{footer?.copyright_text || `© ${new Date().getFullYear()} ${header?.brand_name || 'Bisnis Kami'}. All rights reserved.`}</p>
        </footer>
      </PreviewSectionWrapper>
      {isEditorMode && (
        <PreviewSectionWrapper section="seo" label="SEO" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
          <SeoEditorPreview seo={seo} />
        </PreviewSectionWrapper>
      )}
    </div>
  );
};
// ==========================================
// 2. TEMPLATE_JASA02 (Agency / Consultant)
// ==========================================
export const TemplateJasa: React.FC<TemplateProps> = ({ 
  content, onSubmitLead, leadSubmitting = false, leadSuccess = false, leadError = null,
  activeSection, onSelectSection, onRegenSection, isEditorMode = false
}) => {
  const { header, hero, about, benefits, faq, cta, contact, footer, seo } = content;

  return (
    <div className="bg-slate-50 text-slate-800 font-sans selection:bg-indigo-100 selection:text-indigo-900 overflow-x-hidden min-h-screen">
      {/* Navbar mock */}
      <PreviewSectionWrapper section="header" label="Header" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
        <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-50/80 border-b border-slate-200/80 px-6 py-4 flex items-center justify-between">
          <span className="text-lg font-extrabold text-indigo-950 tracking-wider flex items-center gap-2">
            <LogoImage
              url={header?.logo_url}
              icon={header?.icon}
              defaultIcon={Sparkles}
              iconClass="w-5 h-5 text-indigo-600"
              imgClass="h-8 w-auto object-contain"
            />
            {header?.brand_name || "Brand Kami"}
          </span>
          <a href="#contact" className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-semibold hover:bg-indigo-700 transition-all shadow-sm">
            {header?.nav_cta_text || "Hubungi Kami"}
          </a>
        </header>
      </PreviewSectionWrapper>

      {/* Hero Section */}
      <PreviewSectionWrapper section="hero" label="Hero" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
        <section className="relative min-h-[85vh] flex items-center justify-center px-6 py-20 bg-gradient-to-tr from-slate-50 via-slate-100/50 to-indigo-50/30 overflow-hidden">
          {hero.image_url && <img src={hero.image_url} className="absolute inset-0 w-full h-full object-cover opacity-10 mix-blend-luminosity" alt="Hero" />}
          <div className="max-w-4xl text-center space-y-6 relative z-10">
            <span className="px-4 py-1.5 bg-indigo-50 border border-indigo-200 text-indigo-800 rounded-full text-xs font-semibold inline-flex items-center gap-1.5 shadow-sm">
              <Award className="w-3.5 h-3.5 text-indigo-600" />
              Layanan Terakreditasi
            </span>
            <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight leading-tight">
              {hero.headline}
            </h1>
            <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
              {hero.subheadline}
            </p>
            <div className="pt-4">
              <a 
                href={hero.cta_url} 
                className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all inline-flex items-center gap-2"
              >
                {hero.cta_text}
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </section>
      </PreviewSectionWrapper>

      {/* About Section */}
      <PreviewSectionWrapper section="about" label="Tentang" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
        <section className="px-6 py-24 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center" id="about">
          <div className="relative">
            <div className="absolute -inset-4 bg-indigo-100 rounded-2xl opacity-40 shadow-inner"></div>
            <div className="w-full h-80 md:h-[400px] bg-white border border-slate-200 rounded-2xl shadow-md relative z-10 overflow-hidden">
              {about.image_url ? (
                <img src={about.image_url} className="w-full h-full object-cover" alt="About" />
              ) : (
                <div className="w-full h-full flex items-center justify-center p-8 text-center">
                  <div className="space-y-4">
                    <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mx-auto text-indigo-600 shadow-sm border border-indigo-100">
                      <DynamicIcon name={about.icon} defaultIcon={Shield} className="w-8 h-8" />
                    </div>
                    <p className="font-bold text-slate-900 text-xl">Solusi Terpercaya</p>
                    <p className="text-slate-500 text-sm max-w-xs leading-relaxed">
                      Kami siap memberikan panduan dan eksekusi profesional untuk mendorong kesuksesan bisnis Anda.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="space-y-6">
            <span className="text-indigo-600 font-extrabold tracking-wider uppercase text-xs">Profil</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-955 tracking-tight">{about.title}</h2>
            <p className="text-slate-600 leading-relaxed text-justify whitespace-pre-line">{about.body}</p>
          </div>
        </section>
      </PreviewSectionWrapper>

      {/* Benefits Section */}
      <PreviewSectionWrapper section="benefits" label="Keunggulan" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
        <section className="bg-indigo-950 text-indigo-100 px-6 py-24">
          <div className="max-w-6xl mx-auto space-y-16">
            <div className="text-center space-y-3">
              <span className="text-indigo-400 font-extrabold tracking-wider uppercase text-xs">Mengapa Kami</span>
              <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">{benefits.title}</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {benefits.items?.map((item, idx) => (
                <div key={idx} className="bg-indigo-900/30 border border-indigo-900/50 hover:border-indigo-400 p-8 rounded-2xl transition-all duration-300 group">
                  {item.stat ? (
                    <div className="mb-6">
                      <p className="text-3xl font-black tracking-tight text-white">{item.stat}</p>
                      {item.stat_label && <p className="text-xs font-semibold uppercase tracking-wider text-indigo-300">{item.stat_label}</p>}
                    </div>
                  ) : (
                    <div className="w-12 h-12 bg-indigo-500/10 text-indigo-400 rounded-xl flex items-center justify-center mb-6 group-hover:bg-indigo-500/20 transition-all">
                      <DynamicIcon name={item.icon} defaultIcon={Zap} className="w-5 h-5" />
                    </div>
                  )}
                  <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                  <p className="text-indigo-200/70 text-sm leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </PreviewSectionWrapper>

      {/* FAQ Section */}
      <PreviewSectionWrapper section="faq" label="FAQ" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
        <section className="px-6 py-24 max-w-4xl mx-auto space-y-16">
          <div className="text-center space-y-2">
            <span className="text-indigo-600 font-extrabold tracking-wider uppercase text-xs">Solusi Pertanyaan</span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">{faq.title}</h2>
          </div>
          <div className="space-y-4">
            {faq.items?.map((item, idx) => (
              <FaqAccordion key={idx} item={item} />
            ))}
          </div>
        </section>
      </PreviewSectionWrapper>

      {/* CTA Section */}
      <PreviewSectionWrapper section="cta" label="CTA" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
        <section className="px-6 py-16 max-w-6xl mx-auto">
          <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 text-white p-8 md:p-16 rounded-3xl text-center space-y-6 relative overflow-hidden shadow-lg">
            <div className="relative z-10 max-w-2xl mx-auto space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">{cta.headline}</h2>
              <div className="pt-4">
                <a 
                  href={cta.button_url} 
                  className="px-8 py-4 bg-white hover:bg-slate-50 text-indigo-800 rounded-xl font-bold shadow-md transition-all inline-flex items-center gap-2"
                >
                  {cta.button_text}
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </section>
      </PreviewSectionWrapper>

      {/* Contact Section */}
      <PreviewSectionWrapper section="contact" label="Kontak" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
        <section className="px-6 py-24 bg-slate-100 border-t border-slate-200" id="contact">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div className="space-y-6">
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">{contact.title}</h2>
              <div className="space-y-4 text-slate-600">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                  <p>{contact.address}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-indigo-600 flex-shrink-0" />
                  <p>{contact.phone}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-indigo-600 flex-shrink-0" />
                  <p>{contact.email}</p>
                </div>
              </div>
              {contact.maps_url && (
                <div className="pt-4">
                  <a 
                    href={contact.maps_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-indigo-600 hover:text-indigo-800 font-bold inline-flex items-center gap-1.5"
                  >
                    <Globe className="w-4 h-4" />
                    Buka Peta Lokasi
                  </a>
                </div>
              )}
            </div>
            {contact.show_lead_form && onSubmitLead && (
              <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 mb-6">Kirim Pertanyaan Anda</h3>
                <LeadForm 
                  onSubmit={onSubmitLead}
                  submitting={leadSubmitting}
                  success={leadSuccess}
                  error={leadError}
                  buttonClass="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-sm"
                  inputClass="w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl outline-none text-sm transition-all"
                />
              </div>
            )}
          </div>
        </section>
      </PreviewSectionWrapper>

      {/* Footer */}
      <PreviewSectionWrapper section="footer" label="Footer" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
        <footer className="bg-slate-900 text-slate-400 text-center py-10 text-xs border-t border-slate-200 space-y-1">
          {footer?.brand_name && <p className="text-sm font-bold text-slate-200">{footer.brand_name}</p>}
          {footer?.tagline && <p className="text-slate-500">{footer.tagline}</p>}
          <p>{footer?.copyright_text || `© ${new Date().getFullYear()} ${header?.brand_name || 'Bisnis Kami'}. All rights reserved.`}</p>
        </footer>
      </PreviewSectionWrapper>
      {isEditorMode && (
        <PreviewSectionWrapper section="seo" label="SEO" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
          <SeoEditorPreview seo={seo} />
        </PreviewSectionWrapper>
      )}
    </div>
  );
};
// 3. TEMPLATE_PRODUK03 (Brand / Product)
// ==========================================
export const TemplateProduk: React.FC<TemplateProps> = ({ 
  content, onSubmitLead, leadSubmitting = false, leadSuccess = false, leadError = null,
  activeSection, onSelectSection, onRegenSection, isEditorMode = false
}) => {
  const { header, hero, about, benefits, faq, cta, contact, footer, seo } = content;

  return (
    <div className="bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500/20 selection:text-cyan-200 overflow-x-hidden min-h-screen">
      {/* Navbar mock */}
      <PreviewSectionWrapper section="header" label="Header" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
        <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-950/80 border-b border-slate-800 px-6 py-4 flex items-center justify-between">
          <span className="text-lg font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-400 tracking-wider flex items-center gap-2">
            <LogoImage
              url={header?.logo_url}
              icon={header?.icon}
              defaultIcon={Zap}
              iconClass="w-5 h-5 text-cyan-400 fill-cyan-400/20"
              imgClass="h-8 w-auto object-contain"
            />
            {header?.brand_name || "Brand Kami"}
          </span>
          <a href="#contact" className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-teal-500 text-slate-950 rounded-full text-xs font-bold hover:brightness-110 transition-all shadow-[0_0_15px_rgba(34,211,238,0.25)]">
            {header?.nav_cta_text || "Hubungi Kami"}
          </a>
        </header>
      </PreviewSectionWrapper>

      {/* Hero Section */}
      <PreviewSectionWrapper section="hero" label="Hero" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
        <section className="relative min-h-[90vh] flex items-center justify-center px-6 py-20 overflow-hidden">
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-cyan-500/10 rounded-full filter blur-[120px] opacity-70"></div>
          {hero.image_url && <div className="absolute inset-0 bg-slate-950/80 z-0" />}
          {hero.image_url && <img src={hero.image_url} className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-overlay z-0" alt="Hero" />}
          <div className="max-w-4xl text-center space-y-8 relative z-10">
            <span className="px-4 py-1.5 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 rounded-full text-xs font-semibold inline-flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              {hero.launch_label || "Produk Unggulan Baru"}
            </span>
            <h1 className="text-4xl md:text-7xl font-extrabold tracking-tight leading-none text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-300">
              {hero.headline}
            </h1>
            <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
              {hero.subheadline}
            </p>
            <div className="pt-4">
              <a 
                href={hero.cta_url} 
                className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-teal-500 hover:scale-105 text-slate-950 rounded-full font-bold shadow-lg hover:shadow-cyan-500/25 transition-all inline-flex items-center gap-2"
              >
                {hero.cta_text}
                <ArrowRight className="w-4 h-4 text-slate-950" />
              </a>
            </div>
          </div>
        </section>
      </PreviewSectionWrapper>

      {/* About Section */}
      <PreviewSectionWrapper section="about" label="Tentang" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
        <section className="px-6 py-28 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center" id="about">
          <div className="space-y-6">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-400 font-extrabold tracking-wider uppercase text-xs">Misi Kami</span>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">{about.title}</h2>
            <p className="text-slate-400 leading-relaxed text-justify whitespace-pre-line">{about.body}</p>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-tr from-cyan-500 to-teal-500 rounded-3xl opacity-10 filter blur-xl"></div>
            <div className="w-full h-80 md:h-[400px] bg-slate-900/50 border border-slate-800 rounded-3xl shadow-xl relative z-10 overflow-hidden backdrop-blur-sm">
              {about.image_url ? (
                <img src={about.image_url} className="w-full h-full object-cover" alt="About" />
              ) : (
                <div className="w-full h-full flex items-center justify-center p-8 text-center">
                  <div className="space-y-4">
                    <div className="w-16 h-16 bg-cyan-950 text-cyan-400 rounded-2xl flex items-center justify-center mx-auto border border-cyan-800/50 shadow-[0_0_15px_rgba(6,182,212,0.15)]">
                      <DynamicIcon name={about.icon} defaultIcon={Globe} className="w-8 h-8" />
                    </div>
                    <p className="font-bold text-white text-xl">Inovasi Global</p>
                    <p className="text-slate-500 text-sm max-w-xs leading-relaxed">
                      Kami membangun produk berkualitas tinggi dengan riset mendalam demi memberikan pengalaman terbaik.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </PreviewSectionWrapper>

      {/* Benefits Section */}
      <PreviewSectionWrapper section="benefits" label="Keunggulan" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
        <section className="bg-slate-900/30 border-y border-slate-900 px-6 py-28">
          <div className="max-w-6xl mx-auto space-y-16">
            <div className="text-center space-y-3">
              <span className="text-cyan-400 font-extrabold tracking-wider uppercase text-xs">Teknologi</span>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">{benefits.title}</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {benefits.items?.map((item, idx) => (
                <div key={idx} className="bg-slate-900 border border-slate-800 hover:border-cyan-500 p-8 rounded-3xl transition-all duration-300 group">
                  <div className="w-12 h-12 bg-cyan-950 text-cyan-400 rounded-2xl flex items-center justify-center mb-6 border border-cyan-800/40">
                    <DynamicIcon name={item.icon} defaultIcon={Check} className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </PreviewSectionWrapper>

      {/* FAQ Section */}
      <PreviewSectionWrapper section="faq" label="FAQ" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
        <section className="px-6 py-28 max-w-4xl mx-auto space-y-16">
          <div className="text-center space-y-2">
            <span className="text-cyan-400 font-extrabold tracking-wider uppercase text-xs">Pusat Bantuan</span>
            <h2 className="text-3xl font-extrabold tracking-tight">{faq.title}</h2>
          </div>
          <div className="space-y-4">
            {faq.items?.map((item, idx) => (
              <FaqAccordion key={idx} item={item} isDark={true} />
            ))}
          </div>
        </section>
      </PreviewSectionWrapper>

      {/* CTA Section */}
      <PreviewSectionWrapper section="cta" label="CTA" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
        <section className="px-6 py-16 max-w-6xl mx-auto">
          <div className="relative bg-slate-900 border border-slate-800 p-8 md:p-16 rounded-3xl text-center overflow-hidden">
            <div className="absolute top-0 right-0 w-[400px] h-[200px] bg-cyan-500/5 rounded-full filter blur-[100px]"></div>
            <div className="relative z-10 max-w-2xl mx-auto space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white">{cta.headline}</h2>
              <div className="pt-4">
                <a 
                  href={cta.button_url} 
                  className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-teal-500 hover:brightness-110 text-slate-950 rounded-full font-bold shadow-lg transition-all inline-flex items-center gap-2"
                >
                  {cta.button_text}
                  <ArrowRight className="w-4 h-4 text-slate-950" />
                </a>
              </div>
            </div>
          </div>
        </section>
      </PreviewSectionWrapper>

      {/* Contact Section */}
      <PreviewSectionWrapper section="contact" label="Kontak" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
        <section className="px-6 py-28 bg-slate-955 border-t border-slate-900" id="contact">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div className="space-y-6">
              <h2 className="text-3xl font-extrabold tracking-tight">{contact.title}</h2>
              <div className="space-y-4 text-slate-400">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                  <p>{contact.address}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-cyan-400 flex-shrink-0" />
                  <p>{contact.phone}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-cyan-400 flex-shrink-0" />
                  <p>{contact.email}</p>
                </div>
              </div>
              {contact.maps_url && (
                <div className="pt-4">
                  <a 
                    href={contact.maps_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-cyan-400 hover:text-cyan-300 font-bold inline-flex items-center gap-1.5"
                  >
                    <Globe className="w-4 h-4" />
                    Buka Lokasi Kantor
                  </a>
                </div>
              )}
            </div>
            {contact.show_lead_form && onSubmitLead && (
              <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 shadow-xl backdrop-blur-sm">
                <h3 className="text-lg font-bold text-white mb-6">Hubungi Kami Langsung</h3>
                <LeadForm 
                  onSubmit={onSubmitLead}
                  submitting={leadSubmitting}
                  success={leadSuccess}
                  error={leadError}
                  buttonClass="bg-gradient-to-r from-cyan-500 to-teal-500 text-slate-955 rounded-xl"
                  inputClass="w-full px-4 py-2.5 bg-slate-950/50 border border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 rounded-xl outline-none text-sm text-slate-100 transition-all"
                />
              </div>
            )}
          </div>
        </section>
      </PreviewSectionWrapper>

      {/* Footer */}
      <PreviewSectionWrapper section="footer" label="Footer" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
        <footer className="bg-slate-950 text-slate-650 text-center py-10 text-xs border-t border-slate-900 space-y-1">
          {footer?.brand_name && <p className="text-sm font-bold text-slate-400">{footer.brand_name}</p>}
          {footer?.tagline && <p className="text-slate-650">{footer.tagline}</p>}
          <p>{footer?.copyright_text || `© ${new Date().getFullYear()} ${header?.brand_name || 'Bisnis Kami'}. All rights reserved.`}</p>
        </footer>
      </PreviewSectionWrapper>
      {isEditorMode && (
        <PreviewSectionWrapper section="seo" label="SEO" activeSection={activeSection} onSelectSection={onSelectSection} onRegenSection={onRegenSection} isEditorMode={isEditorMode}>
          <SeoEditorPreview seo={seo} />
        </PreviewSectionWrapper>
      )}
    </div>
  );
};

// ==========================================
// FAQ Accordion Helper Component
// ==========================================
const FaqAccordion: React.FC<{ item: FaqItem; isDark?: boolean }> = ({ item, isDark = false }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div 
      className={`border rounded-2xl transition-all overflow-hidden ${
        isDark 
          ? "border-slate-800 bg-slate-900/40 hover:bg-slate-900/60" 
          : "border-[#EADFCB] bg-[#FAF7F2]/40 hover:bg-white"
      }`}
    >
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between font-bold text-left cursor-pointer select-none"
      >
        <span className={isDark ? "text-white text-sm md:text-base" : "text-amber-950 text-sm md:text-base"}>
          {item.question}
        </span>
        {isOpen ? (
          <ChevronUp className={`w-5 h-5 flex-shrink-0 ${isDark ? "text-cyan-400" : "text-amber-800"}`} />
        ) : (
          <ChevronDown className={`w-5 h-5 flex-shrink-0 ${isDark ? "text-slate-500" : "text-amber-600"}`} />
        )}
      </button>
      {isOpen && (
        <div className={`px-6 pb-5 pt-1 text-sm leading-relaxed border-t ${
          isDark 
            ? "text-slate-400 border-slate-800 bg-slate-950/20" 
            : "text-[#6D5D50] border-[#EADFCB]/50 bg-amber-50/10"
        }`}>
          {item.answer}
        </div>
      )}
    </div>
  );
};
