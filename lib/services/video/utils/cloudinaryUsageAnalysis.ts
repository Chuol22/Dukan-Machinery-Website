// cloudinaryUsageAnalysis.ts — Utilities for parsing and analyzing Cloudinary URLs and usage
// Implements Requirements 3.4 (bandwidth/storage quota checking) and 3.5 (quota warnings)

import { DEBUG_LABELS } from '../constants';

/**
 * Cloudinary URL components extracted from parsing
 */
export interface CloudinaryUrlComponents {
  cloudName: string;
  resourceType: 'image' | 'video' | 'raw';
  deliveryType: 'upload' | 'fetch' | 'private' | 'authenticated';
  version?: string;
  path: string;
  filename: string;
  extension: string;
  transformations?: string;
  fullUrl: string;
}

/**
 * Cloudinary usage statistics
 */
export interface CloudinaryUsageStats {
  storageUsed: number; // GB
  storageLimit: number; // GB
  storagePercent: number;
  bandwidthUsed: number; // GB
  bandwidthLimit: number; // GB
  bandwidthPercent: number;
  transformationsUsed?: number;
  transformationsLimit?: number;
  transformationsPercent?: number;
}

/**
 * Quota warning level
 */
export type QuotaWarningLevel = 'safe' | 'warning' | 'critical' | 'exceeded';

/**
 * Quota analysis result
 */
export interface QuotaAnalysis {
  level: QuotaWarningLevel;
  message: string;
  recommendations: string[];
  isBlocking: boolean; // Whether this level blocks video delivery
}

/**
 * Cloudinary free tier limits
 */
export const CLOUDINARY_FREE_TIER = {
  STORAGE_GB: 25,
  BANDWIDTH_GB_MONTHLY: 25,
  TRANSFORMATIONS_MONTHLY: 25000,
} as const;

/**
 * Quota warning thresholds
 */
export const QUOTA_THRESHOLDS = {
  SAFE: 0,
  WARNING: 80, // 80% usage triggers warning
  CRITICAL: 90, // 90% usage is critical
  EXCEEDED: 100, // 100% is exceeded
} as const;

/**
 * Parses a Cloudinary URL and extracts its components
 * 
 * Pattern: https://res.cloudinary.com/{cloud_name}/{resource_type}/{delivery_type}/[{transformations}/]v{version}/{path}/{filename}.{extension}
 * 
 * @param url - Cloudinary URL to parse
 * @returns Parsed URL components or null if invalid
 */
export function parseCloudinaryUrl(url: string): CloudinaryUrlComponents | null {
  try {
    // Basic validation
    if (!url.startsWith('https://res.cloudinary.com/')) {
      console.warn(`${DEBUG_LABELS.DIAGNOSTIC_SUITE} Invalid Cloudinary URL: ${url}`);
      return null;
    }

    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split('/').filter(Boolean);

    // Minimum parts: cloud_name, resource_type, delivery_type, version, filename
    if (pathParts.length < 5) {
      console.warn(`${DEBUG_LABELS.DIAGNOSTIC_SUITE} URL path too short: ${url}`);
      return null;
    }

    const cloudName = pathParts[0];
    const resourceType = pathParts[1] as 'image' | 'video' | 'raw';
    const deliveryType = pathParts[2] as 'upload' | 'fetch' | 'private' | 'authenticated';

    // Find version (starts with 'v' followed by digits)
    let versionIndex = -1;
    let version: string | undefined;
    
    for (let i = 3; i < pathParts.length; i++) {
      if (/^v\d+$/.test(pathParts[i])) {
        versionIndex = i;
        version = pathParts[i];
        break;
      }
    }

    // If no version found, assume it's at index 3
    if (versionIndex === -1) {
      versionIndex = 3;
    }

    // Transformations are between delivery_type and version
    const transformations = versionIndex > 3 
      ? pathParts.slice(3, versionIndex).join('/') 
      : undefined;

    // Path and filename are after version
    const pathAndFile = pathParts.slice(versionIndex + 1);
    const filename = pathAndFile[pathAndFile.length - 1];
    const path = pathAndFile.slice(0, -1).join('/');

    // Extract extension
    const lastDotIndex = filename.lastIndexOf('.');
    const extension = lastDotIndex > 0 ? filename.substring(lastDotIndex + 1) : '';

    return {
      cloudName,
      resourceType,
      deliveryType,
      version,
      path,
      filename,
      extension,
      transformations,
      fullUrl: url,
    };
  } catch (error) {
    console.error(`${DEBUG_LABELS.DIAGNOSTIC_SUITE} Error parsing Cloudinary URL:`, error);
    return null;
  }
}

