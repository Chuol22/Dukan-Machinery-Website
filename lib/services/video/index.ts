// index.ts — Main exports for video delivery diagnostic system

// === Internal imports for use within this file ===
import {
  VERCEL_ENV_INDICATORS,
  LOCAL_ENV_INDICATORS,
  DEFAULT_MAX_RETRIES,
  DEFAULT_BASE_RETRY_DELAY,
  RETRY_STRATEGIES,
  CLOUDINARY_URL_PATTERN,
} from './constants';
import type { Environment } from './types';

// === Core Types ===
export type {
  VideoValidationResult,
  ValidationReport,
  MappingAnalysisResult,
  VideoLifecycleEvent,
  DomPresenceRecord,
  NetworkRequest,
  VideoPerformanceMetrics,
  PerformanceReport,
  TestVideoStatus,
  DiagnosticReport,
  ComparisonResult,
  CloudinaryConfigCheck,
  VercelConfigValidation,
  VideoError,
  ErrorCategory,
  EnhancedVideoProps,
  DiagnosticState,
  MonitoringState,
  Environment,
} from './types';

// === Service Interfaces ===
export type {
  IVideoValidator,
  IMappingAnalyzer,
  IVideoMonitor,
  IPerformanceMetricsCollector,
  IDiagnosticTestSuite,
  ICloudinaryConfigChecker,
  IVercelConfigValidator,
  IEnhancedVideoComponent,
  IVideoErrorHandler,
} from './interfaces';

// === Error Classes and Utilities ===
export {
  VideoValidationError,
  VideoLoadError,
  DiagnosticError,
  ERROR_CODES,
  ERROR_MESSAGES,
  categorizeVideoError,
  categorizeHttpError,
  createVideoError,
  createNetworkError,
  formatErrorForLogging,
  isRetryableError,
  isTemporaryError,
  isPermanentError,
  analyzeErrors,
} from './errors';

// === Constants ===
export {
  CLOUDINARY_URL_PATTERN,
  CLOUDINARY_BASE_URL,
  CLOUDINARY_CLOUD_NAME,
  DEFAULT_MONITORING_DURATION,
  DEFAULT_DOM_CHECK_INTERVAL,
  DEFAULT_MAX_RETRIES,
  DEFAULT_BASE_RETRY_DELAY,
  SLOW_VIDEO_THRESHOLD,
  DIAGNOSTIC_TIMEOUT,
  VIDEO_LOAD_TIMEOUT,
  HTTP_REQUEST_TIMEOUT,
  PERFORMANCE_THRESHOLDS,
  VERCEL_ENV_INDICATORS,
  LOCAL_ENV_INDICATORS,
  DEFAULT_VIDEO_ATTRIBUTES,
  CLOUDINARY_TRANSFORMATIONS,
  HTTP_STATUS,
  DIAGNOSTIC_STEPS,
  RETRY_STRATEGIES,
  FALLBACK_STRATEGIES,
  MONITORING_CONFIG,
  CSP_DIRECTIVES,
  BROWSER_SUPPORT,
  DEFAULT_CONFIG,
  ENV_VARS,
  DEBUG_LABELS,
} from './constants';

// === Utility Functions ===

/**
 * Checks if current environment is Vercel deployment
 */
export function isVercelEnvironment(): boolean {
  if (typeof window === 'undefined') {
    // Server-side check
    return VERCEL_ENV_INDICATORS.some(indicator => 
      process.env[indicator] !== undefined
    );
  }
  
  // Client-side check
  return (
    window.location.hostname.includes('vercel.app') ||
    window.location.hostname.includes('vercel-') ||
    Boolean(process.env.NEXT_PUBLIC_VERCEL_URL)
  );
}

/**
 * Checks if current environment is local development
 */
export function isLocalEnvironment(): boolean {
  if (typeof window === 'undefined') {
    return process.env.NODE_ENV === 'development';
  }
  
  return LOCAL_ENV_INDICATORS.some(indicator =>
    window.location.hostname.includes(indicator)
  );
}

/**
 * Gets current environment type
 */
export function getCurrentEnvironment(): Environment {
  if (isVercelEnvironment()) return 'vercel';
  if (isLocalEnvironment()) return 'local';
  return 'production';
}

/**
 * Checks if video monitoring should be enabled
 */
export function isMonitoringEnabled(): boolean {
  // Only enable monitoring in development or when explicitly enabled
  const envEnabled = process.env.NEXT_PUBLIC_ENABLE_VIDEO_MONITORING === 'true';
  const devEnabled = process.env.NODE_ENV === 'development';
  
  return envEnabled || devEnabled;
}

/**
 * Gets retry configuration from environment variables
 */
export function getRetryConfig(): {
  maxAttempts: number;
  baseDelay: number;
  strategy: string;
} {
  return {
    maxAttempts: parseInt(
      process.env.NEXT_PUBLIC_VIDEO_RETRY_MAX_ATTEMPTS || String(DEFAULT_MAX_RETRIES)
    ),
    baseDelay: parseInt(
      process.env.NEXT_PUBLIC_VIDEO_RETRY_BASE_DELAY || String(DEFAULT_BASE_RETRY_DELAY)
    ),
    strategy: RETRY_STRATEGIES.EXPONENTIAL_BACKOFF,
  };
}

/**
 * Validates if URL matches Cloudinary video pattern
 */
export function isValidCloudinaryVideoUrl(url: string): boolean {
  return CLOUDINARY_URL_PATTERN.test(url);
}

/**
 * Extracts filename from Cloudinary URL
 */
export function extractCloudinaryFilename(url: string): string {
  try {
    const match = url.match(/\/([^\/]+)\.(mp4|webm)(?:\?|$)/i);
    return match ? match[1] : '';
  } catch (error) {
    return '';
  }
}

/**
 * Adds transformation parameters to Cloudinary URL
 */
export function addCloudinaryTransformations(
  url: string,
  transformations: string[]
): string {
  try {
    if (!transformations.length) return url;
    
    // Insert transformations before the filename
    const parts = url.split('/');
    const filename = parts.pop(); // Remove filename
    const uploadIndex = parts.findIndex(part => part === 'upload');
    
    if (uploadIndex === -1 || !filename) return url;
    
    // Insert transformations after 'upload'
    parts.splice(uploadIndex + 1, 0, transformations.join(','));
    parts.push(filename);
    
    return parts.join('/');
  } catch (error) {
    return url;
  }
}

/**
 * Formats timestamp for logging
 */
export function formatTimestamp(timestamp: number): string {
  return new Date(timestamp).toISOString();
}

/**
 * Calculates exponential backoff delay
 */
export function calculateBackoffDelay(
  attempt: number,
  baseDelay: number = DEFAULT_BASE_RETRY_DELAY
): number {
  return Math.min(baseDelay * Math.pow(2, attempt), 30000); // Max 30 seconds
}

/**
 * Debounces function calls
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(null, args), wait);
  };
}

/**
 * Throttles function calls
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func.apply(null, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/**
 * Creates a promise that resolves after specified delay
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Creates a promise that times out after specified duration
 */
export function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
  errorMessage = 'Operation timed out'
): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error(errorMessage)), timeoutMs)
    ),
  ]);
}

// === Re-exports for convenience ===
export { VIDEO_ERROR_CODES } from './types';

// === Version Info ===
export const VERSION = '1.0.0';
export const SYSTEM_NAME = 'Video Delivery Diagnostic System';
export const SYSTEM_DESCRIPTION = 'Comprehensive diagnostic and monitoring system for Vercel video delivery issues';