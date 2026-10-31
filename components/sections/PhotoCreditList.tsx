import React from "react";
import type { ImageCredit } from "../templates/types";
import { isUnsplashUrl } from "./hero/images";

interface Item {
  src: string;
  credit: ImageCredit | null;
}

/** "Foto oleh A dan B di Unsplash" (+ "· foto lain dari Unsplash" bila ada foto Unsplash tanpa nama). */
export default function PhotoCreditList({ items, language, className = "" }: {
  items: ReadonlyArray<Item>;
  language?: string;
  className?: string;
}) {
  const isID = language === "id";
  const seen = new Set<string>();
  const named: ImageCredit[] = [];
  for (const it of items) {
    const c = it.credit;
    if (c?.name && !seen.has(`${c.name}|${c.url}`)) {
      seen.add(`${c.name}|${c.url}`);
      named.push(c);
    }
  }
  const unnamedUnsplash = items.some((it) => !it.credit?.name && isUnsplashUrl(it.src));
  if (named.length === 0 && !unnamedUnsplash) return null;

  const unsplash = (
    <a href="https://unsplash.com" target="_blank" rel="noopener noreferrer" className="underline">Unsplash</a>
  );
  return (
    <p className={`text-[10px] text-white/70 ${className}`}>
      {named.length > 0 && (
        <>
          {isID ? "Foto oleh" : "Photo by"}{" "}
          {named.map((c, i) => (
            <React.Fragment key={`${c.name}-${i}`}>
              {i > 0 && (i === named.length - 1 ? (isID ? " dan " : " & ") : ", ")}
              <a href={c.url} target="_blank" rel="noopener noreferrer" className="underline">{c.name}</a>
            </React.Fragment>
          ))}{" "}
          {isID ? "di" : "on"} {unsplash}
          {unnamedUnsplash && <>{" · "}{isID ? "foto lain dari" : "other photos from"} {unsplash}</>}
        </>
      )}
      {named.length === 0 && <>{isID ? "Foto dari" : "Photo from"} {unsplash}</>}
    </p>
  );
}