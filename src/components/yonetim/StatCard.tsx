import { ArrowDownRight, ArrowUpRight, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export type StatTone = "default" | "gold" | "good" | "warn";

const TONE: Record<
  StatTone,
  { chip: string; value: string }
> = {
  default: { chip: "bg-primary/10 text-primary", value: "text-foreground" },
  gold: { chip: "bg-amber/15 text-amber", value: "text-amber" },
  good: { chip: "bg-emerald/15 text-emerald", value: "text-foreground" },
  warn: { chip: "bg-rose/15 text-rose", value: "text-foreground" },
};

export default function StatCard({
  label,
  value,
  icon: Icon,
  hint,
  tone = "default",
  trend,
  className,
}: {
  label: string;
  value: React.ReactNode;
  icon?: LucideIcon;
  hint?: string;
  tone?: StatTone;
  trend?: { value: string; direction?: "up" | "down" };
  className?: string;
}) {
  const t = TONE[tone];
  const up = trend?.direction !== "down";

  return (
    <div
      className={cn(
        "rounded-2xl border bg-card p-5 shadow-sm",
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
        {Icon && (
          <span
            className={cn(
              "grid place-items-center size-9 shrink-0 rounded-xl",
              t.chip
            )}
          >
            <Icon className="size-[18px]" />
          </span>
        )}
      </div>

      <div
        className={cn(
          "mt-3 text-3xl font-bold tabular-nums tracking-tight",
          t.value
        )}
      >
        {value}
      </div>

      {(hint || trend) && (
        <div className="mt-2 flex items-center gap-2 text-xs">
          {trend && (
            <span
              className={cn(
                "inline-flex items-center gap-0.5 font-semibold",
                up ? "text-emerald" : "text-rose"
              )}
            >
              {up ? (
                <ArrowUpRight className="size-3.5" />
              ) : (
                <ArrowDownRight className="size-3.5" />
              )}
              {trend.value}
            </span>
          )}
          {hint && <span className="text-muted-foreground">{hint}</span>}
        </div>
      )}
    </div>
  );
}
