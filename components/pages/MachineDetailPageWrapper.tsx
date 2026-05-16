'use client'

import dynamic from 'next/dynamic'

const MachineDetailPageClient = dynamic(
  () => import('./MachineDetailPageClient'),
  { ssr: false }
)

interface MachineDetailPageWrapperProps {
  machine: any // Using any to match the existing type
}

export default function MachineDetailPageWrapper({ machine }: MachineDetailPageWrapperProps) {
  return <MachineDetailPageClient machine={machine} />
}