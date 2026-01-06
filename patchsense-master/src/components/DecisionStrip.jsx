// src/components/DecisionStrip.jsx

export default function DecisionStrip({ today = [], schedule = [] }) {
  /* ---------------- METRICS ---------------- */

  const count = today.length;

  const urgencyScore = count
    ? today.reduce((s, v) => s + (typeof v.ai_patch_priority === "number" ? v.ai_patch_priority : 0), 0)
    : 0;

  const avgPriority = count
    ? urgencyScore / count
    : 0;

  const totalPlanned = schedule.length
    ? schedule.reduce(
        (s, w) => s + w.vulnerabilities.length,
        0
      )
    : 0;

  /* ---------------- UI ---------------- */

  return (
    <div className="decision-strip">
      <div>
        <strong>Patch Today</strong>
        <div className="metric">{count}</div>
      </div>

      <div>
        <strong>Avg Risk</strong> {/* Changed label to match screenshot; revert if needed */}
        <div className="metric">
          {isNaN(avgPriority) ? "N/A" : avgPriority.toFixed(3)}
        </div>
      </div>

      <div>
        <strong>Patch Urgency Score</strong>
        <div className="metric">
          {isNaN(urgencyScore) ? "N/A" : urgencyScore.toFixed(2)}
        </div>
      </div>

      <div>
        <strong>Planned</strong>
        <div className="metric">{totalPlanned}</div>
      </div>
    </div>
  );
}