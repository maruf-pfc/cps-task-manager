#!/bin/bash

PROJECT_ROOT="/home/maruf/Documents/development/cps-task-manager"
SERVER_DIR="$PROJECT_ROOT/server"
CLIENT_DIR="$PROJECT_ROOT/client"

# Colors using tput
GREEN=$(tput setaf 2)
CYAN=$(tput setaf 6)
RESET=$(tput sgr0)

prefix_output() {
  local label=$1
  local color=$2
  sed "s/^/${color}[${label}] ${RESET}/"
}

# Start Server
echo "${GREEN}🚀 Starting Server...${RESET}"
(
  cd "$SERVER_DIR" || exit
  pnpm install
  pnpm dev 2>&1 | prefix_output "SERVER" "$GREEN"
) &

# Start Client
echo "${CYAN}🚀 Starting Client...${RESET}"
(
  cd "$CLIENT_DIR" || exit
  pnpm install
  pnpm dev 2>&1 | prefix_output "CLIENT" "$CYAN"
) &

wait
