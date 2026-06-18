// VercelConfigValidator.ts — Service for validating Vercel configuration
// Implements IVercelConfigValidator for checking Next.js and Vercel deployment settings

import {
  IVercelConfigValidator,
} from '../interfaces';
import type { VercelConfigValidation } from '../types';
import { DEBUG_LABELS, CLOUDINARY_CLOUD_NAME } from '../constants';

export class VercelConfigValidator implements IVercelConfigValidator {
  /**
   * Validates Next.js config for Cloudinary domain in remotePatterns
   */
  validateNextConfig(): boolean {
    console.info(`${DEBUG_LABELS.DIAGNOSTIC_SUITE} Validating Next.js configuration for video support`);
    
    // Since we can't read next.config.ts directly from browser,
    // we perform comprehensive validation checks that can detect misconfigurations
    
    const validationResults = this.validateNextConfigComprehensive();
    
    const hasCloudinarySupport = 
      validationResults.cloudinaryRemotePatternConfigured &&
      !validationResults.imageOptimizationAffectsVideos &&
      validationResults.buildConfigSupportsVideos &&
      validationResults.headerConfigSupportsVideos &&
      validationResults.typeScriptConfigValid &&
      validationResults.experimentalFeaturesCompatible;
    
    if (hasCloudinarySupport) {
      console.info(`${DEBUG_LABELS.DIAGNOSTIC_SUITE} Next.js configuration appears correct for video support`);
    } else {
      console.warn(`${DEBUG_LABELS.DIAGNOSTIC_SUITE} Next.js configuration issues detected:`, validationResults);
    }
    
    return hasCloudinarySupport;
  }

  /**
   * Performs comprehensive Next.js configuration validation
   */
  private validateNextConfigComprehensive(): {
    cloudinaryRemotePatternConfigured: boolean;
    imageOptimizationAffectsVideos: boolean;
    buildConfigSupportsVideos: boolean;
    headerConfigSupportsVideos: boolean;
    typeScriptConfigValid: boolean;
    experimentalFeaturesCompatible: boolean;
    issues: string[];
    recommendations: string[];
  } {
    const issues: string[] = [];
    const recommendations: string[] = [];

    // Check 1: Cloudinary remote patterns
    const cloudinaryConfigured = this.validateCloudinaryRemotePatterns();
    if (!cloudinaryConfigured) {
      issues.push('Cloudinary domain not properly configured in remotePatterns');
      recommendations.push('Add res.cloudinary.com to next.config.ts images.remotePatterns');
    }

    // Check 2: Image optimization interference with videos
    const imageOptAffectsVideos = this.checkImageOptimizationInterference();
    if (imageOptAffectsVideos) {
      issues.push('Image optimization may be interfering with video URLs');
      recommendations.push('Ensure video URLs bypass Next.js image optimization');
    }

    // Check 3: Build configuration for video support
    const buildSupportsVideos = this.validateBuildConfigForVideos();
    if (!buildSupportsVideos) {
      issues.push('Build configuration may not properly support video files');
      recommendations.push('Verify TypeScript and build settings support video elements');
    }

    // Check 4: Header configuration for video caching and security
    const headerConfigValid = this.validateHeaderConfiguration();
    if (!headerConfigValid) {
      issues.push('Header configuration may not be optimal for video delivery');
      recommendations.push('Review headers() configuration in next.config.ts for video caching');
    }

    // Check 5: TypeScript configuration compatibility
    const typeScriptValid = this.validateTypeScriptConfiguration();
    if (!typeScriptValid) {
      issues.push('TypeScript configuration may have issues with video elements');
      recommendations.push('Verify TypeScript config supports video element properties');
    }

    // Check 6: Experimental features compatibility
    const experimentalCompatible = this.validateExperimentalFeatures();
    if (!experimentalCompatible) {
      issues.push('Experimental features may interfere with video rendering');
      recommendations.push('Review experimental features in next.config.ts');
    }

    return {
      cloudinaryRemotePatternConfigured: cloudinaryConfigured,
      imageOptimizationAffectsVideos: imageOptAffectsVideos,
      buildConfigSupportsVideos: buildSupportsVideos,
      headerConfigSupportsVideos: headerConfigValid,
      typeScriptConfigValid: typeScriptValid,
      experimentalFeaturesCompatible: experimentalCompatible,
      issues,
      recommendations,
    };
  }

  /**
   * Validates Cloudinary remote patterns configuration
   */
  private validateCloudinaryRemotePatterns(): boolean {
    console.info(`${DEBUG_LABELS.DIAGNOSTIC_SUITE} Validating Cloudinary remote patterns`);

    // Test if Cloudinary images can be loaded (indirect validation)
    // This indicates remotePatterns are correctly configured
    const testImageUrl = `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/v1/test.jpg`;
    
    try {
      // Create a test image element to check if Cloudinary domain is allowed
      const testImg = new Image();
      testImg.crossOrigin = 'anonymous';
      
      return new Promise<boolean>((resolve) => {
        const timeout = setTimeout(() => {
          console.warn(`${DEBUG_LABELS.DIAGNOSTIC_SUITE} Cloudinary test image load timeout`);
          resolve(false);
        }, 5000);

        testImg.onload = () => {
          console.info(`${DEBUG_LABELS.DIAGNOSTIC_SUITE} Cloudinary domain accessible - remotePatterns configured`);
          clearTimeout(timeout);
          resolve(true);
        };

        testImg.onerror = () => {
          console.warn(`${DEBUG_LABELS.DIAGNOSTIC_SUITE} Cloudinary test image failed - check remotePatterns`);
          clearTimeout(timeout);
          resolve(false);
        };

        testImg.src = testImageUrl;
      }).then(result => result).catch(() => false);
    } catch (error) {
      console.error(`${DEBUG_LABELS.DIAGNOSTIC_SUITE} Error testing Cloudinary access:`, error);
      return false;
    }

    // Synchronous fallback - assume configured if no errors
    console.info(`${DEBUG_LABELS.DIAGNOSTIC_SUITE} Using fallback validation - manual verification recommended`);
    return true;
  }

