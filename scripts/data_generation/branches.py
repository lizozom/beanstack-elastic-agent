"""
Generate branch data for BeanStack coffee chain.
~100-120 branches across major US cities.
"""

import json
import random
from collections import Counter
from dataclasses import dataclass, asdict
from datetime import datetime, timedelta

from faker import Faker

fake = Faker()
Faker.seed(42)
random.seed(42)

# Major US cities with coordinates and region info
# Format: (city, state, lat, lon, region, branch_count)
CITIES = [
    # Northeast
    ("New York", "NY", 40.7128, -74.0060, "Northeast", 12),
    ("Boston", "MA", 42.3601, -71.0589, "Northeast", 5),
    ("Philadelphia", "PA", 39.9526, -75.1652, "Northeast", 4),
    ("Washington", "DC", 38.9072, -77.0369, "Northeast", 5),

    # Southeast
    ("Miami", "FL", 25.7617, -80.1918, "Southeast", 6),
    ("Atlanta", "GA", 33.7490, -84.3880, "Southeast", 5),
    ("Orlando", "FL", 28.5383, -81.3792, "Southeast", 3),
    ("Charlotte", "NC", 35.2271, -80.8431, "Southeast", 3),

    # Midwest
    ("Chicago", "IL", 41.8781, -87.6298, "Midwest", 8),
    ("Detroit", "MI", 42.3314, -83.0458, "Midwest", 3),
    ("Minneapolis", "MN", 44.9778, -93.2650, "Midwest", 3),
    ("Columbus", "OH", 39.9612, -82.9988, "Midwest", 2),

    # Southwest
    ("Austin", "TX", 30.2672, -97.7431, "Southwest", 5),
    ("Houston", "TX", 29.7604, -95.3698, "Southwest", 6),
    ("Dallas", "TX", 32.7767, -96.7970, "Southwest", 5),
    ("Phoenix", "AZ", 33.4484, -112.0740, "Southwest", 4),
    ("Denver", "CO", 39.7392, -104.9903, "Southwest", 4),

    # West Coast
    ("Los Angeles", "CA", 34.0522, -118.2437, "West", 10),
    ("San Francisco", "CA", 37.7749, -122.4194, "West", 6),
    ("Seattle", "WA", 47.6062, -122.3321, "West", 6),
    ("San Diego", "CA", 32.7157, -117.1611, "West", 4),
    ("Portland", "OR", 45.5152, -122.6784, "West", 3),
]

# Neighborhood/location types for branch names
LOCATION_TYPES = [
    "Downtown", "Midtown", "Uptown", "Financial District", "Arts District",
    "University", "Airport", "Mall", "Station", "Harbor", "Park",
    "Main Street", "Market Street", "Broadway", "Central", "Waterfront"
]

STREET_SUFFIXES = ["St", "Ave", "Blvd", "Dr", "Rd", "Way", "Pl"]

SIZES = ["small", "medium", "large"]
SIZE_WEIGHTS = [0.3, 0.5, 0.2]  # Distribution


@dataclass
class Branch:
    id: str
    name: str
    address: str
    city: str
    state: str
    zip: str
    region: str
    location: dict  # {"lat": float, "lon": float}
    size: str
    opened_date: str
    closed_date: str  # Empty if still open
    status: str  # "open" or "closed"
    manager_email: str  # Will be filled in by staff generator


def generate_branch_address(city: str, state: str) -> tuple[str, str]:
    """Generate a realistic street address and zip code."""
    street_num = random.randint(1, 9999)
    street_name = fake.street_name()
    address = f"{street_num} {street_name}"

    # Generate plausible zip code (fake but formatted correctly)
    zip_code = fake.zipcode()

    return address, zip_code


def jitter_coordinates(lat: float, lon: float, radius_km: float = 15) -> tuple[float, float]:
    """Add random offset to coordinates to spread branches across city."""
    # Rough conversion: 1 degree ~ 111 km
    lat_offset = random.uniform(-radius_km, radius_km) / 111
    lon_offset = random.uniform(-radius_km, radius_km) / 111
    return round(lat + lat_offset, 6), round(lon + lon_offset, 6)


def generate_branch_name(city: str, state: str, index: int, total_in_city: int) -> str:
    """Generate a unique branch name."""
    if total_in_city == 1:
        return f"BeanStack {city}"

    # Use location type for variety
    location = random.choice(LOCATION_TYPES)

    # Some branches use street names
    if random.random() < 0.3:
        street = fake.street_name().split()[0]  # Just the name part
        return f"BeanStack {street} {city}"

    return f"BeanStack {location} {city}"


def generate_opened_date() -> str:
    """Generate a plausible opening date (2015-2024)."""
    year = random.randint(2015, 2024)
    month = random.randint(1, 12)
    day = random.randint(1, 28)
    return f"{year}-{month:02d}-{day:02d}"


def generate_closed_date(opened_date: str) -> str:
    """Generate a closed date after the opened date but before Jan 2026."""
    opened = datetime.strptime(opened_date, "%Y-%m-%d")
    # Closed at least 6 months after opening, but before Jan 2026
    min_close = opened + timedelta(days=180)
    max_close = datetime(2026, 1, 15)
    if min_close >= max_close:
        min_close = opened + timedelta(days=30)
    days_range = (max_close - min_close).days
    if days_range <= 0:
        return "2025-12-01"
    close_date = min_close + timedelta(days=random.randint(0, days_range))
    return close_date.strftime("%Y-%m-%d")


def generate_branches() -> list[dict]:
    """Generate all branches."""
    branches = []
    branch_id = 1

    for city, state, base_lat, base_lon, region, count in CITIES:
        # Track used names to avoid duplicates within a city
        used_names = set()

        for i in range(count):
            # Generate unique name
            attempts = 0
            while attempts < 20:
                name = generate_branch_name(city, state, i, count)
                if name not in used_names:
                    used_names.add(name)
                    break
                attempts += 1
            else:
                # Fallback with number
                name = f"BeanStack {city} #{i+1}"

            lat, lon = jitter_coordinates(base_lat, base_lon)
            address, zip_code = generate_branch_address(city, state)
            size = random.choices(SIZES, SIZE_WEIGHTS)[0]
            opened_date = generate_opened_date()

            # 5% of branches are closed
            is_closed = random.random() < 0.05
            status = "closed" if is_closed else "open"
            closed_date = generate_closed_date(opened_date) if is_closed else ""

            branch = Branch(
                id=f"branch-{branch_id:03d}",
                name=name,
                address=address,
                city=city,
                state=state,
                zip=zip_code,
                region=region,
                location={"lat": lat, "lon": lon},
                size=size,
                opened_date=opened_date,
                closed_date=closed_date,
                status=status,
                manager_email=""  # Filled by staff generator
            )

            branches.append(asdict(branch))
            branch_id += 1

    return branches


def main():
    branches = generate_branches()

    output_path = "data/generated/branches.json"
    with open(output_path, "w") as f:
        json.dump(branches, f, indent=2)

    print(f"Generated {len(branches)} branches")
    print(f"Saved to {output_path}")

    # Summary by region
    regions = Counter(b["region"] for b in branches)
    print("\nBy region:")
    for region, count in sorted(regions.items()):
        print(f"  {region}: {count}")

    # Summary by status
    statuses = Counter(b["status"] for b in branches)
    print("\nBy status:")
    for status, count in sorted(statuses.items()):
        print(f"  {status}: {count}")


if __name__ == "__main__":
    main()
