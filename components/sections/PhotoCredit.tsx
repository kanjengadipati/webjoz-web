import type { ImageCredit } from "../templates/types";

interface PhotoCreditProps {
  credit: ImageCredit | null | undefined;
  className?: string;
  language?: string;
}

export default function PhotoCredit({ credit, className = "", language = "en" }: PhotoCreditProps) {
  if (!credit?.name) return null;

  const isID = language === "id";
  const byLabel = isID ? "Foto oleh" : "Photo by";
  const onLabel = isID ? "di" : "on";

  return (
    <p className={`text-[10px] text-white/70 ${className}`}>
      {byLabel}{" "}
      <a href={credit.url} target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-700">
        {credit.name}
      </a>{" "}
      {onLabel}{" "}
      <a href="https://unsplash.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-700">
        Unsplash
      </a>
    </p>
  );
}