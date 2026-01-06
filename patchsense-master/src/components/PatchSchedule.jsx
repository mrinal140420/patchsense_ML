import { useState } from "react";

export default function PatchSchedule({ schedule }) {
  const [openWeek, setOpenWeek] = useState(null);

  if (!schedule || schedule.length === 0) return null;

  function analytics(vulns) {
    const avg =
      vulns.reduce((s, v) => s + v.ai_risk_score, 0) / vulns.length;
    const max = Math.max(...vulns.map(v => v.ai_risk_score));

    return {
      count: vulns.length,
      avg: avg.toFixed(3),
      max: max.toFixed(3)
    };
  }

  return (
    <div style={{ marginTop: "40px" }}>
      <h3>Week-by-Week Patch Simulation</h3>

      {schedule.map(week => {
        const stats = analytics(week.vulnerabilities);
        const isOpen = openWeek === week.week;

        return (
          <div
            key={week.week}
            style={{
              marginBottom: "12px",
              background: "#111827",
              border: "1px solid #1f2933",
              borderRadius: "8px",
              overflow: "hidden"
            }}
          >
            {/* CARD HEADER */}
            <div
              onClick={() =>
                setOpenWeek(isOpen ? null : week.week)
              }
              style={{
                padding: "12px 16px",
                cursor: "pointer",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                background: "#0f172a"
              }}
            >
              <div>
                <strong>Week {week.week}</strong>
                <div
                  style={{
                    fontSize: "0.85rem",
                    color: "#9ca3af",
                    marginTop: "4px"
                  }}
                >
                  {stats.count} vulns · Avg risk {stats.avg} · Max risk{" "}
                  {stats.max}
                </div>
              </div>

              <div style={{ fontSize: "18px", color: "#9ca3af" }}>
                {isOpen ? "▾" : "▸"}
              </div>
            </div>

            {/* CARD BODY */}
            {isOpen && (
              <div style={{ padding: "12px 20px" }}>
                <ul style={{ paddingLeft: "18px" }}>
                  {week.vulnerabilities.map(v => (
                    <li
                      key={v.cve_id}
                      style={{ marginBottom: "6px" }}
                    >
                      {v.cve_id} — AI Risk{" "}
                      <b>{v.ai_risk_score.toFixed(3)}</b>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
