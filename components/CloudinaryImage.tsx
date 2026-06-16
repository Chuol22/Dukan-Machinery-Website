"use client";

// Smart image — CldImage for Cloudinary URLs, plain img as fallback
import { CldImage } from "next-cloudinary";
import { useState } from "react";
import { ImageIcon } from "lucide-react";

interface CloudinaryImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  sizes?: string;
  fill?: boolean;
  style?: React.CSSProperties;
}

export default function CloudinaryImage({
  src,
  alt,
  width = 800,
  height = 600,
  className = "",
  priority = false,
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
  fill = false,
  style,
}: CloudinaryImageProps) {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check if the source is a video
  const isVideo = src ? src.toLowerCase().endsWith(".mp4") || src.toLowerCase().endsWith(".webm") : false;

  if (isVideo) {
    return (
      <video
        src={src}
        className={className}
        style={style}
        muted
        playsInline
        controls={width && width > 100 ? true : false}
        preload="metadata"
      />
    );
  }

  // Check if it's a local asset or non-Cloudinary external URL
  const isLocalOrExternalNonCloudinary =
    !src || src.startsWith("/") || (src.startsWith("http") && !src.includes("res.cloudinary.com") && !src.includes("cloudinary://"));

  // If it's not a Cloudinary asset, use regular img tag
  if (isLocalOrExternalNonCloudinary) {
    if (!src || src === "") {
      return (
        <div
          className={`flex items-center justify-center bg-gray-150 dark:bg-gray-800 ${className}`}
          style={style}
        >
          <ImageIcon className="w-8 h-8 text-gray-400" />
        </div>
      );
    }
    return (
      <img
        src={src}
        alt={alt}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        className={className}
        style={style}
        loading={priority ? "eager" : "lazy"}
        onError={() => setImageError(true)}
        onLoad={() => setIsLoading(false)}
      />
    );
  }

  // Extract public ID from Cloudinary URL or return it directly if it's a public ID
  const getPublicId = (url: string): string => {
    if (url.includes("cloudinary://")) {
      const parts = url.split("cloudinary://")[1];
      const pathParts = parts.split("/");
      return pathParts.slice(1).join("/");
    }

    const urlParts = url.split("/");
    const uploadIndex = urlParts.indexOf("upload");
    if (uploadIndex !== -1) {
      const afterUpload = urlParts.slice(uploadIndex + 1);
      // Find a version segment (e.g. v1718536294)
      const versionIndex = afterUpload.findIndex((part) => /^v\d+$/.test(part));
      if (versionIndex !== -1) {
        return afterUpload.slice(versionIndex + 1).join("/");
      }
      return afterUpload.join("/");
    }

    return url;
  };

  const publicId = getPublicId(src);

  if (imageError) {
    return (
      <div
        className={`flex items-center justify-center bg-gray-150 dark:bg-gray-800 ${className}`}
        style={style}
      >
        <ImageIcon className="w-8 h-8 text-gray-400" />
      </div>
    );
  }

  return (
    <div className={className} style={style}>
      {isLoading && (
        <div className="absolute inset-0 bg-gray-150 dark:bg-gray-800 animate-pulse" />
      )}
      <CldImage
        src={publicId}
        alt={alt}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        fill={fill}
        sizes={sizes}
        priority={priority}
        loading={priority ? "eager" : "lazy"}
        className={`transition-opacity duration-300 ${isLoading ? "opacity-0" : "opacity-100"}`}
        onLoad={() => setIsLoading(false)}
        onError={() => setImageError(true)}
        deliveryType="upload"
        quality="auto"
        format="auto"
      />
    </div>
  );
}
