'use client';

// Admin shell — auth guard, sidebar nav, session, and pending order badge
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  LogOut,
  User,
  LayoutDashboard,
  ShoppingCart,
  Package,
  Bell,
  Globe,
  Settings,
  Plus,
  ChevronRight,
  Tag,
  MessageSquare,
  FileText,
  RefreshCw,
  Menu,
  X,
  TrendingUp,
  Clock,
  CheckCircle,
  TrendingDown,
} from 'lucide-react';

import NotificationBell from '@/components/admin/NotificationBell';

type UserSession = {
  name: string;
  email: string;
  role: 'SUPER_ADMIN' | 'SALES_OFFICER';
};

type NavItem = {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: number;
  section: string;
};

export default function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isLoginPage = pathname === '/admin/login';
  const [user, setUser] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(!isLoginPage);
  const [loggingOut, setLoggingOut] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);

  // Verify session on mount; redirect to login if unauthenticated
  useEffect(() => {
    if (isLoginPage) return;

    const checkSession = async () => {
      try {
        const res = await fetch('/api/admin/auth/session');
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        } else {
          router.push('/admin/login');
        }
      } catch (err) {
        console.error('Session check failed', err);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, [pathname, isLoginPage, router]);

  // Fetch pending orders count for sidebar badge
  useEffect(() => {
    if (isLoginPage || loading) return;

    const fetchPending = async () => {
      try {
        const res = await fetch('/api/admin/orders');
        if (res.ok) {
          const data = await res.json();
          const pending = (data.orders ?? []).filter((o: { status: string }) => {
            const s = String(o.status ?? '').trim().toLowerCase();
            return s === 'pending' || s === 'new' || s === 'in_review' || s === 'review';
          }).length;
          setPendingCount(pending);
        }
      } catch {
        // silently ignore
      }
    };

    fetchPending();
    const interval = setInterval(fetchPending, 30000);
    return () => clearInterval(interval);
  }, [isLoginPage, loading]);

  const handleLogout = async () => {
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      const res = await fetch('/api/admin/auth/logout', { method: 'POST' });
      if (res.ok) {
        router.push('/admin/login');
        router.refresh();
      }
    } catch (err) {
      console.error('Logout failed', err);
    } finally {
      setLoggingOut(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="flex flex-col items-center space-y-4">
          <RefreshCw className="w-8 h-8 text-orange-500 animate-spin" />
          <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">Loading your workspace...</p>
        </div>
      </div>
    );
  }

  if (isLoginPage) {
    return <>{children}</>;
  }

  const navItems: NavItem[] = [
    { label: 'Dashboard', href: '/admin', icon: LayoutDashboard, section: 'dashboard' },
    { label: 'Orders', href: '/admin/orders', icon: ShoppingCart, badge: pendingCount > 0 ? pendingCount : undefined, section: 'orders' },
    { label: 'Customers', href: '/admin/customers', icon: User, section: 'orders' },
    { label: 'Inquiries', href: '/admin/inquiries', icon: MessageSquare, section: 'orders' },
    { label: 'Quotations', href: '/admin/quotations', icon: FileText, section: 'orders' },
    { label: 'Analytics', href: '/admin/analytics', icon: TrendingUp, section: 'dashboard' },
    { label: 'Manage Machines', href: '/admin/machines', icon: Package, section: 'machines' },
    { label: 'Categories', href: '/admin/categories', icon: Tag, section: 'machines' },
    { label: 'Add Machine', href: '/admin/machines/new', icon: Plus, section: 'machines' },
    { label: 'Notifications', href: '/admin/notifications', icon: Bell, section: 'notifications' },
  ];

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin' || pathname === '/admin/orders';
    if (href === '/admin/orders') return pathname === '/admin/orders';
    if (href === '/admin/customers') return pathname.startsWith('/admin/customers');
    if (href === '/admin/inquiries') return pathname.startsWith('/admin/inquiries');
    if (href === '/admin/quotations') return pathname.startsWith('/admin/quotations');
    if (href === '/admin/analytics') return pathname === '/admin/analytics';
    if (href === '/admin/machines') return pathname === '/admin/machines';
    if (href === '/admin/categories') return pathname.startsWith('/admin/categories');
    if (href === '/admin/machines/new') return pathname === '/admin/machines/new';
    if (href === '/admin/notifications') return pathname === '/admin/notifications';
    return pathname === href;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col md:flex-row">
      {/* Mobile Top Nav Bar */}
      <div className="md:hidden flex h-16 items-center justify-between px-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50 w-full shrink-0">
        <Link href="/admin" className="flex items-center space-x-2 shrink-0">
          <div className="flex flex-col leading-tight">
            <span className="text-2xl font-black tracking-tighter text-green-700 dark:text-gray-100 uppercase">
              DUKAN ADMIN
            </span>
            <span className="text-[5px] font-black text-orange-600 dark:text-orange-400 uppercase tracking-[0.25em]">
              Machinery
            </span>
          </div>
        </Link>
        <div className="flex items-center space-x-2">
          {pendingCount > 0 && (
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </span>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-48 bg-gray-300 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col justify-between transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:h-screen shrink-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col flex-1 overflow-y-auto">
          {/* Logo */}
          <div className="hidden md:flex h-16 items-center px-6 border-b border-gray-200 dark:border-gray-800">
            <Link href="/admin" className="flex items-center space-x-2 shrink-0">
              <div className="flex flex-col leading-tight">
                <span className="text-2xl font-black tracking-tighter text-green-700 dark:text-gray-100 uppercase">
                  DUKAN ADMIN
                </span>
                <span className="text-[5px] font-black text-orange-600 dark:text-orange-400 uppercase tracking-[0.25em]">
                  Machinery
                </span>
              </div>
            </Link>
          </div>

          <nav className="p-4 space-y-1 flex-1">
            <div className="text-[10px] font-black tracking-wider text-gray-400 dark:text-gray-500 uppercase px-3 mb-2 mt-2">
              Overview
            </div>
            <NavLink item={navItems[0]} isActive={isActive(navItems[0].href)} onClick={() => setSidebarOpen(false)} />
            <NavLink item={navItems[4]} isActive={isActive(navItems[4].href)} onClick={() => setSidebarOpen(false)} />

            <div className="text-[10px] font-black tracking-wider text-gray-500 dark:text-gray-400 uppercase px-3 mb-2 mt-4">
              Sales &amp; Orders
            </div>
            <NavLink item={navItems[1]} isActive={isActive(navItems[1].href)} onClick={() => setSidebarOpen(false)} badge={pendingCount > 0 ? pendingCount : undefined} />
            <NavLink item={navItems[2]} isActive={isActive(navItems[2].href)} onClick={() => setSidebarOpen(false)} />
            <NavLink item={navItems[3]} isActive={isActive(navItems[3].href)} onClick={() => setSidebarOpen(false)} />

            <div className="text-[10px] font-black tracking-wider text-gray-500 dark:text-gray-400 uppercase px-3 mb-2 mt-4">
              Catalog &amp; Machines
            </div>
            <NavLink item={navItems[5]} isActive={isActive(navItems[5].href)} onClick={() => setSidebarOpen(false)} />
            <NavLink item={navItems[6]} isActive={isActive(navItems[6].href)} onClick={() => setSidebarOpen(false)} />
            <NavLink item={navItems[7]} isActive={isActive(navItems[7].href)} onClick={() => setSidebarOpen(false)} />

            <div className="text-[10px] font-black tracking-wider text-gray-500 dark:text-gray-400 uppercase px-3 mb-2 mt-4">
              Alerts &amp; Activity
            </div>
            <NavLink item={navItems[8]} isActive={isActive(navItems[8].href)} onClick={() => setSidebarOpen(false)} />

            {/* Quick Links */}
            <div className="text-[10px] font-black tracking-wider text-gray-500 dark:text-gray-400 uppercase px-3 mb-2 mt-4">
              Quick Access
            </div>
            <Link
              href="/machines"
              onClick={() => setSidebarOpen(false)}
              className="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
            >
              <Package className="w-5 h-5" />
              <span>View Machines</span>
            </Link>
            <Link
              href="/"
              onClick={() => setSidebarOpen(false)}
              className="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
            >
              <Globe className="w-5 h-5" />
              <span>Main Site</span>
            </Link>
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-800 space-y-4">
          {user && (
            <div className="flex items-center space-x-3 px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800">
              <div className="w-9 h-9 rounded-full bg-orange-100 dark:bg-orange-950/50 flex items-center justify-center text-orange-600 dark:text-orange-400 border border-orange-200/50 dark:border-orange-900/50 shrink-0">
                <User className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-gray-900 dark:text-white truncate">{user.name}</p>
                <div className="flex items-center space-x-1 mt-0.5">
                  <span className="text-[9px] font-black uppercase text-green-700 dark:text-green-400">
                    {user.role === 'SUPER_ADMIN' ? 'Super Admin' : 'Sales Officer'}
                  </span>
                </div>
              </div>
            </div>
          )}

          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all cursor-pointer disabled:opacity-50 border border-red-200 dark:border-red-900/30"
          >
            <LogOut className="w-4 h-4" />
            <span>{loggingOut ? 'Logging out...' : 'Logout'}</span>
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 backdrop-blur-xs md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:h-screen md:overflow-y-auto min-w-0">
        {/* Sticky Header */}
        <header className="hidden md:block sticky top-0 z-10 w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
          <div className="px-6 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <h1 className="text-lg font-bold text-gray-800 dark:text-white">
                {pathname === '/admin' || pathname === '/admin/orders'
                  ? 'Orders Dashboard'
                  : pathname.startsWith('/admin/customers')
                  ? 'Customers'
                  : pathname.startsWith('/admin/inquiries')
                  ? 'Inquiries'
                  : pathname === '/admin/analytics'
                  ? 'Analytics'
                  : pathname === '/admin/machines' || pathname === '/admin/machines/new'
                  ? 'Machine Management'
                  : pathname === '/admin/notifications'
                  ? 'Notifications'
                  : 'Admin Portal'}
              </h1>
              {pendingCount > 0 && (
                <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 border border-amber-200/50 dark:border-amber-800/50">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                  <span>{pendingCount} Pending</span>
                </span>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <NotificationBell />
              {user && (
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-500 dark:text-gray-400 hidden lg:block">
                    {user.name}
                  </span>
                  <span className="text-xs font-black tracking-wider uppercase bg-green-50 dark:bg-green-950/50 text-green-700 dark:text-green-400 px-2 py-0.5 rounded border border-green-200/50 dark:border-green-900/50">
                    {user.role === 'SUPER_ADMIN' ? 'Super Admin' : 'Sales Officer'}
                  </span>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 md:p-8">
          {children}
        </main>

        {/* Footer */}
        <footer className="w-full py-4 px-6 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 text-center text-xs text-gray-500 dark:text-gray-400 mt-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} Dukan Machinery. All rights reserved.</p>
          <span className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded font-mono text-[10px]">
            Access: {user?.role === 'SUPER_ADMIN' ? 'Full Control' : 'View & Update'}
          </span>
        </footer>
      </div>
    </div>
  );
}

function NavLink({
  item,
  isActive,
  onClick,
  badge,
  badgeLabel,
}: {
  item: NavItem;
  isActive: boolean;
  onClick: () => void;
  badge?: number;
  badgeLabel?: string;
}) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      onClick={onClick}
      className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
        isActive
          ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20'
          : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800'
      }`}
    >
      <div className="flex items-center space-x-3">
        <Icon className="w-5 h-5" />
        <span>{item.label}</span>
      </div>
      {badge !== undefined && (
        <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${
          isActive
            ? 'bg-white/20 text-white'
            : 'bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400'
        }`}>
          {badge}
        </span>
      )}
    </Link>
  );
}
