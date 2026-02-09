"""
ES|QL tool to aggregate revenue by region using an enrich policy
to join financial reports with branch region data.
"""

TOOL = {
    "id": "beanstack.revenue_by_region",
    "type": "esql",
    "description": (
        "Calculates total revenue, average revenue, and transaction counts aggregated "
        "by geographic region for a given date range. Enriches financial reports with branch "
        "data to group results by region (Northeast, Southeast, Midwest, Southwest, West). "
        "Use this to answer questions like 'what is the revenue per region in 2025', "
        "'compare regional revenue', 'which region performs best', or "
        "'what was the revenue in the Northeast in Q4'. "
        "Optionally filter to a specific region by passing a region name, "
        "or use a wildcard '*' to include all regions."
    ),
    "tags": ["beanstack", "financial", "revenue", "region", "geography"],
    "configuration": {
        "query": (
            "FROM beanstack-financial-reports "
            "| WHERE start_date >= ?startDate AND end_date <= ?endDate "
            "| ENRICH beanstack-branch-region ON branch_id WITH region "
            "| WHERE region LIKE ?region "
            "| STATS total_revenue = SUM(revenue), avg_revenue = AVG(revenue), "
            "total_transactions = SUM(transactions), "
            "branch_count = COUNT_DISTINCT(branch_id), "
            "avg_satisfaction = AVG(customer_satisfaction) "
            "BY region "
            "| SORT total_revenue DESC "
            "| LIMIT 10"
        ),
        "params": {
            "startDate": {
                "type": "date",
                "description": "Start of date range in yyyy-MM-dd format (e.g. 2025-01-01)",
            },
            "endDate": {
                "type": "date",
                "description": "End of date range in yyyy-MM-dd format (e.g. 2025-12-31)",
            },
            "region": {
                "type": "keyword",
                "description": (
                    "Region to filter by: Northeast, Southeast, Midwest, Southwest, or West. "
                    "Use '*' to include all regions."
                ),
            },
        },
    },
}
