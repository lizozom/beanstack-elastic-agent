"""
Index search tool for branch location data.
Supports geo-spatial, region, and attribute-based queries.
"""

TOOL = {
    "id": "beanstack.search_branches",
    "type": "index_search",
    "description": (
        "Searches BeanStack coffee chain branch locations. "
        "Use this tool to find branches by city, state, region, size, or proximity to a location. "
        "Each branch has: name, address, city, state, zip, region (Northeast, Southeast, Midwest, "
        "Southwest, West), geo-coordinates, size (small/medium/large), opened date, status, "
        "and manager email. "
        "Use this for questions like 'branches in New York', 'large branches on the west coast', "
        "or 'how many branches are in the Southeast region'."
    ),
    "tags": ["beanstack", "branches", "locations"],
    "configuration": {
        "pattern": "beanstack-branches",
    },
}
