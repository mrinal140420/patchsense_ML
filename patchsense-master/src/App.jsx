import { useState, useMemo, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import data from "./data/dashboard_ready.json";

// Components
import Header from "./components/Header";
import PatchPlannerControls from "./components/PatchPlannerControls";
import RankedTable from "./components/RankedTable";
import DetailPanel from "./components/DetailPanel";
import CvssVsAiPlot from "./components/CvssVsAiPlot";
import PatchSchedule from "./components/PatchSchedule";
import DecisionStrip from "./components/DecisionStrip";
import CveUpload from "./components/CveUpload";
import Footer from "./components/Footer";
import Docs from "./components/Docs";

export default function App() {
  const [patchLimit, setPatchLimit] = useState(20);
  const [cvssBand, setCvssBand] = useState("ALL");
  const [weeks, setWeeks] = useState(4);
  const [selected, setSelected] = useState(null);
  const [schedule, setSchedule] = useState([]);
  const [uploadedCves, setUploadedCves] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [selectedForBatch, setSelectedForBatch] = useState(new Set());
  const [touchStart, setTouchStart] = useState(null);

  /* ============ TOAST NOTIFICATION ============ */
  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  /* ============ KEYBOARD SHORTCUTS ============ */
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === "Escape" && selected) {
        setSelected(null);
      }
      if (e.key === "?") {
        e.preventDefault();
        showToast("Keyboard: ↑↓=Navigate, Enter=Open, Esc=Close", "info");
      }
    };
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [selected]);

  /* ============ SWIPE GESTURE ============ */
  const handleTouchStart = (e) => setTouchStart(e.touches[0].clientX);
  const handleTouchEnd = (e) => {
    if (!touchStart) return;
    const touchEnd = e.changedTouches[0].clientX;
    if (touchStart - touchEnd > 50) {
      setSelected(null);
    }
  };

  /* ============ DATA PIPELINE ============ */

  const scopedData = useMemo(() => {
    // 1. Filter by Upload (if active)
    let base = uploadedCves
      ? data.filter((v) => uploadedCves.includes(v.cve_id))
      : data;

    // 2. Filter by Search
    if (searchTerm.trim()) {
      base = base.filter((v) =>
        v.cve_id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // 3. Filter by CVSS Band
    base = base.filter((v) => {
      if (cvssBand === "9") return v.cvss >= 9;
      if (cvssBand === "7") return v.cvss >= 7 && v.cvss < 9;
      return true;
    });

    // 4. Enrich with computed fields and sort by rank
    return base
      .map((v) => ({
        ...v,
        ai_priority: v.ai_patch_priority,
        ai_risk_score: v.ai_patch_priority,
        vuln_age_days: new Date().getFullYear() - v.year,
      }))
      .sort((a, b) => a.rank - b.rank);
  }, [uploadedCves, cvssBand, searchTerm]);

  // The "Top X" to patch today
  const today = scopedData.slice(0, patchLimit);

  /* ---------------- TRUST METRICS ---------------- */

  const uploadedCount = uploadedCves?.length || 0;
  const matchedCount = uploadedCves ? scopedData.length : 0;
  const unmatchedCount = uploadedCount - matchedCount;

  /* ============ SIMULATION ============ */
  function simulatePatching(sorted, limit, weeks) {
    const remaining = [...sorted];
    return Array.from({ length: weeks }, (_, i) => ({
      week: i + 1,
      vulnerabilities: remaining.splice(0, limit),
    }));
  }

  function runSimulation() {
    setLoading(true);
    setTimeout(() => {
      setSchedule(simulatePatching(scopedData, patchLimit, weeks));
      setLoading(false);
      showToast(`Simulation created: ${weeks} weeks`, "success");
    }, 500);
  }

  /* ============ EXPORT ============ */
  function exportWeeklyPlans(schedule) {
    if (!schedule || schedule.length === 0) return;

    try {
      schedule.forEach((week) => {
        const rows = week.vulnerabilities;
        if (rows.length === 0) return;
        const header = Object.keys(rows[0]).join(",");
        const csv = rows.map((r) => Object.values(r).join(","));
        const blob = new Blob([header + "\n" + csv.join("\n")], {
          type: "text/csv",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `week_${week.week}_patch_plan.csv`;
        a.click();
        URL.revokeObjectURL(url);
      });
      showToast(`Exported ${schedule.length} weeks`, "success");
    } catch (error) {
      showToast("Export failed. Try again.", "error");
    }
  }

  /* ============ BULK EXPORT SELECTED ============ */
  function exportSelectedCves() {
    if (selectedForBatch.size === 0) {
      showToast("No CVEs selected for export", "error");
      return;
    }

    try {
      const selectedCves = today.filter((v) => selectedForBatch.has(v.cve_id));
      const header = Object.keys(selectedCves[0]).join(",");
      const csv = selectedCves.map((r) => Object.values(r).join(","));
      const blob = new Blob([header + "\n" + csv.join("\n")], {
        type: "text/csv",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `selected_cves_${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      showToast(`Exported ${selectedForBatch.size} CVEs`, "success");
    } catch (error) {
      showToast("Bulk export failed. Try again.", "error");
    }
  }

  /* ============ BATCH SELECTION ============ */
  const toggleBatchSelect = (cveId) => {
    const newSet = new Set(selectedForBatch);
    if (newSet.has(cveId)) {
      newSet.delete(cveId);
    } else {
      newSet.add(cveId);
    }
    setSelectedForBatch(newSet);
  };

  const selectAll = () => {
    if (selectedForBatch.size === today.length) {
      setSelectedForBatch(new Set());
    } else {
      setSelectedForBatch(new Set(today.map((v) => v.cve_id)));
    }
  };

  return (
    <>
      <Header />

      {/* LOADING OVERLAY */}
      {loading && (
        <div className="loading-overlay">
          <div className="loading-content">
            <div className="loading-spinner"></div>
            <h2>Running Patch Simulation...</h2>
          </div>
        </div>
      )}

      {/* TOAST NOTIFICATION */}
      {toast && (
        <div className={`toast ${toast.type}`}>
          {toast.message}
        </div>
      )}

      <Routes>
        <Route
          path="/"
          element={
            <div className="container" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
              {/* Decision Strip */}
              <div className="decision-strip">
                <DecisionStrip today={today} schedule={schedule} />
              </div>

              {/* Upload CVEs */}
              <div className="upload-box">
                <CveUpload onUpload={setUploadedCves} />
                {uploadedCves && (
                  <div className="hint">
                    {uploadedCount} CVEs uploaded → {matchedCount} matched
                    {unmatchedCount > 0 && ` → ${unmatchedCount} not in dataset`}
                  </div>
                )}
              </div>

              {/* Search Bar */}
              <div className="search-box">
                <span className="search-icon">🔍</span>
                <input
                  type="search"
                  placeholder="Search CVE-ID (e.g., CVE-2024)..."
                  className="search-input"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Controls */}
              <div className="controls">
                <PatchPlannerControls
                  patchLimit={patchLimit}
                  setPatchLimit={setPatchLimit}
                  cvssBand={cvssBand}
                  setCvssBand={setCvssBand}
                  weeks={weeks}
                  setWeeks={setWeeks}
                  onSimulate={runSimulation}
                />
              </div>

              {/* Export */}
              {schedule.length > 0 && (
                <button
                  onClick={() => exportWeeklyPlans(schedule)}
                  style={{
                    marginTop: "16px",
                    padding: "10px 14px",
                    background: "#22c55e",
                    border: "none",
                    color: "#0f172a",
                    fontWeight: "600",
                    cursor: "pointer",
                    borderRadius: "6px",
                    width: "100%",
                  }}
                >
                  Export Weekly Patch Plan (CSV)
                </button>
              )}

              {/* Bulk Export Selected */}
              {selectedForBatch.size > 0 && (
                <button
                  onClick={exportSelectedCves}
                  style={{
                    marginTop: "16px",
                    padding: "10px 14px",
                    background: "#3b82f6",
                    border: "none",
                    color: "#ffffff",
                    fontWeight: "600",
                    cursor: "pointer",
                    borderRadius: "6px",
                    width: "100%",
                  }}
                >
                  Export Selected CVEs ({selectedForBatch.size})
                </button>
              )}

              {/* Patch Today */}
              <section className="today-section">
                <h3>
                  Patch Today
                  <button
                    onClick={selectAll}
                    style={{
                      marginLeft: "auto",
                      padding: "4px 8px",
                      fontSize: "0.75rem",
                      background: "rgba(34, 211, 238, 0.2)",
                      border: "1px solid #22d3ee",
                      color: "#22d3ee",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    {selectedForBatch.size === today.length && today.length > 0
                      ? "Deselect All"
                      : "Select All"}
                  </button>
                </h3>
                <RankedTable
                  data={today}
                  onSelect={setSelected}
                  patchLimit={patchLimit}
                  selectedForBatch={selectedForBatch}
                  onBatchToggle={toggleBatchSelect}
                />
              </section>

              {/* Detail Panel + Overlay */}
              {selected && (
                <>
                  <div
                    className="overlay"
                    onClick={() => setSelected(null)}
                  />
                  <DetailPanel
                    vuln={selected}
                    onClose={() => setSelected(null)}
                  />
                </>
              )}

              {/* Patch Schedule */}
              {schedule.length > 0 && <PatchSchedule schedule={schedule} />}

              {/* Chart */}
              <div className="chart-panel">
                <CvssVsAiPlot data={scopedData} />
              </div>
            </div>
          }
        />

        <Route path="/docs" element={<Docs />} />
      </Routes>

      <Footer />
    </>
  );
}