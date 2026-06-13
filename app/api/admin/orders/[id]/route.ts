// admin/orders/[id]/route.ts — admin DELETE order and related records
import { NextResponse } from 'next/server';
import { verifyAdminSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await verifyAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const adminNotes = body?.admin_notes !== undefined ? String(body.admin_notes) : undefined;
    const assignedTo = body?.assigned_to !== undefined ? String(body.assigned_to) : undefined;

    const existing = await prisma.order.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const mergedNotes = [existing.admin_notes, adminNotes].filter(Boolean).join('\n\n');
    const nextAssigned = assignedTo ?? existing.admin_notes?.split('Assigned to:')?.[1]?.split('\n')?.[0]?.trim() ?? null;

    const order = await prisma.order.update({
      where: { id },
      data: {
        admin_notes: mergedNotes || null,
        ...(nextAssigned ? { admin_notes: `${mergedNotes ? `${mergedNotes}\n\n` : ''}Assigned to: ${nextAssigned}`.trim() } : {}),
      },
    });

    return NextResponse.json({ order });
  } catch (error) {
    console.error('Update order workflow error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Verify admin is logged in
    const session = await verifyAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Delete notifications related to this order first
    const deletedNotifications = await prisma.notification.deleteMany({
      where: { order_id: id }
    });
    console.log(`Deleted ${deletedNotifications.count} notifications for order ${id}`);

    // Delete order items first (due to foreign key constraint)
    const deletedItems = await prisma.orderItem.deleteMany({
      where: { order_id: id }
    });
    console.log(`Deleted ${deletedItems.count} order items for order ${id}`);

    // Delete the order
    await prisma.order.delete({
      where: { id }
    });
    console.log(`Deleted order ${id}`);

    return NextResponse.json({ success: true, message: 'Order deleted successfully' });
  } catch (error) {
    console.error('Delete order error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
