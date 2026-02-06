"""
Enable the Agent Builder feature flag in Kibana.
Sets agentBuilder:enabled to true via Kibana settings API.
"""

import os
import requests
from dotenv import load_dotenv

load_dotenv()

KIBANA_URL = os.getenv("KIBANA_ENDPOINT")
API_KEY = os.getenv("ELASTICSEARCH_API_KEY")


def main():
    if not KIBANA_URL:
        raise ValueError("KIBANA_ENDPOINT is required")
    if not API_KEY:
        raise ValueError("ELASTICSEARCH_API_KEY is required")

    headers = {
        "kbn-xsrf": "true",
        "Content-Type": "application/json",
        "Authorization": f"ApiKey {API_KEY}",
        "elastic-api-version": "2023-10-31",
        "x-elastic-internal-origin": "kibana",
    }

    payload = {
        "changes": {
            "agentBuilder:enabled": True
        }
    }

    # Strip any path after the host — we only need the base Kibana URL
    from urllib.parse import urlparse, urlunparse
    parsed = urlparse(KIBANA_URL)
    kibana_url = urlunparse((parsed.scheme, parsed.netloc, "", "", "", ""))

    url = f"{kibana_url}/api/kibana/settings"
    response = requests.post(url, headers=headers, json=payload)

    if response.status_code == 200:
        print("Agent Builder successfully enabled.")
    else:
        print(f"Error: {response.status_code} - {response.text}")


if __name__ == "__main__":
    main()
