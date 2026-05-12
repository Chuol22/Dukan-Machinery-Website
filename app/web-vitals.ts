import { reportWebVitals } from '@/utils/performance'

export function reportWebVitalsOnRouteChange() {
  if (typeof window !== 'undefined') {
    // Report web vitals when the route changes
    if ('navigation' in performance) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'navigation') {
            const navEntry = entry as PerformanceNavigationTiming
            reportWebVitals({
              name: 'navigation',
              value: navEntry.loadEventEnd - navEntry.fetchStart,
              id: 'page-load'
            })
          }
        }
      })
      observer.observe({ entryTypes: ['navigation'] })
    }
  }
}
