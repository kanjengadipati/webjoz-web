// TEMPLATE — salin ke components/sections/<section>/<section>-strings.ts
// lalu sesuaikan. Pola ini (interface + ID + EN) membuat TypeScript menolak
// jika ada kunci yang hanya ada di salah satu bahasa.

export interface SectionStaticStrings {
  // contoh kunci; ganti sesuai kebutuhan section
  titlePlaceholder: string;
  descriptionPlaceholder: string;
  emptyState: string;
}

const ID: SectionStaticStrings = {
  titlePlaceholder: "Judul...",
  descriptionPlaceholder: "Deskripsi...",
  emptyState: "Belum ada konten",
};

const EN: SectionStaticStrings = {
  titlePlaceholder: "Title...",
  descriptionPlaceholder: "Description...",
  emptyState: "No content yet",
};

export function sectionStrings(language?: "id" | "en"): SectionStaticStrings {
  return (language ?? "id") === "en" ? EN : ID;
}