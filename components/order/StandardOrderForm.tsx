'use client'

import dynamic from 'next/dynamic'
import { Suspense } from 'react'

// Lazy load the heavy form component with no SSR
const StandardOrderFormClient = dynamic(
  () => import('./StandardOrderFormClient'),
  {
    loading: () => (
      <div className="bg-neutral-50 dark:bg-neutral-900 rounded-2xl p-8 shadow-xl">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-neutral-200 dark:bg-neutral-700 rounded w-1/3 mx-auto"></div>
          <div className="h-64 bg-neutral-200 dark:bg-neutral-700 rounded"></div>
          <div className="h-12 bg-neutral-200 dark:bg-neutral-700 rounded w-1/2 mx-auto"></div>
        </div>
      </div>
    ),
    ssr: false, // Disable SSR for this component
  }
)

export default function StandardOrderForm(props: any) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <StandardOrderFormClient {...props} />
    </Suspense>
  )
}

// Re-export the types
export type { StandardOrderData } from './StandardOrderFormClient'