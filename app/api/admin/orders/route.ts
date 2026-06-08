// admin/orders/route.ts — admin GET all orders from database
import { NextResponse } from 'next/server';
import { verifyAdminSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Verify admin is logged in
    const session = await verifyAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Query orders from Prisma
    const dbOrders = await prisma.order.findMany({
      include: {
        items: true,
        shipping_address: true,
        profile: true,
      },
      orderBy: {
        created_at: 'desc',
      },
      take: 200,
    });

    const orders = dbOrders.map(order => {
      const item = order.items[0];

      return {
        id: order.id,
        orderId: order.order_number,
        status: order.status ?? 'pending',
        machineId: item ? item.machine_id : '',
        machineName: item ? item.product_name : 'Unknown Machine',
        unitPrice: item ? item.price : 0,
        totalAmount: order.total,
        quantity: item ? item.quantity : 1,
        customerName: order.customer_name,
        customerEmail: order.customer_email,
        customerInfo: {
          fullName: order.customer_name,
          companyName: order.profile?.company || '',
          email: order.customer_email,
          phone: order.customer_phone || '',
          address: order.shipping_address?.street || '',
          city: order.shipping_address?.city || '',
        },
        deliveryInfo: {
          preferredDate: order.preferred_delivery_date?.toISOString() || '',
          deliveryAddress: order.delivery_address_text || '',
          specialInstructions: order.special_instructions || '',
        },
        paymentMethod: order.payment_method || 'Not specified',
        termsAccepted: order.terms_accepted,
        createdAt: order.created_at.toISOString(),
      };
    });

    return NextResponse.json({ orders });
  } catch (error) {
    console.error('Orders API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}