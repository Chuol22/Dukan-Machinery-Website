// DiagnosticTestSuite.ts — Service for comprehensive video diagnostic testing
// Implements IDiagnosticTestSuite for running diagnostics on all 17 machine videos

import { IDiagnosticTestSuite } from '../interfaces';
import type {
  TestVideoStatus,
  DiagnosticReport,
  ComparisonResult,
} from '../types';
import { VIDEO_LOAD_TIMEOUT, DEBUG_LABELS } from '../constants';
import { machinesData } from '@/data/machinesData';

export class DiagnosticTestSuite implements IDiagnosticTestSuite {
  // ===================================================================
  // Environment Detection
  // ===================================================================

  /**
   * Checks if running in Vercel environment.
   * Detects via hostname pattern, NEXT_PUBLIC_VERCEL_URL, or VERCEL env var.
   */
  isVercelEnvironment(): boolean {
    const hostnameBased =
      typeof window !== 'undefined' &&
      (window.location.hostname.includes('vercel.app') ||
        Boolean(process.env.NEXT_PUBLIC_VERCEL_URL));

    const envBased = process.env.VERCEL === '1';

    return hostnameBased || envBased;
  }

  /**
   * Gets environment metadata for diagnostic context.
   */
  getEnvironmentInfo(): {
    userAgent: string;
    deploymentUrl: string;
    buildId: string;
    environment: 'local' | 'vercel';
  } {
    const userAgent =
      typeof navigator !== 'undefined' ? navigator.userAgent : 'server';

    const deploymentUrl =
      typeof window !== 'undefined'
        ? window.location.href
        : process.env.VERCEL_URL ?? 'unknown';

    const buildId =
      process.env.NEXT_PUBLIC_BUILD_ID ??
      process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ??
      'dev';

    const environment = this.isVercelEnvironment() ? 'vercel' : 'local';

    return { userAgent, deploymentUrl, buildId, environment };
  }

  // ===================================================================
  // Single Video Testing
  // ===================================================================

  /**
   * Tests a single video by machine ID.
   * Creates a temporary <video> element, monitors load/error events, and
   * resolves with a TestVideoStatus after success or timeout (15 s).
   */
  testSingleVideo(machineId: number): Promise<TestVideoStatus> {
    const machine = machinesData.find((m) => m.id === machineId);

    if (!machine) {
      return Promise.resolve({
        machineId,
        machineName: `Unknown machine ${machineId}`,
        videoUrl: '',
        status: 'error',
        error: {
          code: 0,
          message: `Machine with id ${machineId} not found in machinesData`,
        },
      });
    }

    const videoUrl = machine.image;
    const machineName = machine.name;

    // SSR guard — cannot create DOM elements on the server
    if (typeof document === 'undefined') {
      return Promise.resolve({
        machineId,
        machineName,
        videoUrl,
        status: 'error',
        error: {
          code: 0,
          message: 'Cannot test video in SSR context (no document)',
        },
      });
    }

    return new Promise<TestVideoStatus>((resolve) => {
      const startTime = Date.now();
      const video = document.createElement('video');

      video.src = videoUrl;
      video.crossOrigin = 'anonymous';
      video.preload = 'metadata';

      let settled = false;

      const settle = (status: TestVideoStatus) => {
        if (settled) return;
        settled = true;
        clearTimeout(timeoutId);
        // Clean up the element
        video.src = '';
        video.load();
        resolve(status);
      };

      // Success: metadata (or data) received
      const onLoadedData = () => {
        settle({
          machineId,
          machineName,
          videoUrl,
          status: 'loaded',
          loadTime: Date.now() - startTime,
        });
      };

      // Also accept loadedmetadata as a lighter-weight "loaded" signal
      const onLoadedMetadata = () => {
        settle({
          machineId,
          machineName,
          videoUrl,
          status: 'loaded',
          loadTime: Date.now() - startTime,
        });
      };

      // Error event
      const onError = () => {
        const mediaError = (video as HTMLVideoElement).error;
        const code = mediaError?.code ?? 0;
        const message =
          mediaError?.message ??
          `Video error for machine ${machineId} (${machineName})`;

        console.error(
          `${DEBUG_LABELS.DIAGNOSTIC_SUITE} Error loading video for machine ${machineId} (${machineName}):`,
          { code, message, videoUrl }
        );

        settle({
          machineId,
          machineName,
          videoUrl,
          status: 'error',
          error: { code, message },
        });
      };

      video.addEventListener('loadeddata', onLoadedData);
      video.addEventListener('loadedmetadata', onLoadedMetadata);
      video.addEventListener('error', onError);

      // Timeout after VIDEO_LOAD_TIMEOUT (15 s)
      const timeoutId = setTimeout(() => {
        console.warn(
          `${DEBUG_LABELS.DIAGNOSTIC_SUITE} Timeout loading video for machine ${machineId} (${machineName}) after ${VIDEO_LOAD_TIMEOUT}ms`
        );
        settle({
          machineId,
          machineName,
          videoUrl,
          status: 'error',
          error: {
            code: 0,
            message: `Video load timed out after ${VIDEO_LOAD_TIMEOUT}ms`,
          },
        });
      }, VIDEO_LOAD_TIMEOUT);

      // Kick off loading (the element is not attached to the document,
      // but src assignment triggers a network request)
      video.load();
    });
  }

