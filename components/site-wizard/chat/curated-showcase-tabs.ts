import { Coffee, ShoppingBag, TrendingUp, Stethoscope } from "lucide-react";
import type React from "react";

export interface CuratedShowcaseTab {
  index: number;
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
    index: 0,
    labelIdKey: "dashboard.wizard.exampleTabCafe",
    labelFallbackId: "Kafe & Kuliner",
    labelFallbackEn: "Cafe & F&B",
    imageUrl:
      "https://images.unsplash.com/photo-1511920170033-f8396924c348?w=400&q=70",
    headlineSub: "GOOD",
    headlineMain: "COFFEE",
    headlineAccent: "MOOD",
    Icon: Coffee,
  },
  {
    index: 8,
    labelIdKey: "dashboard.wizard.exampleTabStore",
    labelFallbackId: "Toko & Fashion",
    labelFallbackEn: "Store & Fashion",
    imageUrl:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=70",
    headlineSub: "YOUR",
    headlineMain: "STYLE",
    headlineAccent: "WAY",
    Icon: ShoppingBag,
  },
  {
    index: 1,
    labelIdKey: "dashboard.wizard.exampleTabConsultant",
    labelFallbackId: "Konsultan",
    labelFallbackEn: "Consultant",
    imageUrl:
      "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&q=70",
    headlineSub: "GROW",
    headlineMain: "FASTER",
    headlineAccent: "BIZ",
    Icon: TrendingUp,
  },
  {
    index: 7,
    labelIdKey: "dashboard.wizard.exampleTabClinic",
    labelFallbackId: "Klinik & Jasa",
    labelFallbackEn: "Clinic & Service",
    imageUrl:
      "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=400&q=70",
    headlineSub: "SMILE",
    headlineMain: "CARE",
    headlineAccent: "PRO",
    Icon: Stethoscope,
  },
];
