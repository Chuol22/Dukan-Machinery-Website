// rate-limit.ts — In-memory rate limiting utility for API routes

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

export interface RateLimitOptions {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Maximum requests per window
}

export function checkRateLimit(
  identifier: string,
  options: RateLimitOptions,
): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now();
  const entry = rateLimitStore.get(identifier);

  // Clean up expired entries
  if (entry && now > entry.resetTime) {
    rateLimitStore.delete(identifier);
  }

  const currentEntry = rateLimitStore.get(identifier);

  if (!currentEntry) {
    // First request in window
    rateLimitStore.set(identifier, {
      count: 1,
      resetTime: now + options.windowMs,
    });
    return {
      allowed: true,
      remaining: options.maxRequests - 1,
      resetTime: now + options.windowMs,
    };
  }

  if (currentEntry.count >= options.maxRequests) {
    // Rate limit exceeded
    return {
      allowed: false,
      remaining: 0,
      resetTime: currentEntry.resetTime,
    };
  }

  // Increment count
  currentEntry.count++;
  return {
    allowed: true,
    remaining: options.maxRequests - currentEntry.count,
    resetTime: currentEntry.resetTime,
  };
}

// Helper function to get client identifier from request
export function getClientIdentifier(request: Request): string {
  // Try to get IP from various headers
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const cfConnectingIp = request.headers.get('cf-connecting-ip');
  
  const ip = forwarded?.split(',')[0] || realIp || cfConnectingIp || 'unknown';
  
  // Also consider user agent for more specific identification
  const userAgent = request.headers.get('user-agent') || 'unknown';
  
  return `${ip}:${userAgent}`;
}

// Pre-configured rate limiters for common use cases
export const rateLimiters = {
  // Strict rate limiting for sensitive operations (e.g., login, order submission)
  strict: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 5,
  },
  // Moderate rate limiting for general API calls
  moderate: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 100,
  },
  // Lenient rate limiting for public endpoints
  lenient: {
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 1000,
  },
};
