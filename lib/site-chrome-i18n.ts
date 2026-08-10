export const siteChromeText = {
  id: {
    sendMessage: "Kirim Pesan",
    contactUs: "Hubungi Kami",
    allRightsReserved: "Hak Cipta Dilindungi",
    orderViaWa: "Pesan via WhatsApp",
    viewMenu: "Lihat Menu",
    viewCatalog: "Lihat Katalog",
    seeMore: "Lihat Selengkapnya",
    backToHome: "Kembali ke Beranda",
    faqTitle: "Pertanyaan Umum",
    testimonialTitle: "Kata Mereka",
    callNow: "Hubungi Sekarang",
  },
  en: {
    sendMessage: "Send Message",
    contactUs: "Contact Us",
    allRightsReserved: "All Rights Reserved",
    orderViaWa: "Order via WhatsApp",
    viewMenu: "View Menu",
    viewCatalog: "View Catalog",
    seeMore: "See More",
    backToHome: "Back to Home",
    faqTitle: "Frequently Asked Questions",
    testimonialTitle: "Testimonials",
    callNow: "Call Now",
  },
} as const;

export type SiteChromeLanguage = keyof typeof siteChromeText;
