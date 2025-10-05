#!/bin/bash

# Development start script for Zalo (runs from source-code directory)
# This script runs Zalo directly from the source tree without installation

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
APP_DIR="$SCRIPT_DIR/Zalo/app"

# Check if Electron is available
if [ ! -d "$SCRIPT_DIR/electron-v22.3.27-linux-x64" ]; then
    echo "❌ Error: Electron not found!"
    echo ""
    echo "Please download Electron first:"
    echo "  cd $SCRIPT_DIR"
    echo "  wget https://github.com/electron/electron/releases/download/v22.3.27/electron-v22.3.27-linux-x64.zip"
    echo "  unzip electron-v22.3.27-linux-x64.zip -d electron-v22.3.27-linux-x64"
    echo "  rm electron-v22.3.27-linux-x64.zip"
    echo ""
    exit 1
fi

# Set environment variables
export ELECTRON_DISABLE_SECURITY_WARNINGS=true

# Run Electron with the app directory
"$SCRIPT_DIR/electron-v22.3.27-linux-x64/electron" "$APP_DIR" "$@"
