// cloudinaryUtils.ts — Utilities for Cloudinary URL parsing and usage analysis
// Implements Task 11.2: Cloudinary usage analysis utilities

import { CLOUDINARY_CLOUD_NAME, CLOUDINARY_URL_PATTERN } from '../constants';

/**
 * Parsed components of a Cloudinary video URL
 */
export interface CloudinaryUrlComponents {
  cloudName: string;
  resourceType: 'video' | 'image' | 'raw';
  deliveryType: 'upload' | 'fetch' | 'private';
  transformations: string[];
  version: string;
  publicId: string;
  format: string;
  fullUrl: string;
}

/**
 * Bandwidth and storage quota information
 */
export interface CloudinaryQuotaInfo {
  tier: 'free' | 'paid' | 'unknown';
  storage: {
    used: number; // GB
    limit: number; // GB
    percentUsed: number;
    remaining: number; // GB
  };
  bandwidth: {
    used: number; // GB
    limit: number; // GB per month
    percentUsed: number;
    remaining: number; // GB
  };
  warnings: string[];
  recommendations: string[];
}

/**
 * Parses a Cloudinary URL into its components
 * 
 * Example URL: https://res.cloudinary.com/dusezlxj0/video/upload/v1781640342/dkm/machines/videos/grader.mp4
 * 
 * Returns:
 * {
 *   cloudName: "dusezlxj0",
 *   resourceType: "video",
 *   deliveryType: "upload",
 *   transformations: [],
 *   version: "v1781640342",
 *   publicId: "dkm/machines/videos/grader",
 *   format: "mp4",
 *   fullUrl: "https://res.cloudinary.com/dusezlxj0/video/upload/v1781640342/dkm/machines/videos/grader.mp4"
 * }
 */
export function parseCloudinaryUrl(url: string): CloudinaryUrlComponents | null {
  // Pattern: https://res.cloudinary.com/{cloud}/{type}/{delivery}/{transformations}/{version}/{publicId}.{format}
  const pattern = /^https:\/\/res\.cloudinary\.com\/([^\/]+)\/(video|image|raw)\/(upload|fetch|private)\/(.*)$/;
  
  const match = url.match(pattern);
  
  if (!match) {
    console.warn('[cloudinaryUtils] Invalid Cloudinary URL:', url);
    return null;
  }

  const [, cloudName, resourceType, deliveryType, pathSegments] = match;

  // Split remaining path into version, public ID, and format
  // pathSegments can be:
  // - v1234/path/to/file.ext (simple)
  // - q_auto,w_800/v1234/path/to/file.ext (with transformations)
  
  let transformations: string[] = [];
  let version = '';
  let publicId = '';
  let format = '';

  const segments = pathSegments.split('/');
  
  // Find version segment (starts with 'v' followed by digits)
  const versionIndex = segments.findIndex(seg => /^v\d+$/.test(seg));

  if (versionIndex === -1) {
    console.warn('[cloudinaryUtils] No version found in URL:', url);
    return null;
  }

  // Everything before version is transformations
  if (versionIndex > 0) {
    const transformStr = segments.slice(0, versionIndex).join('/');
    transformations = transformStr.split(',').filter(Boolean);
  }

  version = segments[versionIndex];

  // Everything after version is public ID + format
  const remainingSegments = segments.slice(versionIndex + 1);
  const lastSegment = remainingSegments[remainingSegments.length - 1];
  
  // Split last segment to extract format
  const dotIndex = lastSegment.lastIndexOf('.');
  if (dotIndex !== -1) {
    format = lastSegment.substring(dotIndex + 1);
    remainingSegments[remainingSegments.length - 1] = lastSegment.substring(0, dotIndex);
  }

  publicId = remainingSegments.join('/');

  return {
    cloudName,
    resourceType: resourceType as 'video' | 'image' | 'raw',
    deliveryType: deliveryType as 'upload' | 'fetch' | 'private',
    transformations,
    version,
    publicId,
    format,
    fullUrl: url,
  };
}

/**
 * Extracts video filename from Cloudinary URL
 * 
 * Example: https://.../videos/grader.mp4 → "grader.mp4"
 */
export function extractVideoFilename(url: string): string {
  const components = parseCloudinaryUrl(url);
  
  if (!components) {
    // Fallback: extract last segment from URL
    const segments = url.split('/');
    return segments[segments.length - 1];
  }

  return `${components.publicId.split('/').pop()}.${components.format}`;
}

