# Video Delivery Diagnostic System

A comprehensive diagnostic and monitoring system to investigate and fix video delivery issues on Vercel deployment for the DKM industrial machines Next.js application.

## Overview

This system addresses videos appearing briefly then disappearing, incorrect video-to-machine mapping, and inconsistent behavior between local development and Vercel production environments. The implementation follows a layered architecture approach with six core service categories.

## Architecture

```
lib/services/video/
├── types.ts              # Core TypeScript interfaces
├── interfaces.ts         # Service interface definitions  
├── constants.ts          # Configuration constants
├── errors.ts             # Error handling utilities
├── index.ts              # Main exports and utilities
├── README.md             # This documentation
├── validators/           # Video URL validation services
│   ├── VideoValidator.ts
│   └── index.ts
├── analyzers/            # Machine-video mapping analysis
│   ├── MappingAnalyzer.ts
│   └── index.ts
├── monitors/             # DOM presence and lifecycle monitoring
│   ├── VideoMonitor.ts
│   └── index.ts
├── metrics/              # Performance metrics collection
│   ├── PerformanceMetricsCollector.ts
│   └── index.ts
├── diagnostics/          # Comprehensive diagnostic testing
│   ├── DiagnosticTestSuite.ts
│   └── index.ts
└── config/               # Configuration validation
    ├── CloudinaryConfigChecker.ts
    ├── VercelConfigValidator.ts
    └── index.ts
```

## Service Categories

### 1. Validators (`./validators/`)
- **VideoValidator**: Validates Cloudinary URL patterns and HTTP accessibility
- Checks all 17 machine video URLs for proper format and response codes
- Generates comprehensive validation reports

### 2. Analyzers (`./analyzers/`)
- **MappingAnalyzer**: Analyzes machine-to-video mapping uniqueness
- Detects duplicate video URLs and filename mismatches
- Verifies each machine has distinct video content

### 3. Monitors (`./monitors/`)  
- **VideoMonitor**: Monitors video DOM presence and lifecycle events
- Uses MutationObserver to track element disappearance
- Logs network requests and video element state changes

### 4. Metrics (`./metrics/`)
- **PerformanceMetricsCollector**: Collects video loading performance data
- Measures load times, transfer sizes, and buffering events
- Compares performance between local and Vercel environments

### 5. Diagnostics (`./diagnostics/`)
- **DiagnosticTestSuite**: Comprehensive diagnostic testing framework  
- Tests all videos sequentially with detailed error reporting
- Exports results and compares environment differences

### 6. Config (`./config/`)
- **CloudinaryConfigChecker**: Validates Cloudinary account settings
- **VercelConfigValidator**: Checks Next.js and Vercel configuration
- Identifies configuration issues that may cause delivery failures

## Usage

### Basic Import
```typescript
import { 
  VideoValidator,
  MappingAnalyzer,
  VideoMonitor,
  DiagnosticTestSuite
} from '@/lib/services/video';
```

### Environment Detection
```typescript
import { isVercelEnvironment, getCurrentEnvironment } from '@/lib/services/video';

if (isVercelEnvironment()) {
  // Enable monitoring on Vercel
}
```

### Error Handling
```typescript
import { createVideoError, formatErrorForLogging } from '@/lib/services/video';

const error = createVideoError(errorEvent, machineId, machineName, videoUrl);
console.error(formatErrorForLogging(error));
```

## Key Features

### Comprehensive Video Validation
- URL pattern validation against Cloudinary schema
- HTTP accessibility checks with detailed status reporting
- Batch processing of all 17 machine videos

### Real-time Monitoring
- DOM presence monitoring with MutationObserver
- Video lifecycle event tracking
- Network request monitoring via Performance API

### Performance Analysis
- Load time measurement and comparison
- Transfer size tracking
- Buffering event detection
- Environment-specific performance reports

### Diagnostic Testing
- Sequential video loading tests
- Export diagnostic reports as JSON
- Local vs Vercel comparison analysis
- Environment metadata collection

### Configuration Validation
- Cloudinary account settings verification
- Next.js remotePatterns validation
- CSP header analysis
- Vercel deployment configuration checks

## Error Categories

The system categorizes errors into five types:

1. **NETWORK**: HTTP errors, connectivity issues
2. **DECODE**: Video format/codec incompatibility  
3. **UNSUPPORTED**: Browser compatibility issues
4. **ABORTED**: User or system-initiated cancellation
5. **UNKNOWN**: Unclassified errors

## Environment Support

- **Local Development**: Full monitoring and diagnostics
- **Vercel Production**: Optimized monitoring with performance focus
- **Staging**: Complete diagnostic suite for testing

## Implementation Status

**Phase 1 Complete**: Project structure and core interfaces
- ✅ TypeScript interfaces and types
- ✅ Error handling framework
- ✅ Constants and configuration
- ✅ Service architecture setup

**Phase 2-6 Pending**: Service implementations per tasks.md schedule

## Root Cause Focus

Based on symptoms (videos appearing then disappearing, working locally but failing on Vercel), the most likely root causes are:

1. **Cloudinary account restrictions** - bandwidth quota exceeded
2. **Authentication configuration** - unsigned access limitations  
3. **Network timing issues** - request timeouts in Vercel environment
4. **React hydration mismatches** - SSR/CSR video element inconsistencies

The diagnostic system prioritizes investigation of these areas first.

## Testing Strategy

The system uses integration tests and end-to-end testing rather than property-based testing, as this is primarily an infrastructure diagnostic tool. Manual validation procedures are provided for Cloudinary Dashboard and Vercel configuration verification.

## Contributing

When implementing services:

1. Follow the interface contracts defined in `interfaces.ts`
2. Use consistent error handling with the types in `errors.ts`
3. Leverage constants from `constants.ts` for configuration
4. Add comprehensive logging with appropriate debug labels
5. Ensure services are environment-aware (local vs Vercel)

## Next Steps

Implement services in task order:
1. VideoValidator (Task 2)
2. MappingAnalyzer (Task 3) 
3. VideoMonitor (Task 5)
4. PerformanceMetricsCollector (Task 6)
5. DiagnosticTestSuite (Task 9)
6. Configuration validators (Tasks 11-12)