  // ===================================================================
  // Full Diagnostic Run
  // ===================================================================

  /**
   * Runs comprehensive diagnostics on all 17 machine videos sequentially.
   * In an SSR context returns a report noting the environment limitation.
   */
  async runDiagnostics(): Promise<DiagnosticReport> {
    const envInfo = this.getEnvironmentInfo();
    const timestamp = Date.now();

    // SSR / server context — cannot test videos without a browser
    if (typeof document === 'undefined') {
      const ssrStatuses: TestVideoStatus[] = machinesData.map((machine) => ({
        machineId: machine.id,
        machineName: machine.name,
        videoUrl: machine.image,
        status: 'error' as const,
        error: {
          code: 0,
          message: 'Diagnostics not available in SSR environment',
        },
      }));

      return {
        timestamp,
        environment: {
          userAgent: envInfo.userAgent,
          deploymentUrl: envInfo.deploymentUrl,
          buildId: envInfo.buildId,
        },
        videoStatuses: ssrStatuses,
        summary: {
          total: ssrStatuses.length,
          loaded: 0,
          failed: ssrStatuses.length,
          loading: 0,
        },
        networkRequests: [],
      };
    }

    // Browser context — test each machine sequentially
    console.info(
      `${DEBUG_LABELS.DIAGNOSTIC_SUITE} Starting diagnostics for ${machinesData.length} machines in ${envInfo.environment} environment`
    );

    const videoStatuses: TestVideoStatus[] = [];

    for (const machine of machinesData) {
      console.info(
        `${DEBUG_LABELS.DIAGNOSTIC_SUITE} Testing machine ${machine.id}: ${machine.name}`
      );
      const status = await this.testSingleVideo(machine.id);
      videoStatuses.push(status);
    }

    const loaded = videoStatuses.filter((s) => s.status === 'loaded').length;
    const failed = videoStatuses.filter((s) => s.status === 'error').length;
    const loading = videoStatuses.filter((s) => s.status === 'loading').length;

    const report: DiagnosticReport = {
      timestamp,
      environment: {
        userAgent: envInfo.userAgent,
        deploymentUrl: envInfo.deploymentUrl,
        buildId: envInfo.buildId,
      },
      videoStatuses,
      summary: {
        total: videoStatuses.length,
        loaded,
        failed,
        loading,
      },
      networkRequests: [],
    };

    console.info(
      `${DEBUG_LABELS.DIAGNOSTIC_SUITE} Diagnostics complete — loaded: ${loaded}, failed: ${failed}, total: ${videoStatuses.length}`
    );

    return report;
  }

