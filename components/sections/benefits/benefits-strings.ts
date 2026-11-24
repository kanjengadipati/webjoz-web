/**
 * benefits-strings.ts
 *
 * Typed dictionary untuk string statis UI, placeholder, dan fallback label
 * pada seluruh varian section benefits.
 *
 * Pola penggunaan:
 *   import { benefitsStrings } from "./benefits-strings";
 *   const L = benefitsStrings(language);
 *   <InlineText placeholder={L.descriptionPlaceholder} ... />
 */

export interface BenefitsStaticStrings {
  // Eyebrow fallbacks & placeholders
  eyebrowBenefits: string;
  eyebrowComparison: string;
  eyebrowNumbers: string;
  eyebrowSignature: string;
  eyebrowSolutions: string;
  eyebrowHowItWorks: string;

  // Title placeholders
  titlePlaceholder: string;
  titleComparison: string;
  titleHowItWorks: string;
  titleSplitFeature: string;
  titleAlternating: string;
  titleBigStats: string;

  // Subtitle placeholders
  subtitlePlaceholder: string;
  subtitleComparison: string;
  subtitleHowItWorks: string;
  subtitleSplitFeature: string;
  subtitleAlternating: string;
  subtitleBigStats: string;

  // Item placeholders
  itemTitlePlaceholder: string;
  itemDescriptionPlaceholder: string;
  statLabelPlaceholder: string;
  statPlaceholder: string;
  stepActionPlaceholder: string;
  stepDescriptionPlaceholder: string;
  pointPlaceholder: string;
  notePlaceholder: string;

  // Comparison table specific
  featureLabel: string;
  columnUs: string;
  columnOthers: string;
  recommendedBadge: string;
  comparisonRowLabel: string;
  noComparisonRows: string;
  addComparisonRow: string;
  toggleValueTitle: string;
  deleteRowTitle: string;

  // Action labels & buttons
  primaryFeatureBadge: string;
  learnMoreCta: string;
  addBenefit: string;
  addSupportingPoint: string;
  addAlternatingFeature: string;
  addStatistic: string;
  addStep: string;
  deleteItemTitle: string;
  deletePointTitle: string;
  deleteStepTitle: string;
  deleteMetricTitle: string;

  // Trust bar specific
  trustBarDefaultTitle: string;
  trustBarTitlePlaceholder: string;
  trustBarSubtitlePlaceholder: string;
  trustBarItemTitlePlaceholder: string;
  trustBarItemDescPlaceholder: string;
  trustBarAddTrustItem: string;
}

const ID: BenefitsStaticStrings = {
  eyebrowBenefits: "Keunggulan",
  eyebrowComparison: "Perbandingan",
  eyebrowNumbers: "Bukti & Dampak",
  eyebrowSignature: "Fitur Unggulan",
  eyebrowSolutions: "Solusi Lengkap",
  eyebrowHowItWorks: "Cara Kerja",

  titlePlaceholder: "Keunggulan Kami",
  titleComparison: "Mengapa Memilih Kami",
  titleHowItWorks: "Judul Cara Kerja...",
  titleSplitFeature: "Solusi cerdas untuk mencapai tujuan Anda",
  titleAlternating: "Dirancang untuk Pertumbuhan Anda",
  titleBigStats: "Dampak Nyata yang Terukur",

  subtitlePlaceholder: "Alasan utama mengapa Anda harus memilih kami",
  subtitleComparison: "Perbandingan transparan dengan yang lain",
  subtitleHowItWorks: "Jelaskan langkah-langkah mudahnya...",
  subtitleSplitFeature: "Penjelasan lengkap bagaimana keunggulan ini mempermudah dan memberi nilai tambah bagi Anda...",
  subtitleAlternating: "Semua yang Anda butuhkan untuk berkembang dengan mudah dan terpercaya",
  subtitleBigStats: "Metrik dan data nyata dari kepuasan serta keberhasilan mitra kami",

  itemTitlePlaceholder: "Judul keunggulan...",
  itemDescriptionPlaceholder: "Deskripsi keunggulan...",
  statLabelPlaceholder: "Label Metrik",
  statPlaceholder: "100%",
  stepActionPlaceholder: "Nama langkah...",
  stepDescriptionPlaceholder: "Penjelasan langkah...",
  pointPlaceholder: "Poin...",
  notePlaceholder: "Catatan singkat...",

  featureLabel: "Fitur & Keunggulan",
  columnUs: "Kami",
  columnOthers: "Lainnya",
  recommendedBadge: "Pilihan Terbaik",
  comparisonRowLabel: "Nama fitur/keunggulan...",
  noComparisonRows: "Belum ada baris perbandingan.",
  addComparisonRow: "Tambah Baris Perbandingan",
  toggleValueTitle: "Klik untuk ganti nilai",
  deleteRowTitle: "Hapus baris",

  primaryFeatureBadge: "Keunggulan Utama",
  learnMoreCta: "Pelajari Lebih Lanjut",
  addBenefit: "Tambah Keunggulan",
  addSupportingPoint: "Tambah poin pendukung",
  addAlternatingFeature: "Tambah Fitur Bergantian",
  addStatistic: "Tambah Statistik",
  addStep: "Tambah Langkah",
  deleteItemTitle: "Hapus item",
  deletePointTitle: "Hapus poin",
  deleteStepTitle: "Hapus langkah",
  deleteMetricTitle: "Hapus metrik",

  trustBarDefaultTitle: "Jaminan Belanja Aman & Nyaman",
  trustBarTitlePlaceholder: "Judul Jaminan Belanja...",
  trustBarSubtitlePlaceholder: "Subjudul ringkas...",
  trustBarItemTitlePlaceholder: "Poin Kepercayaan...",
  trustBarItemDescPlaceholder: "Deskripsi jaminan ringkas...",
  trustBarAddTrustItem: "Tambah Jaminan",
};

