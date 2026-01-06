

---

# PatchSense-ML

### AI-Driven Vulnerability Risk Prioritization Pipeline

**PatchSense-ML** is the machine-learning core of **PatchSense**, a decision-support system designed to prioritize software vulnerabilities beyond raw CVSS scores.

It ingests National Vulnerability Database (NVD) data, engineers risk-relevant features, learns exploit likelihood patterns, and produces actionable patch-priority rankings for SOC analysts.

> **Note:** This repository is intentionally clean and reproducible. Raw datasets are never committed. Only final, consumption-ready artifacts are versioned.

---

## 1. Project Philosophy

**Why this exists**

Traditional CVSS scoring is often insufficient for modern security needs because it:

* Ignores real-world exploit trends.
* Treats all environments the same.
* Is static and severity-centric.

**PatchSense-ML answers the critical question:**

> *"Which vulnerabilities should I patch first, given limited resources?"*

**Core Focus:**

* ✅ **Risk prediction**, not vulnerability discovery.
* ✅ **Decision support**, not automated patching.
* ✅ **Explainable ML**, not black-box scores.

---

## 2. Repository Structure

The repository is organized to separate pipeline logic from final data artifacts.

```text
patchsense_ML/
│
├── README.md
├── .gitignore               <-- Enforces clean history (no raw data)
│
├── data/
│   ├── ai_risk_ranking.csv        <-- Final ML priority list
│   ├── cvss_baseline_ranking.csv  <-- Control group
│   ├── dashboard_ready.csv        <-- Frontend-consumable artifact
│   │
│   └── processed/           <-- Stable, intermediate ML artifacts (Parquet)
│       ├── dashboard_ready.json
│       ├── features.parquet
│       ├── labeled.parquet
│       ├── labels.parquet
│       └── nvd_full.parquet
│
└── notebooks/               <-- Sequential pipeline stages
    ├── 00_ingest_nvd_json.ipynb
    ├── 01_data_exploration.ipynb
    ├── 02_cvss_baseline.ipynb
    ├── 03_feature_engineering.ipynb
    ├── 04_label_definition.ipynb
    ├── 05_model_training.ipynb

```

---

## 3. Data Lifecycle & Architecture

This project adheres to strict data hygiene to prevent repository bloat and ensure reproducibility.

### ❌ What is NOT in the repo

* Raw NVD JSON files (100–200 MB each).
* Temporary / intermediate CSVs.
* Regenerable artifacts.

### ✅ What IS in the repo

* Final processed datasets.
* Final rankings.
* Artifacts directly consumed by dashboards or reports.

### Final Outputs (`data/`)

| File | Description | Usage |
| --- | --- | --- |
| **`ai_risk_ranking.csv`** | Final ML-generated ranking of vulnerabilities by predicted risk. | SOC decision making; The primary answer to "Patch these first." |
| **`cvss_baseline_ranking.csv`** | Baseline ranking using only CVSS scores. | Control comparison; Justifies why ML is superior to static scoring. |
| **`dashboard_ready.csv`** | Flattened dataset (CVE metadata + CVSS + Risk Score). | Designed for direct frontend consumption without ML dependencies. |

### Model-Facing Artifacts (`data/processed/`)

All intermediate data is stored in **Parquet** format for memory efficiency and fast I/O.

* **`nvd_full.parquet`**: Fully parsed and normalized NVD dataset. Replaces raw JSON.
* **`features.parquet`**: Feature matrix (Encoded CVSS, Vuln Age, CWE groupings, Keyword signals).
* **`labels.parquet`**: Ground-truth heuristics indicating exploitation risk. Separated to prevent leakage.
* **`labeled.parquet`**: The final frozen training table (Features + Labels).

---

## 4. Pipeline Logic (Notebooks)

The `notebooks/` directory contains the pipeline stages. They are sequential and modular.

| Stage | Notebook | Purpose |
| --- | --- | --- |
| **00** | `Ingest NVD` | Parses local raw NVD JSONs and exports `nvd_full.parquet`. Isolates raw data handling. |
| **01** | `Exploration` | Analyzes CVSS distributions, vulnerability age, and CWE patterns to justify feature choices. |
| **02** | `CVSS Baseline` | Ranks vulnerabilities using CVSS alone to establish a baseline for ML improvement claims. |
| **03** | `Feature Eng.` | Encodes categorical metrics and engineers temporal/semantic features. **Key Idea:** *Risk ≠ Severity.* |
| **04** | `Label Def.` | Defines risk labels using heuristics/signals. Avoids trivial CVSS-derived labels. |
| **05** | `Training` | Trains the model, evaluates performance, and exports `ai_risk_ranking.csv`. |

---

## 5. How to Reproduce

To regenerate the pipeline from scratch:

1. **Acquire Data:** Download raw NVD JSON feeds locally (these are not committed).(https://nvd.nist.gov/vuln/data-feeds#APIS)
2. **Run Pipeline:** Execute the notebooks in numerical order:
`00`  `01`  `02`  `03`  `04`  `05`
3. **View Results:** Final outputs will appear in `data/` and `data/processed/`.

---

## 6. Intended Audience

* **SOC Analysts:** For prioritizing daily patch queues.
* **Security Engineers:** For understanding risk factors beyond CVSS.
* **ML Researchers:** For evaluating cybersecurity risk scoring models.
* **Academic Evaluators:** For reviewing reproducible benchmarks.

---

## 7. Future Extensions

* Live threat-intel ingestion.
* Organization-specific asset context.
* Online learning/retraining.
* Full backend API implementation.



