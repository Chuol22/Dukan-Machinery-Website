'use client'

import dynamic from 'next/dynamic'

const OrderPageClient = dynamic(() => import('./OrderPageClient'), {
  ssr: false,
})

export default function OrderPageWrapper() {
  return <OrderPageClient />
}