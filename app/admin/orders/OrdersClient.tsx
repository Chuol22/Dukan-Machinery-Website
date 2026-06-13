'use client';

// Admin orders table — search, filter, accept/reject, and delete orders
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Search,
  Filter,
  Eye,
  Check,
  X,
  Clock,
  Coins,
  FileText,
  Percent,
  Calendar,
  CreditCard,
  MapPin,
  Building,
  Phone,
  Mail,
  User,
  ShieldAlert,
  ExternalLink,
  Trash2,
} from 'lucide-react';

type QuotationRow = {
  id: string;
  status: string;
  quotation_number: string;
};

type OrderRow = {
  id: string;
  orderId: number | null;
  status: string;
  machineId: string;
  machineName: string;
  unitPrice: number | null;
  totalAmount: number | null;
  quantity: number;
  customerName: string;
  customerEmail: string;
  customerInfo: {
    fullName?: string;
    companyName?: string;
    email?: string;
    phone?: string;
    address?: string;
    city?: string;
  };
  deliveryInfo: {
    preferredDate?: string;
    deliveryAddress?: string;
    specialInstructions?: string;
  };
  paymentMethod: string;
  termsAccepted: boolean;
  adminNotes?: string | null;
  assignedTo?: string | null;
  createdAt: string;
  quotations?: QuotationRow[];
};

