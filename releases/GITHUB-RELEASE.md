# Zalo Linux v0.0.1-rev.02

**Unofficial Linux port of Zalo messenger for Fedora/KDE Plasma**

## 📦 Downloads

Choose one of the following packages:

- **Zalo Linux (Standard)**: `zalo-linux-v0.0.1-rev.02.tar.gz` (~66 MB)
- **ZaDark Linux (Dark Theme)**: `zadark-linux-v0.0.1-rev.02.tar.gz` (~64 MB)

## ✨ Features

- ✅ Real-time messaging
- ✅ Send/receive messages and files
- ✅ Voice/video calls
- ✅ Group chats
- ✅ Native KDE Plasma system tray integration
- ✅ Desktop notifications
- ✅ Wayland support
- ✅ Dark theme (ZaDark version)

## ⚠️ Known Limitations

**Message sync from mobile to desktop is not functional** in this release.

**Workarounds**:
- Keep desktop app open for real-time messages
- Use mobile app for message history

## 🚀 Quick Start

### 1. Download
Download one of the packages above.

### 2. Verify (Optional)
```bash
sha256sum -c SHA256SUMS
```

### 3. Extract
```bash
# Standard version
tar -xzf zalo-linux-v0.0.1-rev.02.tar.gz

# Dark theme version
tar -xzf zadark-linux-v0.0.1-rev.02.tar.gz
```

### 4. Run
```bash
cd Zalo
./Zalo
```

## 📋 System Requirements

- **OS**: Linux (Fedora 40+ tested)
- **Desktop**: KDE Plasma (recommended), GNOME, or other DE
- **Display**: X11 or Wayland
- **RAM**: 2 GB minimum, 4 GB recommended
- **Disk**: 500 MB

## 🔐 Security Note

This is an **unofficial** Linux port. Use at your own risk.

## 📄 Checksums (SHA256)

```
74e5061de85f92471b758ac6d6770398347e335cddb76c9e18f1d38496f3f0bc  zadark-linux-v0.0.1-rev.02.tar.gz
2e33634f9a4319df5c0b9384462db9e83f77e73f38771d8438365430aebaeace  zalo-linux-v0.0.1-rev.02.tar.gz
```

## 📝 Changelog

### Added
- Native KDE Plasma system tray integration
- Simplified tray menu (Open/Exit)
- Wayland window controls fix
- Improved window frame handling
- Desktop notifications support
- Dark theme version (ZaDark)

### Fixed
- Application path detection for both English/Vietnamese versions
- Window controls on Wayland
- System tray icon display

### Known Issues
- Message sync from mobile not functional (documented limitation)

## 🙏 Credits

- Original Zalo: VNG Corporation
- ZaDark theme: ZaDark project
- Linux port: Community contributors

---

For complete documentation, see [RELEASE-NOTES-v0.0.1-rev.02.md](RELEASE-NOTES-v0.0.1-rev.02.md)
