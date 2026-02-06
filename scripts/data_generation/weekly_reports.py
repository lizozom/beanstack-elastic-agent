"""
Generate weekly reports for BeanStack coffee chain using Claude Haiku.
90% normal operations, 10% branch narrative sprinkled in.
"""

import json
import random
import hashlib
import os
from pathlib import Path
from datetime import datetime, timedelta
from typing import Optional
from dotenv import load_dotenv
import anthropic

# Load .env file
load_dotenv()

random.seed(42)

# Date range for reports
START_DATE = datetime(2025, 8, 1)
END_DATE = datetime(2026, 1, 31)

# Manager personalities
PERSONALITIES = ["casual", "terse", "formal", "verbose", "upbeat", "dry_humor", "anxious"]


def get_personality(manager_name: str) -> str:
    """Assign consistent personality based on manager name."""
    hash_val = int(hashlib.md5(manager_name.encode()).hexdigest(), 16)
    return PERSONALITIES[hash_val % len(PERSONALITIES)]


def get_season_context(date: datetime) -> str:
    """Get seasonal context for a date."""
    month = date.month
    seasons = {
        8: "late summer, back to school starting, iced drinks popular, hot weather",
        9: "early fall, pumpkin spice season launching, weather cooling down",
        10: "fall, Halloween approaching, football season, cozy drinks trending",
        11: "late fall, Thanksgiving prep, pre-holiday rush starting, colder weather",
        12: "winter holiday season, Christmas rush, peppermint drinks, gift cards, very busy",
        1: "new year, post-holiday slump, winter drinks, New Year's resolutions, cold weather",
    }
    return seasons.get(month, "normal season")


def get_report_date_range(branch: dict, manager: dict) -> tuple[datetime, datetime]:
    """Determine valid date range for reports."""
    manager_start = datetime.strptime(manager["start_date"], "%Y-%m-%d")
    start = max(START_DATE, manager_start)

    end = END_DATE
    if branch.get("status") == "closed" and branch.get("closed_date"):
        closed = datetime.strptime(branch["closed_date"], "%Y-%m-%d")
        end = min(end, closed)

    return start, end


def build_prompt(
    branch: dict,
    manager: dict,
    staff: list[dict],
    narrative: dict,
    date: datetime,
    previous_reports: list[str],
    include_narrative: bool
) -> str:
    """Build the prompt for Claude Haiku using XML structure."""
    personality = get_personality(manager["name"])

    # Get staff names (excluding manager)
    staff_names = [s["name"].split()[0] for s in staff if s["role"] != "Manager" and s["status"] == "active"]
    inactive_staff = [s["name"].split()[0] for s in staff if s["status"] == "inactive"]

    # Build narrative section if needed
    narrative_section = "<narrative>"
    if include_narrative:
        narrative_section += f"""
<description>{narrative["narrative_description"]}</description>
<themes>{', '.join(narrative["narrative_themes"])}</themes>
"""
    narrative_section += "</narrative>"

    print(narrative)
    message_length = narrative.get("message_length", "medium")  # Default to medium if not specified
    print(f"  Narrative message length: {message_length}")
    if message_length == "short":
        message_length_words = "60-80 words"
    elif message_length == "medium":
        message_length_words = "80-160 words"
    elif message_length == "long":
        message_length_words = "160-200 words"

    style_section = f"""
<style>
<tone>{narrative["narrative_tone"]}</tone>
<message_length>
    {message_length_words}
</message_length>
</style>
"""
    print(f"  Narrative included: {include_narrative}")
    print(narrative_section)

    prompt = f"""Write a weekly report email from a coffee shop branch manager.

<context>
<branch>
<name>{branch["name"]}</name>
<location>{branch["city"]}, {branch["state"]} ({branch["region"]} region)</location>
<size>{branch["size"]}</size>
</branch>

<manager>
<name>{manager["name"]}</name>
<personality>{personality}</personality>
</manager>

<staff>
<active>{', '.join(staff_names) if staff_names else 'just the manager'}</active>
<former>{', '.join(inactive_staff) if inactive_staff else 'none'}</former>
</staff>

<date>
<report_date>{date.strftime("%B %d, %Y")}</report_date>
<season>{get_season_context(date)}</season>
</date>

<previous_reports>
{chr(10).join(f'<report index="{i+1}">{r}</report>' for i, r in enumerate(previous_reports)) if previous_reports else 'This is the first report from this branch.'}
</previous_reports>
{narrative_section}
{style_section}
</context>

<topics>
Pick 1-2 normal coffee shop topics (NOT more):
- Sales performance
- Equipment issues
- Staffing
- Inventory/supplies
- Customer incidents
- Weather impact
- Seasonal menu items
</topics>

<personality_guide>
- casual: relaxed, contractions, friendly
- terse: very brief, bullet-points, minimal
- formal: professional, structured
- verbose: detailed, explains everything
- upbeat: positive, enthusiastic
- dry_humor: deadpan, subtle sarcasm
- anxious: worries, asks for confirmation
</personality_guide>

<instructions>
- Informal email-style report, NOT a formal document
- Use everyday american english. Don't be too polished - this is a manager writing quickly at the end of a busy day. Keep vocablulary simple and natural.
- Don't use too many metaphors, people don't talk like that.
- Narrative should be evolving realistically!
- Personality: {personality}
- HARD WORD LIMIT: The email body MUST be {message_length_words}. Count your words. Do NOT go over.
- Cover only 1-2 topics. Be concise.
- Mention a staff name only if relevant
- Keep it real - typos OK, imperfect grammar OK
- Do NOT reference week numbers (e.g. "week three", "week 4"). Just write naturally.
- End with just the manager's first name
- If narrative is provided, weave it in briefly
</instructions>

<output>
Return the email in this exact format:
Subject: [short subject line]
From: {manager["email"]}

[email body text]
</output>"""

    return prompt





