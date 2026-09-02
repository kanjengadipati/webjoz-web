export interface TestimonialItem {
  quote: string;
  name: string;
  role: string;
  avatar_initials: string;
  avatar_color: string;
  company?: string | null;
  logo_url?: string | null;
  /** Set when imported from Google Reviews or manual copy */
  avatar_url?: string | null;
  rating?: number | null;
  source?: "google" | "manual" | null;
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

export interface ItemVariantOption {
  id: string;
  name: string;
  price_delta?: number;
  price_display?: string;
}

export interface ItemVariantGroup {
  id: string;
  name: string;
  type: "single" | "multiple";
  required?: boolean;
  options: ItemVariantOption[];
}

export interface CatalogEntryBase {
  id?: string;
  name: string;
  description?: string;
  price?: string;
  price_display?: string;
  price_amount?: number | null;
  image_url?: string | null;
  image_urls?: string[] | null;
  image_credit?: ImageCredit | null;
  badge?: string | null;
  is_available?: boolean;
  sort_order?: number;
  variant_groups?: ItemVariantGroup[] | null;
}

export interface MenuItem extends CatalogEntryBase {
  tags?: string[] | null;
  delivery_platforms?: { name: string; url: string }[] | null;
}

export interface MenuCategory {
  id?: string;
  name: string;
  sort_order?: number;
  items: MenuItem[];
}

export interface CatalogItem extends CatalogEntryBase {
  features?: string[] | null;
  capacity?: number | null;
}

export interface CatalogCategory {
  id?: string;
  name: string;
  sort_order?: number;
  items: CatalogItem[];
}

export interface GalleryItem {
  image_url?: string | null;
  video_url?: string | null;
  caption?: string;
  alt_text?: string;
  image_credit?: ImageCredit | null;
}

export interface StatItem {
  value: string;
  label: string;
  description?: string;
  icon?: string;
}

export interface PartnerItem {
  name: string;
  logo_url?: string | null;
  url?: string | null;
  category?: string | null;
}

export interface PricingPlan {
  name: string;
  price: string;
  period?: string;
  description?: string;
  features: string[];
  cta_text?: string;
  cta_url?: string;
  is_featured?: boolean;
  badge?: string | null;
}

export type GalleryLayout = "grid" | "masonry" | "carousel";
export type BlogLayout = "grid" | "list" | "featured" | "minimal";

export interface DesignToken {
  palette?: {
    primary?: string;
    accent?: string;
    background?: string;
    surface?: string;
    text?: string;
  };
  /** Optional separate palette for dark mode. When present and theme_mode === 'dark',
   *  buildCssVars uses these colors directly instead of swapping light palette. */
  dark_palette?: {
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
      benefits?: "grid" | "stat-grid" | "checklist" | "comparison-table" | "featured-grid" | "icon-row" | "bento-grid";
      testimonials?: "carousel" | "compact" | "grid" | "logo-wall" | "featured-spotlight" | "google-reviews";
      cta?: "banner" | "card" | "centered" | "split-image";
      faq?: "accordion" | "simple" | "columns" | "sidebar-category" | "two-column-grid" | "chat-bubble-style";
      gallery?: "grid" | "masonry" | "carousel" | "lightbox-story";
      menu?: "grid" | "compact" | "cards" | "text-list" | "compact-list" | "tabs-by-category" | "accordion-by-category" | "bento-photo-grid" | "visual-showcase-hero" | "sidebar-scrollspy-photo";
      catalog?: "grid" | "compact" | "cards" | "grid-dense" | "showcase-featured" | "tabs-by-category" | "editorial-grid" | "masonry-flow" | "instagram-square-grid" | "split-hero-catalog" | "neo-brutalist-matrix" | "horizontal-swipe-carousel";
      stats?: "counter-row" | "card-grid" | "minimal-split";
      partners?: "logo-wall" | "marquee" | "pill-grid";
      pricing?: "cards" | "horizontal-rows" | "comparison-table";
      contact?: "classic-split" | "whatsapp-direct" | "minimal-centered" | "overlay-map" | "bento-grid" | "dark-split";
      header?: "left-logo-inline-nav" | "centered-logo" | "transparent-overlay" | "logo-with-cta-button" | "stacked-logo-tagline";
      footer?: "minimal-band" | "columns-with-social" | "columns-with-nav" | "dark-contrast-band";
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
    blog_layout?: BlogLayout;
    blog?: {
      posts: Array<{
        id: number;
        title: string;
        slug: string;
        excerpt: string;
        content_html: string;
        cover_image_url?: string;
        published_at: string;
        created_at: string;
      }>;
    };
    header: {
      brand_name: string;
      nav_cta_text: string;
      nav_cta_hidden?: boolean;
      nav_cta_href?: string;
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
      eyebrow?: string;
      subtitle?: string;
      form_title?: string;
      button_text?: string;
      secondary_form_title?: string;
      whatsapp_card_title?: string;
      show_whatsapp_card?: boolean;
      address: string;
      phone: string;
      email: string;
      maps_url?: string | null;
      opening_hours?: string;
      align?: "left" | "center" | "right" | null;
      form_position?: "right" | "left" | "stack" | null;
      map_layout?: "inline" | "full" | null;
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
      layout?: "grid" | "masonry" | "carousel" | "lightbox-story";
      autoplay_speed?: number;
      show_dots?: boolean;
      show_arrows?: boolean;
    };
    stats?: {
      title?: string;
      eyebrow?: string;
      subtitle?: string;
      items: StatItem[];
    };
    partners?: {
      title?: string;
      eyebrow?: string;
      subtitle?: string;
      items: PartnerItem[];
    };
    pricing?: {
      title: string;
      eyebrow?: string;
      subtitle?: string;
      plans: PricingPlan[];
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
  onUpdateField?: (section: string, key: string, value: any) => void;
  collapseSheetForInlineEdit?: () => void;
  onEditingStateChange?: (isEditing: boolean) => void;
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
  /**
   * Hanya diisi ketika template dirender dalam dashboard editor.
   * Dipakai untuk meng-resolve URL /preview/[id]/blog.
   */
  editorSiteId?: number | null;
  /** Bahasa situs (id | en) untuk static chrome rendering */
  language?: "id" | "en";
}
