'use client';

import { useEffect, useMemo, useState } from 'react';
import { Search, RefreshCw } from 'lucide-react';

type Customer = {
  id: string;
  name: string;
  company: string | null;
  country: string | null;
  phone: string | null;
  email: string;
  total_orders: number;
  last_order_date: string | null;
  status: string;
  created_at: string;
};

export default function CustomersClient() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<{ key: keyof Customer; dir: 'asc' | 'desc' }>({
    key: 'created_at',
    dir: 'desc',
  });

  useEffect(() => {
    const load = async () => {
      try {
        setError(null);
        setLoading(true);
        const res = await fetch('/api/admin/customers');
        if (!res.ok) {
          const body = await res.json().catch(() => null);
          throw new Error(body?.error || `Failed to load customers (HTTP ${res.status})`);
        }
        const data = await res.json();
        setCustomers(Array.isArray(data.customers) ? data.customers : []);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load customers');
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const base = q
      ? customers.filter((c) => {
          const hay = `${c.name} ${c.email} ${c.company ?? ''}`.toLowerCase();
          return hay.includes(q);
        })
      : customers;

    const dirMul = sort.dir === 'asc' ? 1 : -1;
    const sorted = [...base].sort((a, b) => {
      const av = a[sort.key];
      const bv = b[sort.key];
      if (av === null || av === undefined) return 1;
      if (bv === null || bv === undefined) return -1;
      // dates are ISO strings
      if (sort.key === 'created_at' || sort.key === 'last_order_date') {
        return (
          new Date(String(av)).getTime() - new Date(String(bv)).getTime()
        ) * dirMul;
      }
      if (typeof av === 'number' && typeof bv === 'number') return (av - bv) * dirMul;
      return String(av).localeCompare(String(bv)) * dirMul;
    });

    return sorted;
  }, [customers, query, sort]);

  const toggleSort = (key: keyof Customer) => {
    setSort((prev) => {
      if (prev.key === key) {
        return { key, dir: prev.dir === 'asc' ? 'desc' : 'asc' };
      }
      return { key, dir: 'asc' };
    });
  };

  const statusBadge = (status: string) => {
    const s = status?.toLowerCase();
    if (s === 'active') {
      return 'bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400 border border-green-200/50 dark:border-green-800/50';
    }
    return 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 border border-gray-200/50 dark:border-gray-700';
  };

  return (
    <div className="container mx-auto px-4 py-10 max-w-6xl">
      <div className="mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white">Customers</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">Manage and review customer order activity.</p>
        </div>
        <div className="relative max-w-md w-full md:w-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, email, or company..."
            className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500/25 focus:border-orange-500"
          />
        </div>
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
                <th className="py-3.5 px-4 font-bold uppercase tracking-wider text-xs text-gray-500 cursor-pointer" onClick={() => toggleSort('name')}>
                  Name
                </th>
                <th className="py-3.5 px-4 font-bold uppercase tracking-wider text-xs text-gray-500 cursor-pointer" onClick={() => toggleSort('company')}>
                  Company
                </th>
                <th className="py-3.5 px-4 font-bold uppercase tracking-wider text-xs text-gray-500">
                  Country
                </th>
                <th className="py-3.5 px-4 font-bold uppercase tracking-wider text-xs text-gray-500">Phone</th>
                <th className="py-3.5 px-4 font-bold uppercase tracking-wider text-xs text-gray-500 cursor-pointer" onClick={() => toggleSort('email')}>
                  Email
                </th>
                <th className="py-3.5 px-4 font-bold uppercase tracking-wider text-xs text-gray-500">Total Orders</th>
                <th className="py-3.5 px-4 font-bold uppercase tracking-wider text-xs text-gray-500 cursor-pointer" onClick={() => toggleSort('last_order_date')}>
                  Last Order Date
                </th>
                <th className="py-3.5 px-4 font-bold uppercase tracking-wider text-xs text-gray-500">Status</th>
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
                      <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-40" />
                    </td>
                    <td className="py-4 px-4">
                      <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-24" />
                    </td>
                    <td className="py-4 px-4">
                      <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-24" />
                    </td>
                    <td className="py-4 px-4">
                      <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-44" />
                    </td>
                    <td className="py-4 px-4">
                      <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-20" />
                    </td>
                    <td className="py-4 px-4">
                      <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-32" />
                    </td>
                    <td className="py-4 px-4">
                      <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-24" />
                    </td>
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-16 text-center text-gray-500 dark:text-gray-400">
                    No customers found.
                  </td>
                </tr>
              ) : (
                filtered.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50/80 dark:hover:bg-gray-900/40 transition-colors">
                    <td className="py-4 px-4 font-semibold text-gray-900 dark:text-white">{c.name}</td>
                    <td className="py-4 px-4 text-gray-700 dark:text-gray-300">{c.company ?? '—'}</td>
                    <td className="py-4 px-4 text-gray-700 dark:text-gray-300">{c.country ?? '—'}</td>
                    <td className="py-4 px-4 text-gray-700 dark:text-gray-300">{c.phone ?? '—'}</td>
                    <td className="py-4 px-4 text-gray-700 dark:text-gray-300">{c.email}</td>
                    <td className="py-4 px-4 text-gray-700 dark:text-gray-300">{c.total_orders}</td>
                    <td className="py-4 px-4 text-gray-700 dark:text-gray-300">
                      {c.last_order_date ? new Date(c.last_order_date).toLocaleDateString('en-US') : '—'}
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${statusBadge(c.status)}`}>
                        {c.status}
                      </span>
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

