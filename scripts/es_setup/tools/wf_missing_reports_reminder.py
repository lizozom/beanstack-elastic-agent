"""
Workflow tool to send reminders for missing weekly reports.
Triggers the beanstack-missing-reports-reminder workflow.
"""

TOOL = {
    "id": "beanstack.missing_reports_reminder",
    "type": "workflow",
    "description": (
        "Identifies branches that have not submitted weekly reports since a given date "
        "and sends reminder emails to their managers. "
        "Use this tool when the user wants to send reminders about overdue or missing reports. "
        "The workflow compares all active branches against submitted reports, identifies gaps, "
        "and emails each delinquent manager. "
        "Requires since_date (yyyy-MM-dd) to define the reporting period. "
        "Optionally accepts a custom reminder_message."
    ),
    "tags": ["beanstack", "reports", "reminders", "workflow"],
    "configuration": {
        "workflow_id": "beanstack-missing-reports-reminder",
    },
}
