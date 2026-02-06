"""
ES|QL tool to get the report history for a specific branch.
"""

TOOL = {
    "id": "beanstack.branch_report_timeline",
    "type": "esql",
    "description": (
        "Retrieves all weekly reports for a specific branch, ordered by date. "
        "Use this tool to see the full reporting history of a branch, track how issues "
        "evolve over time, or review what a branch has been dealing with. "
        "Returns date, subject, and report text for each report."
    ),
    "tags": ["beanstack", "reports", "timeline", "history"],
    "configuration": {
        "query": (
            "FROM beanstack-reports "
            "| WHERE branch_id == ?branchId "
            "| SORT date DESC "
            "| KEEP date, subject, text "
            "| LIMIT ?limit"
        ),
        "params": {
            "branchId": {
                "type": "keyword",
                "description": "The branch ID to get reports for (e.g. 'branch-042')",
            },
            "limit": {
                "type": "integer",
                "description": "Maximum number of reports to return (default 10)",
            },
        },
    },
}
