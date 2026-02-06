"""
ES|QL tool to count reports per branch within a date range.
Useful for identifying reporting frequency and spotting gaps.
"""

TOOL = {
    "id": "beanstack.report_count_by_branch",
    "type": "esql",
    "description": (
        "Counts the number of weekly reports submitted by each branch within a date range. "
        "Use this tool to check reporting frequency, find which branches are most or least "
        "active in submitting reports, or as a first step to identify missing reports. "
        "Returns branch ID, branch name, and report count, sorted by count ascending "
        "so branches with fewest reports appear first."
    ),
    "tags": ["beanstack", "reports", "analytics"],
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
