"use client";

import {
  BarChart,
  LineChart,
  AreaChart,
  Bar,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { motion } from "framer-motion";
import React from "react";

// Theme Colors
const SALON_THEME = {
  primary: "#b76e79",
  secondary: "#e8c4c0",
  accent: "#7a5a57",
  background: "#fff0ee",
};

export interface ChartData {
  day: string;
  revenue: number;
  newClients: number;
  appointments: number;
}

interface ChartProps {
  data: ChartData[];
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: { name: string; value: number; color: string }[];
  label?: string;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({
  active,
  payload,
  label,
}) => {
  if (active && payload && payload.length) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-[#fff0ee] p-4 rounded-lg shadow-lg border border-[#e8c4c0]"
      >
        <p className="font-medium text-[#7a5a57]">{label}</p>
        <div className="space-y-2 mt-2">
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-sm text-[#7a5a57]">
                {entry.name}: {entry.value}
              </span>
            </div>
          ))}
        </div>
      </motion.div>
    );
  }
  return null;
};

export const LineChartComponent: React.FC<ChartProps> = ({ data }) => (
  <ResponsiveContainer width="100%" height="100%">
    <LineChart data={data}>
      <CartesianGrid strokeDasharray="3 3" stroke={SALON_THEME.secondary} />
      <XAxis
        dataKey="day"
        tick={{ fill: SALON_THEME.accent }}
        stroke={SALON_THEME.secondary}
      />
      <YAxis
        tick={{ fill: SALON_THEME.accent }}
        stroke={SALON_THEME.secondary}
      />
      <Tooltip content={<CustomTooltip />} />
      <Legend
        wrapperStyle={{ color: SALON_THEME.accent }}
        formatter={(value) => <span className="text-[#7a5a57]">{value}</span>}
      />
      <Line
        type="monotone"
        dataKey="revenue"
        stroke={SALON_THEME.primary}
        strokeWidth={2}
        dot={{ fill: SALON_THEME.primary, strokeWidth: 2 }}
        activeDot={{
          r: 6,
          fill: SALON_THEME.primary,
          stroke: SALON_THEME.secondary,
        }}
      />
    </LineChart>
  </ResponsiveContainer>
);

export const BarChartComponent: React.FC<ChartProps> = ({ data }) => (
  <ResponsiveContainer width="100%" height="100%">
    <BarChart data={data}>
      <CartesianGrid strokeDasharray="3 3" stroke={SALON_THEME.secondary} />
      <XAxis
        dataKey="day"
        tick={{ fill: SALON_THEME.accent }}
        stroke={SALON_THEME.secondary}
      />
      <YAxis
        tick={{ fill: SALON_THEME.accent }}
        stroke={SALON_THEME.secondary}
      />
      <Tooltip content={<CustomTooltip />} />
      <Legend
        wrapperStyle={{ color: SALON_THEME.accent }}
        formatter={(value) => <span className="text-[#7a5a57]">{value}</span>}
      />
      <Bar
        dataKey="newClients"
        fill={SALON_THEME.primary}
        radius={[4, 4, 0, 0]}
        gradientTransform="rotate(90)"
      />
    </BarChart>
  </ResponsiveContainer>
);

export const AreaChartComponent: React.FC<ChartProps> = ({ data }) => (
  <ResponsiveContainer width="100%" height="100%">
    <AreaChart data={data}>
      <CartesianGrid strokeDasharray="3 3" stroke={SALON_THEME.secondary} />
      <XAxis
        dataKey="day"
        tick={{ fill: SALON_THEME.accent }}
        stroke={SALON_THEME.secondary}
      />
      <YAxis
        tick={{ fill: SALON_THEME.accent }}
        stroke={SALON_THEME.secondary}
      />
      <Tooltip content={<CustomTooltip />} />
      <Legend
        wrapperStyle={{ color: SALON_THEME.accent }}
        formatter={(value) => <span className="text-[#7a5a57]">{value}</span>}
      />
      <Area
        type="monotone"
        dataKey="appointments"
        stroke={SALON_THEME.primary}
        fill={SALON_THEME.primary}
        fillOpacity={0.15}
        strokeWidth={2}
      />
    </AreaChart>
  </ResponsiveContainer>
);
