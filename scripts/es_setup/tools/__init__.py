"""
BeanStack custom tool definitions for Elastic Agent Builder.
"""

from .search_reports import TOOL as search_reports
from .search_branches import TOOL as search_branches
from .search_staff import TOOL as search_staff
from .search_financial_reports import TOOL as search_financial_reports
from .report_count_by_branch import TOOL as report_count_by_branch
from .branches_without_reports import TOOL as branches_without_reports
from .staff_by_branch import TOOL as staff_by_branch
from .branch_report_timeline import TOOL as branch_report_timeline
from .branches_by_region import TOOL as branches_by_region
from .revenue_by_region import TOOL as revenue_by_region
from .underperforming_branches import TOOL as underperforming_branches
from .turnover_by_branch import TOOL as turnover_by_branch
from .equipment_issues_by_branch import TOOL as equipment_issues_by_branch
from .branch_financial_summary import TOOL as branch_financial_summary
from .wf_send_manager_message import TOOL as wf_send_manager_message
from .wf_daily_brief import TOOL as wf_daily_brief
from .wf_missing_reports_reminder import TOOL as wf_missing_reports_reminder
from .wf_escalation import TOOL as wf_escalation

ALL_TOOLS = [
    # Index search tools (dynamic, LLM-driven queries)
    search_reports,
    search_branches,
    search_staff,
    search_financial_reports,
    # ES|QL tools (pre-defined, precise analytics)
    report_count_by_branch,
    branches_without_reports,
    staff_by_branch,
    branch_report_timeline,
    branches_by_region,
    # Financial analytics (ES|QL)
    revenue_by_region,
    underperforming_branches,
    turnover_by_branch,
    equipment_issues_by_branch,
    branch_financial_summary,
    # Workflow tools (deterministic automations)
    wf_send_manager_message,
    wf_missing_reports_reminder,
    wf_escalation,
]