/**
 * Analyzes multiple Cloudinary URLs and provides statistics
 * 
 * @param urls - Array of Cloudinary URLs to analyze
 * @returns Analysis results
 */
export function analyzeCloudinaryUrls(urls: string[]): {
  total: number;
  valid: number;
  invalid: number;
  byResourceType: Record<string, number>;
  byDeliveryType: Record<string, number>;
  byExtension: Record<string, number>;
  withTransformations: number;
  withoutTransformations: number;
  uniqueCloudNames: string[];
  parsedUrls: CloudinaryUrlComponents[];
} {
  const parsedUrls: CloudinaryUrlComponents[] = [];
  const byResourceType: Record<string, number> = {};
  const byDeliveryType: Record<string, number> = {};
  const byExtension: Record<string, number> = {};
  const cloudNames = new Set<string>();
  let withTransformations = 0;
  let withoutTransformations = 0;

  for (const url of urls) {
    const parsed = parseCloudinaryUrl(url);
    if (parsed) {
      parsedUrls.push(parsed);
      
      byResourceType[parsed.resourceType] = (byResourceType[parsed.resourceType] || 0) + 1;
      byDeliveryType[parsed.deliveryType] = (byDeliveryType[parsed.deliveryType] || 0) + 1;
      byExtension[parsed.extension] = (byExtension[parsed.extension] || 0) + 1;
      
      cloudNames.add(parsed.cloudName);
      
      if (parsed.transformations) {
        withTransformations++;
      } else {
        withoutTransformations++;
      }
    }
  }

  return {
    total: urls.length,
    valid: parsedUrls.length,
    invalid: urls.length - parsedUrls.length,
    byResourceType,
    byDeliveryType,
    byExtension,
    withTransformations,
    withoutTransformations,
    uniqueCloudNames: Array.from(cloudNames),
    parsedUrls,
  };
}

/**
 * Calculates quota warning level based on usage percentage
 * 
 * @param percentUsed - Usage percentage (0-100+)
 * @returns Warning level
 */
export function getQuotaWarningLevel(percentUsed: number): QuotaWarningLevel {
  if (percentUsed >= QUOTA_THRESHOLDS.EXCEEDED) {
    return 'exceeded';
  } else if (percentUsed >= QUOTA_THRESHOLDS.CRITICAL) {
    return 'critical';
  } else if (percentUsed >= QUOTA_THRESHOLDS.WARNING) {
    return 'warning';
  } else {
    return 'safe';
  }
}

/**
 * Analyzes bandwidth quota and provides recommendations
 * 
 * @param bandwidthUsed - Bandwidth used in GB
 * @param bandwidthLimit - Bandwidth limit in GB (default: 25 GB for free tier)
 * @returns Quota analysis
 */