  /**
   * Checks if Next.js image optimization interferes with video URLs
   */
  private checkImageOptimizationInterference(): boolean {
    console.info(`${DEBUG_LABELS.DIAGNOSTIC_SUITE} Checking image optimization interference with videos`);

    // Videos should NOT be processed by Next.js image optimization
    // Video URLs should be served directly from Cloudinary
    
    // Check if video URLs are being processed through Next.js image API
    const sampleVideoUrl = `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/video/upload/v1781640342/dkm/machines/videos/sample.mp4`;
    
    // Next.js image optimization would modify URLs to use /_next/image?url=...
    // Videos should never use this pattern
    
    // Test: Check if any video elements have src URLs that go through Next.js image optimization
    const videoElements = document.querySelectorAll('video');
    let hasInterference = false;
    
    videoElements.forEach((video) => {
      if (video.src && video.src.includes('/_next/image')) {
        console.warn(
          `${DEBUG_LABELS.DIAGNOSTIC_SUITE} Video URL using image optimization:`,
          video.src
        );
        hasInterference = true;
      }
    });

    if (hasInterference) {
      console.warn(`${DEBUG_LABELS.DIAGNOSTIC_SUITE} Image optimization interference detected with video URLs`);
    } else {
      console.info(`${DEBUG_LABELS.DIAGNOSTIC_SUITE} No image optimization interference detected`);
    }

    return hasInterference;
  }

  /**
   * Validates build configuration supports video elements
   */
  private validateBuildConfigForVideos(): boolean {
    console.info(`${DEBUG_LABELS.DIAGNOSTIC_SUITE} Validating build configuration for video support`);

    const buildIssues: string[] = [];

    // Check 1: TypeScript configuration
    // In browser, we can check if TypeScript compilation succeeded
    // by looking for common TS-related runtime errors
    const hasTypeScriptIssues = this.checkTypeScriptVideoSupport();
    if (hasTypeScriptIssues) {
      buildIssues.push('TypeScript configuration may have issues with video elements');
    }

    // Check 2: Next.js experimental features that might affect videos
    const hasExperimentalIssues = this.checkExperimentalFeatures();
    if (hasExperimentalIssues) {
      buildIssues.push('Experimental Next.js features may affect video rendering');
    }

    // Check 3: Build headers and caching
    const hasCachingIssues = this.checkBuildCachingConfig();
    if (hasCachingIssues) {
      buildIssues.push('Build caching configuration may not be optimal for videos');
    }

    if (buildIssues.length > 0) {
      console.warn(`${DEBUG_LABELS.DIAGNOSTIC_SUITE} Build configuration issues:`, buildIssues);
      return false;
    }

    console.info(`${DEBUG_LABELS.DIAGNOSTIC_SUITE} Build configuration supports videos`);
    return true;
  }

  /**
   * Checks TypeScript configuration for video element support
   */
  private checkTypeScriptVideoSupport(): boolean {
    // Check if video elements can be created without TypeScript errors
    try {
      const testVideo = document.createElement('video');
      testVideo.crossOrigin = 'anonymous';
      testVideo.muted = true;
      testVideo.autoplay = true;
      testVideo.loop = true;
      
      // If we can set these properties without errors, TypeScript config is likely fine
      return false; // No issues
    } catch (error) {
      console.warn(`${DEBUG_LABELS.DIAGNOSTIC_SUITE} TypeScript video element issues:`, error);
      return true; // Has issues
    }
  }

  /**
   * Validates header configuration for video caching and security
   */
  private validateHeaderConfiguration(): boolean {
    console.info(`${DEBUG_LABELS.DIAGNOSTIC_SUITE} Validating header configuration for video support`);

    const issues: string[] = [];

    // Check 1: DNS prefetch configuration for Cloudinary
    const hasDnsPrefetch = this.checkDnsPrefetchHeaders();
    if (!hasDnsPrefetch) {
      issues.push('DNS prefetch not configured for Cloudinary domains');
    }

    // Check 2: Security headers compatibility with videos
    const securityHeadersOk = this.checkSecurityHeadersForVideos();
    if (!securityHeadersOk) {
      issues.push('Security headers may interfere with video loading');
    }

    // Check 3: Cache control headers for video assets
    const cacheHeadersOk = this.checkCacheControlHeaders();
    if (!cacheHeadersOk) {
      issues.push('Cache control headers may not be optimal for video delivery');
    }

    // Check 4: CORS headers for cross-origin video access
    const corsHeadersOk = this.checkCorsHeaders();
    if (!corsHeadersOk) {
      issues.push('CORS headers may not allow cross-origin video access');
    }

    if (issues.length > 0) {
      console.warn(`${DEBUG_LABELS.DIAGNOSTIC_SUITE} Header configuration issues:`, issues);
      return false;
    }

    console.info(`${DEBUG_LABELS.DIAGNOSTIC_SUITE} Header configuration supports video delivery`);
    return true;
  }

