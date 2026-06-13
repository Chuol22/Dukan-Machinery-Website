// import AnalyticsDashboard from './analytics/AnalyticsDashboard';
import Link from 'next/link';
import {
  ShoppingCart,
  Package,
  Bell,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  ArrowRight,
  Plus,
} from 'lucide-react';



export default function AdminPage() {
  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-green-300  rounded-2xl p-6 md:p-8 text-white shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl text-organe-500 md:text-3xl font-black 
            uppercase tracking-tight">
              Dashboard
            </h2>
            <p className="mt-1 text-gray-400 dark:text-gray-200 text-sm md:text-base">
              Review, accept, and manage all incoming order requests
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Link
              href="/admin/notifications"
              className="flex items-center space-x-2 px-4 py-2 rounded-xl 
              bg-green-500 hover:bg-green-600 transition-colors text-sm font-semibold"
            >
              <Bell className="w-4 h-4" />
              <span>Notifications</span>
            </Link>
            <Link
              href="/admin/machines/new"
              className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 transition-colors text-sm font-semibold shadow-lg"
            >
              <Plus className="w-4 h-4" />
              <span>Add Machine</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <QuickStatCard
          icon={<ShoppingCart className="w-5 h-5 text-orange-500" />}
          label="Total Orders"
          value="—"
          sublabel="View all in Orders tab"
          bg="bg-orange-50 dark:bg-orange-950/20"
          href="/admin/orders"
        />
        <QuickStatCard
          icon={<Clock className="w-5 h-5 text-amber-500" />}
          label="Pending"
          value="—"
          sublabel="Awaiting review"
          bg="bg-amber-50 dark:bg-amber-950/20"
          href="/admin/orders"
        />
        <QuickStatCard
          icon={<CheckCircle className="w-5 h-5 text-green-500" />}
          label="Accepted"
          value="—"
          sublabel="Confirmed orders"
          bg="bg-green-50 dark:bg-green-950/20"
          href="/admin/orders"
        />
        <QuickStatCard
          icon={<XCircle className="w-5 h-5 text-red-500" />}
          label="Rejected"
          value="—"
          sublabel="Declined orders"
          bg="bg-red-50 dark:bg-red-950/20"
          href="/admin/orders"
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-150 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">
          <h3 className="text-xs font-black text-gray-700 dark:text-gray-300 uppercase tracking-wider">
            Quick Actions
          </h3>
        </div>
        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <QuickActionCard
            href="/admin/orders"
            icon={<ShoppingCart className="w-5 h-5" />}
            label="View All Orders"
            desc="Review pending and recent orders"
            color="orange"
          />
          <QuickActionCard
            href="/admin/machines"
            icon={<Package className="w-5 h-5" />}
            label="Manage Machines"
            desc="Edit or remove machine listings"
            color="blue"
          />
          <QuickActionCard
            href="/admin/machines/new"
            icon={<Plus className="w-5 h-5" />}
            label="Add New Machine"
            desc="List a new machine for sale"
            color="green"
          />
          <QuickActionCard
            href="/admin/notifications"
            icon={<Bell className="w-5 h-5" />}
            label="Notifications"
            desc="View order alerts and activity"
            color="purple"
          />
        </div>
      </div>

      {/* Info Card */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5">
        <div className="flex items-start space-x-4">
          <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-950/50 flex items-center justify-center shrink-0">
            <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <h4 className="font-bold text-gray-900 dark:text-white">How Orders Work</h4>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              When a customer places an order, it appears as <strong>Pending</strong>. Review the order details,
              then click <strong>Accept</strong> to confirm or <strong>Reject</strong> to decline.
              All notifications appear in the Notifications section and are also sent via email.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function QuickStatCard({
  icon,
  label,
  value,
  sublabel,
  bg,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sublabel: string;
  bg: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className={`${bg} rounded-xl p-4 border border-gray-150 dark:border-gray-800 hover:opacity-90 transition-opacity`}
    >
      <div className="flex items-center space-x-3">
        <div className="shrink-0">{icon}</div>
        <div>
          <p className="text-2xl font-black text-gray-900 dark:text-white">{value}</p>
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">{label}</p>
          <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">{sublabel}</p>
        </div>
      </div>
    </Link>
  );
}

function QuickActionCard({
  href,
  icon,
  label,
  desc,
  color,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  desc: string;
  color: 'orange' | 'blue' | 'green' | 'purple';
}) {
  const colorMap = {
    orange: 'bg-orange-50 dark:bg-orange-950/20 text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-900/30 hover:bg-orange-100 dark:hover:bg-orange-950/40',
    blue: 'bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-950/40',
    green: 'bg-green-50 dark:bg-green-950/20 text-green-600 dark:text-green-400 border-green-200 dark:border-green-900/30 hover:bg-green-100 dark:hover:bg-green-950/40',
    purple: 'bg-purple-50 dark:bg-purple-950/20 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-900/30 hover:bg-purple-100 dark:hover:bg-purple-950/40',
  };

  return (
    <Link
      href={href}
      className={`flex items-center space-x-3 p-4 rounded-xl border transition-colors ${colorMap[color]}`}
    >
      <div className="shrink-0">{icon}</div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-gray-900 dark:text-white">{label}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">{desc}</p>
      </div>
      <ArrowRight className="w-4 h-4 text-gray-400 shrink-0" />
    </Link>
  );
}