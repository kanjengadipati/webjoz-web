import { Badge } from "@/components/ui/badge";
import { statusTone } from "@/lib/status-types";
import { UI_TONES } from "@/lib/ui-tones";
import { cn } from "@/lib/utils";

export function StatusBadge({ status, className }: { status?: string; className?: string }) {
  const tone = statusTone(status);
  return (
    <Badge
      variant="unstyled"
      className={cn(
        "shrink-0 whitespace-nowrap",
        UI_TONES[tone].badge,
        tone === "danger" && "font-bold",
        className
      )}
    >
      {status || "unknown"}
    </Badge>
  );
}
