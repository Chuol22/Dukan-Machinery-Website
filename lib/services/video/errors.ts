// errors.ts — Error definitions and error handling utilities for video delivery system

import { VideoError, ErrorCategory } from './types';

// === Custom Error Classes ===

export class VideoValidationError extends Error {
  public readonly code: string;
  public readonly machineId?: number;
  public readonly url?: string;

  constructor(message: string, code: string, machineId?: number, url?: string) {
    super(message);
    this.name = 'VideoValidationError';
    this.code = code;
    this.machineId = machineId;
    this.url = url;
  }
}

export class VideoLoadError extends Error {
  public readonly code: number;
  public readonly category: ErrorCategory;
  public readonly machineId: number;
  public readonly url: string;

  constructor(
    message: string,
    code: number,
    category: ErrorCategory,
    machineId: number,
    url: string
  ) {
    super(message);
    this.name = 'VideoLoadError';
    this.code = code;
    this.category = category;
    this.machineId = machineId;
    this.url = url;
  }
}

export class DiagnosticError extends Error {
  public readonly phase: string;
  public readonly machineId?: number;

  constructor(message: string, phase: string, machineId?: number) {
    super(message);
    this.name = 'DiagnosticError';
    this.phase = phase;
    this.machineId = machineId;
  }
}

// === Error Constants ===

export const ERROR_CODES = {
  // Video element error codes (from HTML5 video spec)
  MEDIA_ERR_ABORTED: 1,
  MEDIA_ERR_NETWORK: 2,
  MEDIA_ERR_DECODE: 3,
  MEDIA_ERR_SRC_NOT_SUPPORTED: 4,
  
  // Custom validation error codes
  INVALID_URL_PATTERN: 'INVALID_URL_PATTERN',
  HTTP_ACCESS_DENIED: 'HTTP_ACCESS_DENIED',
  HTTP_NOT_FOUND: 'HTTP_NOT_FOUND',
  HTTP_RATE_LIMITED: 'HTTP_RATE_LIMITED',
  HTTP_NETWORK_ERROR: 'HTTP_NETWORK_ERROR',
  
  // Configuration error codes
  CONFIG_NEXT_INVALID: 'CONFIG_NEXT_INVALID',
  CONFIG_CSP_BLOCKED: 'CONFIG_CSP_BLOCKED',
  CONFIG_CLOUDINARY_AUTH: 'CONFIG_CLOUDINARY_AUTH',
  CONFIG_CLOUDINARY_QUOTA: 'CONFIG_CLOUDINARY_QUOTA',
  
  // Diagnostic error codes
  DIAGNOSTIC_TIMEOUT: 'DIAGNOSTIC_TIMEOUT',
  DIAGNOSTIC_DOM_ERROR: 'DIAGNOSTIC_DOM_ERROR',
  DIAGNOSTIC_NETWORK_ERROR: 'DIAGNOSTIC_NETWORK_ERROR',
} as const;

export const ERROR_MESSAGES = {
  [ERROR_CODES.MEDIA_ERR_ABORTED]: 'Video loading was aborted by user or system',
  [ERROR_CODES.MEDIA_ERR_NETWORK]: 'Network error occurred while loading video',
  [ERROR_CODES.MEDIA_ERR_DECODE]: 'Video decode error - incompatible format or corrupted file',
  [ERROR_CODES.MEDIA_ERR_SRC_NOT_SUPPORTED]: 'Video format not supported by browser',
  
  [ERROR_CODES.INVALID_URL_PATTERN]: 'Video URL does not match expected Cloudinary pattern',
  [ERROR_CODES.HTTP_ACCESS_DENIED]: 'HTTP 403 - Access denied, possibly due to Cloudinary restrictions',
  [ERROR_CODES.HTTP_NOT_FOUND]: 'HTTP 404 - Video file not found at specified URL',
  [ERROR_CODES.HTTP_RATE_LIMITED]: 'HTTP 429 - Rate limited or quota exceeded',
  [ERROR_CODES.HTTP_NETWORK_ERROR]: 'Network error during HTTP request',
  
  [ERROR_CODES.CONFIG_NEXT_INVALID]: 'Next.js configuration missing Cloudinary domain',
  [ERROR_CODES.CONFIG_CSP_BLOCKED]: 'Content Security Policy blocking video requests',
  [ERROR_CODES.CONFIG_CLOUDINARY_AUTH]: 'Cloudinary authentication configuration issue',
  [ERROR_CODES.CONFIG_CLOUDINARY_QUOTA]: 'Cloudinary usage quota exceeded',
  
  [ERROR_CODES.DIAGNOSTIC_TIMEOUT]: 'Diagnostic test timed out',
  [ERROR_CODES.DIAGNOSTIC_DOM_ERROR]: 'DOM manipulation error during diagnostics',
  [ERROR_CODES.DIAGNOSTIC_NETWORK_ERROR]: 'Network error during diagnostic tests',
} as const;