class ReportGenerator:
    def __init__(self, branches: list[dict], staff: list[dict], narratives: dict):
        self.branches = {b["id"]: b for b in branches}
        self.staff_by_branch = self._group_staff_by_branch(staff)
        self.managers_by_branch = self._get_managers(staff)
        self.narratives = narratives
        self.client = anthropic.Anthropic()
        self.report_counter = 0

    def _group_staff_by_branch(self, staff: list[dict]) -> dict:
        grouped = {}
        for s in staff:
            branch_id = s["branch_id"]
            if branch_id not in grouped:
                grouped[branch_id] = []
            grouped[branch_id].append(s)
        return grouped

    def _get_managers(self, staff: list[dict]) -> dict:
        managers = {}
        for s in staff:
            if s["role"] == "Manager":
                managers[s["branch_id"]] = s
        return managers

    def generate_report_with_llm(
        self,
        branch: dict,
        manager: dict,
        staff: list[dict],
        narrative: dict,
        date: datetime,
        previous_reports: list[str]
    ) -> tuple[str, str]:
        """Generate report text using Claude Haiku. Returns (subject, body)."""
        print(f"Generating report for {branch['name']} on {date.strftime('%Y-%m-%d')}...")
        # 10% chance to include narrative element
        
        include_narrative = random.random() < 0.10

        prompt = build_prompt(
            branch, manager, staff, narrative,
            date, previous_reports, include_narrative
        )

        message = self.client.messages.create(
            model="claude-haiku-4-5-20251001",
            max_tokens=250,
            messages=[{"role": "user", "content": prompt}]
        )

        raw_output = message.content[0].text

        # Parse subject and body from output
        lines = raw_output.strip().split('\n')
        subject = ""
        body_lines = []
        in_header = True

        for line in lines:
            if in_header:
                if line.lower().startswith('subject:'):
                    subject = line.split(':', 1)[1].strip()
                elif line.lower().startswith('from:'):
                    continue  # Skip the from line
                elif line.strip() == '':
                    in_header = False
                else:
                    # Start of body without blank line separator
                    in_header = False
                    body_lines.append(line)
            else:
                body_lines.append(line)

        body = '\n'.join(body_lines).strip()

        # Fallback subject if not found
        if not subject:
            subject = f"Weekly update - {branch['name'].replace('BeanStack ', '')}"

        return subject, body

    def _build_report_dates(self, branch: dict, manager: dict) -> list[datetime]:
        """Build a sorted list of report dates for a branch."""
        start, end = get_report_date_range(branch, manager)
        if start >= end:
            return []

        dates = []
        current = start
        while current <= end:
            # Weekly report on Sunday
            report_date = current + timedelta(days=(6 - current.weekday()))
            if report_date <= end:
                dates.append(report_date)

                # 8% chance of extra mid-week report
                if random.random() < 0.08:
                    mid_week = report_date - timedelta(days=random.randint(2, 4))
                    if mid_week >= start:
                        dates.append(mid_week)

            current += timedelta(days=7)

        dates.sort()
        return dates

    def generate_all_reports(self) -> list[dict]:
        """Generate all weekly reports, one branch at a time."""
        all_reports = []
        total_generated = 0

        # Count total for progress reporting
        total_expected = sum(
            len(self._build_report_dates(branch, self.managers_by_branch[bid]))
            for bid, branch in self.branches.items()
            if bid in self.managers_by_branch
        )

        # Reset seed so date generation is deterministic on second pass
        random.seed(42)

        for branch_id, branch in self.branches.items():
            manager = self.managers_by_branch.get(branch_id)
            if not manager:
                continue

            staff = self.staff_by_branch.get(branch_id, [])
            narrative = self.narratives.get(branch_id, {})
            report_dates = self._build_report_dates(branch, manager)

            if not report_dates:
                continue

            print(f"\n--- {branch['name']} ({branch_id}): {len(report_dates)} reports ---")

            previous_reports: list[str] = []

            for date in report_dates:
                try:
                    subject, text = self.generate_report_with_llm(
                        branch, manager, staff, narrative,
                        date, previous_reports
                    )
                except Exception as e:
                    print(f"  Error generating report for {branch_id} on {date}: {e}")
                    subject = f"Weekly update - {branch['name'].replace('BeanStack ', '')}"
                    text = f"Weekly update from {branch['name']}. Operations normal this week. - {manager['name'].split()[0]}"

                # Keep last 2 reports for continuity
                previous_reports.append(text)
                if len(previous_reports) > 2:
                    previous_reports.pop(0)

                self.report_counter += 1

                hour = random.randint(7, 20)
                minute = random.randint(0, 59)
                timestamp = date.replace(hour=hour, minute=minute)

                report = {
                    "id": f"report-{self.report_counter:05d}",
                    "branch_id": branch_id,
                    "branch_name": branch["name"],
                    "sender_email": manager["email"],
                    "subject": subject,
                    "text": text,
                    "date": date.strftime("%Y-%m-%d"),
                    "timestamp": timestamp.strftime("%Y-%m-%dT%H:%M:%SZ")
                }

                save_report_to_file(report)
                all_reports.append(report)
                total_generated += 1

                if total_generated % 100 == 0:
                    print(f"  Progress: {total_generated}/{total_expected} reports...")

        return all_reports


