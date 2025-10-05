#!/bin/bash

# Zalo Linux Installer (Wayland Fixed Version)
# Version: v24.9.1-wayland-fix
# Date: 2025-10-05

set -e

echo "=========================================="
echo "Zalo Linux Installer"
echo "Version: v24.9.1 (Wayland Fixed)"
echo "=========================================="
echo ""

# Check if running on Linux
if [ "$(uname)" != "Linux" ]; then
    echo "❌ Error: This installer is for Linux only."
    exit 1
fi

# Language selection
echo "Select language / Chọn ngôn ngữ:"
echo "1) English"
echo "2) Tiếng Việt"
read -p "Enter your choice (1 or 2): " lang_choice

case $lang_choice in
    1)
        LANGUAGE="EN"
        ;;
    2)
        LANGUAGE="VI"
        ;;
    *)
        echo "Invalid choice. Defaulting to English."
        LANGUAGE="EN"
        ;;
esac

# Version selection
echo ""
if [ "$LANGUAGE" == "EN" ]; then
    echo "Select the version of Zalo to install:"
    echo "1) Zalo (Standard)"
    echo "2) Zalo-ZaDark (Dark Theme)"
    read -p "Enter your choice (1 or 2): " version_choice
else
    echo "Chọn phiên bản Zalo để cài đặt:"
    echo "1) Zalo (Tiêu chuẩn)"
    echo "2) Zalo-ZaDark (Giao diện tối)"
    read -p "Nhập lựa chọn của bạn (1 hoặc 2): " version_choice
fi

case $version_choice in
    1)
        ZALO_VERSION="Zalo"
        ;;
    2)
        ZALO_VERSION="ZaloZaDark"
        ;;
    *)
        if [ "$LANGUAGE" == "EN" ]; then
            echo "Invalid choice. Defaulting to Zalo (Standard)."
        else
            echo "Lựa chọn không hợp lệ. Mặc định là Zalo (Tiêu chuẩn)."
        fi
        ZALO_VERSION="Zalo"
        ;;
esac

echo ""
if [ "$LANGUAGE" == "EN" ]; then
    echo "Installing $ZALO_VERSION..."
    echo ""
    echo "This version includes:"
    echo "  ✅ Wayland window controls fix"
    echo "  ✅ Native window frame for Linux"
    echo "  ✅ Full KDE Plasma support"
    echo ""
else
    echo "Đang cài đặt $ZALO_VERSION..."
    echo ""
    echo "Phiên bản này bao gồm:"
    echo "  ✅ Sửa lỗi điều khiển cửa sổ Wayland"
    echo "  ✅ Khung cửa sổ gốc cho Linux"
    echo "  ✅ Hỗ trợ đầy đủ KDE Plasma"
    echo ""
fi

# Detect distribution
if [ -f /etc/os-release ]; then
    source /etc/os-release
    DISTRO_ID="$ID"
else
    DISTRO_ID="unknown"
fi

# Install Python dependencies
if [ "$LANGUAGE" == "EN" ]; then
    echo "Installing Python dependencies..."
else
    echo "Đang cài đặt các phụ thuộc Python..."
fi

if [ "$DISTRO_ID" == "fedora" ]; then
    sudo dnf install -y python3-pystray python3-pillow python3-pip wget unzip
elif [ "$DISTRO_ID" == "ubuntu" ] || [ "$DISTRO_ID" == "debian" ]; then
    sudo apt-get update
    sudo apt-get install -y python3-pystray python3-pil python3-pip wget unzip
else
    # Fallback to pip
    if command -v pip3 >/dev/null 2>&1; then
        pip3 install pystray pillow --break-system-packages
    else
        pip install pystray pillow --break-system-packages
    fi
fi

# Clean up old installation
if [ "$LANGUAGE" == "EN" ]; then
    echo ""
    echo "Cleaning up old installation..."
else
    echo ""
    echo "Đang dọn dẹp cài đặt cũ..."
fi

rm -rf ~/.local/share/Zalo
rm -rf ~/.local/share/applications/Zalo.desktop
rm -rf ~/.local/share/applications/"Update Zalo.desktop"
rm -rf ~/.local/share/applications/"Cập Nhật Zalo.desktop"
rm -rf ~/Desktop/Zalo.desktop
rm -rf /tmp/zalo-installer

# Create directories
mkdir -p ~/.local/share/
mkdir -p ~/.local/share/applications
mkdir -p /tmp/zalo-installer

# Copy files to temp directory
if [ "$LANGUAGE" == "EN" ]; then
    echo ""
    echo "Copying application files..."
else
    echo ""
    echo "Đang sao chép các tệp ứng dụng..."
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

cp -r "$SCRIPT_DIR/en" /tmp/zalo-installer/
cp -r "$SCRIPT_DIR/vn" /tmp/zalo-installer/
cp -r "$SCRIPT_DIR/prepare" /tmp/zalo-installer/
cp -r "$SCRIPT_DIR/$ZALO_VERSION" /tmp/zalo-installer/
cp -r "$SCRIPT_DIR/version.txt" /tmp/zalo-installer/
cp -r "$SCRIPT_DIR/update.sh" /tmp/zalo-installer/

# Download Electron
if [ "$LANGUAGE" == "EN" ]; then
    echo ""
    echo "Downloading Electron v22.3.27..."
