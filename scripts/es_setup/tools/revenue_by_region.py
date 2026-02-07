"""
ES|QL tool to compare revenue across branches for a given period.
"""

TOOL = {
    "id": "beanstack.revenue_by_region",
    "type": "esql",
    "description": (
        "Compares total revenue, average revenue, and transaction counts across branches "
        "for a specific quarter or date range. Use this to answer questions like "
        "'which branches earned the most last quarter', 'compare east coast vs west coast revenue', "
        "or 'what was the average revenue per branch in Q4-2025'. "
        "Returns branch name, total revenue, avg ticket, total transactions, and customer satisfaction."
    ),
    "tags": ["beanstack", "financial", "revenue", "comparison"],
    "configuration": {
        "query": (
            "FROM beanstack-financial-reports "
            "| WHERE start_date >= ?startDate AND end_date <= ?endDate "
            "| STATS total_revenue = SUM(revenue), avg_revenue = AVG(revenue), "
            "total_transactions = SUM(transactions), avg_satisfaction = AVG(customer_satisfaction), "
            "report_count = COUNT(*) "
            "BY branch_id, branch_name "
            "| SORT total_revenue DESC "
            "| LIMIT 200"
        ),
        "params": {
            "startDate": {
                "type": "date",
                "description": "Start of date range in yyyy-MM-dd format (e.g. 2025-01-01 for Q1)",
            },
            "endDate": {
                "type": "date",
                "description": "End of date range in yyyy-MM-dd format (e.g. 2025-12-31 for full year)",
            },
        },
    },
}
