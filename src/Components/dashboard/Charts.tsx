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

// Define chart data type
export interface ChartData {
  day: string;
  revenue: number;
  newClients: number;
  appointments: number;
}

interface ChartProps {
  data: ChartData[];
}

// Props for CustomTooltip component
interface CustomTooltipProps {
  active?: boolean;
  payload?: { name: string; value: number; color: string }[];
  label?: string;
}

// Custom Tooltip Component
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
        className="bg-white p-4 rounded-lg shadow-lg border border-gray-100"
      >
        <p className="font-medium text-gray-800">{label}</p>
        <div className="space-y-2 mt-2">
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-sm">
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

// Line Chart Component
export const LineChartComponent: React.FC<ChartProps> = ({ data }) => (
  <ResponsiveContainer width="100%" height="100%">
    <LineChart data={data}>
      <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
      <XAxis dataKey="day" tick={{ fill: "#6B7280" }} stroke="#E5E7EB" />
      <YAxis tick={{ fill: "#6B7280" }} stroke="#E5E7EB" />
      <Tooltip content={<CustomTooltip />} />
      <Legend />
      <Line
        type="monotone"
        dataKey="revenue"
        stroke="#8B5CF6"
        strokeWidth={2}
        dot={{ fill: "#8B5CF6", strokeWidth: 2 }}
        activeDot={{ r: 6 }}
      />
    </LineChart>
  </ResponsiveContainer>
);

// Bar Chart Component
export const BarChartComponent: React.FC<ChartProps> = ({ data }) => (
  <ResponsiveContainer width="100%" height="100%">
    <BarChart data={data}>
      <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
      <XAxis dataKey="day" tick={{ fill: "#6B7280" }} stroke="#E5E7EB" />
      <YAxis tick={{ fill: "#6B7280" }} stroke="#E5E7EB" />
      <Tooltip content={<CustomTooltip />} />
      <Legend />
      <Bar dataKey="newClients" fill="#EC4899" radius={[4, 4, 0, 0]} />
    </BarChart>
  </ResponsiveContainer>
);

// Area Chart Component
export const AreaChartComponent: React.FC<ChartProps> = ({ data }) => (
  <ResponsiveContainer width="100%" height="100%">
    <AreaChart data={data}>
      <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
      <XAxis dataKey="day" tick={{ fill: "#6B7280" }} stroke="#E5E7EB" />
      <YAxis tick={{ fill: "#6B7280" }} stroke="#E5E7EB" />
      <Tooltip content={<CustomTooltip />} />
      <Legend />
      <Area
        type="monotone"
        dataKey="appointments"
        stroke="#8B5CF6"
        fill="#8B5CF6"
        fillOpacity={0.2}
        strokeWidth={2}
      />
    </AreaChart>
  </ResponsiveContainer>
);
