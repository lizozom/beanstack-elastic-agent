"""
Enable the Agent Builder feature flag, Workflows UI, configure default AI connector,
and set up the BeanStack email connector in Kibana.

Env vars:
  KIBANA_ENDPOINT         - Kibana URL
  ELASTICSEARCH_API_KEY   - API key with Kibana access
  SMTP_HOST               - SMTP server host (e.g. smtp.gmail.com)
  SMTP_PORT               - SMTP port (default: 587)
  SMTP_FROM               - Sender email address
  SMTP_USER               - SMTP username
  SMTP_PASSWORD            - SMTP password
"""

import os

import requests

from kibana_client import EMAIL_CONNECTOR_ID, get_headers, get_kibana_base_url


def enable_features(base_url: str, headers: dict) -> None:
    """Enable Agent Builder, Workflows UI, and set default AI connector."""
    payload = {
        "changes": {
            "agentBuilder:enabled": True,
            "workflows:ui:enabled": True,
            "genAiSettings:defaultAIConnector": "Anthropic-Claude-Sonnet-4-5",
        }
    }
    resp = requests.post(f"{base_url}/api/kibana/settings", headers=headers, json=payload)
    if resp.status_code == 200:
        print("  Agent Builder enabled.")
        print("  Workflows UI enabled.")
        print("  Default AI connector set to: Anthropic Claude Sonnet 4.5")
    else:
        print(f"  Error enabling features: {resp.status_code} - {resp.text}")


def _build_email_connector_config() -> dict | None:
    """Build the email connector config from SMTP env vars, or None if incomplete."""
    smtp_host = os.getenv("SMTP_HOST")
    smtp_port = int(os.getenv("SMTP_PORT", "587"))
    smtp_from = os.getenv("SMTP_FROM")
    smtp_user = os.getenv("SMTP_USER")
    smtp_password = os.getenv("SMTP_PASSWORD")

    if not all([smtp_host, smtp_from, smtp_user, smtp_password]):
        return None

    return {
        "name": "BeanStack Email",
        "config": {
            "from": smtp_from,
            "service": "other",
            "host": smtp_host,
            "port": smtp_port,
            "secure": smtp_port == 465,
            "hasAuth": True,
        },
        "secrets": {
            "user": smtp_user,
            "password": smtp_password,
        },
    }


def setup_email_connector(base_url: str, headers: dict) -> None:
    """Create or update the BeanStack email connector."""
    connector_config = _build_email_connector_config()
    if connector_config is None:
        print("  WARNING: SMTP_HOST, SMTP_FROM, SMTP_USER, and SMTP_PASSWORD are required.")
        print("  Skipping email connector setup. Set these env vars and re-run.")
        return

    url = f"{base_url}/api/actions/connector/{EMAIL_CONNECTOR_ID}"
    resp = requests.get(url, headers=headers)

    if resp.status_code == 200:
        print(f"  Email connector '{EMAIL_CONNECTOR_ID}' already exists, updating...")
        resp = requests.put(url, headers=headers, json=connector_config)
    else:
        print(f"  Creating email connector '{EMAIL_CONNECTOR_ID}'...")
        connector_config["connector_type_id"] = ".email"
        resp = requests.post(url, headers=headers, json=connector_config)

    if resp.status_code in (200, 201):
        smtp_from = connector_config["config"]["from"]
        print(f"  Email connector '{EMAIL_CONNECTOR_ID}' ready (from: {smtp_from})")
    else:
        print(f"  Error setting up email connector: {resp.status_code} - {resp.text}")


def main():
    base_url = get_kibana_base_url()
    headers = get_headers()

    print("Step 1: Enabling features...")
    enable_features(base_url, headers)

    print("\nStep 2: Setting up email connector...")
    setup_email_connector(base_url, headers)

    print("\nDone!")


if __name__ == "__main__":
    main()
