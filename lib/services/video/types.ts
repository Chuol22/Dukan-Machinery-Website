// types.ts — Core TypeScript interfaces and error types for video delivery diagnostic system

import { Machine } from '@/data/machinesData';

// === Video Validation Types ===

export interface VideoValidationResult {
  machineId: number;
  machineName: string;
  videoUrl: string;
  isValidPattern: boolean;
  httpStatus: number | null;
  error?: string;
  contentType?: string;
  contentLength?: number;
  responseHeaders?: Record<string, string>;
}

export interface ValidationReport {
  timestamp: number;
  totalMachines: number;
  validUrls: number;
  invalidUrls: number;
  httpErrors: number;
  results: VideoValidationResult[];
  summary: {
    http200: number;
    http403: number;
    http404: number;
    http429: number;
    networkErrors: number;
  };
}

// === Mapping Analysis Types ===

export interface MappingAnalysisResult {
  totalMachines: number;
  uniqueUrls: number;
  duplicates: Array<{
    url: string;
    machineIds: number[];
    machineNames: string[];
  }>;
  mismatches: Array<{
    machineId: number;
    machineName: string;
    slug: string;
    videoFilename: string;
    expectedFilename: string;
  }>;
}

// === Video Monitoring Types ===

export interface VideoLifecycleEvent {
  machineId: number;
  machineName: string;
  timestamp: number;
  eventType:
    | 'loadstart'
    | 'loadeddata'
    | 'loadedmetadata'
    | 'canplay'
    | 'canplaythrough'
    | 'play'
    | 'playing'
    | 'pause'
    | 'ended'
    | 'error'
    | 'stalled'
    | 'suspend'
    | 'abort'
    | 'emptied'
    | 'disappeared';
  error?: {
    code: number;
    message: string;
  };
  metadata?: Record<string, any>;
}

export interface DomPresenceRecord {
  machineId: number;
  checkTimestamp: number;
  isPresent: boolean;
  consoleErrors: string[];
}

export interface NetworkRequest {
  url: string;
  machineId: number;
  startTime: number;
  endTime?: number;
  status?: number;
  size?: number;
  error?: string;
}

// === Performance Metrics Types ===

export interface VideoPerformanceMetrics {
  machineId: number;
  machineName: string;
  timeToLoadedData: number; // milliseconds
  timeToFirstFrame: number; // milliseconds
  transferSize: number; // bytes
  bufferingEvents: number;
  environment: 'local' | 'vercel';
}

export interface PerformanceReport {
  metrics: VideoPerformanceMetrics[];
  summary: {
    avgLoadTime: number;
    minLoadTime: number;
    maxLoadTime: number;
    slowVideos: VideoPerformanceMetrics[];
    totalTransferSize: number;
  };
  environment: 'local' | 'vercel';
  timestamp: number;
}

// === Diagnostic Types ===

export interface TestVideoStatus {
  machineId: number;
  machineName: string;
  videoUrl: string;
  status: 'loading' | 'loaded' | 'error';
  loadTime?: number;
  error?: {
    code: number;
    message: string;
    httpStatus?: number;
  };
}

export interface DiagnosticReport {
  timestamp: number;
  environment: {
    userAgent: string;
    deploymentUrl: string;
    buildId: string;
  };
  videoStatuses: TestVideoStatus[];
  summary: {
    total: number;
    loaded: number;
    failed: number;
    loading: number;
  };
  networkRequests: NetworkRequest[];
  performanceMetrics?: VideoPerformanceMetrics[];
}

// === Configuration Types ===

export interface CloudinaryConfigCheck {
  strictTransformations: boolean | 'unknown';
  resourceAccessMode: 'public' | 'authenticated' | 'unknown';
  deliveryType: 'upload' | 'fetch' | 'unknown';
  usageStats: {
    storageUsed: number; // GB
    bandwidthUsed: number; // GB
    storageLimit: number; // GB
    bandwidthLimit: number; // GB
    percentUsed: number;
  } | null;
  recommendations: string[];
}

export interface VercelConfigValidation {
  remotePatternConfigured: boolean;
  cspRestrictions: string[] | null;
  edgeConfigPresent: boolean;
  deploymentRegion: string;
  buildId: string;
  issues: string[];
  recommendations: string[];
}

// === Error Types ===

export type ErrorCategory = 'NETWORK' | 'DECODE' | 'UNSUPPORTED' | 'ABORTED' | 'UNKNOWN';

export interface VideoError {
  code: number;
  message: string;
  machineId: number;
  machineName: string;
  url: string;
  category: ErrorCategory;
  timestamp: number;
  context?: Record<string, any>;
}

// === Component Props Types ===

export interface EnhancedVideoProps {
  src: string;
  poster: string;
  machineId: number;
  machineName: string;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  onLoadSuccess?: () => void;
  onLoadError?: (error: VideoError) => void;
  enableMonitoring?: boolean;
  enableRetry?: boolean;
  maxRetries?: number;
  className?: string;
  style?: React.CSSProperties;
}

// === State Types ===

export interface DiagnosticState {
  isRunning: boolean;
  currentStep: string;
  progress: number; // 0-100
  videoStatuses: Map<number, TestVideoStatus>;
  errors: VideoError[];
  startTime: number;
  endTime?: number;
}

export interface MonitoringState {
  activeMonitors: Map<number, {
    intervalId: NodeJS.Timeout;
    startTime: number;
    checks: DomPresenceRecord[];
  }>;
  lifecycleEvents: VideoLifecycleEvent[];
  networkRequests: Map<string, NetworkRequest>;
}

// === Utility Types ===

export type Environment = 'local' | 'vercel' | 'staging' | 'production';

export interface ComparisonResult {
  differences: Array<{
    machineId: number;
    localStatus: string;
    vercelStatus: string;
    statusDiff?: number;
  }>;
  insights: string[];
  localReport: DiagnosticReport;
  vercelReport: DiagnosticReport;
}

// === Constants ===

export const VIDEO_ERROR_CODES = {
  MEDIA_ERR_ABORTED: 1,
  MEDIA_ERR_NETWORK: 2,
  MEDIA_ERR_DECODE: 3,
  MEDIA_ERR_SRC_NOT_SUPPORTED: 4,
} as const;

export const CLOUDINARY_URL_PATTERN = /^https:\/\/res\.cloudinary\.com\/[^\/]+\/video\/upload\/v\d+\/.+\.(mp4|webm)$/i;

export const DEFAULT_MONITORING_DURATION = 30000; // 30 seconds
export const DEFAULT_DOM_CHECK_INTERVAL = 500; // 500ms
export const DEFAULT_MAX_RETRIES = 3;
export const DEFAULT_BASE_RETRY_DELAY = 1000; // 1 second
export const SLOW_VIDEO_THRESHOLD = 10000; // 10 seconds