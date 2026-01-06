// Header.jsx
import { Link } from "react-router-dom";
import logo from "../assets/ai-chip.png";

export default function Header() {
  return (
    <header className="app-header">
      {/* LEFT: Brand */}
      <div className="header-left">
        <Link to="/" className="brand">
          <img
            src={logo}
            alt="PatchSense logo"
            className="brand-logo"
          />
          <div className="brand-text">
            <h1 className="project-title">PatchSense</h1>
            <span className="project-subtitle">
              AI-Driven Vulnerability Prioritization
            </span>
          </div>
        </Link>
      </div>

      {/* RIGHT: Navigation */}
      <nav className="header-nav">
        <Link to="/docs">Docs</Link>

        <a
          href="https://github.com/mrinal140420/patchsense.git"
          target="_blank"
          rel="noreferrer"
        >
          GitHub
        </a>

        <a
          href="https://www.linkedin.com/in/mrinal-sahoo/"
          target="_blank"
          rel="noreferrer"
        >
          LinkedIn
        </a>
      </nav>
    </header>
  );
}