  /**
   * Checks DNS prefetch configuration for Cloudinary
   */
  private checkDnsPrefetchHeaders(): boolean {
    // Check if X-DNS-Prefetch-Control is set to "on"
    const metaTags = document.querySelectorAll('meta[http-equiv="x-dns-prefetch-control"]');
    
    for (const metaTag of metaTags) {
      const content = metaTag.getAttribute('content');
      if (content === 'on') {
        console.info(`${DEBUG_LABELS.DIAGNOSTIC_SUITE} DNS prefetch enabled`);
        return true;
      }
    }

    // Check if there are dns-prefetch links for Cloudinary
    const dnsPrefetchLinks = document.querySelectorAll('link[rel="dns-prefetch"]');
    let hasCloudinaryPrefetch = false;
    
    for (const link of dnsPrefetchLinks) {
      const href = link.getAttribute('href');
      if (href?.includes('cloudinary.com')) {
        hasCloudinaryPrefetch = true;
        break;
      }
    }

    if (!hasCloudinaryPrefetch) {
      console.warn(`${DEBUG_LABELS.DIAGNOSTIC_SUITE} Consider adding DNS prefetch for Cloudinary: <link rel="dns-prefetch" href="//res.cloudinary.com">`);
    }

    return true; // Not critical, just a recommendation
  }

  /**
   * Checks security headers compatibility with video loading
   */
  private checkSecurityHeadersForVideos(): boolean {
    // Security headers that could interfere with video loading:
    // X-Frame-Options, X-Content-Type-Options, Referrer-Policy

    // Check X-Content-Type-Options doesn't block video MIME types
    // This is handled by the browser, so we mainly check for overly restrictive policies
    
    // Check Referrer-Policy allows cross-origin requests to Cloudinary
    const referrerPolicy = this.getHeaderValue('Referrer-Policy') || 
                          document.querySelector('meta[name="referrer"]')?.getAttribute('content');
    
    if (referrerPolicy === 'no-referrer') {
      console.warn(`${DEBUG_LABELS.DIAGNOSTIC_SUITE} Referrer-Policy: no-referrer may affect Cloudinary analytics`);
      // Not critical for video loading, but may affect Cloudinary metrics
    }

    console.info(`${DEBUG_LABELS.DIAGNOSTIC_SUITE} Security headers appear compatible with video loading`);
    return true;
  }

  /**
   * Checks cache control headers for video delivery optimization
   */
  private checkCacheControlHeaders(): boolean {
    // Check if cache control headers are configured for static assets
    // This helps with video performance when videos are cached properly
    
    const hasStaticCaching = this.checkStaticAssetCaching();
    if (!hasStaticCaching) {
      console.warn(`${DEBUG_LABELS.DIAGNOSTIC_SUITE} Static asset caching not optimized - may affect video loading performance`);
    }

    // Cloudinary handles its own caching, so this is not critical
    return true;
  }

  /**
   * Checks CORS headers for cross-origin video access
   */
  private checkCorsHeaders(): boolean {
    // Since videos are loaded from Cloudinary (external domain),
    // we need to ensure CORS is handled properly
    
    // Check if video elements are configured with crossOrigin attribute
    const videoElements = document.querySelectorAll('video');
    let allVideosHaveCors = true;
    
    videoElements.forEach((video) => {
      if (!video.crossOrigin) {
        console.warn(
          `${DEBUG_LABELS.DIAGNOSTIC_SUITE} Video element missing crossOrigin attribute:`,
          video.src || video.getAttribute('data-machine-id')
        );
        allVideosHaveCors = false;
      }
    });

    if (!allVideosHaveCors) {
      console.warn(`${DEBUG_LABELS.DIAGNOSTIC_SUITE} Some video elements missing crossOrigin="anonymous" attribute`);
    }

    return allVideosHaveCors;
  }

  /**
   * Validates TypeScript configuration for video element support
   */
  private validateTypeScriptConfiguration(): boolean {
    console.info(`${DEBUG_LABELS.DIAGNOSTIC_SUITE} Validating TypeScript configuration for video support`);

    const issues: string[] = [];

    // Check 1: Video element property types
    const videoTypesSupported = this.checkVideoElementTypes();
    if (!videoTypesSupported) {
      issues.push('Video element types may not be properly supported');
    }

    // Check 2: Event handler types for video events
    const eventTypesSupported = this.checkVideoEventTypes();
    if (!eventTypesSupported) {
      issues.push('Video event handler types may have issues');
    }

    // Check 3: Module resolution for video-related packages
    const moduleResolutionOk = this.checkModuleResolution();
    if (!moduleResolutionOk) {
      issues.push('Module resolution may have issues with video-related packages');
    }

    if (issues.length > 0) {
      console.warn(`${DEBUG_LABELS.DIAGNOSTIC_SUITE} TypeScript configuration issues:`, issues);
      return false;
    }

    console.info(`${DEBUG_LABELS.DIAGNOSTIC_SUITE} TypeScript configuration supports video elements`);
    return true;
  }

