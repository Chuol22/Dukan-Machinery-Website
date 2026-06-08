// Script to update old 'accepted' status to 'confirmed' in database
// Run with: npx tsx scripts/update-order-statuses.ts

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updateOrderStatuses() {
  try {
    console.log('Updating order statuses from "accepted" to "confirmed"...');
    
    const result = await prisma.order.updateMany({
      where: {
        status: 'accepted'
      },
      data: {
        status: 'confirmed'
      }
    });
    
    console.log(`Updated ${result.count} orders from 'accepted' to 'confirmed'`);
    
    // Also check for any other non-standard statuses
    const orders = await prisma.order.findMany({
      select: {
        id: true,
        status: true,
        order_number: true
      }
    });
    
    console.log('\nCurrent order statuses:');
    const statusCounts: Record<string, number> = {};
    orders.forEach(order => {
      statusCounts[order.status] = (statusCounts[order.status] || 0) + 1;
    });
    
    Object.entries(statusCounts).forEach(([status, count]) => {
      console.log(`  ${status}: ${count}`);
    });
    
  } catch (error) {
    console.error('Error updating order statuses:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateOrderStatuses();
