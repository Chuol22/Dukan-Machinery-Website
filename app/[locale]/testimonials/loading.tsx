import { useTranslations } from 'next-intl'

export default function Loading() {
  const t = useTranslations('testimonials')
  
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="pt-32 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-10 w-80 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mx-auto" />

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="p-8 bg-gray-50 dark:bg-gray-800 border border-gray-200/60 dark:border-gray-700/60 rounded-2xl">
                <div className="h-5 w-3/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                <div className="mt-4 h-12 w-12 rounded-xl bg-gray-200 dark:bg-gray-700 animate-pulse" />
                <div className="mt-4 h-24 w-full bg-gray-200 dark:bg-gray-700 rounded-2xl animate-pulse" />
              </div>
            ))}
          </div>

          <div className="mt-16 h-24 w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200/60 dark:border-gray-700/60 rounded-2xl animate-pulse" />
        </div>
      </div>
    </div>
  )
}