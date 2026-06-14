// API route for customer order tracking
import { NextRequest, NextResponse } from "next/server";
import { orderService } from "@/lib/data-service";
import { checkRateLimit, getClientIdentifier, rateLimiters } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  try {
    // Apply rate limiting
    const identifier = getClientIdentifier(request);
    const rateLimit = checkRateLimit(identifier, rateLimiters.strict);

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { orderNumber, email, phone } = body;

    // Validate input
    if (!orderNumber || typeof orderNumber !== "string") {
      return NextResponse.json(
        { error: "Order number is required" },
        { status: 400 }
      );
    }

    if (!email && !phone) {
      return NextResponse.json(
        { error: "Email or phone number is required" },
        { status: 400 }
      );
    }

    // Track order
    const order = await orderService.getByOrderNumberAndContact(
      orderNumber.trim(),
      email?.trim(),
      phone?.trim()
    );

    if (!order) {
      return NextResponse.json(
        { error: "Order not found or contact information does not match" },
        { status: 404 }
      );
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error("Error tracking order:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