export function analyzeBandwidthQuota(
  bandwidthUsed: number,
  bandwidthLimit: number = CLOUDINARY_FREE_TIER.BANDWIDTH_GB_MONTHLY
): QuotaAnalysis {
  const percentUsed = (bandwidthUsed / bandwidthLimit) * 100;
  const level = getQuotaWarningLevel(percentUsed);
  const remainingGB = Math.max(0, bandwidthLimit - bandwidthUsed);
  
  let message: string;
  const recommendations: string[] = [];
  let isBlocking = false;

  switch (level) {
    case 'exceeded':
      message = `CRITICAL: Bandwidth quota exceeded! Using ${bandwidthUsed.toFixed(2)} GB of ${bandwidthLimit} GB (${percentUsed.toFixed(1)}%)`;
      recommendations.push(
        'Cloudinary is likely blocking or throttling video delivery',
        'IMMEDIATE ACTION REQUIRED: Upgrade to paid tier or wait for monthly reset',
        'Consider temporary CDN alternatives or video compression',
        'Review which pages/features consume most bandwidth'
      );
      isBlocking = true;
      break;

    case 'critical':
      message = `WARNING: Bandwidth quota at critical level! Using ${bandwidthUsed.toFixed(2)} GB of ${bandwidthLimit} GB (${percentUsed.toFixed(1)}%) - Only ${remainingGB.toFixed(2)} GB remaining`;
      recommendations.push(
        'Video delivery may fail when quota is fully consumed',
        'Implement lazy loading to reduce unnecessary video loads',
        'Add video compression or lower quality transformations (q_auto:low)',
        'Consider upgrading to paid tier before reaching 100%',
        'Monitor bandwidth usage daily'
      );
      isBlocking = false;
      break;

    case 'warning':
      message = `NOTICE: Bandwidth quota at ${percentUsed.toFixed(1)}% (${bandwidthUsed.toFixed(2)} GB of ${bandwidthLimit} GB) - ${remainingGB.toFixed(2)} GB remaining`;
      recommendations.push(
        'Monitor bandwidth usage closely',
        'Implement video lazy loading if not already done',
        'Consider adding Cloudinary transformations (q_auto, w_800) to reduce file sizes',
        'Review analytics to identify high-traffic pages',
        'Plan for potential upgrade if usage trend continues'
      );
      isBlocking = false;
      break;

    case 'safe':
      message = `Bandwidth usage is healthy: ${percentUsed.toFixed(1)}% (${bandwidthUsed.toFixed(2)} GB of ${bandwidthLimit} GB)`;
      recommendations.push(
        'Continue monitoring bandwidth usage monthly',
        'Current usage level is sustainable for free tier'
      );
      isBlocking = false;
      break;
  }

  return {
    level,
    message,
    recommendations,
    isBlocking,
  };
}

/**
 * Analyzes storage quota and provides recommendations
 * 
 * @param storageUsed - Storage used in GB
 * @param storageLimit - Storage limit in GB (default: 25 GB for free tier)
 * @returns Quota analysis
 */
export function analyzeStorageQuota(
  storageUsed: number,
  storageLimit: number = CLOUDINARY_FREE_TIER.STORAGE_GB
): QuotaAnalysis {
  const percentUsed = (storageUsed / storageLimit) * 100;
  const level = getQuotaWarningLevel(percentUsed);
  const remainingGB = Math.max(0, storageLimit - storageUsed);
  
  let message: string;
  const recommendations: string[] = [];
  let isBlocking = false;

  switch (level) {
    case 'exceeded':
      message = `CRITICAL: Storage quota exceeded! Using ${storageUsed.toFixed(2)} GB of ${storageLimit} GB (${percentUsed.toFixed(1)}%)`;
      recommendations.push(
        'Cannot upload new videos until storage is freed or account is upgraded',
        'Review and delete unused or duplicate videos',
        'Compress videos before uploading',
        'Consider upgrading to paid tier for additional storage'
      );
      isBlocking = true;
      break;

    case 'critical':
      message = `WARNING: Storage quota at critical level! Using ${storageUsed.toFixed(2)} GB of ${storageLimit} GB (${percentUsed.toFixed(1)}%) - Only ${remainingGB.toFixed(2)} GB remaining`;
      recommendations.push(
        'New video uploads will fail when quota is fully consumed',
        'Audit Media Library for unused or duplicate videos',
        'Compress videos to reduce storage footprint',
        'Plan for upgrade if more videos will be added'
      );
      isBlocking = false;
      break;

    case 'warning':
      message = `NOTICE: Storage quota at ${percentUsed.toFixed(1)}% (${storageUsed.toFixed(2)} GB of ${storageLimit} GB) - ${remainingGB.toFixed(2)} GB remaining`;
      recommendations.push(
        'Monitor storage usage when adding new videos',
        'Consider video compression for future uploads',
        'Review Media Library for optimization opportunities'
      );
      isBlocking = false;
      break;

    case 'safe':
      message = `Storage usage is healthy: ${percentUsed.toFixed(1)}% (${storageUsed.toFixed(2)} GB of ${storageLimit} GB)`;
      recommendations.push(
        'Current storage level is sustainable for free tier',
        'Continue monitoring when adding new videos'
      );
      isBlocking = false;
      break;
  }

  return {
    level,
    message,
    recommendations,
    isBlocking,
  };
}

