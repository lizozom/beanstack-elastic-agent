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
- **UI:** Gradio (Python)
- **Environment:** uv (Python package manager)

## Architecture Principles
- **Flexible Temporal Awareness:** Extract user's time intent, apply hard filter + Gaussian decay
- **Geo-Filtering:** Geo-distance and Geo-bounding box filters
- **Hybrid Precision:** RRF for exact term matches + semantic intent
- **Operational Gaps:** Proactively identify missing data

---

# Data Model

## Date Range
August 2025 - January 2026 (6 months)

## Geography
US only, major cities (NYC, LA, Chicago, Seattle, Miami, Austin, Denver, Boston, SF, etc.)

---

## Index: `branches`
~100-120 branches

```json
{
  "id": "branch-042",
  "name": "BeanStack 5th Ave NYC",
  "address": "123 5th Avenue",
  "city": "New York",
  "state": "NY",
  "zip": "10001",
  "region": "Northeast",
  "location": { "lat": 40.7128, "lon": -74.0060 },
  "size": "large",
  "opened_date": "2019-03-15",
  "manager_email": "marcus.johnson@beanstack.com"
}
```

## Index: `staff`
~500-600 staff members (4-6 per branch)

```json
{
  "id": "staff-001",
  "name": "Marcus Johnson",
  "email": "marcus.johnson@beanstack.com",
  "role": "Manager",
  "branch_id": "branch-042",
  "branch_name": "BeanStack 5th Ave NYC",
  "start_date": "2019-03-15",
  "status": "active"
}
```

Roles: Barista, Shift Lead, Assistant Manager, Manager

## Index: `weekly_reports`
~2,600 reports (26 weeks × 100 branches)

Informal, email-style, unstructured text covering:
- Equipment failures
- Staffing shortages
- Supply chain issues
- Local events
- Seasonal patterns
- Occasional catastrophic events (strikes, staff walkouts, pest incidents, etc.)

```json
{
  "id": "report-001",
  "branch_id": "branch-042",
  "branch_name": "BeanStack 5th Ave NYC",
  "sender_email": "marcus.johnson@beanstack.com",
  "subject": "Week of Jan 15 - rough one",
  "text": "Hey,\nCrazy week. Espresso machine #2 broke down Tuesday...",
  "date": "2025-01-20",
  "timestamp": "2025-01-20T09:34:00Z"
}
```

## Index: `quarterly_reports`
~200 reports (2 quarters × 100 branches)

Structured JSON forms filled by managers.

```json
{
  "id": "q4-2025-branch-042",
  "branch_id": "branch-042",
  "branch_name": "BeanStack 5th Ave NYC",
  "period": "Q4-2025",
  "submitted_by": "marcus.johnson@beanstack.com",
  "submitted_at": "2025-01-05T14:22:00Z",
  "revenue": 142500.00,
  "transactions": 18420,
  "avg_ticket": 7.74,
  "labor_hours": 2860,
  "labor_cost_pct": 32.5,
  "inventory_waste_pct": 4.2,
  "customer_satisfaction": 4.3,
  "employee_count": 6,
  "turnover_count": 1,
  "equipment_issues": 3,
  "notes": "Strong holiday season despite machine repairs"
}
```

## Index: `yearly_reports`
~100 reports (2025 partial year)

Structured JSON forms filled by managers.

```json
{
  "id": "y-2025-branch-042",
  "branch_id": "branch-042",
  "branch_name": "BeanStack 5th Ave NYC",
  "year": 2025,
  "total_revenue": 520000.00,
  "total_transactions": 71200,
  "yoy_growth_pct": 8.2,
  "best_quarter": "Q4",
  "worst_quarter": "Q1",
  "total_employee_turnover": 4,
  "major_incidents": 2,
  "capital_requests": ["New espresso machine", "Outdoor seating expansion"],
  "manager_summary": "Solid year overall..."
}
```

---

## Data Generation Patterns

**Realistic Variance:**
- Some branches consistently well-run, others struggle (hidden quality score)
- Staff turnover patterns

**Seasonal Patterns:**
- Winter: Hot drinks, holiday rushes, weather delays
- Summer: Iced drinks surge, AC issues, vacation staffing gaps
- Fall: Pumpkin spice season, back-to-school

**Regional Events:**
- Local sports, concerts, weather (hurricanes in Miami, heat in Phoenix, snow in NYC)

**Catastrophic Events (~5-10% of reports):**
- Staff walkouts/strikes
- Equipment fires
- Pest incidents
- Health inspection failures
- Burst pipes
- Viral social media moments
