# Zalo Linux v0.0.1-rev.02 Release Notes

**Release Date**: 2025-10-06  
**Version**: 0.0.1-rev.02  
**Platform**: Linux (Fedora/KDE Plasma tested)  
**Based on**: Zalo macOS port

---

## 📦 Release Packages

### 1. Zalo Linux (Standard)
- **File**: `zalo-linux-v0.0.1-rev.02.tar.gz`
- **Size**: ~66 MB
- **Description**: Standard Zalo messenger for Linux

### 2. ZaDark Linux (Dark Theme)
- **File**: `zadark-linux-v0.0.1-rev.02.tar.gz`
- **Size**: ~64 MB
- **Description**: Zalo messenger with dark theme for Linux

---

## ✨ Features

### Working Features ✅
- ✅ Real-time messaging
- ✅ Send/receive messages
- ✅ File sharing
- ✅ Voice/video calls
- ✅ Group chats
- ✅ Native system tray integration (KDE Plasma)
- ✅ Desktop notifications
- ✅ Window controls and frame handling
- ✅ Wayland support
- ✅ Dark theme (ZaDark version)

### Known Limitations ⚠️
- ❌ **Message sync from mobile to desktop not functional**
  - Cannot sync message history from mobile
  - Cannot receive messages sent to mobile while desktop was closed
  - **Workaround**: Keep desktop app open or use mobile app for history

---

## 🚀 Installation

### Extract Package
```bash
# For standard version
tar -xzf zalo-linux-v0.0.1-rev.02.tar.gz

# For dark theme version
tar -xzf zadark-linux-v0.0.1-rev.02.tar.gz
```

### Run Application
```bash
# Navigate to extracted directory
cd Zalo

# Run Zalo
./Zalo
```

### Optional: Create Desktop Entry
```bash
# Copy to applications directory
sudo cp Zalo.desktop /usr/share/applications/

# Update desktop database
sudo update-desktop-database
```

---

## 📋 System Requirements

### Minimum Requirements
- **OS**: Linux (Fedora 40+ tested, should work on other distros)
- **Desktop**: KDE Plasma (recommended), GNOME, or other DE
- **Display Server**: X11 or Wayland
- **RAM**: 2 GB minimum, 4 GB recommended
- **Disk Space**: 500 MB

### Dependencies
Most dependencies are bundled. If you encounter issues, install:
```bash
# Fedora/RHEL
sudo dnf install libXScrnSaver libappindicator-gtk3

# Ubuntu/Debian
sudo apt install libxss1 libappindicator3-1

# Arch
sudo pacman -S libxss libappindicator-gtk3
```

---

## 🔧 Configuration

### Application Location
- Standard: `~/.config/Zalo/`
- ZaDark: `~/.config/ZaDark/`

### Logs Location
- Application logs: `~/.config/Zalo/logs/`
- Console output: Run from terminal to see

### Cache Location
- Cache files: `~/.cache/Zalo/`

---

## 🐛 Known Issues

### Message Sync Not Working
**Issue**: Messages sent to mobile while desktop is closed won't sync to desktop.

**Cause**: Sync controller initialization chain is broken in the Linux port.

**Impact**: 
- Cannot sync message history from mobile
- Must keep desktop app open for real-time messages

**Workarounds**:
1. Keep desktop app open for real-time messaging
2. Use mobile app to access message history
3. Consider using Zalo web version

**Status**: Documented as known limitation. Cannot be fixed without major architectural changes or official Zalo Linux support.

### Other Issues
- Report issues at: [GitHub Issues](https://github.com/your-repo/zalo-linux/issues)

---

## 📝 Changelog

### v0.0.1-rev.02 (2025-10-06)

#### Added
- ✅ Native KDE Plasma system tray integration
- ✅ Simplified tray menu (Open/Exit)
- ✅ Wayland window controls fix
- ✅ Improved window frame handling
- ✅ Desktop notifications support
- ✅ Dark theme version (ZaDark)

#### Fixed
- ✅ Application path detection for both English/Vietnamese versions
- ✅ Window controls on Wayland
- ✅ System tray icon display

#### Known Limitations
- ⚠️ Message sync from mobile not functional (documented)

#### Removed
- ❌ Electron binaries (too large for GitHub)
- ❌ Outdated documentation files

---

## 🔐 Security Notes

This is an unofficial Linux port of Zalo messenger. Use at your own risk.

**Recommendations**:
- Keep the application updated
- Use strong passwords
- Enable two-factor authentication in Zalo settings
- Don't share sensitive information

---

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Submit a pull request

---

## 📄 License

This is an unofficial port. Original Zalo application is property of VNG Corporation.

---

## 🙏 Credits

- Original Zalo application: VNG Corporation
- ZaDark theme: ZaDark project
- Linux port: Community contributors

---

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/your-repo/zalo-linux/issues)
- **Documentation**: See README.md
- **Known Limitations**: See KNOWN-ISSUES.md

---

**Enjoy Zalo on Linux! 🐧**
