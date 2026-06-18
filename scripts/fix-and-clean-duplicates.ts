// Script to fix OrderItems and remove duplicate machines
import { PrismaClient } from '@prisma/client';
import { machinesData } from '../data/machinesData';

const prisma = new PrismaClient();

async function fixAndClean() {
  console.log('🔧 Fixing OrderItems and removing duplicates...\n');
  
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
  
  // Create a map of valid machines (those with proper slugs)
  const staticSlugs = new Set(machinesData.map(m => m.slug));
  const validMachines = dbMachines.filter(m => staticSlugs.has(m.slug));
  const invalidMachines = dbMachines.filter(m => !staticSlugs.has(m.slug));
  
  // Create a name-to-valid-machine map for fixing
  const nameToValidMachine = new Map<string, typeof validMachines[0]>();
  for (const machine of validMachines) {
    nameToValidMachine.set(machine.name.toLowerCase(), machine);
  }
  
  console.log(`✅ Found ${validMachines.length} valid machines`);
  console.log(`❌ Found ${invalidMachines.length} invalid machines\n`);
  
  // Fix OrderItems for each invalid machine
  for (const invalidMachine of invalidMachines) {
    console.log(`🔍 Checking OrderItems for: ${invalidMachine.name} (${invalidMachine.slug})`);
    
    // Find OrderItems referencing this invalid machine
    const orderItems = await prisma.orderItem.findMany({
      where: { machine_id: invalidMachine.id },
      select: { id: true, product_name: true },
    });
    
    if (orderItems.length === 0) {
      console.log(`   No OrderItems found. Safe to delete.\n`);
      continue;
    }
    
    console.log(`   Found ${orderItems.length} OrderItems`);
    
    // Find the corresponding valid machine
    const validMachine = nameToValidMachine.get(invalidMachine.name.toLowerCase());
    
    if (!validMachine) {
      console.log(`   ❌ No valid machine found with matching name!`);
      console.log(`   ⚠️  Cannot delete this machine - OrderItems exist\n`);
      continue;
    }
    
    console.log(`   ✅ Found valid machine: ${validMachine.name} (${validMachine.slug})`);
    console.log(`   🔄 Updating ${orderItems.length} OrderItems...`);
    
    // Update all OrderItems to point to the valid machine
    await prisma.orderItem.updateMany({
      where: { machine_id: invalidMachine.id },
      data: { machine_id: validMachine.id },
    });
    
    console.log(`   ✅ OrderItems updated successfully\n`);
  }
  
  // Now try to delete invalid machines again
  console.log(`\n🗑️  Removing invalid machines...\n`);
  
  for (const invalidMachine of invalidMachines) {
    try {
      await prisma.machine.delete({
        where: { id: invalidMachine.id },
      });
      console.log(`✅ Deleted: ${invalidMachine.name} (${invalidMachine.slug})`);
    } catch (error: any) {
      console.log(`❌ Could not delete ${invalidMachine.name}: ${error.message}`);
    }
  }
  
  // Final count
  const finalCount = await prisma.machine.count();
  console.log(`\n✅ Cleanup complete!`);
  console.log(`📊 Remaining machines: ${finalCount}`);
  console.log(`📊 Expected machines: ${machinesData.length}`);
  
  if (finalCount === machinesData.length) {
    console.log(`\n🎉 Perfect! Database now has exactly ${machinesData.length} machines.`);
  }
  
  await prisma.$disconnect();
}

fixAndClean().catch(console.error);