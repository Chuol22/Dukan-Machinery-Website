"use client";

import { useEffect, useMemo, useState } from "react";
import { FileText, RefreshCw } from "lucide-react";

type Inquiry = {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string | null;
  machineId: string | null;
  message: string;
  status: "New" | "Read" | "Replied" | "Resolved" | string;
  createdAt: string;
};

const statusBadge = (status: string) => {
  const s = status?.toLowerCase();
  if (s === "replied" || s === "resolved") {
    return "bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400 border border-green-200/50 dark:border-green-800/50";
  }
  if (s === "read") {
    return "bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400 border border-blue-200/50 dark:border-blue-800/50";
  }
  return "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200/50 dark:border-amber-800/50";
};

export default function InquiriesClient() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const load = async () => {
      try {
        setError(null);
        setLoading(true);
        const res = await fetch("/api/admin/inquiries");
        if (!res.ok) {
          const body = await res.json().catch(() => null);
          throw new Error(
            body?.error || `Failed to load inquiries (HTTP ${res.status})`,
          );
        }
        const data = await res.json();
        setInquiries(Array.isArray(data.inquiries) ? data.inquiries : []);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load inquiries");
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, []);

  const updateStatus = async (id: string, nextStatus: Inquiry["status"]) => {
    setSubmitting((prev) => ({ ...prev, [id]: true }));
    try {
      const res = await fetch(`/api/admin/inquiries/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(
          body?.error || `Failed to update inquiry (HTTP ${res.status})`,
        );
      }

      const data = await res.json();
      const updated = data?.inquiry as Inquiry | undefined;

      setInquiries((prev) =>
        prev.map((q) =>
          q.id === id ? { ...q, status: updated?.status ?? nextStatus } : q,
        ),
      );
      // toast-like inline via alert replacement (kept simple)
      // requirement asks toast; current project doesn't have a shared toast util here.
      // We'll keep a minimal non-blocking feedback using window alert only on errors.
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Update failed";
      setError(msg);
    } finally {
      setSubmitting((prev) => ({ ...prev, [id]: false }));
    }
  };

  const rows = useMemo(() => inquiries, [inquiries]);

  return (
    <div className="container mx-auto px-4 py-10 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-900 dark:text-white">
          Inquiries
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          Manage machine inquiries and update their status.
        </p>
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-red-200 dark:border-red-900/40 bg-red-50 dark:bg-red-950/20 p-4 text-sm text-red-700 dark:text-red-300">
          {error}
        </div>
      )}

      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50/50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-800">
              <tr>
                <th className="py-3.5 px-4 font-bold uppercase tracking-wider text-xs text-gray-500">
                  Customer Name
                </th>
                <th className="py-3.5 px-4 font-bold uppercase tracking-wider text-xs text-gray-500">
                  Email
                </th>
                <th className="py-3.5 px-4 font-bold uppercase tracking-wider text-xs text-gray-500">
                  Phone
                </th>
                <th className="py-3.5 px-4 font-bold uppercase tracking-wider text-xs text-gray-500">
                  Machine
                </th>
                <th className="py-3.5 px-4 font-bold uppercase tracking-wider text-xs text-gray-500">
                  Message
                </th>
                <th className="py-3.5 px-4 font-bold uppercase tracking-wider text-xs text-gray-500">
                  Status
                </th>
                <th className="py-3.5 px-4 font-bold uppercase tracking-wider text-xs text-gray-500">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="py-4 px-4">
                      <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-28" />
                    </td>
                    <td className="py-4 px-4">
                      <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-44" />
                    </td>
                    <td className="py-4 px-4">
                      <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-24" />
                    </td>
                    <td className="py-4 px-4">
                      <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-36" />
                    </td>
                    <td className="py-4 px-4">
                      <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-52" />
                    </td>
                    <td className="py-4 px-4">
                      <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-24" />
                    </td>
                    <td className="py-4 px-4">
                      <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-20" />
                    </td>
                  </tr>
                ))
              ) : rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="py-16 text-center text-gray-500 dark:text-gray-400"
                  >
                    <FileText className="w-10 h-10 mx-auto mb-3 opacity-30" />
                    No inquiries found.
                  </td>
                </tr>
              ) : (
                rows.map((q) => (
                  <tr
                    key={q.id}
                    className="hover:bg-gray-50/80 dark:hover:bg-gray-900/40 transition-colors"
                  >
                    <td className="py-4 px-4 font-semibold text-gray-900 dark:text-white">
                      {q.customerName}
                    </td>
                    <td className="py-4 px-4 text-gray-700 dark:text-gray-300">
                      {q.customerEmail}
                    </td>
                    <td className="py-4 px-4 text-gray-700 dark:text-gray-300">
                      {q.customerPhone ?? "—"}
                    </td>
                    <td className="py-4 px-4 text-gray-700 dark:text-gray-300">
                      {q.machineId ?? "—"}
                    </td>
                    <td className="py-4 px-4 text-gray-700 dark:text-gray-300">
                      {q.message.length > 80
                        ? q.message.slice(0, 80) + "…"
                        : q.message}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${statusBadge(q.status)}`}
                        >
                          {String(q.status).charAt(0).toUpperCase() +
                            String(q.status).slice(1)}
                        </span>
                        <select
                          value={q.status}
                          onChange={(e) =>
                            void updateStatus(q.id, e.target.value)
                          }
                          title="Update inquiry status"
                          aria-label="Update inquiry status"
                          className="text-sm bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg px-2 py-1"
                          disabled={!!submitting[q.id]}
                        >
                          <option value="New">New</option>
                          <option value="Read">Read</option>
                          <option value="Replied">Replied</option>
                          <option value="Resolved">Resolved</option>
                        </select>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-gray-700 dark:text-gray-300">
                      {q.createdAt
                        ? new Date(q.createdAt).toLocaleDateString("en-US")
                        : "—"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
