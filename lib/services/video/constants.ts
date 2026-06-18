// constants.ts — Constants and configuration values for video delivery diagnostic system

// === URL Patterns ===

export const CLOUDINARY_URL_PATTERN = /^https:\/\/res\.cloudinary\.com\/[^\/]+\/video\/upload\/v\d+\/.+\.(mp4|webm)$/i;

export const CLOUDINARY_BASE_URL = 'https://res.cloudinary.com';

export const CLOUDINARY_CLOUD_NAME = 'dusezlxj0'; // From machinesData.ts URLs

// === Timing Constants ===

export const DEFAULT_MONITORING_DURATION = 30000; // 30 seconds

export const DEFAULT_DOM_CHECK_INTERVAL = 500; // 500ms

export const DEFAULT_MAX_RETRIES = 3;

export const DEFAULT_BASE_RETRY_DELAY = 1000; // 1 second

export const SLOW_VIDEO_THRESHOLD = 10000; // 10 seconds

export const DIAGNOSTIC_TIMEOUT = 60000; // 60 seconds for full diagnostic

export const VIDEO_LOAD_TIMEOUT = 15000; // 15 seconds per video

export const HTTP_REQUEST_TIMEOUT = 10000; // 10 seconds for HTTP checks

// === Performance Thresholds ===

export const PERFORMANCE_THRESHOLDS = {
  LOAD_TIME_EXCELLENT: 2000, // < 2s
  LOAD_TIME_GOOD: 5000, // < 5s
  LOAD_TIME_SLOW: 10000, // > 10s
  
  TRANSFER_SIZE_LARGE: 10 * 1024 * 1024, // 10MB
  
  BUFFERING_EXCESSIVE: 5, // More than 5 buffering events
} as const;

// === Environment Detection ===

export const VERCEL_ENV_INDICATORS = [
  'VERCEL',
  'VERCEL_URL',
  'VERCEL_ENV',
  'NEXT_PUBLIC_VERCEL_URL',
] as const;

export const LOCAL_ENV_INDICATORS = [
  'localhost',
  '127.0.0.1',
  'dev',
  'development',
] as const;

// === Video Element Attributes ===

export const DEFAULT_VIDEO_ATTRIBUTES = {
  crossOrigin: 'anonymous',
  preload: 'metadata',
  playsInline: true,
  muted: true, // Required for autoplay in modern browsers
} as const;

// === Cloudinary Transformation Parameters ===

export const CLOUDINARY_TRANSFORMATIONS = {
  QUALITY_AUTO: 'q_auto',
  FORMAT_AUTO: 'f_auto',
  WIDTH_800: 'w_800',
  WIDTH_400: 'w_400',
  PROGRESSIVE: 'fl_progressive',
} as const;

// === HTTP Status Codes ===

export const HTTP_STATUS = {
  OK: 200,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
} as const;

// === Diagnostic Test Steps ===

export const DIAGNOSTIC_STEPS = {
  INITIALIZING: 'Initializing diagnostic test suite',
  VALIDATING_URLS: 'Validating video URLs',
  CHECKING_HTTP: 'Checking HTTP accessibility',
  ANALYZING_MAPPINGS: 'Analyzing machine-video mappings',
  TESTING_VIDEOS: 'Testing video loading',
  COLLECTING_METRICS: 'Collecting performance metrics',
  MONITORING_DOM: 'Monitoring DOM presence',
  GENERATING_REPORT: 'Generating diagnostic report',
  COMPLETED: 'Diagnostic tests completed',
  FAILED: 'Diagnostic tests failed',
} as const;

// === Error Recovery Strategies ===

export const RETRY_STRATEGIES = {
  EXPONENTIAL_BACKOFF: 'exponential',
  LINEAR_BACKOFF: 'linear',
  IMMEDIATE: 'immediate',
} as const;

export const FALLBACK_STRATEGIES = {
  POSTER_IMAGE: 'poster',
  PLACEHOLDER: 'placeholder',
  ERROR_MESSAGE: 'error',
} as const;

