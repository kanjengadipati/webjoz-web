/**
 * works-strings.ts
 *
 * Typed dictionary untuk string statis UI, label, dan placeholder pada varian works.
 */

export interface WorksStaticStrings {
  viewProject: string;
  prevProjects: string;
  nextProjects: string;
  titlePlaceholder: string;
  categoryPlaceholder: string;
  yearPlaceholder: string;
  descriptionPlaceholder: string;
  defaultCategory: string;
  imagePlaceholderHint: string;
  deleteProject: string;
}

const ID: WorksStaticStrings = {
  viewProject: "Lihat Proyek",
  prevProjects: "Proyek sebelumnya",
  nextProjects: "Proyek berikutnya",
  titlePlaceholder: "Judul proyek...",
  categoryPlaceholder: "Kategori",
  yearPlaceholder: "Tahun",
  descriptionPlaceholder: "Deskripsi singkat proyek...",
  defaultCategory: "Proyek",
  imagePlaceholderHint: "Klik untuk tambah foto proyek",
  deleteProject: "Hapus proyek",
};

const EN: WorksStaticStrings = {
  viewProject: "View Project",
  prevProjects: "Previous projects",
  nextProjects: "Next projects",
  titlePlaceholder: "Project title...",
  categoryPlaceholder: "Category",
  yearPlaceholder: "Year",
  descriptionPlaceholder: "Brief project description...",
  defaultCategory: "Project",
  imagePlaceholderHint: "Click to add project image",
  deleteProject: "Delete project",
};

export function worksStrings(language?: "id" | "en"): WorksStaticStrings {
  return language === "en" ? EN : ID;
}
