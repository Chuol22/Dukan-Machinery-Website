"use client";

import { useEffect, useState } from "react";
import { Check, Plus, Pencil, Trash2, Tag, ShieldAlert, X } from "lucide-react";

type Category = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  is_active: boolean;
  display_order: number;
  _count?: {
    machines: number;
  };
};

export default function CategoriesClient() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    is_active: true,
    display_order: 0,
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadCategories = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/categories");
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error || "Failed to load categories");
      setCategories(data.categories || []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load categories",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(
        editingCategory
          ? `/api/admin/categories/${editingCategory.id}`
          : "/api/admin/categories",
        {
          method: editingCategory ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        },
      );
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error || "Failed to save category");
      setSuccess(editingCategory ? "Category updated." : "Category created.");
      setShowForm(false);
      setEditingCategory(null);
      setFormData({
        name: "",
        slug: "",
        description: "",
        is_active: true,
        display_order: 0,
      });
      await loadCategories();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save category");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (category: Category) => {
    if (!window.confirm(`Delete ${category.name}?`)) return;
    try {
      const response = await fetch(`/api/admin/categories/${category.id}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error || "Failed to delete category");
      await loadCategories();
      setSuccess("Category deleted.");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to delete category",
      );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-500">
            Inventory Management
          </p>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">
            Product Categories
          </h1>
        </div>
        <button
          onClick={() => {
            setEditingCategory(null);
            setFormData({
              name: "",
              slug: "",
              description: "",
              is_active: true,
              display_order: 0,
            });
            setShowForm(true);
          }}
          className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-orange-600"
        >
          <Plus className="h-4 w-4" />
          New Category
        </button>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300">
          {error}
        </div>
      )}
      {success && (
        <div className="rounded-xl border border-green-200 bg-green-50 p-3 text-sm text-green-700 dark:border-green-900 dark:bg-green-950/30 dark:text-green-300">
          {success}
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="border-b border-gray-200 p-4 dark:border-gray-800">
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
            <Tag className="h-4 w-4 text-orange-500" />
            Manage machine categories and their order in the catalog.
          </div>
        </div>
        {loading ? (
          <div className="p-8 text-sm text-gray-500">Loading categories…</div>
        ) : categories.length === 0 ? (
          <div className="p-8 text-sm text-gray-500">No categories yet.</div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-800">
            {categories.map((category) => (
              <div
                key={category.id}
                className="flex flex-col gap-3 p-4 md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                      {category.name}
                    </h3>
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${category.is_active ? "bg-green-50 text-green-700 dark:bg-green-950/40 dark:text-green-400" : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300"}`}
                    >
                      {category.is_active ? "Active" : "Hidden"}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    /{category.slug}
                  </p>
                  {category.description && (
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                      {category.description}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                    {category._count?.machines ?? 0} machines
                  </span>
                  <button
                    onClick={() => {
                      setEditingCategory(category);
                      setFormData({
                        name: category.name,
                        slug: category.slug,
                        description: category.description || "",
                        is_active: category.is_active,
                        display_order: category.display_order,
                      });
                      setShowForm(true);
                    }}
                    className="rounded-lg border border-gray-200 p-2 text-gray-600 hover:bg-gray-100 dark:border-gray-800 dark:text-gray-300 dark:hover:bg-gray-800"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(category)}
                    className="rounded-lg border border-gray-200 p-2 text-red-600 hover:bg-red-50 dark:border-gray-800 dark:hover:bg-red-950/20"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showForm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={() => setShowForm(false)}
        >
          <div
            className="w-full max-w-xl rounded-2xl border border-gray-200 bg-white p-6 shadow-xl dark:border-gray-800 dark:bg-gray-900"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-500">
                  Category Editor
                </p>
                <h2 className="text-xl font-black text-gray-900 dark:text-white">
                  {editingCategory ? "Edit Category" : "Create Category"}
                </h2>
              </div>
              <button
                onClick={() => setShowForm(false)}
                className="rounded-lg border border-gray-200 p-2 text-gray-600 dark:border-gray-800 dark:text-gray-300"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400">
                  Category Name
                </label>
                <input
                  value={formData.name}
                  onChange={(event) =>
                    setFormData((current) => ({
                      ...current,
                      name: event.target.value,
                      slug:
                        current.slug ||
                        event.target.value
                          .toLowerCase()
                          .replace(/\s+/g, "-")
                          .replace(/[^a-z0-9-]/g, ""),
                    }))
                  }
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 dark:border-gray-800 dark:bg-gray-950 dark:text-white"
                  placeholder="e.g. Pellet Machines"
                  required
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400">
                  Slug
                </label>
                <input
                  value={formData.slug}
                  onChange={(event) =>
                    setFormData((current) => ({
                      ...current,
                      slug: event.target.value
                        .toLowerCase()
                        .replace(/\s+/g, "-")
                        .replace(/[^a-z0-9-]/g, ""),
                    }))
                  }
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 dark:border-gray-800 dark:bg-gray-950 dark:text-white"
                  placeholder="pellet-machines"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(event) =>
                    setFormData((current) => ({
                      ...current,
                      description: event.target.value,
                    }))
                  }
                  rows={3}
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 dark:border-gray-800 dark:bg-gray-950 dark:text-white"
                  placeholder="Optional description"
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="flex items-center gap-2 rounded-xl border border-gray-200 p-3 text-sm text-gray-700 dark:border-gray-800 dark:text-gray-300">
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(event) =>
                      setFormData((current) => ({
                        ...current,
                        is_active: event.target.checked,
                      }))
                    }
                    className="rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                  />
                  Show category in catalog
                </label>
                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={formData.display_order}
                    onChange={(event) =>
                      setFormData((current) => ({
                        ...current,
                        display_order: Number(event.target.value),
                      }))
                    }
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 dark:border-gray-800 dark:bg-gray-950 dark:text-white"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 dark:border-gray-800 dark:text-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-orange-600 disabled:opacity-60"
                >
                  {saving ? (
                    <ShieldAlert className="h-4 w-4 animate-spin" />
                  ) : (
                    <Check className="h-4 w-4" />
                  )}
                  {saving
                    ? "Saving…"
                    : editingCategory
                      ? "Save Changes"
                      : "Create Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
