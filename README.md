<p align="center">
  <img src="beanstack.jpg" alt="BeanStack Logo" width="300">
</p>

<h1 align="center">BeanStack: Coffee Chain Operational Intelligence</h1>

<p align="center">
  An AI-powered agent for managing a 100+ branch coffee chain, built with Elasticsearch and Claude.
</p>

<p align="center">
  <a href="https://elasticsearch.devpost.com/">Built for the Elastic Search AI Hackathon</a>
</p>

---

## What is BeanStack?

BeanStack is an operational intelligence agent that helps coffee chain executives:

- Get **daily briefs** summarizing what happened across all branches
- Analyze **weekly manager reports** (unstructured emails about staffing, equipment, sales)
- Query by **time** ("staffing issues last month") or **location** ("compare east vs west coast revenue")
- Find **staff information** and send messages to branch managers
- Identify **gaps** (branches that haven't reported recently)

## Tech Stack

| Component | Technology |
|-----------|------------|
| Search & Storage | Elasticsearch 9.x |
| Embeddings | Cohere Embed 4 |
| Search Strategy | Hybrid (RRF: vectors + BM25) |
| Agent Orchestration | Elastic Agent Builder + Claude |
| UI | Gradio |

## Setup

### Prerequisites

1. **Elasticsearch Cloud account** - [Sign up](https://cloud.elastic.co/)
2. **Cohere API key** - [Get one](https://cohere.com/)
3. **Anthropic API key** - [Get one](https://console.anthropic.com/)
4. **Python 3.11+** with `uv` package manager

### Installation

```bash
# Clone the repo
git clone https://github.com/your-repo/beanstack.git
cd beanstack

# Install dependencies
uv sync

# Set up environment variables
cp .env.example .env
# Edit .env with your API keys
```

### Generate Sample Data

```bash
# Generate branches and staff
uv run python scripts/data_generation/branches.py
uv run python scripts/data_generation/staff.py
uv run python scripts/data_generation/branch_narratives.py

# Generate weekly reports (uses Claude Haiku)
uv run python scripts/data_generation/weekly_reports.py
```

## Usage

### Via Elastic UI

1. Navigate to your Elasticsearch deployment
2. Open the **Agent Builder** interface
3. Select the BeanStack agent
4. Start asking questions:
   - "Give me a brief of yesterday's reports"
   - "Which branches had equipment issues last week?"
   - "Compare sales between NYC and LA branches"
   - "Who manages the Seattle downtown location?"

---

<p align="center">
  Made with coffee and AI
</p>
