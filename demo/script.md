# BeanStack — Demo Video Script

**Duration:** 3:30
**Format:** AI-generated atmosphere shots + screen recording with voiceover
**Tone:** Confident, clean, understated. Think Linear or Notion product videos.
**Music:** Ambient electronic, soft beat. Builds subtly through the video. Drops out briefly before the closing tagline.

---

## COLD OPEN (0:00–0:05)

**Visual:** Black screen. Text fades in, white on black, one line at a time:

> *100 branches.*
> *Way too much coffee*
> *Thousands of reports.*
> *But who's reading them?*

**Audio:** Low ambient hum. No music yet.

---

## INTRO — THE PROBLEM (0:05–0:35)

**Visual:** AI-generated cinematic shots — warm color grade, shallow depth of field. Quick cuts (2–3 sec each):
1. Overhead shot of a busy coffee bar, steam rising
2. Close-up of hands pulling espresso shots
3. A map with dozens of pins across the US
4. A laptop screen full of emails, subject lines blur past
5. A manager at a desk, overwhelmed, rubbing their temples

**Transitions:** Smooth crossfades. Slight parallax/zoom on each shot.

**Music:** Fades in — soft, rhythmic, builds energy.

**Narrator:**

BeanStack is a popular coffee chain that runs 106 bustling branches across the United States. Every week, branch managers submit a total of *over 200* reports ranging from revenue to maintenance issues!

At headquarters, a small ops team is supposed to read ALL of it. Take care of the problems. But nobody has time to read hundreds of reports a week... Instead, the problems stay buried...

That's why we built BeanStack Agent. An operations intelligence agent that connects the dots and takes action.

**Lower third (0:28):** `BeanStack — 106 branches across the US`

**Cut to:** Chat interface — Slack or Kibana Agent Builder UI. Clean, full-screen.

**Text overlay (0:32–0:35):** `Available on Slack, WhatsApp, or your client of choice`

---

## THE SOLUTION — MEET THE AGENT (0:35–1:05)

**Visual:** Architecture diagram (animated or static), then transition to agent config screen.

**Narrator:**

BeanStack's Agent is available in Slack and WhatsApp. It can be easily integrated into any platform. 

It is built on Elastic Agent Builder and has access to over 20 tools across three categories:  * Index Search tools that search across reports, staff, and financial data. 
* Analytics tools — pre-built queries for things like revenue by region and underperforming branches. 
* And Workflow tools that take real action — sending emails and creating cases

**Screen:** Show the tools panel in Agent Builder briefly, then the agent config with system prompt.

---

## SCENE 1 — THE BIG PICTURE (1:05–1:30)

**Music:** Continues, steady rhythm.

**Narrator (before typing):**
> Let's see it in action. The operations lead wants to compare how their biggest markets are performing.

**Screen recording — prompt typed:**
> `Compare the performance of our branches by region in 2025`

**Screen:** Agent responds. It selects the revenue_by_region ES|QL tool, then the search_financial_reports index search tool. Data streams in — revenue figures, customer satisfaction, transaction counts. BeanStack Uptown New York stands out.

**Narrator:**
The agent uses the revenue tool for precise aggregation, then searches the financial index for context. No prompt engineering needed — it picks the right tools automatically. Uptown New York is pulling far ahead. Something's different there.

---

## SCENE 2 — THE STORY BEHIND THE NUMBERS (1:30–2:00)

**Narrator (before typing):**
> Numbers tell you what happened. But the *why* is buried in unstructured weekly reports.

**Screen recording — prompt typed:**
> `Why is BeanStack Uptown New York leading? What happened there?`

**Screen:** Agent switches to the search_reports tool — semantic search with Cohere embeddings. Text fragments appear — weekly manager emails from months ago. The TikTok story surfaces.

**Narrator:**
Numbers tell you what happened. But the *why* is buried in unstructured weekly reports.

The agent switches to semantic search. It finds a weekly report from months ago mentioning a barista who went viral on TikTok... Tourists started lining up. A normal branch became a destination! That story *wasn't* in any spreadsheet — it was in an unstructured email that nobody had time to read.

---

## SCENE 3 — ACT ON IT (2:00–2:20)

**Screen recording — prompt typed:**
> `Send him an email asking to schedule a meeting — mention a possible raise!`

**Screen:** Agent uses the staff_by_branch tool to look up the manager, then triggers the send_manager_message workflow. The workflow does the rest: looks up the branch, finds the manager, sends the email, logs it to Elasticsearch. Confirmation appears in chat.

