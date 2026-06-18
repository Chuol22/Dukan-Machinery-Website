// PerformanceMetricsCollector.ts — Service for collecting video performance metrics

import type { IPerformanceMetricsCollector } from '../interfaces';
import type { VideoPerformanceMetrics, PerformanceReport } from '../types';
import { SLOW_VIDEO_THRESHOLD, DEBUG_LABELS } from '../constants';
import { isVercelEnvironment } from '../index';

/**
 * PerformanceMetricsCollector collects and reports video loading performance metrics.
 *
 * SSR-safe: all Performance API calls are guarded with `typeof performance !== 'undefined'`.
 */
export class PerformanceMetricsCollector implements IPerformanceMetricsCollector {
  // Partial metrics keyed by machineId, accumulated from multiple calls
  private metricsMap: Map<number, Partial<VideoPerformanceMetrics>> = new Map();

  // Buffering event counters keyed by machineId
  private bufferingCounts: Map<number, number> = new Map();

  // Timestamps (performance.now()) when measureLoadTime was called, keyed by machineId
  private loadStartTimes: Map<number, number> = new Map();

  // Cleanup functions (remove event listeners), keyed by machineId
  private cleanupFns: Map<number, () => void> = new Map();

  // ─── Task 6.1: Core service methods ───────────────────────────────────────

  /**
   * Measures time from element creation to loadeddata event.
   * Attaches a one-time `loadeddata` listener and records the elapsed time.
   *
   * Requirements: 9.1, 9.6
   */
  measureLoadTime(videoElement: HTMLVideoElement, machineId: number): void {
    // SSR guard
    if (typeof performance === 'undefined') return;

    const startTime = performance.now();
    this.loadStartTimes.set(machineId, startTime);

    // Initialise entry if not present
    if (!this.metricsMap.has(machineId)) {
      this.metricsMap.set(machineId, { machineId });
    }

    const onLoadedData = () => {
      const timeToLoadedData = performance.now() - startTime;
      const existing = this.metricsMap.get(machineId) ?? { machineId };
      this.metricsMap.set(machineId, {
        ...existing,
        machineId,
        timeToLoadedData,
        // timeToFirstFrame is set equal to timeToLoadedData as a reasonable proxy
        // when a dedicated first-frame timestamp isn't available
        timeToFirstFrame: existing.timeToFirstFrame ?? timeToLoadedData,
        environment: isVercelEnvironment() ? 'vercel' : 'local',
      });

      // Cleanup own listener
      videoElement.removeEventListener('loadeddata', onLoadedData);

      // Remove from cleanupFns map once triggered
      const existing2 = this.cleanupFns.get(machineId);
      if (existing2) {
        this.cleanupFns.delete(machineId);
      }
    };

    videoElement.addEventListener('loadeddata', onLoadedData);

    // Store cleanup so callers can cancel if needed
    const prevCleanup = this.cleanupFns.get(machineId);
    if (prevCleanup) prevCleanup(); // remove any stale listener

    this.cleanupFns.set(machineId, () => {
      videoElement.removeEventListener('loadeddata', onLoadedData);
    });
  }

  /**
   * Tracks buffering events during video playback.
   * Increments a counter on `waiting` and `stalled` events.
   *
   * Requirements: 9.6
   */
  trackBuffering(videoElement: HTMLVideoElement, machineId: number): void {
    // SSR guard
    if (typeof performance === 'undefined') return;

    if (!this.bufferingCounts.has(machineId)) {
      this.bufferingCounts.set(machineId, 0);
    }

    const onBuffer = () => {
      const count = (this.bufferingCounts.get(machineId) ?? 0) + 1;
      this.bufferingCounts.set(machineId, count);

      const existing = this.metricsMap.get(machineId) ?? { machineId };
      this.metricsMap.set(machineId, {
        ...existing,
        machineId,
        bufferingEvents: count,
      });
    };

    videoElement.addEventListener('waiting', onBuffer);
    videoElement.addEventListener('stalled', onBuffer);

    // Extend cleanup to also remove buffering listeners
    const prevCleanup = this.cleanupFns.get(machineId);
    this.cleanupFns.set(machineId, () => {
      if (prevCleanup) prevCleanup();
      videoElement.removeEventListener('waiting', onBuffer);
      videoElement.removeEventListener('stalled', onBuffer);
    });
  }

  /**
   * Gets the network transfer size for a URL from the Performance Resource Timing API.
   * Returns 0 when running in SSR or when the entry is not found.
   *
   * Requirements: 9.7
   */
  getTransferSize(url: string): number {
    // SSR guard
    if (typeof performance === 'undefined') return 0;

    const entries = performance.getEntriesByName(url, 'resource');
    if (!entries.length) return 0;

    const entry = entries[entries.length - 1] as PerformanceResourceTiming;
    return entry.transferSize ?? 0;
  }

  // ─── Task 6.2: Report generator methods ───────────────────────────────────

