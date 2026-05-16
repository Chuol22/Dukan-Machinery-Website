import { useTranslations } from 'next-intl'

export default function Loading() {
  const t = useTranslations('insights')
  
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-10 w-80 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mx-auto" />

          <div className="mt-10 bg-gray-50 dark:bg-gray-800/50 border border-gray-200/60 dark:border-gray-700/60 rounded-2xl p-6">
            <div className="h-12 w-56 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            <div className="mt-4 h-5 w-2/3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-48 bg-gray-200/50 dark:bg-gray-700/50 rounded-2xl animate-pulse" />
              ))}
            </div>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="p-6 bg-gray-50 dark:bg-gray-800 border border-gray-200/60 dark:border-gray-700/60 rounded-2xl">
                <div className="h-40 w-full bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
                <div className="mt-4 h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                <div className="mt-2 h-3 w-2/3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}