**Narrator:**
Now is time for action! The agent finds the branch manager using the staff lookup tool, then triggers a Kibana Workflow — a deterministic automation that sends a congratulatory email, logs the event, and confirms delivery. No hallucination risk on the action path!

**SFX:** Subtle notification chime on email confirmation.

**Lower third:** `Kibana Workflow: send_manager_message — deterministic, auditable`

---

## SCENE 4 — FIND WHAT'S BROKEN (2:20–2:50)

**Music:** Shifts slightly — minor key, more urgency.

**Narrator (before typing):**
> Now the hard part — finding the branches that need help before it's too late.

**Screen recording — prompt typed:**
> `Are there branches that consistently underperform? Why?`

**Screen:** Agent chains multiple tools: underperforming_branches ES|QL tool first for the numbers, then search_reports for the narrative context. Specific incidents surface: equipment fires, a staff walkout, a failed health inspection.

**Narrator:**
> The agent chains an ES|QL analytics query to find branches with low revenue, high equipment issues, and poor satisfaction — then pivots to semantic search to understand *why*. Three equipment fires at one location. A staff walkout at another. A health inspection failure that a third never recovered from. Structured data flags the problem. Unstructured reports explain the cause. The agent connects both.

**Lower third:** `Tool chaining: ES|QL analytics → semantic search → root cause`

---

## SCENE 5 — ESCALATE (2:50–3:15)

**Screen recording — prompt typed:**
> `Open a case about BeanStack Davis Philadelphia equipment failures and let the manager know we're on it`

**Screen:** Agent triggers the escalation workflow. A Kibana case appears — auto-composed description pulling from recent reports and financials. Then an email confirmation.

**Narrator:**
> To make sure operational issues are addressed promptly, the escalation workflow opens a Kibana case with an AI-composed description pulling from recent reports and financial data. It sends an email to the branch manager. And it logs everything.Reliable action, fully traceable.

**Lower third:** `Escalation workflow: case + email + audit log — one prompt`

---

## CLOSING — WHY THIS MATTERS (3:15–3:30)

**Music:** Drops to near-silence. Then one final beat.

**Screen:** Quick montage (1 sec each, smooth cuts):
1. Tools panel — 20+ tools listed
2. Workflow list — 3 automated workflows
3. Agent config screen with system prompt
4. Slack conversation with the agent
5. Architecture diagram

**Narrator:**
> BeanStack Agent replaces hours of manual report reading with seconds of intelligent search. It connects structured financial data with unstructured manager reports. It's time-aware — filtering by quarter, month, or custom ranges. It's geo-aware — comparing regions, cities, and individual locations. And when it finds something that matters, it doesn't just report it — it acts. Emails sent. Cases opened. Decisions made.
>
> One domain. Twenty-one tools. Real action.

**Cut to black.**

**Text on screen (centered, large, clean):**

> **BeanStack Agent**
> From buried reports to real action.

*(beat)*

> Built on Elastic Agent Builder.

**BeanStack logo fades in. Holds 2 seconds.**

---

## PRODUCTION NOTES

### Visual Style
- **Atmosphere shots:** Warm, desaturated, cinematic. Think indie documentary meets tech product video. Shallow depth of field. No stock-photo feel.
- **Screen recordings:** Clean, full-screen UI. No browser chrome. Dark mode if available. Mouse movements smooth and deliberate.
- **Architecture diagram:** Show the flow: User (Slack/Chat) → Elastic Agent Builder (Claude) → Tools (Index Search / ES|QL / Workflows) → Elasticsearch + Kibana. Keep it clean, minimal icons.
- **Text overlays:** Minimal. White on dark or semi-transparent background. Sans-serif (Inter, Helvetica Neue, or similar). No animation beyond fade.
- **Lower thirds:** Subtle — small text, bottom-left, fades in/out. Informational, not promotional. Specifically call out which tool type is being used.

### Audio
- **Music:** Single track, ambient electronic. Reference: Tycho, Odesza instrumentals, or royalty-free equivalents. No drops, no builds — just steady forward momentum with a slight intensification in Scene 4.
- **SFX:** Minimal. Typing sounds during screen recording (optional). One notification chime in Scene 3.
- **Voiceover:** Male or female, calm and confident. Not excited, not monotone. Conversational authority — like explaining something interesting to a smart friend.

### Pacing
- Atmosphere shots: 2–3 seconds each, crossfade transitions
- Screen recordings: Real-time typing, then 1.5x playback on agent responses (keep it snappy)
- Pauses: Brief silence before "One sentence, three actions" and before the closing tagline

