export interface TestimonialsStaticStrings {
  addTestimonial: string;
  avatarInitials: string;
  clientName: string;
  clientTestimonial: string;
  client: string;
  closeVideo: string;
  customerName: string;
  noTestimonials: string;
  noTestimonialsDesc: string;
  playVideo: string;
  positionRole: string;
  removeTestimonial: string;
  rolePosition: string;
  testimonialPhoto: string;
  testimonialVideo: string;
  testimonials: string;
  watch: string;
  whatClientsSay: string;
  whatOurClientsSay: string;
  writeClientTestimonial: string;
}

const ID: TestimonialsStaticStrings = {
  addTestimonial: "Tambah Testimoni",
  avatarInitials: "NP",
  clientName: "Nama Pelanggan",
  clientTestimonial: "Testimoni pelanggan...",
  client: "Pelanggan",
  closeVideo: "Tutup video",
  customerName: "Nama Pelanggan",
  noTestimonials: "Belum ada testimoni",
  noTestimonialsDesc: "Belum ada testimoni. Tambahkan data testimoni asli.",
  playVideo: "Putar video",
  positionRole: "Jabatan / Peran",
  removeTestimonial: "Hapus testimoni",
  rolePosition: "Jabatan / Peran",
  testimonialPhoto: "Foto testimoni",
  testimonialVideo: "Video testimoni",
  testimonials: "Testimoni",
  watch: "Tonton",
  whatClientsSay: "Apa Kata Klien",
  whatOurClientsSay: "Kata Klien Kami",
  writeClientTestimonial: "Tulis testimoni pelanggan di sini...",
};

const EN: TestimonialsStaticStrings = {
  addTestimonial: "Add Testimonial",
  avatarInitials: "CN",
  clientName: "Client Name",
  clientTestimonial: "Client testimonial...",
  client: "Client",
  closeVideo: "Close video",
  customerName: "Customer name",
  noTestimonials: "No testimonials yet",
  noTestimonialsDesc: "No testimonials yet. Add genuine customer feedback.",
  playVideo: "Play video",
  positionRole: "Position / Role",
  removeTestimonial: "Remove testimonial",
  rolePosition: "Role / Position",
  testimonialPhoto: "Testimonial photo",
  testimonialVideo: "Testimonial video",
  testimonials: "Testimonials",
  watch: "Watch",
  whatClientsSay: "What Clients Say",
  whatOurClientsSay: "What Our Clients Say",
  writeClientTestimonial: "Write client testimonial here...",
};

export function testimonialsStrings(language?: string): TestimonialsStaticStrings {
  return (language || "id").toLowerCase().startsWith("en") ? EN : ID;
}