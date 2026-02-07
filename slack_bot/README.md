# BeanStack Slack Bot

Connects Slack to the BeanStack Agent via the Elastic Agent Builder [converse API](https://www.elastic.co/docs/reference/kibana/agent-builder-api). Runs in **Socket Mode** — no public URL or ngrok needed.

## How it works

```
Slack message
  → slack-bolt (Socket Mode)
    → POST /api/agent_builder/converse
    ← agent response
  → Slack reply (in-thread)
```

**Two modes:**

| Mode | How to use | Multi-turn |
|---|---|---|
| Channel @mention | `@BeanStack <question>` in any channel the bot is invited to | No |
| Direct message | Message the bot directly | Yes — each DM is a continuing conversation |

## Prerequisites

- Python 3.11+
- [uv](https://docs.astral.sh/uv/) package manager
- A running Elastic deployment with Agent Builder and the `beanstack-research` agent configured
- A Slack workspace where you can install apps

## Setup

### 1. Create the Slack app

1. Go to [api.slack.com/apps](https://api.slack.com/apps)
2. Click **Create New App** → **From a manifest**
3. Select your workspace
4. Paste the contents of [`slack_app_manifest.json`](slack_app_manifest.json)
5. Click **Create**

### 2. Get your tokens

- **App-Level Token** (`xapp-`): Settings → Basic Information → App-Level Tokens → Generate Token (add `connections:write` scope)
- **Bot Token** (`xoxb-`): Settings → OAuth & Permissions → Install to Workspace → copy Bot User OAuth Token

### 3. Configure environment

Add to your `.env` file in the project root:

```
SLACK_BOT_TOKEN=xoxb-your-bot-token
SLACK_APP_TOKEN=xapp-your-app-token
KIBANA_ENDPOINT=https://your-kibana-instance
ELASTICSEARCH_API_KEY=your-api-key
```

`KIBANA_ENDPOINT` and `ELASTICSEARCH_API_KEY` are the same values used by the setup scripts.

### 4. Install dependencies

```bash
uv sync
```

### 5. Run the bot

```bash
uv run python slack_bot/bot.py
```

### 6. Invite the bot to channels

In any Slack channel:

```
/invite @BeanStack
```

## Usage

**In a channel:**
```
@BeanStack Compare the performance of New York and Boston branches
```

**In a DM:**
Just message the bot directly. Follow-up messages continue the same conversation with the agent.

## Troubleshooting

**"Sending messages to this app has been turned off"**
- Fully quit and reopen Slack (the desktop app caches app settings aggressively)
- Verify in App Home settings that Messages Tab is enabled and not read-only
- Do **not** enable the Assistant framework (`assistant_view` / `assistant:write` scope) — it overrides normal DM behavior

**Bot doesn't respond in channels**
- Make sure the bot is invited to the channel (`/invite @BeanStack`)
- You must @mention the bot — it won't respond to plain messages in channels

**No multi-turn in channels**
- Thread follow-ups in channels require re-mentioning the bot
- For multi-turn conversations, use DMs
