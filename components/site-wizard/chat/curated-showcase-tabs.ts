import { UtensilsCrossed, ShoppingBag, Calendar, Palette } from "lucide-react";
import type React from "react";

export interface CuratedShowcaseTab {
  /** Indices into SHOWCASE_ITEMS; indices[0] is the primary thumbnail sample */
  indices: number[];
  labelIdKey: string;
  labelFallbackId: string;
  labelFallbackEn: string;
  imageUrl: string;
  headlineSub: string;
  headlineMain: string;
  headlineAccent: string;
  Icon: React.ElementType;
}

export const CURATED_SHOWCASE_TABS: CuratedShowcaseTab[] = [
  {
    indices: [0, 2], // Kopi Rempah Nusantara, Boba Rasa
    labelIdKey: "dashboard.wizard.categories.kuliner",
    labelFallbackId: "Kuliner",
    labelFallbackEn: "Culinary",
    imageUrl:
      "https://images.unsplash.com/photo-1511920170033-f8396924c348?w=400&q=70",
    headlineSub: "GOOD",
    headlineMain: "COFFEE",
    headlineAccent: "MOOD",
    Icon: UtensilsCrossed,
  },
  {
    indices: [8, 4, 9], // Atelier Nia, Dapur Herbal Ibu Sari, Nexbyte Store
    labelIdKey: "dashboard.wizard.categories.tokoUmkm",
    labelFallbackId: "Toko Online & Retail",
    labelFallbackEn: "Online Store & Retail",
    imageUrl:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=70",
    headlineSub: "YOUR",
    headlineMain: "STYLE",
    headlineAccent: "WAY",
    Icon: ShoppingBag,
  },
  {
    indices: [7, 3, 6, 14, 13], // Klinik Gigi Smile Care, Noir Spa, Garuda Motor, Razor & Blade, The Arva Hotel
    labelIdKey: "dashboard.wizard.categories.jasaBooking",
    labelFallbackId: "Layanan & Reservasi",
    labelFallbackEn: "Services & Booking",
    imageUrl:
      "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=400&q=70",
    headlineSub: "SMILE",
    headlineMain: "CARE",
    headlineAccent: "PRO",
    Icon: Calendar,
  },
  {
    indices: [1, 5, 16, 10], // Artha Legal, Studio Forma, Lensa Muda Studio, Graha Vista Properti
    labelIdKey: "dashboard.wizard.categories.portofolioKreator",
    labelFallbackId: "Kreatif & Profesional",
    labelFallbackEn: "Creative & Professional",
    imageUrl:
      "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&q=70",
    headlineSub: "GROW",
    headlineMain: "FASTER",
    headlineAccent: "BIZ",
    Icon: Palette,
  },
];
