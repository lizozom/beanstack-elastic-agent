"""
Set up the BeanStack Research Agent via the Kibana Agent Builder API.
Creates custom tools, then creates the agent with those tools assigned.
Deletes existing resources first for a clean slate.
"""

import copy
import json
from pathlib import Path

import requests

from kibana_client import get_headers, get_kibana_base_url
from system_prompt import SYSTEM_PROMPT
from tools import ALL_TOOLS

AGENT_ID = "beanstack-research"

# Built-in platform tools to also assign to the agent
BUILTIN_TOOL_IDS = [
    "platform.core.search",
    "platform.core.list_indices",
    "platform.core.get_index_mapping",
    "platform.core.get_document_by_id",
]


def delete_agent_if_exists(base_url: str, headers: dict) -> None:
    """Delete the agent if it already exists."""
    url = f"{base_url}/api/agent_builder/agents/{AGENT_ID}"
    resp = requests.get(url, headers=headers)

    if resp.status_code == 200:
        print(f"  Agent '{AGENT_ID}' exists, deleting...")
        del_resp = requests.delete(url, headers=headers)
        if del_resp.status_code in (200, 204):
            print(f"  Deleted agent '{AGENT_ID}'.")
        else:
            print(f"  FAILED to delete agent: {del_resp.status_code} - {del_resp.text}")
            raise SystemExit(1)
    elif resp.status_code == 404:
        print(f"  Agent '{AGENT_ID}' does not exist, skipping delete.")
    else:
        print(f"  Error checking agent: {resp.status_code} - {resp.text}")
        raise SystemExit(1)


def delete_tool_if_exists(base_url: str, headers: dict, tool_id: str) -> None:
    """Delete a custom tool if it already exists."""
    url = f"{base_url}/api/agent_builder/tools/{tool_id}"
    resp = requests.get(url, headers=headers)

    if resp.status_code == 200:
        del_resp = requests.delete(url, headers=headers)
        if del_resp.status_code in (200, 204):
            print(f"    Deleted existing tool '{tool_id}'")
        else:
            print(
                f"    FAILED to delete tool '{tool_id}': "
                f"{del_resp.status_code} - {del_resp.text}"
            )
            raise SystemExit(1)


def load_workflow_id_mapping() -> dict:
    """Load the workflow name-to-ID mapping saved by 10_setup_workflows.py."""
    mapping_file = Path(__file__).parent / "workflow_ids.json"
    if not mapping_file.exists():
        print(f"  WARNING: {mapping_file} not found. Run 10_setup_workflows.py first.")
        return {}
    return json.loads(mapping_file.read_text())


def resolve_workflow_ids(tools: list[dict], wf_mapping: dict) -> list[dict]:
    """Replace workflow name references with actual Kibana workflow IDs."""
    resolved = []
    for tool in tools:
        if tool.get("type") == "workflow":
            tool = copy.deepcopy(tool)
            wf_name = tool["configuration"]["workflow_id"]
            if wf_name in wf_mapping:
                tool["configuration"]["workflow_id"] = wf_mapping[wf_name]
                print(f"    Resolved '{wf_name}' -> {wf_mapping[wf_name]}")
            else:
                print(
                    f"    WARNING: Workflow '{wf_name}' not found in Kibana"
                )
        resolved.append(tool)
    return resolved


def create_tool(base_url: str, headers: dict, tool: dict) -> None:
    """Create a custom tool via the Agent Builder API."""
    tool_id = tool["id"]
    delete_tool_if_exists(base_url, headers, tool_id)

    url = f"{base_url}/api/agent_builder/tools"
    resp = requests.post(url, headers=headers, json=tool)

    if resp.status_code in (200, 201):
        print(f"    Created tool '{tool_id}' ({tool['type']})")
    else:
        print(
            f"    FAILED to create tool '{tool_id}': "
            f"{resp.status_code} - {resp.text}"
        )
        raise SystemExit(1)


def create_agent(base_url: str, headers: dict) -> None:
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
        print(f"  Agent '{AGENT_ID}' created with {len(all_tool_ids)} tools.")
    else:
        print(f"  FAILED to create agent: {resp.status_code} - {resp.text}")
        raise SystemExit(1)


def main():
    print("Setting up BeanStack Research Agent...\n")

    base_url = get_kibana_base_url()
    headers = get_headers()

    print("Step 1: Checking for existing agent...")
    delete_agent_if_exists(base_url, headers)

    print("\nStep 2: Resolving workflow IDs...")
    wf_mapping = load_workflow_id_mapping()
    print(f"  Found {len(wf_mapping)} workflow ID mappings.")
    tools = resolve_workflow_ids(ALL_TOOLS, wf_mapping)

    print("\nStep 3: Creating custom tools...")
    for tool in tools:
        create_tool(base_url, headers, tool)

    print("\nStep 4: Creating agent...")
    create_agent(base_url, headers)

    print(f"\nDone! Agent '{AGENT_ID}' is ready.")
    print(f"  Tools: {len(BUILTIN_TOOL_IDS)} built-in + {len(ALL_TOOLS)} custom")
    print(f"  Chat: {base_url}/app/agent_builder/chat/{AGENT_ID}")


if __name__ == "__main__":
    main()