def save_report_to_file(report: dict, base_path: str = "data/generated/reports") -> str:
    """Save a report to the folder structure: branch-id/year/month/weekly-report-YYYY-MM-DD.txt"""
    branch_id = report["branch_id"]
    date = report["date"]  # Format: YYYY-MM-DD
    year = date[:4]
    month = date[5:7]

    # Create directory structure
    dir_path = Path(base_path) / branch_id / year / month
    dir_path.mkdir(parents=True, exist_ok=True)

    # Create file content
    content = f"""Subject: {report["subject"]}
From: {report["sender_email"]}
Date: {report["date"]}
Branch: {report["branch_name"]}

{report["text"]}
"""

    # Save file
    file_path = dir_path / f"weekly-report-{date}.txt"
    with open(file_path, "w") as f:
        f.write(content)

    return str(file_path)


def main():
    import sys

    # Load data
    with open("data/generated/branches.json", "r") as f:
        branches = json.load(f)

    with open("data/generated/staff.json", "r") as f:
        staff = json.load(f)

    with open("data/generated/branch_narratives.json", "r") as f:
        narratives = json.load(f)

    # Optional: limit to specific branch(es)
    # Usage: python weekly_reports.py branch-001 branch-002
    if len(sys.argv) > 1:
        branch_ids = sys.argv[1:]
        branches = [b for b in branches if b["id"] in branch_ids]
        print(f"Limiting to branches: {branch_ids}")

    # Generate reports (saves to disk immediately)
    generator = ReportGenerator(branches, staff, narratives)
    reports = generator.generate_all_reports()

    # Build index for reference
    base_path = "data/generated/reports"
    index = []

    for report in reports:
        date = report["date"]
        year = date[:4]
        month = date[5:7]
        file_path = f"{base_path}/{report['branch_id']}/{year}/{month}/weekly-report-{date}.txt"
        index.append({
            "id": report["id"],
            "branch_id": report["branch_id"],
            "date": report["date"],
            "file_path": file_path
        })

    # Save index
    index_path = f"{base_path}/index.json"
    with open(index_path, "w") as f:
        json.dump(index, f, indent=2)

    print(f"\nGenerated {len(reports)} weekly reports")
    print(f"Saved to {base_path}/<branch-id>/<year>/<month>/weekly-report-YYYY-MM-DD.txt")
    print(f"Index saved to {index_path}")

    # Stats
    from collections import Counter
    months = Counter(r["date"][:7] for r in reports)
    print("\nReports by month:")
    for month, count in sorted(months.items()):
        print(f"  {month}: {count}")

    # Sample report
    print("\n" + "="*60)
    print("SAMPLE REPORT:")
    print("="*60)
    sample = random.choice(reports)
    print(f"From: {sample['sender_email']}")
    print(f"Subject: {sample['subject']}")
    print(f"Date: {sample['date']}")
    print("-"*40)
    print(sample['text'])


if __name__ == "__main__":
    main()
