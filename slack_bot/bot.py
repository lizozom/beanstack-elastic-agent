"""
BeanStack Slack Bot — connects Slack to the BeanStack Agent
via the Elastic Agent Builder converse API.

Runs in Socket Mode (no public URL needed).

Supports:
  - @BeanStack mentions in channels (single-turn)
  - DM conversations with multi-turn follow-ups

Setup:
  1. Create a Slack app at https://api.slack.com/apps
  2. Enable Socket Mode -> generates an xapp- app-level token
  3. Add bot token scopes: chat:write, app_mentions:read,
     channels:history, im:history, im:read, im:write
  4. Subscribe to events: app_mention, message.channels, message.im
  5. Enable Messages Tab in App Home (allow users to send messages)
  6. Install the app to your workspace -> get the xoxb- bot token
  7. Invite the bot to channels: /invite @BeanStack
  8. Set env vars in .env:
       SLACK_BOT_TOKEN=xoxb-...
       SLACK_APP_TOKEN=xapp-...
       KIBANA_ENDPOINT=https://your-kibana-instance
       ELASTICSEARCH_API_KEY=your-api-key

Usage:
  uv run python slack_bot/bot.py
"""

import os
import re
import threading
from urllib.parse import urlparse, urlunparse

import requests
from dotenv import load_dotenv
from slack_bolt import App
from slack_bolt.adapter.socket_mode import SocketModeHandler

load_dotenv()

AGENT_ID = "beanstack-research"

# Slack setup
app = App(token=os.environ["SLACK_BOT_TOKEN"])

# Kibana connection (same env vars as the setup scripts)
_kibana_url = os.getenv("KIBANA_ENDPOINT")
if not _kibana_url:
    raise ValueError("KIBANA_ENDPOINT is required")
_parsed = urlparse(_kibana_url)
KIBANA_BASE_URL = urlunparse((_parsed.scheme, _parsed.netloc, "", "", "", ""))

_api_key = os.getenv("ELASTICSEARCH_API_KEY")
if not _api_key:
    raise ValueError("ELASTICSEARCH_API_KEY is required")
KIBANA_HEADERS = {
    "Authorization": f"ApiKey {_api_key}",
    "Content-Type": "application/json",
    "kbn-xsrf": "true",
    "elastic-api-version": "2023-10-31",
    "x-elastic-internal-origin": "kibana",
}

# Map Slack thread_ts -> Agent Builder conversation_id for multi-turn
_thread_conversations: dict[str, str] = {}
# Track threads where the bot was mentioned (so we respond to follow-ups)
_active_threads: set[str] = set()


def md_to_slack(text: str) -> str:
    """Convert standard Markdown to Slack mrkdwn format."""
    # Links: [text](url) -> <url|text>
    text = re.sub(r"\[([^\]]+)\]\(([^)]+)\)", r"<\2|\1>", text)
    # Bold: **text** -> *text*
    text = re.sub(r"\*\*(.+?)\*\*", r"*\1*", text)
    # Italic: _text_ stays the same in Slack; convert *text* (single) -> _text_
    # (only when not inside bold — already converted above)
    # Headers: ### text / ## text / # text -> *text* (bold)
    text = re.sub(r"^#{1,3}\s+(.+)$", r"*\1*", text, flags=re.MULTILINE)
    # Strikethrough: ~~text~~ -> ~text~
    text = re.sub(r"~~(.+?)~~", r"~\1~", text)
    # Bullet lists: - item or * item -> • item
    text = re.sub(r"^[\-\*]\s+", "• ", text, flags=re.MULTILINE)
    return text


def converse(text: str, thread_ts: str | None = None) -> str:
    """Send a message to the BeanStack agent and return its response."""
    payload: dict = {
        "input": text,
        "agent_id": AGENT_ID,
    }
    if thread_ts and thread_ts in _thread_conversations:
        payload["conversation_id"] = _thread_conversations[thread_ts]

    resp = requests.post(
        f"{KIBANA_BASE_URL}/api/agent_builder/converse",
        headers=KIBANA_HEADERS,
        json=payload,
        timeout=120,
    )
    resp.raise_for_status()
    data = resp.json()

    # Save conversation_id for follow-up messages in the same thread
    conv_id = data.get("conversation_id")
    if conv_id and thread_ts:
        _thread_conversations[thread_ts] = conv_id

    reply = ""
    resp_obj = data.get("response")
    if isinstance(resp_obj, dict):
        reply = resp_obj.get("message", "")
    elif isinstance(resp_obj, str):
        reply = resp_obj
    return reply or "No response from agent."


PROGRESS_MESSAGES = [
    ":coffee: Thinking...",
    ":coffee: Working on it...",
    ":coffee: Processing...",
    ":coffee: Searching reports...",
    ":coffee: Crunching numbers...",
    ":coffee: Almost there...",
]


def handle_user_message(text, thread_ts, say):
    """Process a user message and reply in the thread."""
    # Post the initial status message
    result = say(text=PROGRESS_MESSAGES[0], thread_ts=thread_ts)
    channel = result["channel"]
    msg_ts = result["ts"]

    # Cycle through progress messages in a background thread
    done = threading.Event()
    def update_progress():
        idx = 1
        while not done.wait(timeout=3):
            msg = PROGRESS_MESSAGES[idx % len(PROGRESS_MESSAGES)]
            try:
                app.client.chat_update(channel=channel, ts=msg_ts, text=msg)
            except Exception:
                pass
            idx += 1

    progress_thread = threading.Thread(target=update_progress, daemon=True)
    progress_thread.start()

    try:
        reply = converse(text, thread_ts)
        done.set()
        app.client.chat_update(
            channel=channel, ts=msg_ts, text=md_to_slack(reply),
        )
    except Exception as e:
        done.set()
        app.client.chat_update(
            channel=channel, ts=msg_ts, text=f"Something went wrong: {e}",
        )


@app.event("app_mention")
def handle_mention(event, say):
    """Respond to @BeanStack mentions in channels."""
    text = event.get("text", "")
    bot_user_id = app.client.auth_test()["user_id"]
    text = text.replace(f"<@{bot_user_id}>", "").strip()
    if not text:
        return

    thread_ts = event.get("thread_ts") or event.get("ts")
    _active_threads.add(thread_ts)
    handle_user_message(text, thread_ts, say)


@app.event("message")
def handle_message(event, say):
    """Respond to DMs and follow-up messages in active threads."""
    if event.get("bot_id") or event.get("subtype"):
        return

    text = event.get("text", "").strip()
    if not text:
        return

    channel_type = event.get("channel_type")
    thread_ts = event.get("thread_ts")

    # In channels, only respond to follow-ups in threads we started
    if thread_ts and thread_ts in _active_threads:
        pass  # Follow-up in a tracked thread
    elif channel_type == "im":
        pass  # DM — always respond
    else:
        return

    if not thread_ts:
        thread_ts = event.get("ts")

    handle_user_message(text, thread_ts, say)


if __name__ == "__main__":
    print("Starting BeanStack Slack bot...")
    print(f"  Agent: {AGENT_ID}")
    print(f"  Kibana: {KIBANA_BASE_URL}")
    print("  Modes: @mention in channels, DM for multi-turn")
    handler = SocketModeHandler(app, os.environ["SLACK_APP_TOKEN"])
    handler.start()
