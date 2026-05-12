// Performance monitoring utilities

export const measurePerformance = (name: string, fn: () => void) => {
  if (typeof window !== 'undefined' && 'performance' in window) {
    const start = performance.now()
    fn()
    const end = performance.now()
    const duration = end - start
    
    if (duration > 100) {
      console.warn(`[Performance] ${name} took ${duration.toFixed(2)}ms`)
    }
    
    return duration
  }
  fn()
  return 0
}

export const reportWebVitals = (metric: { name: string; value: number; id?: string }) => {
  if (typeof window !== 'undefined') {
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log('[Web Vitals]', metric)
    }
    
    // Send to analytics service in production
    if (process.env.NODE_ENV === 'production') {
      // TODO: Integrate with your analytics service
      // Example: analytics.track('web_vital', metric)
    }
  }
}

export const observeIntersection = (
  element: Element,
  callback: IntersectionObserverCallback,
  options?: IntersectionObserverInit
) => {
  if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(callback, options)
    observer.observe(element)
    return observer
  }
  return null
}

export const lazyLoadImage = (img: HTMLImageElement, src: string) => {
  if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          img.src = src
          img.classList.remove('lazy')
          observer.unobserve(img)
        }
      })
    })
    observer.observe(img)
  } else {
    img.src = src
  }
}
