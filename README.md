<p align="center">
  <img src="beanstack.jpg" alt="BeanStack Logo" width="200">
</p>

<h1 align="center">BeanStack Agent</h1>

<p align="center">
  AI-powered operational intelligence for a 100+ branch coffee chain.<br>
  Built for the <a href="https://elasticsearch.devpost.com/">Elastic Agent Builder Hackathon</a>.
</p>

---

## What is BeanStack?

BeanStack is a conversational agent that helps coffee chain HQ staff monitor operations, analyze branch reports, and take action — all through natural language.

It combines **Elasticsearch hybrid search** (Cohere embeddings + BM25 via RRF), **ES|QL analytics**, **Kibana Workflows** for automation, and the **Elastic Agent Builder** for orchestration. It works both in Kibana and in Slack.

**What it can do:**

- Summarize the last 24 hours across all branches
- Search unstructured weekly manager reports with time and geo filters
- Compare revenue, labor costs, and satisfaction across branches and regions
- Identify branches with missing or overdue reports
- Flag underperforming branches based on multiple metrics
- Send emails and escalate critical issues via Kibana Workflows

---

## Setup

### Prerequisites

| Service | Purpose |
|---------|---------|
| [Elastic Cloud](https://cloud.elastic.co/) (9.x) | Elasticsearch + Kibana with Agent Builder enabled |
| [Cohere](https://cohere.com/) | Embed v4 text embeddings |
| [Anthropic](https://console.anthropic.com/) | Synthetic data generation (Claude Haiku) |
| SMTP provider | Email connector (Gmail, SendGrid, etc.) |
| [uv](https://docs.astral.sh/uv/) | Python package manager |

### 1. Clone and install

```bash
git clone https://github.com/lizozom/beanstack-elastic-agent
cd elastic-agent-hackathon
uv sync
```

### 2. Configure `.env`

```bash
cp .env.example .env
```

Fill in your credentials: Elastic Cloud endpoint, API key, Cohere API key, Anthropic API key, and SMTP settings.

### 3. Generate synthetic data

These scripts generate realistic data for ~120 branches across major US cities. Weekly reports are generated using Claude Haiku to produce natural, varied text.

```bash
uv run python scripts/data_generation/branches.py
uv run python scripts/data_generation/staff.py
uv run python scripts/data_generation/weekly_reports.py
uv run python scripts/data_generation/quarterly_reports.py
```

Output lands in `data/generated/`.

### 4. Set up Elasticsearch

Run the numbered scripts in order. Each one is idempotent — safe to re-run.

```bash
uv run python scripts/es_setup/00_init_es.py         # Enable Agent Builder, set AI connector, configure SMTP
uv run python scripts/es_setup/01_setup_indices.py    # Create 4 indices + Cohere inference endpoint
uv run python scripts/es_setup/02_ingest_data.py      # Ingest branches & staff, create enrich policy
uv run python scripts/es_setup/03_ingest_reports.py   # Ingest ~2,600 weekly reports (with embeddings)
uv run python scripts/es_setup/04_ingest_financial.py  # Ingest quarterly financial reports
```

### 5. Deploy workflows and agent

```bash
uv run python scripts/es_setup/10_setup_workflows.py   # Deploy 3 Kibana Workflows
uv run python scripts/es_setup/11_setup_agent.py        # Create agent with 21 tools
```

### 6. Use it

Open **Agent Builder** in Kibana and start chatting:

- *"What equipment issues were reported in the Northeast last month?"*
- *"Compare revenue between West and Midwest for Q4 2025"*
- *"Which branches haven't submitted reports this week?"*
- *"Send a message to the manager of the Philadelphia branch about their equipment fires"*
- *"Give me a daily brief"*

---

## System Prompt & Tools

### System Prompt

The agent is configured with a system prompt (defined in `scripts/es_setup/system_prompt.py`) that establishes its role as an operational intelligence assistant. It knows about:

- **4 data sources**: branches, staff, weekly reports, and quarterly financial reports
- **Financial data structure**: revenue, transactions, labor costs, inventory waste, customer satisfaction, turnover
- **Response guidelines**: cite specific branches, filter by time/location, flag missing data, keep answers concise

### Tools (21 total)

The agent has access to 21 tools organized into 4 categories. Tool definitions live in `scripts/es_setup/tools/`.

#### Index Search Tools (4)

LLM-driven queries — the agent constructs the search dynamically based on user intent.

| Tool | Description |
|------|-------------|
| `search_reports` | Semantic search on weekly manager reports (equipment failures, staffing issues, events) |
| `search_branches` | Search branches by city, state, region, size, or geo-proximity |
| `search_staff` | Search staff by name, role, or branch assignment |
| `search_financial_reports` | Semantic search on quarterly financial narratives |

#### ES|QL Analytics Tools (10)

Pre-defined, precise queries for structured analysis. Parameters are filled by the agent.

| Tool | Description |
|------|-------------|
| `revenue_by_region` | Aggregate revenue and transactions by geographic region (uses enrich policy) |
| `underperforming_branches` | Flag branches with high labor costs, waste, turnover, or low satisfaction |
| `branches_without_reports` | Identify branches that haven't submitted recent reports |
| `report_count_by_branch` | Count reports per branch in a date range |
| `staff_by_branch` | List all staff at a specific branch |
| `branch_report_timeline` | Show report submission timeline for a branch |
| `branches_by_region` | Categorize branches by region |
| `turnover_by_branch` | Analyze staff turnover patterns |
| `equipment_issues_by_branch` | Track equipment failure patterns |
| `branch_financial_summary` | Full financial history and quarterly trends for a branch |

#### Workflow Tools (4)

Deterministic automations that trigger Kibana Workflows for real-world actions.

| Tool | Description |
|------|-------------|
| `wf_send_manager_message` | Send an email to a branch manager |
| `wf_missing_reports_reminder` | Send automated reminders to branches with overdue reports |
| `wf_escalation` | Create a Kibana case to escalate a critical issue |

#### Built-in Platform Tools (3)

Provided by Agent Builder — generic Elasticsearch access as a fallback.

| Tool | Description |
|------|-------------|
| `platform.core.search` | Generic Elasticsearch search |
| `platform.core.list_indices` | List available indices |
| `platform.core.get_index_mapping` | Inspect index schemas |

### How the agent uses tools

The agent chains tools together to answer complex questions. For example:

> "Why is the Philadelphia branch underperforming?"

1. **`underperforming_branches`** — confirms Philadelphia is flagged (high equipment issues, low satisfaction)
2. **`search_reports`** — semantic search for Philadelphia reports mentioning equipment problems
3. **`branch_financial_summary`** — pulls quarterly revenue trends to show the decline
4. **`wf_escalation`** — if the user asks, creates a case to escalate the issue

This tool-chaining pattern — structured data identifies the problem, unstructured reports explain the cause, workflows take action — is the core of the agent's design.

---

## Slack Bot

The Slack bot connects Slack to the BeanStack Agent via the Agent Builder [converse API](https://www.elastic.co/docs/reference/kibana/agent-builder-api). It runs in **Socket Mode** — no public URL or ngrok needed.

### How it works

```
Slack message → slack-bolt (Socket Mode) → POST /api/agent_builder/converse → Slack reply
```

| Mode | Usage | Multi-turn |
|------|-------|------------|
| Channel @mention | `@BeanStack <question>` in any channel | No (single-turn) |
| Direct message | Message the bot directly | Yes (conversation continues) |

### Setup

#### 1. Create the Slack app

1. Go to [api.slack.com/apps](https://api.slack.com/apps)
2. Click **Create New App** > **From a manifest**
3. Select your workspace
4. Paste the contents of [`slack_bot/slack_app_manifest.json`](slack_bot/slack_app_manifest.json)
5. Click **Create**

#### 2. Get your tokens

- **App-Level Token** (`xapp-`): Settings > Basic Information > App-Level Tokens > Generate Token (add `connections:write` scope)
- **Bot Token** (`xoxb-`): Settings > OAuth & Permissions > Install to Workspace > copy Bot User OAuth Token

#### 3. Add tokens to `.env`

```
SLACK_BOT_TOKEN=xoxb-your-bot-token
SLACK_APP_TOKEN=xapp-your-app-token
```

`KIBANA_ENDPOINT` and `ELASTICSEARCH_API_KEY` are the same values used by the setup scripts.

#### 4. Run the bot

```bash
uv run python slack_bot/bot.py
```

#### 5. Invite to channels

```
/invite @BeanStack
```

Then `@BeanStack Compare the performance of New York and Boston branches` in any channel, or message the bot directly for multi-turn conversations.

---

## Demo Video

The hackathon submission video is built programmatically with [Remotion](https://remotion.dev/) (React-based video framework) and narrated with [ElevenLabs](https://elevenlabs.io/) voice generation.

```bash
cd demo/video
npm install
npm run studio    # Preview in browser
npx run render    # Render final MP4
```

---

## Project Structure

```
.
├── data/generated/           # Synthetic data (branches, staff, reports, financials)
├── scripts/
│   ├── data_generation/      # Data generation scripts (Faker + Claude Haiku)
│   └── es_setup/             # Elasticsearch setup, ingestion, agent & workflow deployment
│       ├── tools/            # 17 custom tool definitions
│       └── workflows/        # 3 Kibana Workflow YAML definitions
├── slack_bot/                # Slack bot (Socket Mode, converse API)
├── demo/
│   ├── script.md             # Video narration script
│   └── video/                # Remotion video project
└── .env.example              # Environment variable template
```