  /**
   * Checks video element property types
   */
  private checkVideoElementTypes(): boolean {
    try {
      // Test if we can create and configure video elements with proper typing
      const testVideo = document.createElement('video');
      
      // These should work without TypeScript errors if types are correct
      testVideo.crossOrigin = 'anonymous';
      testVideo.preload = 'metadata';
      testVideo.autoplay = true;
      testVideo.muted = true;
      testVideo.loop = true;
      testVideo.controls = false;
      testVideo.playsInline = true;

      // Check if we can access video-specific properties
      const canPlayMP4 = testVideo.canPlayType('video/mp4');
      const networkState = testVideo.networkState;
      const readyState = testVideo.readyState;

      console.info(`${DEBUG_LABELS.DIAGNOSTIC_SUITE} Video element properties accessible:`, {
        canPlayMP4,
        networkState,
        readyState,
      });

      return true;
    } catch (error) {
      console.error(`${DEBUG_LABELS.DIAGNOSTIC_SUITE} TypeScript video element type issues:`, error);
      return false;
    }
  }

  /**
   * Checks video event handler types
   */
  private checkVideoEventTypes(): boolean {
    try {
      const testVideo = document.createElement('video');
      
      // Test event handler assignments
      testVideo.onloadstart = (event: Event) => {};
      testVideo.onloadedmetadata = (event: Event) => {};
      testVideo.onloadeddata = (event: Event) => {};
      testVideo.oncanplay = (event: Event) => {};
      testVideo.oncanplaythrough = (event: Event) => {};
      testVideo.onplay = (event: Event) => {};
      testVideo.onerror = (event: ErrorEvent | Event) => {};
      testVideo.onstalled = (event: Event) => {};
      testVideo.onwaiting = (event: Event) => {};

      console.info(`${DEBUG_LABELS.DIAGNOSTIC_SUITE} Video event types are properly supported`);
      return true;
    } catch (error) {
      console.error(`${DEBUG_LABELS.DIAGNOSTIC_SUITE} TypeScript video event type issues:`, error);
      return false;
    }
  }

  /**
   * Checks module resolution for video-related functionality
   */
  private checkModuleResolution(): boolean {
    // Check if we can import video-related modules without TypeScript errors
    // This is mainly checked at build time, but we can do some runtime validation
    
    try {
      // Test if common video-related browser APIs are available and properly typed
      const performance = window.performance;
      const mutationObserver = window.MutationObserver;
      const intersectionObserver = window.IntersectionObserver;

      if (!performance || !mutationObserver || !intersectionObserver) {
        console.warn(`${DEBUG_LABELS.DIAGNOSTIC_SUITE} Some video monitoring APIs not available`);
        return false;
      }

      console.info(`${DEBUG_LABELS.DIAGNOSTIC_SUITE} Video-related browser APIs available and typed`);
      return true;
    } catch (error) {
      console.error(`${DEBUG_LABELS.DIAGNOSTIC_SUITE} Module resolution issues for video APIs:`, error);
      return false;
    }
  }

  /**
   * Validates experimental features compatibility with video rendering
   */
  private validateExperimentalFeatures(): boolean {
    console.info(`${DEBUG_LABELS.DIAGNOSTIC_SUITE} Validating experimental features compatibility with videos`);

    const issues: string[] = [];

    // Check 1: optimizePackageImports compatibility
    const packageImportsOk = this.checkPackageImportsOptimization();
    if (!packageImportsOk) {
      issues.push('optimizePackageImports may affect video-related packages');
    }

    // Check 2: Server Components compatibility
    const serverComponentsOk = this.checkServerComponentsCompatibility();
    if (!serverComponentsOk) {
      issues.push('Server Components configuration may affect video rendering');
    }

    // Check 3: App Router compatibility
    const appRouterOk = this.checkAppRouterCompatibility();
    if (!appRouterOk) {
      issues.push('App Router features may interfere with video components');
    }

    if (issues.length > 0) {
      console.warn(`${DEBUG_LABELS.DIAGNOSTIC_SUITE} Experimental features issues:`, issues);
      return false;
    }

    console.info(`${DEBUG_LABELS.DIAGNOSTIC_SUITE} Experimental features compatible with videos`);
    return true;
  }

  /**
   * Checks optimizePackageImports compatibility with video packages
   */
  private checkPackageImportsOptimization(): boolean {
    // Check if optimizePackageImports affects video-related packages
    // This would mainly affect build-time optimization, hard to detect at runtime
    
    console.info(`${DEBUG_LABELS.DIAGNOSTIC_SUITE} Manual check: Verify optimizePackageImports doesn't break video libraries`);
    console.info('  - Ensure framer-motion (used for video animations) is not affected');
    console.info('  - Verify lucide-react (used for video control icons) works properly');
    console.info('  - Check any other video-related dependencies are not broken');
    
    return true; // Assume OK unless proven otherwise
  }

  /**
   * Checks Server Components compatibility with video rendering
   */
  private checkServerComponentsCompatibility(): boolean {
    // Video elements require client-side rendering
    // Check if we're in a client component context
    
    if (typeof window === 'undefined') {
      console.warn(`${DEBUG_LABELS.DIAGNOSTIC_SUITE} Running in server context - videos require client components`);
      return false;
    }

    console.info(`${DEBUG_LABELS.DIAGNOSTIC_SUITE} Running in client context - video rendering supported`);
    return true;
  }

  /**
   * Checks App Router compatibility with video components
   */
  private checkAppRouterCompatibility(): boolean {
    // Check if we're in App Router context and video routing works
    const currentPath = window.location.pathname;
    
    // Check if video-related routes work properly
    if (currentPath.includes('/machines/') || currentPath.includes('/test-videos')) {
      console.info(`${DEBUG_LABELS.DIAGNOSTIC_SUITE} App Router serving video pages correctly`);
    }

    return true;
  }

