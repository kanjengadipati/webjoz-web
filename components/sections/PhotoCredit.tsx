import type { ImageCredit } from "../templates/types";

interface PhotoCreditProps {
  credit: ImageCredit | null | undefined;
  className?: string;
}

export default function PhotoCredit({ credit, className = "" }: PhotoCreditProps) {
  if (!credit?.name) return null;

  return (
    <p className={`text-xs text-gray-500 mt-2 ${className}`}>
      Photo by{" "}
      <a href={credit.url} target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-700">
        {credit.name}
      </a>{" "}
      on{" "}
      <a href="https://unsplash.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-700">
        Unsplash
      </a>
    </p>
  );
}
