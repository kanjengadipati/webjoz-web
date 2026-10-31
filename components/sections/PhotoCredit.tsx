import type { ImageCredit } from "../templates/types";
import { InlineText } from "../templates/shared";
import { isUnsplashUrl } from "./hero/images";

interface PhotoCreditProps {
  credit: ImageCredit | null | undefined;
  src?: string | null;
  className?: string;
  language?: string;
  section?: string;
  fieldKey?: string;
  onUpdateField?: (section: string, key: string, value: any) => void;
  isEditorMode?: boolean;
  isSelected?: boolean;
  collapseSheetForInlineEdit?: () => void;
}

export default function PhotoCredit({
  credit,
  src,
  className = "",
  language = "en",
  section,
  fieldKey,
  onUpdateField,
  isEditorMode,
  isSelected,
  collapseSheetForInlineEdit,
}: PhotoCreditProps) {
  const isID = language === "id";
  const byLabel = isID ? "Foto oleh" : "Photo by";
  const onLabel = isID ? "di" : "on";
  const fromLabel = isID ? "Foto dari" : "Photo from";

  const canInline = !!(isEditorMode && onUpdateField && section && fieldKey);

  if (!credit?.name) {
    if (!isUnsplashUrl(src)) return null;
    return (
      <p className={`text-[10px] text-white/70 ${className}`}>
        {fromLabel}{" "}
        <a href="https://unsplash.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-700">
          Unsplash
        </a>
      </p>
    );
  }

  return (
    <p className={`text-[10px] text-white/70 ${className}`}>
      {byLabel}{" "}
      <a href={credit.url} target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-700">
        {canInline ? (
          <InlineText
            section={section}
            fieldKey={fieldKey}
            value={credit.name ?? ""}
            onUpdateField={onUpdateField}
            isEditorMode={isEditorMode}
            isSelected={isSelected}
            as="span"
            collapseSheetForInlineEdit={collapseSheetForInlineEdit}
          />
        ) : (
          credit.name
        )}
      </a>{" "}
      {onLabel}{" "}
      <a href="https://unsplash.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-700">
        Unsplash
      </a>
    </p>
  );
}