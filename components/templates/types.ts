export interface TestimonialItem {
  quote: string;
  name: string;
  role: string;
  avatar_initials: string;
  avatar_color: string;
  company?: string | null;
  logo_url?: string | null;
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
  category?: string | null;
}

export interface ImageCredit {
  name: string;
  url: string;
}

export interface MenuItem {
  name: string;
  description?: string;
  price?: string;
  image_url?: string | null;
  image_credit?: ImageCredit | null;
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
  image_credit?: ImageCredit | null;
}

export interface CatalogCategory {
  name: string;
  items: CatalogItem[];
}

export interface GalleryItem {
  image_url: string;
  caption?: string;
  alt_text?: string;
  image_credit?: ImageCredit | null;
}

export type GalleryLayout = "grid" | "masonry" | "carousel";

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
    heading_style?: string;
    heading_transform?: string;
    heading_tracking?: string;
  };
  layout?: {
    hero_style?: "full-bleed" | "split" | "centered" | "minimal" | "minimalist-elegant" | "tech-saas" | "neo-brutalist" | "bento-grid" | "split-editorial" | "natural-organic";
    section_spacing?: "compact" | "normal" | "relaxed";
    corner_radius?: "sharp" | "soft" | "rounded";
    section_variants?: {
      about?: "classic" | "split-image" | "stat-heavy" | "timeline" | "team-grid";
      benefits?: "grid" | "stat-grid" | "checklist" | "comparison-table";
      testimonials?: "carousel" | "compact" | "grid" | "logo-wall" | "featured-spotlight";
      cta?: "banner" | "card" | "centered" | "split-image";
      faq?: "accordion" | "simple" | "columns" | "sidebar-category";
      gallery?: "grid" | "masonry" | "carousel";
      menu?: "grid" | "compact" | "cards" | "text-list" | "compact-list" | "tabs-by-category" | "accordion-by-category" | "bento-photo-grid" | "visual-showcase-hero" | "sidebar-scrollspy-photo";
      catalog?: "grid" | "compact" | "cards" | "grid-dense" | "showcase-featured" | "tabs-by-category" | "editorial-grid" | "masonry-flow" | "instagram-square-grid" | "split-hero-catalog" | "neo-brutalist-matrix" | "horizontal-swipe-carousel";
      contact?: "classic-split" | "minimal-centered" | "overlay-map" | "bento-grid" | "dark-split";
      header?: "left-logo-inline-nav" | "centered-logo" | "transparent-overlay";
      footer?: "minimal-band" | "columns-with-social" | "newsletter-cta";
    };
    section_order?: string[];
    hidden_sections?: string[];
    nav_hidden_sections?: string[];
    engine?: "default" | "storytelling" | "showcase" | "minimal";
    /**
     * Controls which floating action button appears on the live site.
     * "none"         → no floating button
     * "whatsapp"     → simple green WA button (requires contact.phone)
     * "chat_bubble"  → premium interactive WA chat widget (requires pro plan + contact.phone)
     * "contact_link" → scroll-to-contact button (no phone required)
     */
    floating_button?: "none" | "whatsapp" | "chat_bubble" | "contact_link";
  };
  mood?: string;
  theme_mode?: 'light' | 'dark';
}

export interface ContentSection {
  type: string;
  variant?: string;
  data: Record<string, any>;
}

export interface TemplateProps {
  content: {
    sections?: ContentSection[];
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
      image_credit?: ImageCredit | null;
      eyebrow?: string;
      cta_secondary_text?: string;
      cta_secondary_url?: string;
      badge_text?: string;
      opening_hours?: string;
      launch_label?: string;
      background_color?: string;
    };
    about: {
      title: string;
      body: string;
      image_url?: string | null;
      image_credit?: ImageCredit | null;
      icon?: string;
      eyebrow?: string;
      textAlign?: "left" | "center" | "right";
      highlight_stat_1?: { value: string; label: string };
      highlight_stat_2?: { value: string; label: string };
      highlight_stat_3?: { value: string; label: string };
      milestones?: Array<{ year: string; title: string; description?: string }>;
      team_members?: Array<{ name: string; role: string; photo_url?: string | null }>;
    };
    benefits: {
      title: string;
      items: BenefitItem[];
      eyebrow?: string;
      subtitle?: string;
      textAlign?: "left" | "center" | "right";
      comparison?: {
        column_a_label: string;
        column_b_label: string;
        rows: Array<{ label: string; value_a: string; value_b: string }>;
      };
    };
    testimonials?: {
      title: string;
      eyebrow?: string;
      items: TestimonialItem[];
      variant?: string;
      subtitle?: string;
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
      image_url?: string | null;
    };
    contact: {
      title: string;
      address: string;
      phone: string;
      email: string;
      maps_url?: string | null;
      align?: "left" | "center" | "right" | null;
      show_lead_form?: boolean;
      show_map?: boolean;
      map_tile_style?: string;
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
    gallery?: {
      title: string;
      eyebrow?: string;
      items: GalleryItem[];
      layout?: "grid" | "masonry" | "carousel";
      autoplay_speed?: number;
      show_dots?: boolean;
      show_arrows?: boolean;
    };
    seo?: {
      title?: string;
      description?: string;
      favicon_url?: string;
      og_image_url?: string;
      keywords?: string[];
      og_type?: string;
      og_locale?: string;
      og_site_name?: string;
      twitter_card?: string;
      robots?: string;
      canonical_path?: string;
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
  /**
   * Apakah user/tenant ini memiliki plan premium/pro.
   * true  → fitur premium aktif (contoh: WA Chat Widget interaktif)
   * false → fitur standar saja (contoh: simple floating WA button)
   * Belum diwire dari plan backend — menyusul. Default: false.
   */
  isPremium?: boolean;
}
