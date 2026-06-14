import { NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const MONTHS_BACK = 12;

const monthLabel = (d: Date) => {
  // Example: "Jan 2025"
  return d.toLocaleString("en-US", { month: "short", year: "numeric" });
};

const toStartOfMonth = (d: Date) => {
  return new Date(d.getFullYear(), d.getMonth(), 1, 0, 0, 0, 0);
};

const addMonths = (d: Date, delta: number) => {
  return new Date(d.getFullYear(), d.getMonth() + delta, 1, 0, 0, 0, 0);
};

export async function GET() {
  try {
    const session = await verifyAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const now = new Date();
    const earliest = addMonths(toStartOfMonth(now), -MONTHS_BACK + 1);

    const [
      totalOrders,
      pendingOrders,
      acceptedOrders,
      rejectedOrders,
      totalMachines,
      availableMachines,
      totalCustomers,
      orderStatuses,
      machineAvailability,
      ordersPerMonthRows,
      customerGrowthRows,
      inquiriesPerMonthRows,
      topMachinesRows,
    ] = await Promise.all([
      prisma.order.count(),
      prisma.order.count({ where: { status: "pending" } }),
      prisma.order.count({ where: { status: "accepted" } }),
      prisma.order.count({ where: { status: "rejected" } }),
      prisma.machine.count(),
      prisma.machine.count({ where: { is_available: true } }),
      prisma.customer.count(),
      prisma.order.groupBy({
        by: ["status"],
        _count: true,
      }),
      prisma.machine.groupBy({
        by: ["inventory_status"],
        _count: true,
      }),
      prisma.order.groupBy({
        by: ["created_at"],
        _count: true,
        where: {
          created_at: {
            gte: earliest,
          },
        },
      }),
      prisma.customer.groupBy({
        by: ["createdAt"],
        _count: true,
        where: {
          createdAt: {
            gte: earliest,
          },
        },
      }),
      prisma.inquiry.groupBy({
        by: ["createdAt"],
        _count: true,
        where: {
          createdAt: {
            gte: earliest,
          },
        },
      }),
      // Top machines by order item count
      prisma.orderItem.groupBy({
        by: ["machine_id"],
        _count: true,
        // orderBy/take combo is brittle across Prisma versions.
        // Keep it type-safe by omitting `take` and sorting in JS.
      }),
    ]);

    // Convert groupBy(created_at) rows into per-month counts.
    const seedMonths: Array<{ month: string; count: number }> = Array.from(
      { length: MONTHS_BACK },
      (_, i) => {
        const d = addMonths(toStartOfMonth(earliest), i);
        return {
          month: monthLabel(d),
          count: 0,
        };
      },
    );

    const monthIndex = (d: Date) => {
      const sd = toStartOfMonth(earliest);
      const diffMonths =
        (d.getFullYear() - sd.getFullYear()) * 12 +
        (d.getMonth() - sd.getMonth());
      return diffMonths;
    };

    const ordersPerMonth = seedMonths.map((m) => ({
      month: m.month,
      orders: 0,
    }));
    for (const r of ordersPerMonthRows) {
      const d = new Date(r.created_at as unknown as string | Date);
      const idx = monthIndex(d);
      if (idx >= 0 && idx < ordersPerMonth.length) {
        ordersPerMonth[idx].orders += Number(r._count);
      }
    }

    const customerGrowth = seedMonths.map((m) => ({
      month: m.month,
      customers: 0,
    }));
    for (const r of customerGrowthRows) {
      const d = new Date(r.createdAt as unknown as string | Date);
      const idx = monthIndex(d);
      if (idx >= 0 && idx < customerGrowth.length) {
        customerGrowth[idx].customers += Number(r._count);
      }
    }

    const inquiryTrends = seedMonths.map((m) => ({
      month: m.month,
      inquiries: 0,
    }));
    for (const r of inquiriesPerMonthRows) {
      const d = new Date(r.createdAt as unknown as string | Date);
      const idx = monthIndex(d);
      if (idx >= 0 && idx < inquiryTrends.length) {
        inquiryTrends[idx].inquiries += Number(r._count);
      }
    }

    const orderStatusDistribution = orderStatuses.map((s) => ({
      status: s.status,
      count: s._count,
    }));

    const machineAvailabilityDistribution = machineAvailability.map((s) => ({
      inventory_status: s.inventory_status,
      count: s._count,
    }));

    // topMachines by joining machine name
    const machineIds = topMachinesRows.map((r) => r.machine_id);
    const machines = await prisma.machine.findMany({
      where: { id: { in: machineIds } },
      select: { id: true, name: true },
    });
    const nameById = new Map(machines.map((m) => [m.id, m.name] as const));

    const topMachines = topMachinesRows.map((r) => ({
      machineName: nameById.get(r.machine_id) ?? "Unknown",
      orders: r._count,
    }));

    return NextResponse.json({
      stats: {
        totalOrders,
        pendingOrders,
        acceptedOrders,
        rejectedOrders,
        totalMachines,
        availableMachines,
        totalCustomers,
      },
      ordersPerMonth,
      topMachines,
      orderStatusDistribution,
      customerGrowth,
      machineAvailabilityDistribution,
      inquiryTrends,
    });
  } catch (error) {
    console.error("Analytics API error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        debug: {
          message: error instanceof Error ? error.message : String(error),
          name: error instanceof Error ? error.name : undefined,
        },
      },
      { status: 500 },
    );
  }
}
