// src/components/CvssVsAiPlot.jsx

import { useState, useMemo, useRef, useEffect } from "react";

const MAX_POINTS = 5000;

const getColor = (p) => {
  if (p >= 0.7) return "#ef4444";   // CRITICAL
  if (p >= 0.45) return "#f59e0b";  // HIGH
  if (p >= 0.25) return "#22c55e";  // MEDIUM
  return "#3b82f6";                 // LOW
};

export default function CvssVsAiPlot({ data = [] }) {
  if (!data.length) return null;

  /* ---------------- RESPONSIVE DIMENSIONS ---------------- */

  const [dimensions, setDimensions] = useState({
    width: 800,
    height: 400,
  });

  const containerRef = useRef(null);
  const svgRef = useRef(null);

  // Update dimensions on mount and window resize
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const containerWidth = rect.width || 800;
        
        // Responsive sizing: maintain aspect ratio
        const newWidth = Math.max(300, Math.min(containerWidth - 40, 900));
        const newHeight = Math.max(250, newWidth * 0.5);
        
        setDimensions({
          width: newWidth,
          height: newHeight,
        });
      }
    };

    updateDimensions();
    const resizeObserver = new ResizeObserver(updateDimensions);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => resizeObserver.disconnect();
  }, []);

  /* ---------------- CONSTANTS & PADDING ---------------- */

  const padding = dimensions.width > 500 ? 60 : 45;
  const maxCvss = 10;

  const [hovered, setHovered] = useState(null);

  /* ---------------- DATA HYGIENE ---------------- */

  const plotData = useMemo(() => {
    const clean = data.filter(
      v =>
        typeof v.cvss === "number" && !isNaN(v.cvss) &&
        typeof v.ai_patch_priority === "number" && !isNaN(v.ai_patch_priority)
    );

    if (clean.length <= MAX_POINTS) return clean;

    // Downsample uniformly to preserve distribution
    const step = Math.ceil(clean.length / MAX_POINTS);
    return clean.filter((_, i) => i % step === 0);
  }, [data]);

  /* ---------------- COORDINATES ---------------- */

  const toX = (cvss) =>
    padding + (cvss / maxCvss) * (dimensions.width - 2 * padding);

  const toY = (priority) =>
    dimensions.height - padding - priority * (dimensions.height - 2 * padding);

  /* ---------------- UI ---------------- */

  return (
    <div className="chart-panel">
      <h3>CVSS vs AI Risk Score</h3>

      <div className="chart-wrapper" ref={containerRef}>
        {hovered && (
          <div
            className="chart-tooltip"
            style={{
              left: hovered.clientX,
              top: hovered.clientY
            }}
          >
            <strong>{hovered.data.cve_id}</strong>
            <div>CVSS: {hovered.data.cvss.toFixed(1)}</div>
            <div>AI Priority: {hovered.data.ai_patch_priority.toFixed(3)}</div>
          </div>
        )}

        <svg
          ref={svgRef}
          viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
          preserveAspectRatio="xMidYMid meet"
          style={{ maxWidth: "100%" }}
          onMouseLeave={() => setHovered(null)}
        >
          {/* Y GRID */}
          {[0, 0.25, 0.5, 0.75, 1].map((tick) => {
            const y = toY(tick);
            return (
              <g key={`y-${tick}`}>
                <line
                  x1={padding}
                  y1={y}
                  x2={dimensions.width - padding}
                  y2={y}
                  stroke="#334155"
                  strokeDasharray="4 4"
                  opacity="0.5"
                />
                <text
                  x={padding - 10}
                  y={y + 4}
                  textAnchor="end"
                  fill="#64748b"
                  fontSize={dimensions.width > 500 ? "12" : "10"}
                >
                  {tick}
                </text>
              </g>
            );
          })}

          {/* X GRID */}
          {[0, 2, 4, 6, 8, 10].map((tick) => {
            const x = toX(tick);
            return (
              <g key={`x-${tick}`}>
                <line
                  x1={x}
                  y1={padding}
                  x2={x}
                  y2={dimensions.height - padding}
                  stroke="#334155"
                  strokeDasharray="4 4"
                  opacity="0.5"
                />
                <text
                  x={x}
                  y={dimensions.height - padding + 20}
                  textAnchor="middle"
                  fill="#64748b"
                  fontSize={dimensions.width > 500 ? "12" : "10"}
                >
                  {tick}
                </text>
              </g>
            );
          })}

          {/* AXES */}
          <line
            x1={padding}
            y1={dimensions.height - padding}
            x2={dimensions.width - padding}
            y2={dimensions.height - padding}
            stroke="#94a3b8"
            strokeWidth="2"
          />
          <line
            x1={padding}
            y1={padding}
            x2={padding}
            y2={dimensions.height - padding}
            stroke="#94a3b8"
            strokeWidth="2"
          />

          {/* POINTS */}
          {plotData.map((v) => {
            const x = toX(v.cvss);
            const y = toY(v.ai_patch_priority);
            const radius = dimensions.width > 500 ? 4 : 3;

            return (
              <circle
                key={v.cve_id}
                cx={x}
                cy={y}
                r={radius}
                fill={getColor(v.ai_patch_priority)}
                opacity={0.75}
                style={{ cursor: "pointer", transition: "opacity 0.2s ease" }}
                onMouseEnter={(e) =>
                  setHovered({
                    data: v,
                    clientX: e.clientX + 12,
                    clientY: e.clientY - 12
                  })
                }
              />
            );
          })}

          {/* LABELS */}
          <text
            x={dimensions.width / 2}
            y={dimensions.height - 10}
            textAnchor="middle"
            fill="#e2e8f0"
            fontSize={dimensions.width > 500 ? "14" : "12"}
          >
            CVSS Severity Score
          </text>

          <text
            x={-dimensions.height / 2}
            y={20}
            transform="rotate(-90)"
            textAnchor="middle"
            fill="#e2e8f0"
            fontSize={dimensions.width > 500 ? "14" : "12"}
          >
            AI Patch Priority (0–1)
          </text>
        </svg>
      </div>

      {/* LEGEND */}
      <div className="chart-legend">
        <div className="legend-item">
          <div className="legend-color" style={{ background: "#ef4444" }}></div>
          <span><strong>Critical</strong> 0.7–1.0</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ background: "#f59e0b" }}></div>
          <span><strong>High</strong> 0.45–0.7</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ background: "#22c55e" }}></div>
          <span><strong>Medium</strong> 0.25–0.45</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ background: "#3b82f6" }}></div>
          <span><strong>Low</strong> 0–0.25</span>
        </div>
      </div>
    </div>
  );
}