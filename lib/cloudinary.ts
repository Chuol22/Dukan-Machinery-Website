// cloudinary.ts — image upload config and helpers
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export { cloudinary };

// Upload File, Buffer, or base64 string to Cloudinary
export async function uploadImageToCloudinary(
  file: File | Buffer | string,
  options?: {
    folder?: string;
    transformation?: string;
    resource_type?: "image" | "video" | "auto";
    public_id?: string;
    overwrite?: boolean;
  },
) {
  try {
    let uploadData: string;

    if (file instanceof File) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      uploadData = `data:${file.type};base64,${buffer.toString("base64")}`;
    } else if (Buffer.isBuffer(file)) {
      uploadData = `data:image/jpeg;base64,${file.toString("base64")}`;
    } else {
      uploadData = file;
    }

    const result = await cloudinary.uploader.upload(uploadData, {
      folder: options?.folder || "dkm-machinery",
      transformation: options?.transformation,
      resource_type: options?.resource_type || "image",
      public_id: options?.public_id,
      overwrite: options?.overwrite || false,
    });

    return {
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
    };
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw new Error("Failed to upload image to Cloudinary");
  }
}
