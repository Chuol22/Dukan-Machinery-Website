"use client";

import { useState, useCallback, useEffect } from "react";
import { machinesData } from "@/data/machinesData";
import EnhancedVideo from "@/components/EnhancedVideo";

// ─── Types ────────────────────────────────────────────────────────────────────

interface VideoStatus {
  machineId: number;
  status: "loading" | "loaded" | "error";
  loadTime?: number;
  errorMsg?: string;
  startTime: number;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: VideoStatus["status"] }) {
  const styles = {
    loaded: "bg-green-100 text-green-800 border border-green-300",
    error: "bg-red-100 text-red-800 border border-red-300",
    loading: "bg-yellow-100 text-yellow-800 border border-yellow-300",
  };
  const labels = { loaded: "✓ Loaded", error: "✗ Error", loading: "⏳ Loading" };
  return (
    <span
      className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full ${styles[status]}`}
    >
      {labels[status]}
    </span>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function TestVideosPage() {
  // One status entry per machine, initialised to "loading"
  const [statuses, setStatuses] = useState<Record<number, VideoStatus>>(() =>
    Object.fromEntries(
      machinesData.map((m) => [
        m.id,
        { machineId: m.id, status: "loading", startTime: Date.now() },
      ])
    )
  );

  // Environment info (needs client to be available)
  const [envInfo, setEnvInfo] = useState({ url: "", userAgent: "" });

  useEffect(() => {
    setEnvInfo({
      url: window.location.href,
      userAgent: navigator.userAgent,
    });
  }, []);

  // ── Callbacks ────────────────────────────────────────────────────────────────

  const handleLoad = useCallback((machineId: number) => {
    setStatuses((prev) => {
      const existing = prev[machineId];
      return {
        ...prev,
        [machineId]: {
          ...existing,
          status: "loaded",
          loadTime: Date.now() - (existing?.startTime ?? Date.now()),
        },
      };
    });
  }, []);

  const handleError = useCallback(
    (
      machineId: number,
      err: { code: number; message: string; url: string }
    ) => {
      setStatuses((prev) => ({
        ...prev,
        [machineId]: {
          ...prev[machineId],
          status: "error",
          errorMsg: `Code ${err.code}: ${err.message}`,
        },
      }));
    },
    []
  );

  // ── Derived summary ───────────────────────────────────────────────────────

  const allStatuses = Object.values(statuses);
  const summary = {
    total: machinesData.length,
    loaded: allStatuses.filter((s) => s.status === "loaded").length,
    errors: allStatuses.filter((s) => s.status === "error").length,
    loading: allStatuses.filter((s) => s.status === "loading").length,
  };

  // ── Export ────────────────────────────────────────────────────────────────

  const exportReport = () => {
    const report = {
      timestamp: new Date().toISOString(),
      url: envInfo.url,
      userAgent: envInfo.userAgent,
      summary,
      statuses: allStatuses,
      machines: machinesData.map((m) => ({
        id: m.id,
        name: m.name,
        videoUrl: m.image,
        status: statuses[m.id]?.status ?? "loading",
        loadTime: statuses[m.id]?.loadTime,
        errorMsg: statuses[m.id]?.errorMsg,
      })),
    };
    const blob = new Blob([JSON.stringify(report, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `video-diagnostic-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* ── Page Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
              Video Delivery Diagnostics
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              All {summary.total} machine videos — real-time load status
            </p>
          </div>
          <button
            onClick={exportReport}
            className="inline-flex items-center gap-2 bg-green-700 hover:bg-green-800 text-white text-sm font-bold px-5 py-2.5 rounded-full uppercase tracking-wide transition shadow"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            Export JSON
          </button>
        </div>

        {/* ── Environment Info Panel ── */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-5 shadow-sm">
          <h2 className="text-xs font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-4">
            Environment
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {/* Summary counters */}
            <StatTile
              label="Total"
              value={summary.total}
              color="text-gray-900 dark:text-white"
            />
            <StatTile
              label="Loaded"
              value={summary.loaded}
              color="text-green-700 dark:text-green-400"
            />
            <StatTile
              label="Errors"
              value={summary.errors}
              color="text-red-600 dark:text-red-400"
            />
            {/* Deployment URL */}
            <div className="col-span-2 sm:col-span-1 lg:col-span-2">
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                Deployment URL
              </p>
              <p
                className="text-xs text-gray-800 dark:text-gray-200 font-mono truncate"
                title={envInfo.url}
              >
                {envInfo.url || "—"}
              </p>
            </div>
          </div>
          {/* User Agent — full row */}
          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
              User Agent
            </p>
            <p
              className="text-xs text-gray-600 dark:text-gray-300 font-mono truncate"
              title={envInfo.userAgent}
            >
              {envInfo.userAgent
                ? envInfo.userAgent.slice(0, 120) +
                  (envInfo.userAgent.length > 120 ? "…" : "")
                : "—"}
            </p>
          </div>
        </div>

        {/* ── Progress Bar ── */}
        {summary.loading > 0 && (
          <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2 overflow-hidden">
            <div
              className="bg-green-700 h-2 rounded-full transition-all duration-500"
              style={{
                width: `${Math.round(
                  ((summary.loaded + summary.errors) / summary.total) * 100
                )}%`,
              }}
            />
          </div>
        )}
        {summary.loading === 0 && (
          <div className="flex items-center gap-2 text-sm font-semibold text-green-700 dark:text-green-400">
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            All {summary.total} videos resolved — {summary.loaded} loaded,{" "}
            {summary.errors} errors
          </div>
        )}

        {/* ── Video Grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {machinesData.map((machine) => {
            const s = statuses[machine.id];
            const poster =
              machine.gallery?.[0] ??
              "/images/machines/Custom Industrial Machines.jpg";

            return (
              <div
                key={machine.id}
                data-machine-id={machine.id}
                data-status={s?.status ?? "loading"}
                className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden shadow-sm flex flex-col"
              >
                {/* Video thumbnail area */}
                <div className="relative bg-gray-100 dark:bg-gray-800 aspect-video">
                  <EnhancedVideo
                    src={machine.image}
                    poster={poster}
                    machineId={machine.id}
                    machineName={machine.name}
                    autoPlay={false}
                    muted
                    loop={false}
                    controls
                    playsInline
                    className="w-full h-full"
                    style={{ height: "100%" }}
                    onLoadSuccess={() => handleLoad(machine.id)}
                    onLoadError={(err) => handleError(machine.id, err)}
                    enableMonitoring={false}
                    enableRetry
                    maxRetries={3}
                  />
                </div>

                {/* Card body */}
                <div className="p-4 flex flex-col gap-2 flex-1">
                  {/* Machine ID + name */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <span className="text-xs font-black text-gray-400 dark:text-gray-500">
                        #{machine.id}
                      </span>
                      <h3
                        className="text-sm font-bold text-gray-900 dark:text-white leading-snug truncate"
                        title={machine.name}
                      >
                        {machine.name}
                      </h3>
                    </div>
                    {/* Status badge */}
                    <StatusBadge status={s?.status ?? "loading"} />
                  </div>

                  {/* Video URL */}
                  <p
                    className="text-xs text-gray-400 dark:text-gray-500 font-mono truncate"
                    title={machine.image}
                  >
                    {machine.image.replace(
                      "https://res.cloudinary.com/dusezlxj0/video/upload/",
                      "…/upload/"
                    )}
                  </p>

                  {/* Load time or error */}
                  {s?.status === "loaded" && s.loadTime !== undefined && (
                    <p className="text-xs text-green-700 dark:text-green-400 font-semibold">
                      Loaded in {s.loadTime} ms
                    </p>
                  )}
                  {s?.status === "error" && s.errorMsg && (
                    <p className="text-xs text-red-600 dark:text-red-400 font-semibold break-words">
                      {s.errorMsg}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Footer ── */}
        <p className="text-center text-xs text-gray-400 dark:text-gray-600 pb-6">
          DKM Diagnostic — {new Date().toLocaleDateString()} — {summary.total}{" "}
          machines
        </p>
      </div>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatTile({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div>
      <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-0.5">
        {label}
      </p>
      <p className={`text-2xl font-black tabular-nums ${color}`}>{value}</p>
    </div>
  );
}