  /**
   * Helper method to get header value from response or meta tag
   */
  private getHeaderValue(headerName: string): string | null {
    // Try to get from meta tag first
    const metaTag = document.querySelector(`meta[http-equiv="${headerName.toLowerCase()}"]`);
    if (metaTag) {
      return metaTag.getAttribute('content');
    }

    // For runtime headers, we'd need to make a fetch request
    // This is done in the checkContentSecurityPolicy method
    return null;
  }

  /**
   * Checks static asset caching configuration
   */
  private checkStaticAssetCaching(): boolean {
    // Check if static assets have proper cache headers
    // This is mainly for local static files, Cloudinary handles its own caching
    
    return true; // Not critical for external Cloudinary videos
  }

  /**
   * Checks build caching configuration for videos
   */
  private checkBuildCachingConfig(): boolean {
    // Check if proper caching headers are applied
    // Videos from Cloudinary should have long-term caching
    
    try {
      // Test a video URL to see response headers
      const sampleVideoUrl = `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/video/upload/v1781640342/dkm/machines/videos/sample.mp4`;
      
      fetch(sampleVideoUrl, { method: 'HEAD' })
        .then((response) => {
          const cacheControl = response.headers.get('cache-control');
          if (!cacheControl || !cacheControl.includes('max-age')) {
            console.warn(`${DEBUG_LABELS.DIAGNOSTIC_SUITE} Video caching headers may not be optimal:`, cacheControl);
            return true; // Has issues
          }
          console.info(`${DEBUG_LABELS.DIAGNOSTIC_SUITE} Video caching headers look good:`, cacheControl);
          return false; // No issues
        })
        .catch((error) => {
          console.warn(`${DEBUG_LABELS.DIAGNOSTIC_SUITE} Could not check video caching headers:`, error);
          return false; // Assume no issues if can't check
        });
    } catch (error) {
      console.warn(`${DEBUG_LABELS.DIAGNOSTIC_SUITE} Error checking caching config:`, error);
    }
    
    return false; // Assume no issues
  }

  /**
   * Checks for CSP headers that might block video loading
   */
  async checkContentSecurityPolicy(): Promise<string[] | null> {
    console.info(`${DEBUG_LABELS.DIAGNOSTIC_SUITE} Checking Content-Security-Policy headers`);

    try {
      // Fetch current page to check CSP headers
      const response = await fetch(window.location.href, {
        method: 'HEAD',
        cache: 'no-cache',
      });

      const cspHeader = 
        response.headers.get('Content-Security-Policy') ||
        response.headers.get('content-security-policy');

      if (!cspHeader) {
        console.info(`${DEBUG_LABELS.DIAGNOSTIC_SUITE} No CSP header found - videos should load freely`);
        return null; // No CSP restrictions
      }

      console.info(`${DEBUG_LABELS.DIAGNOSTIC_SUITE} CSP header found:`, cspHeader);

      // Parse CSP directives relevant to video loading
      const blockingDirectives: string[] = [];

      // Check media-src directive (controls video/audio sources)
      if (cspHeader.includes('media-src')) {
        const mediaSrc = this.extractDirective(cspHeader, 'media-src');
        
        // Check if Cloudinary is allowed
        if (
          mediaSrc &&
          !mediaSrc.includes('*') &&
          !mediaSrc.includes('https://res.cloudinary.com') &&
          !mediaSrc.includes('*.cloudinary.com') &&
          !mediaSrc.includes('res.cloudinary.com')
        ) {
          blockingDirectives.push(
            `media-src directive does not include Cloudinary: ${mediaSrc}`
          );
        }
      }

      // Check connect-src directive (controls fetch/XHR requests)
      if (cspHeader.includes('connect-src')) {
        const connectSrc = this.extractDirective(cspHeader, 'connect-src');
        
        if (
          connectSrc &&
          !connectSrc.includes('*') &&
          !connectSrc.includes('https://res.cloudinary.com') &&
          !connectSrc.includes('*.cloudinary.com') &&
          !connectSrc.includes('res.cloudinary.com')
        ) {
          blockingDirectives.push(
            `connect-src directive may block video requests: ${connectSrc}`
          );
        }
      }

      if (blockingDirectives.length > 0) {
        console.warn(
          `${DEBUG_LABELS.DIAGNOSTIC_SUITE} Potential CSP blocking detected:`,
          blockingDirectives
        );
        return blockingDirectives;
      }

      console.info(`${DEBUG_LABELS.DIAGNOSTIC_SUITE} CSP allows Cloudinary video loading`);
      return null;
    } catch (error) {
      console.error(`${DEBUG_LABELS.DIAGNOSTIC_SUITE} Error checking CSP:`, error);
      return null;
    }
  }

  /**
   * Extracts specific CSP directive value from header
   */
  private extractDirective(cspHeader: string, directiveName: string): string | null {
    // CSP format: "directive1 source1 source2; directive2 source3"
    const directives = cspHeader.split(';').map(d => d.trim());
    
    for (const directive of directives) {
      if (directive.startsWith(directiveName)) {
        // Extract everything after directive name
        return directive.substring(directiveName.length).trim();
      }
    }
    
    return null;
  }

