export default function Loading() {
  return (
    <div className="min-h-screen bg-white dark:bg-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="h-8 w-56 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />

        <div className="mt-6 bg-gray-50 dark:bg-gray-900 border border-gray-200/60 dark:border-gray-700/60 rounded-2xl p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="h-28 w-28 sm:h-32 sm:w-32 rounded-2xl bg-gray-200 dark:bg-gray-700 animate-pulse" />
            <div className="flex-1 w-full">
              <div className="h-6 w-3/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              <div className="mt-3 h-5 w-2/5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            </div>
          </div>
        </div>

        <div className="mt-6 h-12 w-full bg-gray-50 dark:bg-gray-900 border border-gray-200/60 dark:border-gray-700/60 rounded-xl animate-pulse" />

        <div className="mt-6 grid grid-cols-1 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-32 bg-gray-50 dark:bg-gray-900 border border-gray-200/60 dark:border-gray-700/60 rounded-2xl animate-pulse"
            />
          ))}
        </div>
      </div>
    </div>
  )
}


