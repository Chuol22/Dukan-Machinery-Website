 
import { useTranslations } from 'next-intl';
import MachinesPageWrapper from '@/components/pages/MachinesPageWrapper';
import { machinesData } from '@/data/machinesData';

export default function MachinesPage() {
  const t = useTranslations('machines');
  
  return (
    <div>
      <MachinesPageWrapper machines={machinesData} />
    </div>
  );
}