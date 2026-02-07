"""
Shared Elasticsearch client and index constants for BeanStack setup scripts.
"""

import os
from pathlib import Path

from dotenv import load_dotenv
from elasticsearch import Elasticsearch

load_dotenv()

# Index names
INDEX_BRANCHES = "beanstack-branches"
INDEX_STAFF = "beanstack-staff"
INDEX_REPORTS = "beanstack-reports"
INDEX_FINANCIAL = "beanstack-financial-reports"

# Paths
PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent
DATA_DIR = PROJECT_ROOT / "data" / "generated"

# Inference
INFERENCE_ID = "cohere-embed"


def get_es_client() -> Elasticsearch:
    """Create an Elasticsearch client from environment variables."""
    es_url = os.getenv("ELASTICSEARCH_ENDPOINT")
    es_api_key = os.getenv("ELASTICSEARCH_API_KEY")
    if not es_url:
        raise ValueError("ELASTICSEARCH_ENDPOINT is required")
    if not es_api_key:
        raise ValueError("ELASTICSEARCH_API_KEY is required")
    return Elasticsearch(es_url, api_key=es_api_key)


def print_connection_info(es: Elasticsearch) -> None:
    """Print cluster connection details."""
    info = es.info()
    print(f"  Connected to cluster: {info['cluster_name']} (v{info['version']['number']})")
