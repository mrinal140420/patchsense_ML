import { useEffect, useState } from "react";

export default function RankedTable({ 
  data, 
  onSelect, 
  patchLimit, 
  selectedForBatch = new Set(), 
  onBatchToggle 
}) {
  const [activeIndex, setActiveIndex] = useState(0);

  // Safe number formatter
  const fmt = (value, digits = 2) =>
    typeof value === "number" ? value.toFixed(digits) : "—";

  // Keyboard navigation
  useEffect(() => {
    function handleKey(e) {
      if (!data || data.length === 0) return;

      if (e.key === "ArrowDown") {
        setActiveIndex(i => Math.min(i + 1, data.length - 1));
      }

      if (e.key === "ArrowUp") {
        setActiveIndex(i => Math.max(i - 1, 0));
      }

      if (e.key === "Enter") {
        const selected = data[activeIndex];
        if (selected) {
          onSelect(selected);
        }
      }
    }

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [activeIndex, data, onSelect]);

  return (
    <table>
      <thead>
        <tr>
          <th style={{ width: "30px" }}>✓</th>
          <th>Rank</th>
          <th>CVE</th>
          <th>CVSS</th>
          <th>AI Risk</th>
          <th>Age (days)</th>
          <th>Priority</th>
        </tr>
      </thead>

      <tbody>
        {data.map((v, i) => {
          const isSelected = selectedForBatch.has(v.cve_id);
          return (
            <tr
              key={v.cve_id}
              onClick={() => onSelect(v)}
              className={`
                ${i === activeIndex ? "row-active" : ""}
                ${i < patchLimit ? "row-patch" : ""}
                ${isSelected ? "row-selected" : ""}
              `}
              style={isSelected ? { opacity: 0.7, background: "rgba(34, 211, 238, 0.15)" } : {}}
            >
              <td style={{ textAlign: "center" }}>
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={(e) => {
                    e.stopPropagation();
                    if (onBatchToggle) onBatchToggle(v.cve_id);
                  }}
                  className="batch-checkbox"
                />
              </td>
              <td>{i + 1}</td>
              <td>{v.cve_id}</td>
              <td>{fmt(v.cvss, 1)}</td>
              <td>{fmt(v.ai_risk_score, 3)}</td>
              <td>{typeof v.vuln_age_days === "number" ? v.vuln_age_days : "—"}</td>
              <td>{v.ai_priority ?? "—"}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
