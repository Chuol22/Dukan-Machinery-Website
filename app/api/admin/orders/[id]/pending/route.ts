import { NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const session = await verifyAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const notes: string | undefined =
      typeof body?.admin_notes === "string" ? body.admin_notes : undefined;

    // Update order status to pending
    const updated = await prisma.order.update({
      where: { id },
      data: {
        status: "pending",
        updated_at: new Date(),
        ...(notes !== undefined ? { admin_notes: notes } : {}),
      },
    });

    return NextResponse.json({ order: updated });
  } catch (error) {
    console.error("Move order to pending error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
