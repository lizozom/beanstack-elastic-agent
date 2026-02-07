"""
ES|QL tool to get the full financial history of a specific branch.
"""

TOOL = {
    "id": "beanstack.branch_financial_summary",
    "type": "esql",
    "description": (
        "Gets all quarterly financial reports for a specific branch, showing trends over time. "
        "Use this for questions like 'show me BeanStack 5th Ave financial history', "
        "'how has branch-042 performed over the last year', or 'revenue trend for a branch'. "
        "Returns period, revenue, transactions, labor cost %, waste %, satisfaction, "
        "turnover, and equipment issues for each quarter."
    ),
    "tags": ["beanstack", "financial", "branch", "history"],
    "configuration": {
        "query": (
            "FROM beanstack-financial-reports "
            "| WHERE branch_id == ?branchId "
            "| KEEP period, start_date, revenue, transactions, avg_ticket, labor_cost_pct, "
            "inventory_waste_pct, customer_satisfaction, employee_count, turnover_count, equipment_issues "
            "| SORT start_date ASC "
            "| LIMIT 50"
        ),
        "params": {
            "branchId": {
                "type": "keyword",
                "description": "Branch identifier, e.g. 'branch-042'",
            },
        },
    },
}
