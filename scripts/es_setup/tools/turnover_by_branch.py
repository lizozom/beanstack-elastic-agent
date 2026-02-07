"""
ES|QL tool to identify branches with highest staff turnover.
"""

TOOL = {
    "id": "beanstack.turnover_by_branch",
    "type": "esql",
    "description": (
        "Shows staff turnover counts per branch over a date range. "
        "Use this to answer questions like 'which branches lost the most staff', "
        "'is turnover seasonal', or 'staffing problems in the last year'. "
        "Returns branch name, total turnover, average employee count, "
        "and number of quarters reported, sorted by highest turnover first."
    ),
    "tags": ["beanstack", "financial", "turnover", "staffing"],
    "configuration": {
        "query": (
            "FROM beanstack-financial-reports "
            "| WHERE start_date >= ?startDate AND end_date <= ?endDate "
            "| STATS total_turnover = SUM(turnover_count), avg_employees = AVG(employee_count), "
            "quarters = COUNT(*) "
            "BY branch_id, branch_name "
            "| SORT total_turnover DESC "
            "| LIMIT 50"
        ),
        "params": {
            "startDate": {
                "type": "date",
                "description": "Start of date range in yyyy-MM-dd format",
            },
            "endDate": {
                "type": "date",
                "description": "End of date range in yyyy-MM-dd format",
            },
        },
    },
}
