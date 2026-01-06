import { useEffect, useRef } from "react";

export default function DetailPanel({ vuln, onClose }) {
  const panelRef = useRef(null);

  // ESC key + focus trap
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape") {
        onClose();
      }

      // Focus trap
      if (e.key === "Tab") {
        const focusable = panelRef.current.querySelectorAll(
          'button, a, input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (!focusable.length) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    // Auto-focus close button
    panelRef.current.querySelector("button")?.focus();

    return () =>
      window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const exp = vuln.risk_explanation;

  return (
    <>
      {/* BACKGROUND OVERLAY */}
      <div
        className="overlay"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* SLIDE-IN PANEL */}
      <aside
        className="detail-panel slide-in"
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="detail-title"
        onClick={e => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="close-btn"
          aria-label="Close details"
        >
          ×
        </button>

        <h3 id="detail-title">{vuln.cve_id}</h3>

        <p><b>CVSS:</b> {vuln.cvss}</p>
        <p>
          <b>AI Risk Score:</b>{" "}
          {vuln.ai_risk_score.toFixed(3)}
        </p>
        <p>
          <b>Vulnerability Age:</b>{" "}
          {vuln.vuln_age_days} days
        </p>

        {/* ---------------- EXPLANATION ---------------- */}

        <h4>Why this is prioritized</h4>

        {exp ? (
          <ul
            style={{
              fontSize: "0.85rem",
              lineHeight: "1.6"
            }}
          >
            <li>
              AI Risk Score:{" "}
              <strong>{exp.ai_risk_score}</strong>
            </li>
            <li>
              Asset Exposure:{" "}
              <strong>{exp.exposure}</strong>{" "}
              (×{exp.exposure_weight})
            </li>
            <li>
              Asset Criticality:{" "}
              <strong>{exp.criticality}</strong>{" "}
              (×{exp.criticality_weight})
            </li>
            <li>
              <strong>
                Final Risk Score:{" "}
                {vuln.final_risk_score.toFixed(2)}
              </strong>
            </li>
          </ul>
        ) : (
          <p className="hint">
            Risk explanation unavailable for this entry.
          </p>
        )}

        <p className="hint">
          Higher-ranked vulnerabilities are patched first
          based on exposure and asset importance.
        </p>

        {/* ---------------- FOOTER ---------------- */}

        <p className="hint">
          Press <b>Esc</b>, click <b>×</b>, or click outside
          to close
        </p>
      </aside>
    </>
  );
}
