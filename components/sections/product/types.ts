import type { TemplateProps, DesignToken } from "../../templates/types";

type MenuContent = NonNullable<TemplateProps["content"]["menu"]>;
type CatalogContent = NonNullable<TemplateProps["content"]["catalog"]>;

export type ProductKind = "menu" | "catalog";

export type ProductItem = MenuContent["categories"][number]["items"][number] &
  CatalogContent["categories"][number]["items"][number];

export type ProductCategory = {
  id?: string;
  name: string;
  sort_order?: number;
  items: ProductItem[];
};

export interface ProductCommonProps {
  design_token?: DesignToken | null;
  onUpdateField?: (section: string, key: string, value: unknown) => void;
  isEditorMode?: boolean;
  isSelected?: boolean;
  collapseSheetForInlineEdit?: () => void;
  onEditingStateChange?: (isEditing: boolean) => void;
  onAddItem?: (catIdx: number) => void;
  onDeleteItem?: (catIdx: number, itemIdx: number) => void;
  onAddCategory?: () => void;
  onDeleteCategory?: (catIdx: number) => void;
  language?: "id" | "en";
}

export interface MenuVariantProps extends ProductCommonProps {
  menu: TemplateProps["content"]["menu"];
}

export interface CatalogVariantProps extends ProductCommonProps {
  catalog: TemplateProps["content"]["catalog"];
}

export interface ProductVariantProps extends ProductCommonProps {
  kind: ProductKind;
  data: TemplateProps["content"]["menu"] | TemplateProps["content"]["catalog"];
}

export function productCategories(data: ProductVariantProps["data"]): ProductCategory[] {
  return (data?.categories ?? []) as unknown as ProductCategory[];
}
