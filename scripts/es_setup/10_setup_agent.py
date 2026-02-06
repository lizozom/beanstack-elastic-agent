"""
Set up the BeanStack Research Agent via the Kibana Agent Builder API.
Creates custom tools, then creates the agent with those tools assigned.
Deletes existing resources first for a clean slate.
"""

import os
from urllib.parse import urlparse, urlunparse

import requests
from dotenv import load_dotenv

from system_prompt import SYSTEM_PROMPT
from tools import ALL_TOOLS

load_dotenv()

KIBANA_URL = os.getenv("KIBANA_ENDPOINT")
API_KEY = os.getenv("ELASTICSEARCH_API_KEY")

AGENT_ID = "beanstack-research"

# Built-in platform tools to also assign to the agent
BUILTIN_TOOL_IDS = [
    "platform.core.search",
    "platform.core.list_indices",
    "platform.core.get_index_mapping",
    "platform.core.get_document_by_id",
]


def get_kibana_base_url() -> str:
    """Extract the base Kibana URL (scheme + host) from the configured endpoint."""
    if not KIBANA_URL:
        raise ValueError("KIBANA_ENDPOINT is required")
    parsed = urlparse(KIBANA_URL)
    return urlunparse((parsed.scheme, parsed.netloc, "", "", "", ""))


def get_headers() -> dict:
    """Return common headers for Kibana API requests."""
    if not API_KEY:
        raise ValueError("ELASTICSEARCH_API_KEY is required")
    return {
        "Authorization": f"ApiKey {API_KEY}",
        "Content-Type": "application/json",
        "kbn-xsrf": "true",
    }


def delete_agent_if_exists(base_url: str, headers: dict):
    """Delete the agent if it already exists."""
    url = f"{base_url}/api/agent_builder/agents/{AGENT_ID}"
    resp = requests.get(url, headers=headers)

    if resp.status_code == 200:
        print(f"  Agent '{AGENT_ID}' exists, deleting...")
        del_resp = requests.delete(url, headers=headers)
        if del_resp.status_code in (200, 204):
            print(f"  ✓ Agent '{AGENT_ID}' deleted.")
        else:
            print(f"  ✗ Failed to delete agent: {del_resp.status_code} - {del_resp.text}")
            raise SystemExit(1)
    elif resp.status_code == 404:
        print(f"  Agent '{AGENT_ID}' does not exist, skipping delete.")
    else:
        print(f"  ✗ Error checking agent: {resp.status_code} - {resp.text}")
        raise SystemExit(1)


def delete_tool_if_exists(base_url: str, headers: dict, tool_id: str):
    """Delete a custom tool if it already exists."""
    url = f"{base_url}/api/agent_builder/tools/{tool_id}"
    resp = requests.get(url, headers=headers)

    if resp.status_code == 200:
        del_resp = requests.delete(url, headers=headers)
        if del_resp.status_code in (200, 204):
            print(f"    ✓ Deleted existing tool '{tool_id}'")
        else:
            print(f"    ✗ Failed to delete tool '{tool_id}': {del_resp.status_code} - {del_resp.text}")
            raise SystemExit(1)


def create_tool(base_url: str, headers: dict, tool: dict):
    """Create a custom tool via the Agent Builder API."""
    tool_id = tool["id"]
    delete_tool_if_exists(base_url, headers, tool_id)

    url = f"{base_url}/api/agent_builder/tools"
    resp = requests.post(url, headers=headers, json=tool)

    if resp.status_code in (200, 201):
        print(f"    ✓ Created tool '{tool_id}' ({tool['type']})")
    else:
        print(f"    ✗ Failed to create tool '{tool_id}': {resp.status_code} - {resp.text}")
        raise SystemExit(1)


def create_agent(base_url: str, headers: dict):
    """Create the BeanStack Research Agent with all tools assigned."""
    url = f"{base_url}/api/agent_builder/agents"

    custom_tool_ids = [t["id"] for t in ALL_TOOLS]
    all_tool_ids = BUILTIN_TOOL_IDS + custom_tool_ids

    payload = {
        "id": AGENT_ID,
        "name": "BeanStack Agent",
        "description": (
            "Operational intelligence agent for the BeanStack coffee chain. "
            "Analyzes branch reports, staff data, and operational metrics "
            "across 100+ US locations."
        ),
        "labels": ["beanstack", "operations"],
        "avatar_color": "#36B37E",
        "avatar_symbol": "BS",
        "configuration": {
            "instructions": SYSTEM_PROMPT,
            "tools": [
                {
                    "tool_ids": all_tool_ids,
                }
            ],
        },
    }

    resp = requests.post(url, headers=headers, json=payload)

    if resp.status_code in (200, 201):
        print(f"  ✓ Agent '{AGENT_ID}' created with {len(all_tool_ids)} tools.")
    else:
        print(f"  ✗ Failed to create agent: {resp.status_code} - {resp.text}")
        raise SystemExit(1)


def main():
    print("Setting up BeanStack Research Agent...\n")

    base_url = get_kibana_base_url()
    headers = get_headers()

    print("Step 1: Checking for existing agent...")
    delete_agent_if_exists(base_url, headers)

    print("\nStep 2: Creating custom tools...")
    for tool in ALL_TOOLS:
        create_tool(base_url, headers, tool)

    print(f"\nStep 3: Creating agent...")
    create_agent(base_url, headers)

    print(f"\nDone! Agent '{AGENT_ID}' is ready.")
    print(f"  Tools: {len(BUILTIN_TOOL_IDS)} built-in + {len(ALL_TOOLS)} custom")
    print(f"  Chat: {base_url}/app/agent_builder/chat/{AGENT_ID}")


if __name__ == "__main__":
    main()
