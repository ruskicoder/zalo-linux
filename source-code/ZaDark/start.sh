#!/bin/bash

# Zalo Linux (ZaDark) Startup Script
# This script starts the ZaDark application with the Python tray

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check if running from source-code directory or installed location
if [ -f "$SCRIPT_DIR/main.py" ]; then
    # Running from installed location (~/.local/share/Zalo/)
    if command_exists python ; then
        python "$SCRIPT_DIR/main.py"
    else
        python3 "$SCRIPT_DIR/main.py"
    fi
elif [ -f "$SCRIPT_DIR/Zalo/app/bootstrap.js" ]; then
    # Running from source-code/ZaDark/ directory
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
    fi
    
    # Start Electron directly
    ./electron-v22.3.27-linux-x64/electron app --enable-features=UseOzonePlatform --ozone-platform=wayland
else
    echo "Error: Cannot find ZaDark application files."
    echo "Please run this script from either:"
    echo "  - source-code/ZaDark/ directory"
    echo "  - ~/.local/share/Zalo/ (after installation)"
    exit 1
fi
