"""
ES|QL tool to find branches with concerning metrics in a period.
"""

TOOL = {
    "id": "beanstack.underperforming_branches",
    "type": "esql",
    "description": (
        "Finds branches showing signs of underperformance in a date range. "
        "Returns branches sorted by a composite of high labor costs, high waste, "
        "low satisfaction, and high turnover. Use this for questions like "
        "'which branches are struggling', 'find problem branches last quarter', "
        "or 'branches with labor costs over 35%'. "
        "Returns branch name, avg labor cost %, avg waste %, avg satisfaction, "
        "total turnover, and total equipment issues."
    ),
    "tags": ["beanstack", "financial", "performance", "alerts"],
    "configuration": {
        "query": (
            "FROM beanstack-financial-reports "
            "| WHERE start_date >= ?startDate AND end_date <= ?endDate "
            "| STATS avg_labor_cost = AVG(labor_cost_pct), avg_waste = AVG(inventory_waste_pct), "
            "avg_satisfaction = AVG(customer_satisfaction), total_turnover = SUM(turnover_count), "
            "total_equip_issues = SUM(equipment_issues), avg_revenue = AVG(revenue) "
            "BY branch_id, branch_name "
            "| SORT avg_satisfaction ASC "
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