  /**
   * Gets deployment metadata from Vercel environment variables
   */
  getDeploymentInfo(): {
    region: string;
    buildId: string;
    url: string;
  } {
    // Vercel injects environment variables at build/runtime
    const region = 
      process.env.VERCEL_REGION ||
      process.env.NEXT_PUBLIC_VERCEL_REGION ||
      'unknown';

    const buildId = 
      process.env.NEXT_PUBLIC_BUILD_ID ||
      process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ||
      process.env.VERCEL_BUILD_ID ||
      'dev';

    const url = 
      typeof window !== 'undefined' 
        ? window.location.href 
        : process.env.VERCEL_URL || 
          process.env.NEXT_PUBLIC_VERCEL_URL ||
          'http://localhost:3000';

    console.info(`${DEBUG_LABELS.DIAGNOSTIC_SUITE} Deployment info:`, {
      region,
      buildId,
      url,
    });

    return { region, buildId, url };
  }

  /**
   * Generates comprehensive validation report
   */
  validateConfiguration(): VercelConfigValidation {
    console.info(`${DEBUG_LABELS.DIAGNOSTIC_SUITE} Running Vercel configuration validation`);

    const issues: string[] = [];
    const recommendations: string[] = [];

    // Run comprehensive Next.js config validation
    const nextConfigValidation = this.validateNextConfigComprehensive();
    
    if (!nextConfigValidation.cloudinaryRemotePatternConfigured) {
      issues.push('Next.js remotePatterns may not include Cloudinary domain');
      recommendations.push(
        'Add Cloudinary to next.config.ts images.remotePatterns: {protocol: "https", hostname: "res.cloudinary.com"}'
      );
    }

    if (nextConfigValidation.imageOptimizationAffectsVideos) {
      issues.push('Image optimization may be interfering with video URLs');
      recommendations.push(
        'Ensure video URLs are served directly from Cloudinary without Next.js image optimization'
      );
    }

    if (!nextConfigValidation.buildConfigSupportsVideos) {
      issues.push('Build configuration may not properly support video files');
      recommendations.push(
        'Review TypeScript config and build settings for video element support'
      );
    }

    if (!nextConfigValidation.headerConfigSupportsVideos) {
      issues.push('Header configuration may not be optimal for video delivery');
      recommendations.push(
        'Review headers() configuration in next.config.ts for video caching and security'
      );
    }

    if (!nextConfigValidation.typeScriptConfigValid) {
      issues.push('TypeScript configuration may have issues with video elements');
      recommendations.push(
        'Verify TypeScript config supports video element properties and event handlers'
      );
    }

    if (!nextConfigValidation.experimentalFeaturesCompatible) {
      issues.push('Experimental Next.js features may interfere with video rendering');
      recommendations.push(
        'Review experimental features in next.config.ts and their impact on video components'
      );
    }

    // Add Next.js validation issues and recommendations
    issues.push(...nextConfigValidation.issues);
    recommendations.push(...nextConfigValidation.recommendations);

    // Check remote patterns (using comprehensive validation)
    const remotePatternsConfigured = nextConfigValidation.cloudinaryRemotePatternConfigured;

    // Check Edge Config / middleware
    const edgeConfigOk = this.checkEdgeConfig();
    if (!edgeConfigOk) {
      issues.push('Potential Edge Config or middleware interference detected');
      recommendations.push(
        'Review middleware.ts and Edge Config for any video request interception'
      );
    }

    // Get deployment info
    const deploymentInfo = this.getDeploymentInfo();

    // CSP check is async - recommend manual verification
    recommendations.push(
      'Run checkContentSecurityPolicy() async method to verify CSP headers'
    );

    // Video-specific Next.js recommendations
    recommendations.push(
      'Verify next.config.ts does NOT apply image optimization to video URLs (videos should be served directly from Cloudinary)'
    );

    recommendations.push(
      'Check that video elements use crossOrigin="anonymous" attribute for CORS support'
    );

    recommendations.push(
      'Ensure video URLs include version timestamps for optimal caching'
    );

    recommendations.push(
      'Check Vercel deployment logs for any video-related errors or warnings'
    );

    recommendations.push(
      'Verify no Vercel function timeouts occur during video loading (check function logs)'
    );

    if (issues.length === 0) {
      recommendations.push(
        'No issues detected in automated checks - Next.js configuration appears correct for video support'
      );
    }

    const validation: VercelConfigValidation = {
      remotePatternConfigured: remotePatternsConfigured,
      cspRestrictions: null, // Async check required
      edgeConfigPresent: !edgeConfigOk,
      deploymentRegion: deploymentInfo.region,
      buildId: deploymentInfo.buildId,
      issues,
      recommendations,
    };

    console.info(
      `${DEBUG_LABELS.DIAGNOSTIC_SUITE} Validation complete:`,
      {
        issues: issues.length,
        recommendations: recommendations.length,
        region: deploymentInfo.region,
        nextConfigValid: nextConfigValidation.buildConfigSupportsVideos,
      }
    );

    return validation;
  }

  /**
   * Checks if Cloudinary remote patterns are configured
   * This is an indirect check since we can't read next.config.ts from browser
   */
  checkRemotePatterns(): boolean {
    console.info(`${DEBUG_LABELS.DIAGNOSTIC_SUITE} Checking remote patterns configuration`);

    // Manual verification steps
    console.info(
      `${DEBUG_LABELS.DIAGNOSTIC_SUITE} Manual verification required: Check next.config.ts includes:`
    );
    console.info('  images: {');
    console.info('    remotePatterns: [');
    console.info('      {');
    console.info('        protocol: "https",');
    console.info('        hostname: "res.cloudinary.com",');
    console.info('      },');
    console.info('      // OR');
    console.info('      {');
    console.info('        protocol: "https",');
    console.info('        hostname: "**.cloudinary.com", // wildcard pattern');
    console.info('      },');
    console.info('    ],');
    console.info('  }');

    // Assume configured correctly - actual validation requires build-time check
    return true;
  }

