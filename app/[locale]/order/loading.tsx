import { useTranslations } from 'next-intl'

export default function Loading() {
  const t = useTranslations('order')
  
  return (
    <div className="min-h-screen bg-white dark:bg-neutral-800">
      <div className="max-w-4xl mx-auto px-6 pt-16 pb-12">
        <div className="h-10 w-72 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        <div className="mt-6 h-12 w-full bg-gray-50 dark:bg-gray-900 border border-gray-200/60 dark:border-gray-700/60 rounded-xl animate-pulse" />

        <div className="mt-8 grid grid-cols-1 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-32 bg-gray-50 dark:bg-gray-900 border border-gray-200/60 dark:border-gray-700/60 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  )
}