// Rate limiting utilities
import { NextRequest, NextResponse } from 'next/server';

// Simple in-memory rate limiter (for development/demo purposes)
// In production, use Redis or a dedicated rate limiting service
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 10; // 10 requests per minute

export function checkRateLimit(request: NextRequest, identifier?: string): boolean {
  const ip = request.headers.get('x-forwarded-for') ||
             request.headers.get('x-real-ip') ||
             'unknown';
  const key = identifier || ip;

  const now = Date.now();
  const existing = rateLimitMap.get(key);

  if (!existing || now > existing.resetTime) {
    // First request or window expired
    rateLimitMap.set(key, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW
    });
    return true;
  }

  if (existing.count >= RATE_LIMIT_MAX_REQUESTS) {
    return false; // Rate limit exceeded
  }

  existing.count++;
  return true;
}

export function createRateLimitResponse(): NextResponse {
  return NextResponse.json(
    { error: 'Too many requests. Please try again later.' },
    {
      status: 429,
      headers: {
        'Retry-After': (RATE_LIMIT_WINDOW / 1000).toString(),
        'X-RateLimit-Limit': RATE_LIMIT_MAX_REQUESTS.toString(),
      }
    }
  );
}

// Clean up expired entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of rateLimitMap.entries()) {
    if (now > value.resetTime) {
      rateLimitMap.delete(key);
    }
  }
}, RATE_LIMIT_WINDOW);
