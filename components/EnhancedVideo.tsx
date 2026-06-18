"use client";

// EnhancedVideo — Production-ready video component with CORS fix, retry logic,
// fallback to poster, and visual loading/error states.
// Fixes video disappearing on Vercel by using crossOrigin="anonymous" and preload="metadata".

import React, { useRef, useState, useCallback } from "react";

// ─── Props Interface ───────────────────────────────────────────────────────────

export interface EnhancedVideoProps {
  /** Cloudinary video URL */
  src: string;
  /** Fallback poster image URL */
  poster: string;
  machineId: number;
  machineName: string;
  autoPlay?: boolean;
  /** default true — required for autoplay in modern browsers */
  muted?: boolean;
  loop?: boolean;
  /** default true */
  playsInline?: boolean;
  className?: string;
  style?: React.CSSProperties;
  onLoadSuccess?: () => void;
  onLoadError?: (error: { code: number; message: string; url: string }) => void;
  /** default false — enables lifecycle monitoring in dev */
  enableMonitoring?: boolean;
  /** default true */
  enableRetry?: boolean;
  /** default 3 */
  maxRetries?: number;
  /** default false — play on mouse enter, pause/reset on leave */
  playOnHover?: boolean;
  /** default false — injects q_auto,f_auto Cloudinary transformations */
  enableTransformations?: boolean;
  /** default false — shows native video controls */
  controls?: boolean;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Injects q_auto,f_auto after /upload/ in a Cloudinary video URL.
 * Only modifies recognised Cloudinary URLs; returns src unchanged otherwise.
 */
function getVideoSrc(src: string, enableTransformations: boolean): string {
  if (!enableTransformations || !src.includes("cloudinary.com/video")) {
    return src;
  }
  return src.replace("/upload/", "/upload/q_auto,f_auto/");
}

/** HTML5 MediaError codes we care about */
const MEDIA_ERR_NETWORK = 2; // transient — safe to retry
const BASE_RETRY_DELAY = 1000; // 1 s, 2 s, 4 s with exponential backoff

// ─── Component ────────────────────────────────────────────────────────────────

export function EnhancedVideo({
  src,
  poster,
  machineId,
  machineName,
  autoPlay = false,
  muted = true,
  loop = false,
  playsInline = true,
  className,
  style,
  onLoadSuccess,
  onLoadError,
  enableMonitoring = false,
  enableRetry = true,
  maxRetries = 3,
  playOnHover = false,
  enableTransformations = false,
  controls = false,
}: EnhancedVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Visual state: 'loading' | 'loaded' | 'error'
  const [loadState, setLoadState] = useState<"loading" | "loaded" | "error">(
    "loading"
  );
  // When true the poster <img> is rendered instead of the video
  const [showFallback, setShowFallback] = useState(false);
  // How many network-error retries have been attempted
  const [retryCount, setRetryCount] = useState(0);

  const resolvedSrc = getVideoSrc(src, enableTransformations);

  // ── Event Handlers ──────────────────────────────────────────────────────────

  const handleLoadedData = useCallback(() => {
    setLoadState("loaded");
    if (enableMonitoring) {
      console.info("[EnhancedVideo] loadeddata", { machine: machineName, id: machineId, url: resolvedSrc });
    }
    onLoadSuccess?.();
  }, [enableMonitoring, machineName, machineId, resolvedSrc, onLoadSuccess]);

  const handleError = useCallback(
    (e: React.SyntheticEvent<HTMLVideoElement>) => {
      const target = e.currentTarget;
      const error = target.error;
      const errorCode = error?.code ?? 0;
      const errorMsg = error?.message ?? "Unknown video error";

      // Task 8.4 — detailed error logging
      console.error("[EnhancedVideo]", {
        machine: machineName,
        id: machineId,
        code: errorCode,
        message: errorMsg,
        url: resolvedSrc,
        networkState: target.networkState,
        readyState: target.readyState,
      });

      onLoadError?.({ code: errorCode, message: errorMsg, url: resolvedSrc });

      // Task 8.2 — retry only MEDIA_ERR_NETWORK (code 2) errors
      const isRetryable = enableRetry && errorCode === MEDIA_ERR_NETWORK;

      if (isRetryable && retryCount < maxRetries) {
        const delay = BASE_RETRY_DELAY * Math.pow(2, retryCount); // 1s, 2s, 4s
        console.warn(
          `[EnhancedVideo] Retrying (${retryCount + 1}/${maxRetries}) in ${delay}ms`,
          { machine: machineName, id: machineId }
        );
        setTimeout(() => {
          if (videoRef.current) {
            videoRef.current.load();
          }
          setRetryCount((prev) => prev + 1);
        }, delay);
      } else {
        // Task 8.3 — permanent failure: show fallback poster
        setLoadState("error");
        setShowFallback(true);
      }
    },
    [
      enableRetry,
      machineName,
      machineId,
      resolvedSrc,
      retryCount,
      maxRetries,
      onLoadError,
    ]
  );

  // Task 8.5 — hover-to-play
  const handleMouseEnter = useCallback(() => {
    if (playOnHover && videoRef.current) {
      videoRef.current
        .play()
        .catch((err) =>
          console.warn("[EnhancedVideo] play failed:", err)
        );
    }
  }, [playOnHover]);

  const handleMouseLeave = useCallback(() => {
    if (playOnHover && videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, [playOnHover]);

  /** Manual retry triggered by the error UI button */
  const handleRetryClick = useCallback(() => {
    setShowFallback(false);
    setLoadState("loading");
    setRetryCount(0);
    // Slight defer to allow state flush before reloading
    setTimeout(() => {
      videoRef.current?.load();
    }, 50);
  }, []);

  // ── Fallback — poster image ─────────────────────────────────────────────────

  if (showFallback) {
    return (
      <div className={`relative ${className ?? ""}`} style={style}>
        {/* Poster image replaces the video */}
        <img
          src={poster}
          alt={machineName}
          className="w-full h-full object-contain"
        />
        {/* Error overlay with retry button */}
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 rounded-2xl">
          <svg
            className="w-10 h-10 text-orange-500 mb-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
            />
          </svg>
          <p className="text-white text-xs mb-3 font-semibold">
            Video unavailable
          </p>
          <button
            onClick={handleRetryClick}
            className="bg-orange-500 hover:bg-orange-600 text-white text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-wider transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // ── Primary render — video element ─────────────────────────────────────────

  return (
    <div className={`relative ${className ?? ""}`} style={style}>
      {/* Task 8.1 — video element with critical CORS and preload attributes */}
      <video
        // key forces full remount when src changes, preventing stale state
        key={resolvedSrc}
        ref={videoRef}
        src={resolvedSrc}
        poster={poster}
        // Critical for Vercel CORS — must be set before any network request
        crossOrigin="anonymous"
        // "metadata" avoids blank display; "none" causes disappearing video bug
        preload="metadata"
        // Monitoring attributes
        data-machine-id={machineId}
        data-machine-name={machineName}
        // Playback attributes
        autoPlay={autoPlay}
        muted={muted}
        loop={loop}
        playsInline={playsInline}
        controls={controls}
        // Fill the container
        className="w-full h-full object-contain"
        // Event handlers
        onLoadedData={handleLoadedData}
        onError={handleError}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      />

      {/* Task 8.5 — loading overlay (subtle spinner) */}
      {loadState === "loading" && (
        <div
          className="absolute inset-0 flex items-center justify-center bg-gray-200/60 dark:bg-gray-700/60 rounded-2xl pointer-events-none"
          aria-label="Loading video"
          role="status"
        >
          <svg
            className="w-8 h-8 animate-spin text-green-700"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            />
          </svg>
        </div>
      )}
    </div>
  );
}

export default EnhancedVideo;
