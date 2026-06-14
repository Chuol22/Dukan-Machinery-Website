import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import nodemailer from "nodemailer";
import { renderToBuffer } from "@react-pdf/renderer";
import QuotationDocument from "@/components/admin/QuotationPDF";
import { uploadImageToCloudinary } from "@/lib/cloudinary";

const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type QuotationCreateBody = {
  machineCost: number;
  shippingCost: number;
  installationCost: number;
  additionalCharges: number;
  validUntil: string;
  terms?: string;
};

const parsePositiveNumber = (v: unknown, field: string): number => {
  const n = typeof v === "string" ? Number(v) : (v as number);
  const num = Number(n);
  if (!Number.isFinite(num) || num < 0) {
    throw new Error(`${field} must be a non-negative number`);
  }
  return num;
};

function generateQuotationNumber(year: number, sequential: number) {
  const seq = String(sequential).padStart(4, "0");
  return `QT-${year}-${seq}`;
}

async function getEmailTransporter() {
  if (!EMAIL_USER || !EMAIL_PASS) {
    return null;
  }
  return nodemailer.createTransport({
    service: "gmail",
    auth: { user: EMAIL_USER, pass: EMAIL_PASS },
  });
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: orderId } = await params;

    const session = await verifyAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json()) as Partial<QuotationCreateBody>;

    const machineCost = parsePositiveNumber(body.machineCost, "machineCost");
    const shippingCost = parsePositiveNumber(
      body.shippingCost ?? 0,
      "shippingCost",
    );
    const installationCost = parsePositiveNumber(
      body.installationCost ?? 0,
      "installationCost",
    );
    const additionalCharges = parsePositiveNumber(
      body.additionalCharges ?? 0,
      "additionalCharges",
    );

    if (!body.validUntil || typeof body.validUntil !== "string") {
      return NextResponse.json(
        { error: "validUntil is required" },
        { status: 400 },
      );
    }

    const validUntilDate = new Date(body.validUntil);
    if (Number.isNaN(validUntilDate.getTime())) {
      return NextResponse.json(
        { error: "validUntil must be a valid date" },
        { status: 400 },
      );
    }

    const terms =
      body.terms && typeof body.terms === "string" ? body.terms : undefined;

    const totalCost =
      machineCost + shippingCost + installationCost + additionalCharges;

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: true,
        profile: true,
        shipping_address: true,
        quotations: true,
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const year = validUntilDate.getFullYear();

    const existingThisYear = await prisma.quotation.count({
      where: {
        quotation_number: {
          startsWith: `QT-${year}-`,
        },
      },
    });

    const quotationNumber = generateQuotationNumber(year, existingThisYear + 1);

    // Use first order item for now (matches current OrdersClient approach)
    const item = order.items[0];

    const quotation = await prisma.quotation.create({
      data: {
        order_id: order.id,
        quotation_number: quotationNumber,
        customer_name: order.customer_name,
        customer_email: order.customer_email,
        customer_phone: order.customer_phone,
        machine_id: item?.machine_id,
        machine_name: item?.product_name || "Machine",
        quantity: item?.quantity || 1,
        machine_cost: machineCost,
        shipping_cost: shippingCost,
        installation_cost: installationCost,
        total_cost: totalCost,
        status: "draft",
      },
    });

    // Generate PDF (server-side)
    const pdfBuffer = await renderToBuffer(
      <QuotationDocument
        data={{
          quotationNumber,
          issueDate: new Date().toISOString(),
          validUntil: validUntilDate.toISOString(),
          customerName: order.customer_name || "Customer",
          customerCompany: order.profile?.company || undefined,
          customerEmail: order.customer_email,
          machineName: item?.product_name ?? "Machine",
          machineQuantity: item?.quantity ?? 1,
          machineCost,
          shippingCost,
          installationCost,
          additionalCharges,
          totalCost,
          terms,
        }}
      />,
    );

    // Upload PDF to Cloudinary (existing /api/upload pattern was file/buffer based; here we upload buffer)
    // Cloudinary uploader expects a resource; we send as base64.
    const uploaded = await uploadImageToCloudinary(Buffer.from(pdfBuffer), {
      folder: "dkm-quotations",
      resource_type: "auto",
      transformation: undefined,
      overwrite: true,
    });

    const pdfUrl = uploaded.url;

    // IMPORTANT: do NOT update Order or Quotation status until email succeeds.
    const transporter = await getEmailTransporter();
    if (!transporter) {
      return NextResponse.json(
        { error: "Email transporter not configured" },
        { status: 500 },
      );
    }

    const customerEmail = order.customer_email;
    if (!EMAIL_REGEX.test(customerEmail)) {
      return NextResponse.json(
        { error: "Customer email is invalid" },
        { status: 400 },
      );
    }

    await transporter.sendMail({
      from: `"Dukan Machinery" <${EMAIL_USER}>`,
      to: customerEmail,
      subject: `QT ${quotationNumber} - Quotation from Dukan Machinery`,
      text: `Please find your quotation attached. Quotation number: ${quotationNumber}`,
      attachments: [
        {
          filename: `${quotationNumber}.pdf`,
          content: Buffer.from(pdfBuffer),
          contentType: "application/pdf",
        },
      ],
    });

    await prisma.$transaction(async (tx) => {
      await tx.quotation.update({
        where: { id: quotation.id },
        data: {
          pdf_url: pdfUrl,
          status: "sent",
        },
      });

      await tx.order.update({
        where: { id: order.id },
        data: {
          status: "quotation_sent",
        },
      });
    });

    return NextResponse.json(
      { quotationId: quotation.id, quotationNumber },
      { status: 200 },
    );
  } catch (error) {
    console.error("Quotation creation error:", error);
    // If email fails, we should NOT update statuses; however current code updates only after email success.
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to send quotation",
      },
      { status: 500 },
    );
  }
}
