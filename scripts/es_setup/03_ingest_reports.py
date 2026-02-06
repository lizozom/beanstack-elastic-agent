"""
Ingest weekly reports into Elasticsearch.
Reads report text files referenced by data/generated/reports/index.json,
parses email-style headers, and bulk-indexes into the beanstack-reports index.

The text_embedding (semantic_text) field is populated by copying the text field,
which triggers the Cohere inference endpoint configured on the index.

Usage:
    uv run python scripts/es_setup/03_ingest_reports.py [--batch-size N]
"""

import json
import os
import re
import sys
from pathlib import Path

from dotenv import load_dotenv
from elasticsearch import Elasticsearch
from elasticsearch.helpers import bulk

load_dotenv()

ES_URL = os.getenv("ELASTICSEARCH_ENDPOINT")
ES_API_KEY = os.getenv("ELASTICSEARCH_API_KEY")

INDEX_REPORTS = "beanstack-reports"
PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent
DATA_DIR = PROJECT_ROOT / "data" / "generated"
INDEX_FILE = DATA_DIR / "reports" / "index.json"

DEFAULT_BATCH_SIZE = 50


def get_es_client() -> Elasticsearch:
    if not ES_URL:
        raise ValueError("ELASTICSEARCH_ENDPOINT is required")
    if not ES_API_KEY:
        raise ValueError("ELASTICSEARCH_API_KEY is required")
    return Elasticsearch(ES_URL, api_key=ES_API_KEY)


def parse_report_file(file_path: Path) -> dict:
    """Parse a report .txt file into structured fields."""
    content = file_path.read_text(encoding="utf-8")
    lines = content.split("\n")

    headers = {}
    body_start = 0
    for i, line in enumerate(lines):
        if line.strip() == "":
            body_start = i + 1
            break
        match = re.match(r"^(Subject|From|Date|Branch):\s*(.+)$", line)
        if match:
            headers[match.group(1).lower()] = match.group(2).strip()

    # Body is everything after the first blank line.
    # Skip the duplicate "From:" line that appears in the body.
    body_lines = lines[body_start:]
    if body_lines and body_lines[0].startswith("From:"):
        body_lines = body_lines[1:]
    body = "\n".join(body_lines).strip()

    return {
        "subject": headers.get("subject", ""),
        "sender_email": headers.get("from", ""),
        "date": headers.get("date", ""),
        "branch_name": headers.get("branch", ""),
        "text": body,
    }


def load_index() -> list[dict]:
    with open(INDEX_FILE) as f:
        return json.load(f)


def ingest_reports(es: Elasticsearch, batch_size: int):
    """Bulk-index reports in batches to avoid overwhelming the inference endpoint."""
    index_entries = load_index()
    total = len(index_entries)
    print(f"  Found {total} reports in index.json")

    success_total = 0
    error_total = 0

    for batch_start in range(0, total, batch_size):
        batch_entries = index_entries[batch_start : batch_start + batch_size]
        batch_num = batch_start // batch_size + 1
        batch_count = len(batch_entries)

        actions = []
        for entry in batch_entries:
            report_id = entry["id"]
            branch_id = entry["branch_id"]
            file_path = PROJECT_ROOT / entry["file_path"]

            if not file_path.exists():
                print(f"    WARNING: File not found: {file_path}")
                continue

            parsed = parse_report_file(file_path)
            doc = {
                "id": report_id,
                "branch_id": branch_id,
                "branch_name": parsed["branch_name"],
                "sender_email": parsed["sender_email"],
                "subject": parsed["subject"],
                "text": parsed["text"],
                "text_embedding": parsed["text"],
                "date": parsed["date"],
                "timestamp": f"{parsed['date']}T09:00:00Z" if parsed["date"] else None,
            }
            actions.append({
                "_index": INDEX_REPORTS,
                "_id": report_id,
                "_source": doc,
            })

        if not actions:
            continue

        success, errors = bulk(es, actions, raise_on_error=False)
        success_total += success
        error_count = len(errors) if isinstance(errors, list) else 0
        error_total += error_count

        print(
            f"  Batch {batch_num}: {success}/{batch_count} indexed"
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

    print(f"Ingesting reports (batch size: {batch_size})...")
    success, errors = ingest_reports(es, batch_size)

    es.indices.refresh(index=INDEX_REPORTS)
    count = es.count(index=INDEX_REPORTS)["count"]
    print(f"\nDone! {INDEX_REPORTS}: {count} documents indexed")
    if errors:
        print(f"  ({errors} errors occurred)")


if __name__ == "__main__":
    main()
