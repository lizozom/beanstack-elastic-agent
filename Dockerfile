FROM python:3.11-slim

COPY --from=ghcr.io/astral-sh/uv:latest /uv /bin/uv

WORKDIR /app

# Install dependencies first (cached layer)
COPY pyproject.toml uv.lock ./
RUN uv sync --frozen --no-dev

# Copy bot code
COPY slack_bot/ slack_bot/

CMD ["uv", "run", "python", "slack_bot/bot.py"]
