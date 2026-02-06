"""
Deploy BeanStack workflows to Kibana.
Creates workflows via the Kibana API from YAML definitions.

Note: Workflows require the 'workflows:ui:enabled' advanced setting to be true.
Run 00_enable_agent_builder.py first if not already done.
"""

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
    }


def load_workflow_yamls() -> list[dict]:
    """Load all YAML workflow definitions from the workflows directory."""
    workflows = []
    for yaml_file in sorted(WORKFLOWS_DIR.glob("*.yaml")):
        with open(yaml_file) as f:
            workflow = yaml.safe_load(f)
        workflow["_file"] = yaml_file.name
        workflows.append(workflow)
    return workflows


def deploy_workflow(base_url: str, headers: dict, workflow: dict):
    """Deploy a single workflow via Kibana API."""
    name = workflow["name"]
    filename = workflow.pop("_file")

    # Try to get existing workflow to check if we need to delete first
    list_url = f"{base_url}/api/workflows"
    resp = requests.get(list_url, headers=headers)

    if resp.status_code == 200:
        existing = resp.json()
        # Look for existing workflow by name
        for wf in existing.get("workflows", existing if isinstance(existing, list) else []):
            wf_name = wf.get("name", "")
            wf_id = wf.get("id", "")
            if wf_name == name and wf_id:
                print(f"    Deleting existing workflow '{name}' (id: {wf_id})...")
                del_resp = requests.delete(
                    f"{base_url}/api/workflows/{wf_id}", headers=headers
                )
                if del_resp.status_code in (200, 204):
                    print(f"    ✓ Deleted.")
                else:
                    print(f"    ⚠ Delete returned {del_resp.status_code}: {del_resp.text}")

    # Create the workflow
    create_url = f"{base_url}/api/workflows"
    # The API expects the YAML content as a string in the body
    yaml_content = yaml.dump(workflow, default_flow_style=False, sort_keys=False)

    resp = requests.post(
        create_url,
        headers={**headers, "Content-Type": "application/yaml"},
        data=yaml_content,
    )

    if resp.status_code in (200, 201):
        wf_id = resp.json().get("id", "unknown")
        print(f"    ✓ Created workflow '{name}' (id: {wf_id}) from {filename}")
        return wf_id
    else:
        # If YAML content-type doesn't work, try JSON wrapper
        resp2 = requests.post(
            create_url,
            headers=headers,
            json={"definition": yaml_content},
        )
        if resp2.status_code in (200, 201):
            wf_id = resp2.json().get("id", "unknown")
            print(f"    ✓ Created workflow '{name}' (id: {wf_id}) from {filename}")
            return wf_id
        else:
            print(f"    ✗ Failed to create workflow '{name}': {resp.status_code} - {resp.text}")
            print(f"      (Also tried JSON: {resp2.status_code} - {resp2.text})")
            print(f"      You may need to create this workflow manually in the Kibana UI.")
            print(f"      File: workflows/{filename}")
            return None


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

    print("\nStep 2: Loading workflow definitions...")
    workflows = load_workflow_yamls()
    print(f"  Found {len(workflows)} workflow YAML files.")

    print("\nStep 3: Deploying workflows...")
    results = {}
    for workflow in workflows:
        name = workflow["name"]
        wf_id = deploy_workflow(base_url, headers, workflow)
        results[name] = wf_id

    print("\n" + "=" * 50)
    print("Deployment Summary:")
    for name, wf_id in results.items():
        status = f"✓ id={wf_id}" if wf_id else "✗ manual setup needed"
        print(f"  {name}: {status}")

    failed = [n for n, wid in results.items() if wid is None]
    if failed:
        print(f"\n⚠ {len(failed)} workflow(s) need manual setup in the Kibana Workflows UI.")
        print(f"  YAML files are in: {WORKFLOWS_DIR}")
        print(f"  Go to: {base_url}/app/workflows")


if __name__ == "__main__":
    main()
