// In-memory rate limiter. Per-instance only: in a multi-instance deployment,
// each instance tracks its own counts, so the effective limit scales with
// instance count. See the README for details.
const WINDOW_MS = 60 * 60 * 1000;
const MAX_REQUESTS = 5;
const MAX_ENTRIES = 5000;

const hits = new Map<string, number[]>();

function prune(now: number) {
  if (hits.size <= MAX_ENTRIES) return;
  for (const [key, timestamps] of hits) {
    const fresh = timestamps.filter((t) => now - t < WINDOW_MS);
    if (fresh.length === 0) hits.delete(key);
    else hits.set(key, fresh);
  }
}

export function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);

  if (timestamps.length >= MAX_REQUESTS) {
    hits.set(ip, timestamps);
    return true;
  }

  timestamps.push(now);
  hits.set(ip, timestamps);
  prune(now);
  return false;
}
