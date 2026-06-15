// admin/inquiries/[id]/route.ts — admin PUT update inquiry status
import { NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const VALID_STATUSES = ["New", "Read", "Replied", "Resolved"] as const;
type InquiryStatus = (typeof VALID_STATUSES)[number];

export async function PUT(
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

    const body = await request.json();
    const { status } = body as { status: string | undefined };

    // Validate status value
    if (!status || !VALID_STATUSES.includes(status as InquiryStatus)) {
      return NextResponse.json(
        {
          error: `Invalid status. Must be one of: ${VALID_STATUSES.join(", ")}`,
        },
        { status: 400 },
      );
    }

    // Update the inquiry status
    const updatedInquiry = await prisma.inquiry.update({
      where: { id },
      data: { status: status as InquiryStatus },
    });

    return NextResponse.json({ inquiry: updatedInquiry });
  } catch (error) {
    console.error("Admin update inquiry error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
