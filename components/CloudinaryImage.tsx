'use client';

// Smart image — CldImage for Cloudinary URLs, plain img as fallback
import { CldImage } from 'next-cloudinary';
import { useState } from 'react';
import { ImageIcon } from 'lucide-react';

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
  className = '',
  priority = false,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  fill = false,
  style,
}: CloudinaryImageProps) {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check if the image is already a Cloudinary URL
  const isCloudinaryUrl = src.includes('res.cloudinary.com') || src.includes('cloudinary://');

  // If it's not a Cloudinary URL, use regular img tag
  if (!isCloudinaryUrl) {
    return (
      <img
        src={src}
        alt={alt}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        className={className}
        style={style}
        loading={priority ? 'eager' : 'lazy'}
        onError={() => setImageError(true)}
        onLoad={() => setIsLoading(false)}
      />
    );
  }

  // Extract public ID from Cloudinary URL
  const getPublicId = (url: string): string => {
    if (url.includes('cloudinary://')) {
      // Handle cloudinary:// format
      const parts = url.split('cloudinary://')[1];
      const pathParts = parts.split('/');
      return pathParts.slice(1).join('/');
    }
    
    // Handle https://res.cloudinary.com format
    const urlParts = url.split('/');
    const uploadIndex = urlParts.indexOf('upload');
    if (uploadIndex !== -1) {
      const publicId = urlParts.slice(uploadIndex + 1).join('/');
      // Remove transformation parameters
      return publicId.split('/')[0] === 'v' ? publicId.split('/').slice(2).join('/') : publicId;
    }
    
    return url;
  };

  const publicId = getPublicId(src);

  if (imageError) {
    return (
      <div
        className={`flex items-center justify-center bg-gray-100 dark:bg-gray-800 ${className}`}
        style={style}
      >
        <ImageIcon className="w-8 h-8 text-gray-400" />
      </div>
    );
  }

  return (
    <div className={className} style={style}>
      {isLoading && (
        <div className="absolute inset-0 bg-gray-100 dark:bg-gray-800 animate-pulse" />
      )}
      <CldImage
        src={publicId}
        alt={alt}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        fill={fill}
        sizes={sizes}
        priority={priority}
        loading={priority ? 'eager' : 'lazy'}
        className={`transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
        onLoad={() => setIsLoading(false)}
        onError={() => setImageError(true)}
        deliveryType="upload"
        quality="auto"
        format="auto"
      />
    </div>
  );
}