const EN: BenefitsStaticStrings = {
  eyebrowBenefits: "Benefits",
  eyebrowComparison: "Comparison",
  eyebrowNumbers: "Numbers & Impact",
  eyebrowSignature: "Signature Feature",
  eyebrowSolutions: "Key Solutions",
  eyebrowHowItWorks: "How It Works",

  titlePlaceholder: "Our Benefits",
  titleComparison: "Why Choose Us",
  titleHowItWorks: "How It Works Title...",
  titleSplitFeature: "The smarter way to achieve your goals",
  titleAlternating: "Designed for Your Growth",
  titleBigStats: "Impact That Speaks for Itself",

  subtitlePlaceholder: "Key reasons to choose our services",
  subtitleComparison: "Clear comparison with others",
  subtitleHowItWorks: "Describe the simple steps...",
  subtitleSplitFeature: "Comprehensive explanation of how this benefit transforms your experience...",
  subtitleAlternating: "Everything you need to scale with confidence and ease",
  subtitleBigStats: "Real, verifiable metrics from our trusted partnerships and clients",

  itemTitlePlaceholder: "Benefit title...",
  itemDescriptionPlaceholder: "Benefit description...",
  statLabelPlaceholder: "Metric Label",
  statPlaceholder: "100%",
  stepActionPlaceholder: "Step name...",
  stepDescriptionPlaceholder: "Step description...",
  pointPlaceholder: "Point...",
  notePlaceholder: "Short note...",

  featureLabel: "Feature / Benefit",
  columnUs: "Us",
  columnOthers: "Others",
  recommendedBadge: "Recommended",
  comparisonRowLabel: "Row label...",
  noComparisonRows: "No comparison rows yet.",
  addComparisonRow: "Add Comparison Row",
  toggleValueTitle: "Click to toggle",
  deleteRowTitle: "Delete row",

  primaryFeatureBadge: "Primary Feature",
  learnMoreCta: "Learn More",
  addBenefit: "Add benefit",
  addSupportingPoint: "Add supporting point",
  addAlternatingFeature: "Add alternating feature",
  addStatistic: "Add statistic",
  addStep: "Add step",
  deleteItemTitle: "Delete item",
  deletePointTitle: "Delete point",
  deleteStepTitle: "Delete step",
  deleteMetricTitle: "Delete metric",

  trustBarDefaultTitle: "Guaranteed Peace of Mind",
  trustBarTitlePlaceholder: "Section Title...",
  trustBarSubtitlePlaceholder: "Short subtitle...",
  trustBarItemTitlePlaceholder: "Trust Point...",
  trustBarItemDescPlaceholder: "Short guarantee detail...",
  trustBarAddTrustItem: "Add Trust Item",
};

export function benefitsStrings(language?: "id" | "en"): BenefitsStaticStrings {
  return language === "en" ? EN : ID;
}
