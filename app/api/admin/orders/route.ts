// admin/orders/route.ts — admin GET all orders from database
import { NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Verify admin is logged in
    const session = await verifyAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Query orders from Prisma (use select to avoid DB/model mismatch issues like missing columns)
    const dbOrders = await prisma.order.findMany({
      select: {
        id: true,
        order_number: true,
        status: true,
        total: true,
        customer_name: true,
        customer_email: true,
        customer_phone: true,
        preferred_delivery_date: true,
        delivery_address_text: true,
        special_instructions: true,
        payment_method: true,
        terms_accepted: true,
        created_at: true,
        admin_notes: true,
        // NOTE: customer_id deliberately NOT selected to avoid DB mismatch errors
        shipping_address: {
          select: {
            street: true,
            city: true,
          },
        },
        profile: {
          select: {
            company: true,
          },
        },
        items: {
          select: {
            id: true,
            machine_id: true,
            product_name: true,
            quantity: true,
            price: true,
            product_image: true,
          },
        },
        quotations: {
          select: {
            id: true,
            status: true,
            quotation_number: true,
          },
        },
      },
      orderBy: {
        created_at: "desc",
      },
      take: 200,
    });

    const orders = dbOrders.map((order) => {
      const item = order.items[0];

      return {
        id: order.id,
        orderId: order.order_number,
        status: order.status ?? "pending",
        machineId: item ? item.machine_id : "",
        machineName: item ? item.product_name : "Unknown Machine",
        machineImage: item ? item.product_image : null,
        unitPrice: item ? item.price : 0,
        totalAmount: order.total,
        quantity: item ? item.quantity : 1,
        customerName: order.customer_name,
        customerEmail: order.customer_email,
        customerInfo: {
          fullName: order.customer_name,
          companyName: order.profile?.company || "",
          email: order.customer_email,
          phone: order.customer_phone || "",
          address: order.shipping_address?.street || "",
          city: order.shipping_address?.city || "",
        },
        deliveryInfo: {
          preferredDate: order.preferred_delivery_date?.toISOString() || "",
          deliveryAddress: order.delivery_address_text || "",
          specialInstructions: order.special_instructions || "",
        },
        paymentMethod: order.payment_method || "Not specified",
        termsAccepted: order.terms_accepted,
        createdAt: order.created_at.toISOString(),
        quotations: order.quotations.map((q) => ({
          id: q.id,
          status: q.status,
          quotation_number: q.quotation_number,
        })),
      };
    });

    return NextResponse.json({ orders });
  } catch (error) {
    console.error("Orders API error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        debug: error instanceof Error ? error.message : error,
      },
      { status: 500 },
    );
  }
}
