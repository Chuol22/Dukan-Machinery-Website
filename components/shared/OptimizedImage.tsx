'use client';

import React from 'react';
import NextImage from 'next/image';

export type OptimizedImageProps = {
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
  /** Use Next.js fill layout. Parent must be position:relative and have width/height. */
  fill?: boolean;
  /** For non-fill usage. */
  width?: number;
  height?: number;
  /** Pass sizes to improve responsive behavior. */
  sizes?: string;
  /** Quality for Next Image optimization. */
  quality?: number;
  /** Next Image loading behavior. */
  loading?: 'lazy' | 'eager';
  /** Object fit shortcut. Defaults to contain. */
  objectFit?: React.CSSProperties['objectFit'];
  /** If you already have a blurDataURL or placeholder needs. */
  placeholder?: 'empty' | 'blur';
  blurDataURL?: string;
};

const isLikelyVideo = (src: string) => src.toLowerCase().endsWith('.mp4') || src.toLowerCase().endsWith('.webm');

export default function OptimizedImage({
  src,
  alt,
  className,
  style,
  fill,
  width,
  height,
  sizes,
  quality = 80,
  loading = 'lazy',
  objectFit = 'contain',
  placeholder,
  blurDataURL,
}: OptimizedImageProps) {
  if (!src) return null;
  if (isLikelyVideo(src)) {
    // This component is intended for images. Keep behavior safe.
    return <img src={src} alt={alt} className={className} style={style} />;
  }

  // If using fill, we don't require width/height.
  if (fill) {
    return (
      <NextImage
        src={src}
        alt={alt}
        fill
        className={className}
        style={{
          objectFit,
          ...style,
        }}
        sizes={sizes}
        quality={quality}
        loading={loading}
        placeholder={placeholder}
        blurDataURL={blurDataURL}
      />
    );
  }

  // If width/height not provided, fall back to layout='intrinsic' behavior by requiring them.
  if (typeof width !== 'number' || typeof height !== 'number') {
    // Best-effort fallback to avoid runtime crashes.
    return <img src={src} alt={alt} className={className} style={style} />;
  }

  return (
    <NextImage
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      style={{
        objectFit,
        ...style,
      }}
      sizes={sizes}
      quality={quality}
      loading={loading}
      placeholder={placeholder}
      blurDataURL={blurDataURL}
    />
  );
}

