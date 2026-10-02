import {
  FINAL_FRAME,
  TOTAL_POINTS,
  FINDING_COUNT,
} from "@/components/hero/choreography";

const VIEW_W = 600;
const VIEW_H = 600;

export function StaticFrame() {
  return (
    <div
      role="img"
      aria-label={`${TOTAL_POINTS} raw observations resolved to ${FINDING_COUNT} confirmed findings.`}
      className="relative aspect-square w-full"
    >
      <svg
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        className="absolute inset-0 h-full w-full"
        aria-hidden="true"
      >
        <line
          x1={VIEW_W * 0.5}
          y1={VIEW_H * 0.05}
          x2={VIEW_W * 0.5}
          y2={VIEW_H * 0.95}
          stroke="var(--rule-strong)"
          strokeWidth={1}
          opacity={0.4}
        />
        <line
          x1={VIEW_W * 0.02}
          y1={VIEW_H * 0.92}
          x2={VIEW_W * 0.8}
          y2={VIEW_H * 0.92}
          stroke="var(--rule)"
          strokeWidth={1}
        />
        {FINAL_FRAME.map((point) => (
          <circle
            key={point.id}
            cx={point.x * VIEW_W}
            cy={point.y * VIEW_H}
            r={point.radius}
            fill={
              point.kind === "finding" ? "var(--accent)" : "var(--ink-soft)"
            }
            opacity={point.alpha}
          />
        ))}
      </svg>
      <div className="absolute bottom-0 left-0 flex flex-col">
        <span className="font-[family-name:var(--font-serif)] text-display-l tabular-nums text-ink">
          {FINDING_COUNT}
        </span>
        <span className="text-[15px] text-ink-soft">confirmed findings</span>
      </div>
    </div>
  );
}
