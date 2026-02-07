"""
Set up Elasticsearch indices for BeanStack coffee chain data.
Creates indices for branches, staff, weekly reports, and financial reports.
Reports index includes a semantic_text field for Cohere embed-english-v4 embeddings.
"""

import json
import os
import sys
from pathlib import Path

from elasticsearch import Elasticsearch

from es_client import (
    INFERENCE_ID,
    INDEX_BRANCHES,
    INDEX_FINANCIAL,
    INDEX_REPORTS,
    INDEX_STAFF,
    get_es_client,
    print_connection_info,
)

MAPPINGS_DIR = Path(__file__).parent / "mappings"


def create_inference_endpoint(es: Elasticsearch) -> None:
    """Create the Cohere embedding inference endpoint if it doesn't exist."""
    try:
        es.inference.get(inference_id=INFERENCE_ID)
        print(f"  Inference endpoint '{INFERENCE_ID}' already exists, skipping.")
        return
    except Exception:
        pass

    cohere_api_key = os.getenv("COHERE_API_KEY")
    if not cohere_api_key:
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
                "api_key": cohere_api_key,
                "model_id": "embed-v4.0",
                "embedding_type": "float",
            },
        },
    )
    print(f"  Done: Inference endpoint '{INFERENCE_ID}' created.")


def load_mapping(filename: str) -> dict:
    """Load a mapping JSON file, substituting $INFERENCE_ID with the actual value."""
    raw = (MAPPINGS_DIR / filename).read_text()
    raw = raw.replace("$INFERENCE_ID", INFERENCE_ID)
    return json.loads(raw)


def create_index(es: Elasticsearch, name: str, mappings: dict, force: bool = False) -> None:
    """Create an index. Skips if it already exists unless force=True."""
    if es.indices.exists(index=name):
        if force:
            print(f"  Index '{name}' exists, deleting (--force)...")
            es.indices.delete(index=name)
        else:
            print(f"  Index '{name}' already exists, skipping. Use --force to recreate.")
            return

    print(f"  Creating index '{name}'...")
    es.indices.create(index=name, mappings=mappings)
    print(f"  Done: Index '{name}' created.")


ALL_INDICES = {
    "branches": (INDEX_BRANCHES, "branches.json"),
    "staff": (INDEX_STAFF, "staff.json"),
    "reports": (INDEX_REPORTS, "reports.json"),
    "financial": (INDEX_FINANCIAL, "financial.json"),
}


def main():
    delete_only = "--delete" in sys.argv
    force = "--force" in sys.argv
    requested = [a for a in sys.argv[1:] if not a.startswith("--")]
    if requested:
        indices = {k: v for k, v in ALL_INDICES.items() if k in requested}
        if not indices:
            print(f"Unknown index name(s): {requested}")
            print(f"Available: {', '.join(ALL_INDICES.keys())}")
            return
    else:
        indices = ALL_INDICES

    print("Connecting to Elasticsearch...")
    es = get_es_client()
    print_connection_info(es)
    print()

    if delete_only:
        print("Deleting indices...")
        for name, (idx, _) in indices.items():
            if es.indices.exists(index=idx):
                es.indices.delete(index=idx)
                print(f"  Done: Deleted '{idx}'")
            else:
                print(f"  '{idx}' does not exist, skipping.")
        return

    if not requested:
        print("Step 1: Setting up Cohere inference endpoint...")
        create_inference_endpoint(es)
        print()

    print("Creating indices...")
    for name, (idx, mapping_file) in indices.items():
        mappings = load_mapping(mapping_file)
        create_index(es, idx, mappings, force=force)

    print("\nDone! Indices ready:")
    for name, (idx, _) in indices.items():
        print(f"  - {idx}")


if __name__ == "__main__":
    main()
