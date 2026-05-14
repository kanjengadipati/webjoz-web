import { Card, CardHeader } from "@/components/ui/card";
import { UI_TONES, type ToneKey } from "@/lib/ui-tones";
import { MOTION } from "@/lib/ui-tokens";
import { cn } from "@/lib/utils";

export function MetricCard({
  label,
  value,
  helper,
  tone = "neutral",
  signal,
}: {
  label: string;
  value: string;
  helper?: string;
  tone?: ToneKey;
  signal?: string;
}) {
  const style = UI_TONES[tone];

  return (
    <Card className={cn("relative overflow-hidden group shadow-sm hover:shadow-primary/5", MOTION.slow, style.ring)}>
      <div className={cn("absolute inset-x-0 top-0 h-1 bg-gradient-to-r via-transparent to-transparent", style.accent)} />
      <div className={cn("absolute top-0 right-0 size-32 bg-gradient-to-br to-transparent blur-[60px] -z-10", MOTION.slow, style.panel)} />
      <CardHeader className="space-y-4 p-6">
        <div className="flex items-center justify-between gap-3">
          <div className="text-xs font-medium text-muted-foreground/70 group-hover:text-primary/80 transition-colors">{label}</div>
          <div className={cn("size-2 rounded-full shadow-[0_0_12px_currentColor]", style.text)} />
        </div>
        <div className="flex items-end justify-between gap-4">
          <div className={cn("text-4xl font-bold tracking-tighter lg:text-5xl group-hover:scale-[1.02]", MOTION.transform)}>{value}</div>
          {signal ? <div className={cn("mb-1 rounded-full border border-current/20 px-2.5 py-1 text-[10px] font-medium", style.text)}>{signal}</div> : null}
        </div>
        {helper ? <div className="line-clamp-2 text-xs font-medium leading-relaxed text-muted-foreground/60">{helper}</div> : null}
      </CardHeader>
    </Card>
  );
}
