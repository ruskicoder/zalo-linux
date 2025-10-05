# Zalo Linux v0.0.1-rev.02 Release Notes

**Release Date**: 2025-10-06  
**Version**: 0.0.1-rev.02  
**Platform**: Linux (Fedora/KDE Plasma tested)  
**Based on**: Zalo macOS port

---

## ✨ Features

### Working Features ✅
- ✅ Real-time messaging
- ✅ Native system tray integration (KDE Plasma)
- ✅ Window controls and frame handling
- ✅ Wayland support
- ✅ Dark theme (ZaDark version)

### Known Limitations ⚠️
- ❌ **Message sync from mobile to desktop not functional**
  - Cannot sync message history from mobile
  - Cannot receive messages sent to mobile while desktop was closed
 
**Issue**: Messages sent to mobile while desktop is closed won't sync to desktop.

**Cause**: Sync controller initialization chain is broken in the Linux port.

**Workaround**: There is no workaround and the problem will never be fixed. For now.

**Status**: Documented as known limitation. Cannot be fixed without major architectural changes or official Zalo Linux support.

### Other Issues
- Report issues at: [GitHub Issues](https://github.com/your-repo/zalo-linux/issues)

---

## INSTALLATION

### Prerequisites

```bash
# Install Node.js and npm
sudo dnf install nodejs npm

# Install Electron dependencies
sudo dnf install libXScrnSaver gtk3 nss alsa-lib
```

### Installation

```bash
# From source-code directory
cd source-code

# Install
sudo ./install.sh

# You can install 2 variants: Zalo and ZaDark
```


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

## 📝 Changelog

### v0.0.1-rev.02 (2025-10-06)

#### Added
- ✅ Native KDE Plasma system tray integration
- ✅ Simplified tray menu (Open/Exit)
- ✅ Wayland window controls fix
- ✅ Improved window frame handling
- ✅ Dark theme version (ZaDark)

#### Fixed
- ✅ Window controls on Wayland
- ✅ System tray icon display

#### Known Limitations
- ⚠️ Message sync from mobile not functional (documented)

---

## 🔐 Security Notes

This is an unofficial Linux port of Zalo messenger. Use at your own risk.

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

---

**Enjoy Zalo on Linux! 🐧**
