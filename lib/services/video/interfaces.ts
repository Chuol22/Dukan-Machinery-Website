// interfaces.ts — Service interface definitions for video delivery diagnostic system

import type { ReactElement } from 'react';
import { Machine } from '@/data/machinesData';
import {
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
} from './types';

// === Video Validator Service Interface ===

export interface IVideoValidator {
  /**
   * Validates URL pattern against Cloudinary schema
   */
  validateUrlPattern(url: string): boolean;
  
  /**
   * Performs HTTP HEAD request to check accessibility
   * Returns status code and headers for analysis
   */
  checkHttpAccessibility(url: string): Promise<{
    status: number;
    headers: Record<string, string>;
    error?: string;
  }>;
  
  /**
   * Validates all machine video URLs with detailed reporting
   */
  validateAllVideos(machines: Machine[]): Promise<VideoValidationResult[]>;
  
  /**
   * Generates comprehensive validation report
   */
  generateReport(results: VideoValidationResult[]): ValidationReport;
}

// === Mapping Analyzer Service Interface ===

export interface IMappingAnalyzer {
  /**
   * Analyzes machine-to-video mappings for uniqueness and correctness
   */
  analyzeMappings(machines: Machine[]): MappingAnalysisResult;
  
  /**
   * Extracts video filename from Cloudinary URL for verification
   */
  extractVideoFilename(url: string): string;
  
  /**
   * Checks if filename matches machine slug naming convention
   */
  validateFilenameMatch(slug: string, filename: string): boolean;
  
  /**
   * Generates mapping analysis report with duplicates and mismatches
   */
  generateMappingReport(machines: Machine[]): MappingAnalysisResult;
}

// === Video Monitor Service Interface ===

export interface IVideoMonitor {
  /**
   * Starts monitoring video DOM presence over time
   * Uses MutationObserver to track element lifecycle
   */
  startDomMonitoring(videoElement: HTMLVideoElement, machineId: number): void;
  
  /**
   * Stops monitoring for a specific video and cleans up resources
   */
  stopDomMonitoring(machineId: number): void;
  
  /**
   * Tracks network requests for video loading using Performance API
   */
  trackNetworkRequest(url: string, machineId: number): void;
  
  /**
   * Gets complete monitoring history for analysis
   */
  getMonitoringHistory(): VideoLifecycleEvent[];
  
  /**
   * Gets DOM presence records for disappearance analysis
   */
  getDomPresenceRecords(): DomPresenceRecord[];
  
  /**
   * Gets network request tracking data
   */
  getNetworkRequests(): NetworkRequest[];
  
  /**
   * Clears all monitoring data and stops active monitors
   */
  clearAll(): void;
}

// === Performance Metrics Collector Interface ===

export interface IPerformanceMetricsCollector {
  /**
   * Measures time from element creation to loadeddata event
   */
  measureLoadTime(videoElement: HTMLVideoElement, machineId: number): void;
  
  /**
   * Tracks buffering events during video playback
   */
  trackBuffering(videoElement: HTMLVideoElement, machineId: number): void;
  
  /**
   * Gets network transfer size from Performance API Resource Timing
   */
  getTransferSize(url: string): number;
  
  /**
   * Generates comprehensive performance report with statistics
   */
  generatePerformanceReport(): PerformanceReport;
  
  /**
   * Compares performance between local and Vercel environments
   */
  compareEnvironmentPerformance(
    localMetrics: VideoPerformanceMetrics[],
    vercelMetrics: VideoPerformanceMetrics[]
  ): {
    avgLoadTimeDiff: number;
    significantDifferences: Array<{
      machineId: number;
      localTime: number;
      vercelTime: number;
      diff: number;
    }>;
  };
  
  /**
   * Clears all collected metrics
   */
  clearMetrics(): void;
}

// === Diagnostic Test Suite Interface ===

export interface IDiagnosticTestSuite {
  /**
   * Runs comprehensive diagnostics on all videos sequentially
   */
  runDiagnostics(): Promise<DiagnosticReport>;
  
  /**
   * Tests individual video with detailed error logging
   */
  testSingleVideo(machineId: number): Promise<TestVideoStatus>;
  
  /**
   * Exports diagnostic report as downloadable JSON
   */
  exportReport(report: DiagnosticReport): void;
  
  /**
   * Compares diagnostic reports from different environments
   */
  compareEnvironments(
    localReport: DiagnosticReport,
    vercelReport: DiagnosticReport
  ): ComparisonResult;
  
  /**
   * Gets environment metadata for diagnostic context
   */
  getEnvironmentInfo(): {
    userAgent: string;
    deploymentUrl: string;
    buildId: string;
    environment: 'local' | 'vercel';
  };
  