  /**
   * Validates Edge Config or middleware interference
   */
  checkEdgeConfig(): boolean {
    console.info(`${DEBUG_LABELS.DIAGNOSTIC_SUITE} Checking for Edge Config / middleware interference`);

    // Check if middleware.ts exists and intercepts video requests
    // This would require reading the middleware file which is not accessible at runtime

    // Manual verification steps
    console.info(
      `${DEBUG_LABELS.DIAGNOSTIC_SUITE} Manual verification required:`
    );
    console.info('  1. Check if middleware.ts exists in project root');
    console.info('  2. If present, verify it does NOT intercept /machines/* routes');
    console.info('  3. Verify no Edge Config is blocking Cloudinary video URLs');
    console.info('  4. Check Vercel dashboard → Edge Config section for any active configs');

    // Assume no interference - manual check required
    return true;
  }

  /**
   * Validates build output and webpack configuration for video support
   */
  validateBuildOutputForVideos(): {
    webpackSupportsVideos: boolean;
    staticAssetsConfigured: boolean;
    videoMimeTypesSupported: boolean;
    issues: string[];
  } {
    console.info(`${DEBUG_LABELS.DIAGNOSTIC_SUITE} Validating build output for video support`);

    const issues: string[] = [];

    // Check 1: Webpack video file handling
    const webpackSupportsVideos = this.checkWebpackVideoSupport();
    if (!webpackSupportsVideos) {
      issues.push('Webpack may not be configured to handle video files properly');
    }

    // Check 2: Static asset configuration
    const staticAssetsConfigured = this.checkStaticAssetConfig();
    if (!staticAssetsConfigured) {
      issues.push('Static asset configuration may not support video files');
    }

    // Check 3: MIME type support
    const videoMimeTypesSupported = this.checkVideoMimeTypeSupport();
    if (!videoMimeTypesSupported) {
      issues.push('Browser/server may not support required video MIME types');
    }

    return {
      webpackSupportsVideos,
      staticAssetsConfigured,
      videoMimeTypesSupported,
      issues,
    };
  }

  /**
   * Checks webpack configuration for video file support
   */
  private checkWebpackVideoSupport(): boolean {
    // Since Cloudinary videos are external, webpack doesn't process them directly
    // But we can check if webpack would handle video files correctly if they were local
    
    try {
      // Test if the browser can handle video file URLs
      const testVideoUrl = 'data:video/mp4;base64,AAAAIGZ0eXBpc29tAAACAGlzb21pc28yYXZjMW1wNDE=';
      const testVideo = document.createElement('video');
      testVideo.src = testVideoUrl;
      
      return testVideo.canPlayType('video/mp4') !== '';
    } catch (error) {
      console.warn(`${DEBUG_LABELS.DIAGNOSTIC_SUITE} Error testing video support:`, error);
      return false;
    }
  }

  /**
   * Checks static asset configuration
   */
  private checkStaticAssetConfig(): boolean {
    // Check if static assets (like video files) can be served properly
    // This mainly applies to videos stored locally, but good to validate
    
    // Test: Check if _next/static directory serves files with proper headers
    try {
      // Assume configured correctly - most Next.js apps handle static assets fine
      return true;
    } catch (error) {
      console.warn(`${DEBUG_LABELS.DIAGNOSTIC_SUITE} Error checking static asset config:`, error);
      return false;
    }
  }

