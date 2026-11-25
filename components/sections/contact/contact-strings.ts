/**
 * contact-strings.ts
 *
 * Typed dictionary untuk string statis UI, label, dan placeholder pada varian contact.
 */

export interface ContactStaticStrings {
  eyebrow: string;
  phoneLabel: string;
  phonePlaceholder: string;
  emailLabel: string;
  emailPlaceholder: string;
  addressLabel: string;
  addressPlaceholder: string;
  hoursLabel: string;
  hoursPlaceholder: string;
  subtitlePlaceholder: string;
  viewLocation: string;
  officePhotoAlt: string;
  addPhotoHint: string;
}

const ID: ContactStaticStrings = {
  eyebrow: "Kontak Kami",
  phoneLabel: "Telepon / WhatsApp",
  phonePlaceholder: "Tambah nomor telepon / WA...",
  emailLabel: "Email",
  emailPlaceholder: "Tambah alamat email...",
  addressLabel: "Alamat / Lokasi",
  addressPlaceholder: "Tambah alamat bisnis...",
  hoursLabel: "Jam Operasional",
  hoursPlaceholder: "Senin - Jumat, 08:00 - 17:00",
  subtitlePlaceholder: "Kunjungi kantor kami atau hubungi melalui informasi di bawah.",
  viewLocation: "Lihat Lokasi",
  officePhotoAlt: "Foto Kantor / Lokasi",
  addPhotoHint: "Klik untuk menambahkan foto lokasi",
};

const EN: ContactStaticStrings = {
  eyebrow: "Contact Us",
  phoneLabel: "Phone / WhatsApp",
  phonePlaceholder: "Add phone or WhatsApp...",
  emailLabel: "Email",
  emailPlaceholder: "Add email address...",
  addressLabel: "Address / Location",
  addressPlaceholder: "Add business address...",
  hoursLabel: "Opening Hours",
  hoursPlaceholder: "Mon - Fri, 08:00 - 17:00",
  subtitlePlaceholder: "Visit our office or reach out via the contact details below.",
  viewLocation: "View Location",
  officePhotoAlt: "Office / Location Photo",
  addPhotoHint: "Click to add location photo",
};

export function contactStrings(language?: "id" | "en"): ContactStaticStrings {
  return language === "en" ? EN : ID;
}
