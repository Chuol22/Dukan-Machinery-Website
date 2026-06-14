// BlogFilters — search and filter controls for blog listing
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Filter,
  X,
  ChevronDown,
  Calendar,
  TrendingUp,
  Clock,
  Eye,
  Tag,
} from "lucide-react";

interface BlogFiltersProps {
  onFilterChange: (filters: FilterOptions) => void;
  categories: string[];
  tags: string[];
  totalPosts: number;
}

interface FilterOptions {
  search: string;
  category: string;
  tag: string;
  sortBy: "newest" | "oldest" | "popular" | "trending";
  dateRange: "all" | "week" | "month" | "year";
}

// Sort dropdown options
const sortOptions = [
  { value: "newest", label: "Newest First", icon: Clock },
  { value: "oldest", label: "Oldest First", icon: Calendar },
  { value: "popular", label: "Most Popular", icon: Eye },
  { value: "trending", label: "Trending", icon: TrendingUp },
];

// Date range dropdown options
const dateRangeOptions = [
  { value: "all", label: "All Time" },
  { value: "week", label: "Last Week" },
  { value: "month", label: "Last Month" },
  { value: "year", label: "Last Year" },
];

export default function BlogFilters({
  onFilterChange,
  categories,
  tags,
  totalPosts,
}: BlogFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  // Current filter values
  const [filters, setFilters] = useState<FilterOptions>({
    search: "",
    category: "",
    tag: "",
    sortBy: "newest",
    dateRange: "all",
  });
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);

  // Count active non-default filters for badge
  useEffect(() => {
    let count = 0;
    if (filters.category) count++;
    if (filters.tag) count++;
    if (filters.dateRange !== "all") count++;
    if (filters.sortBy !== "newest") count++;
    setActiveFiltersCount(count);
  }, [filters]);

  // Update single filter and notify parent
  const handleFilterChange = (key: keyof FilterOptions, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  // Reset all filters to defaults
  const clearFilters = () => {
    const resetFilters: FilterOptions = {
      search: "",
      category: "",
      tag: "",
      sortBy: "newest",
      dateRange: "all",
    };
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onFilterChange(filters);
  };

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="relative">
        <div className="relative">
          <input
            type="text"
            placeholder="Search articles by title, content, or tags..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className="w-full px-5 py-4 pl-12 pr-24 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 dark:text-white placeholder-neutral-400 transition-all duration-300"
          />
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <button
            type="submit"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors duration-300 text-sm font-medium"
          >
            Search
          </button>
        </div>
      </form>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {/* Filter Toggle Button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-orange-500 transition-colors duration-300"
          >
            <Filter className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Filters
            </span>
            {activeFiltersCount > 0 && (
              <span className="px-1.5 py-0.5 bg-orange-500 text-white text-xs rounded-full">
                {activeFiltersCount}
              </span>
            )}
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
            />
          </motion.button>

          {/* Active Filters */}
          {activeFiltersCount > 0 && (
            <div className="flex flex-wrap gap-2">
              {filters.category && (
                <div className="flex items-center gap-1 px-2 py-1 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                  <span className="text-xs text-orange-600 dark:text-orange-400">
                    {filters.category}
                  </span>
                  <button
                    onClick={() => handleFilterChange("category", "")}
                    className="hover:text-orange-600 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
              {filters.tag && (
                <div className="flex items-center gap-1 px-2 py-1 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                  <span className="text-xs text-orange-600 dark:text-orange-400">
                    #{filters.tag}
                  </span>
                  <button
                    onClick={() => handleFilterChange("tag", "")}
                    className="hover:text-orange-600 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
              {filters.dateRange !== "all" && (
                <div className="flex items-center gap-1 px-2 py-1 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                  <span className="text-xs text-orange-600 dark:text-orange-400">
                    {
                      dateRangeOptions.find(
                        (o) => o.value === filters.dateRange,
                      )?.label
                    }
                  </span>
                  <button
                    onClick={() => handleFilterChange("dateRange", "all")}
                    className="hover:text-orange-600 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
              <button
                onClick={clearFilters}
                className="text-xs text-gray-500 hover:text-orange-500 transition-colors"
              >
                Clear all
              </button>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Showing{" "}
          <span className="font-semibold text-orange-500">{totalPosts}</span>{" "}
          articles
        </div>
      </div>

      {/* Advanced Filters Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Category
                  </label>
                  <div className="relative">
                    <select
                      value={filters.category}
                      onChange={(e) =>
                        handleFilterChange("category", e.target.value)
                      }
                      className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 appearance-none cursor-pointer"
                    >
                      <option value="">All Categories</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Tags Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Tags
                  </label>
                  <div className="relative">
                    <select
                      value={filters.tag}
                      onChange={(e) =>
                        handleFilterChange("tag", e.target.value)
                      }
                      className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 appearance-none cursor-pointer"
                    >
                      <option value="">All Tags</option>
                      {tags.map((tag) => (
                        <option key={tag} value={tag}>
                          #{tag}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Date Range Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Date Range
                  </label>
                  <div className="relative">
                    <select
                      value={filters.dateRange}
                      onChange={(e) =>
                        handleFilterChange("dateRange", e.target.value as any)
                      }
                      className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 appearance-none cursor-pointer"
                    >
                      {dateRangeOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Sort By */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Sort By
                  </label>
                  <div className="relative">
                    <select
                      value={filters.sortBy}
                      onChange={(e) =>
                        handleFilterChange("sortBy", e.target.value as any)
                      }
                      className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 appearance-none cursor-pointer"
                    >
                      {sortOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Popular Tags Cloud */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Popular Tags
                </label>
                <div className="flex flex-wrap gap-2">
                  {tags.slice(0, 12).map((tag) => (
                    <motion.button
                      key={tag}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleFilterChange("tag", tag)}
                      className={`px-3 py-1.5 text-sm rounded-lg transition-all duration-300 ${
                        filters.tag === tag
                          ? "bg-orange-500 text-white"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-orange-100 dark:hover:bg-orange-900/30 hover:text-orange-600"
                      }`}
                    >
                      #{tag}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-orange-500 transition-colors"
                >
                  Clear All Filters
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 bg-orange-500 text-white text-sm rounded-lg hover:bg-orange-600 transition-colors"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
