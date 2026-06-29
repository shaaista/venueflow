"use client";

import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";

const ESPRESSO = "#4A3728";
const SAGE = "#5E7153";
const AMBER = "#D97706";
const LINE = "#E7E2D6";
const MUTED = "#968C7C";

const tooltipStyle = {
  background: "#FFFFFF",
  border: "1px solid #E7E2D6",
  borderRadius: 12,
  fontSize: 13,
  boxShadow: "0 10px 28px -16px rgba(43,37,33,0.16)",
};

const BOOKINGS = [
  { month: "Jan", bookings: 12 },
  { month: "Feb", bookings: 15 },
  { month: "Mar", bookings: 14 },
  { month: "Apr", bookings: 18 },
  { month: "May", bookings: 21 },
  { month: "Jun", bookings: 19 },
];

const SOURCES = [
  { source: "Website", leads: 42 },
  { source: "Referral", leads: 28 },
  { source: "Instagram", leads: 18 },
  { source: "Phone", leads: 12 },
];

const TYPES = [
  { name: "Weddings", value: 38, color: ESPRESSO },
  { name: "Corporate", value: 31, color: SAGE },
  { name: "Private", value: 19, color: AMBER },
  { name: "Other", value: 12, color: "#C4B8A6" },
];

export function BookingsBar() {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={BOOKINGS} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={LINE} vertical={false} />
        <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: MUTED, fontSize: 12 }} dy={6} />
        <YAxis tickLine={false} axisLine={false} tick={{ fill: MUTED, fontSize: 12 }} width={40} />
        <Tooltip cursor={{ fill: "rgba(74,55,40,0.05)" }} contentStyle={tooltipStyle} />
        <Bar dataKey="bookings" fill={ESPRESSO} radius={[6, 6, 0, 0]} barSize={28} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function SourcesBar() {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={SOURCES} layout="vertical" margin={{ top: 4, right: 16, left: 8, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={LINE} horizontal={false} />
        <XAxis type="number" tickLine={false} axisLine={false} tick={{ fill: MUTED, fontSize: 12 }} />
        <YAxis dataKey="source" type="category" tickLine={false} axisLine={false} tick={{ fill: MUTED, fontSize: 12 }} width={72} />
        <Tooltip cursor={{ fill: "rgba(74,55,40,0.05)" }} contentStyle={tooltipStyle} />
        <Bar dataKey="leads" fill={SAGE} radius={[0, 6, 6, 0]} barSize={20} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function TypesDonut() {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <PieChart>
        <Pie data={TYPES} dataKey="value" nameKey="name" innerRadius={56} outerRadius={84} paddingAngle={2} stroke="none">
          {TYPES.map((t) => (
            <Cell key={t.name} fill={t.color} />
          ))}
        </Pie>
        <Tooltip contentStyle={tooltipStyle} />
        <Legend
          verticalAlign="middle"
          align="right"
          layout="vertical"
          iconType="circle"
          formatter={(v) => <span style={{ color: "#6E6557", fontSize: 13 }}>{v}</span>}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
