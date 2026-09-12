/**
 * CodeQuest — In-Memory Sliding Window Rate Limiter
 */

interface RateLimitRecord {
  count: number;
  resetAt: number;
}

const rateLimitMap = new Map<string, RateLimitRecord>();

// Cleanup stale entries every 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of rateLimitMap.entries()) {
      if (now > record.resetAt) {
        rateLimitMap.delete(key);
      }
    }
  }, 5 * 60 * 1000).unref();
}

export interface RateLimitOptions {
  windowMs?: number; // default: 60,000 ms (1 min)
  max?: number;      // default: 60 requests per window
}

export function checkRateLimit(
  key: string,
  options: RateLimitOptions = {}
): { allowed: boolean; remaining: number; resetAt: number } {
  const windowMs = options.windowMs || 60_000;
  const max = options.max || 60;
  const now = Date.now();

  const record = rateLimitMap.get(key);

  if (!record || now > record.resetAt) {
    rateLimitMap.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: max - 1, resetAt: now + windowMs };
  }

  if (record.count >= max) {
    return { allowed: false, remaining: 0, resetAt: record.resetAt };
  }

  record.count += 1;
  return { allowed: true, remaining: max - record.count, resetAt: record.resetAt };
}
