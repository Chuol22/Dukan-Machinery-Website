export default function Loading() {
  return (
    <div className="min-h-screen bg-white dark:bg-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="h-10 w-72 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        <div className="mt-6 h-10 w-full bg-gray-100 dark:bg-gray-900 rounded-xl border border-gray-200/60 dark:border-gray-700/60 animate-pulse" />

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="p-6 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-200/60 dark:border-gray-700/60">
              <div className="h-40 w-full rounded-xl bg-gray-200 dark:bg-gray-700 animate-pulse" />
              <div className="mt-4 h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              <div className="mt-2 h-3 w-1/2 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              <div className="mt-6 h-9 w-2/3 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

