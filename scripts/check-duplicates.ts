// Script to check for and remove duplicate machines in database
import { PrismaClient } from '@prisma/client';
import { machinesData } from '../data/machinesData';

const prisma = new PrismaClient();

async function checkDuplicates() {
  console.log('🔍 Checking for duplicate machines...\n');
  
  // 1. Count machines in database
  const dbMachines = await prisma.machine.findMany({
    select: {
      id: true,
      slug: true,
      name: true,
      image: true,
      sku: true,
      created_at: true,
    },
    orderBy: { created_at: 'asc' },
  });
  
  console.log(`📊 Database has ${dbMachines.length} machines`);
  console.log(`📊 Static data has ${machinesData.length} machines\n`);
  
  // 2. Find duplicates by slug
  const slugCount = new Map<string, number>();
  const duplicates: typeof dbMachines = [];
  
  for (const machine of dbMachines) {
    const count = slugCount.get(machine.slug) || 0;
    slugCount.set(machine.slug, count + 1);
    
    if (count > 0) {
      duplicates.push(machine);
    }
  }
  
  if (duplicates.length > 0) {
    console.log(`❌ Found ${duplicates.length} duplicate machines:\n`);
    for (const dup of duplicates) {
      console.log(`  - ${dup.name} (${dup.slug}) - ID: ${dup.id}`);
    }
  } else {
    console.log('✅ No duplicates found by slug\n');
  }
  
  // 3. Find machines not in static data
  const staticSlugs = new Set(machinesData.map(m => m.slug));
  const extraMachines = dbMachines.filter(m => !staticSlugs.has(m.slug));
  
  if (extraMachines.length > 0) {
    console.log(`\n⚠️  Found ${extraMachines.length} machines in DB not in static data:\n`);
    for (const extra of extraMachines) {
      console.log(`  - ${extra.name} (${extra.slug}) - ID: ${extra.id}`);
      console.log(`    Created: ${extra.created_at}`);
      console.log(`    Image: ${extra.image?.substring(0, 60)}...`);
    }
  }
  
  // 4. Show all machines with their images
  console.log('\n📋 All machines in database:\n');
  for (const machine of dbMachines) {
    const isDuplicate = duplicates.some(d => d.id === machine.id);
    const isExtra = extraMachines.some(e => e.id === machine.id);
    const marker = isDuplicate ? '🔴 DUP' : isExtra ? '⚠️  EXTRA' : '✅';
    
    console.log(`${marker} ${machine.name}`);
    console.log(`   Slug: ${machine.slug}`);
    console.log(`   Image: ${machine.image?.substring(0, 80) || 'none'}...`);
    console.log('');
  }
  
  await prisma.$disconnect();
}

checkDuplicates().catch(console.error);