  // ===================================================================
  // Report Export
  // ===================================================================

  /**
   * Exports the diagnostic report as a downloadable JSON file.
   * In SSR context logs to console instead.
   */
  exportReport(report: DiagnosticReport): void {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      // SSR fallback: log to console
      console.log(
        `${DEBUG_LABELS.DIAGNOSTIC_SUITE} Diagnostic report (SSR export):`,
        JSON.stringify(report, null, 2)
      );
      return;
    }

    const json = JSON.stringify(report, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `diagnostic-report-${report.timestamp}.json`;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);

    console.info(
      `${DEBUG_LABELS.DIAGNOSTIC_SUITE} Diagnostic report exported (${report.videoStatuses.length} videos, timestamp: ${report.timestamp})`
    );
  }

  // ===================================================================
  // Environment Comparison
  // ===================================================================

  /**
   * Compares two diagnostic reports (local vs Vercel) and builds a
   * ComparisonResult with per-machine differences and high-level insights.
   */
  compareEnvironments(
    local: DiagnosticReport,
    vercel: DiagnosticReport
  ): ComparisonResult {
    const differences: ComparisonResult['differences'] = [];

    // Build a lookup map from the local report keyed by machineId
    const localStatusMap = new Map<number, TestVideoStatus>(
      local.videoStatuses.map((s) => [s.machineId, s])
    );

    for (const vercelStatus of vercel.videoStatuses) {
      const localStatus = localStatusMap.get(vercelStatus.machineId);

      if (!localStatus) {
        // Machine present in vercel report but not in local report
        differences.push({
          machineId: vercelStatus.machineId,
          localStatus: 'unknown',
          vercelStatus: vercelStatus.status,
        });
        continue;
      }

      if (localStatus.status !== vercelStatus.status) {
        const diff: ComparisonResult['differences'][number] = {
          machineId: vercelStatus.machineId,
          localStatus: localStatus.status,
          vercelStatus: vercelStatus.status,
        };

        // Include numeric code difference when both have error codes
        if (localStatus.error?.code != null && vercelStatus.error?.code != null) {
          diff.statusDiff = vercelStatus.error.code - localStatus.error.code;
        }

        differences.push(diff);
      }
    }

    // Check for machines in local that are absent from vercel
    const vercelMachineIds = new Set(vercel.videoStatuses.map((s) => s.machineId));
    for (const localStatus of local.videoStatuses) {
      if (!vercelMachineIds.has(localStatus.machineId)) {
        differences.push({
          machineId: localStatus.machineId,
          localStatus: localStatus.status,
          vercelStatus: 'unknown',
        });
      }
    }

    // Generate insights
    const insights: string[] = [];

    const localErrors = local.videoStatuses.filter((s) => s.status === 'error').length;
    const vercelErrors = vercel.videoStatuses.filter((s) => s.status === 'error').length;

    if (vercelErrors > localErrors) {
      insights.push(
        `Vercel-specific delivery issues: ${vercelErrors} video(s) failed on Vercel vs ${localErrors} locally`
      );
    }

    if (differences.length === 0) {
      insights.push('No differences detected between local and Vercel environments');
    } else {
      insights.push(
        `${differences.length} machine(s) have different video status between local and Vercel`
      );
    }

    const vercelLoaded = vercel.videoStatuses.filter((s) => s.status === 'loaded').length;
    const localLoaded = local.videoStatuses.filter((s) => s.status === 'loaded').length;

    if (vercelLoaded < localLoaded) {
      insights.push(
        `Vercel loads ${localLoaded - vercelLoaded} fewer video(s) successfully than local environment`
      );
    }

    return {
      differences,
      insights,
      localReport: local,
      vercelReport: vercel,
    };
  }
}