  /**
   * Checks if running in Vercel environment
   */
  isVercelEnvironment(): boolean;
}

// === Cloudinary Configuration Checker Interface ===

export interface ICloudinaryConfigChecker {
  /**
   * Generates manual investigation checklist for Cloudinary Dashboard
   */
  getInvestigationSteps(): string[];
  
  /**
   * Tests unsigned public access to video resources
   */
  testPublicAccess(videoUrl: string): Promise<boolean>;
  
  /**
   * Tests video delivery with transformation parameters
   */
  testWithTransformations(videoUrl: string): Promise<{
    success: boolean;
    transformedUrl: string;
    originalUrl: string;
    error?: string;
  }>;
  
  /**
   * Provides configuration recommendations based on detected issues
   */
  getRecommendations(check: CloudinaryConfigCheck): string[];
  
  /**
   * Performs automated checks where possible
   */
  performAutomatedChecks(videoUrls: string[]): Promise<CloudinaryConfigCheck>;
  
  /**
   * Generates investigation report with manual steps
   */
  generateInvestigationGuide(): {
    steps: string[];
    automatedChecks: string[];
    manualChecks: string[];
  };
}

// === Vercel Configuration Validator Interface ===

export interface IVercelConfigValidator {
  /**
   * Validates Next.js config for Cloudinary domain configuration
   */
  validateNextConfig(): boolean;
  
  /**
   * Provides specific Next.js configuration validation for video delivery
   */
  validateNextJSConfigForVideos(): {
    isValid: boolean;
    checks: Array<{
      name: string;
      passed: boolean;
      description: string;
      recommendation?: string;
    }>;
    overallRecommendations: string[];
  };
  
  /**
   * Checks for CSP headers that might block video loading
   */
  checkContentSecurityPolicy(): Promise<string[] | null>;
  
  /**
   * Gets deployment metadata from Vercel environment
   */
  getDeploymentInfo(): {
    region: string;
    buildId: string;
    url: string;
  };
  
  /**
   * Generates comprehensive validation report
   */
  validateConfiguration(): VercelConfigValidation;
  
  /**
   * Checks if remote patterns include Cloudinary domain
   */
  checkRemotePatterns(): boolean;
  
  /**
   * Validates Edge Config or middleware interference
   */
  checkEdgeConfig(): boolean;

  /**
   * Provides Next.js configuration recommendations specific to video delivery
   */
  getNextConfigRecommendations(): string[];

  /**
   * Validates build output and webpack configuration for video support
   */
  validateBuildOutputForVideos(): {
    webpackSupportsVideos: boolean;
    staticAssetsConfigured: boolean;
    videoMimeTypesSupported: boolean;
    issues: string[];
  };
}

// === Enhanced Video Component Interface ===

export interface IEnhancedVideoComponent {
  /**
   * Renders video with comprehensive error handling
   */
  render(): ReactElement;
  
  /**
   * Implements exponential backoff retry logic for failed loads
   */
  retryLoad(attemptNumber: number): Promise<void>;
  
  /**
   * Falls back to poster image when video fails to load
   */
  fallbackToPoster(): void;
  
  /**
   * Logs detailed error information for debugging
   */
  logError(error: VideoError): void;
  
  /**
   * Handles video lifecycle events
   */
  handleLifecycleEvent(event: Event): void;
  
  /**
   * Starts monitoring if enabled
   */
  startMonitoring(): void;
  
  /**
   * Stops monitoring and cleans up resources
   */
  stopMonitoring(): void;
}

// === Video Error Handler Interface ===

export interface IVideoErrorHandler {
  /**
   * Handles video errors with appropriate retry or fallback strategy
   */
  handleError(error: VideoError): void;
  
  /**
   * Categorizes error type for appropriate handling
   */
  categorizeError(error: VideoError): 'NETWORK' | 'DECODE' | 'UNSUPPORTED' | 'ABORTED' | 'UNKNOWN';
  
  /**
   * Determines if error should trigger retry attempt
   */
  shouldRetry(category: string, machineId: number): boolean;
  
  /**
   * Schedules retry with exponential backoff
   */
  scheduleRetry(error: VideoError): void;
  
  /**
   * Implements fallback to poster image
   */
  fallbackToPoster(machineId: number): void;
  
  /**
   * Reports error to diagnostic system
   */
  reportToDiagnostics(error: VideoError, category: string): void;
  
  /**
   * Resets retry attempts for a machine
   */
  resetRetryAttempts(machineId: number): void;
  
  /**
   * Gets error statistics
   */
  getErrorStats(): {
    totalErrors: number;
    errorsByCategory: Record<string, number>;
    errorsByMachine: Record<number, number>;
  };
}