"""
Index search tool for quarterly/yearly financial reports.
Leverages semantic_text embeddings on narrative fields for meaning-based retrieval.
"""

TOOL = {
    "id": "beanstack.search_financial_reports",
    "type": "index_search",
    "description": (
        "Searches quarterly and yearly financial reports from BeanStack branches. "
        "Use this tool for questions about revenue, labor costs, inventory waste, "
        "customer satisfaction, staff turnover, or equipment issues mentioned in "
        "manager narratives. Supports natural language queries via semantic search "
        "on labor narratives, inventory narratives, and general notes. "
        "Each report includes branch name, period (e.g. Q3-2025), revenue, "
        "transactions, labor cost %, waste %, satisfaction score, and manager commentary."
    ),
    "tags": ["beanstack", "financial", "quarterly", "revenue"],
    "configuration": {
        "pattern": "beanstack-financial-reports",
    },
}
