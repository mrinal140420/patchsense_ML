export default function PatchPlannerControls({
  patchLimit,
  setPatchLimit,
  cvssBand,
  setCvssBand,
  weeks,
  setWeeks,
  onSimulate
}) {
  return (
    <div className="controls">
      {/* Patch capacity */}
      <div className="control-group">
        <label className="control-label">
          <span className="label-text">Patch Capacity</span>
          <span className="label-value">{patchLimit} / week</span>
        </label>
        <input
          type="range"
          min="5"
          max="50"
          value={patchLimit}
          onChange={e => setPatchLimit(Number(e.target.value))}
          className="slider"
        />
        <div className="slider-track"></div>
      </div>

      {/* CVSS band filter */}
      <div className="control-group">
        <label className="control-label">
          <span className="label-text">Severity Filter</span>
        </label>
        <select
          value={cvssBand}
          onChange={e => setCvssBand(e.target.value)}
          className="control-select"
        >
          <option value="ALL">All Severities</option>
          <option value="9">9–10 Critical Only</option>
          <option value="7">7–8.9 High & Critical</option>
        </select>
      </div>

      {/* Weeks selector */}
      <div className="control-group">
        <label className="control-label">
          <span className="label-text">Planning Window</span>
        </label>
        <select
          value={weeks}
          onChange={e => setWeeks(Number(e.target.value))}
          className="control-select"
        >
          <option value={1}>1 week</option>
          <option value={2}>2 weeks</option>
          <option value={4}>4 weeks</option>
          <option value={8}>8 weeks</option>
        </select>
      </div>

      {/* Run simulation */}
      <button
        onClick={onSimulate}
        className="btn-simulate"
      >
        <span>▶</span> Run Simulation
      </button>
    </div>
  );
}
