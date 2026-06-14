// upload/route.ts — admin-only image upload to Cloudinary
import { NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/auth";
import { uploadImageToCloudinary } from "@/lib/cloudinary";

export async function POST(request: Request) {
  try {
    // Verify admin is logged in (optional - remove if public uploads are allowed)
    const session = await verifyAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const folder = (formData.get("folder") as string) || "dkm-machinery";
    const publicId = formData.get("publicId") as string | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Convert File to Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary
    const result = await uploadImageToCloudinary(buffer, {
      folder,
      public_id: publicId || undefined,
      overwrite: !!publicId,
    });

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload image" },
      { status: 500 },
    );
  }
}
