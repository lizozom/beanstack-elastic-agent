"""
Index search tool for staff member data.
Supports queries by name, role, branch, and status.
"""

TOOL = {
    "id": "beanstack.search_staff",
    "type": "index_search",
    "description": (
        "Searches BeanStack coffee chain staff members. "
        "Use this tool to find employees by name, role, branch, or status. "
        "Each staff record has: name, email, role (Barista, Shift Lead, Assistant Manager, "
        "Manager), branch ID, branch name, start date, and status (active/inactive). "
        "Use this for questions like 'who works at the 5th Ave branch', 'list all managers', "
        "or 'staff hired in the last 3 months'."
    ),
    "tags": ["beanstack", "staff", "employees"],
    "configuration": {
        "pattern": "beanstack-staff",
    },
}
