// CloudinaryConfigChecker.ts — Service for checking Cloudinary configuration
// Implements ICloudinaryConfigChecker for investigating Cloudinary account settings

import {
  ICloudinaryConfigChecker,
} from '../interfaces';
import type { CloudinaryConfigCheck } from '../types';
import { 
  DEBUG_LABELS, 
  CLOUDINARY_TRANSFORMATIONS,
  HTTP_STATUS,
  HTTP_REQUEST_TIMEOUT 
} from '../constants';

export class CloudinaryConfigChecker implements ICloudinaryConfigChecker {
  /**
   * Generates manual investigation checklist for Cloudinary Dashboard
   */
  getInvestigationSteps(): string[] {
    return [
      '1. Login to Cloudinary Dashboard (https://console.cloudinary.com)',
      '2. Navigate to Settings → Security tab',
      '3. Verify "Strict Transformations" setting is OFF (this blocks dynamic transformation URLs)',
      '4. Check "Resource Access Mode" - should be "Public" not "Authenticated"',
      '5. Navigate to Settings → Upload tab',
      '6. Verify video upload is enabled (check supported formats include MP4)',
      '7. Check Dashboard home page for usage metrics',
      '8. Verify Storage usage is under free tier limit (25 GB)',
      '9. Verify Bandwidth usage is under monthly limit (25 GB/month)',
      '10. Check "Transformations" usage - excessive quota consumption can trigger restrictions',
      '11. Navigate to Settings → Security → Allowed fetch domains',
      '12. Verify Vercel deployment domain is not blocked',
      '13. Check Media Library → Videos section - verify all 17 machine videos are present',
      '14. Test direct video URL access in incognito browser window (no authentication)',
      '15. Review any active security policies or IP restrictions',
    ];
  }

