// admin/orders/[id]/accept/route.ts — confirm order, notify admin, email customer
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { verifyAdminSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(
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

    // First get the order using Prisma
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: true,
        profile: true,
      }
    });

    if (!order) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 });
    }

    // Update order status using Prisma
    await prisma.order.update({
      where: { id },
      data: {
        status: 'confirmed',
        updated_at: new Date(),
      }
    });

    // Create notification using Prisma
    await prisma.notification.create({
      data: {
        order_id: id,
        profile_id: order.profile_id,
        type: 'order_accepted',
        title: 'Order Accepted',
        message: `Order #${order.order_number} has been accepted by ${session.name || 'Admin'}`,
        read: false
      }
    });

    // Mark any existing notifications for this order as read
    await prisma.notification.updateMany({
      where: {
        order_id: id,
        type: 'new_order'
      },
      data: {
        read: true
      }
    });

    // Send acceptance email to customer if email exists
    const customerEmail = order.customer_email;
    const item = order.items[0];
    const machineName = item ? item.product_name : 'Requested Machine';
    const quantity = item ? item.quantity : 1;
    const totalPrice = order.total;

    if (customerEmail) {
      try {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        });

        const acceptanceHtml = `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <title>Order Accepted - Dukan Machinery</title>
          </head>
          <body style="font-family: Arial, sans-serif; background-color: #f5f5f5; margin: 0; padding: 20px;">
            <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden;">
              <div style="background: linear-gradient(135deg, #22c55e, #16a34a); color: white; padding: 30px; text-align: center;">
                <h1 style="margin: 0;">✓ Order Accepted!</h1>
              </div>
              <div style="padding: 30px;">
                <h2>Dear ${order.customer_name || 'Customer'},</h2>
                <p>Great news! Your order <strong>#${order.order_number}</strong> has been <strong style="color: #22c55e;">ACCEPTED</strong>.</p>
                <div style="background: #f0fdf4; border-left: 4px solid #22c55e; padding: 15px; margin: 20px 0;">
                  <h3 style="margin-top: 0;">Order Summary:</h3>
                  <p><strong>Product:</strong> ${machineName}</p>
                  <p><strong>Quantity:</strong> ${quantity}</p>
                  <p><strong>Total Amount:</strong> ETB ${totalPrice?.toLocaleString() || 'Price on request'}</p>
                </div>
                <p><strong>Next Steps:</strong></p>
                <ol>
                  <li>Our sales team will contact you within 24 hours</li>
                  <li>You will receive a proforma invoice via email</li>
                  <li>Production will begin after payment confirmation (2-3 weeks lead time)</li>
                </ol>
                <hr style="margin: 20px 0;">
                <p style="font-size: 12px; color: #666;">Dukan Machinery | Contact: geletupro@gmail.com | +251 912 713 823</p>
              </div>
            </div>
          </body>
          </html>
        `;

        await transporter.sendMail({
          from: `"Dukan Machinery" <${process.env.EMAIL_USER}>`,
          to: customerEmail,
          subject: `✓ Order Accepted #${order.order_number} - Dukan Machinery`,
          html: acceptanceHtml,
        });
      } catch (emailError) {
        console.error('Failed to send acceptance email:', emailError);
      }
    }

    return NextResponse.json({ success: true, message: 'Order accepted successfully' });
  } catch (error) {
    console.error('Accept order error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}