// === Monitoring Configuration ===

export const MONITORING_CONFIG = {
  DOM_OBSERVER_OPTIONS: {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['src', 'poster', 'style', 'class'],
  },
  
  PERFORMANCE_OBSERVER_OPTIONS: {
    entryTypes: ['navigation', 'resource', 'measure'],
  },
  
  VIDEO_EVENT_TYPES: [
    'loadstart',
    'loadeddata',
    'loadedmetadata',
    'canplay',
    'canplaythrough',
    'play',
    'playing',
    'pause',
    'ended',
    'error',
    'stalled',
    'suspend',
    'abort',
    'emptied',
  ],
} as const;

// === Content Security Policy Directives ===

export const CSP_DIRECTIVES = {
  MEDIA_SRC: 'media-src',
  CONNECT_SRC: 'connect-src',
  IMG_SRC: 'img-src',
  SCRIPT_SRC: 'script-src',
} as const;

// === Browser Compatibility ===

export const BROWSER_SUPPORT = {
  VIDEO_FORMATS: {
    MP4: ['chrome', 'firefox', 'safari', 'edge'],
    WEBM: ['chrome', 'firefox', 'edge'], // Safari limited support
  },
  
  VIDEO_CODECS: {
    H264: ['chrome', 'firefox', 'safari', 'edge'],
    H265: ['safari'], // Limited support
    VP9: ['chrome', 'firefox', 'edge'],
  },
  
  AUDIO_CODECS: {
    AAC: ['chrome', 'firefox', 'safari', 'edge'],
    MP3: ['chrome', 'firefox', 'safari', 'edge'],
    OPUS: ['chrome', 'firefox', 'edge'],
  },
} as const;

// === Default Configuration ===

export const DEFAULT_CONFIG = {
  monitoring: {
    enabled: process.env.NODE_ENV === 'development',
    duration: DEFAULT_MONITORING_DURATION,
    interval: DEFAULT_DOM_CHECK_INTERVAL,
  },
  
  retry: {
    enabled: true,
    maxAttempts: DEFAULT_MAX_RETRIES,
    baseDelay: DEFAULT_BASE_RETRY_DELAY,
    strategy: RETRY_STRATEGIES.EXPONENTIAL_BACKOFF,
  },
  
  fallback: {
    enabled: true,
    strategy: FALLBACK_STRATEGIES.POSTER_IMAGE,
  },
  
  performance: {
    collectMetrics: true,
    slowThreshold: SLOW_VIDEO_THRESHOLD,
  },
  
  logging: {
    enabled: true,
    level: process.env.NODE_ENV === 'development' ? 'debug' : 'error',
  },
} as const;

// === Environment Variables ===

export const ENV_VARS = {
  CLOUDINARY_CLOUD_NAME: 'NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME',
  VIDEO_MONITORING_ENABLED: 'NEXT_PUBLIC_ENABLE_VIDEO_MONITORING',
  VIDEO_RETRY_MAX_ATTEMPTS: 'NEXT_PUBLIC_VIDEO_RETRY_MAX_ATTEMPTS',
  VIDEO_RETRY_BASE_DELAY: 'NEXT_PUBLIC_VIDEO_RETRY_BASE_DELAY',
  VERCEL_URL: 'VERCEL_URL',
  VERCEL_ENV: 'VERCEL_ENV',
} as const;

// === Debug Labels ===

export const DEBUG_LABELS = {
  VIDEO_VALIDATOR: '[VideoValidator]',
  MAPPING_ANALYZER: '[MappingAnalyzer]',
  VIDEO_MONITOR: '[VideoMonitor]',
  PERFORMANCE_COLLECTOR: '[PerformanceCollector]',
  DIAGNOSTIC_SUITE: '[DiagnosticSuite]',
  ENHANCED_VIDEO: '[EnhancedVideo]',
  ERROR_HANDLER: '[ErrorHandler]',
} as const;