// === Error Category Mapping ===

export function categorizeVideoError(errorCode: number): ErrorCategory {
  switch (errorCode) {
    case ERROR_CODES.MEDIA_ERR_ABORTED:
      return 'ABORTED';
    case ERROR_CODES.MEDIA_ERR_NETWORK:
      return 'NETWORK';
    case ERROR_CODES.MEDIA_ERR_DECODE:
      return 'DECODE';
    case ERROR_CODES.MEDIA_ERR_SRC_NOT_SUPPORTED:
      return 'UNSUPPORTED';
    default:
      return 'UNKNOWN';
  }
}

export function categorizeHttpError(status: number): ErrorCategory {
  if (status >= 400 && status < 500) {
    return 'NETWORK'; // Client errors like 403, 404, 429
  }
  if (status >= 500) {
    return 'NETWORK'; // Server errors
  }
  return 'UNKNOWN';
}

// === Error Utilities ===

export function createVideoError(
  event: Event,
  machineId: number,
  machineName: string,
  url: string
): VideoError {
  const target = event.target as HTMLVideoElement;
  const error = target.error;
  
  if (!error) {
    return {
      code: 0,
      message: 'Unknown video error',
      machineId,
      machineName,
      url,
      category: 'UNKNOWN',
      timestamp: Date.now(),
    };
  }

  return {
    code: error.code,
    message: ERROR_MESSAGES[error.code as keyof typeof ERROR_MESSAGES] || error.message,
    machineId,
    machineName,
    url,
    category: categorizeVideoError(error.code),
    timestamp: Date.now(),
    context: {
      networkState: target.networkState,
      readyState: target.readyState,
      currentTime: target.currentTime,
      duration: target.duration,
    },
  };
}

export function createNetworkError(
  status: number,
  machineId: number,
  machineName: string,
  url: string
): VideoError {
  let code: string;
  let message: string;

  switch (status) {
    case 403:
      code = ERROR_CODES.HTTP_ACCESS_DENIED;
      message = ERROR_MESSAGES[ERROR_CODES.HTTP_ACCESS_DENIED];
      break;
    case 404:
      code = ERROR_CODES.HTTP_NOT_FOUND;
      message = ERROR_MESSAGES[ERROR_CODES.HTTP_NOT_FOUND];
      break;
    case 429:
      code = ERROR_CODES.HTTP_RATE_LIMITED;
      message = ERROR_MESSAGES[ERROR_CODES.HTTP_RATE_LIMITED];
      break;
    default:
      code = ERROR_CODES.HTTP_NETWORK_ERROR;
      message = `${ERROR_MESSAGES[ERROR_CODES.HTTP_NETWORK_ERROR]} (Status: ${status})`;
  }

  return {
    code: typeof code === 'string' ? status : parseInt(code),
    message,
    machineId,
    machineName,
    url,
    category: categorizeHttpError(status),
    timestamp: Date.now(),
    context: {
      httpStatus: status,
    },
  };
}