else
    echo ""
    echo "Đang tải xuống Electron v22.3.27..."
fi

cd /tmp/zalo-installer/$ZALO_VERSION
wget -q --show-progress https://github.com/electron/electron/releases/download/v22.3.27/electron-v22.3.27-linux-x64.zip

if [ "$LANGUAGE" == "EN" ]; then
    echo "Extracting Electron..."
else
    echo "Đang giải nén Electron..."
fi

unzip -q electron-v22.3.27-linux-x64.zip -d electron-v22.3.27-linux-x64
rm electron-v22.3.27-linux-x64.zip

cd - > /dev/null

# Install to user directory
if [ "$LANGUAGE" == "EN" ]; then
    echo ""
    echo "Installing to ~/.local/share/Zalo..."
else
    echo ""
    echo "Đang cài đặt vào ~/.local/share/Zalo..."
fi

cp -r /tmp/zalo-installer/$ZALO_VERSION ~/.local/share/Zalo

# Copy Python tray script and start script
if [ "$LANGUAGE" == "EN" ]; then
    cp /tmp/zalo-installer/en/main.py ~/.local/share/Zalo/
else
    cp /tmp/zalo-installer/vn/main.py ~/.local/share/Zalo/
fi

# Copy start.sh from the selected version
cp "$SCRIPT_DIR/$ZALO_VERSION/start.sh" ~/.local/share/Zalo/
chmod +x ~/.local/share/Zalo/start.sh

# Create desktop entries
if [ "$LANGUAGE" == "EN" ]; then
    echo "Creating desktop entries..."
else
    echo "Đang tạo các mục desktop..."
fi

sed -i "s|\$HOME|$HOME|g" "/tmp/zalo-installer/prepare/Zalo.desktop"

if [ "$LANGUAGE" == "EN" ]; then
    sed -i "s|\$HOME|$HOME|g" "/tmp/zalo-installer/prepare/Update Zalo.desktop"
    cp "/tmp/zalo-installer/prepare/Update Zalo.desktop" ~/.local/share/applications/
else
    sed -i "s|\$HOME|$HOME|g" "/tmp/zalo-installer/prepare/Cập Nhật Zalo.desktop"
    cp "/tmp/zalo-installer/prepare/Cập Nhật Zalo.desktop" ~/.local/share/applications/
fi

cp /tmp/zalo-installer/prepare/Zalo.desktop ~/.local/share/applications/
cp /tmp/zalo-installer/prepare/Zalo.desktop ~/Desktop/
chmod +x ~/Desktop/Zalo.desktop

# Copy update script and version
cp /tmp/zalo-installer/update.sh ~/.local/share/Zalo/
cp /tmp/zalo-installer/version.txt ~/.local/share/Zalo/
echo $LANGUAGE > ~/.local/share/Zalo/lang.txt

# Copy uninstall script
cp "$SCRIPT_DIR/uninstall.sh" ~/.local/share/Zalo/

# Set chrome-sandbox permissions
if [ "$LANGUAGE" == "EN" ]; then
    echo ""
    echo "Setting chrome-sandbox permissions (requires sudo)..."
else
    echo ""
    echo "Đang thiết lập quyền chrome-sandbox (yêu cầu sudo)..."
fi

sudo chown root ~/.local/share/Zalo/electron-v22.3.27-linux-x64/chrome-sandbox
sudo chmod 4755 ~/.local/share/Zalo/electron-v22.3.27-linux-x64/chrome-sandbox

# Clean up
rm -rf /tmp/zalo-installer

# Success message
echo ""
echo "=========================================="
if [ "$LANGUAGE" == "EN" ]; then
    echo "✅ Installation complete!"
    echo ""
    echo "Zalo v24.9.1 (Wayland Fixed) has been installed."
    echo ""
    echo "Features:"
    echo "  ✅ Native window frame for Wayland/X11"
    echo "  ✅ Working window controls (minimize, maximize, close)"
    echo "  ✅ Draggable titlebar"
    echo "  ✅ Resizable window"
    echo ""
    echo "You can now:"
    echo "  1. Launch Zalo from the application menu"
    echo "  2. Launch from desktop icon"
    echo "  3. Run: ~/.local/share/Zalo/start.sh"
    echo ""
    echo "To uninstall:"
    echo "  Run: ~/.local/share/Zalo/uninstall.sh"
else
    echo "✅ Cài đặt hoàn tất!"
    echo ""
    echo "Zalo v24.9.1 (Đã sửa Wayland) đã được cài đặt."
    echo ""
    echo "Tính năng:"
    echo "  ✅ Khung cửa sổ gốc cho Wayland/X11"
    echo "  ✅ Các nút điều khiển cửa sổ hoạt động"
    echo "  ✅ Thanh tiêu đề có thể kéo"
    echo "  ✅ Cửa sổ có thể thay đổi kích thước"
    echo ""
    echo "Bạn có thể:"
    echo "  1. Khởi chạy Zalo từ menu ứng dụng"
    echo "  2. Khởi chạy từ biểu tượng desktop"
    echo "  3. Chạy: ~/.local/share/Zalo/start.sh"
    echo ""
    echo "Để gỡ cài đặt:"
    echo "  Chạy: ~/.local/share/Zalo/uninstall.sh"
fi
echo "=========================================="
