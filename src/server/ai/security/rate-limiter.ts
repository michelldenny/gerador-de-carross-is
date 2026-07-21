import "server-only";

interface RateLimitRecord {
  timestamps: number[];
}

const windowMs = 60_000; // 1 minuto
const maxRequests = Number(process.env.RATE_LIMIT_PER_MINUTE || 5);
const storage = new Map<string, RateLimitRecord>();

export function checkRateLimit(key: string): {
  success: boolean;
  limit: number;
  remaining: number;
  retryAfterSeconds: number;
} {
  const now = Date.now();
  const record = storage.get(key) || { timestamps: [] };

  // Filtra apenas timestamps dentro da janela atual
  const validTimestamps = record.timestamps.filter((ts) => now - ts < windowMs);

  if (validTimestamps.length >= maxRequests) {
    const oldest = validTimestamps[0];
    const retryAfterSeconds = Math.ceil((oldest + windowMs - now) / 1000);

    return {
      success: false,
      limit: maxRequests,
      remaining: 0,
      retryAfterSeconds: Math.max(1, retryAfterSeconds),
    };
  }

  validTimestamps.push(now);
  storage.set(key, { timestamps: validTimestamps });

  return {
    success: true,
    limit: maxRequests,
    remaining: maxRequests - validTimestamps.length,
    retryAfterSeconds: 0,
  };
}

export function resetRateLimiterForTesting() {
  storage.clear();
}
