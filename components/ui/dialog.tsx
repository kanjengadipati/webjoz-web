import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { CloseIcon } from "@/components/icons";
import { cn } from "@/lib/utils";

export function Dialog({
  open,
  onOpenChange,
  title,
  children,
  footer,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div
      className={cn(
        "fixed inset-0 z-50 bg-black/50 p-4 opacity-0 pointer-events-none transition-opacity",
        open && "opacity-100 pointer-events-auto",
      )}
      onClick={() => onOpenChange(false)}
      role="presentation"
    >
      <div
        className="fixed left-1/2 top-1/2 max-h-[90vh] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl border border-border bg-background shadow-2xl"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
      >
        <div className="flex items-center justify-between gap-4 border-b border-border/60 p-6">
          <h2 id="dialog-title" className="text-lg font-bold tracking-tight">{title}</h2>
          <Button variant="ghost" size="icon" aria-label="Close dialog" onClick={() => onOpenChange(false)}>
            <CloseIcon size="sm" />
          </Button>
        </div>
        <div className="p-6">{children}</div>
        {footer ? <div className="flex gap-3 border-t border-border/60 p-6">{footer}</div> : null}
      </div>
    </div>
  );
}
