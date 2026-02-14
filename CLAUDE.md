# Claude Code Settings

## Model
Use `claude-opus-4-6` as the default model for this project.

---

# BeanStack: Coffee Chain Operational Intelligence Agent

## Project Context
An AI agent for managing a 100+ branch coffee chain (BeanStack).

**Goals:**
- Showcase Elastic Agent Builder
- Create a useful business agent that reduces real work
- Showcase Elastic's Geo-Spatial capabilities in an Agent's context

**Capabilities:**
- Daily briefs (past 24 hours summary)
- Analyze weekly unstructured reports from branch managers
- Analyze structured quarterly and yearly reports
- Time-based queries ("staffing problems last month")
- Location-based queries ("compare revenue of east vs west coast")
- Staff queries ("who works at NYC 5th street?")
- Messaging branch managers
- Identify branches with missing reports

## Tech Stack
- **Search Engine:** Elasticsearch (9.x)
- **Embeddings:** Cohere v4 (Embed 4) - `search_document` for indexing, `search_query` for retrieval
- **Hybrid Search:** RRF (Reciprocal Rank Fusion) combining Cohere vectors with BM25
- **Orchestration:** Elastic Agent Builder (Claude 4.5)
- **Slack Integration:** slack-bolt (Socket Mode)
- **Environment:** uv (Python package manager)

---

# Project Structure

## `data/` — Generated Synthetic Data

Contains all generated data used to populate Elasticsearch indices.

- `generated/branches.json` — ~120 branch records with geo-coordinates across major US cities
- `generated/staff.json` — ~500-600 staff members (4-6 per branch)
- `generated/branch_narratives.json` — Contextual branch narratives
- `generated/quarterly_reports.json` — Structured financial reports (Q1-2023 through Q4-2025)
- `generated/financial-reports/` — Quarterly financial reports organized by period
- `generated/reports/` — Weekly unstructured reports organized by quarter (~2,600 total)

## `scripts/` — Data Generation & Elasticsearch Setup

### `scripts/data_generation/` — Synthetic Data Generation

Uses Faker and Claude Haiku to generate realistic data with seasonal patterns, regional variance, and catastrophic events.

| Script | Purpose |
|--------|---------|
| `branches.py` | Generate ~120 branches across US cities with geo-coordinates |
| `staff.py` | Generate ~500-600 staff with roles and branch assignments |
| `weekly_reports.py` | Generate ~2,600 unstructured weekly reports using Claude Haiku |
| `quarterly_reports.py` | Generate structured quarterly financials (Q1-2023 to Q4-2025) |

### `scripts/es_setup/` — Elasticsearch & Agent Setup

Numbered scripts run in order to fully configure the Elasticsearch cluster and Agent Builder.

| Script | Purpose |
|--------|---------|
| `00_init_es.py` | Enable Agent Builder feature flag, set default AI connector, configure SMTP |
| `01_setup_indices.py` | Create 4 indices, set up Cohere embed-v4 inference endpoint |
| `02_ingest_data.py` | Bulk-index branches/staff, create enrich policy for region lookups |
| `03_ingest_reports.py` | Bulk-index weekly reports with semantic_text embeddings |
| `04_ingest_financial.py` | Bulk-index quarterly financial reports |
| `10_setup_workflows.py` | Deploy 3 Kibana Workflows (escalation, missing reports reminder, send message) |
| `11_setup_agent.py` | Create BeanStack Agent in Agent Builder with 20 custom tools |

**Agent Tools (20 total)** in `scripts/es_setup/tools/`:
- **Index Search** (4): `search_reports`, `search_branches`, `search_staff`, `search_financial_reports`
- **ES|QL Analytics** (10): `revenue_by_region`, `underperforming_branches`, `branches_without_reports`, `turnover_by_branch`, `equipment_issues_by_branch`, etc.
- **Workflow** (3): `wf_send_manager_message`, `wf_missing_reports_reminder`, `wf_escalation`

**Kibana Workflows** in `scripts/es_setup/workflows/`:
- `escalation.yaml` — Escalate critical issues to ops team
- `missing_reports_reminder.yaml` — Automated reminders for overdue reports
- `send_manager_message.yaml` — Send emails to branch managers

## `slack_bot/` — Slack Integration

A standalone Python bot connecting Slack to BeanStack Agent via the Agent Builder converse API.

- **Socket Mode** — No public URL required
- **Two modes:** `@BeanStack` mentions in channels (single-turn) and DMs (multi-turn with conversation continuity)
- **Markdown conversion** — Translates standard Markdown to Slack mrkdwn format
- **Deployment:** Runs on Fly.io (`fly.toml` + `Dockerfile`)

Key files:
- `slack_bot/bot.py` — Main bot implementation
- `slack_bot/slack_app_manifest.json` — Pre-configured Slack app manifest

## `demo/` — Submission Video

The hackathon submission video, built programmatically with **Remotion** (React-based video framework) and narrated with **ElevenLabs** voice generation.

- `demo/script.md` — 3:30 demo narrative script
- `demo/video/` — Remotion TypeScript project

### Video Project (`demo/video/`)

```
demo/video/src/
├── Video.tsx              # Main composition — scene sequencing + audio tracks
├── scenes/                # 9 scenes (ColdOpen, IntroProblem, SolutionArchitecture, Scene1-5, Closing)
├── components/            # Reusable UI (ChatInterface, ChatMessage, BarChart, WorkflowChain, etc.)
├── data/                  # Scene data fixtures (conversations, region data, branch data)
├── theme/                 # Colors (coffee palette + UI palette), typography (Inter font)
└── utils/                 # Frame utilities, interpolation helpers
```

- Chat interface styled as Slack dark mode
- Animated architecture diagrams, bar charts, workflow chains
- Audio: ElevenLabs narration tracks + background music with volume ducking
- `npm run studio` to preview, `npm run render` for final MP4

---

# Data Model

## Elasticsearch Indices

| Index | Records | Description |
|-------|---------|-------------|
| `beanstack-branches` | ~120 | Branch locations with geo-coordinates |
| `beanstack-staff` | ~500-600 | Staff directory with roles and branch assignments |
| `beanstack-reports` | ~2,600 | Weekly unstructured reports (semantic_text embeddings) |
| `beanstack-financial-reports` | ~200 | Quarterly structured financials (semantic_text embeddings) |

## Date Range
August 2025 - January 2026 (6 months of weekly reports); Q1-2023 through Q4-2025 (quarterly financials)

## Geography
US only, major cities (NYC, LA, Chicago, Seattle, Miami, Austin, Denver, Boston, SF, etc.)

## Data Generation Patterns

- **Realistic Variance:** Hidden quality scores per branch, staff turnover patterns
- **Seasonal:** Winter holiday rushes, summer AC issues, fall pumpkin spice season
- **Regional Events:** Local sports, weather (hurricanes, heat waves, snow)
- **Catastrophic Events (~5-10%):** Staff walkouts, equipment fires, pest incidents, health inspection failures
