import { facts } from "@/content/facts";

export const TOTAL_POINTS = facts.signalResult.raw;
export const FINDING_COUNT = facts.signalResult.verified;
export const TIMELINE_SECONDS = 3.2;
export const HOLD_SECONDS = 2.6;
export const FADE_SECONDS = 0.5;
export const LOOP_SECONDS = TIMELINE_SECONDS + HOLD_SECONDS + FADE_SECONDS;

/**
 * Maps real elapsed time onto the repeating loop: converge, hold, fade to
 * black, then jump back to the scattered start and fade back in. Returns the
 * in-loop time (for getFrame) and a global alpha multiplier (for the fade).
 */
export function getLoopState(elapsed: number): { t: number; loopAlpha: number } {
  const cursor = elapsed % LOOP_SECONDS;
  const fadeStart = TIMELINE_SECONDS + HOLD_SECONDS;
  if (cursor < fadeStart) {
    return { t: cursor, loopAlpha: 1 };
  }
  const fadeProgress = (cursor - fadeStart) / FADE_SECONDS;
  // First half of the fade window dims the settled frame; second half rises
  // back from the scattered (t=0) frame, so the reposition happens unseen.
  if (fadeProgress < 0.5) {
    return { t: fadeStart, loopAlpha: 1 - fadeProgress * 2 };
  }
  return { t: 0, loopAlpha: (fadeProgress - 0.5) * 2 };
}

export type PointFrame = {
  id: number;
  kind: "observation" | "finding";
  /** Normalized 0..1 within the visual's bounding box. */
  x: number;
  y: number;
  /** Normalized 0..1 depth, used only by the WebGL renderer for parallax. */
  z: number;
  radius: number;
  alpha: number;
};

// Deterministic PRNG so the server-rendered static frame and every client
// renderer produce identical point placement.
function mulberry32(seed: number) {
  let a = seed;
  return function random() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rand = mulberry32(TOTAL_POINTS);

type PointPlan = {
  id: number;
  kind: "observation" | "finding";
  scatter: { x: number; y: number; z: number };
  settle: { x: number; y: number };
  baseRadius: number;
  mergesWith: number | null;
};

function buildPlan(): PointPlan[] {
  const order = Array.from({ length: TOTAL_POINTS }, (_, i) => i);
  // Fisher-Yates shuffle, seeded, to choose which indices become findings.
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  const findingIds = new Set(order.slice(0, FINDING_COUNT));

  const observationIds = order.slice(FINDING_COUNT).sort((a, b) => a - b);
  const findingIdsSorted = Array.from(findingIds).sort((a, b) => a - b);

  // About 60 observation points merge in pairs before settling.
  const mergeCandidates = [...observationIds];
  const mergeMap = new Map<number, number>();
  const targetMerges = Math.min(60, Math.floor(mergeCandidates.length / 2));
  for (let i = 0; i < targetMerges; i++) {
    const a = mergeCandidates[i * 2];
    const b = mergeCandidates[i * 2 + 1];
    if (a === undefined || b === undefined) break;
    mergeMap.set(b, a);
  }

  const plans: PointPlan[] = [];

  observationIds.forEach((id, index) => {
    const slot = index / Math.max(1, observationIds.length - 1);
    plans.push({
      id,
      kind: "observation",
      scatter: {
        x: 0.05 + rand() * 0.9,
        y: 0.08 + rand() * 0.6,
        z: rand(),
      },
      settle: { x: 0.04 + slot * 0.74, y: 0.9 },
      baseRadius: 3 + rand() * 2,
      mergesWith: mergeMap.get(id) ?? null,
    });
  });

  findingIdsSorted.forEach((id, index) => {
    const slot =
      findingIdsSorted.length > 1 ? index / (findingIdsSorted.length - 1) : 0.5;
    plans.push({
      id,
      kind: "finding",
      scatter: {
        x: 0.1 + rand() * 0.8,
        y: 0.1 + rand() * 0.6,
        z: rand(),
      },
      settle: { x: 0.84 + rand() * 0.04, y: 0.15 + slot * 0.63 },
      baseRadius: 9,
      mergesWith: null,
    });
  });

  return plans.sort((a, b) => a.id - b.id);
}

const plan = buildPlan();

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

function clamp01(v: number): number {
  return Math.max(0, Math.min(1, v));
}

/**
 * Pure function of time. Returns every point's position, size, and alpha at
 * time t (seconds, 0..TIMELINE_SECONDS or beyond for the idle loop).
 */
export function getFrame(t: number): PointFrame[] {
  return plan.map((p) => {
    if (p.kind === "finding") {
      const fadeIn = clamp01(t / 0.6);
      const travel = easeOutCubic(clamp01((t - 0.6) / 2.2));
      const x = lerp(p.scatter.x, p.settle.x, travel);
      const y = lerp(p.scatter.y, p.settle.y, travel);
      const scale = lerp(1, 1.8, easeOutCubic(clamp01((t - 1.9) / 0.9)));
      const idleAlpha =
        t > TIMELINE_SECONDS
          ? 0.85 +
            0.15 *
              (0.5 +
                0.5 * Math.sin((t - TIMELINE_SECONDS) * ((Math.PI * 2) / 4)))
          : 1;
      return {
        id: p.id,
        kind: p.kind,
        x,
        y,
        z: p.scatter.z,
        radius: p.baseRadius * scale,
        alpha: Math.min(fadeIn, idleAlpha),
      };
    }

    const fadeIn = clamp01(t / 0.6);
    const travel = easeOutCubic(clamp01((t - 0.6) / 1.3));
    let targetX = p.settle.x;
    if (p.mergesWith !== null) {
      const partner = plan.find((other) => other.id === p.mergesWith);
      if (partner) targetX = lerp(p.settle.x, partner.settle.x, 0.5);
    }
    const x = lerp(p.scatter.x, targetX, travel);
    const y = lerp(p.scatter.y, p.settle.y, travel);
    const dim = p.mergesWith !== null ? lerp(1, 0.55, travel) : 1;
    const idleDrift =
      t > TIMELINE_SECONDS
        ? Math.sin((t - TIMELINE_SECONDS) * ((Math.PI * 2) / 6) + p.id) * 0.004
        : 0;
    return {
      id: p.id,
      kind: p.kind,
      x: x,
      y: y + idleDrift,
      z: p.scatter.z,
      radius: p.baseRadius,
      alpha: fadeIn * dim * 0.5,
    };
  });
}

export function getCounterValue(t: number): number {
  const progress = easeOutCubic(clamp01((t - 0.6) / 2.2));
  const value = Math.round(lerp(TOTAL_POINTS, FINDING_COUNT, progress));
  return value;
}

export const FINAL_FRAME = getFrame(TIMELINE_SECONDS);