/**
 * Extracts machine slug from Cloudinary video URL
 * Assumes format: .../dkm/machines/videos/{slug}.mp4
 * 
 * Example: .../videos/grader.mp4 → "grader"
 */
export function extractMachineSlug(url: string): string {
  const filename = extractVideoFilename(url);
  
  // Remove extension
  const slug = filename.replace(/\.(mp4|webm|mov)$/i, '');
  
  return slug;
}

/**
 * Validates Cloudinary URL pattern
 */
export function isValidCloudinaryUrl(url: string): boolean {
  return CLOUDINARY_URL_PATTERN.test(url);
}

/**
 * Generates transformation parameters string
 * 
 * Example: ['q_auto', 'w_800', 'f_auto'] → "q_auto,w_800,f_auto"
 */
export function buildTransformationString(transformations: string[]): string {
  return transformations.filter(Boolean).join(',');
}

/**
 * Injects transformation parameters into Cloudinary URL
 * 
 * Example:
 *   URL: https://res.cloudinary.com/cloud/video/upload/v123/path.mp4
 *   Transformations: ['q_auto', 'w_800']
 *   Result: https://res.cloudinary.com/cloud/video/upload/q_auto,w_800/v123/path.mp4
 */
export function addTransformations(url: string, transformations: string[]): string {
  const components = parseCloudinaryUrl(url);
  
  if (!components) {
    console.warn('[cloudinaryUtils] Cannot add transformations to invalid URL:', url);
    return url;
  }

  // Merge with existing transformations
  const allTransformations = [
    ...components.transformations,
    ...transformations,
  ];

  const transformStr = buildTransformationString(allTransformations);

  // Rebuild URL with transformations
  const baseUrl = `https://res.cloudinary.com/${components.cloudName}/${components.resourceType}/${components.deliveryType}`;
  
  if (transformStr) {
    return `${baseUrl}/${transformStr}/${components.version}/${components.publicId}.${components.format}`;
  }
  
  return `${baseUrl}/${components.version}/${components.publicId}.${components.format}`;
}

/**
 * Calculates quota information and generates warnings
 * 
 * NOTE: Actual usage stats must be obtained manually from Cloudinary Dashboard
 * This function helps calculate warnings once you have the usage numbers
 */
export function calculateQuotaInfo(
  storageUsedGB: number,
  bandwidthUsedGB: number,
  tier: 'free' | 'paid' = 'free'
): CloudinaryQuotaInfo {
  // Free tier limits
  const FREE_TIER_LIMITS = {
    storage: 25, // GB
    bandwidth: 25, // GB per month
  };

  // Paid tier limits (example - varies by plan)
  const PAID_TIER_LIMITS = {
    storage: 100, // GB (varies by plan)
    bandwidth: 100, // GB per month (varies by plan)
  };

  const limits = tier === 'free' ? FREE_TIER_LIMITS : PAID_TIER_LIMITS;

  const storagePercent = (storageUsedGB / limits.storage) * 100;
  const bandwidthPercent = (bandwidthUsedGB / limits.bandwidth) * 100;

  const warnings: string[] = [];
  const recommendations: string[] = [];

  // Storage warnings
  if (storagePercent >= 95) {
    warnings.push(`CRITICAL: Storage at ${storagePercent.toFixed(1)}% - immediate action required`);
    recommendations.push('Delete unused videos or upgrade to paid tier immediately');
  } else if (storagePercent >= 90) {
    warnings.push(`URGENT: Storage at ${storagePercent.toFixed(1)}% - approaching limit`);
    recommendations.push('Review and delete unused videos, or plan upgrade');
  } else if (storagePercent >= 80) {
    warnings.push(`WARNING: Storage at ${storagePercent.toFixed(1)}%`);
    recommendations.push('Monitor storage usage closely');
  }

  // Bandwidth warnings
  if (bandwidthPercent >= 95) {
    warnings.push(`CRITICAL: Bandwidth at ${bandwidthPercent.toFixed(1)}% - videos may stop working`);
    recommendations.push('Upgrade immediately or reduce video traffic (disable autoplay, lazy load)');
  } else if (bandwidthPercent >= 90) {
    warnings.push(`URGENT: Bandwidth at ${bandwidthPercent.toFixed(1)}% - approaching monthly limit`);
    recommendations.push('Consider implementing lazy loading and reducing video quality');
    recommendations.push('Plan upgrade before month-end to avoid service interruption');
  } else if (bandwidthPercent >= 80) {
    warnings.push(`WARNING: Bandwidth at ${bandwidthPercent.toFixed(1)}% of monthly limit`);
    recommendations.push('Monitor bandwidth usage - consider optimization strategies');
    recommendations.push('Implement lazy loading for videos outside viewport');
    recommendations.push('Consider adding transformations (w_800, q_auto) to reduce transfer size');
  } else if (bandwidthPercent >= 50) {
    recommendations.push('Bandwidth usage is healthy but monitor trends');
    recommendations.push('Consider implementing video caching strategies');
  }

  // Optimization recommendations (always applicable)
  recommendations.push('Use Cloudinary transformations to optimize video delivery (q_auto, f_auto, w_800)');
  recommendations.push('Implement lazy loading for videos outside initial viewport');
  recommendations.push('Enable browser caching with appropriate Cache-Control headers');

  return {
    tier,
    storage: {
      used: storageUsedGB,
      limit: limits.storage,
      percentUsed: storagePercent,
      remaining: Math.max(0, limits.storage - storageUsedGB),
    },
    bandwidth: {
      used: bandwidthUsedGB,
      limit: limits.bandwidth,
      percentUsed: bandwidthPercent,
      remaining: Math.max(0, limits.bandwidth - bandwidthUsedGB),
    },
    warnings,
    recommendations,
  };
}

