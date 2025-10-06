#!/bin/bash

# Quick reinstall script for testing
echo "Uninstalling current Zalo..."
~/.local/share/Zalo/uninstall.sh 2>/dev/null || true

echo ""
echo "Installing patched Zalo (ZaDark variant)..."
cd source-code
bash install.sh << EOF
1
2
EOF

echo ""
echo "Installation complete! You can now launch Zalo and check the console."
echo "Remember to open DevTools: Window → Toggle DevTools (or Ctrl+Shift+I)"
