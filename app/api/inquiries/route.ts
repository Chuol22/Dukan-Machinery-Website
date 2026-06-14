// app/api/inquiries/route.ts — public POST handler for machine inquiries
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      customer_name,
      email,
      phone,
      machine_name,
      machine_id,
      message,
      company,
    } = body;

    // --- Validation ---
    if (
      !customer_name ||
      typeof customer_name !== "string" ||
      customer_name.trim() === ""
    ) {
      return NextResponse.json(
        { error: "customer_name is required" },
        { status: 400 },
      );
    }

    if (!email || typeof email !== "string" || email.trim() === "") {
      return NextResponse.json({ error: "email is required" }, { status: 400 });
    }

    if (!EMAIL_REGEX.test(email.trim())) {
      return NextResponse.json(
        { error: "email must be a valid email address" },
        { status: 400 },
      );
    }

    if (!message || typeof message !== "string" || message.trim().length < 10) {
      return NextResponse.json(
        { error: "message must be at least 10 characters long" },
        { status: 400 },
      );
    }

    const trimmedName = customer_name.trim();
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedMessage = message.trim();
    const trimmedMachineName = machine_name?.trim() || "General Inquiry";

    // --- Upsert Customer by email (Requirement 1.5) ---
    await prisma.customer.upsert({
      where: { email: trimmedEmail },
      create: {
        name: trimmedName,
        email: trimmedEmail,
        phone: phone?.trim() || null,
        companyName: company?.trim() || null,
        status: "Active",
      },
      update: {
        name: trimmedName,
        phone: phone?.trim() || null,
        companyName: company?.trim() || null,
      },
    });

    // --- Resolve machine_id if provided ---
    let resolvedMachineId: string | null = null;
    if (
      machine_id &&
      typeof machine_id === "string" &&
      machine_id.trim() !== ""
    ) {
      const machine = await prisma.machine.findUnique({
        where: { id: machine_id.trim() },
        select: { id: true },
      });
      if (machine) {
        resolvedMachineId = machine.id;
      }
    }

    // --- Find customer for relation linking ---
    const customer = await prisma.customer.findUnique({
      where: { email: trimmedEmail },
      select: { id: true },
    });

    // --- Create MachineInquiry (Requirement 6.4) ---
    const inquiry = await prisma.inquiry.create({
      data: {
        type: "MachineInquiry",
        customerName: trimmedName,
        customerEmail: trimmedEmail,
        customerPhone: phone?.trim() || null,
        subject: `Inquiry regarding ${trimmedMachineName}`,
        message: trimmedMessage,
        machineId: resolvedMachineId,
        status: "New",
      },
    });

    // --- Create Notification (Requirement 6.4, 11.1) ---
    await prisma.notification.create({
      data: {
        type: "new_inquiry",
        title: "New Machine Inquiry",
        message: `New inquiry from ${trimmedName} about ${trimmedMachineName}`,
        read: false,
      },
    });

    // --- Return 201 with id (Requirement 6.2) ---
    return NextResponse.json(
      { success: true, id: inquiry.id },
      { status: 201 },
    );
  } catch (error) {
    console.error("Inquiry submission error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