/**
 * Estimates bandwidth consumption for video delivery
 * 
 * @param videoSizeBytes - Average video file size in bytes
 * @param viewsPerMonth - Estimated monthly views
 * @returns Estimated monthly bandwidth in GB
 */
export function estimateBandwidthUsage(
  videoSizeBytes: number,
  viewsPerMonth: number
): number {
  const totalBytes = videoSizeBytes * viewsPerMonth;
  const totalGB = totalBytes / (1024 * 1024 * 1024);
  return totalGB;
}

/**
 * Generates manual checking procedures for Cloudinary Dashboard
 */
export function getManualCheckingProcedures(): {
  storageCheck: string[];
  bandwidthCheck: string[];
  securityCheck: string[];
} {
  return {
    storageCheck: [
      '1. Login to Cloudinary Dashboard (https://console.cloudinary.com)',
      '2. Navigate to Dashboard home page',
      '3. Look for "Storage" widget showing current usage',
      '4. Note: Storage Used / Storage Limit (e.g., 12.5 GB / 25 GB)',
      '5. Calculate percent used: (used / limit) * 100',
      '6. If > 80%, take action to reduce usage or upgrade',
    ],
    bandwidthCheck: [
      '1. On Dashboard home page, find "Bandwidth" widget',
      '2. Note current month bandwidth usage',
      '3. Check: Bandwidth Used / Monthly Limit (e.g., 18.3 GB / 25 GB)',
      '4. Calculate percent used: (used / limit) * 100',
      '5. WARNING: Bandwidth resets monthly but can cause service interruption if exceeded',
      '6. If > 80%, implement optimization strategies immediately',
    ],
    securityCheck: [
      '1. Navigate to Settings → Security tab',
      '2. Check "Strict Transformations" setting - should be OFF for dynamic transformations',
      '3. Check "Resource Access Mode" - should be "Public" not "Authenticated"',
      '4. Review "Allowed fetch domains" - verify no blocking rules',
      '5. Check for any IP restrictions that might block Vercel deployments',
    ],
  };
}

/**
 * Converts bytes to human-readable format
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

/**
 * Validates that video filename matches expected machine slug
 * 
 * Example:
 *   slug: "grader"
 *   url: ".../videos/grader.mp4"
 *   Returns: true
 * 
 *   slug: "motor-grader"
 *   url: ".../videos/grader.mp4"
 *   Returns: false
 */
export function validateFilenameMatchesSlug(slug: string, videoUrl: string): boolean {
  const extractedSlug = extractMachineSlug(videoUrl);
  
  // Normalize slugs (lowercase, remove special chars)
  const normalizedExpected = slug.toLowerCase().replace(/[^a-z0-9-]/g, '');
  const normalizedActual = extractedSlug.toLowerCase().replace(/[^a-z0-9-]/g, '');

  return normalizedExpected === normalizedActual;
}
