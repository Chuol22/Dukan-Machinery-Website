import { useTranslations } from 'next-intl'

export default function Loading() {
  const t = useTranslations('process')
  
  return (
    <div className="min-h-screen bg-white dark:bg-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="h-8 w-64 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="p-6 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-200/60 dark:border-gray-700/60">
              <div className="h-12 w-12 rounded-xl bg-gray-200 dark:bg-gray-700 animate-pulse" />
              <div className="mt-4 h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              <div className="mt-2 h-3 w-5/6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              <div className="mt-4 h-20 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}