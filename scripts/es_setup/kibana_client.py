"""
Shared Kibana API helpers for BeanStack setup scripts.
"""

import os
from urllib.parse import urlparse, urlunparse

from dotenv import load_dotenv

load_dotenv()

EMAIL_CONNECTOR_ID = "478761f2-04b4-5905-a3bb-3315ace3d780"


def get_kibana_base_url() -> str:
    """Extract the base Kibana URL (scheme + host) from the configured endpoint."""
    kibana_url = os.getenv("KIBANA_ENDPOINT")
    if not kibana_url:
        raise ValueError("KIBANA_ENDPOINT is required")
    parsed = urlparse(kibana_url)
    return urlunparse((parsed.scheme, parsed.netloc, "", "", "", ""))


def get_headers() -> dict:
    """Return common headers for Kibana API requests."""
    api_key = os.getenv("ELASTICSEARCH_API_KEY")
    if not api_key:
        raise ValueError("ELASTICSEARCH_API_KEY is required")
    return {
        "Authorization": f"ApiKey {api_key}",
        "Content-Type": "application/json",
        "kbn-xsrf": "true",
        "elastic-api-version": "2023-10-31",
        "x-elastic-internal-origin": "kibana",
    }
