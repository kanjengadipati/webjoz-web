export interface TestimonialItem {
  quote: string;
  name: string;
  role: string;
  avatar_initials: string;
  avatar_color: string;
}

export interface BenefitItem {
  title: string;
  description: string;
  icon?: string;
  stat?: string;
  stat_label?: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface MenuItem {
  name: string;
  description?: string;
  price?: string;
  image_url?: string | null;
}

export interface MenuCategory {
  name: string;
  items: MenuItem[];
}

export interface CatalogItem {
  name: string;
  description?: string;
  price?: string;
  badge?: string | null;
  image_url?: string | null;
}

export interface CatalogCategory {
  name: string;
  items: CatalogItem[];
}

export interface DesignToken {
  palette?: {
    primary?: string;
    accent?: string;
    background?: string;
    surface?: string;
    text?: string;
  };
  typography?: {
    heading_font?: string;
    body_font?: string;
    heading_weight?: string;
    heading_size_hero?: string;
  };
  layout?: {
    hero_style?: "full-bleed" | "split" | "centered" | "minimal";
    section_spacing?: "compact" | "normal" | "relaxed";
    corner_radius?: "sharp" | "soft" | "rounded";
    section_order?: string[];
    hidden_sections?: string[];
  };
  mood?: string;
}

export interface TemplateProps {
  content: {
    header: {
      brand_name: string;
      nav_cta_text: string;
      icon?: string;
      logo_url?: string;
      tagline?: string;
    };
    hero: {
      headline: string;
      subheadline: string;
      cta_text: string;
      cta_url: string;
      image_url?: string;
      eyebrow?: string;
      cta_secondary_text?: string;
      badge_text?: string;
      opening_hours?: string;
      launch_label?: string;
    };
    about: {
      title: string;
      body: string;
      image_url?: string | null;
      icon?: string;
      eyebrow?: string;
      highlight_stat_1?: { value: string; label: string };
      highlight_stat_2?: { value: string; label: string };
      highlight_stat_3?: { value: string; label: string };
    };
    benefits: {
      title: string;
      items: BenefitItem[];
      eyebrow?: string;
      subtitle?: string;
    };
    testimonials?: {
      title: string;
      eyebrow?: string;
      items: TestimonialItem[];
    };
    faq: {
      title: string;
      items: FaqItem[];
    };
    cta: {
      headline: string;
      button_text: string;
      button_url: string;
      eyebrow?: string;
      subheadline?: string;
      trust_signal?: string;
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
      social_links?: Array<{ platform: string; url: string }>;
    };
    menu?: {
      title: string;
      eyebrow?: string;
      subtitle?: string;
      categories: MenuCategory[];
    };
    catalog?: {
      title: string;
      eyebrow?: string;
      subtitle?: string;
      categories: CatalogCategory[];
    };
    seo?: {
      title?: string;
      description?: string;
      favicon_url?: string;
      og_image_url?: string;
    };
  };
  design_token?: DesignToken | null;
  onSubmitLead?: (data: { name: string; email: string; phone: string; message: string }) => Promise<void>;
  leadSubmitting?: boolean;
  leadSuccess?: boolean;
  leadError?: string | null;
  activeSection?: string;
  onSelectSection?: (section: string) => void;
  onRegenSection?: (section: string) => void;
  isEditorMode?: boolean;
  /**
   * Daftar nama section yang sudah diterima dari SSE stream.
   * undefined → bukan mode streaming, semua section langsung dianggap "sudah ada"
   * (dipakai di editor/saved-site, bukan saat live generate).
   * Saat ada array, section yang TIDAK ada di sini belum ditampilkan,
   * supaya efek "dibangun bertahap" terlihat sesuai urutan SSE dari backend.
   */
  arrivedSections?: string[];
}
