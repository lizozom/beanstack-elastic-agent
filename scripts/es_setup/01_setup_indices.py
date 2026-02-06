"""
Set up Elasticsearch indices for BeanStack coffee chain data.
Creates indices for branches, staff, and weekly reports.
Reports index includes a semantic_text field for Cohere embed-english-v4 embeddings.
"""

import os
import sys
from dotenv import load_dotenv
from elasticsearch import Elasticsearch

load_dotenv()

ES_URL = os.getenv("ELASTICSEARCH_ENDPOINT")
ES_API_KEY = os.getenv("ELASTICSEARCH_API_KEY")
COHERE_API_KEY = os.getenv("COHERE_API_KEY")

INDEX_BRANCHES = "beanstack-branches"
INDEX_STAFF = "beanstack-staff"
INDEX_REPORTS = "beanstack-reports"

INFERENCE_ID = "cohere-embed"


def get_es_client() -> Elasticsearch:
    """Create an Elasticsearch client from env vars."""
    if not ES_URL:
        raise ValueError("ELASTICSEARCH_ENDPOINT is required")
    if not ES_API_KEY:
        raise ValueError("ELASTICSEARCH_API_KEY is required")
    return Elasticsearch(ES_URL, api_key=ES_API_KEY)


def create_inference_endpoint(es: Elasticsearch):
    """Create the Cohere embedding inference endpoint if it doesn't exist."""
    try:
        es.inference.get(inference_id=INFERENCE_ID)
        print(f"  Inference endpoint '{INFERENCE_ID}' already exists, skipping.")
        return
    except Exception:
        pass

    if not COHERE_API_KEY:
        print("  WARNING: COHERE_API_KEY not set. Skipping inference endpoint creation.")
        print("  You'll need to create it manually before indexing reports.")
        return

    print(f"  Creating inference endpoint '{INFERENCE_ID}'...")
    es.inference.put(
        inference_id=INFERENCE_ID,
        task_type="text_embedding",
        body={
            "service": "cohere",
            "service_settings": {
                "api_key": COHERE_API_KEY,
                "model_id": "embed-v4.0",
                "embedding_type": "float",
            },
        },
    )
    print(f"  ✓ Inference endpoint '{INFERENCE_ID}' created.")


BRANCHES_MAPPINGS = {
    "properties": {
        "id": {"type": "keyword"},
        "name": {"type": "text", "fields": {"keyword": {"type": "keyword"}}},
        "address": {"type": "text"},
        "city": {"type": "keyword"},
        "state": {"type": "keyword"},
        "zip": {"type": "keyword"},
        "region": {"type": "keyword"},
        "location": {"type": "geo_point"},
        "size": {"type": "keyword"},
        "opened_date": {"type": "date", "format": "yyyy-MM-dd"},
        "closed_date": {"type": "date", "format": "yyyy-MM-dd"},
        "status": {"type": "keyword"},
        "manager_email": {"type": "keyword"},
    }
}

STAFF_MAPPINGS = {
    "properties": {
        "id": {"type": "keyword"},
        "name": {"type": "text", "fields": {"keyword": {"type": "keyword"}}},
        "email": {"type": "keyword"},
        "role": {"type": "keyword"},
        "branch_id": {"type": "keyword"},
        "branch_name": {"type": "text", "fields": {"keyword": {"type": "keyword"}}},
        "start_date": {"type": "date", "format": "yyyy-MM-dd"},
        "status": {"type": "keyword"},
    }
}

REPORTS_MAPPINGS = {
    "properties": {
        "id": {"type": "keyword"},
        "branch_id": {"type": "keyword"},
        "branch_name": {"type": "text", "fields": {"keyword": {"type": "keyword"}}},
        "sender_email": {"type": "keyword"},
        "subject": {"type": "text"},
        "text": {"type": "text"},
        "text_embedding": {
            "type": "semantic_text",
            "inference_id": INFERENCE_ID,
        },
        "date": {"type": "date", "format": "yyyy-MM-dd"},
        "timestamp": {"type": "date"},
    }
}


def create_index(es: Elasticsearch, name: str, mappings: dict):
    """Create an index, deleting it first if it already exists."""
    if es.indices.exists(index=name):
        print(f"  Index '{name}' exists, deleting...")
        es.indices.delete(index=name)

    print(f"  Creating index '{name}'...")
    es.indices.create(index=name, mappings=mappings)
    print(f"  ✓ Index '{name}' created.")


def main():
    delete_only = "--delete" in sys.argv

    print("Connecting to Elasticsearch...")
    es = get_es_client()
    info = es.info()
    print(f"  Connected to cluster: {info['cluster_name']} (v{info['version']['number']})\n")

    if delete_only:
        print("Deleting indices...")
        for idx in [INDEX_BRANCHES, INDEX_STAFF, INDEX_REPORTS]:
            if es.indices.exists(index=idx):
                es.indices.delete(index=idx)
                print(f"  ✓ Deleted '{idx}'")
            else:
                print(f"  '{idx}' does not exist, skipping.")
        return

    print("Step 1: Setting up Cohere inference endpoint...")
    create_inference_endpoint(es)

    print("\nStep 2: Creating indices...")
    create_index(es, INDEX_BRANCHES, BRANCHES_MAPPINGS)
    create_index(es, INDEX_STAFF, STAFF_MAPPINGS)
    create_index(es, INDEX_REPORTS, REPORTS_MAPPINGS)

    print("\nDone! Indices ready:")
    print(f"  - {INDEX_BRANCHES}")
    print(f"  - {INDEX_STAFF}")
    print(f"  - {INDEX_REPORTS} (with semantic_text via '{INFERENCE_ID}')")


if __name__ == "__main__":
    main()
