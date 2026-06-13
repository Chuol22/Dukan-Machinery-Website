'use client';

import { useMemo, useState } from 'react';

type Props = {
  orderId: string;
  customerName: string;
  machineName: string;
  onSuccess: (quotationNumber: string) => void;
  onClose: () => void;
};

export default function QuotationForm({ orderId, customerName, machineName, onSuccess, onClose }: Props) {
  const [machineCost, setMachineCost] = useState<number>(0);
  const [shippingCost, setShippingCost] = useState<number>(0);
  const [installationCost, setInstallationCost] = useState<number>(0);
  const [additionalCharges, setAdditionalCharges] = useState<number>(0);
  const [validUntil, setValidUntil] = useState<string>('');
  const [terms, setTerms] = useState<string>('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totalCost = useMemo(() => {
    return (Number(machineCost) || 0) + (Number(shippingCost) || 0) + (Number(installationCost) || 0) + (Number(additionalCharges) || 0);
  }, [machineCost, shippingCost, installationCost, additionalCharges]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (!validUntil) {
        throw new Error('Valid Until is required');
      }

      const res = await fetch(`/api/admin/orders/${orderId}/quotation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          machineCost,
          shippingCost,
          installationCost,
          additionalCharges,
          validUntil,
          terms: terms.trim() ? terms : undefined,
        }),
      });

      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(body?.error || body?.message || `Quotation failed (HTTP ${res.status})`);
      }

      onSuccess(body.quotationNumber);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create quotation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 p-4">
        <div className="text-sm font-semibold text-gray-900 dark:text-white">Quotation for</div>
        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{customerName} • {machineName}</div>
      </div>

      {error && <div className="text-sm text-red-600 dark:text-red-400">{error}</div>}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <label className="block">
          <div className="text-xs font-bold text-gray-600 dark:text-gray-400">Machine Cost *</div>
          <input className="mt-1 w-full rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-2"
            type="number" min={0} step={0.01} value={machineCost} onChange={(e) => setMachineCost(Number(e.target.value))} required />
        </label>
        <label className="block">
          <div className="text-xs font-bold text-gray-600 dark:text-gray-400">Shipping Cost *</div>
          <input className="mt-1 w-full rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-2"
            type="number" min={0} step={0.01} value={shippingCost} onChange={(e) => setShippingCost(Number(e.target.value))} required />
        </label>
        <label className="block">
          <div className="text-xs font-bold text-gray-600 dark:text-gray-400">Installation Cost *</div>
          <input className="mt-1 w-full rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-2"
            type="number" min={0} step={0.01} value={installationCost} onChange={(e) => setInstallationCost(Number(e.target.value))} required />
        </label>
        <label className="block">
          <div className="text-xs font-bold text-gray-600 dark:text-gray-400">Additional Charges *</div>
          <input className="mt-1 w-full rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-2"
            type="number" min={0} step={0.01} value={additionalCharges} onChange={(e) => setAdditionalCharges(Number(e.target.value))} required />
        </label>
      </div>

      <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-4">
        <div className="flex items-center justify-between">
          <div className="text-xs font-bold text-gray-600 dark:text-gray-400">Total Cost</div>
          <div className="text-lg font-black text-gray-900 dark:text-white">ETB {totalCost.toLocaleString()}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <label className="block">
          <div className="text-xs font-bold text-gray-600 dark:text-gray-400">Valid Until *</div>
          <input className="mt-1 w-full rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-2"
            type="date" value={validUntil} onChange={(e) => setValidUntil(e.target.value)} required />
        </label>
        <div />
      </div>

      <label className="block">
        <div className="text-xs font-bold text-gray-600 dark:text-gray-400">Terms (optional)</div>
        <textarea className="mt-1 w-full rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-2"
          rows={3} value={terms} onChange={(e) => setTerms(e.target.value)} placeholder="Enter quotation terms and conditions..." />
      </label>

      <div className="flex gap-3">
        <button type="button" onClick={onClose} className="flex-1 py-3 border border-gray-200 dark:border-gray-800 rounded-xl font-bold text-gray-700 dark:text-gray-300">
          Cancel
        </button>
        <button type="submit" disabled={loading}
          className="flex-1 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold shadow-lg hover:shadow-orange-500/20 transition-all disabled:opacity-60">
          {loading ? 'Generating...' : 'Generate & Send Quotation'}
        </button>
      </div>
    </form>
  );
}

