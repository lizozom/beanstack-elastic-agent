"""
Pydantic schema for financial reports (quarterly and yearly).
Structured financial/operational data submitted by branch managers.
"""

from datetime import date, datetime
from pydantic import BaseModel, Field


class FinancialReport(BaseModel):
    id: str = Field(description="Unique ID, e.g. 'q3-2025-branch-042'")
    report_type: str = Field(default="quarterly", description="Report type: 'quarterly' or 'yearly'")
    branch_id: str = Field(description="Branch identifier, e.g. 'branch-042'")
    branch_name: str = Field(description="Human-readable branch name")
    period: str = Field(description="Report period, e.g. 'Q3-2025' or '2025'")
    start_date: date = Field(description="First day of the reporting period, e.g. 2025-07-01")
    end_date: date = Field(description="Last day of the reporting period, e.g. 2025-09-30")
    submitted_by: str = Field(description="Manager email who submitted the report")
    submitted_at: datetime = Field(description="Submission timestamp")

    # Revenue & sales
    revenue: float = Field(description="Total revenue for the period in USD")
    transactions: int = Field(description="Total number of transactions")
    avg_ticket: float = Field(description="Average transaction value in USD")

    # Labor
    labor_hours: int = Field(description="Total labor hours worked")
    labor_cost_pct: float = Field(description="Labor cost as percentage of revenue")
    labor_manager_narrative: str = Field(description="Manager's narrative on labor performance")
    labor_manager_narrative_embedding: str = Field(description="Copy of labor narrative for semantic search")

    # Inventory
    inventory_waste_pct: float = Field(description="Inventory waste as percentage of COGS")
    top_selling_items: list[str] = Field(description="List of top 5 selling items")
    inventory_manager_narrative: str = Field(description="Manager's narrative on inventory performance")
    inventory_manager_narrative_embedding: str = Field(description="Copy of inventory narrative for semantic search")

    # Customer
    customer_satisfaction: float = Field(ge=1.0, le=5.0, description="Average customer satisfaction score (1-5)")

    # Staffing
    employee_count: int = Field(description="Number of employees at end of period")
    turnover_count: int = Field(description="Number of employees who left during the period")

    # Operations
    equipment_issues: int = Field(description="Number of equipment issues reported")
    notes: str = Field(description="Free-text manager notes (major events, competition, etc.)")
    notes_embedding: str = Field(description="Copy of notes for semantic search")
