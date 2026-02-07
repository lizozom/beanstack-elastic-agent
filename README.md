# BeanStack: Coffee Chain Operational Intelligence Agent

![BeanStack Logo](data/logo.png)

> Built for the [Elastic Agent Builder Hackathon](https://elasticsearch.devpost.com/)

BeanStack is an AI-powered operational intelligence agent for a fictional 100+ branch coffee chain in the United States. It uses **Elastic Agent Builder** to help headquarters staff monitor operations, analyze branch reports, track financial performance, and communicate with branch managers -- all through natural language conversation.

## What It Does

- **Daily Briefs** -- Summarize the last 24 hours across all branches
- **Weekly Report Analysis** -- Search and analyze unstructured manager reports using hybrid search (Cohere embeddings + BM25 via RRF)
- **Financial Analytics** -- Compare revenue, labor costs, customer satisfaction, and turnover across branches and regions
- **Geo-Spatial Queries** -- "Compare east coast vs west coast performance" using geo-distance and bounding box filters
- **Time-Aware Search** -- "What staffing problems happened last month?" with automatic date filtering and Gaussian decay
- **Staff Lookup** -- "Who works at the NYC 5th Ave branch?"
- **Gap Detection** -- Identify branches with missing or overdue reports
- **Manager Messaging** -- Send emails to branch managers directly from the agent via Kibana Workflows
- **Escalation Workflows** -- Automated escalation for critical issues

## Tech Stack

| Component | Technology |
|-----------|-----------|
| Search & Storage | Elasticsearch 9.x |
| Embeddings | Cohere Embed v4 (`embed-v4.0`) |
| Hybrid Search | RRF (Reciprocal Rank Fusion) |
| Agent Orchestration | Elastic Agent Builder (Claude Sonnet 4.5) |
| Automation | Kibana Workflows |
| Data Generation | Claude Haiku 4.5, Faker |
| Package Manager | uv |

## Architecture

The agent is built entirely on the Elastic platform:

- **4 Elasticsearch indices** (`beanstack-branches`, `beanstack-staff`, `beanstack-reports`, `beanstack-financial-reports`) store all operational data
- **14 custom tools** registered in Agent Builder handle search, analytics, and workflow triggers
- **4 Kibana Workflows** automate daily briefs, manager messaging, missing report reminders, and escalations
- **Semantic search** on reports and financial narratives via a Cohere inference endpoint with `semantic_text` fields

## Prerequisites

You will need accounts for the following services:

1. **Elastic Cloud** -- Elasticsearch 9.x + Kibana with Agent Builder enabled
2. **Cohere** -- API key for Embed v4 text embeddings
3. **Anthropic** -- API key for synthetic data generation (Claude Haiku 4.5)
4. **SMTP provider** -- For the email connector (e.g., Gmail app password, SendGrid, etc.)

## Setup

### 1. Clone and install dependencies

```bash
git clone <repo-url>
cd elastic-agent-hackathon
uv sync
```

### 2. Configure environment variables

Create a `.env` file in the project root:

```env
# Elasticsearch
ELASTICSEARCH_ENDPOINT=https://your-cluster.es.cloud.es.io:443
ELASTICSEARCH_API_KEY=your-api-key

# Kibana
KIBANA_ENDPOINT=https://your-cluster.kb.cloud.es.io:443

# Cohere (for embeddings)
COHERE_API_KEY=your-cohere-api-key

# Anthropic (for data generation only)
ANTHROPIC_API_KEY=your-anthropic-api-key

# SMTP (for email workflows)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_FROM=beanstack-hq@yourcompany.com
SMTP_USER=your-smtp-user
SMTP_PASSWORD=your-smtp-password
```

### 3. Generate synthetic data

Generate branches, staff, weekly reports, and financial reports:

```bash
uv run python scripts/data_generation/branches.py
uv run python scripts/data_generation/staff.py
uv run python scripts/data_generation/weekly_reports.py
uv run python scripts/data_generation/quarterly_reports.py
```

This creates ~100 branches, ~600 staff members, ~2,600 weekly reports (LLM-generated), and quarterly/yearly financial reports under `data/generated/`.

### 4. Set up Elasticsearch

Run the setup scripts in order:

```bash
# Enable Agent Builder, Workflows, and configure the email connector in Kibana
uv run python scripts/es_setup/00_init_es.py

# Create indices and Cohere inference endpoint
uv run python scripts/es_setup/01_setup_indices.py

# Ingest branches and staff
uv run python scripts/es_setup/02_ingest_data.py

# Ingest weekly reports (with semantic embeddings)
uv run python scripts/es_setup/03_ingest_reports.py

# Ingest financial reports
uv run python scripts/es_setup/04_ingest_financial.py
```

### 5. Deploy workflows and agent

```bash
# Deploy Kibana Workflows (daily brief, messaging, reminders, escalation)
uv run python scripts/es_setup/10_setup_workflows.py

# Create the BeanStack agent with all tools
uv run python scripts/es_setup/11_setup_agent.py
```

## Usage

Once setup is complete, open the Agent Builder chat in Kibana:

```
https://your-cluster.kb.cloud.es.io/app/agent_builder/chat/beanstack-research
```

### Example Queries

- "Give me a daily brief"
- "What equipment issues were reported in the Northeast last month?"
- "Compare revenue between the West and Midwest regions for Q4 2025"
- "Which branches haven't submitted reports this week?"
- "Who is the manager at the Chicago Downtown branch?"
- "Send a message to the manager of branch-042 asking about their espresso machine repair"
- "Which branches are underperforming on customer satisfaction?"

## Project Structure

```
scripts/
  data_generation/       # Synthetic data generators (branches, staff, reports)
  es_setup/
    00_init_es.py        # Enable features & email connector
    01_setup_indices.py  # Create indices & inference endpoint
    02_ingest_data.py    # Ingest branches & staff
    03_ingest_reports.py # Ingest weekly reports
    04_ingest_financial.py # Ingest financial reports
    10_setup_workflows.py  # Deploy Kibana Workflows
    11_setup_agent.py    # Create the agent with tools
    mappings/            # Elasticsearch index mappings
    tools/               # Custom tool definitions for Agent Builder
    workflows/           # Workflow YAML definitions
data/
  generated/             # Generated synthetic data (not committed)
```

## License

This project was built for the [Elastic Agent Builder Hackathon](https://elasticsearch.devpost.com/).
