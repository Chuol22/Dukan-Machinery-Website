import MachineDetailPageWrapper from '@/components/pages/MachineDetailPageWrapper'
import { notFound } from 'next/navigation'
import { getMachineBySlug } from '@/data/machinesData'

export default function MachineDetailPage({ params }: { params: { slug: string } }) {
  const machine = getMachineBySlug(params.slug)

  if (!machine) {
    return notFound()
  }

  return <MachineDetailPageWrapper machine={machine} />
}
