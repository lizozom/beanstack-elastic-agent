"""
Ingest branches and staff data into Elasticsearch.
Reads from data/generated/ JSON files and bulk-indexes into ES.
"""

import json
import sys

from elasticsearch import Elasticsearch
from elasticsearch.helpers import bulk

from es_client import (
    DATA_DIR,
    INDEX_BRANCHES,
    INDEX_STAFF,
    get_es_client,
    print_connection_info,
)


def load_json(filename: str) -> list[dict]:
    """Load a JSON array from data/generated/."""
    path = DATA_DIR / filename
    with open(path) as f:
        return json.load(f)


def ingest_branches(es: Elasticsearch) -> None:
    """Bulk-index branches into ES."""
    branches = load_json("branches.json")

    def gen_actions():
        for branch in branches:
            doc = dict(branch)
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


def ingest_staff(es: Elasticsearch) -> None:
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


ALL_INGESTORS = {
    "branches": (INDEX_BRANCHES, ingest_branches),
    "staff": (INDEX_STAFF, ingest_staff),
}


def main():
    requested = [a for a in sys.argv[1:] if not a.startswith("--")]
    if requested:
        ingestors = {k: v for k, v in ALL_INGESTORS.items() if k in requested}
        if not ingestors:
            print(f"Unknown index name(s): {requested}")
            print(f"Available: {', '.join(ALL_INGESTORS.keys())}")
            return
    else:
        ingestors = ALL_INGESTORS

    print("Connecting to Elasticsearch...")
    es = get_es_client()
    print_connection_info(es)
    print()

    for name, (index_name, ingest_fn) in ingestors.items():
        print(f"Ingesting {name}...")
        ingest_fn(es)

    indices = ",".join(idx for idx, _ in ingestors.values())
    es.indices.refresh(index=indices)
    print(f"\nDone! Index counts:")
    for name, (index_name, _) in ingestors.items():
        count = es.count(index=index_name)["count"]
        print(f"  {index_name}: {count}")


if __name__ == "__main__":
    main()
