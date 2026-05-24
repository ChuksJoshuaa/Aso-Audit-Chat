#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

cd "$PROJECT_DIR"

if [ ! -f .env ]; then
    echo "Error: .env file not found"
    echo "Please create a .env file with OPENAI_API_KEY and FIRECRAWL_API_KEY"
    exit 1
fi

export $(grep -v '^#' .env | xargs)

echo "Building and starting Docker containers..."
docker compose up --build -d

echo ""
echo "Waiting for application to be ready..."
sleep 5

if curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 | grep -q "200"; then
    echo "Application is running at http://localhost:3000"
else
    echo "Application is starting... Check logs with: docker compose logs -f"
fi

echo ""
echo "Commands:"
echo "  View logs:    docker compose logs -f"
echo "  Stop:         ./scripts/docker-stop.sh"
echo "  Clean:        ./scripts/docker-clean.sh"
