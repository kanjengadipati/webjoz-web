// KIND_CONFIG — single source of truth for per-kind behaviour of the menu/catalog
// section. Replaces scattered `sectionKey === "menu"/"catalog"` branching.
export type ProductKind = "menu" | "product" | "service" | "lodging";

export interface KindConfig {
  label: string;
  emptyItemName: (isEN: boolean) => string;
  defaultFeatures: (isEN: boolean) => string[];
  showCapacity: boolean;
  showFeatures: boolean;
  showTags: boolean;
  showDeliveryPlatforms: boolean;
  ctaMode: "cart" | "booking" | "inquiry";
}

export const KIND_CONFIG: Record<ProductKind, KindConfig> = {
  menu: {
    label: "Menu",
    emptyItemName: (isEN) => (isEN ? "Menu item" : "Item menu"),
    defaultFeatures: () => [],
    showCapacity: false,
    showFeatures: false,
    showTags: true,
    showDeliveryPlatforms: true,
    ctaMode: "cart",
  },
  product: {
    label: "Catalog",
    emptyItemName: (isEN) => (isEN ? "Product" : "Produk"),
    defaultFeatures: () => [],
    showCapacity: false,
    showFeatures: true,
    showTags: false,
    showDeliveryPlatforms: false,
    ctaMode: "cart",
  },
  service: {
    label: "Service",
    emptyItemName: (isEN) => (isEN ? "Service" : "Layanan"),
    defaultFeatures: () => [],
    showCapacity: false,
    showFeatures: true,
    showTags: false,
    showDeliveryPlatforms: false,
    ctaMode: "inquiry",
  },
  lodging: {
    label: "Lodging",
    emptyItemName: (isEN) => (isEN ? "Room" : "Kamar"),
    defaultFeatures: () => [],
    showCapacity: true,
    showFeatures: true,
    showTags: false,
    showDeliveryPlatforms: false,
    ctaMode: "booking",
  },
};

export function resolveKind(data: { kind?: ProductKind } | null | undefined, fallback: ProductKind = "product"): ProductKind {
  const k = data?.kind;
  return k && k in KIND_CONFIG ? k : fallback;
}