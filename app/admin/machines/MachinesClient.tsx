'use client';

// Admin machine CRUD — list, add/edit forms, image upload, availability toggle
import { useEffect, useState } from 'react';
import { Machine as StaticMachine } from '@/data/machinesData';
import CloudinaryImage from '@/components/CloudinaryImage';

// Extend the static Machine type to match the DB/API payload.
// The API supports `available`, but the static machinesData model does not.
type Machine = StaticMachine & { available?: boolean };

import {
  Package,
  Plus,
  Search,
  Pencil,
  Trash2,
  X,
  Check,
  AlertTriangle,
  Eye,
  ToggleLeft,
  ToggleRight,
  ImageIcon,
  Upload,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

type Toast = { message: string; type: 'success' | 'error' } | null;

const PAGE_SIZE = 10;

export default function MachinesClient({ openAddOnMount = false }: { openAddOnMount?: boolean }) {
  const [rows, setRows] = useState<Machine[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<Toast>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Add machine form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingMachine, setEditingMachine] = useState<Machine | null>(null);
  const [formData, setFormData] = useState<Partial<Machine>>({});
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [uploadingImage, setUploadingImage] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);

  // Toast helper must be declared before loadMachines uses it
  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const loadMachines = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/machines');
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error || 'Failed to load machines');
      }
      const data = await res.json();
      setRows(data.machines ?? []);
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Failed to load machines';
      showToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Defer to avoid linter warning about setState in effect body
    void Promise.resolve().then(() => loadMachines());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (openAddOnMount) setShowAddForm(true);
  }, [openAddOnMount]);



  const filteredRows = rows.filter(row => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      row.name.toLowerCase().includes(q) ||
      row.category.toLowerCase().includes(q) ||
      row.type.toLowerCase().includes(q)
    );
  });

  // Pagination
  const totalPages = Math.ceil(filteredRows.length / PAGE_SIZE);
  const paginatedRows = filteredRows.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const validateForm = (): boolean => {
    const errs: Record<string, string> = {};
    if (!formData.name?.trim()) errs.name = 'Machine name is required';
    if (!formData.category?.trim()) errs.category = 'Category is required';
    if (!formData.type?.trim()) errs.type = 'Type is required';
    if (!formData.capacity?.trim()) errs.capacity = 'Capacity is required';
    if (!formData.power?.trim()) errs.power = 'Power is required';
    if (!formData.input?.trim()) errs.input = 'Input is required';
    if (!formData.output?.trim()) errs.output = 'Output is required';
    if (!formData.process?.trim()) errs.process = 'Process is required';
    if (!formData.price?.trim()) errs.price = 'Price is required';
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleAddMachine = () => {
    setEditingMachine(null);
    setFormData({
      name: '',
      category: '',
      type: '',
      capacity: '',
      power: '',
      weight: '',
      dimensions: '',
      voltage: '',
      warranty: '',
      description: '',
      features: [],
      applications: [],
      price: '',
      image: '',
      gallery: [],
      available: true,
    });
    setFormErrors({});
    setShowAddForm(true);
  };

  const handleEditMachine = (machine: Machine) => {
    setEditingMachine(machine);
    setFormData({ ...machine });
    setFormErrors({});
    setShowAddForm(true);
  };

  const handleDeleteMachine = async (machine: Machine) => {
    if (!confirm(`Delete "${machine.name}" from the catalog? This cannot be undone.`)) return;

    try {
      const res = await fetch(`/api/machines/${machine.id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error || 'Failed to delete machine');
      }

      setRows(prev => prev.filter(m => m.id !== machine.id));
      showToast(`${machine.name} has been removed from the catalog.`, 'success');
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Failed to delete machine';
      showToast(msg, 'error');
    }
  };

  const handleSaveMachine = async () => {
    if (!validateForm()) return;

    try {
      if (editingMachine) {
        // Update existing machine
        const res = await fetch(`/api/machines/${editingMachine.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });

        if (!res.ok) {
          const body = await res.json().catch(() => null);
          throw new Error(body?.error || 'Failed to update machine');
        }

        const data = await res.json();
        setRows(prev =>
          prev.map(m =>
            m.id === editingMachine.id
              ? { ...data.machine } as Machine
              : m
          )
        );
        showToast(`${formData.name} updated successfully.`, 'success');
      } else {
        // Create new machine
        const res = await fetch('/api/machines', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });

        if (!res.ok) {
          const body = await res.json().catch(() => null);
          throw new Error(body?.error || 'Failed to create machine');
        }

        const data = await res.json();
        setRows(prev => [...prev, data.machine as Machine]);
        showToast(`${formData.name} added to catalog.`, 'success');
      }

      setShowAddForm(false);
      setEditingMachine(null);
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Failed to save machine';
      showToast(msg, 'error');
    }
  };

  const toggleAvailability = async (machine: Machine) => {
    try {
      const res = await fetch(`/api/machines/${machine.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...machine, available: !machine.available }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error || 'Failed to update availability');
      }

      const data = await res.json();
      setRows(prev =>
        prev.map(m =>
          m.id === machine.id ? { ...data.machine } as Machine : m
        )
      );
      showToast(`${machine.name} is now ${!machine.available ? 'available' : 'unavailable'}.`, 'success');
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Failed to update availability';
      showToast(msg, 'error');
    }
  };

  const updateField = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors(prev => {
        const e = { ...prev };
        delete e[field];
        return e;
      });
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      showToast('Please select an image file', 'error');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      showToast('File size must be less than 5MB', 'error');
      return;
    }

    setUploadingImage(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'dkm-machinery');

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error || 'Failed to upload image');
      }

      const data = await res.json();
      updateField('image', data.data.url);
      showToast('Image uploaded successfully', 'success');
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Failed to upload image';
      showToast(msg, 'error');
    } finally {
      setUploadingImage(false);
    }
  };

  // Reset to page 1 when search changes
  useEffect(() => {
    // Avoid synchronous setState linter warning
    setTimeout(() => setCurrentPage(1), 0);
  }, [searchQuery]);

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 flex items-center space-x-3 px-4 py-3 rounded-xl border shadow-xl animate-slide-down ${toast.type === 'success'
          ? 'bg-green-50 dark:bg-green-950/90 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800'
          : 'bg-red-50 dark:bg-red-950/90 text-red-800 dark:text-red-300 border-red-200 dark:border-red-800'
          }`}>
          {toast.type === 'success' ? <Check className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
          <span className="text-sm font-semibold">{toast.message}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight">
            Machine Catalog
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {rows.length} machine{rows.length !== 1 ? 's' : ''} in catalog
            {filteredRows.length !== rows.length ? ` — ${filteredRows.length} shown` : ''}
          </p>
        </div>
        <button
          onClick={handleAddMachine}
          className="inline-flex items-center space-x-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold text-sm uppercase tracking-wider transition-all shadow-lg hover:shadow-orange-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>Add Machine</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search machines by name, category, or type..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500/25 focus:border-orange-500"
        />
      </div>

      {/* Machine Table */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-6 space-y-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4 animate-pulse">
                  <div className="w-10 h-10 bg-gray-200 dark:bg-gray-800 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/4" />
                    <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredRows.length === 0 ? (
            <div className="text-center py-16">
              <Package className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
              <p className="text-gray-500 dark:text-gray-400 font-semibold">
                {searchQuery ? 'No machines match your search.' : 'No machines in catalog yet.'}
              </p>
              {!searchQuery && (
                <button
                  onClick={handleAddMachine}
                  className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-semibold hover:bg-orange-600 transition-colors"
                >
                  Add Your First Machine
                </button>
              )}
            </div>
          ) : (
            <>
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-gray-150 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">
                    <th className="py-3.5 px-4 font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-xs">Machine</th>
                    <th className="py-3.5 px-4 font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-xs hidden lg:table-cell">Category</th>
                    <th className="py-3.5 px-4 font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-xs hidden md:table-cell">Capacity</th>
                    <th className="py-3.5 px-4 font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-xs hidden md:table-cell">Power</th>
                    <th className="py-3.5 px-4 font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-xs">Price</th>
                    <th className="py-3.5 px-4 font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-xs">Status</th>
                    <th className="py-3.5 px-4 font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-xs text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-150 dark:divide-gray-800">
                  {paginatedRows.map((machine) => (
                    <tr
                      key={machine.id}
                      className={`hover:bg-gray-50/80 dark:hover:bg-gray-900/40 transition-colors ${!machine.available ? 'opacity-60' : ''
                        }`}
                    >
                      {/* Machine name + image */}
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center shrink-0 overflow-hidden">
                            {machine.image ? (
                              <CloudinaryImage
                                src={machine.image}
                                alt={machine.name}
                                width={40}
                                height={40}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <ImageIcon className="w-5 h-5 text-gray-400" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-gray-900 dark:text-white truncate">{machine.name}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 lg:hidden">{machine.category}</p>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-4 px-4 text-gray-700 dark:text-gray-300 hidden lg:table-cell">
                        {machine.category}
                      </td>

                      {/* Capacity */}
                      <td className="py-4 px-4 text-gray-700 dark:text-gray-300 hidden md:table-cell">
                        {machine.capacity}
                      </td>

                      {/* Power */}
                      <td className="py-4 px-4 text-gray-700 dark:text-gray-300 hidden md:table-cell">
                        {machine.power}
                      </td>

                      {/* Price */}
                      <td className="py-4 px-4 font-bold text-orange-500 text-gray-900 dark:text-white">
                        {machine.price}
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold ${machine.available
                          ? 'bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-400 border border-green-200/50 dark:border-green-800/50'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-500 border border-gray-200 dark:border-gray-700'
                          }`}>
                          {machine.available ? 'Available' : 'Unavailable'}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          <button
                            onClick={() => toggleAvailability(machine)}
                            title={machine.available ? 'Mark unavailable' : 'Mark available'}
                            aria-label={machine.available ? 'Mark unavailable' : 'Mark available'}
                            className={`p-1.5 rounded-lg text-xs font-semibold transition-colors ${machine.available
                              ? 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-amber-100 dark:hover:bg-amber-950/30 hover:text-amber-700 dark:hover:text-amber-400'
                              : 'bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-950/50'
                              }`}
                          >
                            {machine.available ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                          </button>
                          <button
                            onClick={() => handleEditMachine(machine)}
                            title="Edit machine"
                            className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-950/50 transition-colors"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteMachine(machine)}
                            title="Delete machine"
                            className="p-1.5 rounded-lg bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-950/50 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="px-4 py-3 border-t border-gray-150 dark:border-gray-800 flex items-center justify-between">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Showing {(currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, filteredRows.length)} of {filteredRows.length}
                  </p>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="p-1.5 rounded-lg border border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-40 disabled:pointer-events-none transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 px-2">
                      {currentPage} / {totalPages}
                    </span>
                    <button
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="p-1.5 rounded-lg border border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-40 disabled:pointer-events-none transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Add/Edit Machine Slide-Over */}
      {showAddForm && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm" onClick={() => setShowAddForm(false)}>
          <div
            className="w-full max-w-xl h-full bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800 shadow-2xl flex flex-col overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 flex items-center justify-between">
              <h2 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tight">
                {editingMachine ? 'Edit Machine' : 'Add New Machine'}
              </h2>
              <button
                onClick={() => setShowAddForm(false)}
                className="p-2 rounded-lg border border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <div className="p-6 space-y-5 flex-1 overflow-y-auto">
              {/* Image Upload */}
              <div>
                <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                  Machine Image
                </label>
                <div className="space-y-3">
                  {/* Upload Button */}
                  <div className="flex items-center space-x-3">
                    <input
                      type="file"
                      id="image-upload"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploadingImage}
                      className="hidden"
                    />
                    <label
                      htmlFor="image-upload"
                      className={`inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl font-semibold text-sm cursor-pointer transition-colors ${uploadingImage
                        ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
                        : 'bg-orange-500 hover:bg-orange-600 text-white'
                        }`}
                    >
                      <Upload className="w-4 h-4" />
                      <span>{uploadingImage ? 'Uploading...' : 'Upload Image'}</span>
                    </label>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      or enter URL below
                    </span>
                  </div>

                  {/* Image URL Input */}
                  <div className="relative">
                    <ImageIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={formData.image || ''}
                      onChange={(e) => updateField('image', e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="https://res.cloudinary.com/your-cloud-name/image/upload/..."
                    />
                  </div>

                  {/* Image Preview */}
                  {formData.image && (
                    <div className="relative h-48 w-full rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-800">
                      <CloudinaryImage
                        src={formData.image}
                        alt="Preview"
                        width={400}
                        height={300}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => updateField('image', '')}
                        className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/50 hover:bg-black/70 text-white transition-colors"
                        title="Remove image"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Upload images to Cloudinary or enter a Cloudinary URL. Max file size: 5MB.
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                  Machine Name *
                </label>
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => updateField('name', e.target.value)}
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="e.g. Chicken Feed Pellet Machine"
                />
                {formErrors.name && <p className="mt-1 text-xs text-red-500">{formErrors.name}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-1.5">Category *</label>
                  <input
                    type="text"
                    value={formData.category || ''}
                    onChange={(e) => updateField('category', e.target.value)}
                    className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="e.g. Feed Processing"
                  />
                  {formErrors.category && <p className="mt-1 text-xs text-red-500">{formErrors.category}</p>}
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-1.5">Type *</label>
                  <input
                    type="text"
                    value={formData.type || ''}
                    onChange={(e) => updateField('type', e.target.value)}
                    className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="e.g. Pellet"
                  />
                  {formErrors.type && <p className="mt-1 text-xs text-red-500">{formErrors.type}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-1.5">Capacity *</label>
                  <input type="text" value={formData.capacity || ''} onChange={(e) => updateField('capacity', e.target.value)} className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="e.g. 500-1000 kg/hr" />
                  {formErrors.capacity && <p className="mt-1 text-xs text-red-500">{formErrors.capacity}</p>}
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-1.5">Power *</label>
                  <input type="text" value={formData.power || ''} onChange={(e) => updateField('power', e.target.value)} className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="e.g. 15kW" />
                  {formErrors.power && <p className="mt-1 text-xs text-red-500">{formErrors.power}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-1.5">Weight</label>
                  <input type="text" value={formData.weight || ''} onChange={(e) => updateField('weight', e.target.value)} className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="e.g. 500 kg" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-1.5">Dimensions</label>
                  <input type="text" value={formData.dimensions || ''} onChange={(e) => updateField('dimensions', e.target.value)} className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="e.g. 2×1×1.5m" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-1.5">Voltage</label>
                  <input type="text" value={formData.voltage || ''} onChange={(e) => updateField('voltage', e.target.value)} className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="e.g. 380V" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-1.5">Warranty</label>
                  <input type="text" value={formData.warranty || ''} onChange={(e) => updateField('warranty', e.target.value)} className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="e.g. 12 months" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-1.5">Input *</label>
                  <input type="text" value={formData.input || ''} onChange={(e) => updateField('input', e.target.value)} className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="Raw material" />
                  {formErrors.input && <p className="mt-1 text-xs text-red-500">{formErrors.input}</p>}
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-1.5">Output *</label>
                  <input type="text" value={formData.output || ''} onChange={(e) => updateField('output', e.target.value)} className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="Finished product" />
                  {formErrors.output && <p className="mt-1 text-xs text-red-500">{formErrors.output}</p>}
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-1.5">Process *</label>
                  <input type="text" value={formData.process || ''} onChange={(e) => updateField('process', e.target.value)} className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="Process name" />
                  {formErrors.process && <p className="mt-1 text-xs text-red-500">{formErrors.process}</p>}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-1.5">Price *</label>
                <input type="text" value={formData.price || ''} onChange={(e) => updateField('price', e.target.value)} className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="e.g. ETB 250,000 or Call for price" />
                {formErrors.price && <p className="mt-1 text-xs text-red-500">{formErrors.price}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-1.5">Description</label>
                <textarea
                  value={formData.description || ''}
                  onChange={(e) => updateField('description', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Describe the machine capabilities..."
                />
              </div>
            </div>

            {/* Footer actions */}
            <div className="p-6 border-t border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 flex gap-4">
              <button
                onClick={() => setShowAddForm(false)}
                className="flex-1 py-3 border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 rounded-xl font-bold hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveMachine}
                className="flex-1 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold shadow-lg hover:shadow-orange-500/20 transition-all flex items-center justify-center space-x-2"
              >
                <Check className="w-4 h-4" />
                <span>{editingMachine ? 'Update Machine' : 'Add Machine'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}