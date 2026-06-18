// VideoMonitor.ts — Service for monitoring video DOM presence and lifecycle

import {
  IVideoMonitor,
} from '../interfaces';
import type {
  VideoLifecycleEvent,
  DomPresenceRecord,
  NetworkRequest,
} from '../types';
import {
  DEFAULT_DOM_CHECK_INTERVAL,
  DEFAULT_MONITORING_DURATION,
  MONITORING_CONFIG,
  DEBUG_LABELS,
} from '../constants';

// Union of all video event types tracked for lifecycle monitoring
type VideoEventType = typeof MONITORING_CONFIG.VIDEO_EVENT_TYPES[number];

interface ActiveMonitor {
  intervalId: ReturnType<typeof setInterval>;
  observer: MutationObserver;
  startTime: number;
}

export class VideoMonitor implements IVideoMonitor {
  private activeMonitors: Map<number, ActiveMonitor> = new Map();
  private lifecycleEvents: VideoLifecycleEvent[] = [];
  private domPresenceRecords: DomPresenceRecord[] = [];
  private networkRequests: Map<string, NetworkRequest> = new Map();

  /**
   * Starts monitoring video DOM presence over time.
   * Uses setInterval (500ms) for 30 seconds and MutationObserver as secondary detection.
   */
  startDomMonitoring(videoElement: HTMLVideoElement, machineId: number): void {
    // SSR guard
    if (typeof window === 'undefined') return;

    // Stop any existing monitor for this machine
    this.stopDomMonitoring(machineId);

    const startTime = Date.now();
    let wasPresent = document.contains(videoElement);

    // --- Interval-based polling ---
    const intervalId = setInterval(() => {
      const elapsed = Date.now() - startTime;

      // Stop after DEFAULT_MONITORING_DURATION (30s)
      if (elapsed >= DEFAULT_MONITORING_DURATION) {
        this.stopDomMonitoring(machineId);
        return;
      }

      const isPresent = document.contains(videoElement);

      // Record every check
      const record: DomPresenceRecord = {
        machineId,
        checkTimestamp: Date.now(),
        isPresent,
        consoleErrors: [],
      };
      this.domPresenceRecords.push(record);

      // Log a 'disappeared' lifecycle event when element leaves the DOM
      if (wasPresent && !isPresent) {
        const event: VideoLifecycleEvent = {
          machineId,
          machineName: videoElement.getAttribute('data-machine-name') || '',
          timestamp: Date.now(),
          eventType: 'disappeared',
        };
        this.lifecycleEvents.push(event);
        console.warn(
          `${DEBUG_LABELS.VIDEO_MONITOR} Machine ${machineId} video element disappeared from DOM`
        );
      }

      wasPresent = isPresent;
    }, DEFAULT_DOM_CHECK_INTERVAL);

    // --- MutationObserver as secondary detection ---
    const observerTarget = videoElement.parentElement ?? document.body;
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === 'childList') {
          for (const removed of Array.from(mutation.removedNodes)) {
            if (removed === videoElement || (removed instanceof Element && removed.contains(videoElement))) {
              const isStillPresent = document.contains(videoElement);
              if (!isStillPresent) {
                const record: DomPresenceRecord = {
                  machineId,
                  checkTimestamp: Date.now(),
                  isPresent: false,
                  consoleErrors: [],
                };
                this.domPresenceRecords.push(record);

                // Only log if we haven't already logged a 'disappeared' event very recently
                const recentDisappeared = this.lifecycleEvents
                  .filter(
                    (e) =>
                      e.machineId === machineId &&
                      e.eventType === 'disappeared' &&
                      Date.now() - e.timestamp < DEFAULT_DOM_CHECK_INTERVAL
                  );
                if (recentDisappeared.length === 0) {
                  const event: VideoLifecycleEvent = {
                    machineId,
                    machineName: videoElement.getAttribute('data-machine-name') || '',
                    timestamp: Date.now(),
                    eventType: 'disappeared',
                  };
                  this.lifecycleEvents.push(event);
                  console.warn(
                    `${DEBUG_LABELS.VIDEO_MONITOR} Machine ${machineId} video element removed (MutationObserver)`
                  );
                }
              }
            }
          }
        }
      }
    });

    observer.observe(observerTarget, {
      ...MONITORING_CONFIG.DOM_OBSERVER_OPTIONS,
      // Cast attributeFilter to mutable string[] for MutationObserverInit
      attributeFilter: [...MONITORING_CONFIG.DOM_OBSERVER_OPTIONS.attributeFilter],
    });

    this.activeMonitors.set(machineId, { intervalId, observer, startTime });
  }

  /**
   * Stops monitoring for a specific video and cleans up resources.
   */
  stopDomMonitoring(machineId: number): void {
    const monitor = this.activeMonitors.get(machineId);
    if (!monitor) return;

    clearInterval(monitor.intervalId);
    monitor.observer.disconnect();
    this.activeMonitors.delete(machineId);
  }

  /**
   * Attaches lifecycle event listeners to a video element.
   * Listens for all event types in MONITORING_CONFIG.VIDEO_EVENT_TYPES and records
   * each as a VideoLifecycleEvent. For error events, extracts the MediaError details.
   * Returns a cleanup function that removes all attached listeners.
   */
  attachLifecycleTracking(
    videoElement: HTMLVideoElement,
    machineId: number,
    machineName: string
  ): () => void {
    const handlers: Map<VideoEventType, (event: Event) => void> = new Map();

    for (const eventType of MONITORING_CONFIG.VIDEO_EVENT_TYPES) {
      const handler = (event: Event) => {
        const lifecycleEvent: VideoLifecycleEvent = {
          machineId,
          machineName,
          timestamp: Date.now(),
          eventType: eventType as VideoLifecycleEvent['eventType'],
        };

        // Extract MediaError details for error events
        if (eventType === 'error') {
          const target = event.target as HTMLVideoElement | null;
          const mediaError = target?.error ?? null;
          if (mediaError) {
            lifecycleEvent.error = {
              code: mediaError.code,
              message: mediaError.message ?? '',
            };
          }
        }

        this.lifecycleEvents.push(lifecycleEvent);
      };

      handlers.set(eventType, handler);
      videoElement.addEventListener(eventType, handler);
    }

    // Return cleanup function
    return () => {
      for (const [eventType, handler] of handlers.entries()) {
        videoElement.removeEventListener(eventType, handler);
      }
      handlers.clear();
    };
  }

  /**
   * Registers a network request start time for a video URL.
   */
  trackNetworkRequest(url: string, machineId: number): void {
    const startTime =
      typeof performance !== 'undefined' ? performance.now() : Date.now();

    const request: NetworkRequest = {
      url,
      machineId,
      startTime,
    };

    this.networkRequests.set(url, request);
  }

  /**
   * Completes a previously tracked network request by recording endTime, status, and size.
   * If no matching request exists, this is a no-op.
   */
  completeNetworkRequest(url: string, status?: number, size?: number): void {
    const request = this.networkRequests.get(url);
    if (!request) return;

    const endTime =
      typeof performance !== 'undefined' ? performance.now() : Date.now();

    const updated: NetworkRequest = {
      ...request,
      endTime,
      ...(status !== undefined && { status }),
      ...(size !== undefined && { size }),
    };

    this.networkRequests.set(url, updated);
  }

  /**
   * Sets up a PerformanceObserver to automatically capture resource timing for video URLs.
   * Updates NetworkRequest records when timing data becomes available.
   * Guarded against environments where PerformanceObserver is unavailable (SSR, older browsers).
   * Returns a cleanup function that disconnects the observer.
   */
  setupPerformanceObserver(): () => void {
    if (typeof PerformanceObserver === 'undefined') {
      // Not supported in this environment — return a no-op cleanup
      return () => {};
    }

    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (
          entry.name.includes('.mp4') ||
          entry.name.includes('.webm') ||
          entry.name.includes('cloudinary.com/video')
        ) {
          const existing = this.networkRequests.get(entry.name);
          if (existing) {
            const resourceEntry = entry as PerformanceResourceTiming;
            const updated: NetworkRequest = {
              ...existing,
              endTime: resourceEntry.responseEnd,
              size:
                resourceEntry.transferSize > 0
                  ? resourceEntry.transferSize
                  : existing.size,
            };
            this.networkRequests.set(entry.name, updated);
          }
        }
      }
    });

    observer.observe({ entryTypes: ['resource'] });

    return () => {
      observer.disconnect();
    };
  }

  /**
   * Gets complete monitoring history (lifecycle events) for analysis.
   */
  getMonitoringHistory(): VideoLifecycleEvent[] {
    return [...this.lifecycleEvents];
  }

  /**
   * Gets DOM presence records for disappearance analysis.
   */
  getDomPresenceRecords(): DomPresenceRecord[] {
    return [...this.domPresenceRecords];
  }

  /**
   * Gets network request tracking data.
   */
  getNetworkRequests(): NetworkRequest[] {
    return Array.from(this.networkRequests.values());
  }

  /**
   * Clears all monitoring data and stops all active monitors.
   */
  clearAll(): void {
    // Stop every active monitor
    for (const machineId of Array.from(this.activeMonitors.keys())) {
      this.stopDomMonitoring(machineId);
    }

    this.lifecycleEvents = [];
    this.domPresenceRecords = [];
    this.networkRequests.clear();
  }
}
