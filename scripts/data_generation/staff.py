"""
Generate staff data for BeanStack coffee chain.
~500-600 staff members (4-6 per branch).
"""

import json
import random
from dataclasses import dataclass, asdict
from datetime import datetime, timedelta
from faker import Faker

fake = Faker()
Faker.seed(42)
random.seed(42)

ROLES = ["Barista", "Shift Lead", "Assistant Manager", "Manager"]

# Staff count ranges by branch size
STAFF_BY_SIZE = {
    "small": (4, 5),
    "medium": (5, 6),
    "large": (6, 8),
}


@dataclass
class Staff:
    id: str
    name: str
    email: str
    role: str
    branch_id: str
    branch_name: str
    start_date: str
    status: str  # "active" or "inactive"


def generate_email(name: str) -> str:
    """Generate email from name."""
    parts = name.lower().split()
    if len(parts) >= 2:
        email = f"{parts[0]}.{parts[-1]}@beanstack.com"
    else:
        email = f"{parts[0]}{random.randint(1, 99)}@beanstack.com"
    return email


def generate_start_date(branch_opened: str, role: str) -> str:
    """Generate a start date based on branch opening and role."""
    branch_date = datetime.strptime(branch_opened, "%Y-%m-%d")

    if role == "Manager":
        # Managers typically start when branch opens or shortly before
        offset = random.randint(-30, 60)
    elif role == "Assistant Manager":
        # Assistant managers start within first few months
        offset = random.randint(0, 180)
    else:
        # Other staff can start anytime after opening
        max_days = (datetime(2026, 1, 31) - branch_date).days
        offset = random.randint(0, max(0, max_days - 30))

    start = branch_date + timedelta(days=offset)

    # Don't go past Jan 2026
    if start > datetime(2026, 1, 31):
        start = datetime(2026, 1, 31) - timedelta(days=random.randint(30, 365))

    return start.strftime("%Y-%m-%d")


def generate_staff_for_branch(branch: dict, staff_id_start: int) -> list[dict]:
    """Generate all staff for a single branch."""
    staff_list = []
    size = branch["size"]
    min_staff, max_staff = STAFF_BY_SIZE[size]
    staff_count = random.randint(min_staff, max_staff)

    # If branch is closed, all staff are inactive
    branch_closed = branch.get("status") == "closed"
    default_status = "inactive" if branch_closed else "active"

    staff_id = staff_id_start

    # Always have exactly one manager
    manager_name = fake.name()
    manager = Staff(
        id=f"staff-{staff_id:04d}",
        name=manager_name,
        email=generate_email(manager_name),
        role="Manager",
        branch_id=branch["id"],
        branch_name=branch["name"],
        start_date=generate_start_date(branch["opened_date"], "Manager"),
        status=default_status
    )
    staff_list.append(asdict(manager))
    staff_id += 1

    # One assistant manager for medium/large branches
    if size in ["medium", "large"]:
        asst_name = fake.name()
        asst_manager = Staff(
            id=f"staff-{staff_id:04d}",
            name=asst_name,
            email=generate_email(asst_name),
            role="Assistant Manager",
            branch_id=branch["id"],
            branch_name=branch["name"],
            start_date=generate_start_date(branch["opened_date"], "Assistant Manager"),
            status=default_status
        )
        staff_list.append(asdict(asst_manager))
        staff_id += 1
        remaining = staff_count - 2
    else:
        remaining = staff_count - 1

    # Add shift leads (1-2)
    shift_lead_count = min(2, remaining // 2)
    for _ in range(shift_lead_count):
        name = fake.name()
        shift_lead = Staff(
            id=f"staff-{staff_id:04d}",
            name=name,
            email=generate_email(name),
            role="Shift Lead",
            branch_id=branch["id"],
            branch_name=branch["name"],
            start_date=generate_start_date(branch["opened_date"], "Shift Lead"),
            status=default_status
        )
        staff_list.append(asdict(shift_lead))
        staff_id += 1
        remaining -= 1

    # Fill rest with baristas
    for _ in range(remaining):
        name = fake.name()
        barista = Staff(
            id=f"staff-{staff_id:04d}",
            name=name,
            email=generate_email(name),
            role="Barista",
            branch_id=branch["id"],
            branch_name=branch["name"],
            start_date=generate_start_date(branch["opened_date"], "Barista"),
            status=default_status
        )
        staff_list.append(asdict(barista))
        staff_id += 1

    # Add some inactive staff (people who quit) - ~20% chance per branch (only for open branches)
    if not branch_closed and random.random() < 0.2:
        inactive_count = random.randint(1, 2)
        for _ in range(inactive_count):
            name = fake.name()
            role = random.choice(["Barista", "Shift Lead"])
            inactive = Staff(
                id=f"staff-{staff_id:04d}",
                name=name,
                email=generate_email(name),
                role=role,
                branch_id=branch["id"],
                branch_name=branch["name"],
                start_date=generate_start_date(branch["opened_date"], role),
                status="inactive"
            )
            staff_list.append(asdict(inactive))
            staff_id += 1

    return staff_list, staff_id


def main():
    # Load branches
    with open("data/generated/branches.json", "r") as f:
        branches = json.load(f)

    all_staff = []
    staff_id = 1

    # Generate staff for each branch
    for branch in branches:
        branch_staff, staff_id = generate_staff_for_branch(branch, staff_id)
        all_staff.extend(branch_staff)

    # Save staff
    output_path = "data/generated/staff.json"
    with open(output_path, "w") as f:
        json.dump(all_staff, f, indent=2)

    print(f"Generated {len(all_staff)} staff members")
    print(f"Saved to {output_path}")

    # Update branches with manager emails (only for open branches)
    staff_by_branch = {}
    for s in all_staff:
        if s["role"] == "Manager":
            staff_by_branch[s["branch_id"]] = s["email"]

    for branch in branches:
        if branch.get("status") == "open":
            branch["manager_email"] = staff_by_branch.get(branch["id"], "")
        else:
            branch["manager_email"] = ""  # Closed branches have no active manager

    with open("data/generated/branches.json", "w") as f:
        json.dump(branches, f, indent=2)

    print("Updated branches with manager emails")

    # Summary
    from collections import Counter
    roles = Counter(s["role"] for s in all_staff if s["status"] == "active")
    print("\nActive staff by role:")
    for role, count in sorted(roles.items()):
        print(f"  {role}: {count}")

    inactive = sum(1 for s in all_staff if s["status"] == "inactive")
    print(f"\nInactive (former) staff: {inactive}")


if __name__ == "__main__":
    main()
