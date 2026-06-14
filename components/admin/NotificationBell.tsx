"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Bell } from "lucide-react";

type Notification = {
  id: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  created_at: string;
  order_id?: string | null;
};

type NotificationsResponse = {
  notifications?: Notification[];
};

const truncate = (s: string, max = 80) => {
  const str = String(s ?? "");
  if (str.length <= max) return str;
  return str.slice(0, max) + "…";
};

const relTime = (iso: string) => {
  const d = new Date(iso);
  const diffMs = Date.now() - d.getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} minutes ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hours ago`;
  const days = Math.floor(hours / 24);
  return `${days} days ago`;
};

const getNotificationLink = (n: Notification) => {
  if (n.order_id) return `/admin/orders?order=${n.order_id}`;
  return "/admin/notifications";
};

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchNotifications = async () => {
      try {
        setError(null);
        const res = await fetch("/api/admin/notifications");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = (await res.json()) as NotificationsResponse;
        if (!mounted) return;
        setNotifications(
          Array.isArray(data.notifications) ? data.notifications : [],
        );
      } catch (e) {
        if (!mounted) return;
        setError(
          e instanceof Error ? e.message : "Failed to load notifications",
        );
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    };

    void fetchNotifications();
    const t = setInterval(() => {
      void fetchNotifications();
    }, 30000);

    return () => {
      mounted = false;
      clearInterval(t);
    };
  }, []);

  const unreadCount = useMemo(() => {
    return notifications.filter((n) => !n.read).length;
  }, [notifications]);

  const cappedBadge = useMemo(() => {
    if (unreadCount <= 9) return String(unreadCount);
    return "9+";
  }, [unreadCount]);

  const latest = useMemo(() => {
    return [...notifications]
      .sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      )
      .slice(0, 5);
  }, [notifications]);

  const markReadAndNavigate = async (n: Notification) => {
    try {
      await fetch("/api/admin/notifications", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notificationId: n.id }),
      });
    } catch {
      // ignore
    } finally {
      setNotifications((prev) =>
        prev.map((x) => (x.id === n.id ? { ...x, read: true } : x)),
      );
      setOpen(false);
      window.location.href = getNotificationLink(n);
    }
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="relative p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-orange-500 text-[9px] font-black text-white">
            {cappedBadge}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-[340px] max-w-[90vw] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-xl z-50">
          <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-800">
            <p className="text-xs font-black uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Latest Notifications
            </p>
          </div>

          {loading && (
            <div className="p-4 space-y-3">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="h-10 rounded-lg bg-gray-100 dark:bg-gray-800 animate-pulse"
                />
              ))}
            </div>
          )}

          {!loading && error && (
            <div className="p-4 text-sm text-red-600 dark:text-red-400">
              {error}
            </div>
          )}

          {!loading && !error && latest.length === 0 && (
            <div className="p-4 text-sm text-gray-500 dark:text-gray-400">
              No notifications
            </div>
          )}

          {!loading && !error && latest.length > 0 && (
            <div className="max-h-[360px] overflow-y-auto">
              {latest.map((n) => (
                <button
                  key={n.id}
                  onClick={() => void markReadAndNavigate(n)}
                  className="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-start gap-3"
                >
                  <div
                    className={`h-2 w-2 rounded-full mt-2 ${n.read ? "bg-gray-300 dark:bg-gray-700" : "bg-orange-500"}`}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                      {n.title}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">
                      {truncate(n.message, 80)}
                    </div>
                    <div className="text-[10px] text-gray-400 dark:text-gray-500 mt-2">
                      {relTime(n.created_at)}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-800">
            <Link
              href="/admin/notifications"
              onClick={() => setOpen(false)}
              className="text-sm font-semibold text-orange-600 dark:text-orange-400 hover:underline"
            >
              View all notifications
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
