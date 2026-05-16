'use client'

import dynamic from 'next/dynamic'
import { machinesData } from '@/data/machinesData'

const MachinesPageClient = dynamic(
  () => import('./MachinesPageClient'),
  { ssr: false }
)

interface MachinesPageWrapperProps {
  machines: typeof machinesData
}

export default function MachinesPageWrapper({ machines }: MachinesPageWrapperProps) {
  return <MachinesPageClient machines={machines} />
}