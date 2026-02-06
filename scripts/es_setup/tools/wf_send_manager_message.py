"""
Workflow tool to send a message to a branch manager.
Triggers the beanstack-send-manager-message workflow.
"""

TOOL = {
    "id": "beanstack.send_manager_message",
    "type": "workflow",
    "description": (
        "Sends a message to a branch manager. Use this tool when the user wants to "
        "communicate with a specific branch manager - for example, to request an update, "
        "ask a question, or send instructions. "
        "Requires the branch_id and the message to send. Optionally accepts a subject line. "
        "The workflow looks up the manager's contact info and delivers the message."
    ),
    "tags": ["beanstack", "messaging", "workflow"],
    "configuration": {
        "workflow_id": "beanstack-send-manager-message",
    },
}
