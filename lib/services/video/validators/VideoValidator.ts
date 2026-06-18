// VideoValidator.ts — Service for validating video URLs and HTTP accessibility

import { Machine } from '@/data/machinesData';
import { IVideoValidator } from '../interfaces';
import { VideoValidationResult, ValidationReport } from '../types';
import {
  CLOUDINARY_URL_PATTERN,
  HTTP_REQUEST_TIMEOUT,
  HTTP_STATUS,
  DEBUG_LABELS,
} from '../constants';
import { ERROR_CODES, ERROR_MESSAGES } from '../errors';

/**
 * Formats a ValidationReport as human-readable text.
 *
 * Output format:
 *
 * ```
 * === Video Validation Report ===
 * Timestamp: 2024-01-01T00:00:00.000Z
 * Total Machines: 17
 * Valid URLs: 17
 * Invalid URLs: 0
 * HTTP Errors: 0
 *
 * Summary:
 *   ✅ HTTP 200 (OK): 17
 *   ❌ HTTP 403 (Forbidden): 0
 *   ❌ HTTP 404 (Not Found): 0
 *   ⚠️ HTTP 429 (Rate Limited): 0
 *   ⚠️ Network Errors: 0
 *
 * Results:
 *   ✅ [1] Machine Name - 200 OK
 *   ...
 * ```
 *
 * Requirements: 1.7
 */
export function generateValidationSummaryText(report: ValidationReport): string {
  const lines: string[] = [];

  // Header
  lines.push('=== Video Validation Report ===');
  lines.push(`Timestamp: ${new Date(report.timestamp).toISOString()}`);
  lines.push(`Total Machines: ${report.totalMachines}`);
  lines.push(`Valid URLs: ${report.validUrls}`);
  lines.push(`Invalid URLs: ${report.invalidUrls}`);
  lines.push(`HTTP Errors: ${report.httpErrors}`);
  lines.push('');

  // Summary
  lines.push('Summary:');
  lines.push(`  ✅ HTTP 200 (OK): ${report.summary.http200}`);
  lines.push(`  ❌ HTTP 403 (Forbidden): ${report.summary.http403}`);
  lines.push(`  ❌ HTTP 404 (Not Found): ${report.summary.http404}`);
  lines.push(`  ⚠️ HTTP 429 (Rate Limited): ${report.summary.http429}`);
  lines.push(`  ⚠️ Network Errors: ${report.summary.networkErrors}`);
  lines.push('');

  // Per-machine results
  lines.push('Results:');
  for (const result of report.results) {
    const icon = result.httpStatus === HTTP_STATUS.OK ? '✅' : '❌';
    const statusText =
      result.httpStatus === null
        ? 'INVALID URL'
        : result.httpStatus === HTTP_STATUS.OK
          ? '200 OK'
          : result.httpStatus === HTTP_STATUS.FORBIDDEN
            ? '403 Forbidden'
            : result.httpStatus === HTTP_STATUS.NOT_FOUND
              ? '404 Not Found'
              : result.httpStatus === HTTP_STATUS.TOO_MANY_REQUESTS
                ? '429 Too Many Requests'
                : result.httpStatus === 0
                  ? 'Network Error'
                  : `${result.httpStatus}`;
    lines.push(`  ${icon} [${result.machineId}] ${result.machineName} - ${statusText}`);
  }

  return lines.join('\n');
}

export class VideoValidator implements IVideoValidator {
  /**
   * Validates URL pattern against Cloudinary schema.
   *
   * Accepted format:
   *   https://res.cloudinary.com/{cloud}/video/upload/v{timestamp}/.../{name}.mp4
   *
   * Uses CLOUDINARY_URL_PATTERN from constants.ts which covers both .mp4 and .webm.
   *
   * Requirements: 1.1, 1.2
   */
  validateUrlPattern(url: string): boolean {
    if (!url || typeof url !== 'string') {
      return false;
    }
    const result = CLOUDINARY_URL_PATTERN.test(url);
    if (process.env.NODE_ENV === 'development') {
      console.debug(
        `${DEBUG_LABELS.VIDEO_VALIDATOR} validateUrlPattern("${url}") → ${result}`
      );
    }
    return result;
  }

