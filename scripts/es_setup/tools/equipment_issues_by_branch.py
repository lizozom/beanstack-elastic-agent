"""
ES|QL tool to track equipment issues across branches over time.
"""

TOOL = {
    "id": "beanstack.equipment_issues_by_branch",
    "type": "esql",
    "description": (
        "Shows equipment issue counts per branch over a date range. "
        "Use this for questions like 'which branches have recurring equipment problems', "
        "'branches with the most equipment failures', or 'is the Philadelphia branch getting worse'. "
        "Returns branch name, total equipment issues, number of quarters, and avg satisfaction."
    ),
    "tags": ["beanstack", "financial", "equipment", "maintenance"],
    "configuration": {
        "query": (
            "FROM beanstack-financial-reports "
            "| WHERE start_date >= ?startDate AND end_date <= ?endDate "
            "| STATS total_issues = SUM(equipment_issues), quarters = COUNT(*), "
            "avg_satisfaction = AVG(customer_satisfaction), avg_revenue = AVG(revenue) "
            "BY branch_id, branch_name "
            "| SORT total_issues DESC "
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
