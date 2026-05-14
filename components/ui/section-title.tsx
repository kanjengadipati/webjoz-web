import type { ReactNode } from "react";

export function SectionTitle({ eyebrow, title, action }: { eyebrow?: string; title: string; action?: ReactNode }) {
  return (
    <div className="mb-8 flex items-end justify-between gap-4">
      <div>
        {eyebrow ? <div className="mb-1 text-xs font-medium text-primary/80">{eyebrow}</div> : null}
        <h2 className="text-2xl font-bold tracking-tight lg:text-3xl">{title}</h2>
      </div>
      {action}
    </div>
  );
}
