"""
Deploy BeanStack workflows to Kibana.
Creates workflows via the Kibana API from YAML definitions.

Note: Workflows require the 'workflows:ui:enabled' advanced setting to be true.
Run 00_enable_agent_builder.py first if not already done.
"""

import json
import os
from pathlib import Path
from urllib.parse import urlparse, urlunparse

import requests
import yaml
from dotenv import load_dotenv

load_dotenv()

KIBANA_URL = os.getenv("KIBANA_ENDPOINT")
API_KEY = os.getenv("ELASTICSEARCH_API_KEY")

WORKFLOWS_DIR = Path(__file__).parent / "workflows"
WORKFLOW_IDS_FILE = Path(__file__).parent / "workflow_ids.json"

# Workflows that should be created but not enabled (e.g. invalid/WIP)
DISABLED_WORKFLOWS = set()


def get_kibana_base_url() -> str:
    if not KIBANA_URL:
        raise ValueError("KIBANA_ENDPOINT is required")
    parsed = urlparse(KIBANA_URL)
    return urlunparse((parsed.scheme, parsed.netloc, "", "", "", ""))


def get_headers() -> dict:
    if not API_KEY:
        raise ValueError("ELASTICSEARCH_API_KEY is required")
    return {
        "Authorization": f"ApiKey {API_KEY}",
        "Content-Type": "application/json",
        "kbn-xsrf": "true",
        "x-elastic-internal-origin": "kibana",
    }


def load_workflow_files() -> list[tuple[str, str]]:
    """Load all YAML workflow files as raw strings from the workflows directory."""
    workflows = []
    for yaml_file in sorted(WORKFLOWS_DIR.glob("*.yaml")):
        raw_yaml = yaml_file.read_text()
        workflows.append((yaml_file.name, raw_yaml))
    return workflows


def delete_old_workflows(base_url: str, headers: dict):
    """Delete previously deployed workflows using the saved ID mapping."""
    if not WORKFLOW_IDS_FILE.exists():
        print("  No previous workflow_ids.json found, skipping cleanup.")
        return
    old_mapping = json.loads(WORKFLOW_IDS_FILE.read_text())
    if not old_mapping:
        print("  No previous workflows to delete.")
        return
    for name, wf_id in old_mapping.items():
        url = f"{base_url}/api/workflows/{wf_id}"
        resp = requests.delete(url, headers=headers)
        if resp.status_code in (200, 204):
            print(f"    ✓ Deleted old workflow '{name}' ({wf_id})")
        elif resp.status_code == 404:
            print(f"    - Workflow '{name}' ({wf_id}) already gone")
        else:
            print(f"    ⚠ Failed to delete '{name}': {resp.status_code}")


def deploy_workflow(base_url: str, headers: dict, filename: str, raw_yaml: str):
    """Deploy a single workflow via Kibana API.

    Two-step process:
    1. POST /api/workflows with {"yaml": ...} to create the workflow
    2. PUT /api/workflows/{id} with name, description, enabled to configure it
    """
    parsed = yaml.safe_load(raw_yaml)
    name = parsed.get("name", filename)
    description = parsed.get("description", "").strip()

    api_url = f"{base_url}/api/workflows"

    # Step 1: Create the workflow
    resp = requests.post(api_url, headers=headers, json={"yaml": raw_yaml})

    if resp.status_code not in (200, 201):
        print(f"    ✗ Failed to create workflow '{name}': {resp.status_code} - {resp.text}")
        return None

    wf_id = resp.json().get("id", "unknown")

    # Step 2: Set name, description, and enable via PUT
    enable = name not in DISABLED_WORKFLOWS
    put_resp = requests.put(
        f"{api_url}/{wf_id}",
        headers=headers,
        json={"name": name, "description": description, "enabled": enable},
    )
    if put_resp.status_code == 200:
        data = put_resp.json()
        valid = data.get("valid", False)
        enabled = data.get("enabled", False)
        errors = data.get("validationErrors", [])
        if valid and enabled:
            print(f"    ✓ Created workflow '{name}' (id: {wf_id}, enabled) from {filename}")
        elif valid:
            print(f"    ✓ Created workflow '{name}' (id: {wf_id}, valid but not enabled) from {filename}")
        else:
            print(f"    ⚠ Created workflow '{name}' (id: {wf_id}, invalid) from {filename}")
            if errors:
                for err in errors:
                    print(f"      Error: {err}")
    else:
        print(f"    ✓ Created workflow '{name}' (id: {wf_id}) from {filename}")
        print(f"    ⚠ Could not update properties: {put_resp.status_code}")

    return wf_id


def main():
    print("Deploying BeanStack workflows...\n")

    base_url = get_kibana_base_url()
    headers = get_headers()

    # First enable workflows setting
    print("Step 1: Enabling workflows feature flag...")
    settings_resp = requests.post(
        f"{base_url}/api/kibana/settings",
        headers={
            **headers,
            "elastic-api-version": "2023-10-31",
            "x-elastic-internal-origin": "kibana",
        },
        json={"changes": {"workflows:ui:enabled": True}},
    )
    if settings_resp.status_code == 200:
        print("  ✓ Workflows feature enabled.")
    else:
        print(f"  ⚠ Could not enable workflows: {settings_resp.status_code} - {settings_resp.text}")

    print("\nStep 2: Deleting old workflows...")
    delete_old_workflows(base_url, headers)

    print("\nStep 3: Loading workflow definitions...")
    workflows = load_workflow_files()
    print(f"  Found {len(workflows)} workflow YAML files.")

    print("\nStep 4: Deploying workflows...")
    results = {}
    for filename, raw_yaml in workflows:
        parsed = yaml.safe_load(raw_yaml)
        name = parsed.get("name", filename)
        wf_id = deploy_workflow(base_url, headers, filename, raw_yaml)
        results[name] = wf_id

    print("\n" + "=" * 50)
    print("Deployment Summary:")
    for name, wf_id in results.items():
        status = f"✓ id={wf_id}" if wf_id else "✗ manual setup needed"
        print(f"  {name}: {status}")

    # Save name → ID mapping for use by 11_setup_agent.py
    successful = {n: wid for n, wid in results.items() if wid}
    WORKFLOW_IDS_FILE.write_text(json.dumps(successful, indent=2))
    print(f"\n  Saved workflow ID mapping to {WORKFLOW_IDS_FILE}")

    failed = [n for n, wid in results.items() if wid is None]
    if failed:
        print(f"\n⚠ {len(failed)} workflow(s) need manual setup in the Kibana Workflows UI.")
        print(f"  YAML files are in: {WORKFLOWS_DIR}")
        print(f"  Go to: {base_url}/app/workflows")


if __name__ == "__main__":
    main()