export default function OrdersClient() {
  const searchParams = useSearchParams();
  const [rows, setRows] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submittingIds, setSubmittingIds] = useState<Record<string, boolean>>({});

  // Search and Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'NEW' | 'PENDING' | 'CONFIRMED' | 'REJECTED'>('ALL');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'highest' | 'lowest'>('newest');

  // Modal State
  const [selectedOrder, setSelectedOrder] = useState<OrderRow | null>(null);
  const [workflowNote, setWorkflowNote] = useState('');
  const [assignedTo, setAssignedTo] = useState('');

  // Feedback message state (Toast-like)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  };

  const loadOrders = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      setError(null);

      const res = await fetch('/api/admin/orders');
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.message ?? `Failed to load orders (HTTP ${res.status})`);
      }

      const data = await res.json();
      const orders = data.orders ?? [];

      const normalizeStatus = (raw: unknown): 'pending' | 'confirmed' | 'rejected' => {
        const s = String(raw ?? '').trim().toLowerCase();
        if (!s) return 'pending';
        if (s === 'new' || s === 'pending' || s === 'in_review' || s === 'review') return 'pending';
        if (s === 'accepted' || s === 'confirmed') return 'confirmed';
        if (s === 'rejected') return 'rejected';
        // fallback: keep it deterministic so filters/buttons still work
        if (s.includes('reject')) return 'rejected';
        if (s.includes('confirm') || s.includes('accept')) return 'confirmed';
        return 'pending';
      };

      const normalizedOrders = (orders as unknown[]).map((order) => {
        const o = order as { status?: unknown } & Partial<OrderRow> & Record<string, unknown>;
        const nextStatus = normalizeStatus(o.status);
        return {
          ...(o as OrderRow),
          status: nextStatus,
        };
      });

      setRows(normalizedOrders);
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Unknown error';
      setError(msg);
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  useEffect(() => {
    // Fire-and-forget load (defer to avoid sync setState during effect evaluation).
    queueMicrotask(() => {
      void loadOrders();
    });
  }, []);

  // Open order detail when linked from notifications (?order=<id>)
  useEffect(() => {
    const orderId = searchParams.get('order');
    if (!orderId || rows.length === 0) return;

    const match = rows.find((r) => r.id === orderId);
    if (!match) return;

    // Defer setState to avoid cascading renders warning.
    queueMicrotask(() => {
      setSelectedOrder((prev) => (prev?.id === match.id ? prev : match));
      setWorkflowNote((prev) => (prev === (match.adminNotes ?? '') ? prev : match.adminNotes ?? ''));
      setAssignedTo((prev) => (prev === (match.assignedTo ?? '') ? prev : match.assignedTo ?? ''));
    });
  }, [searchParams, rows]);

  // Compute stats from raw data
  const stats = useMemo(() => {
    const total = rows.length;
    const pending = rows.filter((r) => String(r.status).toLowerCase() === 'pending').length;
    const confirmedOrders = rows.filter((r) => String(r.status).toLowerCase() === 'confirmed');
    const rejectedOrders = rows.filter((r) => String(r.status).toLowerCase() === 'rejected');
    const revenue = confirmedOrders.reduce((sum, r) => sum + (r.totalAmount ?? 0), 0);
    const acceptanceRate = total > 0 ? Math.round((confirmedOrders.length / total) * 100) : 0;

    return {
      total,
      pending,
      revenue,
      acceptanceRate,
      confirmed: confirmedOrders.length,
      rejected: rejectedOrders.length,
    };
  }, [rows]);

  const onDecision = async (id: string, action: 'accept' | 'reject') => {
    if (submittingIds[id]) return;

    setSubmittingIds((prev) => ({ ...prev, [id]: true }));

    try {
      const res = await fetch(`/api/admin/orders/${id}/${action}`, {
        method: 'POST',
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.message ?? 'Failed to submit decision');
      }

      // Optimistic update
      const nextStatus = action === 'accept' ? 'confirmed' : 'rejected';

      // Update local state
      setRows((prev) => prev.map((r) => (r.id === id ? { ...r, status: nextStatus } : r)));

      // Update selected order in modal if active
      setSelectedOrder((prev) => (prev && prev.id === id ? { ...prev, status: nextStatus } : prev));

      showToast(`Order successfully ${nextStatus}!`, 'success');

      // Background refresh
      loadOrders(false).catch(() => {});
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      showToast(msg, 'error');
    } finally {
      setSubmittingIds((prev) => ({ ...prev, [id]: false }));
    }
  };

  const onSaveWorkflow = async (id: string) => {
    if (submittingIds[id]) return;
    setSubmittingIds((prev) => ({ ...prev, [id]: true }));

    try {
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ admin_notes: workflowNote, assigned_to: assignedTo }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error ?? 'Failed to save workflow note');
      }

      setRows((prev) =>
        prev.map((row) =>
          row.id === id
            ? { ...row, adminNotes: workflowNote || null, assignedTo: assignedTo || null }
            : row
        )
      );
      setSelectedOrder((prev) =>
        prev && prev.id === id
          ? { ...prev, adminNotes: workflowNote || null, assignedTo: assignedTo || null }
          : prev
      );
      showToast('Workflow note saved', 'success');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      showToast(msg, 'error');
    } finally {
      setSubmittingIds((prev) => ({ ...prev, [id]: false }));
    }
  };

  const onDelete = async (id: string) => {
    if (submittingIds[id]) return;

    if (!confirm('Are you sure you want to delete this order? This action cannot be undone.')) {
      return;
    }

    setSubmittingIds((prev) => ({ ...prev, [id]: true }));

    try {
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.message ?? 'Failed to delete order');
      }

      // Remove from local state
      setRows((prev) => prev.filter((r) => r.id !== id));

      // Close modal if this order was selected
      setSelectedOrder((prev) => (prev && prev.id === id ? null : prev));

      showToast('Order deleted successfully', 'success');

      // Force refresh notifications by calling the notifications API
      try {
        await fetch('/api/admin/notifications');
      } catch (e) {
        // ignore
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      showToast(msg, 'error');
    } finally {
      setSubmittingIds((prev) => ({ ...prev, [id]: false }));
    }
  };

  // Filter and Sort Rows
  const filteredAndSortedRows = useMemo(() => {
    const filtered = rows.filter((row) => {
      // Status filter (statuses are normalized on loadOrders)
      const filterValue = statusFilter === 'NEW' ? 'pending' : statusFilter.toLowerCase();
      if (statusFilter !== 'ALL') {
        const rowStatus = String(row.status).toLowerCase();
        if (rowStatus !== filterValue) return false;
      }

      // Search text
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const orderNum = String(row.orderId ?? '').toLowerCase();
        const custName = (row.customerName ?? '').toLowerCase();
        const custEmail = (row.customerEmail ?? '').toLowerCase();
        const machName = (row.machineName ?? '').toLowerCase();
        const rowId = row.id.toLowerCase();

        return (
          orderNum.includes(query) ||
          custName.includes(query) ||
          custEmail.includes(query) ||
          machName.includes(query) ||
          rowId.includes(query)
        );
      }

      return true;
    });

    return [...filtered].sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sortBy === 'oldest') {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      if (sortBy === 'highest') {
        return (b.totalAmount ?? 0) - (a.totalAmount ?? 0);
      }
      if (sortBy === 'lowest') {
        return (a.totalAmount ?? 0) - (b.totalAmount ?? 0);
      }
      return 0;
    });
  }, [rows, searchQuery, statusFilter, sortBy]);

  const formatCurrency = (amount: number | null) => {
    if (amount === null) return 'Price on request';
    return `ETB ${amount.toLocaleString()}`;
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Toast Alert */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 flex items-center space-x-3 px-4 py-3 rounded-xl border shadow-xl animate-slide-down ${
            toast.type === 'success'
              ? 'bg-green-50 dark:bg-green-950/90 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800'
              : 'bg-red-50 dark:bg-red-950/90 text-red-800 dark:text-red-300 border-red-200 dark:border-red-800'
          }`}
        >
          {toast.type === 'success' ? <Check className="w-5 h-5" /> : <ShieldAlert className="w-5 h-5" />}
          <span className="text-sm font-semibold">{toast.message}</span>
        </div>
      )}

      {/* Dashboard Stats Section (Redesigned as Table) */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">
          <h2 className="text-xs font-black text-gray-800 dark:text-white uppercase tracking-wider">Dashboard Summary Metrics</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">
                <th className="py-3 px-4 font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-xs">Metric</th>
                <th className="py-3 px-4 font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-xs">Value</th>
                <th className="py-3 px-4 font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-xs">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              <tr className="hover:bg-gray-50/80 dark:hover:bg-gray-900/40 transition-colors">
                <td className="py-3.5 px-4 font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-orange-500" />
                  <span>Total Requests</span>
                </td>
                <td className="py-3.5 px-4 font-mono font-bold text-gray-950 dark:text-white">{loading ? '...' : stats.total}</td>
                <td className="py-3.5 px-4 text-gray-500 dark:text-gray-400">Submitted order inquiries</td>
              </tr>
              <tr className="hover:bg-gray-50/80 dark:hover:bg-gray-900/40 transition-colors">
                <td className="py-3.5 px-4 font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-500" />
                  <span>Pending Actions</span>
                </td>
                <td className="py-3.5 px-4 font-mono font-bold text-gray-950 dark:text-white">{loading ? '...' : stats.pending}</td>
                <td className="py-3.5 px-4 text-gray-500 dark:text-gray-400">Requires review decision</td>
              </tr>
              <tr className="hover:bg-gray-50/80 dark:hover:bg-gray-900/40 transition-colors">
                <td className="py-3.5 px-4 font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  <span>Confirmed Orders</span>
                </td>
                <td className="py-3.5 px-4 font-mono font-bold text-gray-950 dark:text-white">{loading ? '...' : stats.confirmed}</td>
                <td className="py-3.5 px-4 text-gray-500 dark:text-gray-400">Orders accepted by admin</td>
              </tr>
              <tr className="hover:bg-gray-50/80 dark:hover:bg-gray-900/40 transition-colors">
                <td className="py-3.5 px-4 font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <Coins className="w-4 h-4 text-green-500" />
                  <span>Accepted Value</span>
                </td>
                <td className="py-3.5 px-4 font-mono font-bold text-gray-950 dark:text-white">{loading ? '...' : formatCurrency(stats.revenue)}</td>
                <td className="py-3.5 px-4 text-gray-500 dark:text-gray-400">Value of accepted contracts</td>
              </tr>
              <tr className="hover:bg-gray-50/80 dark:hover:bg-gray-900/40 transition-colors">
                <td className="py-3.5 px-4 font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <Percent className="w-4 h-4 text-blue-500" />
                  <span>Acceptance Rate</span>
                </td>
                <td className="py-3.5 px-4 font-mono font-bold text-gray-950 dark:text-white">
                  {loading ? '...' : `${stats.acceptanceRate}%`}
                </td>
                <td className="py-3.5 px-4 text-gray-500 dark:text-gray-400">
                  Accepted vs total orders
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Main Workspace: Filters & Table Card */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm overflow-hidden">
        {/* Search and Filters Header */}
        <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              placeholder="Search by ID, customer name, email, or machine..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500/25 focus:border-orange-500 transition-all"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Status Filter */}
            <div className="flex items-center space-x-2 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl px-3 py-1.5 text-sm">
              <Filter className="w-4 h-4 text-gray-400" />
              <label className="sr-only">Status</label>
              <select
                title="Filter orders by status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as 'ALL' | 'NEW' | 'PENDING' | 'CONFIRMED' | 'REJECTED')}
                className="bg-transparent text-gray-700 dark:text-gray-300 focus:outline-none pr-2 font-semibold cursor-pointer"
              >
                <option value="ALL">All Statuses</option>
                <option value="NEW">New</option>
                <option value="PENDING">Pending</option>
                <option value="CONFIRMED">Accepted</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>

            {/* Sort Order */}
            <div className="flex items-center space-x-2 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl px-3 py-1.5 text-sm">
              <span className="text-gray-400 font-semibold">Sort:</span>
              <label className="sr-only">Sort order</label>
              <select
                title="Sort orders"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest' | 'highest' | 'lowest')}
                className="bg-transparent text-gray-700 dark:text-gray-300 focus:outline-none pr-2 font-semibold cursor-pointer"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="highest">Highest Value</option>
                <option value="lowest">Lowest Value</option>
              </select>
            </div>
          </div>
        </div>

        {/* Content Table */}
        <div className="overflow-x-auto">
          {loading ? (
            /* Skeleton Loading rows */
            <div className="divide-y divide-gray-200 dark:divide-gray-800 p-6">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="py-4 flex items-center justify-between animate-pulse">
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-24" />
                    <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-48" />
                  </div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-20" />
                  <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-32" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="p-12 text-center text-red-600 dark:text-red-400 font-semibold">
              <ShieldAlert className="w-8 h-8 mx-auto mb-2 opacity-80" />
              {error}
            </div>
          ) : filteredAndSortedRows.length === 0 ? (
            <div className="p-16 text-center text-gray-500 dark:text-gray-400">
              <FileText className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="text-sm font-semibold">No order requests match your search criteria.</p>
            </div>
          ) : (
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">
                  <th className="py-3.5 px-4 font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-xs">Order ID</th>
                  <th className="py-3.5 px-4 font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-xs">Customer</th>
                  <th className="py-3.5 px-4 font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-xs">Machine / Product</th>
                  <th className="py-3.5 px-4 font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-xs">Total Amount</th>
                  <th className="py-3.5 px-4 font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-xs">Status</th>
                  <th className="py-3.5 px-4 font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-xs">Date</th>
                  <th className="py-3.5 px-4 font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-xs text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                {filteredAndSortedRows.map((row) => {
                  const statusLower = row.status.toLowerCase();
                  const isPending = statusLower === 'pending';
                  const isConfirmed = statusLower === 'confirmed';
                  const isRejected = statusLower === 'rejected';

                  return (
                    <tr
                      key={row.id}
                      className="hover:bg-gray-50/80 dark:hover:bg-gray-900/40 transition-colors group cursor-pointer"
                      onClick={() => {
                        setSelectedOrder(row);
                        setWorkflowNote(row.adminNotes ?? '');
                        setAssignedTo(row.assignedTo ?? '');
                      }}
                    >
                      {/* Order ID */}
                      <td className="py-4 px-4 font-mono font-bold text-gray-900 dark:text-white">
                        #{row.orderId || row.id.substring(0, 8)}
                      </td>

                      {/* Customer Details */}
                      <td className="py-4 px-4">
                        <div className="font-semibold text-gray-900 dark:text-white">{row.customerName}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{row.customerEmail}</div>
                      </td>

                      {/* Machine Details */}
                      <td className="py-4 px-4">
                        <div className="font-semibold text-gray-900 dark:text-white">{row.machineName}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Quantity: {row.quantity}</div>
                      </td>

                      {/* Total Amount */}
                      <td className="py-4 px-4 font-black text-gray-950 dark:text-white">
                        {formatCurrency(row.totalAmount)}
                      </td>

                      {/* Status Badge */}
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${isPending
                          ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200/50 dark:border-amber-800/50'
                          : isConfirmed
                            ? 'bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-400 border border-green-200/50 dark:border-green-800/50'
                            : isRejected
                              ? 'bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400 border border-red-200/50 dark:border-red-800/50'
                              : 'bg-gray-50 dark:bg-gray-950/40 text-gray-700 dark:text-gray-400 border border-gray-200/50 dark:border-gray-800/50'
                          }`}>
                          {isPending && <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />}
                          <span>{row.status.charAt(0).toUpperCase() + row.status.slice(1)}</span>
                        </span>
                      </td>

                      {/* Created Date */}
                      <td className="py-4 px-4 text-xs text-gray-600 dark:text-gray-400 font-medium">
                        {row.createdAt ? new Date(row.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        }) : 'N/A'}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => {
                              setSelectedOrder(row);
                              setWorkflowNote(row.adminNotes ?? '');
                              setAssignedTo(row.assignedTo ?? '');
                            }}
                            aria-label="View full request details"
                            title="View full request details"
                            className="p-1.5 rounded-lg border border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 hover:text-gray-850 dark:hover:text-white transition-colors cursor-pointer"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => onDecision(row.id, 'accept')}
                            disabled={!isPending || !!submittingIds[row.id]}
                            title="Accept order request"
                            className="p-1.5 rounded-lg bg-green-600 hover:bg-green-700 text-white disabled:opacity-30 disabled:pointer-events-none shadow-sm transition-colors cursor-pointer"
                          >
                            {submittingIds[row.id] ? (
                              <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                              </svg>
                            ) : (
                              <Check className="w-4 h-4" />
                            )}
                          </button>

                          <button
                            onClick={() => onDecision(row.id, 'reject')}
                            disabled={!isPending || !!submittingIds[row.id]}
                            title="Reject order request"
                            className="p-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white disabled:opacity-30 disabled:pointer-events-none shadow-sm transition-colors cursor-pointer"
                          >
                            {submittingIds[row.id] ? (
                              <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                              </svg>
                            ) : (
                              <X className="w-4 h-4" />
                            )}
                          </button>

                          <button
                            onClick={() => onDelete(row.id)}
                            disabled={!!submittingIds[row.id]}
                            title="Delete order"
                            className="p-1.5 rounded-lg border border-gray-200 dark:border-gray-800 hover:bg-red-50 dark:hover:bg-red-950/20 text-gray-500 hover:text-red-600 dark:hover:text-red-400 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
                          >
                            {submittingIds[row.id] ? (
                              <svg className="animate-spin h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                              </svg>
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Details Side-Drawer / Modal Overlay */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-fade-in" onClick={() => setSelectedOrder(null)}>
          {/* Modal Container */}
          <div
            className="w-full max-w-2xl h-full bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800 shadow-2xl flex flex-col justify-between overflow-y-auto animate-slide-up"
            style={{ animationDuration: '200ms' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-3">
                  <span className="text-xs font-black tracking-wider uppercase px-2 py-0.5 bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-300 rounded">
                    Order Request
                  </span>
                  <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${selectedOrder.status.toLowerCase() === 'pending'
                    ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200/50'
                    : selectedOrder.status.toLowerCase() === 'confirmed'
                      ? 'bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-400 border border-green-200/50'
                      : 'bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400 border border-red-200/50'
                    }`}>
                    {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                  </span>
                </div>
                <h2 className="text-xl font-black text-gray-900 dark:text-white mt-2">
                  #{selectedOrder.orderId || selectedOrder.id}
                </h2>
              </div>
              <button
                title="Close drawer"
                aria-label="Close drawer"
                onClick={() => setSelectedOrder(null)}
                className="p-2 rounded-lg border border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-8 flex-1">
              {/* Product Info Block */}
              <div className="bg-orange-50/40 dark:bg-orange-950/10 border border-orange-200/40 dark:border-orange-900/20 rounded-2xl p-5">
                <h3 className="text-xs font-black tracking-wider uppercase text-orange-600 dark:text-orange-400 mb-3 flex items-center space-x-2">
                  <FileText className="w-4 h-4" />
                  <span>Item Requested</span>
                </h3>
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-base font-black text-gray-900 dark:text-white">{selectedOrder.machineName}</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Product ID: {selectedOrder.machineId}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-gray-500 dark:text-gray-400">Qty: {selectedOrder.quantity}</span>
                    <div className="text-lg font-black text-gray-950 dark:text-white mt-1">
                      {formatCurrency(selectedOrder.totalAmount)}
                    </div>
                    {selectedOrder.unitPrice && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Unit: {formatCurrency(selectedOrder.unitPrice)}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Customer Profile */}
              <div>
                <h3 className="text-xs font-black tracking-wider uppercase text-gray-500 dark:text-gray-400 mb-4 flex items-center space-x-2">
                  <User className="w-4 h-4" />
                  <span>Customer Profile</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 dark:bg-gray-900/50 p-5 rounded-2xl border border-gray-200 dark:border-gray-800">
                  <div className="flex items-start space-x-3">
                    <User className="w-4 h-4 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Full Name</p>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">{selectedOrder.customerName}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Mail className="w-4 h-4 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Email Address</p>
                      <a href={`mailto:${selectedOrder.customerEmail}`} className="text-sm font-semibold text-orange-500 hover:underline inline-flex items-center space-x-1">
                        <span>{selectedOrder.customerEmail}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Phone className="w-4 h-4 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Phone Number</p>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">{selectedOrder.customerInfo?.phone || 'Not provided'}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Building className="w-4 h-4 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Company Name</p>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">{selectedOrder.customerInfo?.companyName || 'N/A'}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 sm:col-span-2">
                    <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Location / Address</p>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        {[selectedOrder.customerInfo?.address, selectedOrder.customerInfo?.city].filter(Boolean).join(', ') || 'Not provided'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Request Information */}
              <div>
                <h3 className="text-xs font-black tracking-wider uppercase text-gray-500 dark:text-gray-400 mb-4 flex items-center space-x-2">
                  <FileText className="w-4 h-4" />
                  <span>Request Information</span>
                </h3>
                <div className="grid grid-cols-1 gap-4 bg-gray-50 dark:bg-gray-900/50 p-5 rounded-2xl border border-gray-200 dark:border-gray-800">
                  <div className="flex items-start space-x-3">
                    <FileText className="w-4 h-4 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Requirements</p>
                      <p className="text-sm text-gray-700 dark:text-gray-300">{selectedOrder.deliveryInfo?.specialInstructions || selectedOrder.requirements || 'None specified'}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <FileText className="w-4 h-4 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Notes</p>
                      <p className="text-sm text-gray-700 dark:text-gray-300">{selectedOrder.adminNotes || selectedOrder.notes || 'None'}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Calendar className="w-4 h-4 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Submitted Date</p>
                      <p className="text-sm text-gray-700 dark:text-gray-300">{selectedOrder.createdAt ? new Date(selectedOrder.createdAt).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric'
                      }) : 'N/A'}</p>
                    </div>
                  </div>

                  {selectedOrder.assignedTo && (
                    <div className="flex items-start space-x-3">
                      <User className="w-4 h-4 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Assigned Staff</p>
                        <p className="text-sm text-gray-700 dark:text-gray-300">{selectedOrder.assignedTo}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Delivery Requirements */}
              <div>
                <h3 className="text-xs font-black tracking-wider uppercase text-gray-500 dark:text-gray-400 mb-4 flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>Delivery & Payment Logistics</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 dark:bg-gray-900/50 p-5 rounded-2xl border border-gray-200 dark:border-gray-800">
                  <div className="flex items-start space-x-3">
                    <Calendar className="w-4 h-4 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Preferred Delivery Date</p>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        {selectedOrder.deliveryInfo?.preferredDate ? new Date(selectedOrder.deliveryInfo.preferredDate).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric'
                        }) : 'Immediate / Flexible'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <CreditCard className="w-4 h-4 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Payment Method</p>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white uppercase">
                        {selectedOrder.paymentMethod ? selectedOrder.paymentMethod.replace('_', ' ') : 'Not specified'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 sm:col-span-2">
                    <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Delivery Destination</p>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">{selectedOrder.deliveryInfo?.deliveryAddress || 'Ship to profile address'}</p>
                    </div>
                  </div>

                  {selectedOrder.deliveryInfo?.specialInstructions && (
                    <div className="flex items-start space-x-3 sm:col-span-2 border-t border-gray-200 dark:border-gray-800 pt-3 mt-1">
                      <FileText className="w-4 h-4 text-gray-400 mt-0.5" />
                      <div>
                         <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Special Delivery Instructions</p>
                         <p className="text-sm text-gray-700 dark:text-gray-300 italic">&ldquo;{selectedOrder.deliveryInfo.specialInstructions}&rdquo;</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 space-y-4">
              <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
                <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  <FileText className="h-4 w-4 text-orange-500" />
                  Follow-up workflow
                </div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400">Internal note</label>
                <textarea
                  value={workflowNote}
                  onChange={(event) => setWorkflowNote(event.target.value)}
                  rows={3}
                  className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 dark:border-gray-800 dark:bg-gray-950 dark:text-white"
                  placeholder="Add follow-up details for the sales team"
                />
                <label className="mt-3 mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400">Assigned owner</label>
                <input
                  value={assignedTo}
                  onChange={(event) => setAssignedTo(event.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 dark:border-gray-800 dark:bg-gray-950 dark:text-white"
                  placeholder="Sales officer or team"
                />
                <button
                  onClick={() => onSaveWorkflow(selectedOrder.id)}
                  className="mt-3 inline-flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600"
                >
                  <Check className="h-4 w-4" />
                  Save workflow note
                </button>
              </div>

              <div className="flex gap-4 flex-wrap">
              <button
                onClick={() => {
                  // Move to pending for workflow flexibility (requires backend support).
                  void (async () => {
                    if (submittingIds[selectedOrder.id]) return;

                    setSubmittingIds((prev) => ({ ...prev, [selectedOrder.id]: true }));
                    try {
                      const res = await fetch(`/api/admin/orders/${selectedOrder.id}/pending`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          admin_notes: workflowNote,
                        }),
                      });

                      if (!res.ok) {
                        const body = await res.json().catch(() => null);
                        throw new Error(body?.error ?? body?.message ?? `Failed to move to pending (HTTP ${res.status})`);
                      }

                      setRows((prev) => prev.map((r) => (r.id === selectedOrder.id ? { ...r, status: 'pending' } : r)));
                      setSelectedOrder((prev) => (prev ? { ...prev, status: 'pending' } : prev));
                      showToast('Moved to pending', 'success');
                    } catch (err) {
                      const msg = err instanceof Error ? err.message : 'Failed to move to pending';
                      showToast(msg, 'error');
                    } finally {
                      setSubmittingIds((prev) => ({ ...prev, [selectedOrder.id]: false }));
                    }
                  })();
                }}
                disabled={!!submittingIds[selectedOrder.id]}
                title="Move this order back to pending"
                className="flex-1 py-3 border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-200 rounded-xl font-bold bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-950/20 disabled:opacity-40 disabled:pointer-events-none transition-all cursor-pointer min-h-12 flex items-center justify-center space-x-2"
              >
                <Clock className="w-5 h-5" />
                <span>Move to Pending</span>
              </button>

              <button
                onClick={() => onDecision(selectedOrder.id, 'reject')}
                disabled={selectedOrder.status.toLowerCase() !== 'pending' || !!submittingIds[selectedOrder.id]}
                className="flex-1 py-3 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 rounded-xl font-bold bg-white dark:bg-gray-900 hover:bg-red-50 dark:hover:bg-red-950/20 disabled:opacity-40 disabled:pointer-events-none transition-all cursor-pointer min-h-12 flex items-center justify-center space-x-2"
              >
                {submittingIds[selectedOrder.id] ? (
                  <svg className="animate-spin h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                ) : (
                  <>
                    <X className="w-5 h-5" />
                    <span>Reject Inquiry</span>
                  </>
                )}
              </button>

              <button
                onClick={() => onDecision(selectedOrder.id, 'accept')}
                disabled={selectedOrder.status.toLowerCase() !== 'pending' || !!submittingIds[selectedOrder.id]}
                className="flex-1 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold disabled:opacity-40 disabled:pointer-events-none shadow-lg hover:shadow-green-600/20 transition-all cursor-pointer min-h-12 flex items-center justify-center space-x-2"
              >
                {submittingIds[selectedOrder.id] ? (
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                ) : (
                  <>
                    <Check className="w-5 h-5" />
                    <span>Accept Inquiry</span>
                  </>
                )}
              </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