/**
 * Analyzes overall Cloudinary usage and provides comprehensive report
 * 
 * @param usageStats - Current usage statistics
 * @returns Comprehensive analysis with prioritized recommendations
 */
export function analyzeCloudinaryUsage(usageStats: CloudinaryUsageStats): {
  bandwidthAnalysis: QuotaAnalysis;
  storageAnalysis: QuotaAnalysis;
  overallStatus: QuotaWarningLevel;
  criticalIssues: string[];
  allRecommendations: string[];
  isBlocking: boolean;
} {
  const bandwidthAnalysis = analyzeBandwidthQuota(
    usageStats.bandwidthUsed,
    usageStats.bandwidthLimit
  );

  const storageAnalysis = analyzeStorageQuota(
    usageStats.storageUsed,
    usageStats.storageLimit
  );

  // Determine overall status (use the worse of bandwidth or storage)
  const levels: QuotaWarningLevel[] = ['safe', 'warning', 'critical', 'exceeded'];
  const bandwidthLevelIndex = levels.indexOf(bandwidthAnalysis.level);
  const storageLevelIndex = levels.indexOf(storageAnalysis.level);
  const overallStatus = levels[Math.max(bandwidthLevelIndex, storageLevelIndex)];

  // Collect critical issues
  const criticalIssues: string[] = [];
  if (bandwidthAnalysis.isBlocking) {
    criticalIssues.push('Bandwidth quota exceeded - video delivery is blocked');
  }
  if (storageAnalysis.isBlocking) {
    criticalIssues.push('Storage quota exceeded - cannot upload new videos');
  }

  // Combine recommendations (bandwidth first as it's more likely to cause delivery issues)
  const allRecommendations = [
    `BANDWIDTH: ${bandwidthAnalysis.message}`,
    ...bandwidthAnalysis.recommendations.map(r => `  - ${r}`),
    `STORAGE: ${storageAnalysis.message}`,
    ...storageAnalysis.recommendations.map(r => `  - ${r}`),
  ];

  return {
    bandwidthAnalysis,
    storageAnalysis,
    overallStatus,
    criticalIssues,
    allRecommendations,
    isBlocking: bandwidthAnalysis.isBlocking || storageAnalysis.isBlocking,
  };
}

/**
 * Generates step-by-step instructions for checking Cloudinary quota in the dashboard
 * 
 * @returns Array of instruction steps
 */
export function getQuotaCheckingInstructions(): string[] {
  return [
    'STEP 1: Login to Cloudinary Dashboard',
    '  → Go to https://console.cloudinary.com',
    '  → Login with your account credentials',
    '',
    'STEP 2: View Usage Dashboard',
    '  → Click on "Dashboard" in the left sidebar (or home icon)',
    '  → The main dashboard shows current month usage metrics',
    '',
    'STEP 3: Check Bandwidth (Delivery) Usage',
    '  → Look for "Bandwidth" or "Transformations & Delivery" widget',
    '  → Note the current usage in GB (e.g., "18.5 GB / 25 GB")',
    '  → Calculate percentage: (used / limit) * 100',
    `  → WARNING LEVEL: ${QUOTA_THRESHOLDS.WARNING}% or higher needs attention`,
    `  → CRITICAL LEVEL: ${QUOTA_THRESHOLDS.CRITICAL}% or higher may cause delivery failures`,
    '',
    'STEP 4: Check Storage Usage',
    '  → Look for "Storage" or "Credits" widget',
    '  → Note the current storage in GB',
    '  → Free tier limit: 25 GB storage',
    `  → WARNING LEVEL: ${QUOTA_THRESHOLDS.WARNING}% or higher`,
    '',
    'STEP 5: Check Transformations (Optional)',
    '  → Transformations count may be shown separately',
    '  → Free tier limit: 25,000 transformations/month',
    '  → Excessive transformation usage can trigger restrictions',
    '',
    'STEP 6: View Detailed Reports',
    '  → Click "Analytics" in left sidebar for detailed breakdown',
    '  → View bandwidth usage by date range',
    '  → Identify peak usage periods and traffic sources',
    '',
    'STEP 7: Set Up Quota Alerts (Recommended)',
    '  → Go to Settings → Notifications',
    '  → Enable email alerts for quota thresholds (80%, 90%, 100%)',
    '  → Get early warning before delivery failures occur',
  ];
}

