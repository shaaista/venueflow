"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { REVENUE_SERIES } from "@/lib/mock/crm";

const ESPRESSO = "#4A3728";
const SAGE = "#5E7153";

type Point = { month: string; revenue: number; target: number };

export function RevenueChart({ data }: { data?: Point[] }) {
  const series = data && data.length ? data : REVENUE_SERIES;
  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={series} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
        <defs>
          <linearGradient id="revFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={ESPRESSO} stopOpacity={0.18} />
            <stop offset="100%" stopColor={ESPRESSO} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#E7E2D6" vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
          tick={{ fill: "#968C7C", fontSize: 12 }}
          dy={6}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tick={{ fill: "#968C7C", fontSize: 12 }}
          tickFormatter={(v) => `$${v}k`}
          width={56}
        />
        <Tooltip
          cursor={{ stroke: "#DAD3C3", strokeWidth: 1 }}
          contentStyle={{
            background: "#FFFFFF",
            border: "1px solid #E7E2D6",
            borderRadius: 12,
            boxShadow: "0 10px 28px -16px rgba(43,37,33,0.16)",
            fontSize: 13,
          }}
          labelStyle={{ color: "#2B2521", fontWeight: 600, marginBottom: 4 }}
          formatter={(value: number, name: string) => [
            `$${value}k`,
            name === "revenue" ? "Revenue" : "Target",
          ]}
        />
        <Area
          type="monotone"
          dataKey="target"
          stroke={SAGE}
          strokeWidth={1.5}
          strokeDasharray="4 4"
          fill="none"
          dot={false}
        />
        <Area
          type="monotone"
          dataKey="revenue"
          stroke={ESPRESSO}
          strokeWidth={2.5}
          fill="url(#revFill)"
          dot={false}
          activeDot={{ r: 4, fill: ESPRESSO, strokeWidth: 0 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
