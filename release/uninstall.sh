#!/bin/bash

# Zalo Linux Uninstaller
# Version: v24.9.1-wayland-fix
# Date: 2025-10-05

echo "=========================================="
echo "Zalo Linux Uninstaller"
echo "=========================================="
echo ""

# Check language preference
if [ -f ~/.local/share/Zalo/lang.txt ]; then
    LANGUAGE=$(cat ~/.local/share/Zalo/lang.txt)
else
    LANGUAGE="EN"
fi

# Confirmation
if [ "$LANGUAGE" == "EN" ]; then
    echo "This will remove Zalo from your system."
    echo ""
    read -p "Are you sure you want to uninstall Zalo? (y/n): " confirm
else
    echo "Điều này sẽ xóa Zalo khỏi hệ thống của bạn."
    echo ""
    read -p "Bạn có chắc chắn muốn gỡ cài đặt Zalo không? (y/n): " confirm
fi

if [ "$confirm" != "y" ] && [ "$confirm" != "Y" ]; then
    if [ "$LANGUAGE" == "EN" ]; then
        echo "Uninstallation cancelled."
    else
        echo "Đã hủy gỡ cài đặt."
    fi
    exit 0
fi

echo ""
if [ "$LANGUAGE" == "EN" ]; then
    echo "Uninstalling Zalo..."
else
    echo "Đang gỡ cài đặt Zalo..."
fi

# Remove application directory
if [ "$LANGUAGE" == "EN" ]; then
    echo "Removing application files..."
else
    echo "Đang xóa các tệp ứng dụng..."
fi
rm -rf ~/.local/share/Zalo

# Remove desktop entries
if [ "$LANGUAGE" == "EN" ]; then
    echo "Removing desktop entries..."
else
    echo "Đang xóa các mục desktop..."
fi
rm -f ~/.local/share/applications/Zalo.desktop
rm -f ~/.local/share/applications/"Update Zalo.desktop"
rm -f ~/.local/share/applications/"Cập Nhật Zalo.desktop"
rm -f ~/Desktop/Zalo.desktop

# Remove config directory (optional)
if [ -d ~/.config/Zalo ]; then
    if [ "$LANGUAGE" == "EN" ]; then
        read -p "Remove user data and settings? (y/n): " remove_data
    else
        read -p "Xóa dữ liệu người dùng và cài đặt? (y/n): " remove_data
    fi
    
    if [ "$remove_data" == "y" ] || [ "$remove_data" == "Y" ]; then
        if [ "$LANGUAGE" == "EN" ]; then
            echo "Removing user data..."
        else
            echo "Đang xóa dữ liệu người dùng..."
        fi
        rm -rf ~/.config/Zalo
    fi
fi

echo ""
echo "=========================================="
if [ "$LANGUAGE" == "EN" ]; then
    echo "✅ Uninstallation complete!"
    echo ""
    echo "Zalo has been removed from your system."
    echo ""
    echo "Note: Python dependencies (pystray, pillow) were not removed."
    echo "If you want to remove them, run:"
    echo "  Fedora: sudo dnf remove python3-pystray python3-pillow"
    echo "  Ubuntu/Debian: sudo apt remove python3-pystray python3-pil"
else
    echo "✅ Gỡ cài đặt hoàn tất!"
    echo ""
    echo "Zalo đã được xóa khỏi hệ thống của bạn."
    echo ""
    echo "Lưu ý: Các phụ thuộc Python (pystray, pillow) không được xóa."
    echo "Nếu bạn muốn xóa chúng, chạy:"
    echo "  Fedora: sudo dnf remove python3-pystray python3-pillow"
    echo "  Ubuntu/Debian: sudo apt remove python3-pystray python3-pil"
fi
echo "=========================================="
