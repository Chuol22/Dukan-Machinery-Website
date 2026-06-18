// Script to remove duplicate/invalid machines from database
import { PrismaClient } from '@prisma/client';
import { machinesData } from '../data/machinesData';

const prisma = new PrismaClient();

async function removeDuplicates() {
  console.log('🧹 Starting cleanup of duplicate machines...\n');
  
  // Get all machines
  const dbMachines = await prisma.machine.findMany({
    select: {
      id: true,
      slug: true,
      name: true,
      image: true,
    },
    orderBy: { created_at: 'asc' },
  });
  
  // Find machines not in static data (these are the bad ones)
  const staticSlugs = new Set(machinesData.map(m => m.slug));
  const machinesToDelete = dbMachines.filter(m => !staticSlugs.has(m.slug));
  
  console.log(`Found ${machinesToDelete.length} machines to remove:\n`);
  
  for (const machine of machinesToDelete) {
    console.log(`  🗑️  Removing: ${machine.name} (slug: "${machine.slug}")`);
    console.log(`      ID: ${machine.id}`);
    console.log(`      Image: ${machine.image || 'none'}`);
    
    try {
      // Delete the machine
      await prisma.machine.delete({
        where: { id: machine.id },
      });
      console.log(`      ✅ Deleted successfully\n`);
    } catch (error) {
      console.log(`      ❌ Error deleting: ${error}\n`);
    }
  }
  
  // Count remaining machines
  const remainingCount = await prisma.machine.count();
  console.log(`\n✅ Cleanup complete!`);
  console.log(`📊 Remaining machines in database: ${remainingCount}`);
  console.log(`📊 Expected machines (static data): ${machinesData.length}`);
  
  if (remainingCount === machinesData.length) {
    console.log(`\n🎉 Perfect! Database now matches static data.`);
  } else if (remainingCount < machinesData.length) {
    console.log(`\n⚠️  Database has fewer machines than expected.`);
    console.log(`   Run the app to sync missing machines.`);
  } else {
    console.log(`\n⚠️  Database still has extra machines.`);
  }
  
  await prisma.$disconnect();
}

removeDuplicates().catch(console.error);