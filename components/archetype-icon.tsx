"use client";

import React from "react";
import {
  BedDouble,
  Briefcase,
  Building2,
  CalendarCheck,
  GraduationCap,
  Laptop,
  MapPin,
  Palette,
  ShoppingBag,
  UtensilsCrossed,
  Globe,
} from "lucide-react";

const ARCHETYPE_ICON_MAP: Record<string, React.ComponentType<{ className?: string; strokeWidth?: number }>> = {
  food_venue: UtensilsCrossed,
  retail_catalog: ShoppingBag,
  booking_service: CalendarCheck,
  portfolio_individual: Palette,
  professional_firm: Briefcase,
  corporate_org: Building2,
  lodging: BedDouble,
  institution_org: GraduationCap,
  destination: MapPin,
  software_product: Laptop,
};

export function ArchetypeIcon({
  id,
  className = "size-3.5 shrink-0",
  strokeWidth = 1.9,
}: {
  id: string;
  className?: string;
  strokeWidth?: number;
}) {
  const Icon = ARCHETYPE_ICON_MAP[id] ?? Globe;
  return <Icon className={className} strokeWidth={strokeWidth} aria-hidden="true" />;
}
