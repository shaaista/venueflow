import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { Sparkline } from "@/components/ui/sparkline";
import { formatCurrency, formatNumber, cn } from "@/lib/utils";

type Metric = {
  label: string;
  value: number;
  format: string;
  delta: number;
  trend: string;
  spark: number[];
  foot: string;
};

function display(value: number, format: string) {
  if (format === "currency") return formatCurrency(value, { compact: value >= 10000 });
  if (format === "percent") return `${value}%`;
  return formatNumber(value);
}

export function MetricCard({ metric }: { metric: Metric }) {
  const up = metric.trend === "up";
  return (
    <div className="card card-hover p-5">
      <div className="flex items-start justify-between">
        <p className="text-sm text-cocoa-muted">{metric.label}</p>
        <span
          className={cn(
            "inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-xs font-medium",
            up ? "bg-sage-50 text-success" : "bg-amber-50 text-danger"
          )}
        >
          {up ? (
            <ArrowUpRight className="h-3 w-3" />
          ) : (
            <ArrowDownRight className="h-3 w-3" />
          )}
          {Math.abs(metric.delta)}%
        </span>
      </div>

      <div className="mt-3 flex items-end justify-between gap-3">
        <p className="font-display text-3xl font-semibold tracking-tight text-cocoa tnum">
          {display(metric.value, metric.format)}
        </p>
        <Sparkline
          data={metric.spark}
          width={84}
          height={34}
          className={up ? "text-sage-500" : "text-amber-400"}
        />
      </div>

      <p className="mt-2 text-xs text-cocoa-faint">{metric.foot}</p>
    </div>
  );
}