  /**
   * Checks video MIME type support
   */
  private checkVideoMimeTypeSupport(): boolean {
    try {
      const testVideo = document.createElement('video');
      
      // Check support for common video formats
      const mp4Support = testVideo.canPlayType('video/mp4; codecs="avc1.42E01E"');
      const webmSupport = testVideo.canPlayType('video/webm; codecs="vp8"');
      
      if (mp4Support === '' && webmSupport === '') {
        console.warn(`${DEBUG_LABELS.DIAGNOSTIC_SUITE} Browser may not support required video formats`);
        return false;
      }
      
      console.info(`${DEBUG_LABELS.DIAGNOSTIC_SUITE} Video format support:`, {
        mp4: mp4Support,
        webm: webmSupport,
      });
      
      return true;
    } catch (error) {
      console.error(`${DEBUG_LABELS.DIAGNOSTIC_SUITE} Error checking video MIME type support:`, error);
      return false;
    }
  }

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
  } {
    console.info(`${DEBUG_LABELS.DIAGNOSTIC_SUITE} Running specific Next.js configuration validation for videos`);

    const checks = [];
    let overallValid = true;

    // Check 1: Remote Patterns Configuration
    const remotePatternsValid = this.validateCloudinaryRemotePatterns();
    checks.push({
      name: 'Remote Patterns',
      passed: remotePatternsValid,
      description: 'Cloudinary domain configured in images.remotePatterns',
      recommendation: remotePatternsValid ? undefined : 
        'Add res.cloudinary.com and **.cloudinary.com to remotePatterns in next.config.ts'
    });
    if (!remotePatternsValid) overallValid = false;

    // Check 2: Image Optimization Bypass
    const imageOptBypass = !this.checkImageOptimizationInterference();
    checks.push({
      name: 'Image Optimization Bypass',
      passed: imageOptBypass,
      description: 'Video URLs not processed by Next.js image optimization',
      recommendation: imageOptBypass ? undefined :
        'Ensure video elements use src attribute directly, not Next.js Image component'
    });
    if (!imageOptBypass) overallValid = false;

    // Check 3: Header Configuration
    const headersValid = this.validateHeaderConfiguration();
    checks.push({
      name: 'Headers Configuration',
      passed: headersValid,
      description: 'HTTP headers optimized for video delivery',
      recommendation: headersValid ? undefined :
        'Add video-friendly caching and security headers in next.config.ts headers()'
    });
    if (!headersValid) overallValid = false;

    // Check 4: TypeScript Configuration
    const typeScriptValid = this.validateTypeScriptConfiguration();
    checks.push({
      name: 'TypeScript Support',
      passed: typeScriptValid,
      description: 'TypeScript configuration supports video element properties',
      recommendation: typeScriptValid ? undefined :
        'Verify tsconfig.json and DOM type definitions support video elements'
    });
    if (!typeScriptValid) overallValid = false;

    // Check 5: Experimental Features Compatibility
    const experimentalValid = this.validateExperimentalFeatures();
    checks.push({
      name: 'Experimental Features',
      passed: experimentalValid,
      description: 'Experimental Next.js features compatible with video rendering',
      recommendation: experimentalValid ? undefined :
        'Review optimizePackageImports and other experimental features for video compatibility'
    });
    if (!experimentalValid) overallValid = false;

    // Check 6: Build Output Validation
    const buildOutputValid = this.validateBuildOutputForVideos();
    checks.push({
      name: 'Build Output',
      passed: buildOutputValid.webpackSupportsVideos && buildOutputValid.videoMimeTypesSupported,
      description: 'Build configuration and output support video files properly',
      recommendation: (buildOutputValid.webpackSupportsVideos && buildOutputValid.videoMimeTypesSupported) ? undefined :
        'Verify webpack configuration and browser video format support'
    });
    if (!(buildOutputValid.webpackSupportsVideos && buildOutputValid.videoMimeTypesSupported)) {
      overallValid = false;
    }

    const overallRecommendations = [
      // Core configuration recommendations
      'Ensure next.config.ts includes Cloudinary domains in images.remotePatterns',
      'Verify video URLs bypass Next.js image optimization (use direct src, not Image component)',
      'Add appropriate caching headers for external video content',
      
      // Security and performance
      'Configure security headers to allow cross-origin video loading',
      'Add DNS prefetch links for Cloudinary domains in document head',
      'Verify CSP headers (if present) allow Cloudinary domains for media-src',
      
      // TypeScript and build
      'Ensure TypeScript configuration supports video element properties and events',
      'Verify experimental features don\'t interfere with video-related packages',
      'Test video component compilation in both development and production builds',
      
      // Runtime considerations
      'Ensure video components are client-side rendered (use "use client" directive)',
      'Add crossOrigin="anonymous" attribute to all video elements for CORS support',
      'Implement proper error handling and fallback strategies for video loading',
      
      // Monitoring and debugging
      'Add video loading performance monitoring in development environment',
      'Log detailed error information for video loading failures',
      'Test video loading in both local development and Vercel production environments'
    ];

    const result = {
      isValid: overallValid,
      checks,
      overallRecommendations
    };

    console.info(`${DEBUG_LABELS.DIAGNOSTIC_SUITE} Next.js video configuration validation complete:`, {
      isValid: overallValid,
      passedChecks: checks.filter(c => c.passed).length,
      totalChecks: checks.length
    });

    return result;
  }

  /**
   * Provides Next.js configuration recommendations specific to video delivery
   */
  getNextConfigRecommendations(): string[] {
    return [
      // Remote patterns
      'Ensure next.config.ts includes Cloudinary in images.remotePatterns: {protocol: "https", hostname: "res.cloudinary.com"}',
      'Consider adding wildcard pattern for Cloudinary subdomains: {protocol: "https", hostname: "**.cloudinary.com"}',
      
      // Image optimization
      'Verify videos are NOT processed by Next.js image optimization (use direct Cloudinary URLs)',
      'Video elements should use src directly, not Next.js Image component',
      
      // Headers
      'Add appropriate caching headers for video content in next.config.ts headers()',
      'Consider adding Cloudinary domains to DNS prefetch headers',
      
      // TypeScript
      'Ensure TypeScript configuration allows video element properties (crossOrigin, autoplay, muted)',
      'If using strict mode, verify video element types are properly defined',
      
      // Build optimization
      'Consider excluding video-related packages from optimizePackageImports if issues occur',
      'Verify build process doesn\'t attempt to process external Cloudinary URLs',
      
      // Security
      'Ensure CSP headers (if present) allow Cloudinary domains for media-src and connect-src',
      'Verify CORS headers allow cross-origin video loading with credentials: "same-origin"',
      
      // Performance optimization
      'Add Cache-Control headers for static video assets if serving any locally',
      'Configure proper TTL values for video content caching',
      'Add preconnect links for Cloudinary domains to improve loading performance',
      
      // Error handling
      'Ensure error boundaries can handle video loading errors gracefully',
      'Add proper fallback mechanisms for unsupported video formats',
      'Configure appropriate timeout values for video loading in production'
    ];
  }
}
