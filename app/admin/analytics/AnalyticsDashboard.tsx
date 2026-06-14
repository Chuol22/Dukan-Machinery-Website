"use client";

import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

// Ensure module exists at build-time (package already installed per plan).
// Shape mirrors the expected backend response.
type AnalyticsResponse = {
  stats: {
    totalOrders: number;
    pendingOrders: number;
    acceptedOrders: number;
    rejectedOrders: number;
    totalMachines: number;
    availableMachines: number;
    totalCustomers: number;
  };
  ordersPerMonth: Array<{ month: string; orders: number }>;
  topMachines: Array<{ machineName: string; orders: number }>;
  orderStatusDistribution: Array<{ status: string; count: number }>;
  customerGrowth: Array<{ month: string; customers: number }>;
  machineAvailabilityDistribution: Array<{
    availability_status: string;
    count: number;
  }>;
  inquiryTrends: Array<{ month: string; inquiries: number }>;
};

const COLORS = [
  "#f97316", // orange
  "#22c55e", // green
  "#ef4444", // red
  "#3b82f6", // blue
  "#a855f7", // purple
  "#64748b", // slate
];

export default function AnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setError(null);
        setLoading(true);
        const res = await fetch("/api/admin/analytics");
        if (!res.ok) {
          const body = await res.json().catch(() => null);
          throw new Error(
            body?.error || `Analytics failed (HTTP ${res.status})`,
          );
        }
        const json = (await res.json()) as AnalyticsResponse;
        setData(json);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load analytics");
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, []);

  const skeletonCard = (w?: string) => (
    <div
      className={`rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 ${w ?? ""}`}
    >
      <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-32 animate-pulse" />
      <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-24 mt-3 animate-pulse" />
      <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-48 mt-3 animate-pulse" />
    </div>
  );

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-10 max-w-6xl space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i}>{skeletonCard()}</div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 h-[320px] animate-pulse" />
          <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 h-[320px] animate-pulse" />
          <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 h-[320px] animate-pulse" />
          <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 h-[320px] animate-pulse" />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="container mx-auto px-4 py-10 max-w-6xl">
        <div className="rounded-2xl border border-red-200 dark:border-red-900/40 bg-red-50 dark:bg-red-950/20 p-6 text-sm text-red-700 dark:text-red-300">
          {error ?? "Analytics unavailable"}
        </div>
      </div>
    );
  }

  const { stats } = data;

  return (
    <div className="container mx-auto px-4 py-10 max-w-6xl space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white">
            Analytics
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Performance overview with charts and trends.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4">
          <p className="text-xs font-black uppercase tracking-wider text-gray-500">
            Total Orders
          </p>
          <p className="text-2xl font-black text-gray-900 dark:text-white mt-2">
            {stats.totalOrders}
          </p>
        </div>
        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4">
          <p className="text-xs font-black uppercase tracking-wider text-gray-500">
            Pending Orders
          </p>
          <p className="text-2xl font-black text-gray-900 dark:text-white mt-2">
            {stats.pendingOrders}
          </p>
        </div>
        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4">
          <p className="text-xs font-black uppercase tracking-wider text-gray-500">
            Accepted Orders
          </p>
          <p className="text-2xl font-black text-gray-900 dark:text-white mt-2">
            {stats.acceptedOrders}
          </p>
        </div>
        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4">
          <p className="text-xs font-black uppercase tracking-wider text-gray-500">
            Rejected Orders
          </p>
          <p className="text-2xl font-black text-gray-900 dark:text-white mt-2">
            {stats.rejectedOrders}
          </p>
        </div>
        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4">
          <p className="text-xs font-black uppercase tracking-wider text-gray-500">
            Total Machines
          </p>
          <p className="text-2xl font-black text-gray-900 dark:text-white mt-2">
            {stats.totalMachines}
          </p>
        </div>
        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4">
          <p className="text-xs font-black uppercase tracking-wider text-gray-500">
            Available Machines
          </p>
          <p className="text-2xl font-black text-gray-900 dark:text-white mt-2">
            {stats.availableMachines}
          </p>
        </div>
        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 lg:col-span-2">
          <p className="text-xs font-black uppercase tracking-wider text-gray-500">
            Total Customers
          </p>
          <p className="text-2xl font-black text-gray-900 dark:text-white mt-2">
            {stats.totalCustomers}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4">
          <p className="text-sm font-bold text-gray-800 dark:text-gray-200 mb-2">
            Orders per month
          </p>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.ordersPerMonth} margin={{ left: 0, right: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#d1d5db" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#6b7280" }} />
              <YAxis tick={{ fontSize: 12, fill: "#6b7280" }} />
              <Tooltip />
              <Bar dataKey="orders" fill={COLORS[0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4">
          <p className="text-sm font-bold text-gray-800 dark:text-gray-200 mb-2">
            Top requested machines
          </p>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={data.topMachines}
              layout="vertical"
              margin={{ left: 30 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#d1d5db" />
              <XAxis type="number" tick={{ fontSize: 12, fill: "#6b7280" }} />
              <YAxis
                type="category"
                dataKey="machineName"
                tick={{ fontSize: 12, fill: "#6b7280" }}
                width={120}
              />
              <Tooltip />
              <Bar dataKey="orders" fill={COLORS[1]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4">
          <p className="text-sm font-bold text-gray-800 dark:text-gray-200 mb-2">
            Order status distribution
          </p>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Tooltip />
              <Pie
                data={data.orderStatusDistribution}
                dataKey="count"
                nameKey="status"
                outerRadius={100}
              >
                {data.orderStatusDistribution.map((_, idx) => (
                  <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4">
          <p className="text-sm font-bold text-gray-800 dark:text-gray-200 mb-2">
            Customer growth by month
          </p>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={data.customerGrowth}
              margin={{ left: 0, right: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#d1d5db" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#6b7280" }} />
              <YAxis tick={{ fontSize: 12, fill: "#6b7280" }} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="customers"
                stroke={COLORS[2]}
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4">
          <p className="text-sm font-bold text-gray-800 dark:text-gray-200 mb-2">
            Machine availability distribution
          </p>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Tooltip />
              <Pie
                data={data.machineAvailabilityDistribution}
                dataKey="count"
                nameKey="availability_status"
                outerRadius={100}
              >
                {data.machineAvailabilityDistribution.map((_, idx) => (
                  <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 lg:col-span-2">
          <p className="text-sm font-bold text-gray-800 dark:text-gray-200 mb-2">
            Inquiry trends over time
          </p>
          <ResponsiveContainer width="100%" height={320}>
            <AreaChart data={data.inquiryTrends} margin={{ left: 0, right: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#d1d5db" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#6b7280" }} />
              <YAxis tick={{ fontSize: 12, fill: "#6b7280" }} />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="inquiries"
                stroke={COLORS[3]}
                fill={COLORS[3]}
                fillOpacity={0.2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