  /**
   * Compiles all collected metrics into a PerformanceReport with summary statistics.
   * Flags videos whose load time exceeds SLOW_VIDEO_THRESHOLD (10 s).
   *
   * Requirements: 9.2, 9.3, 9.4, 9.5
   */
  generatePerformanceReport(): PerformanceReport {
    const environment: 'local' | 'vercel' = isVercelEnvironment() ? 'vercel' : 'local';

    // Build full VideoPerformanceMetrics objects from accumulated partials
    const metrics: VideoPerformanceMetrics[] = Array.from(this.metricsMap.values()).map(
      (partial) => ({
        machineId: partial.machineId ?? 0,
        machineName: partial.machineName ?? `Machine ${partial.machineId ?? 0}`,
        timeToLoadedData: partial.timeToLoadedData ?? 0,
        timeToFirstFrame: partial.timeToFirstFrame ?? 0,
        transferSize: partial.transferSize ?? this.getTransferSizeForMachine(partial.machineId ?? 0),
        bufferingEvents: this.bufferingCounts.get(partial.machineId ?? 0) ?? partial.bufferingEvents ?? 0,
        environment: partial.environment ?? environment,
      })
    );

    // Summary calculations
    const loadTimes = metrics.map((m) => m.timeToLoadedData).filter((t) => t > 0);

    const avgLoadTime = loadTimes.length
      ? loadTimes.reduce((sum, t) => sum + t, 0) / loadTimes.length
      : 0;

    const minLoadTime = loadTimes.length ? Math.min(...loadTimes) : 0;
    const maxLoadTime = loadTimes.length ? Math.max(...loadTimes) : 0;

    const totalTransferSize = metrics.reduce((sum, m) => sum + m.transferSize, 0);

    const slowVideos = metrics.filter((m) => m.timeToLoadedData > SLOW_VIDEO_THRESHOLD);

    if (slowVideos.length > 0) {
      console.warn(
        `${DEBUG_LABELS.PERFORMANCE_COLLECTOR} ${slowVideos.length} slow video(s) detected (>${SLOW_VIDEO_THRESHOLD}ms):`,
        slowVideos.map((m) => `${m.machineName} (${Math.round(m.timeToLoadedData)}ms)`)
      );
    }

    return {
      metrics,
      summary: {
        avgLoadTime,
        minLoadTime,
        maxLoadTime,
        slowVideos,
        totalTransferSize,
      },
      environment,
      timestamp: Date.now(),
    };
  }

  /**
   * Compares video load performance between local and Vercel environments.
   * Matches metrics by machineId and reports significant differences (>2x ratio).
   *
   * Requirements: 9.5
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
  } {
    // Build lookup maps keyed by machineId
    const localMap = new Map(localMetrics.map((m) => [m.machineId, m]));
    const vercelMap = new Map(vercelMetrics.map((m) => [m.machineId, m]));

    // Calculate per-machine differences for machines present in both sets
    const significantDifferences: Array<{
      machineId: number;
      localTime: number;
      vercelTime: number;
      diff: number;
    }> = [];

    for (const [machineId, vercelEntry] of vercelMap) {
      const localEntry = localMap.get(machineId);
      if (!localEntry) continue;

      const localTime = localEntry.timeToLoadedData;
      const vercelTime = vercelEntry.timeToLoadedData;
      const diff = vercelTime - localTime;

      // Flag when Vercel is more than 2x slower than local
      const ratio = localTime > 0 ? vercelTime / localTime : Infinity;
      if (ratio > 2) {
        significantDifferences.push({ machineId, localTime, vercelTime, diff });
      }
    }

    // Average load time difference (across all matched machines)
    const matchedMachineIds = [...vercelMap.keys()].filter((id) => localMap.has(id));

    const avgLoadTimeDiff =
      matchedMachineIds.length > 0
        ? matchedMachineIds.reduce((sum, id) => {
            const local = localMap.get(id)!.timeToLoadedData;
            const vercel = vercelMap.get(id)!.timeToLoadedData;
            return sum + (vercel - local);
          }, 0) / matchedMachineIds.length
        : 0;

    return { avgLoadTimeDiff, significantDifferences };
  }

  /**
   * Clears all collected metrics and internal state.
   */
  clearMetrics(): void {
    // Run all pending cleanup functions to remove event listeners
    for (const cleanup of this.cleanupFns.values()) {
      try {
        cleanup();
      } catch {
        // Ignore errors during cleanup (element may be removed from DOM)
      }
    }

    this.metricsMap.clear();
    this.bufferingCounts.clear();
    this.loadStartTimes.clear();
    this.cleanupFns.clear();
  }

  // ─── Private helpers ───────────────────────────────────────────────────────

  /**
   * Attempts to look up the transfer size for a machine from any cached URL stored
   * in the metrics map.  Falls back to 0 if not available.
   */
  private getTransferSizeForMachine(machineId: number): number {
    // No URL is stored on the partial metrics at this point; return 0.
    // Callers who know the URL should call getTransferSize(url) directly.
    return 0;
  }
}
