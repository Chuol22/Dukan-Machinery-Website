
import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search, 
  Filter, 
  X, 
  ChevronDown, 
  Calendar,
  TrendingUp,
  Clock,
  Eye,
  Tag
} from 'lucide-react'
import { useTranslations } from 'next-intl'

interface BlogFiltersProps {
  onFilterChange: (filters: FilterOptions) => void
  categories: string[]
  tags: string[]
  totalPosts: number
}

interface FilterOptions {
  search: string
  category: string
  tag: string
  sortBy: 'newest' | 'oldest' | 'popular' | 'trending'
  dateRange: 'all' | 'week' | 'month' | 'year'
}

export default function BlogFilters({ onFilterChange, categories, tags, totalPosts }: BlogFiltersProps) {
  const t = useTranslations('blog')
  const [isOpen, setIsOpen] = useState(false)
  const [filters, setFilters] = useState<FilterOptions>({
    search: '',
    category: '',
    tag: '',
    sortBy: 'newest',
    dateRange: 'all',
  })
  const [activeFiltersCount, setActiveFiltersCount] = useState(0)

  const sortOptions = [
    { value: 'newest', label: t('blogFilters.sortOptions.newest'), icon: Clock },
    { value: 'oldest', label: t('blogFilters.sortOptions.oldest'), icon: Calendar },
    { value: 'popular', label: t('blogFilters.sortOptions.popular'), icon: Eye },
    { value: 'trending', label: t('blogFilters.sortOptions.trending'), icon: TrendingUp },
  ]

  const dateRangeOptions = [
    { value: 'all', label: t('blogFilters.dateRange.all') },
    { value: 'week', label: t('blogFilters.dateRange.week') },
    { value: 'month', label: t('blogFilters.dateRange.month') },
    { value: 'year', label: t('blogFilters.dateRange.year') },
  ]

  useEffect(() => {
    let count = 0
    if (filters.category) count++
    if (filters.tag) count++
    if (filters.dateRange !== 'all') count++
    if (filters.sortBy !== 'newest') count++
    setActiveFiltersCount(count)
  }, [filters])

  const handleFilterChange = (key: keyof FilterOptions, value: string) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const clearFilters = () => {
    const resetFilters: FilterOptions = {
      search: '',
      category: '',
      tag: '',
      sortBy: 'newest',
      dateRange: 'all',
    }
    setFilters(resetFilters)
    onFilterChange(resetFilters)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    onFilterChange(filters)
  }

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="relative">
        <div className="relative">
          <input
            type="text"
            placeholder={t('blogFilters.searchPlaceholder')}
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className="w-full px-5 py-4 pl-12 pr-24 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-neutral-900 dark:text-white placeholder-neutral-400 transition-all duration-300"
          />
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
          <button
            type="submit"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors duration-300 text-sm font-medium"
          >
            {t('blogFilters.searchButton')}
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
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg hover:border-orange-500 transition-colors duration-300"
          >
            <Filter className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
            <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
              {t('blogFilters.filtersButton')}
            </span>
            {activeFiltersCount > 0 && (
              <span className="px-1.5 py-0.5 bg-orange-500 text-white text-xs rounded-full">
                {activeFiltersCount}
              </span>
            )}
            <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
          </motion.button>

          {/* Active Filters */}
          {activeFiltersCount > 0 && (
            <div className="flex flex-wrap gap-2">
              {filters.category && (
                <div className="flex items-center gap-1 px-2 py-1 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                  <span className="text-xs text-orange-600 dark:text-orange-400">{filters.category}</span>
                  <button
                    onClick={() => handleFilterChange('category', '')}
                    className="hover:text-orange-600 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
              {filters.tag && (
                <div className="flex items-center gap-1 px-2 py-1 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                  <span className="text-xs text-orange-600 dark:text-orange-400">#{filters.tag}</span>
                  <button
                    onClick={() => handleFilterChange('tag', '')}
                    className="hover:text-orange-600 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
              {filters.dateRange !== 'all' && (
                <div className="flex items-center gap-1 px-2 py-1 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                  <span className="text-xs text-orange-600 dark:text-orange-400">
                    {dateRangeOptions.find(o => o.value === filters.dateRange)?.label}
                  </span>
                  <button
                    onClick={() => handleFilterChange('dateRange', 'all')}
                    className="hover:text-orange-600 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
              <button
                onClick={clearFilters}
                className="text-xs text-neutral-500 hover:text-orange-500 transition-colors"
              >
                {t('blogFilters.clearAll')}
              </button>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="text-sm text-neutral-500 dark:text-neutral-400">
          {t('blogFilters.showing')} <span className="font-semibold text-orange-500">{totalPosts}</span> {t('blogFilters.articles')}
        </div>
      </div>

      {/* Advanced Filters Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-6 bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    {t('blogFilters.category') || 'Category'}
                  </label>
                  <div className="relative">
                    <select
                      value={filters.category}
                      onChange={(e) => handleFilterChange('category', e.target.value)}
                      className="w-full px-4 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 appearance-none cursor-pointer"
                    >
                      <option value="">{t('blogFilters.allCategories')}</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
                  </div>
                </div>

                {/* Tags Filter */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    {t('blogFilters.tags') || 'Tags'}
                  </label>
                  <div className="relative">
                    <select
                      value={filters.tag}
                      onChange={(e) => handleFilterChange('tag', e.target.value)}
                      className="w-full px-4 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 appearance-none cursor-pointer"
                    >
                      <option value="">{t('blogFilters.allTags')}</option>
                      {tags.map((tag) => (
                        <option key={tag} value={tag}>
                          #{tag}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
                  </div>
                </div>

                {/* Date Range Filter */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    {t('blogFilters.dateRange.label') || 'Date Range'}
                  </label>
                  <div className="relative">
                    <select
                      value={filters.dateRange}
                      onChange={(e) => handleFilterChange('dateRange', e.target.value as any)}
                      className="w-full px-4 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 appearance-none cursor-pointer"
                    >
                      {dateRangeOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
                  </div>
                </div>

                {/* Sort By */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    {t('blogFilters.sortBy.label') || 'Sort By'}
                  </label>
                  <div className="relative">
                    <select
                      value={filters.sortBy}
                      onChange={(e) => handleFilterChange('sortBy', e.target.value as any)}
                      className="w-full px-4 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 appearance-none cursor-pointer"
                    >
                      {sortOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Popular Tags Cloud */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-3">
                  {t('blogFilters.popularTags')}
                </label>
                <div className="flex flex-wrap gap-2">
                  {tags.slice(0, 12).map((tag) => (
                    <motion.button
                      key={tag}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleFilterChange('tag', tag)}
                      className={`px-3 py-1.5 text-sm rounded-lg transition-all duration-300 ${
                        filters.tag === tag
                          ? 'bg-orange-500 text-white'
                          : 'bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-400 hover:bg-orange-100 dark:hover:bg-orange-900/30 hover:text-orange-600'
                      }`}
                    >
                      #{tag}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-neutral-200 dark:border-neutral-700">
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 text-sm text-neutral-600 dark:text-neutral-400 hover:text-orange-500 transition-colors"
                >
                  {t('blogFilters.clearAllFilters')}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 bg-orange-500 text-white text-sm rounded-lg hover:bg-orange-600 transition-colors"
                >
                  {t('blogFilters.applyFilters')}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}