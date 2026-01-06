# PatchSense 🛡️

**AI-Driven Vulnerability Prioritization & Patch Planning**

PatchSense is a risk-based vulnerability prioritization system that helps security teams decide **what to patch first**, based on real-world exploit likelihood and asset context — not CVSS alone.

---

## 🚩 Problem Statement

Traditional vulnerability management relies heavily on **CVSS scores**, which measure technical severity but fail to represent **real operational risk**.

In practice:

* Not all high-CVSS vulnerabilities are exploited
* Asset exposure and business criticality matter
* Security teams face limited patching capacity

This results in **misaligned priorities** and inefficient remediation.

---

## 🎯 Solution Overview

PatchSense addresses this gap by combining:

* **AI-predicted exploit likelihood**
* **Asset exposure context**
* **Asset business criticality**

The system produces a **final operational risk score** and converts it into **actionable weekly patch plans**.

---

## 🧠 Core Features

* 📊 **Risk-Based Ranking**
  Vulnerabilities ranked by final risk score, not raw CVSS

* 🤖 **AI Risk Score Integration**
  Predicts likelihood of exploitation using historical patterns

* 🏢 **Asset Context Awareness**
  Adjusts risk based on internet exposure and business impact

* 🗓️ **Patch Planning Simulation**
  Automatically groups vulnerabilities into weekly patch plans

* 📁 **CVE Upload Support**
  Upload CVE lists and match them against the dataset

* 📤 **CSV Export**
  Export weekly patch plans for reporting and operations

---

## 🧮 Risk Scoring Logic

PatchSense computes a final score using:

```
Final Risk Score =
  AI Risk Score × Exposure Weight × Criticality Weight
```

### Weighting Examples

* Internet-facing assets → higher exposure weight
* Business-critical systems → higher criticality weight

This ensures **high-impact vulnerabilities surface first**, even if CVSS appears moderate.

---

## 🗂️ Patch Planning Workflow

1. Vulnerabilities are sorted by final risk score
2. A patch limit is applied (operational capacity)
3. Vulnerabilities are grouped into weekly plans
4. Teams can export plans as CSV files

This enables **progressive risk reduction** without overwhelming operations.

---

## 🖥️ Tech Stack

### Frontend

* React (Vite)
* React Router
* CSS (custom, dark theme)

### Data

* Preprocessed vulnerability dataset (JSON)
* AI risk scores (offline / simulated for MVP)

---

## 📁 Project Structure

```
src/
├── components/
│   ├── Header.jsx
│   ├── RankedTable.jsx
│   ├── PatchSchedule.jsx
│   ├── DecisionStrip.jsx
│   ├── Docs.jsx
│   └── ...
├── data/
│   └── dashboard_ready.json
├── assets/
│   └── ai-chip.png
├── App.jsx
├── main.jsx
└── styles.css
```

---

## 🚀 Getting Started

### Prerequisites

* Node.js (v18+ recommended)
* npm or yarn

### Installation

```bash
git clone https://github.com/your-username/patchsense.git
cd patchsense
npm install
```

### Run Locally

```bash
npm run dev
```

The app will be available at:

```
http://localhost:5173
```

---

## 📄 Documentation

In-app documentation is available at:

```
/docs
```

It explains:

* Scoring logic
* Risk calculation
* Patch planning methodology

---

## 🧪 Project Scope (Academic)

This project is developed as a **VI Semester Mini Project**, with clear scope for extension into:

* Live threat-intel feeds
* Real-time exploit prediction
* Organization-specific risk modeling
* Backend integration (API + ML service)

---

## 🔮 Future Enhancements

* Replace simulated AI scores with live ML models
* Asset inventory ingestion
* Role-based access control
* Organization-specific risk weighting
* Cloud / on-prem deployment modes

---

## 👤 Author

**Mrinal Sahoo**
Cybersecurity | Vulnerability Management | AI-Driven Security Systems

* LinkedIn: [https://www.linkedin.com/in/mrinal-sahoo/](https://www.linkedin.com/in/mrinal-sahoo/)

---

## 📜 License

This project is intended for **academic and educational use**.
Commercial use requires additional hardening and validation.






