export default function Docs() {
  return (
    <div className="container docs">
      <header className="docs-header">
        <h2>PatchSense</h2>
        <p className="subtitle">AI-Driven Vulnerability Patch Prioritization</p>
        <p>
          Help SOC teams decide which vulnerabilities to patch first, not whether they're severe.
        </p>
      </header>

      <section>
        <h3>Why PatchSense?</h3>
        <h4>The Problem</h4>
        <p>
          Security teams face a hard reality: <strong>CVSS scores alone don't answer the key question</strong>.
        </p>
        <div className="warning">
          <strong>Even when CVSS = 10, teams still ask:</strong><br/>
          "Which CVE do we patch first? We can only handle 20 this week."
        </div>
        <p>
          CVSS measures <em>technical severity</em>, not operational risk. In real environments, what matters is:
        </p>
        <ul>
          <li><strong>Exposure:</strong> Can an attacker even reach the vulnerable asset?</li>
          <li><strong>Criticality:</strong> How much business impact if it's compromised?</li>
          <li><strong>Exploitability Patterns:</strong> Are similar CVEs being actively exploited?</li>
        </ul>

        <h4>The Solution</h4>
        <p>PatchSense combines CVSS with AI-driven risk signals to help you:</p>
        <div className="success">
          ✓ <strong>Rank vulnerabilities operationally</strong> — Not just by severity<br/>
          ✓ <strong>Break ties within CVSS bands</strong> — Which CVSS 9.0 matters most?<br/>
          ✓ <strong>Plan patch capacity efficiently</strong> — Reduce risk per week<br/>
          ✓ <strong>Defend your prioritization</strong> — Transparent, auditable logic
        </div>
      </section>

      <section>
        <h3>Understanding the Metrics</h3>

        <h4>📊 PATCH TODAY</h4>
        <div className="metric-box">
          <strong>Count:</strong> How many vulnerabilities you've decided to patch in your current plan.
        </div>

        <h4>📈 AVG RISK</h4>
        <div className="metric-box">
          <strong>Average AI Risk Score:</strong> The mean likelihood of exploitation for vulnerabilities in your plan.<br/>
          <em>Range: 0.0 (unlikely) to 1.0 (highly likely)</em>
        </div>

        <h4>⚡ PATCH URGENCY SCORE</h4>
        <div className="metric-box">
          <strong>Priority Index:</strong> Weighted blend of CVSS, AI Risk, and asset context.<br/>
          <em>Higher = patch sooner</em>
        </div>

        <h4>📅 PLANNED</h4>
        <div className="metric-box">
          <strong>Simulated Weeks:</strong> How many weekly patch cycles you've planned (up to 4 weeks).
        </div>

        <h4>🎯 CVE Fields in Table</h4>
        <ul>
          <li><strong>Rank:</strong> Overall priority order (lower = patch first)</li>
          <li><strong>CVE:</strong> CVE-ID for tracking</li>
          <li><strong>CVSS:</strong> NIST CVSS base score (0–10)</li>
          <li><strong>AI Risk:</strong> Predicted exploitation likelihood (0–1)</li>
          <li><strong>Age (days):</strong> How long the CVE has been disclosed</li>
          <li><strong>Priority:</strong> AI Risk score (what we prioritize)</li>
        </ul>
      </section>

      <section>
        <h3>The PatchSense Approach</h3>

        <h4>What PatchSense DOES</h4>
        <ul>
          <li>✓ Help SOC analysts decide <strong>patch order</strong></li>
          <li>✓ Provide <strong>defensible, auditable</strong> prioritization</li>
          <li>✓ Combine multiple signals: CVSS + AI Risk + Asset Context</li>
          <li>✓ Simulate patch capacity planning (weekly plans)</li>
          <li>✓ Export prioritized lists for your ticketing system</li>
        </ul>

        <h4>What PatchSense DOES NOT</h4>
        <div className="warning">
          <ul>
            <li>✗ Replace CVSS scores</li>
            <li>✗ Invent new "risk formulas" — We use proven signals</li>
            <li>✗ Detect vulnerabilities — You provide the CVE list</li>
            <li>✗ Claim absolute truth — Prioritization is contextual</li>
          </ul>
        </div>
      </section>

      <section>
        <h3>How to Use PatchSense</h3>

        <h4>Step 1: Upload Your CVE List</h4>
        <p>
          Upload a CSV or TXT file from your scanner (Nessus, Qualys, OpenVAS, etc.).
          Format: One CVE-ID per line (e.g., <code>CVE-2024-1234</code>).
        </p>

        <h4>Step 2: Filter by Severity Band</h4>
        <ul>
          <li><strong>ALL:</strong> All severity levels</li>
          <li><strong>7–8:</strong> High severity (CVSS 7.0–8.9)</li>
          <li><strong>9–10:</strong> Critical severity (CVSS 9.0+)</li>
        </ul>

        <h4>Step 3: Set Patch Capacity</h4>
        <p>
          How many CVEs can your team patch per week? (Default: 20)
          This helps you simulate realistic patch plans.
        </p>

        <h4>Step 4: Run Simulation & Export</h4>
        <p>
          Click <strong>Run Patch Simulation</strong> to create a weekly breakdown.
          Export each week's plan as CSV for your ticketing system.
        </p>

        <h4>Keyboard Shortcuts</h4>
        <ul>
          <li><strong>↑ / ↓:</strong> Navigate table rows</li>
          <li><strong>Enter:</strong> Open details for selected CVE</li>
          <li><strong>Esc:</strong> Close details panel</li>
          <li><strong>?:</strong> Show help (coming soon)</li>
        </ul>
      </section>

      <section>
        <h3>The Scoring Formula</h3>

        <h4>Risk Calculation</h4>
        <div className="formula">
          <strong>Operational Risk Score =</strong><br/>
          (CVSS Score / 10) × AI Risk Score × Asset Exposure × Asset Criticality
        </div>

        <h4>Breaking It Down</h4>
        <ul>
          <li>
            <strong>CVSS Score / 10:</strong> Normalized technical severity (0–1)
          </li>
          <li>
            <strong>AI Risk Score:</strong> Predicted exploitation likelihood based on:
            <ul>
              <li>Historical CVE patterns</li>
              <li>Attacker behavior data</li>
              <li>Public exploit availability</li>
            </ul>
          </li>
          <li>
            <strong>Asset Exposure:</strong> Is it internet-facing? (Weight: 0.5–1.0)
          </li>
          <li>
            <strong>Asset Criticality:</strong> Business impact if compromised (Weight: 0.5–1.0)
          </li>
        </ul>

        <p className="note">
          <strong>Example:</strong> A CVSS 7.5 on a critical, exposed asset might rank higher than
          a CVSS 9.0 on an internal, non-critical system if historical data shows the CVSS 7.5 is
          being actively exploited.
        </p>
      </section>

      <section>
        <h3>Patch Planning Logic</h3>

        <p>
          Once prioritized, vulnerabilities are grouped into weekly patch cycles based on your team's capacity:
        </p>

        <div className="metric-box">
          <strong>Week 1:</strong> Top 20 CVEs (or your capacity) in priority order<br/>
          <strong>Week 2:</strong> Next 20 CVEs<br/>
          <strong>Week 3–4:</strong> Remaining batches
        </div>

        <p>
          This approach ensures:
        </p>
        <ul>
          <li>Highest-risk vulnerabilities are patched first</li>
          <li>Patch operations stay within team capacity</li>
          <li>Risk reduction is measurable week-by-week</li>
          <li>Planning is defensible to management</li>
        </ul>
      </section>

      <section>
        <h3>Feature Guide</h3>

        <h4>🔍 Search CVEs</h4>
        <p>
          Type a CVE-ID (e.g., "CVE-2024") in the search box to quickly find vulnerabilities.
        </p>

        <h4>📊 CVSS vs AI Risk Plot</h4>
        <p>
          Visualize the relationship between CVSS scores and AI Risk predictions:
        </p>
        <ul>
          <li><strong>Red (0.7–1.0):</strong> Critical risk — Patch immediately</li>
          <li><strong>Orange (0.45–0.7):</strong> High risk — Patch soon</li>
          <li><strong>Green (0.25–0.45):</strong> Medium risk — Plan next</li>
          <li><strong>Blue (0–0.25):</strong> Low risk — Patch if capacity</li>
        </ul>

        <h4>📋 Weekly Patch Plans</h4>
        <p>
          Expand each week to see the ranked CVEs and their metrics.
          Export each week as a separate CSV for your ticketing system.
        </p>

        <h4>📌 Detail Panel</h4>
        <p>
          Click any CVE to see full details:
          CVSS score, AI Risk, vulnerability age, and explanation of prioritization.
        </p>
      </section>

      <section>
        <h3>FAQ</h3>

        <h4>Q: Why does my CVSS 9.0 rank below a CVSS 7.5?</h4>
        <p>
          <strong>A:</strong> Because the CVSS 7.5 shows higher AI Risk (exploitation likelihood).
          PatchSense assumes that actually-exploited vulnerabilities deserve priority over
          theoretically-severe ones.
        </p>

        <h4>Q: Can I filter results?</h4>
        <p>
          <strong>A:</strong> Yes! Use the CVSS Band dropdown (All, High, Critical) to scope results.
          You can also search by CVE-ID.
        </p>

        <h4>Q: How do I export for my ticketing system?</h4>
        <p>
          <strong>A:</strong> Click "Export Weekly Patch Plan (CSV)" after running a simulation.
          Each week gets its own CSV with all metric data.
        </p>

        <h4>Q: Is this SOC-team only?</h4>
        <p>
          <strong>A:</strong> PatchSense is designed for SOC/vulnerability management teams.
          But anyone managing patch prioritization can use it.
        </p>

        <h4>Q: How often is the data updated?</h4>
        <p>
          <strong>A:</strong> The AI Risk scores are based on a pre-computed dataset.
          For live updates, integrate PatchSense with your vulnerability scanner API.
        </p>
      </section>

      <section>
        <h3>Intended Use Cases</h3>
        <ul>
          <li>💼 <strong>Patch Management Planning:</strong> Decide weekly patch schedules</li>
          <li>📊 <strong>Risk Reporting:</strong> Show management risk reduction over time</li>
          <li>🎯 <strong>Capacity Planning:</strong> Estimate how long to remediate backlog</li>
          <li>🔐 <strong>Compliance:</strong> Demonstrate defensible prioritization to auditors</li>
        </ul>
      </section>

      <section>
        <h3>Support & Feedback</h3>
        <p>
          Questions? Found a bug? Have a feature request?
        </p>
        <p>
          <strong>GitHub:</strong> <a href="https://github.com" target="_blank" rel="noopener noreferrer">github.com/patchsense</a><br/>
          <strong>Docs:</strong> Detailed API & integration guides available on the GitHub wiki.
        </p>
      </section>
    </div>
  );
}
