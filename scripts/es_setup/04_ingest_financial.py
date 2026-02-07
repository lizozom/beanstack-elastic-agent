"""
Ingest financial reports (quarterly/yearly) into Elasticsearch.
Reads JSON report files referenced by data/generated/financial-reports/index.json
and bulk-indexes into the beanstack-financial-reports index.

The *_embedding (semantic_text) fields are populated by copying the narrative text,
which triggers the Cohere inference endpoint configured on the index.

Usage:
    uv run python scripts/es_setup/04_ingest_financial.py [--batch-size N]
"""

import json
import os
import sys
from pathlib import Path

from dotenv import load_dotenv
from elasticsearch import Elasticsearch
from elasticsearch.helpers import bulk

load_dotenv()

ES_URL = os.getenv("ELASTICSEARCH_ENDPOINT")
ES_API_KEY = os.getenv("ELASTICSEARCH_API_KEY")

INDEX_FINANCIAL = "beanstack-financial-reports"
PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent
DATA_DIR = PROJECT_ROOT / "data" / "generated"
INDEX_FILE = DATA_DIR / "financial-reports" / "index.json"

DEFAULT_BATCH_SIZE = 50


def get_es_client() -> Elasticsearch:
    if not ES_URL:
        raise ValueError("ELASTICSEARCH_ENDPOINT is required")
    if not ES_API_KEY:
        raise ValueError("ELASTICSEARCH_API_KEY is required")
    return Elasticsearch(ES_URL, api_key=ES_API_KEY)


def load_index() -> list[dict]:
    with open(INDEX_FILE) as f:
        return json.load(f)


def ingest_financial(es: Elasticsearch, batch_size: int):
    """Bulk-index financial reports in batches."""
    index_entries = load_index()
    total = len(index_entries)
    print(f"  Found {total} financial reports in index.json")

    success_total = 0
    error_total = 0

    for batch_start in range(0, total, batch_size):
        batch_entries = index_entries[batch_start : batch_start + batch_size]
        batch_num = batch_start // batch_size + 1

        actions = []
        for entry in batch_entries:
            file_path = PROJECT_ROOT / entry["file_path"]

            if not file_path.exists():
                print(f"    WARNING: File not found: {file_path}")
                continue

            with open(file_path) as f:
                doc = json.load(f)

            # Copy narrative text into embedding fields for semantic search
            doc["labor_manager_narrative_embedding"] = doc.get("labor_manager_narrative", "")
            doc["inventory_manager_narrative_embedding"] = doc.get("inventory_manager_narrative", "")
            doc["notes_embedding"] = doc.get("notes", "")

            actions.append({
                "_index": INDEX_FINANCIAL,
                "_id": doc["id"],
                "_source": doc,
            })

        if not actions:
            continue

        success, errors = bulk(es, actions, raise_on_error=False)
        success_total += success
        error_count = len(errors) if isinstance(errors, list) else 0
        error_total += error_count

        print(
            f"  Batch {batch_num}: {success}/{len(batch_entries)} indexed"
            + (f", {error_count} errors" if error_count else "")
        )
        if errors and isinstance(errors, list):
            for e in errors[:3]:
                print(f"    {e}")

    return success_total, error_total


def main():
    batch_size = DEFAULT_BATCH_SIZE
    for i, arg in enumerate(sys.argv):
        if arg == "--batch-size" and i + 1 < len(sys.argv):
            batch_size = int(sys.argv[i + 1])

    print("Connecting to Elasticsearch...")
    es = get_es_client()
    info = es.info()
    print(f"  Connected to cluster: {info['cluster_name']} (v{info['version']['number']})\n")

    print(f"Ingesting financial reports (batch size: {batch_size})...")
    success, errors = ingest_financial(es, batch_size)

    es.indices.refresh(index=INDEX_FINANCIAL)
    count = es.count(index=INDEX_FINANCIAL)["count"]
    print(f"\nDone! {INDEX_FINANCIAL}: {count} documents indexed")
    if errors:
        print(f"  ({errors} errors occurred)")


if __name__ == "__main__":
    main()
