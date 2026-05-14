import { Badge } from "@/components/ui/badge";
import { statusTone } from "@/lib/status-types";
import { UI_TONES } from "@/lib/ui-tones";
import { cn } from "@/lib/utils";

export function StatusBadge({ status }: { status?: string }) {
  const tone = statusTone(status);
  return (
    <Badge className={cn(UI_TONES[tone].badge, tone === "danger" && "font-bold")}>
      {status || "unknown"}
    </Badge>
  );
}
