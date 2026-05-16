'use client'

import dynamic from 'next/dynamic'

const InsightsPageClient = dynamic(() => import('./InsightsPageClient'), {
  ssr: false,
})

export default function InsightsPageWrapper() {
  return <InsightsPageClient />
}