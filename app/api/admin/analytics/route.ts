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
    // Verify admin session
    const session = await verifyAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const now = new Date();
    const earliest = addMonths(toStartOfMonth(now), -MONTHS_BACK + 1);

    // Run all queries in parallel with error handling for each
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
      prisma.order.count().catch(() => 0),
      prisma.order.count({ where: { status: "pending" } }).catch(() => 0),
      prisma.order.count({ where: { status: "accepted" } }).catch(() => 0),
      prisma.order.count({ where: { status: "rejected" } }).catch(() => 0),
      prisma.machine.count().catch(() => 0),
      prisma.machine.count({ where: { is_available: true } }).catch(() => 0),
      prisma.customer.count().catch(() => 0),
      prisma.order.groupBy({
        by: ["status"],
        _count: true,
      }).catch(() => []),
      prisma.machine.groupBy({
        by: ["inventory_status"],
        _count: true,
      }).catch(() => []),
      prisma.order.groupBy({
        by: ["created_at"],
        _count: true,
        where: {
          created_at: {
            gte: earliest,
          },
        },
      }).catch(() => []),
      prisma.customer.groupBy({
        by: ["createdAt"],
        _count: true,
        where: {
          createdAt: {
            gte: earliest,
          },
        },
      }).catch(() => []),
      prisma.inquiry.groupBy({
        by: ["createdAt"],
        _count: true,
        where: {
          createdAt: {
            gte: earliest,
          },
        },
      }).catch(() => []),
      prisma.orderItem.groupBy({
        by: ["machine_id"],
        _count: true,
      }).catch(() => []),
    ]);

    // Create array of months for the last 12 months
    const monthsArray = Array.from({ length: MONTHS_BACK }, (_, i) => {
      const d = addMonths(toStartOfMonth(earliest), i);
      return {
        month: monthLabel(d),
        fullDate: d,
      };
    });

    // Helper function to find month index
    const monthIndex = (date: Date) => {
      const startDate = toStartOfMonth(earliest);
      const diffMonths = 
        (date.getFullYear() - startDate.getFullYear()) * 12 +
        (date.getMonth() - startDate.getMonth());
      return diffMonths;
    };

    // Process orders per month
    const ordersPerMonth = monthsArray.map((m) => ({
      month: m.month,
      orders: 0,
    }));
    
    if (ordersPerMonthRows && ordersPerMonthRows.length > 0) {
      for (const row of ordersPerMonthRows) {
        if (row.created_at) {
          const date = new Date(row.created_at as unknown as string | Date);
          if (!isNaN(date.getTime())) {
            const idx = monthIndex(date);
            if (idx >= 0 && idx < ordersPerMonth.length) {
              ordersPerMonth[idx].orders += Number(row._count) || 0;
            }
          }
        }
      }
    }

    // Process customer growth
    const customerGrowth = monthsArray.map((m) => ({
      month: m.month,
      customers: 0,
    }));
    
    if (customerGrowthRows && customerGrowthRows.length > 0) {
      for (const row of customerGrowthRows) {
        if (row.createdAt) {
          const date = new Date(row.createdAt as unknown as string | Date);
          if (!isNaN(date.getTime())) {
            const idx = monthIndex(date);
            if (idx >= 0 && idx < customerGrowth.length) {
              customerGrowth[idx].customers += Number(row._count) || 0;
            }
          }
        }
      }
    }

    // Process inquiry trends
    const inquiryTrends = monthsArray.map((m) => ({
      month: m.month,
      inquiries: 0,
    }));
    
    if (inquiriesPerMonthRows && inquiriesPerMonthRows.length > 0) {
      for (const row of inquiriesPerMonthRows) {
        if (row.createdAt) {
          const date = new Date(row.createdAt as unknown as string | Date);
          if (!isNaN(date.getTime())) {
            const idx = monthIndex(date);
            if (idx >= 0 && idx < inquiryTrends.length) {
              inquiryTrends[idx].inquiries += Number(row._count) || 0;
            }
          }
        }
      }
    }

    // Process order status distribution
    const orderStatusDistribution = orderStatuses && orderStatuses.length > 0
      ? orderStatuses.map((s) => ({
          status: s.status,
          count: s._count,
        }))
      : [];

    // Process machine availability distribution
    const machineAvailabilityDistribution = machineAvailability && machineAvailability.length > 0
      ? machineAvailability.map((s) => ({
          inventory_status: s.inventory_status,
          count: s._count,
        }))
      : [];

    // Process top machines
    let topMachines: Array<{ machineName: string; orders: number }> = [];
    
    if (topMachinesRows && topMachinesRows.length > 0) {
      const machineIds = topMachinesRows
        .map((row) => row.machine_id)
        .filter((id): id is string => id !== null);
      
      if (machineIds.length > 0) {
        const machines = await prisma.machine.findMany({
          where: { id: { in: machineIds } },
          select: { id: true, name: true },
        }).catch(() => []);
        
        const nameById = new Map(machines.map((m) => [m.id, m.name]));
        
        topMachines = topMachinesRows
          .map((row) => ({
            machineName: nameById.get(row.machine_id) ?? "Unknown Machine",
            orders: row._count,
          }))
          .sort((a, b) => b.orders - a.orders)
          .slice(0, 10); // Get top 10 machines
      }
    }

    // Return successful response
    return NextResponse.json({
      success: true,
      stats: {
        totalOrders: totalOrders || 0,
        pendingOrders: pendingOrders || 0,
        acceptedOrders: acceptedOrders || 0,
        rejectedOrders: rejectedOrders || 0,
        totalMachines: totalMachines || 0,
        availableMachines: availableMachines || 0,
        totalCustomers: totalCustomers || 0,
      },
      ordersPerMonth: ordersPerMonth || [],
      topMachines: topMachines || [],
      orderStatusDistribution: orderStatusDistribution || [],
      customerGrowth: customerGrowth || [],
      machineAvailabilityDistribution: machineAvailabilityDistribution || [],
      inquiryTrends: inquiryTrends || [],
    });
    
  } catch (error) {
    console.error("Analytics API error details:", error);
    
    // Return a proper error response with more details
    return NextResponse.json(
      { 
        error: "Failed to fetch analytics data",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}