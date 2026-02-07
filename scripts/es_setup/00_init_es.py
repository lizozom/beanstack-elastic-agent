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
from urllib.parse import urlparse, urlunparse

import requests
from dotenv import load_dotenv

load_dotenv()

KIBANA_URL = os.getenv("KIBANA_ENDPOINT")
API_KEY = os.getenv("ELASTICSEARCH_API_KEY")

EMAIL_CONNECTOR_ID = "478761f2-04b4-5905-a3bb-3315ace3d780"


def get_kibana_base_url() -> str:
    if not KIBANA_URL:
        raise ValueError("KIBANA_ENDPOINT is required")
    parsed = urlparse(KIBANA_URL)
    return urlunparse((parsed.scheme, parsed.netloc, "", "", "", ""))


def get_headers() -> dict:
    if not API_KEY:
        raise ValueError("ELASTICSEARCH_API_KEY is required")
    return {
        "kbn-xsrf": "true",
        "Content-Type": "application/json",
        "Authorization": f"ApiKey {API_KEY}",
        "elastic-api-version": "2023-10-31",
        "x-elastic-internal-origin": "kibana",
    }


def enable_features(base_url: str, headers: dict):
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


def setup_email_connector(base_url: str, headers: dict):
    """Create or update the BeanStack email connector."""
    smtp_host = os.getenv("SMTP_HOST")
    smtp_port = int(os.getenv("SMTP_PORT", "587"))
    smtp_from = os.getenv("SMTP_FROM")
    smtp_user = os.getenv("SMTP_USER")
    smtp_password = os.getenv("SMTP_PASSWORD")

    if not all([smtp_host, smtp_from, smtp_user, smtp_password]):
        print("  WARNING: SMTP_HOST, SMTP_FROM, SMTP_USER, and SMTP_PASSWORD are required.")
        print("  Skipping email connector setup. Set these env vars and re-run.")
        return

    # Check if connector already exists
    url = f"{base_url}/api/actions/connector/{EMAIL_CONNECTOR_ID}"
    resp = requests.get(url, headers=headers)
    if resp.status_code == 200:
        print(f"  Email connector '{EMAIL_CONNECTOR_ID}' already exists, updating...")
        resp = requests.put(
            url,
            headers=headers,
            json={
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
            },
        )
    else:
        print(f"  Creating email connector '{EMAIL_CONNECTOR_ID}'...")
        resp = requests.post(
            url,
            headers=headers,
            json={
                "connector_type_id": ".email",
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
            },
        )

    if resp.status_code in (200, 201):
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
