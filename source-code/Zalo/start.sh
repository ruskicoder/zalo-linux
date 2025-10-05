#!/bin/bash

# Zalo Linux Startup Script
# This script starts the Zalo application with native Electron tray

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Check if running from source-code directory or installed location
if [ -f "$SCRIPT_DIR/Zalo/app/bootstrap.js" ]; then
    # Running from source-code/Zalo/ directory
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
    
    # Start Electron directly with native tray (no Python dependency)
    echo "Starting Zalo with native Electron tray..."
    ./electron-v22.3.27-linux-x64/electron app --enable-features=UseOzonePlatform --ozone-platform=wayland
elif [ -f "$SCRIPT_DIR/app/bootstrap.js" ]; then
    # Running from installed location (~/.local/share/Zalo/)
    # The installation copies the Zalo subdirectory contents directly
    
    # Change to the script directory so Electron can find the app
    cd "$SCRIPT_DIR"
    
    # Start Electron directly with native tray
    echo "Starting Zalo with native Electron tray..."
    
    # Detect session type
    if [ "$XDG_SESSION_TYPE" = "wayland" ]; then
        echo "Detected Wayland session"
        ./electron-v22.3.27-linux-x64/electron app --enable-features=UseOzonePlatform --ozone-platform=wayland
    else
        echo "Detected X11 session"
        ./electron-v22.3.27-linux-x64/electron app
    fi
else
    echo "Error: Cannot find Zalo application files."
    echo "Please run this script from either:"
    echo "  - source-code/Zalo/ directory"
    echo "  - ~/.local/share/Zalo/ (after installation)"
    exit 1
fi
