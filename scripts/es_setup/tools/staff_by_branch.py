"""
ES|QL tool to list all staff members at a specific branch.
"""

TOOL = {
    "id": "beanstack.staff_by_branch",
    "type": "esql",
    "description": (
        "Lists all staff members at a specific branch. "
        "Use this tool when asked 'who works at [branch]?' or to get a staff roster. "
        "Returns name, email, role, start date, and status for each staff member, "
        "sorted by role (Manager first, then Assistant Manager, Shift Lead, Barista)."
    ),
    "tags": ["beanstack", "staff", "branch"],
    "configuration": {
        "query": (
            "FROM beanstack-staff "
            "| WHERE branch_id == ?branchId "
            "| KEEP name, email, role, start_date, status "
            "| SORT role, name "
            "| LIMIT 50"
        ),
        "params": {
            "branchId": {
                "type": "keyword",
                "description": "The branch ID to look up staff for (e.g. 'branch-042')",
            },
        },
    },
}
