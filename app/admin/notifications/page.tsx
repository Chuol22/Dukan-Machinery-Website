"use client";

// Admin notifications inbox — read/unread filter, mark read, delete
import { useEffect, useState, useMemo } from "react";
import {
  Bell,
  Check,
  Clock,
  X,
  AlertTriangle,
  ShoppingCart,
  Package,
  Info,
  Trash2,
  RefreshCw,
} from "lucide-react";

type OrderNotification = {
  id: string;
  type:
    | "new_order"
    | "order_accepted"
    | "order_rejected"
    | "inventory_alert"
    | string;
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
  orderId?: string | null;
  totalAmount?: number | null;
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<OrderNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"ALL" | "UNREAD">("ALL");

  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/admin/notifications");
        if (res.ok) {
          const data = await res.json();
          type IncomingNotif = {
            id?: string;
            type?: string;
            title?: string;
            message?: string;
            created_at?: string | Date;
            read?: boolean;
            order_id?: string;
            totalAmount?: number;
          };

          const notifs: OrderNotification[] = (data.notifications ?? [])
            .map((notif: IncomingNotif) => ({
              id: String(notif.id ?? ""),
              type: String(notif.type ?? ""),
              title: String(notif.title ?? ""),
              message: String(notif.message ?? ""),
              createdAt: String(notif.created_at ?? ""),
              read: Boolean(notif.read),
              orderId: notif.order_id == null ? null : String(notif.order_id),
              totalAmount:
                typeof notif.totalAmount === "number"
                  ? notif.totalAmount
                  : null,
            }))
            .filter((n: OrderNotification) => Boolean(n.id));
          setNotifications(notifs);
        }
      } catch (e) {
        console.error("Failed to load notifications", e);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();

    // Poll so admin sees new notifications without reload.
    const interval = setInterval(() => {
      fetchNotifications();
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  const filtered = useMemo(() => {
    if (filter === "UNREAD") return notifications.filter((n) => !n.read);
    return notifications;
  }, [notifications, filter]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = async () => {
    try {
      await fetch("/api/admin/notifications", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ markAll: true }),
      });
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (e) {
      console.error("Failed to mark all as read", e);
    }
  };

  const markRead = async (id: string) => {
    try {
      await fetch("/api/admin/notifications", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notificationId: id }),
      });
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
      );
    } catch (e) {
      console.error("Failed to mark as read", e);
    }
  };

  const dismiss = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/notifications/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
      } else {
        console.error("Failed to dismiss notification");
      }
    } catch (e) {
      console.error("Failed to dismiss notification", e);
    }
  };

  const safeType = (t: string) => String(t ?? "").toLowerCase();

  const getIcon = (type: OrderNotification["type"]) => {
    const t = safeType(String(type));
    if (t === "new_order")
      return <ShoppingCart className="w-5 h-5 text-orange-500" />;
    if (t === "order_accepted")
      return <Check className="w-5 h-5 text-green-500" />;
    if (t === "order_rejected") return <X className="w-5 h-5 text-red-500" />;
    if (t === "inventory_alert")
      return <AlertTriangle className="w-5 h-5 text-amber-500" />;
    return <Bell className="w-5 h-5 text-blue-500" />;
  };

  const getBorderColor = (type: OrderNotification["type"]) => {
    const t = safeType(type);
    if (t === "new_order") return "border-l-orange-500";
    if (t === "order_accepted") return "border-l-green-500";
    if (t === "order_rejected") return "border-l-red-500";
    if (t === "inventory_alert") return "border-l-amber-500";
    return "border-l-blue-500";
  };

  const formatTime = (dateStr: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight">
            Notifications
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {unreadCount > 0
              ? `${unreadCount} unread notification${unreadCount !== 1 ? "s" : ""}`
              : "All caught up — no unread notifications"}
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as "ALL" | "UNREAD")}
            aria-label="Notification filter"
            className="px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="ALL">All Notifications</option>
            <option value="UNREAD">Unread Only</option>
          </select>
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="px-4 py-2 text-sm font-semibold rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              Mark all read
            </button>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          icon={<ShoppingCart className="w-5 h-5 text-orange-500" />}
          label="New Orders"
          value={
            notifications.filter((n) => safeType(n.type) === "new_order").length
          }
          bg="bg-orange-50 dark:bg-orange-950/20"
        />
        <StatCard
          icon={<Check className="w-5 h-5 text-green-500" />}
          label="Accepted"
          value={
            notifications.filter((n) => safeType(n.type) === "order_accepted")
              .length
          }
          bg="bg-green-50 dark:bg-green-950/20"
        />
        <StatCard
          icon={<X className="w-5 h-5 text-red-500" />}
          label="Rejected"
          value={
            notifications.filter((n) => safeType(n.type) === "order_rejected")
              .length
          }
          bg="bg-red-50 dark:bg-red-950/20"
        />
        <StatCard
          icon={<AlertTriangle className="w-5 h-5 text-amber-500" />}
          label="Inventory Alerts"
          value={
            notifications.filter((n) => safeType(n.type) === "inventory_alert")
              .length
          }
          bg="bg-amber-50 dark:bg-amber-950/20"
        />
        <StatCard
          icon={<Bell className="w-5 h-5 text-blue-500" />}
          label="Unread"
          value={unreadCount}
          bg="bg-blue-50 dark:bg-blue-950/20"
        />
      </div>

      {/* Notifications List */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-gray-150 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">
          <h3 className="text-xs font-black text-gray-700 dark:text-gray-300 uppercase tracking-wider">
            {filter === "UNREAD" ? "Unread" : "All"} Notifications
          </h3>
        </div>

        {loading ? (
          <div className="p-6 space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-start space-x-4 animate-pulse">
                <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-800 shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/3" />
                  <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-16 text-center">
            <Bell className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
            <p className="text-gray-500 dark:text-gray-400 font-semibold">
              {filter === "UNREAD"
                ? "No unread notifications."
                : "No notifications to show."}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-150 dark:divide-gray-800">
            {filtered.map((notif) => (
              <div
                key={notif.id}
                className={`flex items-start space-x-4 p-5 hover:bg-gray-50/50 dark:hover:bg-gray-900/30 transition-colors border-l-4 ${getBorderColor(notif.type)} ${
                  !notif.read ? "bg-orange-50/20 dark:bg-orange-950/5" : ""
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center shrink-0 mt-0.5">
                  {getIcon(notif.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p
                        className={`text-sm font-bold ${
                          !notif.read
                            ? "text-gray-900 dark:text-white"
                            : "text-gray-600 dark:text-gray-400"
                        }`}
                      >
                        {notif.title}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
                        {notif.message}
                      </p>
                      <div className="flex items-center space-x-3 mt-2 text-xs text-gray-400 dark:text-gray-500">
                        <span className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{formatTime(notif.createdAt)}</span>
                        </span>
                        {typeof notif.totalAmount === "number" &&
                          notif.totalAmount > 0 && (
                            <span className="font-semibold text-orange-500">
                              ETB {notif.totalAmount.toLocaleString()}
                            </span>
                          )}
                        {notif.orderId && (
                          <a
                            href={`/admin/orders?order=${notif.orderId}`}
                            className="flex items-center space-x-1 text-blue-500 hover:text-blue-600 hover:underline"
                          >
                            <ShoppingCart className="w-3 h-3" />
                            <span>View Order</span>
                          </a>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-1 shrink-0">
                      {!notif.read && (
                        <span
                          className="w-2 h-2 rounded-full bg-orange-500"
                          title="Unread"
                        />
                      )}
                      <button
                        onClick={() => markRead(notif.id)}
                        title="Mark as read"
                        className="p-1.5 rounded-lg text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/20 transition-colors"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => dismiss(notif.id)}
                        title="Dismiss"
                        className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  bg,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  bg: string;
}) {
  return (
    <div
      className={`${bg} rounded-xl p-4 border border-gray-150 dark:border-gray-800`}
    >
      <div className="flex items-center space-x-3">
        <div className="shrink-0">{icon}</div>
        <div>
          <p className="text-2xl font-black text-gray-900 dark:text-white">
            {value}
          </p>
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">
            {label}
          </p>
        </div>
      </div>
    </div>
  );
}
