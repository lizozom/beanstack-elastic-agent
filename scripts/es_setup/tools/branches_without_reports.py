"""
ES|QL tool to count reports per branch in a date range (sorted ascending).
Branches with the fewest reports appear first; branches with zero reports
won't appear at all — cross-reference with search_branches to find true gaps.
"""

TOOL = {
    "id": "beanstack.branches_without_reports",
    "type": "esql",
    "description": (
        "Counts reports per branch in a date range, sorted lowest-first. "
        "Use this to spot branches that are behind on reporting. "
        "Branches with ZERO reports will NOT appear in results — to find them, "
        "cross-reference with the search_branches tool to get the full branch list. "
        "Returns branch_id, branch_name, and report_count."
    ),
    "tags": ["beanstack", "reports", "missing", "gaps"],
    "configuration": {
        "query": (
            "FROM beanstack-reports "
            "| WHERE date >= ?startDate AND date <= ?endDate "
            "| STATS report_count = COUNT(*) BY branch_id, branch_name "
            "| SORT report_count ASC "
            "| LIMIT 200"
        ),
        "params": {
            "startDate": {
                "type": "date",
                "description": "Start of the date range in yyyy-MM-dd format",
            },
            "endDate": {
                "type": "date",
                "description": "End of the date range in yyyy-MM-dd format",
            },
        },
    },
}
