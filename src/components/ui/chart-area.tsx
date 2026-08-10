"use client";

import * as React from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type ChartAreaProps = {
  data: Array<Record<string, unknown>>;
  dataKey: string;
  xKey: string;
  color?: string;
  height?: number;
  className?: string;
};

const INDIGO = "var(--color-primary, #5B2EFF)";

function ChartArea({
  data,
  dataKey,
  xKey,
  color = INDIGO,
  height = 260,
  className,
}: ChartAreaProps) {
  const gradientId = React.useId();

  return (
    <div className={className} style={{ width: "100%", height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.28} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
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
            cursor={{ stroke: color, strokeOpacity: 0.2, strokeWidth: 1 }}
            contentStyle={{
              borderRadius: 12,
              border: "1px solid var(--color-border, #e5e7eb)",
              background: "var(--color-card, #ffffff)",
              color: "var(--color-card-foreground, #111827)",
              fontSize: 12,
              boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
            }}
          />
          <Area
            type="monotone"
            dataKey={dataKey}
            stroke={color}
            strokeWidth={2}
            fill={`url(#${gradientId})`}
            activeDot={{ r: 5, strokeWidth: 2, stroke: "var(--color-card, #ffffff)", fill: color }}
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export { ChartArea };
