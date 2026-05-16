'use client'

import dynamic from 'next/dynamic'

const ProcessPageClient = dynamic(() => import('./ProcessPageClient'), {
  ssr: false,
})

export default function ProcessPageWrapper() {
  return <ProcessPageClient />
}