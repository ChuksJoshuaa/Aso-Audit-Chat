#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

cd "$PROJECT_DIR"

echo "Stopping containers..."
docker compose down --volumes --remove-orphans 2>/dev/null || true

echo "Removing project images..."
docker images --filter "reference=aso-audit-chat*" -q | xargs -r docker rmi -f 2>/dev/null || true

echo "Removing dangling images..."
docker image prune -f

echo "Removing build cache..."
docker builder prune -f

echo ""
echo "Docker cleanup complete"
echo "To rebuild from scratch, run: ./scripts/docker-run.sh"