  /**
   * Returns a human-readable diagnosis for an HTTP status code.
   *
   * Covers the key status codes encountered when validating Cloudinary video URLs:
   *   - 200: Video accessible
   *   - 403: Cloudinary account security / access restriction
   *   - 404: Video not uploaded or wrong filename
   *   - 429: Bandwidth quota or rate-limiting
   *   -   0: Network failure (CORS, connectivity, timeout)
   *   - 5xx: Cloudinary / CDN server-side error
   *
   * Requirements: 1.4, 1.5, 1.6
   */
  diagnoseHttpStatus(status: number): string {
    if (status === HTTP_STATUS.OK) {
      return 'Video accessible';
    }
    if (status === HTTP_STATUS.FORBIDDEN) {
      return (
        'Cloudinary access denied - check account Security settings ' +
        '(Resource Access Mode should be Public)'
      );
    }
    if (status === HTTP_STATUS.NOT_FOUND) {
      return 'Video file not found - verify the video was uploaded to Cloudinary';
    }
    if (status === HTTP_STATUS.TOO_MANY_REQUESTS) {
      return 'Rate limited or bandwidth quota exceeded - check Cloudinary Dashboard usage';
    }
    if (status === 0) {
      return 'Network error - CORS issue or connectivity problem';
    }
    if (status >= 500) {
      return `Server error (${status}) - Cloudinary or CDN service issue, try again later`;
    }
    return `Unexpected HTTP status ${status}`;
  }

  /**
   * Checks response headers for CORS configuration.
   *
   * Returns whether the Access-Control-Allow-Origin header is present and its value.
   * A missing or restrictive CORS header prevents browsers from loading cross-origin
   * video resources when crossOrigin="anonymous" is set on the video element.
   *
   * Requirements: 1.3, 1.6
   */
  checkCorsHeaders(headers: Record<string, string>): {
    hasCors: boolean;
    corsOrigin: string | null;
  } {
    // Header names are normalised to lower-case by the Fetch API
    const corsOrigin =
      headers['access-control-allow-origin'] ?? null;

    return {
      hasCors: corsOrigin !== null,
      corsOrigin,
    };
  }

  /**
   * Performs HTTP HEAD request to check accessibility.
   *
   * Enhancement over the basic implementation:
   *   - Extracts the four key response headers (content-type, content-length,
   *     cache-control, access-control-allow-origin)
   *   - Returns a specific error message keyed to each HTTP status code
   *     using ERROR_MESSAGES from errors.ts
   *   - Distinguishes AbortError (timeout) from generic network failures
   *   - Logs a human-readable diagnosis in development mode via
   *     diagnoseHttpStatus()
   *
   * Works in both browser and Node.js environments via the global fetch API.
   *
   * Requirements: 1.3, 1.4, 1.5, 1.6
   */
  async checkHttpAccessibility(url: string): Promise<{
    status: number;
    headers: Record<string, string>;
    error?: string;
  }> {
    const controller = new AbortController();
    const timeoutId = setTimeout(
      () => controller.abort(),
      HTTP_REQUEST_TIMEOUT
    );

    try {
      const response = await fetch(url, {
        method: 'HEAD',
        signal: controller.signal,
      });

      // Extract the subset of headers that are useful for diagnosis
      const RELEVANT_HEADERS = [
        'content-type',
        'content-length',
        'cache-control',
        'access-control-allow-origin',
      ] as const;

      const headers: Record<string, string> = {};
      response.headers.forEach((value, key) => {
        headers[key] = value;
      });

      // Also ensure the four key headers are captured even if forEach order
      // varies across runtimes — they will simply remain absent when missing.
      RELEVANT_HEADERS.forEach((name) => {
        const val = response.headers.get(name);
        if (val !== null) {
          headers[name] = val;
        }
      });

      // Derive an error message for non-OK statuses
      let errorMessage: string | undefined;
      const status = response.status;

      if (status === HTTP_STATUS.FORBIDDEN) {
        errorMessage = ERROR_MESSAGES[ERROR_CODES.HTTP_ACCESS_DENIED];
      } else if (status === HTTP_STATUS.NOT_FOUND) {
        errorMessage = ERROR_MESSAGES[ERROR_CODES.HTTP_NOT_FOUND];
      } else if (status === HTTP_STATUS.TOO_MANY_REQUESTS) {
        errorMessage = ERROR_MESSAGES[ERROR_CODES.HTTP_RATE_LIMITED];
      } else if (status >= 500) {
        errorMessage = `Server error (${status}) - ${this.diagnoseHttpStatus(status)}`;
      } else if (status !== HTTP_STATUS.OK) {
        errorMessage = `Unexpected HTTP status ${status}`;
      }

      if (process.env.NODE_ENV === 'development') {
        console.debug(
          `${DEBUG_LABELS.VIDEO_VALIDATOR} checkHttpAccessibility("${url}") → ` +
            `${status} | ${this.diagnoseHttpStatus(status)}`
        );

        const cors = this.checkCorsHeaders(headers);
        if (!cors.hasCors) {
          console.debug(
            `${DEBUG_LABELS.VIDEO_VALIDATOR} No CORS header on "${url}" — ` +
              'video may be blocked when crossOrigin="anonymous" is set'
          );
        }
      }

      return { status, headers, ...(errorMessage ? { error: errorMessage } : {}) };
    } catch (err: unknown) {
      // Distinguish timeout (AbortError) from other network failures
      let error: string;
      if (err instanceof Error && err.name === 'AbortError') {
        error =
          `Request timed out after ${HTTP_REQUEST_TIMEOUT}ms - ` +
          ERROR_MESSAGES[ERROR_CODES.DIAGNOSTIC_TIMEOUT];
      } else {
        error =
          err instanceof Error
            ? `${ERROR_MESSAGES[ERROR_CODES.HTTP_NETWORK_ERROR]}: ${err.message}`
            : ERROR_MESSAGES[ERROR_CODES.HTTP_NETWORK_ERROR];
      }

      if (process.env.NODE_ENV === 'development') {
        console.debug(
          `${DEBUG_LABELS.VIDEO_VALIDATOR} checkHttpAccessibility("${url}") error: ${error}`
        );
      }

      return {
        status: 0,
        headers: {},
        error,
      };
    } finally {
      clearTimeout(timeoutId);
    }
  }