/**
 * Estimates bandwidth consumption for video delivery
 * 
 * @param videoSizeMB - Video file size in megabytes
 * @param viewsPerMonth - Expected number of views per month
 * @returns Estimated bandwidth in GB
 */
export function estimateVideoBandwidth(videoSizeMB: number, viewsPerMonth: number): number {
  const bandwidthMB = videoSizeMB * viewsPerMonth;
  return bandwidthMB / 1024; // Convert MB to GB
}

/**
 * Calculates how many video views remain before hitting bandwidth quota
 * 
 * @param averageVideoSizeMB - Average video file size in MB
 * @param bandwidthUsedGB - Current bandwidth used in GB
 * @param bandwidthLimitGB - Bandwidth limit in GB
 * @returns Estimated remaining views before quota exhaustion
 */
export function calculateRemainingViews(
  averageVideoSizeMB: number,
  bandwidthUsedGB: number,
  bandwidthLimitGB: number = CLOUDINARY_FREE_TIER.BANDWIDTH_GB_MONTHLY
): number {
  const remainingGB = Math.max(0, bandwidthLimitGB - bandwidthUsedGB);
  const remainingMB = remainingGB * 1024;
  return Math.floor(remainingMB / averageVideoSizeMB);
}

/**
 * Logs usage analysis to console with formatted output
 */
export function logUsageAnalysis(
  usageStats: CloudinaryUsageStats,
  urls?: string[]
): void {
  console.group(`${DEBUG_LABELS.DIAGNOSTIC_SUITE} Cloudinary Usage Analysis`);
  
  const analysis = analyzeCloudinaryUsage(usageStats);
  
  console.log('\n=== OVERALL STATUS ===');
  console.log(`Status Level: ${analysis.overallStatus.toUpperCase()}`);
  
  if (analysis.criticalIssues.length > 0) {
    console.error('\n🚨 CRITICAL ISSUES:');
    analysis.criticalIssues.forEach(issue => console.error(`  ❌ ${issue}`));
  }
  
  console.log('\n=== BANDWIDTH ANALYSIS ===');
  console.log(analysis.bandwidthAnalysis.message);
  if (analysis.bandwidthAnalysis.recommendations.length > 0) {
    console.log('Recommendations:');
    analysis.bandwidthAnalysis.recommendations.forEach(rec => 
      console.log(`  • ${rec}`)
    );
  }
  
  console.log('\n=== STORAGE ANALYSIS ===');
  console.log(analysis.storageAnalysis.message);
  if (analysis.storageAnalysis.recommendations.length > 0) {
    console.log('Recommendations:');
    analysis.storageAnalysis.recommendations.forEach(rec => 
      console.log(`  • ${rec}`)
    );
  }
  
  if (urls && urls.length > 0) {
    console.log('\n=== URL ANALYSIS ===');
    const urlAnalysis = analyzeCloudinaryUrls(urls);
    console.log(`Total URLs: ${urlAnalysis.total}`);
    console.log(`Valid: ${urlAnalysis.valid}, Invalid: ${urlAnalysis.invalid}`);
    console.log('By Resource Type:', urlAnalysis.byResourceType);
    console.log('By Extension:', urlAnalysis.byExtension);
    console.log(`With Transformations: ${urlAnalysis.withTransformations}`);
    console.log(`Without Transformations: ${urlAnalysis.withoutTransformations}`);
  }
  
  console.groupEnd();
}
