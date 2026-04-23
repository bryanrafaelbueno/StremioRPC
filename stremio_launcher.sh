#!/bin/bash

# Abort script in case of undefined variables
set -u

# Discover the script's directory in a portable way, regardless of where it's called from
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)"

# Define Node scripts paths relative to the base directory
NODE_SCRIPT_1="$SCRIPT_DIR/index.js"
NODE_SCRIPT_2="$SCRIPT_DIR/Server/index.js"

# Validate if files exist before executing them to avoid obscure errors
if [ ! -f "$NODE_SCRIPT_1" ]; then
    echo "Error: File not found: $NODE_SCRIPT_1" >&2
    exit 1
fi

if [ ! -f "$NODE_SCRIPT_2" ]; then
    echo "Error: File not found: $NODE_SCRIPT_2" >&2
    exit 1
fi

# Dynamic discovery: Verify if Node.js is installed in the environment
if ! command -v node >/dev/null 2>&1; then
    echo "Error: 'node' command not found. Install Node.js or add it to PATH." >&2
    exit 1
fi

echo "Starting Node scripts..."

# Start background processes
node "$NODE_SCRIPT_1" &
PID1=$!
echo "Script 1 (DiscordRPC) PID = $PID1"

node "$NODE_SCRIPT_2" &
PID2=$!
echo "Script 2 (Server) PID = $PID2"

# Cleanup function to ensure child processes are not orphaned (zombies)
cleanup() {
    echo "Stremio finished or script interrupted, closing Node processes..."
    # Send terminate signal only if the process still exists, silently ignoring errors
    kill -TERM "$PID1" 2>/dev/null || true
    kill -TERM "$PID2" 2>/dev/null || true
    echo "All scripts terminated."
}

# Intercept termination signals to execute cleanup robustly and automatically
trap cleanup EXIT INT TERM

echo "Looking for Stremio executable in the system..."

# Array to store Stremio execution command safely
STREMIO_CMD=()

# Try to find Stremio native executable in PATH (e.g., Arch, deb package)
if command -v stremio >/dev/null 2>&1; then
    STREMIO_CMD=(stremio)
# Safe fallback: verify if Flatpak is available and if the specific app is installed there
elif command -v flatpak >/dev/null 2>&1 && flatpak info com.stremio.Stremio >/dev/null 2>&1; then
    STREMIO_CMD=(flatpak run com.stremio.Stremio)
else
    echo "Error: Stremio executable not found." >&2
    echo "Please install Stremio via native package or Flatpak." >&2
    exit 1
fi

echo "Starting Stremio via: ${STREMIO_CMD[*]}"

# Execute command in foreground (script will pause until Stremio is closed)
"${STREMIO_CMD[@]}"

# The 'EXIT' trap will be automatically triggered here (end of script) to clean up Node processes
