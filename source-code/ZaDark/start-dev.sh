#!/bin/bash

# Zalo Linux Development Startup Script
# This script starts Zalo from the source-code directory for testing

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "=== ZaDark Linux Development Mode ==="
echo "Starting from: $SCRIPT_DIR"
echo ""

# Navigate to Zalo directory
cd "$SCRIPT_DIR/Zalo"

# Check if Electron is downloaded
if [ ! -d "electron-v22.3.27-linux-x64" ]; then
    echo "Electron not found. Downloading..."
    wget -q --show-progress https://github.com/electron/electron/releases/download/v22.3.27/electron-v22.3.27-linux-x64.zip
    echo "Extracting Electron..."
    unzip -q electron-v22.3.27-linux-x64.zip -d electron-v22.3.27-linux-x64
    rm electron-v22.3.27-linux-x64.zip
    
    # Set chrome-sandbox permissions
    echo "Setting chrome-sandbox permissions (requires sudo)..."
    sudo chown root electron-v22.3.27-linux-x64/chrome-sandbox
    sudo chmod 4755 electron-v22.3.27-linux-x64/chrome-sandbox
    echo ""
fi

# Detect session type
if [ "$XDG_SESSION_TYPE" = "wayland" ]; then
    echo "Detected Wayland session"
    echo "Starting ZaDark with Wayland support and native tray..."
    ./electron-v22.3.27-linux-x64/electron app --enable-features=UseOzonePlatform --ozone-platform=wayland
else
    echo "Detected X11 session"
    echo "Starting ZaDark with native tray..."
    ./electron-v22.3.27-linux-x64/electron app
fi