### Color
- Atmosphere: Warm (amber/brown tones, coffee palette)
- Screen recording: Cool/neutral (whatever the UI provides)
- Closing: Black background, white text

---

## APPENDIX — Hackathon Criteria Coverage

| Criteria | How BeanStack Demonstrates It | Where in Demo |
|---|---|---|
| **Problem clearly defined** | 100+ branches, thousands of unread reports, buried operational insights | Intro (0:05–0:35) |
| **Solution effectively presented** | Live demo across 5 scenarios — analytics, search, action, escalation | Scenes 1–5 |
| **Explains Agent Builder usage** | Shows architecture, 3 tool types, system prompt, tool selection | Solution scene (0:35–1:05) |
| **Documentation / architecture** | Architecture diagram in solution scene, tool breakdown in closing | Solution + Closing |
| **Automates messy internal work** | Replaces manual reading of 2,600+ weekly reports + quarterly financials | Throughout |
| **Tool-driven agent (21 tools)** | 4 Index Search + 10 ES\|QL + 3 Workflow + 4 Built-in. Agent selects per query | Solution scene, all demo scenes |
| **Narrow domain agent** | Purpose-built for coffee chain operations — not a generic chatbot | Intro + Solution |
| **Measurable impact** | Hours of manual report reading → seconds. One prompt → three automated actions | Scenes 3, 5, Closing |
| **Embed where work happens** | Shown in Slack, Kibana Agent Builder UI, mention of WhatsApp | Intro, Closing montage |
| **Connect disconnected systems** | Chat → staff lookup → email → case management → audit log in one flow | Scenes 3, 5 |
| **Time-series aware** | 12 quarters of financial data, date-range filters on all ES\|QL tools | Scenes 1, 4 |
| **Geo-aware** | Revenue by region (enrich policy), branches with geo_point coordinates | Scene 1, revenue_by_region tool |
| **Reliable action** | Kibana Workflows for email, case creation, audit logging — deterministic, not LLM-generated | Scenes 3, 5 |

### Tool Architecture

**Index Search tools (4)** — LLM-driven, dynamic queries
| Tool | Index | Search Type |
|------|-------|-------------|
| search_reports | beanstack-reports | Cohere semantic + BM25 (RRF) |
| search_branches | beanstack-branches | Keyword + geo-spatial |
| search_staff | beanstack-staff | Keyword lookup |
| search_financial_reports | beanstack-financial-reports | Cohere semantic + BM25 (RRF) |

**ES|QL Analytics tools (10)** — Pre-built, parameterized, precise
| Tool | What It Does |
|------|-------------|
| revenue_by_region | Revenue aggregation with ENRICH policy for region join |
| underperforming_branches | Multi-metric scoring (revenue, satisfaction, equipment) |
| turnover_by_branch | Staff turnover analysis per branch and period |
| equipment_issues_by_branch | Equipment failure tracking and counts |
| branch_financial_summary | Comprehensive single-branch financial overview |
| report_count_by_branch | Report volume per branch in date range |
| branches_without_reports | Identifies branches missing reports |
| staff_by_branch | Staff roster lookup |
| branch_report_timeline | Report submission timeline |
| branches_by_region | Regional branch listing and counts |

**Workflow tools (3)** — Deterministic, auditable automations
| Tool | Actions |
|------|---------|
| send_manager_message | Branch lookup → manager lookup → send email → log to ES |
| escalation | Branch lookup → AI-compose case description → create Kibana case → email manager → log |
| missing_reports_reminder | Identify gaps → compose reminder → send email → log |

**Built-in platform tools (4)**
- search, list_indices, get_index_mapping, get_document_by_id

### Why 21 Tools Instead of 1 Generic Search

The agent has 21 specialized tools because different questions require fundamentally different query strategies:

- **"What's the revenue per region?"** → ES|QL aggregation with ENRICH join (not a search problem)
- **"Why is this branch underperforming?"** → Semantic search across unstructured reports (not an aggregation problem)
- **"Send the manager an email"** → Deterministic workflow (must not be LLM-generated)
- **"Who works at the NYC branch?"** → Simple keyword lookup (doesn't need embeddings)

By pre-building precise ES|QL queries for common analytics patterns, we get exact numbers — no LLM approximation, no prompt-dependent accuracy. By using Cohere embeddings for narrative search, we find context that keyword search would miss. By isolating actions into Kibana Workflows, we ensure reliability: the LLM decides *what* to do, but the workflow handles *how* — with validation, audit logging, and error handling built in.
