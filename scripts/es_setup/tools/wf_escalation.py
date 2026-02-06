"""
Workflow tool to escalate a branch issue by creating a Kibana case.
Triggers the beanstack-escalation workflow.
"""

TOOL = {
    "id": "beanstack.escalation",
    "type": "workflow",
    "description": (
        "Escalates a branch issue by creating a trackable Kibana case. "
        "Use this tool when the user wants to escalate a problem at a branch - "
        "for example, a staffing crisis, equipment emergency, or health inspection failure. "
        "The workflow gathers branch details and recent reports for context, "
        "then creates a case with a structured description. "
        "Requires branch_id and issue_summary. Optionally accepts severity "
        "(low, medium, high, critical - defaults to medium)."
    ),
    "tags": ["beanstack", "escalation", "cases", "workflow"],
    "configuration": {
        "workflow_id": "beanstack-escalation",
    },
}