export function formatErrorForLogging(error: VideoError): string {
  return [
    `[Video Error]`,
    `Machine: ${error.machineName} (ID: ${error.machineId})`,
    `Code: ${error.code}`,
    `Message: ${error.message}`,
    `Category: ${error.category}`,
    `URL: ${error.url}`,
    `Time: ${new Date(error.timestamp).toISOString()}`,
    error.context ? `Context: ${JSON.stringify(error.context)}` : '',
  ].filter(Boolean).join(' | ');
}

export function isRetryableError(error: VideoError): boolean {
  // Only retry network errors, not decode or unsupported format errors
  return error.category === 'NETWORK' && error.code === ERROR_CODES.MEDIA_ERR_NETWORK;
}

export function isTemporaryError(error: VideoError): boolean {
  // Temporary errors that might resolve on retry
  const temporaryHttpCodes = [429, 502, 503, 504]; // Rate limit, bad gateway, service unavailable, gateway timeout
  const temporaryVideoCodes: number[] = [ERROR_CODES.MEDIA_ERR_NETWORK];
  
  return (
    temporaryHttpCodes.includes(error.code) ||
    temporaryVideoCodes.includes(error.code)
  );
}

export function isPermanentError(error: VideoError): boolean {
  // Permanent errors that won't resolve on retry
  const permanentHttpCodes = [403, 404]; // Forbidden, not found
  const permanentVideoCodes: number[] = [
    ERROR_CODES.MEDIA_ERR_DECODE,
    ERROR_CODES.MEDIA_ERR_SRC_NOT_SUPPORTED,
  ];
  
  return (
    permanentHttpCodes.includes(error.code) ||
    permanentVideoCodes.includes(error.code)
  );
}

// === Error Analysis ===

export function analyzeErrors(errors: VideoError[]): {
  totalErrors: number;
  errorsByCategory: Record<ErrorCategory, number>;
  errorsByMachine: Record<number, number>;
  commonIssues: Array<{
    issue: string;
    count: number;
    affectedMachines: number[];
  }>;
  recommendations: string[];
} {
  const errorsByCategory: Record<ErrorCategory, number> = {
    NETWORK: 0,
    DECODE: 0,
    UNSUPPORTED: 0,
    ABORTED: 0,
    UNKNOWN: 0,
  };
  
  const errorsByMachine: Record<number, number> = {};
  const errorCounts: Record<string, { count: number; machines: Set<number> }> = {};

  errors.forEach(error => {
    // Count by category
    errorsByCategory[error.category]++;
    
    // Count by machine
    errorsByMachine[error.machineId] = (errorsByMachine[error.machineId] || 0) + 1;
    
    // Count specific error types
    const errorKey = `${error.code}-${error.message.substring(0, 50)}`;
    if (!errorCounts[errorKey]) {
      errorCounts[errorKey] = { count: 0, machines: new Set() };
    }
    errorCounts[errorKey].count++;
    errorCounts[errorKey].machines.add(error.machineId);
  });

  // Identify common issues
  const commonIssues = Object.entries(errorCounts)
    .filter(([_, data]) => data.count > 1)
    .map(([errorKey, data]) => ({
      issue: errorKey.split('-')[1] || errorKey,
      count: data.count,
      affectedMachines: Array.from(data.machines),
    }))
    .sort((a, b) => b.count - a.count);

  // Generate recommendations
  const recommendations: string[] = [];
  
  if (errorsByCategory.NETWORK > errorsByCategory.DECODE) {
    recommendations.push('High number of network errors - check Cloudinary account status and bandwidth quota');
  }
  
  if (errorsByCategory.DECODE > 0) {
    recommendations.push('Video decode errors detected - verify video format compatibility (H.264/AAC)');
  }
  
  if (errorsByCategory.UNSUPPORTED > 0) {
    recommendations.push('Unsupported format errors - check video codec compatibility across browsers');
  }
  
  if (commonIssues.length > 0 && commonIssues[0].count > errors.length * 0.5) {
    recommendations.push(`Common issue affecting ${commonIssues[0].count} videos: ${commonIssues[0].issue}`);
  }

  return {
    totalErrors: errors.length,
    errorsByCategory,
    errorsByMachine,
    commonIssues,
    recommendations,
  };
}