  /**
   * Tests unsigned public access to video resources
   */
  async testPublicAccess(videoUrl: string): Promise<boolean> {
    console.info(`${DEBUG_LABELS.DIAGNOSTIC_SUITE} Testing public access for: ${videoUrl}`);
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), HTTP_REQUEST_TIMEOUT);

      const response = await fetch(videoUrl, {
        method: 'HEAD',
        mode: 'cors',
        cache: 'no-cache',
        signal: controller.signal,
        // No authentication headers - testing unsigned access
      });

      clearTimeout(timeoutId);

      const isAccessible = response.status === HTTP_STATUS.OK;
      
      if (!isAccessible) {
        console.warn(
          `${DEBUG_LABELS.DIAGNOSTIC_SUITE} Public access test failed: HTTP ${response.status}`
        );
        
        if (response.status === HTTP_STATUS.FORBIDDEN) {
          console.error(
            `${DEBUG_LABELS.DIAGNOSTIC_SUITE} HTTP 403 detected - likely Cloudinary authentication requirement or access restrictions`
          );
        }
      }

      return isAccessible;
    } catch (error) {
      console.error(
        `${DEBUG_LABELS.DIAGNOSTIC_SUITE} Public access test error:`,
        error
      );
      return false;
    }
  }

  /**
   * Tests video delivery with transformation parameters
   */
  async testWithTransformations(videoUrl: string): Promise<{
    success: boolean;
    transformedUrl: string;
    originalUrl: string;
    error?: string;
  }> {
    console.info(`${DEBUG_LABELS.DIAGNOSTIC_SUITE} Testing transformations for: ${videoUrl}`);

    // Extract base URL and inject transformation parameters
    // Expected pattern: https://res.cloudinary.com/{cloud}/video/upload/v{version}/{path}
    const transformedUrl = this.injectTransformations(videoUrl, [
      CLOUDINARY_TRANSFORMATIONS.QUALITY_AUTO,
      CLOUDINARY_TRANSFORMATIONS.FORMAT_AUTO,
      CLOUDINARY_TRANSFORMATIONS.WIDTH_800,
    ]);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), HTTP_REQUEST_TIMEOUT);

      const response = await fetch(transformedUrl, {
        method: 'HEAD',
        mode: 'cors',
        cache: 'no-cache',
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const success = response.status === HTTP_STATUS.OK;

      if (!success) {
        const errorMsg = `Transformation test failed: HTTP ${response.status}`;
        console.warn(`${DEBUG_LABELS.DIAGNOSTIC_SUITE} ${errorMsg}`);

        if (response.status === HTTP_STATUS.FORBIDDEN) {
          return {
            success: false,
            transformedUrl,
            originalUrl: videoUrl,
            error: 'HTTP 403 - Transformations may be restricted by "Strict Transformations" setting',
          };
        }

        return {
          success: false,
          transformedUrl,
          originalUrl: videoUrl,
          error: errorMsg,
        };
      }

      console.info(`${DEBUG_LABELS.DIAGNOSTIC_SUITE} Transformation test passed`);

      return {
        success: true,
        transformedUrl,
        originalUrl: videoUrl,
      };
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      console.error(`${DEBUG_LABELS.DIAGNOSTIC_SUITE} Transformation test error:`, error);

      return {
        success: false,
        transformedUrl,
        originalUrl: videoUrl,
        error: errorMsg,
      };
    }
  }

  /**
   * Injects transformation parameters into Cloudinary URL
   * Pattern: .../upload/v123/path → .../upload/q_auto,f_auto,w_800/v123/path
   */
  private injectTransformations(url: string, transformations: string[]): string {
    const transformStr = transformations.join(',');
    
    // Match pattern: /upload/v{version}/
    const pattern = /\/upload\/(v\d+)\//;
    
    if (pattern.test(url)) {
      return url.replace(pattern, `/upload/${transformStr}/$1/`);
    }
    
    // Fallback: inject after /upload/
    return url.replace('/upload/', `/upload/${transformStr}/`);
  }

  /**
   * Provides configuration recommendations based on check results
   */
  getRecommendations(check: CloudinaryConfigCheck): string[] {
    const recommendations: string[] = [];

    // Authentication mode recommendations
    if (check.resourceAccessMode === 'authenticated') {
      recommendations.push(
        'HIGH PRIORITY: Change Resource Access Mode to "Public" in Cloudinary Settings → Security'
      );
      recommendations.push(
        'Authenticated mode requires signed URLs which are not configured in the application'
      );
    } else if (check.resourceAccessMode === 'unknown') {
      recommendations.push(
        'Verify Resource Access Mode in Cloudinary Dashboard - check Settings → Security'
      );
    }

    // Strict transformations recommendations
    if (check.strictTransformations === true) {
      recommendations.push(
        'MEDIUM PRIORITY: Disable "Strict Transformations" if using dynamic transformation parameters'
      );
      recommendations.push(
        'Strict Transformations blocks on-the-fly URL transformations (q_auto, w_800, etc.)'
      );
    }

    // Usage quota recommendations
    if (check.usageStats) {
      const { percentUsed, bandwidthUsed, bandwidthLimit } = check.usageStats;

      if (percentUsed >= 90) {
        recommendations.push(
          `CRITICAL: Bandwidth usage at ${percentUsed.toFixed(1)}% (${bandwidthUsed.toFixed(2)} GB / ${bandwidthLimit} GB)`
        );
        recommendations.push(
          'Cloudinary may throttle or block delivery when quota is exceeded'
        );
        recommendations.push(
          'Consider upgrading to paid tier or optimizing video delivery (compression, lazy loading)'
        );
      } else if (percentUsed >= 80) {
        recommendations.push(
          `WARNING: Bandwidth usage at ${percentUsed.toFixed(1)}% (${bandwidthUsed.toFixed(2)} GB / ${bandwidthLimit} GB)`
        );
        recommendations.push(
          'Monitor bandwidth usage closely - approaching free tier limit'
        );
      } else {
        recommendations.push(
          `Bandwidth usage is healthy: ${percentUsed.toFixed(1)}% (${bandwidthUsed.toFixed(2)} GB / ${bandwidthLimit} GB)`
        );
      }
    } else {
      recommendations.push(
        'Manually check bandwidth usage in Cloudinary Dashboard → Home'
      );
      recommendations.push(
        'Free tier limit: 25 GB bandwidth/month, 25 GB storage'
      );
    }

    // Delivery type recommendations
    if (check.deliveryType === 'fetch') {
      recommendations.push(
        'Using "fetch" delivery type - verify fetch domains include your video sources'
      );
    }

    // Default recommendations
    if (recommendations.length === 0) {
      recommendations.push(
        'No immediate issues detected in automated checks'
      );
      recommendations.push(
        'Run manual verification steps to confirm all settings are correct'
      );
    }

    return recommendations;
  }

  /**
   * Performs automated checks where possible
   */
  async performAutomatedChecks(videoUrls: string[]): Promise<CloudinaryConfigCheck> {
    console.info(
      `${DEBUG_LABELS.DIAGNOSTIC_SUITE} Running automated Cloudinary checks on ${videoUrls.length} URLs`
    );

    // Test public access on first 3 URLs (sample)
    const sampleUrls = videoUrls.slice(0, 3);
    const accessResults = await Promise.all(
      sampleUrls.map(url => this.testPublicAccess(url))
    );

    const allAccessible = accessResults.every(result => result);
    
    // Infer resource access mode from results
    const resourceAccessMode: 'public' | 'authenticated' | 'unknown' = 
      allAccessible ? 'public' : 'authenticated';

    // Test transformations on first URL
    const firstUrl = videoUrls[0];
    const transformResult = await this.testWithTransformations(firstUrl);

    // Infer strict transformations setting
    // If transformation URL fails but original succeeds, likely strict transformations
    const strictTransformations: boolean | 'unknown' = 
      transformResult.success ? false : 'unknown';

    // Note: Usage stats cannot be automatically determined without Cloudinary API credentials
    // These must be checked manually in the dashboard
    const usageStats = null;

    const check: CloudinaryConfigCheck = {
      strictTransformations,
      resourceAccessMode,
      deliveryType: 'upload', // Inferred from URL pattern
      usageStats,
      recommendations: [],
    };

    // Generate recommendations based on results
    check.recommendations = this.getRecommendations(check);

    console.info(
      `${DEBUG_LABELS.DIAGNOSTIC_SUITE} Automated checks complete:`,
      { 
        resourceAccessMode, 
        strictTransformations,
        accessibleUrls: accessResults.filter(Boolean).length,
        totalUrls: sampleUrls.length,
      }
    );

    return check;
  }

  /**
   * Generates investigation guide with automated and manual steps
   */
  generateInvestigationGuide(): {
    steps: string[];
    automatedChecks: string[];
    manualChecks: string[];
  } {
    const automatedChecks = [
      'Test unsigned public access to video URLs (HTTP HEAD request)',
      'Verify HTTP 200 response vs HTTP 403 (authentication required)',
      'Test transformation parameter support (q_auto, f_auto, w_800)',
      'Check if transformation URLs return HTTP 403 (strict transformations)',
      'Measure response times and identify slow-loading videos',
      'Verify CORS headers allow cross-origin video requests',
    ];

    const manualChecks = [
      'Login to Cloudinary Dashboard and verify account status',
      'Check Settings → Security for Resource Access Mode (public vs authenticated)',
      'Verify "Strict Transformations" setting is disabled',
      'Review bandwidth usage on Dashboard home page (must be under 25 GB/month for free tier)',
      'Check storage usage (must be under 25 GB for free tier)',
      'Verify all 17 machine videos are present in Media Library',
      'Check for any active IP restrictions or security policies',
      'Review transformation quota usage (excessive usage triggers restrictions)',
      'Verify Vercel deployment domain is not blocked in allowed fetch domains',
      'Test direct video URL access in incognito browser (no cache, no auth)',
    ];

    const steps = this.getInvestigationSteps();

    return {
      steps,
      automatedChecks,
      manualChecks,
    };
  }
}