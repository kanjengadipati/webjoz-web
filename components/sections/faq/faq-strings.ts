/**
 * faq-strings.ts
 *
 * Typed dictionary untuk string statis UI, label, dan placeholder pada seluruh varian FAQ.
 * Pola:
 *   import { faqStrings } from "./faq-strings";
 *   const L = faqStrings(language);
 */

export interface FaqStaticStrings {
  eyebrow: string;
  defaultTitle: string;
  supportHelpText: string;
  supportActionText: string;
  addQuestion: string;
  newQuestion: string;
  newAnswer: string;
  userLabel: string;
  supportLabel: string;
  allCategory: string;
  deleteQuestionTitle: string;
  searchPlaceholder: string;
  noQuestionsFound: string;
  popularLabel: string;
  clearSearch: string;
}

const ID: FaqStaticStrings = {
  eyebrow: "Pertanyaan",
  defaultTitle: "Pertanyaan yang Sering Diajukan",
  supportHelpText: "Masih punya pertanyaan yang belum terjawab?",
  supportActionText: "Hubungi Kami Langsung",
  addQuestion: "Tambah Pertanyaan",
  newQuestion: "Pertanyaan baru di sini?",
  newAnswer: "Jawaban pertanyaan Anda di sini.",
  userLabel: "Penanya",
  supportLabel: "Bantuan",
  allCategory: "Semua",
  deleteQuestionTitle: "Hapus pertanyaan",
  searchPlaceholder: "Cari pertanyaan atau kata kunci...",
  noQuestionsFound: "Tidak ada pertanyaan yang sesuai dengan pencarian Anda.",
  popularLabel: "Pertanyaan Populer",
  clearSearch: "Hapus pencarian",
};

const EN: FaqStaticStrings = {
  eyebrow: "Questions",
  defaultTitle: "Frequently Asked Questions",
  supportHelpText: "Still have questions or need assistance?",
  supportActionText: "Contact Us Directly",
  addQuestion: "Add Question",
  newQuestion: "New question here?",
  newAnswer: "Your answer goes here.",
  userLabel: "You",
  supportLabel: "Support",
  allCategory: "All",
  deleteQuestionTitle: "Delete question",
  searchPlaceholder: "Search questions or keywords...",
  noQuestionsFound: "No questions match your search.",
  popularLabel: "Popular Questions",
  clearSearch: "Clear search",
};

export function faqStrings(language?: "id" | "en"): FaqStaticStrings {
  return language === "en" ? EN : ID;
}
