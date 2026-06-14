// admin/orders/[id]/reject/route.ts — reject order, notify admin, email customer
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { verifyAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    // Verify admin is logged in
    const session = await verifyAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // First get the order using Prisma
    const order = await prisma.order.findUnique({
      where: { id },
      select: {
        id: true,
        order_number: true,
        status: true,
        total: true,
        customer_name: true,
        customer_email: true,
        customer_phone: true,
        profile_id: true,
        items: {
          select: {
            product_name: true,
            quantity: true,
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    // Update order status using Prisma
    await prisma.order.update({
      where: { id },
      data: {
        status: "rejected",
        updated_at: new Date(),
      },
    });

    // Mark any existing notifications for this order as read
    await prisma.notification.updateMany({
      where: {
        order_id: id,
        type: "new_order",
      },
      data: {
        read: true,
      },
    });

    // Send rejection email to customer if email exists
    const customerEmail = order.customer_email;
    const item = order.items[0];
    const machineName = item ? item.product_name : "Requested Machine";
    const quantity = item ? item.quantity : 1;
    const totalPrice = order.total;

    if (customerEmail) {
      try {
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        });

        const rejectionHtml = `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <title>Order Update - Dukan Machinery</title>
          </head>
          <body style="font-family: Arial, sans-serif; background-color: #f5f5f5; margin: 0; padding: 20px;">
            <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden;">
              <div style="background: linear-gradient(135deg, #ef4444, #dc2626); color: white; padding: 30px; text-align: center;">
                <h1 style="margin: 0;">Order Update</h1>
              </div>
              <div style="padding: 30px;">
                <h2>Dear ${order.customer_name || "Customer"},</h2>
                <p>Regarding your order <strong>#${order.order_number}</strong>:</p>
                <div style="background: #fef2f2; border-left: 4px solid #ef4444; padding: 15px; margin: 20px 0;">
                  <p style="margin: 0; color: #dc2626;"><strong>Status: Not Accepted at this time</strong></p>
                </div>
                <p>We appreciate your interest in Dukan Machinery. While we cannot fulfill this specific request at this time, please don't hesitate to:</p>
                <ul>
                  <li>Contact us directly to discuss alternative options</li>
                  <li>Submit a custom request form for specialized requirements</li>
                  <li>Call our sales team for immediate assistance</li>
                </ul>
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
          subject: `Order Update #${order.order_number} - Dukan Machinery`,
          html: rejectionHtml,
        });
      } catch (emailError) {
        console.error("Failed to send rejection email:", emailError);
      }
    }

    return NextResponse.json({ success: true, message: "Order rejected" });
  } catch (error) {
    console.error("Reject order error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
