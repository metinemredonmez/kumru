"use client";

import * as React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type ChartBarProps = {
  data: Array<Record<string, unknown>>;
  dataKey: string;
  xKey: string;
  color?: string;
  height?: number;
  className?: string;
  /** Index of the bar to highlight (e.g. the latest / peak point). */
  highlightIndex?: number;
};

const INDIGO = "var(--color-primary, #5B2EFF)";

function ChartBar({
  data,
  dataKey,
  xKey,
  color = INDIGO,
  height = 260,
  className,
  highlightIndex,
}: ChartBarProps) {
  return (
    <div className={className} style={{ width: "100%", height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="var(--color-border, #e5e7eb)"
            strokeOpacity={0.5}
          />
          <XAxis
            dataKey={xKey}
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 12, fill: "var(--color-muted-foreground, #6b7280)" }}
            dy={8}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            width={40}
            tick={{ fontSize: 12, fill: "var(--color-muted-foreground, #6b7280)" }}
          />
          <Tooltip
            cursor={{ fill: color, fillOpacity: 0.08 }}
            contentStyle={{
              borderRadius: 12,
              border: "1px solid var(--color-border, #e5e7eb)",
              background: "var(--color-card, #ffffff)",
              color: "var(--color-card-foreground, #111827)",
              fontSize: 12,
              boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
            }}
          />
          <Bar dataKey={dataKey} radius={[6, 6, 0, 0]} maxBarSize={44}>
            {data.map((_, index) => (
              <Cell
                key={index}
                fill={color}
                fillOpacity={
                  highlightIndex === undefined || index === highlightIndex ? 1 : 0.35
                }
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export { ChartBar };
