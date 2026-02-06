"""
Ingest branches and staff data into Elasticsearch.
Reads from data/generated/ JSON files and bulk-indexes into ES.
"""

import json
import os
import sys
from pathlib import Path
from dotenv import load_dotenv
from elasticsearch import Elasticsearch
from elasticsearch.helpers import bulk

load_dotenv()

# Reuse the same constants as setup_indices.py
ES_URL = os.getenv("ELASTICSEARCH_ENDPOINT")
ES_API_KEY = os.getenv("ELASTICSEARCH_API_KEY")

INDEX_BRANCHES = "beanstack-branches"
INDEX_STAFF = "beanstack-staff"

DATA_DIR = Path(__file__).resolve().parent.parent.parent / "data" / "generated"


def get_es_client() -> Elasticsearch:
    """Create an Elasticsearch client from env vars."""
    if not ES_URL:
        raise ValueError("ELASTICSEARCH_ENDPOINT is required")
    if not ES_API_KEY:
        raise ValueError("ELASTICSEARCH_API_KEY is required")
    return Elasticsearch(ES_URL, api_key=ES_API_KEY)


def load_json(filename: str) -> list[dict]:
    """Load a JSON array from data/generated/."""
    path = DATA_DIR / filename
    with open(path) as f:
        return json.load(f)


def ingest_branches(es: Elasticsearch):
    """Bulk-index branches into ES."""
    branches = load_json("branches.json")

    def gen_actions():
        for branch in branches:
            doc = dict(branch)
            # Remove empty closed_date so ES doesn't choke on ""
            if not doc.get("closed_date"):
                doc.pop("closed_date", None)
            yield {
                "_index": INDEX_BRANCHES,
                "_id": doc["id"],
                "_source": doc,
            }

    success, errors = bulk(es, gen_actions())
    print(f"  Branches: {success} indexed, {len(errors)} errors")
    if errors:
        for e in errors[:5]:
            print(f"    {e}")


def ingest_staff(es: Elasticsearch):
    """Bulk-index staff into ES."""
    staff = load_json("staff.json")

    def gen_actions():
        for person in staff:
            yield {
                "_index": INDEX_STAFF,
                "_id": person["id"],
                "_source": person,
            }

    success, errors = bulk(es, gen_actions())
    print(f"  Staff: {success} indexed, {len(errors)} errors")
    if errors:
        for e in errors[:5]:
            print(f"    {e}")


def main():
    print("Connecting to Elasticsearch...")
    es = get_es_client()
    info = es.info()
    print(f"  Connected to cluster: {info['cluster_name']} (v{info['version']['number']})\n")

    print("Ingesting branches...")
    ingest_branches(es)

    print("Ingesting staff...")
    ingest_staff(es)

    # Quick verification
    es.indices.refresh(index=f"{INDEX_BRANCHES},{INDEX_STAFF}")
    branch_count = es.count(index=INDEX_BRANCHES)["count"]
    staff_count = es.count(index=INDEX_STAFF)["count"]
    print(f"\nDone! Index counts:")
    print(f"  {INDEX_BRANCHES}: {branch_count}")
    print(f"  {INDEX_STAFF}: {staff_count}")


if __name__ == "__main__":
    main()
