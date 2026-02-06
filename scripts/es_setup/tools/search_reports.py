"""
Index search tool for weekly branch manager reports.
Leverages semantic_text embeddings for meaning-based retrieval.
"""

TOOL = {
    "id": "beanstack.search_reports",
    "type": "index_search",
    "description": (
        "Searches weekly branch manager reports from BeanStack coffee chain locations. "
        "Use this tool for any question about branch operations, incidents, or issues "
        "mentioned in manager reports. Supports natural language queries. "
        "Reports cover topics like equipment failures, staffing shortages, supply chain "
        "problems, local events, weather impacts, and day-to-day operations. "
        "Each report includes the branch name, manager email, date, and free-text content."
    ),
    "tags": ["beanstack", "reports", "operations"],
    "configuration": {
        "pattern": "beanstack-reports",
    },
}
