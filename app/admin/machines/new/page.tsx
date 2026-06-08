// Admin new machine route — opens add form on mount
import MachinesClient from '../MachinesClient';

export default function NewMachinePage() {
  return <MachinesClient openAddOnMount />;
}
