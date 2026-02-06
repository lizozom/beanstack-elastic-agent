"""
ES|QL tool to list or count branches grouped by region.
"""

TOOL = {
    "id": "beanstack.branches_by_region",
    "type": "esql",
    "description": (
        "Lists branches grouped by region with counts, or filters to a specific region. "
        "Use this tool for regional comparisons, understanding the chain's geographic "
        "distribution, or listing all branches in a region. "
        "Regions are: Northeast, Southeast, Midwest, Southwest, West. "
        "Returns region, branch count, and the list of cities in each region."
    ),
    "tags": ["beanstack", "branches", "regions", "geography"],
    "configuration": {
        "query": (
            "FROM beanstack-branches "
            "| WHERE region == ?region "
            "| KEEP id, name, city, state, size, status "
            "| SORT state, city "
            "| LIMIT 200"
        ),
        "params": {
            "region": {
                "type": "keyword",
                "description": (
                    "Region to filter by: Northeast, Southeast, Midwest, Southwest, or West"
                ),
            },
        },
    },
}