  /**
   * Validates all machine video URLs with detailed per-machine reporting.
   * For each machine, validates the URL pattern and checks HTTP accessibility.
   */
  async validateAllVideos(machines: Machine[]): Promise<VideoValidationResult[]> {
    const results: VideoValidationResult[] = [];

    for (const machine of machines) {
      const videoUrl = machine.image;
      const isValidPattern = this.validateUrlPattern(videoUrl);

      let httpStatus: number | null = null;
      let error: string | undefined;
      let contentType: string | undefined;
      let contentLength: number | undefined;
      let responseHeaders: Record<string, string> | undefined;

      if (isValidPattern) {
        const accessibility = await this.checkHttpAccessibility(videoUrl);
        httpStatus = accessibility.status;
        responseHeaders = accessibility.headers;
        contentType = accessibility.headers['content-type'];
        const rawLength = accessibility.headers['content-length'];
        if (rawLength) {
          const parsed = parseInt(rawLength, 10);
          if (!isNaN(parsed)) {
            contentLength = parsed;
          }
        }
        if (accessibility.error) {
          error = accessibility.error;
        }
      } else {
        error = `URL does not match expected Cloudinary pattern: ${videoUrl}`;
      }

      results.push({
        machineId: machine.id,
        machineName: machine.name,
        videoUrl,
        isValidPattern,
        httpStatus,
        error,
        contentType,
        contentLength,
        responseHeaders,
      });
    }

    if (process.env.NODE_ENV === 'development') {
      console.debug(
        `${DEBUG_LABELS.VIDEO_VALIDATOR} validateAllVideos() processed ${results.length} machines`
      );
    }

    return results;
  }

  /**
   * Generates a structured validation report from the per-machine results.
   */
  generateReport(results: VideoValidationResult[]): ValidationReport {
    const summary = {
      http200: 0,
      http403: 0,
      http404: 0,
      http429: 0,
      networkErrors: 0,
    };

    let validUrls = 0;
    let invalidUrls = 0;
    let httpErrors = 0;

    for (const result of results) {
      if (result.isValidPattern) {
        validUrls++;
      } else {
        invalidUrls++;
      }

      const s = result.httpStatus;
      if (s === null) {
        // Pattern validation failed — skip HTTP status counting
      } else if (s === HTTP_STATUS.OK) {
        summary.http200++;
      } else if (s === HTTP_STATUS.FORBIDDEN) {
        summary.http403++;
        httpErrors++;
      } else if (s === HTTP_STATUS.NOT_FOUND) {
        summary.http404++;
        httpErrors++;
      } else if (s === HTTP_STATUS.TOO_MANY_REQUESTS) {
        summary.http429++;
        httpErrors++;
      } else if (s === 0) {
        summary.networkErrors++;
        httpErrors++;
      } else if (s >= 400) {
        httpErrors++;
      }
    }

    const report: ValidationReport = {
      timestamp: Date.now(),
      totalMachines: results.length,
      validUrls,
      invalidUrls,
      httpErrors,
      results,
      summary,
    };

    if (process.env.NODE_ENV === 'development') {
      console.debug(`${DEBUG_LABELS.VIDEO_VALIDATOR} generateReport():`, {
        totalMachines: report.totalMachines,
        validUrls: report.validUrls,
        invalidUrls: report.invalidUrls,
        httpErrors: report.httpErrors,
        summary: report.summary,
      });
    }

    return report;
  }
}
