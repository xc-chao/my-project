#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
BACKEND_DIR="$PROJECT_ROOT/backend"
FRONTEND_DIR="$PROJECT_ROOT/frontend/miniprogram"
ACTION="${1:-start}"
MODE="${2:-h5}"

RED=$'\033[0;31m'
GREEN=$'\033[0;32m'
YELLOW=$'\033[1;33m'
NC=$'\033[0m'

BACKEND_PID=""
FRONTEND_PID=""

cleanup() {
  echo
  echo -e "${YELLOW}Stopping services...${NC}"

  if [[ -n "$BACKEND_PID" ]] && kill -0 "$BACKEND_PID" 2>/dev/null; then
    kill "$BACKEND_PID" 2>/dev/null || true
    echo -e "${GREEN}Backend stopped${NC}"
  fi

  if [[ -n "$FRONTEND_PID" ]] && kill -0 "$FRONTEND_PID" 2>/dev/null; then
    kill "$FRONTEND_PID" 2>/dev/null || true
    echo -e "${GREEN}Frontend stopped${NC}"
  fi
}

trap cleanup INT TERM EXIT

require_dir() {
  local dir="$1"
  local label="$2"
  if [[ ! -d "$dir" ]]; then
    echo -e "${RED}${label} directory not found: $dir${NC}"
    exit 1
  fi
}

check_command() {
  local cmd="$1"
  if ! command -v "$cmd" >/dev/null 2>&1; then
    echo -e "${RED}Missing required command: $cmd${NC}"
    exit 1
  fi
}

ensure_node_modules() {
  local dir="$1"
  local label="$2"
  if [[ ! -d "$dir/node_modules" ]]; then
    echo -e "${YELLOW}${label} dependencies missing, running npm install...${NC}"
    (cd "$dir" && npm install)
  fi
}

install_deps() {
  echo -e "${GREEN}[Backend] Installing dependencies...${NC}"
  (cd "$BACKEND_DIR" && npm install)

  echo -e "${GREEN}[Frontend] Installing dependencies...${NC}"
  (cd "$FRONTEND_DIR" && npm install)
}

check_backend_health() {
  if command -v curl >/dev/null 2>&1; then
    curl --silent --fail http://localhost:3001/health >/dev/null 2>&1
  else
    return 1
  fi
}

print_header() {
  echo "========================================"
  echo "      UniAppPencil Startup Script"
  echo "========================================"
  echo "Project root : $PROJECT_ROOT"
  echo "Action       : $ACTION"
  echo "Frontend mode: $MODE"
  echo
}

require_dir "$BACKEND_DIR" "Backend"
require_dir "$FRONTEND_DIR" "Frontend"
check_command npm
check_command node

print_header

case "$ACTION" in
  install)
    install_deps
    echo
    echo -e "${GREEN}Dependencies installed.${NC}"
    exit 0
    ;;
  start)
    ;;
  *)
    echo -e "${RED}Unsupported action: $ACTION${NC}"
    echo "Use one of: start, install"
    exit 1
    ;;
esac

echo -e "${YELLOW}[MySQL] This script does not start MySQL on Windows.${NC}"
echo -e "${YELLOW}[MySQL] Make sure your local MySQL service is already running.${NC}"
echo

ensure_node_modules "$BACKEND_DIR" "Backend"
ensure_node_modules "$FRONTEND_DIR" "Frontend"

if check_backend_health; then
  echo -e "${YELLOW}[Backend] Port 3001 is already serving health checks, skipping backend start.${NC}"
else
  echo -e "${GREEN}[Backend] Starting Express service...${NC}"
  (
    cd "$BACKEND_DIR"
    npm run dev
  ) &
  BACKEND_PID=$!

  sleep 3

  if check_backend_health; then
    echo -e "${GREEN}[Backend] Health check passed: http://localhost:3001/health${NC}"
  else
    echo -e "${YELLOW}[Backend] Started, but health check is not ready yet.${NC}"
  fi
fi

case "$MODE" in
  h5)
    FRONTEND_SCRIPT="dev:h5"
    ;;
  mp-weixin)
    FRONTEND_SCRIPT="dev:mp-weixin"
    ;;
  *)
    echo -e "${RED}Unsupported frontend mode: $MODE${NC}"
    echo "Use one of: h5, mp-weixin"
    exit 1
    ;;
esac

echo -e "${GREEN}[Frontend] Starting UniApp with npm run $FRONTEND_SCRIPT ...${NC}"
(
  cd "$FRONTEND_DIR"
  npm run "$FRONTEND_SCRIPT"
) &
FRONTEND_PID=$!

echo
echo -e "${GREEN}Services started.${NC}"
if [[ -n "$BACKEND_PID" ]]; then
  echo "Backend PID : $BACKEND_PID"
else
  echo "Backend PID : already running"
fi
echo "Frontend PID: $FRONTEND_PID"
echo "Backend URL : http://localhost:3001/health"
echo -e "${YELLOW}Press Ctrl+C to stop services started by this script.${NC}"
echo

wait
