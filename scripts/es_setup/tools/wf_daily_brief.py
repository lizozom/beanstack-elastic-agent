"""
Workflow tool to generate a daily operational brief.
Triggers the beanstack-daily-brief workflow.
"""

TOOL = {
    "id": "beanstack.daily_brief",
    "type": "workflow",
    "description": (
        "Generates a daily operational brief for BeanStack headquarters. "
        "Use this tool when the user asks for a daily brief, morning summary, "
        "or overview of recent operations across all branches. "
        "Fetches recent reports, counts active branches, and uses AI to produce "
        "a structured summary with critical issues, highlights, and action items. "
        "Optionally accepts lookback_hours to control the time window (default 24h)."
    ),
    "tags": ["beanstack", "briefs", "workflow"],
    "configuration": {
        "workflow_id": "beanstack-daily-brief",
    },
}
