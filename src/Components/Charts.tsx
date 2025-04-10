// components/Charts.tsx
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
interface ChartData {
  day: string;
  revenue: number;
  newClients: number;
  appointments: number;
}

// Define tooltip payload item type from recharts

// Props for CustomTooltip component
interface CustomTooltipProps {
  active?: boolean;
  payload?: { name: string; value: number; color: string }[];
  label?: string;
}

// Generate 30 days of dummy data
const generateData = (): ChartData[] => {
  const data: ChartData[] = [];
  const today = new Date();

  for (let i = 0; i < 30; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    data.push({
      day: `${date.getDate()} ${date.toLocaleString("default", {
        month: "short",
      })}`,
      revenue: Math.floor(Math.random() * (800 - 300 + 1)) + 300,
      newClients: Math.floor(Math.random() * (10 - 2 + 1)) + 2,
      appointments: Math.floor(Math.random() * (20 - 5 + 1)) + 5,
    });
  }

  return data.reverse();
};

const chartData = generateData();

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
export const LineChartComponent: React.FC = () => (
  <ResponsiveContainer width="100%" height="100%">
    <LineChart data={chartData}>
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
export const BarChartComponent: React.FC = () => (
  <ResponsiveContainer width="100%" height="100%">
    <BarChart data={chartData}>
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
export const AreaChartComponent: React.FC = () => (
  <ResponsiveContainer width="100%" height="100%">
    <AreaChart data={chartData}>
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
